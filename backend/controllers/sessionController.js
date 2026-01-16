const { Session, User, Application, Request } = require('../models');
const { Op } = require('sequelize');

// Create a new session (professors only)
exports.createSession = async (req, res) => {
  try {
    const { title, startDate, endDate, maxStudents } = req.body;
    const professorId = req.session.user.id;

    // Validate required fields
    if (!title || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Title, start date, and end date are required'
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    if (start < now) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past'
      });
    }

    // Check for overlapping sessions by the same professor
    const overlappingSession = await Session.findOne({
      where: {
        professorId,
        [Op.or]: [
          {
            startDate: { [Op.lt]: end },
            endDate: { [Op.gt]: start }
          }
        ]
      }
    });

    if (overlappingSession) {
      return res.status(409).json({
        success: false,
        message: 'You already have a session that overlaps with these dates'
      });
    }

    // Validate maxStudents
    const maxStudentsNum = maxStudents ? parseInt(maxStudents) : 5;
    if (maxStudentsNum < 1 || maxStudentsNum > 50) {
      return res.status(400).json({
        success: false,
        message: 'Maximum students must be between 1 and 50'
      });
    }

    // Create session
    const session = await Session.create({
      professorId,
      title: title.trim(),
      startDate: start,
      endDate: end,
      maxStudents: maxStudentsNum
    });

    // Fetch session with professor details
    const sessionWithDetails = await Session.findByPk(session.id, {
      include: [
        {
          model: User,
          as: 'professor',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      session: sessionWithDetails
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating session'
    });
  }
};

// Get all sessions (for browsing)
exports.getAllSessions = async (req, res) => {
  try {
    const now = new Date();
    const sessions = await Session.findAll({
      where: {
        endDate: { [Op.gte]: now } // Only active/future sessions
      },
      include: [
        {
          model: User,
          as: 'professor',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Application,
          as: 'applications',
          attributes: ['id', 'status'],
          required: false,
          where: {
            requestType: 'session'
          }
        }
      ],
      order: [['startDate', 'ASC']]
    });

    // Add request count and current capacity for each session
    const sessionsWithStats = sessions.map(session => {
      const applications = session.applications || [];
      const approvedCount = applications.filter(r => r.status === 'approved').length;

      return {
        ...session.toJSON(),
        currentStudents: approvedCount,
        availableSpots: session.maxStudents - approvedCount
      };
    });

    res.json({
      success: true,
      sessions: sessionsWithStats
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving sessions'
    });
  }
};

// Get sessions created by the logged-in professor
exports.getMySessions = async (req, res) => {
  try {
    const professorId = req.session.user.id;

    const sessions = await Session.findAll({
      where: { professorId },
      include: [
        {
          model: Request,
          as: 'requests',
          include: [
            {
              model: User,
              as: 'student',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ],
      order: [['startDate', 'ASC']]
    });

    // Add statistics for each session
    const sessionsWithStats = sessions.map(session => {
      const requests = session.requests || [];
      const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length
      };

      return {
        ...session.toJSON(),
        statistics: stats
      };
    });

    res.json({
      success: true,
      sessions: sessionsWithStats
    });
  } catch (error) {
    console.error('Get my sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving your sessions'
    });
  }
};

// Get specific session by ID
exports.getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;
    const userRole = req.session.user.role;

    const session = await Session.findByPk(id, {
      include: [
        {
          model: User,
          as: 'professor',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Request,
          as: 'requests',
          include: [
            {
              model: User,
              as: 'student',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check permissions: only professor who created the session or students can view
    if (userRole === 'student' && session.professorId !== userId) {
      // Students can view any session, but requests are filtered below
    } else if (userRole === 'professor' && session.professorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own sessions'
      });
    }

    // Filter requests based on user role
    let filteredRequests = session.requests;
    if (userRole === 'student') {
      // Students only see their own requests
      filteredRequests = session.requests.filter(r => r.studentId === userId);
    }

    const responseSession = {
      ...session.toJSON(),
      requests: filteredRequests
    };

    res.json({
      success: true,
      session: responseSession
    });
  } catch (error) {
    console.error('Get session by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving session'
    });
  }
};

// Update session (professors only, only if no approved requests)
exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, startDate, endDate, maxStudents } = req.body;
    const professorId = req.session.user.id;

    const session = await Session.findByPk(id, {
      include: [
        {
          model: Request,
          as: 'requests'
        }
      ]
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.professorId !== professorId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own sessions'
      });
    }

    // Check if session has approved requests
    const approvedRequests = session.requests.filter(r => r.status === 'approved');
    if (approvedRequests.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Cannot update session with approved requests'
      });
    }

    // Validate dates if provided
    let start = session.startDate;
    let end = session.endDate;

    if (startDate) {
      start = new Date(startDate);
      if (start < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Start date cannot be in the past'
        });
      }
    }

    if (endDate) {
      end = new Date(endDate);
    }

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Check for overlapping sessions if dates changed
    if (startDate || endDate) {
      const overlappingSession = await Session.findOne({
        where: {
          professorId,
          id: { [Op.ne]: id },
          [Op.or]: [
            {
              startDate: { [Op.lt]: end },
              endDate: { [Op.gt]: start }
            }
          ]
        }
      });

      if (overlappingSession) {
        return res.status(409).json({
          success: false,
          message: 'You already have a session that overlaps with these dates'
        });
      }
    }

    // Update fields
    if (title) session.title = title.trim();
    if (startDate) session.startDate = start;
    if (endDate) session.endDate = end;
    if (maxStudents) {
      const maxStudentsNum = parseInt(maxStudents);
      if (maxStudentsNum < 1 || maxStudentsNum > 50) {
        return res.status(400).json({
          success: false,
          message: 'Maximum students must be between 1 and 50'
        });
      }
      session.maxStudents = maxStudentsNum;
    }

    await session.save();

    res.json({
      success: true,
      message: 'Session updated successfully',
      session
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating session'
    });
  }
};

// Delete session (professors only, only if no requests)
exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const professorId = req.session.user.id;

    const session = await Session.findByPk(id, {
      include: [
        {
          model: Request,
          as: 'requests'
        }
      ]
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.professorId !== professorId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own sessions'
      });
    }

    // Check if session has any requests
    if (session.requests && session.requests.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete session with existing requests'
      });
    }

    await session.destroy();

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting session'
    });
  }
};
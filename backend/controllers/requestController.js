const { Request, User, Session } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs').promises;

// Create a new request (students only)
exports.createRequest = async (req, res) => {
  try {
    const { sessionId, professorId } = req.body;
    const studentId = req.session.user.id;

    // Validate required fields
    if (!sessionId || !professorId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and Professor ID are required'
      });
    }

    // Check if session exists and is active
    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const now = new Date();
    if (now < session.startDate || now > session.endDate) {
      return res.status(400).json({
        success: false,
        message: 'Session is not currently active'
      });
    }

    // Check if professor exists and is a professor
    const professor = await User.findOne({
      where: { id: professorId, role: 'professor' }
    });

    if (!professor) {
      return res.status(404).json({
        success: false,
        message: 'Professor not found'
      });
    }

    // Check if student already has an approved request
    const existingApprovedRequest = await Request.findOne({
      where: {
        studentId,
        status: 'approved'
      }
    });

    if (existingApprovedRequest) {
      return res.status(409).json({
        success: false,
        message: 'You already have an approved request and cannot submit new ones'
      });
    }

    // Check if student already has a pending/approved request to this professor in this session
    const existingRequest = await Request.findOne({
      where: {
        studentId,
        professorId,
        sessionId,
        status: { [Op.in]: ['pending', 'approved'] }
      }
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: 'You already have an active request to this professor in this session'
      });
    }

    // Check session capacity
    const approvedRequestsCount = await Request.count({
      where: {
        sessionId,
        status: 'approved'
      }
    });

    if (approvedRequestsCount >= session.maxStudents) {
      return res.status(409).json({
        success: false,
        message: 'This session has reached its maximum capacity'
      });
    }

    // Create request
    const request = await Request.create({
      studentId,
      professorId,
      sessionId,
      status: 'pending'
    });

    // Fetch request with details
    const requestWithDetails = await Request.findByPk(request.id, {
      include: [
        {
          model: User,
          as: 'professor',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Session,
          as: 'session',
          attributes: ['id', 'title', 'startDate', 'endDate']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Request submitted successfully',
      request: requestWithDetails
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting request'
    });
  }
};

// Get all requests for the logged-in user
exports.getMyRequests = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const userRole = req.session.user.role;

    let requests;

    if (userRole === 'student') {
      // Get requests submitted by this student
      requests = await Request.findAll({
        where: { studentId: userId },
        include: [
          {
            model: User,
            as: 'professor',
            attributes: ['id', 'name', 'email']
          },
          {
            model: Session,
            as: 'session',
            attributes: ['id', 'title', 'startDate', 'endDate']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    } else if (userRole === 'professor') {
      // Get requests received by this professor
      requests = await Request.findAll({
        where: { professorId: userId },
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'name', 'email']
          },
          {
            model: Session,
            as: 'session',
            attributes: ['id', 'title', 'startDate', 'endDate']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    }

    res.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving requests'
    });
  }
};

// Get specific request by ID
exports.getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;
    const userRole = req.session.user.role;

    const request = await Request.findByPk(id, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'professor',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Session,
          as: 'session',
          attributes: ['id', 'title', 'startDate', 'endDate']
        }
      ]
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check permissions: only student or professor involved can view
    if (userRole === 'student' && request.studentId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own requests'
      });
    }

    if (userRole === 'professor' && request.professorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view requests assigned to you'
      });
    }

    res.json({
      success: true,
      request
    });
  } catch (error) {
    console.error('Get request by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving request'
    });
  }
};

// Update request status (professors only)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const professorId = req.session.user.id;

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either approved or rejected'
      });
    }

    const request = await Request.findByPk(id, {
      include: [
        {
          model: Session,
          as: 'session'
        }
      ]
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.professorId !== professorId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update requests assigned to you'
      });
    }

    if (request.status !== 'pending') {
      return res.status(409).json({
        success: false,
        message: 'Request has already been processed'
      });
    }

    // If approving, check session capacity
    if (status === 'approved') {
      const approvedRequestsCount = await Request.count({
        where: {
          sessionId: request.sessionId,
          status: 'approved'
        }
      });

      if (approvedRequestsCount >= request.session.maxStudents) {
        return res.status(409).json({
          success: false,
          message: 'Session has reached maximum capacity'
        });
      }
    }

    // Update request
    request.status = status;
    if (reason && status === 'rejected') {
      request.reason = reason.trim();
    }

    await request.save();

    // Fetch updated request with details
    const updatedRequest = await Request.findByPk(id, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'professor',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Session,
          as: 'session',
          attributes: ['id', 'title', 'startDate', 'endDate']
        }
      ]
    });

    res.json({
      success: true,
      message: `Request ${status} successfully`,
      request: updatedRequest
    });
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating request status'
    });
  }
};

// Upload student file (students only, approved requests only)
exports.uploadStudentFile = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.session.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const request = await Request.findByPk(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.studentId !== studentId) {
      return res.status(403).json({
        success: false,
        message: 'You can only upload files for your own requests'
      });
    }

    if (request.status !== 'approved') {
      return res.status(409).json({
        success: false,
        message: 'Can only upload files for approved requests'
      });
    }

    // Save file path
    const uploadsDir = path.join(__dirname, '../uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const fileName = `student_${request.id}_${Date.now()}${path.extname(req.file.originalname)}`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.writeFile(filePath, req.file.buffer);

    request.studentFilePath = fileName;
    await request.save();

    res.json({
      success: true,
      message: 'File uploaded successfully',
      filePath: fileName
    });
  } catch (error) {
    console.error('Upload student file error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file'
    });
  }
};

// Upload professor file (professors only)
exports.uploadProfessorFile = async (req, res) => {
  try {
    const { id } = req.params;
    const professorId = req.session.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const request = await Request.findByPk(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.professorId !== professorId) {
      return res.status(403).json({
        success: false,
        message: 'You can only upload files for requests assigned to you'
      });
    }

    if (request.status !== 'approved') {
      return res.status(409).json({
        success: false,
        message: 'Can only upload files for approved requests'
      });
    }

    // Save file path
    const uploadsDir = path.join(__dirname, '../uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const fileName = `professor_${request.id}_${Date.now()}${path.extname(req.file.originalname)}`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.writeFile(filePath, req.file.buffer);

    request.professorFilePath = fileName;
    await request.save();

    res.json({
      success: true,
      message: 'File uploaded successfully',
      filePath: fileName
    });
  } catch (error) {
    console.error('Upload professor file error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file'
    });
  }
};

// Download file
exports.downloadFile = async (req, res) => {
  try {
    const { id, type } = req.params;
    const userId = req.session.user.id;
    const userRole = req.session.user.role;

    const request = await Request.findByPk(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check permissions
    if (userRole === 'student' && request.studentId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (userRole === 'professor' && request.professorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    let filePath;
    if (type === 'student') {
      filePath = request.studentFilePath;
    } else if (type === 'professor') {
      filePath = request.professorFilePath;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type'
      });
    }

    if (!filePath) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const fullPath = path.join(__dirname, '../uploads', filePath);

    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch {
      return res.status(404).json({
        success: false,
        message: 'File not found on disk'
      });
    }

    res.download(fullPath);
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading file'
    });
  }
};

// Delete request (students only, pending only)
exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.session.user.id;

    const request = await Request.findByPk(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.studentId !== studentId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own requests'
      });
    }

    if (request.status !== 'pending') {
      return res.status(409).json({
        success: false,
        message: 'Can only delete pending requests'
      });
    }

    // Delete associated files if they exist
    if (request.studentFilePath) {
      try {
        const filePath = path.join(__dirname, '../uploads', request.studentFilePath);
        await fs.unlink(filePath);
      } catch (error) {
        console.warn('Could not delete student file:', error);
      }
    }

    await request.destroy();

    res.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting request'
    });
  }
};
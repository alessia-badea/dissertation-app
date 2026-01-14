const { Application, User } = require('../models');

// Create a new application
exports.createApplication = async (req, res) => {
  try {
    const { professorId, thesisTitle, thesisDescription } = req.body;
    const studentId = req.session.user.id;

    // Validate required fields
    if (!professorId || !thesisTitle || !thesisDescription) {
      return res.status(400).json({
        success: false,
        message: 'Toate câmpurile sunt obligatorii'
      });
    }

    // Check if professor exists and has role professor
    const professor = await User.findOne({
      where: { id: professorId, role: 'professor' }
    });

    if (!professor) {
      return res.status(404).json({
        success: false,
        message: 'Profesorul nu a fost găsit'
      });
    }

    // Check if student already has a pending/approved application to this professor
    const existingApplication = await Application.findOne({
      where: {
        studentId,
        professorId,
        status: ['pending', 'approved', 'document_pending', 'completed']
      }
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: 'Ai deja o cerere activă la acest profesor'
      });
    }

    // Create application
    const application = await Application.create({
      studentId,
      professorId,
      thesisTitle,
      thesisDescription,
      status: 'pending'
    });

    // Fetch professor name for response
    const applicationWithDetails = await Application.findByPk(application.id, {
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
      message: 'Cererea a fost trimisă cu succes',
      application: applicationWithDetails
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la trimiterea cererii'
    });
  }
};

// Get all applications for the logged-in user
exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const userRole = req.session.user.role;

    let applications;

    if (userRole === 'student') {
      // Get applications submitted by this student
      applications = await Application.findAll({
        where: { studentId: userId },
        include: [
          {
            model: User,
            as: 'professor',
            attributes: ['id', 'name', 'email']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    } else if (userRole === 'professor') {
      // Get applications submitted to this professor
      applications = await Application.findAll({
        where: { professorId: userId },
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'name', 'email']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    }

    res.json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la încărcarea cererilor'
    });
  }
};

// Get a specific application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;
    const userRole = req.session.user.role;

    const application = await Application.findByPk(id, {
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
        }
      ]
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Cererea nu a fost găsită'
      });
    }

    // Check if user has access to this application
    if (
      (userRole === 'student' && application.studentId !== userId) ||
      (userRole === 'professor' && application.professorId !== userId)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Nu ai acces la această cerere'
      });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la încărcarea cererii'
    });
  }
};

// Update application status (professor only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionMessage } = req.body;
    const userId = req.session.user.id;
    const userRole = req.session.user.role;

    // Only professors can update status
    if (userRole !== 'professor') {
      return res.status(403).json({
        success: false,
        message: 'Doar profesorii pot actualiza statusul cererii'
      });
    }

    const application = await Application.findByPk(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Cererea nu a fost găsită'
      });
    }

    // Check if this professor owns the application
    if (application.professorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Nu ai acces la această cerere'
      });
    }

    // Update status
    application.status = status;
    if (rejectionMessage) {
      application.rejectionMessage = rejectionMessage;
    }
    await application.save();

    res.json({
      success: true,
      message: 'Statusul cererii a fost actualizat',
      application
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la actualizarea cererii'
    });
  }
};

// Delete application
exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;
    const userRole = req.session.user.role;

    const application = await Application.findByPk(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Cererea nu a fost găsită'
      });
    }

    // Only the student who created it can delete (and only if pending)
    if (userRole !== 'student' || application.studentId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Nu ai permisiunea să ștergi această cerere'
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Nu poți șterge o cerere care nu este în așteptare'
      });
    }

    await application.destroy();

    res.json({
      success: true,
      message: 'Cererea a fost ștearsă'
    });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la ștergerea cererii'
    });
  }
};

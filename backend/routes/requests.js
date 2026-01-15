const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { requireAuth, requireRole } = require('../middleware/auth');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow PDF, DOC, DOCX files
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'), false);
    }
  }
});

// All routes require authentication
router.use(requireAuth);

// Create new request (students only)
router.post('/', requireRole('student'), requestController.createRequest);

// Get all requests for logged-in user
router.get('/', requestController.getMyRequests);

// Get specific request by ID
router.get('/:id', requestController.getRequestById);

// Update request status (professors only)
router.put('/:id/status', requireRole('professor'), requestController.updateRequestStatus);

// Upload student file (students only)
router.post('/:id/upload/student', requireRole('student'), upload.single('file'), requestController.uploadStudentFile);

// Upload professor file (professors only)
router.post('/:id/upload/professor', requireRole('professor'), upload.single('file'), requestController.uploadProfessorFile);

// Download file
router.get('/:id/download/:type', requestController.downloadFile);

// Delete request (students only)
router.delete('/:id', requireRole('student'), requestController.deleteRequest);

module.exports = router;
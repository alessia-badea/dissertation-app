const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { requireAuth, requireRole } = require('../middleware/auth');

// All routes require authentication
router.use(requireAuth);

// Create new application (students only)
router.post('/', requireRole('student'), applicationController.createApplication);

// Get all applications for logged-in user
router.get('/', applicationController.getMyApplications);

// Get specific application by ID
router.get('/:id', applicationController.getApplicationById);

// Update application status (professors only)
router.put('/:id/status', requireRole('professor'), applicationController.updateApplicationStatus);

// Delete application (students only, pending only)
router.delete('/:id', requireRole('student'), applicationController.deleteApplication);

module.exports = router;

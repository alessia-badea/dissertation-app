const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { requireAuth, requireRole } = require('../middleware/auth');

// All routes require authentication
router.use(requireAuth);

// Create new session (professors only)
router.post('/', requireRole('professor'), sessionController.createSession);

// Get all active sessions (for browsing)
router.get('/', sessionController.getAllSessions);

// Get sessions created by logged-in professor
router.get('/my', requireRole('professor'), sessionController.getMySessions);

// Get specific session by ID
router.get('/:id', sessionController.getSessionById);

// Update session (professors only)
router.put('/:id', requireRole('professor'), sessionController.updateSession);

// Delete session (professors only)
router.delete('/:id', requireRole('professor'), sessionController.deleteSession);

module.exports = router;
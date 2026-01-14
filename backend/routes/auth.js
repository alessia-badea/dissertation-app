const express = require('express');
const router = express.Router();
const authController = require('../config/controllers/authController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { requireAuth, requireRole } = require('../middleware/auth');
require('dotenv').config();
const SALT_ROUNDS = 10;

// =======================
// CONTROLLER-BASED (SESSION)
// =======================

// Register / Login pe sesiuni (tema Backend Dev 1)
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.getCurrentUser);

// Exemple cu middleware (Backend Dev 2)
router.get('/profile', requireAuth, (req, res) => {
  res.json({ user: req.session.user });
});

router.get('/professor-only', requireRole('professor'), (req, res) => {
  res.json({ message: 'Salut, profesor!' });
});

// Update profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { name, email, maxStudents } = req.body;
    const userId = req.session.user.id;

    // Find the user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Validate email if it's being changed
    if (email && email !== user.email) {
      if (!validateEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Check if email is already taken
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser && existingUser.id !== userId) {
        return res.status(409).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Update user fields
    if (name !== undefined) user.name = name.trim() || null;
    if (email !== undefined) user.email = email.trim();
    
    // Update maxStudents only for professors
    if (maxStudents !== undefined && user.role === 'professor') {
      const maxStudentsNum = parseInt(maxStudents);
      if (isNaN(maxStudentsNum) || maxStudentsNum < 1 || maxStudentsNum > 20) {
        return res.status(400).json({
          success: false,
          message: 'Maximum students must be between 1 and 20'
        });
      }
      user.maxStudents = maxStudentsNum;
    }

    await user.save();

    // Update session
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      maxStudents: user.maxStudents
    };

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        maxStudents: user.maxStudents
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update',
      error: error.message
    });
  }
});

// Change password
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.session.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    // Find the user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Validate new password
    const passwordErrors = getPasswordErrors(newPassword);
    if (passwordErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'New password does not meet requirements',
        requirements: {
          minLength: 8,
          uppercase: 'At least one uppercase letter',
          lowercase: 'At least one lowercase letter',
          number: 'At least one number'
        },
        errors: passwordErrors
      });
    }

    // Hash and save new password
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.passwordHash = passwordHash;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password change',
      error: error.message
    });
  }
});

// Delete account
router.delete('/delete-account', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;

    // Find the user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete the user
    await user.destroy();

    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
    });

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during account deletion',
      error: error.message
    });
  }
});

// ============================================
// VALIDATION HELPERS
// ============================================

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // Minimum 8 characters, at least one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

const getPasswordErrors = (password) => {
  const errors = [];
  if (!password) errors.push('Password is required');
  if (password && password.length < 8) errors.push('Password must be at least 8 characters');
  if (password && !/[a-z]/.test(password)) errors.push('Password must contain a lowercase letter');
  if (password && !/[A-Z]/.test(password)) errors.push('Password must contain an uppercase letter');
  if (password && !/\d/.test(password)) errors.push('Password must contain a number');
  return errors;
};

// ============================================
// REGISTER ENDPOINTS (JWT VARIANTA TA)
// ============================================

// Register as student
router.post('/register/student', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();

    if (!trimmedEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    if (!validateEmail(trimmedEmail)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email format is invalid. Please provide a valid email address.',
        details: 'Email must be in format: example@domain.com'
      });
    }

    const passwordErrors = getPasswordErrors(trimmedPassword);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password does not meet requirements',
        requirements: {
          minLength: 8,
          uppercase: 'At least one uppercase letter',
          lowercase: 'At least one lowercase letter',
          number: 'At least one number'
        },
        errors: passwordErrors
      });
    }

    const existingUser = await User.findOne({ where: { email: trimmedEmail } });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'Email already registered',
        suggestion: 'Please try logging in or use a different email address'
      });
    }

    const passwordHash = await bcrypt.hash(trimmedPassword, SALT_ROUNDS);

    // FIX MIC: folosește trimmedEmail și setează direct student
    const user = await User.create({
      email: trimmedEmail,
      passwordHash,
      role: 'student',
      name: name?.trim() || null,
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error('Register student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// Register as professor
router.post('/register/professor', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();

    if (!trimmedEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    if (!validateEmail(trimmedEmail)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email format is invalid. Please provide a valid email address.',
        details: 'Email must be in format: example@domain.com'
      });
    }

    const passwordErrors = getPasswordErrors(trimmedPassword);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password does not meet requirements',
        requirements: {
          minLength: 8,
          uppercase: 'At least one uppercase letter',
          lowercase: 'At least one lowercase letter',
          number: 'At least one number'
        },
        errors: passwordErrors
      });
    }

    const existingUser = await User.findOne({ where: { email: trimmedEmail } });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'Email already registered',
        suggestion: 'Please try logging in or use a different email address'
      });
    }

    const passwordHash = await bcrypt.hash(trimmedPassword, SALT_ROUNDS);

    const user = await User.create({
      email: trimmedEmail,
      passwordHash,
      name: name?.trim() || null,
      role: 'professor'
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'professor' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Professor registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register professor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// Generic register endpoint (auto-detect or use role parameter)
router.post('/register-jwt', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    
    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();

    if (!trimmedEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    if (!validateEmail(trimmedEmail)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email format is invalid. Please provide a valid email address.',
        details: 'Email must be in format: example@domain.com'
      });
    }

    const passwordErrors = getPasswordErrors(trimmedPassword);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password does not meet requirements',
        requirements: {
          minLength: 8,
          uppercase: 'At least one uppercase letter',
          lowercase: 'At least one lowercase letter',
          number: 'At least one number'
        },
        errors: passwordErrors
      });
    }

    const userRole = role?.trim() || 'student';
    if (!['student', 'professor'].includes(userRole)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid role',
        validRoles: ['student', 'professor']
      });
    }

    const existingUser = await User.findOne({ where: { email: trimmedEmail } });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'Email already registered',
        suggestion: 'Please try logging in or use a different email address'
      });
    }

    const passwordHash = await bcrypt.hash(trimmedPassword, SALT_ROUNDS);

    const user = await User.create({
      email: trimmedEmail,
      passwordHash,
      name: name?.trim() || null,
      role: userRole
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} registered successfully`,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// ============================================
// LOGIN ENDPOINTS (JWT)
// ============================================

router.post('/login-jwt', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

router.post('/login/student', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, role: 'student' } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/login/professor', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, role: 'professor' } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, role: 'professor' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

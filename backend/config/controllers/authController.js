const bcrypt = require('bcrypt');
const User = require('../../models/User');
const SALT_ROUNDS = 10;

// Validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  if (!password) return { valid: false, errors: ['Password is required'] };
  
  const errors = [];
  if (password.length < 8) errors.push('Password must be at least 8 characters');
  if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
  if (!/\d/.test(password)) errors.push('Password must contain at least one number');
  
  return {
    valid: errors.length === 0,
    errors
  };
};

exports.register = async (req, res) => {
  try {
    const { email, password, role, name } = req.body;

    // Trim email
    const trimmedEmail = email?.trim();

    if (!trimmedEmail || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email și parola sunt obligatorii' 
      });
    }

    // Validate email format
    if (!validateEmail(trimmedEmail)) {
      return res.status(400).json({ 
        success: false,
        message: 'Format email invalid. Te rugăm să furnizezi un email valid.' 
      });
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ 
        success: false,
        message: 'Parola nu îndeplinește cerințele',
        errors: passwordValidation.errors
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email: trimmedEmail } });
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        message: 'Email deja folosit' 
      });
    }

    // Validate role if provided
    if (role && !['student', 'professor'].includes(role)) {
      return res.status(400).json({ 
        success: false,
        message: 'Rol invalid. Rolurile valide sunt: student, professor' 
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await User.create({
      email: trimmedEmail,
      passwordHash,
      role: role || 'student',
      name: name?.trim() || null
    });

    return res.status(201).json({ 
      success: true,
      message: 'User înregistrat cu succes',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    
    // Handle Sequelize validation errors
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        success: false,
        message: 'Date invalide',
        errors: err.errors.map(e => e.message)
      });
    }
    
    return res.status(500).json({ 
      success: false,
      message: 'Eroare server' 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email și parola sunt obligatorii' 
      });
    }

    // Trim email
    const trimmedEmail = email.trim();

    const user = await User.findOne({ where: { email: trimmedEmail } });
    if (!user) {
      // Don't reveal if email exists for security
      return res.status(401).json({ 
        success: false,
        message: 'Credențiale invalide' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Credențiale invalide' 
      });
    }

    // Set session
    req.session.user = {
      id: user.id,
      role: user.role,
      email: user.email
    };

    // Return user object (without passwordHash)
    const userResponse = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    return res.status(200).json({ 
      success: true,
      message: 'Autentificare reușită',
      user: userResponse 
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Eroare server' 
    });
  }
};

exports.logout = (req, res) => {
  if (!req.session) {
    return res.status(200).json({ 
      success: true,
      message: 'Already logged out' 
    });
  }

  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Eroare la logout' 
      });
    }

    // Clear session cookie
    res.clearCookie('connect.sid');

    return res.status(200).json({ 
      success: true,
      message: 'Logout realizat cu succes' 
    });
  });
};

exports.getCurrentUser = async (req, res) => {
  const sessionUser = req.session?.user;

  if (!sessionUser) {
    return res.status(401).json({ 
      success: false,
      message: 'Neautentificat' 
    });
  }

  // Fetch fresh user data from database
  try {
    const user = await User.findByPk(sessionUser.id, {
      attributes: ['id', 'email', 'role', 'name', 'createdAt']
    });

    if (!user) {
      // Session references non-existent user
      req.session.destroy();
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Get current user error:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Eroare server' 
    });
  }
};

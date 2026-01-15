const express = require('express');
const session = require('express-session');
const cors = require('cors');
const store = require('./sessionStore');
const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessions');
const requestRoutes = require('./routes/requests');
require('dotenv').config();

const app = express();

// CORS
app.use(cors({
  origin: 'http://localhost:5173',  // Vite default port
  credentials: true,                // permite trimiterea cookie-urilor de sesiune
}));

// Middleware body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'secretul-meu-super-secret',
  store: store,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,                               // cookie doar pentru HTTP
    secure: process.env.NODE_ENV === 'production',// false pe localhost, true în prod
    sameSite: 'lax',                              // protecție CSRF rezonabilă
    maxAge: 24 * 60 * 60 * 1000                   // 24h
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/requests', requestRoutes);

app.get('/', (req, res) => {
  if (!req.session.views) {
    req.session.views = 1;
  } else {
    req.session.views++;
  }
  res.send(`Număr vizite: ${req.session.views}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server pornit la http://localhost:${PORT}`));

module.exports = app;

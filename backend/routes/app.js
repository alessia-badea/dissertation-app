const express = require('express');
const session = require('express-session');
const cors = require('cors');
const store = require('./sessionStore');
const authRoutes = require('./auth');
require('dotenv').config();

const app = express();

// CORS
app.use(cors({
  origin: 'http://localhost:3000',  // sau URL-ul frontend-ului
  credentials: true,                // permite trimiterea cookie-urilor de sesiune [web:166][web:167][web:168][web:173]
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
    httpOnly: true,                               // cookie doar pentru HTTP [web:148][web:150]
    secure: process.env.NODE_ENV === 'production',// false pe localhost, true în prod [web:147][web:149][web:156]
    sameSite: 'lax',                              // protecție CSRF rezonabilă [web:147][web:150]
    maxAge: 24 * 60 * 60 * 1000                   // 24h [web:30][web:158]
  }
}));

// Routes
app.use('/api/auth', authRoutes);

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

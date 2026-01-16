const { Sequelize } = require('sequelize');
const path = require('path');

// Exemplu cu SQLite
// Use path relative to backend folder, going up to root
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', '..', 'session-db.sqlite')
});

// Testăm conexiunea
sequelize.authenticate()
  .then(() => {
    console.log('DB conectat cu succes');
    // Enable foreign keys for SQLite
    return sequelize.query('PRAGMA foreign_keys = ON;');
  })
  .then(() => console.log('Foreign keys enabled'))
  .catch(err => console.error('Eroare DB:', err));

module.exports = sequelize;

const { Sequelize } = require('sequelize');

// Exemplu cu SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './session-db.sqlite'
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

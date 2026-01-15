const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/database');

const store = new SequelizeStore({
  db: sequelize,
  tableName: 'SessionStore', // Changed from 'Sessions' to avoid conflict
  checkExpirationInterval: 15 * 60 * 1000, // verifică expirarea la fiecare 15 min
  expiration: 24 * 60 * 60 * 1000, // sesiunea expiră după 24h
});

store.sync(); // creează tabelul dacă nu există

module.exports = store;

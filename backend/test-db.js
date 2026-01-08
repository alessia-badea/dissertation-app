// test-db.js
const sequelize = require('./config/database');
require('./models/User'); // ensure model is loaded

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('DB connection OK');

    // optional: check that Users table works
    const count = await sequelize.models.User.count();
    console.log('Users in DB:', count);
  } catch (err) {
    console.error('DB connection failed:', err);
  } finally {
    await sequelize.close();
  }
}

testConnection();

// Initialize database - creates tables if they don't exist
const sequelize = require('./config/database');
const User = require('./models/User');

(async () => {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    console.log('🔄 Syncing database models...');
    await sequelize.sync({ alter: true }); // alter: true updates existing tables
    console.log('✅ Database synced successfully');

    console.log('\n✅ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
})();

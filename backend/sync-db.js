// Sync database - creates/updates tables
const sequelize = require('./config/database');
const { User, Application } = require('./models');

(async () => {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    console.log('🔄 Syncing database models...');
    await sequelize.sync({ alter: true }); // alter: true updates existing tables
    console.log('✅ Database synced successfully');

    console.log('\n✅ Database synchronization complete!');
    console.log('Tables created/updated:');
    console.log('  - Users');
    console.log('  - Applications');
    console.log('  - Sessions');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database synchronization failed:', error);
    process.exit(1);
  }
})();

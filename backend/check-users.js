// Check all users in the database
const sequelize = require('./config/database');
const User = require('./models/User');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');

    const users = await User.findAll({
      attributes: ['id', 'email', 'name', 'role', 'createdAt']
    });

    console.log(`📊 Total users in database: ${users.length}\n`);

    if (users.length === 0) {
      console.log('No users found in database.');
    } else {
      console.log('Users:');
      console.log('─'.repeat(80));
      users.forEach(user => {
        console.log(`ID: ${user.id}`);
        console.log(`Name: ${user.name || 'N/A'}`);
        console.log(`Email: ${user.email}`);
        console.log(`Role: ${user.role}`);
        console.log(`Created: ${user.createdAt}`);
        console.log('─'.repeat(80));
      });
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();

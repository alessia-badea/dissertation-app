const { User } = require('./models');
const bcrypt = require('bcrypt');

async function updatePassword() {
  try {
    const professor = await User.findOne({ where: { email: 'prof@test.com' } });
    
    if (!professor) {
      console.log('❌ Professor not found');
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash('Prof123!', 10);
    professor.passwordHash = hashedPassword;
    await professor.save();

    console.log('✅ Password updated successfully!');
    console.log('\n🔑 Login with:');
    console.log('   Email:    prof@test.com');
    console.log('   Password: Prof123!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updatePassword();

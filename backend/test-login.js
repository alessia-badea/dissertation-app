const bcrypt = require('bcrypt');
const User = require('./models/User');

async function testLogin() {
  try {
    const email = 'prof@test.com';
    const password = 'Prof123!';

    console.log('Testing login for:', email);
    console.log('Password:', password);
    console.log('');

    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log('✅ User found:', user.name);
    console.log('Stored hash:', user.passwordHash);
    console.log('');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    console.log('Password match:', isMatch ? '✅ YES' : '❌ NO');

    if (!isMatch) {
      // Try to see what the hash should be
      const correctHash = await bcrypt.hash(password, 10);
      console.log('\nExpected hash for "Prof123!":', correctHash);
      
      // Test if the stored hash matches the old password
      const oldPasswordMatch = await bcrypt.compare('prof123', user.passwordHash);
      console.log('Matches old password "prof123":', oldPasswordMatch ? 'YES' : 'NO');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testLogin();

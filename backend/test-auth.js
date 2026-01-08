const sequelize = require('./config/database');
const User = require('./models/User');
const app = require('./app');
const http = require('http');

(async () => {
  console.log('🔐 Starting Auth Tests...\n');

  try {
    // Setup database
    await sequelize.authenticate();
    console.log('✓ Database connected');

    await sequelize.sync({ force: false });
    console.log('✓ Tables synced\n');

    // Start server
    const server = http.createServer(app);
    server.listen(5001, async () => {
      console.log('✓ Server started on port 5001\n');

      // Test 1: Register student
      console.log('Test 1: Register student');
      const studentRes = await fetch('http://localhost:5001/api/auth/register/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student1@example.com',
          password: 'password123',
          name: 'John Student'
        })
      });
      const studentData = await studentRes.json();
      console.log(`  Status: ${studentRes.status}`);
      console.log(`  Response:`, studentData);
      console.log();

      // Test 2: Register professor
      console.log('Test 2: Register professor');
      const profRes = await fetch('http://localhost:5001/api/auth/register/professor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'professor1@example.com',
          password: 'profpassword123',
          name: 'Dr. Jane Professor'
        })
      });
      const profData = await profRes.json();
      console.log(`  Status: ${profRes.status}`);
      console.log(`  Response:`, profData);
      console.log();

      // Test 3: Try duplicate registration
      console.log('Test 3: Try duplicate registration (should fail)');
      const dupRes = await fetch('http://localhost:5001/api/auth/register/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student1@example.com',
          password: 'password456',
          name: 'John Duplicate'
        })
      });
      const dupData = await dupRes.json();
      console.log(`  Status: ${dupRes.status}`);
      console.log(`  Response:`, dupData);
      console.log();

      // Test 4: Login with registered student
      console.log('Test 4: Login with registered student');
      const loginRes = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student1@example.com',
          password: 'password123'
        })
      });
      const loginData = await loginRes.json();
      console.log(`  Status: ${loginRes.status}`);
      console.log(`  Response:`, loginData);
      console.log();

      // Test 5: Login with wrong password
      console.log('Test 5: Login with wrong password (should fail)');
      const wrongPassRes = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student1@example.com',
          password: 'wrongpassword'
        })
      });
      const wrongPassData = await wrongPassRes.json();
      console.log(`  Status: ${wrongPassRes.status}`);
      console.log(`  Response:`, wrongPassData);
      console.log();

      // Test 6: Check users in database
      console.log('Test 6: Users in database');
      const users = await User.findAll();
      console.log(`  Total users: ${users.length}`);
      users.forEach(u => {
        console.log(`    - ${u.email} (${u.role}) - ${u.name}`);
      });

      console.log('\n✅ All tests completed!');
      server.close();
      await sequelize.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();

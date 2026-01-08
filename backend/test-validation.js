const sequelize = require('./config/database');
const app = require('./app');
const http = require('http');

(async () => {
  console.log('🔐 Testing Email & Password Validation...\n');

  try {
    // Setup database
    await sequelize.authenticate();
    console.log('✓ Database connected\n');

    await sequelize.sync({ force: true }); // Fresh DB
    console.log('✓ Database reset\n');

    // Start server
    const server = http.createServer(app);
    server.listen(5002, async () => {
      console.log('✓ Server started on port 5002\n');

      const tests = [
        {
          name: '1. Missing email',
          payload: { password: 'Passwor1' },
          expectedStatus: 400
        },
        {
          name: '2. Missing password',
          payload: { email: 'test@example.com' },
          expectedStatus: 400
        },
        {
          name: '3. Invalid email format (no @)',
          payload: { email: 'testexample.com', password: 'Password1' },
          expectedStatus: 400
        },
        {
          name: '4. Invalid email format (no domain)',
          payload: { email: 'test@', password: 'Password1' },
          expectedStatus: 400
        },
        {
          name: '5. Password too short (less than 8 chars)',
          payload: { email: 'user@example.com', password: 'Pass1' },
          expectedStatus: 400
        },
        {
          name: '6. Password missing uppercase',
          payload: { email: 'user@example.com', password: 'password1' },
          expectedStatus: 400
        },
        {
          name: '7. Password missing lowercase',
          payload: { email: 'user@example.com', password: 'PASSWORD1' },
          expectedStatus: 400
        },
        {
          name: '8. Password missing number',
          payload: { email: 'user@example.com', password: 'PasswordA' },
          expectedStatus: 400
        },
        {
          name: '9. Valid registration (student)',
          payload: { email: 'valid@example.com', password: 'ValidPass1', name: 'Test User' },
          expectedStatus: 201
        },
        {
          name: '10. Duplicate email registration',
          payload: { email: 'valid@example.com', password: 'AnotherPass1' },
          expectedStatus: 409
        },
        {
          name: '11. Email with leading/trailing spaces (should trim)',
          payload: { email: '  trim@example.com  ', password: 'TrimPass123' },
          expectedStatus: 201
        },
        {
          name: '12. Valid registration (professor)',
          payload: { email: 'prof@example.com', password: 'ProfPass123', role: 'professor' },
          expectedStatus: 201
        }
      ];

      let passed = 0;
      let failed = 0;

      for (const test of tests) {
        try {
          const res = await fetch('http://localhost:5002/api/auth/register/student', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(test.payload)
          });
          
          const data = await res.json();
          const statusOk = res.status === test.expectedStatus;
          
          if (statusOk) {
            console.log(`✅ ${test.name}`);
            console.log(`   Status: ${res.status} (expected ${test.expectedStatus})`);
            passed++;
          } else {
            console.log(`❌ ${test.name}`);
            console.log(`   Status: ${res.status} (expected ${test.expectedStatus})`);
            console.log(`   Response:`, data);
            failed++;
          }
        } catch (error) {
          console.log(`❌ ${test.name} - Error:`, error.message);
          failed++;
        }
        console.log();
      }

      console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed out of ${tests.length}`);
      if (failed === 0) {
        console.log('✅ All validation tests passed!');
      }

      server.close();
      await sequelize.close();
      process.exit(failed > 0 ? 1 : 0);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();

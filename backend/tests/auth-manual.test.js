/**
 * Manual Authentication Tests
 * Run with: node tests/auth-manual.test.js
 * These tests use fetch API and manual assertions
 */

const sequelize = require('../config/database');
const User = require('../models/User');
const app = require('../app');
const http = require('http');

(async () => {
  console.log('🧪 Starting Manual Authentication Tests...\n');

  try {
    // Setup database
    await sequelize.authenticate();
    console.log('✓ Database connected');

    await sequelize.sync({ force: true });
    console.log('✓ Database reset\n');

    // Start server
    const server = http.createServer(app);
    await new Promise((resolve) => {
      server.listen(5004, () => {
        console.log('✓ Server started on port 5004\n');
        resolve();
      });
    });

    const BASE_URL = 'http://localhost:5004';
    let passed = 0;
    let failed = 0;
    let sessionCookie = '';

    // Helper function
    const test = async (name, fn) => {
      try {
        await fn();
        console.log(`✅ ${name}`);
        passed++;
      } catch (error) {
        console.log(`❌ ${name}`);
        console.log(`   Error: ${error.message}`);
        failed++;
      }
    };

    // Test 1: Register - Success
    await test('1. POST /api/auth/register - Success', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student1@example.com',
          password: 'Password123',
          name: 'John Student',
          role: 'student'
        })
      });
      const data = await res.json();
      if (res.status !== 201 || !data.success) {
        throw new Error(`Expected 201, got ${res.status}`);
      }
    });

    // Test 2: Register - Duplicate email
    await test('2. POST /api/auth/register - Duplicate email', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student1@example.com',
          password: 'Password456'
        })
      });
      const data = await res.json();
      if (res.status !== 409 || data.success !== false) {
        throw new Error(`Expected 409, got ${res.status}`);
      }
    });

    // Test 3: Register - Invalid email
    await test('3. POST /api/auth/register - Invalid email', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'Password123'
        })
      });
      if (res.status !== 400) {
        throw new Error(`Expected 400, got ${res.status}`);
      }
    });

    // Test 4: Register - Password too short
    await test('4. POST /api/auth/register - Password too short', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test2@example.com',
          password: 'Pass1'
        })
      });
      if (res.status !== 400) {
        throw new Error(`Expected 400, got ${res.status}`);
      }
    });

    // Test 5: Register - Professor
    await test('5. POST /api/auth/register - Professor', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'professor1@example.com',
          password: 'Professor123',
          name: 'Dr. Jane Professor',
          role: 'professor'
        })
      });
      const data = await res.json();
      if (res.status !== 201 || data.user.role !== 'professor') {
        throw new Error(`Expected 201 with professor role, got ${res.status}`);
      }
    });

    // Test 6: Login - Success
    await test('6. POST /api/auth/login - Success', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student1@example.com',
          password: 'Password123'
        })
      });
      const data = await res.json();
      const cookies = res.headers.get('set-cookie');
      
      if (res.status !== 200 || !data.success) {
        throw new Error(`Expected 200, got ${res.status}`);
      }
      if (cookies) {
        sessionCookie = cookies.split(';')[0];
      }
    });

    // Test 7: Login - Wrong password
    await test('7. POST /api/auth/login - Wrong password', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student1@example.com',
          password: 'WrongPassword123'
        })
      });
      if (res.status !== 401) {
        throw new Error(`Expected 401, got ${res.status}`);
      }
    });

    // Test 8: Login - Non-existent user
    await test('8. POST /api/auth/login - Non-existent user', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'Password123'
        })
      });
      if (res.status !== 401) {
        throw new Error(`Expected 401, got ${res.status}`);
      }
    });

    // Test 9: GET /api/auth/me - With session
    await test('9. GET /api/auth/me - With session', async () => {
      // Login first
      const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student1@example.com',
          password: 'Password123'
        })
      });
      const loginCookies = loginRes.headers.get('set-cookie');
      const cookie = loginCookies ? loginCookies.split(';')[0] : '';

      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookie
        }
      });
      const data = await res.json();
      
      if (res.status !== 200 || !data.success || !data.user) {
        throw new Error(`Expected 200 with user, got ${res.status}`);
      }
    });

    // Test 10: GET /api/auth/me - Without session
    await test('10. GET /api/auth/me - Without session (401)', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.status !== 401) {
        throw new Error(`Expected 401, got ${res.status}`);
      }
    });

    // Test 11: POST /api/auth/logout
    await test('11. POST /api/auth/logout', async () => {
      // Login first
      const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student1@example.com',
          password: 'Password123'
        })
      });
      const loginCookies = loginRes.headers.get('set-cookie');
      const cookie = loginCookies ? loginCookies.split(';')[0] : '';

      const res = await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookie
        }
      });
      const data = await res.json();
      
      if (res.status !== 200 || !data.success) {
        throw new Error(`Expected 200, got ${res.status}`);
      }
    });

    // Test 12: requireAuth middleware
    await test('12. Middleware requireAuth - Blocks unauthenticated', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/profile`, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.status !== 401) {
        throw new Error(`Expected 401, got ${res.status}`);
      }
    });

    // Test 13: requireAuth middleware - Allows authenticated
    await test('13. Middleware requireAuth - Allows authenticated', async () => {
      // Login first
      const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student1@example.com',
          password: 'Password123'
        })
      });
      const loginCookies = loginRes.headers.get('set-cookie');
      const cookie = loginCookies ? loginCookies.split(';')[0] : '';

      const res = await fetch(`${BASE_URL}/api/auth/profile`, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookie
        }
      });
      if (res.status !== 200) {
        throw new Error(`Expected 200, got ${res.status}`);
      }
    });

    // Test 14: requireRole - Student blocked from professor route
    await test('14. Middleware requireRole - Student blocked', async () => {
      // Login as student
      const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student1@example.com',
          password: 'Password123'
        })
      });
      const loginCookies = loginRes.headers.get('set-cookie');
      const cookie = loginCookies ? loginCookies.split(';')[0] : '';

      const res = await fetch(`${BASE_URL}/api/auth/professor-only`, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookie
        }
      });
      if (res.status !== 403) {
        throw new Error(`Expected 403, got ${res.status}`);
      }
    });

    // Test 15: requireRole - Professor allowed
    await test('15. Middleware requireRole - Professor allowed', async () => {
      // Login as professor
      const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'professor1@example.com',
          password: 'Professor123'
        })
      });
      const loginCookies = loginRes.headers.get('set-cookie');
      const cookie = loginCookies ? loginCookies.split(';')[0] : '';

      const res = await fetch(`${BASE_URL}/api/auth/professor-only`, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookie
        }
      });
      if (res.status !== 200) {
        throw new Error(`Expected 200, got ${res.status}`);
      }
    });

    // Test 16: Password not in response
    await test('16. Security - Password not in response', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'security@example.com',
          password: 'SecurePass123',
          name: 'Security Test'
        })
      });
      const data = await res.json();
      const responseStr = JSON.stringify(data);
      
      if (responseStr.includes('SecurePass123') || responseStr.includes('passwordHash')) {
        throw new Error('Password found in response');
      }
    });

    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed out of ${passed + failed}`);
    
    if (failed === 0) {
      console.log('✅ All tests passed!\n');
    } else {
      console.log('❌ Some tests failed\n');
    }

    server.close();
    await sequelize.close();
    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();

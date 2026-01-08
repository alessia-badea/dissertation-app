/**
 * Comprehensive Authentication Tests
 * Tests all endpoints and middleware for Backend Dev 1
 */

const sequelize = require('../config/database');
const User = require('../models/User');
const app = require('../app');
const http = require('http');

// Helper function to make authenticated requests
const makeRequest = async (url, options = {}) => {
  const defaults = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  };
  
  const response = await fetch(url, { ...defaults, ...options });
  const data = await response.json();
  
  // Extract cookies for session management
  const cookies = response.headers.get('set-cookie');
  
  return { response, data, cookies };
};

describe('Authentication Tests', () => {
  let server;
  const BASE_URL = 'http://localhost:5003';
  let sessionCookie = '';

  beforeAll(async () => {
    // Setup database
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Fresh database

    // Start server
    server = http.createServer(app);
    await new Promise((resolve) => {
      server.listen(5003, resolve);
    });
    
    console.log('✓ Test server started on port 5003\n');
  });

  afterAll(async () => {
    if (server) server.close();
    await sequelize.close();
  });

  describe('1. POST /api/auth/register', () => {
    test('1.1 - Register with valid data (success)', async () => {
      const { response, data } = await makeRequest(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
          email: 'student1@example.com',
          password: 'Password123',
          name: 'John Student',
          role: 'student'
        })
      });

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe('student1@example.com');
      expect(data.user.role).toBe('student');
      expect(data.user.passwordHash).toBeUndefined();
    });

    test('1.2 - Register with duplicate email (fail)', async () => {
      const { response, data } = await makeRequest(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
          email: 'student1@example.com',
          password: 'Password456',
          name: 'Duplicate User'
        })
      });

      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.message).toContain('Email deja folosit');
    });

    test('1.3 - Register with missing email (fail)', async () => {
      const { response, data } = await makeRequest(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
          password: 'Password123'
        })
      });

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    test('1.4 - Register with missing password (fail)', async () => {
      const { response, data } = await makeRequest(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com'
        })
      });

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    test('1.5 - Register with invalid email format (fail)', async () => {
      const { response, data } = await makeRequest(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'Password123'
        })
      });

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    test('1.6 - Register with password too short (fail)', async () => {
      const { response, data } = await makeRequest(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
          email: 'test2@example.com',
          password: 'Pass1'
        })
      });

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.errors).toBeDefined();
    });

    test('1.7 - Register professor', async () => {
      const { response, data } = await makeRequest(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
          email: 'professor1@example.com',
          password: 'Professor123',
          name: 'Dr. Jane Professor',
          role: 'professor'
        })
      });

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.user.role).toBe('professor');
    });
  });

  describe('2. POST /api/auth/login', () => {
    test('2.1 - Login with correct credentials (success)', async () => {
      const { response, data, cookies } = await makeRequest(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          email: 'student1@example.com',
          password: 'Password123'
        })
      });

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe('student1@example.com');
      expect(data.user.passwordHash).toBeUndefined();
      
      // Save session cookie for subsequent tests
      if (cookies) {
        sessionCookie = cookies.split(';')[0];
      }
    });

    test('2.2 - Login with wrong password (fail)', async () => {
      const { response, data } = await makeRequest(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          email: 'student1@example.com',
          password: 'WrongPassword123'
        })
      });

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.message).toContain('Credențiale invalide');
    });

    test('2.3 - Login with non-existent email (fail)', async () => {
      const { response, data } = await makeRequest(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'Password123'
        })
      });

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });

    test('2.4 - Login with missing credentials (fail)', async () => {
      const { response, data } = await makeRequest(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({})
      });

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe('3. GET /api/auth/me', () => {
    let authenticatedCookie = '';

    beforeEach(async () => {
      // Login to get session
      const { cookies } = await makeRequest(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          email: 'student1@example.com',
          password: 'Password123'
        })
      });
      if (cookies) {
        authenticatedCookie = cookies.split(';')[0];
      }
    });

    test('3.1 - Get current user with valid session (success)', async () => {
      const { response, data } = await makeRequest(`${BASE_URL}/api/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': authenticatedCookie
        }
      });

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.user).toBeDefined();
      expect(data.user.id).toBeDefined();
      expect(data.user.email).toBe('student1@example.com');
      expect(data.user.role).toBe('student');
      expect(data.user.passwordHash).toBeUndefined();
    });

    test('3.2 - Get current user without session (401)', async () => {
      const { response, data } = await makeRequest(`${BASE_URL}/api/auth/me`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });
  });

  describe('4. POST /api/auth/logout', () => {
    let authenticatedCookie = '';

    beforeEach(async () => {
      // Login to get session
      const { cookies } = await makeRequest(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          email: 'student1@example.com',
          password: 'Password123'
        })
      });
      if (cookies) {
        authenticatedCookie = cookies.split(';')[0];
      }
    });

    test('4.1 - Logout with valid session (success)', async () => {
      const { response, data } = await makeRequest(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': authenticatedCookie
        }
      });

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain('Logout');

      // Verify session is destroyed
      const meResponse = await makeRequest(`${BASE_URL}/api/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': authenticatedCookie
        }
      });
      expect(meResponse.response.status).toBe(401);
    });

    test('4.2 - Logout without session (success - already logged out)', async () => {
      const { response, data } = await makeRequest(`${BASE_URL}/api/auth/logout`, {
        method: 'POST'
      });

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe('5. Middleware Tests', () => {
    test('5.1 - requireAuth middleware blocks unauthenticated requests', async () => {
      const { response, data } = await makeRequest(`${BASE_URL}/api/auth/profile`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect(response.status).toBe(401);
      expect(data.message).toContain('Neautentificat');
    });

    test('5.2 - requireAuth middleware allows authenticated requests', async () => {
      // Login first
      const { cookies } = await makeRequest(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          email: 'student1@example.com',
          password: 'Password123'
        })
      });

      const authenticatedCookie = cookies ? cookies.split(';')[0] : '';

      const { response, data } = await makeRequest(`${BASE_URL}/api/auth/profile`, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': authenticatedCookie
        }
      });

      expect(response.status).toBe(200);
      expect(data.user).toBeDefined();
    });

    test('5.3 - requireRole("professor") blocks students', async () => {
      // Login as student
      const { cookies } = await makeRequest(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          email: 'student1@example.com',
          password: 'Password123'
        })
      });

      const studentCookie = cookies ? cookies.split(';')[0] : '';

      const { response, data } = await makeRequest(`${BASE_URL}/api/auth/professor-only`, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': studentCookie
        }
      });

      expect(response.status).toBe(403);
      expect(data.message).toContain('Acces interzis');
    });

    test('5.4 - requireRole("professor") allows professors', async () => {
      // Login as professor
      const { cookies } = await makeRequest(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          email: 'professor1@example.com',
          password: 'Professor123'
        })
      });

      const professorCookie = cookies ? cookies.split(';')[0] : '';

      const { response, data } = await makeRequest(`${BASE_URL}/api/auth/professor-only`, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': professorCookie
        }
      });

      expect(response.status).toBe(200);
      expect(data.message).toContain('profesor');
    });
  });

  describe('6. Security Tests', () => {
    test('6.1 - Passwords are not returned in responses', async () => {
      const { response, data } = await makeRequest(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
          email: 'security@example.com',
          password: 'SecurePass123',
          name: 'Security Test'
        })
      });

      expect(JSON.stringify(data)).not.toContain('SecurePass123');
      expect(JSON.stringify(data)).not.toContain('passwordHash');
    });

    test('6.2 - Session cookie is httpOnly', async () => {
      const { cookies } = await makeRequest(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          email: 'student1@example.com',
          password: 'Password123'
        })
      });

      if (cookies) {
        expect(cookies.toLowerCase()).toContain('httponly');
      }
    });
  });
});

// Run tests if executed directly
if (require.main === module) {
  let passed = 0;
  let failed = 0;

  const runTests = async () => {
    console.log('🧪 Running Authentication Tests...\n');

    // This is a simplified test runner
    // In production, use Jest, Mocha, or similar
    try {
      await sequelize.authenticate();
      await sequelize.sync({ force: true });

      const server = http.createServer(app);
      await new Promise((resolve) => {
        server.listen(5003, () => {
          console.log('✓ Test server started\n');
          resolve();
        });
      });

      // Run test suites sequentially
      console.log('Note: For full test execution, install Jest or Mocha');
      console.log('Run: npm install --save-dev jest\n');
      console.log('Then use: npm test\n');

      server.close();
      await sequelize.close();
    } catch (error) {
      console.error('❌ Test error:', error);
      process.exit(1);
    }
  };

  runTests();
}

module.exports = { makeRequest, BASE_URL: 'http://localhost:5003' };

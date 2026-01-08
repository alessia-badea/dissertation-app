# Testing Guide - Backend Dev 1

## Running Tests

### Manual Authentication Tests
This is the main test suite that covers all required scenarios:

```bash
cd backend
npm test
# or
node tests/auth-manual.test.js
```

### Individual Test Files

```bash
# Test database connection
npm run test:db

# Test validation rules
npm run test:validation

# Test authentication flow
npm run test:auth
```

## Test Coverage

The `tests/auth-manual.test.js` file covers all tasks from Backend Dev 1:

### ✅ 6. Testing & Validation
- [x] Test POST /api/auth/register (success case)
- [x] Test POST /api/auth/register (duplicate email - fail)
- [x] Test POST /api/auth/login (correct credentials)
- [x] Test POST /api/auth/login (wrong password - fail)
- [x] Test GET /api/auth/me (with valid session)
- [x] Test GET /api/auth/me (without session - 401)
- [x] Test POST /api/auth/logout
- [x] Test middleware requireAuth
- [x] Test middleware requireRole (student vs professor)

### ✅ 7. Security & Input Validation
- [x] Email format validation
- [x] Password minimum length validation (8 characters)
- [x] Password complexity validation (uppercase, lowercase, number)
- [x] Verify passwords are not returned in responses
- [x] Test cookie settings

## Test Scenarios

### 1. Registration Tests
1. ✅ Register with valid data (success)
2. ✅ Register with duplicate email (409)
3. ✅ Register with invalid email format (400)
4. ✅ Register with password too short (400)
5. ✅ Register professor

### 2. Login Tests
6. ✅ Login with correct credentials (200)
7. ✅ Login with wrong password (401)
8. ✅ Login with non-existent user (401)

### 3. Session Management Tests
9. ✅ Get current user with session (200)
10. ✅ Get current user without session (401)
11. ✅ Logout (200)

### 4. Middleware Tests
12. ✅ requireAuth blocks unauthenticated requests (401)
13. ✅ requireAuth allows authenticated requests (200)
14. ✅ requireRole blocks wrong role (403)
15. ✅ requireRole allows correct role (200)

### 5. Security Tests
16. ✅ Passwords not returned in responses

## Expected Test Output

```
🧪 Starting Manual Authentication Tests...

✓ Database connected
✓ Database reset

✓ Server started on port 5004

✅ 1. POST /api/auth/register - Success
✅ 2. POST /api/auth/register - Duplicate email
✅ 3. POST /api/auth/register - Invalid email
✅ 4. POST /api/auth/register - Password too short
✅ 5. POST /api/auth/register - Professor
✅ 6. POST /api/auth/login - Success
✅ 7. POST /api/auth/login - Wrong password
✅ 8. POST /api/auth/login - Non-existent user
✅ 9. GET /api/auth/me - With session
✅ 10. GET /api/auth/me - Without session (401)
✅ 11. POST /api/auth/logout
✅ 12. Middleware requireAuth - Blocks unauthenticated
✅ 13. Middleware requireAuth - Allows authenticated
✅ 14. Middleware requireRole - Student blocked
✅ 15. Middleware requireRole - Professor allowed
✅ 16. Security - Password not in response

📊 Test Results: 16 passed, 0 failed out of 16
✅ All tests passed!
```

## Manual Testing with Postman

### Setup
1. Import the API endpoints into Postman
2. Ensure cookies are enabled in Postman settings
3. Set base URL: `http://localhost:3000`

### Test Flow
1. **Register** → POST `/api/auth/register`
2. **Login** → POST `/api/auth/login` (cookie is saved automatically)
3. **Get Current User** → GET `/api/auth/me` (uses saved cookie)
4. **Protected Route** → GET `/api/auth/profile` (uses saved cookie)
5. **Role-Protected Route** → GET `/api/auth/professor-only` (test with student and professor)
6. **Logout** → POST `/api/auth/logout`

## Troubleshooting

### Tests fail with "Cannot find module"
Make sure you're running tests from the `backend` directory:
```bash
cd backend
npm test
```

### Session cookie not working
- Verify `credentials: 'include'` is set in fetch requests
- Check CORS configuration in `app.js`
- Ensure frontend URL matches CORS origin setting

### Database errors
- Ensure SQLite database file is accessible
- Check `config/database.js` configuration
- Run `npm run test:db` to verify database connection

### Port already in use
If port 5004 is in use, edit `tests/auth-manual.test.js` and change the port number.

## Integration with Frontend

See `API_DOCUMENTATION.md` for complete frontend integration examples.

Key points:
- Always use `credentials: 'include'` in fetch requests
- Session cookies are handled automatically by the browser
- Check `/api/auth/me` on app load to verify authentication status

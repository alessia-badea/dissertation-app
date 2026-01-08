# Backend API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
This API uses **session-based authentication**. Sessions are stored in cookies and managed by `express-session`.

### Important Notes for Frontend
- Set `credentials: 'include'` in all fetch requests
- CORS is configured to allow credentials from `http://localhost:5173` (Vite default)
- Sessions expire after 24 hours of inactivity

---

## Endpoints

### 1. Register User

**POST** `/api/auth/register`

Register a new user (student or professor).

#### Request Body
```json
{
  "email": "student@example.com",
  "password": "Password123",
  "name": "John Doe",
  "role": "student"  // Optional: "student" or "professor" (default: "student")
}
```

#### Validation Rules
- **email**: Required, must be valid email format
- **password**: Required, minimum 8 characters, must contain:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- **name**: Optional string
- **role**: Optional, must be either "student" or "professor"

#### Success Response (201)
```json
{
  "success": true,
  "message": "User înregistrat cu succes",
  "user": {
    "id": 1,
    "email": "student@example.com",
    "role": "student",
    "name": "John Doe"
  }
}
```

#### Error Responses

**400 Bad Request** - Validation failed
```json
{
  "success": false,
  "message": "Parola nu îndeplinește cerințele",
  "errors": [
    "Password must be at least 8 characters",
    "Password must contain at least one uppercase letter"
  ]
}
```

**409 Conflict** - Email already exists
```json
{
  "success": false,
  "message": "Email deja folosit"
}
```

#### Example Request (JavaScript/Fetch)
```javascript
const response = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',  // IMPORTANT: Include credentials for cookies
  body: JSON.stringify({
    email: 'student@example.com',
    password: 'Password123',
    name: 'John Doe',
    role: 'student'
  })
});

const data = await response.json();
```

---

### 2. Login

**POST** `/api/auth/login`

Authenticate a user and create a session.

#### Request Body
```json
{
  "email": "student@example.com",
  "password": "Password123"
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Autentificare reușită",
  "user": {
    "id": 1,
    "email": "student@example.com",
    "role": "student",
    "name": "John Doe"
  }
}
```

**Note**: A session cookie is automatically set in the response. The frontend doesn't need to handle it manually.

#### Error Responses

**400 Bad Request** - Missing credentials
```json
{
  "success": false,
  "message": "Email și parola sunt obligatorii"
}
```

**401 Unauthorized** - Invalid credentials
```json
{
  "success": false,
  "message": "Credențiale invalide"
}
```

#### Example Request
```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',  // IMPORTANT: Include credentials
  body: JSON.stringify({
    email: 'student@example.com',
    password: 'Password123'
  })
});

const data = await response.json();
```

---

### 3. Get Current User

**GET** `/api/auth/me`

Get the currently authenticated user's information.

#### Success Response (200)
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "student@example.com",
    "role": "student",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Error Response (401)
```json
{
  "success": false,
  "message": "Neautentificat"
}
```

#### Example Request
```javascript
const response = await fetch('http://localhost:3000/api/auth/me', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include'  // IMPORTANT: Include credentials
});

const data = await response.json();
```

---

### 4. Logout

**POST** `/api/auth/logout`

Destroy the current session and log out the user.

#### Success Response (200)
```json
{
  "success": true,
  "message": "Logout realizat cu succes"
}
```

#### Example Request
```javascript
const response = await fetch('http://localhost:3000/api/auth/logout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include'  // IMPORTANT: Include credentials
});

const data = await response.json();
```

---

### 5. Protected Route Example - Profile

**GET** `/api/auth/profile`

Get the current user's profile. Requires authentication.

**Middleware**: `requireAuth`

#### Success Response (200)
```json
{
  "user": {
    "id": 1,
    "role": "student",
    "email": "student@example.com"
  }
}
```

#### Error Response (401)
```json
{
  "message": "Neautentificat"
}
```

---

### 6. Role-Protected Route Example

**GET** `/api/auth/professor-only`

Example route that only professors can access.

**Middleware**: `requireRole('professor')`

#### Success Response (200)
```json
{
  "message": "Salut, profesor!"
}
```

#### Error Responses

**401 Unauthorized** - Not authenticated
```json
{
  "message": "Neautentificat"
}
```

**403 Forbidden** - Wrong role
```json
{
  "message": "Acces interzis"
}
```

---

## Response Format

All responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "user": { ... },  // or other data
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]  // Optional: array of validation errors
}
```

---

## Session Configuration

- **Storage**: Database (SQLite) via `connect-session-sequelize`
- **Cookie Name**: `connect.sid`
- **HttpOnly**: `true` (prevents XSS attacks)
- **Secure**: `false` in development, `true` in production
- **SameSite**: `lax` (CSRF protection)
- **MaxAge**: 24 hours (24 * 60 * 60 * 1000 ms)

---

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt (10 salt rounds)
2. **Email Validation**: Email format is validated using regex
3. **Password Validation**: Enforces minimum length and character requirements
4. **Session Security**: HttpOnly cookies prevent XSS attacks
5. **Password Omission**: Passwords are never returned in API responses
6. **Role-Based Access Control**: Middleware enforces role-based permissions

---

## Testing

### Running Manual Tests
```bash
cd backend
node tests/auth-manual.test.js
```

### Testing with Postman/Insomnia

1. **Register a user**:
   - Method: POST
   - URL: `http://localhost:3000/api/auth/register`
   - Body (JSON): 
     ```json
     {
       "email": "test@example.com",
       "password": "Password123",
       "name": "Test User",
       "role": "student"
     }
     ```

2. **Login**:
   - Method: POST
   - URL: `http://localhost:3000/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "Password123"
     }
     ```
   - **Important**: The session cookie will be automatically saved if using a client that supports cookies

3. **Get current user**:
   - Method: GET
   - URL: `http://localhost:3000/api/auth/me`
   - **Important**: Include the session cookie from the login response

4. **Logout**:
   - Method: POST
   - URL: `http://localhost:3000/api/auth/logout`
   - **Important**: Include the session cookie

### Testing with cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123","name":"Test User"}'

# Login (save cookie)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123"}' \
  -c cookies.txt

# Get current user (use cookie)
curl -X GET http://localhost:3000/api/auth/me \
  -b cookies.txt

# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

---

## Error Codes

- **200**: Success
- **201**: Created (registration)
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (not authenticated)
- **403**: Forbidden (wrong role)
- **409**: Conflict (duplicate email)
- **500**: Internal Server Error

---

## Frontend Integration Guide

### React Example

```javascript
// api.js
const API_BASE_URL = 'http://localhost:3000/api';

async function register(email, password, name, role = 'student') {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',  // CRITICAL: Include credentials
    body: JSON.stringify({ email, password, name, role }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return response.json();
}

async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',  // CRITICAL: Include credentials
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return response.json();
}

async function getCurrentUser() {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    credentials: 'include',  // CRITICAL: Include credentials
  });
  
  if (!response.ok) {
    return null;  // Not authenticated
  }
  
  return response.json();
}

async function logout() {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',  // CRITICAL: Include credentials
  });
  
  return response.json();
}

export { register, login, getCurrentUser, logout };
```

### Vite Configuration

Make sure your `vite.config.js` is configured correctly:

```javascript
export default {
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
};
```

---

## Next Steps (Backend Dev 2)

After completing Backend Dev 1, the following features will be added:
- More protected routes
- File upload endpoints
- Registration session management
- Request management endpoints

All authentication middleware (`requireAuth`, `requireRole`) is ready to be used in future routes.

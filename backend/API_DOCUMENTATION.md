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

## Next Steps (Backend Dev 2) - COMPLETED ✅

Backend Dev 2 has been implemented with the following features:
- Registration session management
- Dissertation request management
- File upload endpoints
- Business rule enforcement

### Session Management Endpoints

#### 1. Create Session (Professors Only)

**POST** `/api/sessions`

Create a new registration session.

##### Request Body
```json
{
  "title": "Bachelor Thesis Session 2026",
  "startDate": "2026-02-01T00:00:00.000Z",
  "endDate": "2026-02-28T23:59:59.000Z",
  "maxStudents": 10
}
```

##### Validation Rules
- **title**: Required, non-empty string
- **startDate**: Required, must be in the future
- **endDate**: Required, must be after startDate
- **maxStudents**: Optional, 1-50 (default: 5)
- Professor cannot have overlapping sessions

##### Success Response (201)
```json
{
  "success": true,
  "message": "Session created successfully",
  "session": {
    "id": 1,
    "professorId": 2,
    "title": "Bachelor Thesis Session 2026",
    "startDate": "2026-02-01T00:00:00.000Z",
    "endDate": "2026-02-28T23:59:59.000Z",
    "maxStudents": 10,
    "createdAt": "2026-01-15T10:00:00.000Z",
    "updatedAt": "2026-01-15T10:00:00.000Z",
    "professor": {
      "id": 2,
      "name": "Dr. Smith",
      "email": "smith@university.edu"
    }
  }
}
```

#### 2. Get All Sessions

**GET** `/api/sessions`

Get all active/future sessions for browsing.

##### Success Response (200)
```json
{
  "success": true,
  "sessions": [
    {
      "id": 1,
      "title": "Bachelor Thesis Session 2026",
      "startDate": "2026-02-01T00:00:00.000Z",
      "endDate": "2026-02-28T23:59:59.000Z",
      "maxStudents": 10,
      "currentStudents": 3,
      "availableSpots": 7,
      "professor": {
        "id": 2,
        "name": "Dr. Smith",
        "email": "smith@university.edu"
      },
      "requests": [
        {
          "id": 1,
          "status": "pending"
        }
      ]
    }
  ]
}
```

#### 3. Get Professor's Sessions

**GET** `/api/sessions/my`

Get sessions created by the logged-in professor.

##### Success Response (200)
```json
{
  "success": true,
  "sessions": [
    {
      "id": 1,
      "title": "Bachelor Thesis Session 2026",
      "startDate": "2026-02-01T00:00:00.000Z",
      "endDate": "2026-02-28T23:59:59.000Z",
      "maxStudents": 10,
      "statistics": {
        "total": 5,
        "pending": 2,
        "approved": 2,
        "rejected": 1
      },
      "requests": [...]
    }
  ]
}
```

#### 4. Get Session by ID

**GET** `/api/sessions/:id`

Get details of a specific session.

#### 5. Update Session (Professors Only)

**PUT** `/api/sessions/:id`

Update session details (only if no approved requests exist).

#### 6. Delete Session (Professors Only)

**DELETE** `/api/sessions/:id`

Delete session (only if no requests exist).

### Request Management Endpoints

#### 1. Create Request (Students Only)

**POST** `/api/requests`

Submit a dissertation request to a professor for a specific session.

##### Request Body
```json
{
  "sessionId": 1,
  "professorId": 2
}
```

##### Business Rules
- Student cannot have approved requests
- Cannot submit to same professor in same session
- Session must be active
- Session must have available spots

##### Success Response (201)
```json
{
  "success": true,
  "message": "Request submitted successfully",
  "request": {
    "id": 1,
    "studentId": 1,
    "professorId": 2,
    "sessionId": 1,
    "status": "pending",
    "student": { "id": 1, "name": "John Doe", "email": "john@example.com" },
    "professor": { "id": 2, "name": "Dr. Smith", "email": "smith@university.edu" },
    "session": { "id": 1, "title": "Bachelor Thesis Session 2026" }
  }
}
```

#### 2. Get My Requests

**GET** `/api/requests`

Get all requests for the logged-in user.

#### 3. Get Request by ID

**GET** `/api/requests/:id`

Get details of a specific request.

#### 4. Update Request Status (Professors Only)

**PUT** `/api/requests/:id/status`

Approve or reject a request.

##### Request Body
```json
{
  "status": "approved",
  "reason": "Optional reason for rejection"
}
```

##### Business Rules
- Can only change from 'pending' to 'approved' or 'rejected'
- Professor cannot approve more than session capacity
- Status transitions are validated

#### 5. Upload Student File (Students Only)

**POST** `/api/requests/:id/upload/student`

Upload signed document (PDF/DOC/DOCX, max 10MB).

#### 6. Upload Professor File (Professors Only)

**POST** `/api/requests/:id/upload/professor`

Upload professor's response file.

#### 7. Download File

**GET** `/api/requests/:id/download/:type`

Download student or professor file (type: 'student' or 'professor').

#### 8. Delete Request (Students Only)

**DELETE** `/api/requests/:id`

Delete pending request.

### Business Rules Implemented

1. **Session Overlap Prevention**: Professors cannot create overlapping sessions
2. **Single Approved Request**: Students can have only one approved request
3. **Session Capacity**: Professors cannot approve more requests than session allows
4. **Valid Status Transitions**: Only pending → approved/rejected allowed
5. **File Upload Restrictions**: Files only allowed for approved requests
6. **Role-Based Access**: All endpoints enforce proper authentication and authorization

### Database Schema

#### Sessions Table
- id (Primary Key)
- professorId (Foreign Key → Users)
- title (String)
- startDate (DateTime)
- endDate (DateTime)
- maxStudents (Integer, default: 5)

#### Requests Table
- id (Primary Key)
- studentId (Foreign Key → Users)
- professorId (Foreign Key → Users)
- sessionId (Foreign Key → Sessions)
- status (Enum: 'pending', 'approved', 'rejected')
- reason (Text, nullable)
- studentFilePath (String, nullable)
- professorFilePath (String, nullable)

All authentication middleware (`requireAuth`, `requireRole`) is implemented and used throughout the API.

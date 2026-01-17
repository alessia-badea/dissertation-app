# Dissertation Application Management System

A comprehensive web application designed to streamline the bachelor's thesis application process between students and professors. This Single Page Application (SPA) facilitates the entire workflow from preliminary thesis requests to final document submissions and approvals.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [User Workflows](#user-workflows)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Dissertation Application Management System is a full-stack web application that enables students to submit thesis requests to professors during designated enrollment sessions. The system manages the complete lifecycle of thesis applications, from initial requests through final document approvals, ensuring a structured and transparent process for both students and faculty.

## Features

### For Students
- **Session Discovery**: View active enrollment sessions from available professors
- **Multi-Professor Applications**: Submit preliminary requests to multiple professors
- **Request Tracking**: Monitor the status of all submitted requests in real-time
- **Document Upload**: Upload signed request documents after preliminary approval
- **Automatic Assignment**: Automatically assigned to the first professor who approves their request

### For Professors
- **Session Management**: Create and manage non-overlapping enrollment sessions
- **Request Review**: Review incoming preliminary requests from students
- **Approval Workflow**: Approve or deny requests with optional justification
- **Document Management**: Download student documents and upload signed approvals
- **Student Capacity**: Set maximum number of students per session

### System Features
- **JWT-based Authentication**: Secure token-based authentication system
- **Role-based Access Control**: Separate interfaces and permissions for students and professors
- **File Management**: Secure upload and storage of signed documents
- **Session Validation**: Automatic prevention of overlapping professor sessions
- **Real-time Status Updates**: Immediate reflection of application status changes

## Technology Stack

### Frontend
- **React 19.2.0**: Modern UI library with hooks and context API
- **React Router DOM 7.9.6**: Client-side routing and navigation
- **Vite 7.2.4**: Fast build tool and development server
- **CSS3**: Custom styling with theme variables

### Backend
- **Node.js**: JavaScript runtime environment
- **Express 5.2.1**: Web application framework
- **Sequelize 6.37.7**: ORM for database management
- **SQLite3 5.1.7**: Lightweight SQL database engine

### Authentication & Security
- **JSON Web Tokens (JWT)**: Secure authentication mechanism
- **bcrypt 6.0.0**: Password hashing and encryption
- **express-session 1.18.2**: Session management middleware
- **CORS**: Cross-Origin Resource Sharing support

### Additional Tools
- **Multer 2.0.2**: File upload handling
- **dotenv 17.2.3**: Environment variable management
- **Sequelize CLI**: Database migrations and seeding

## Architecture

The application follows a modern three-tier architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React SPA)                     │
│  - React Components  - Context API  - React Router          │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/JSON
┌──────────────────────────▼──────────────────────────────────┐
│                   Backend (REST API)                         │
│  - Express Server  - JWT Auth  - Controllers  - Middleware  │
└──────────────────────────┬──────────────────────────────────┘
                           │ Sequelize ORM
┌──────────────────────────▼──────────────────────────────────┐
│                    Database (SQLite)                         │
│  - Users  - Sessions  - Requests  - Applications            │
└─────────────────────────────��───────────────────────────────┘
```

**Communication Protocol**: JSON over HTTP  
**Authentication**: JWT tokens with secure HTTP-only cookies  
**File Storage**: Local file system with organized directory structure

## Prerequisites

Before installing the application, ensure you have the following installed on your system:

- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** (for cloning the repository)

To verify your installations:

```bash
node --version
npm --version
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/alessia-badea/dissertation-app.git
cd dissertation-app
```

### 2. Install Root Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Install Frontend Dependencies

```bash
cd ../frontend
npm install
cd ..
```

### 5. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
```

Create a file named `.env` with the following content:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_NAME=dissertation_db
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_DIALECT=sqlite

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Session Configuration
SESSION_SECRET=your_secure_session_secret_here

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

**Important**: Replace `your_secure_jwt_secret_key_here` and `your_secure_session_secret_here` with strong, randomly generated secrets in production.

### 6. Initialize the Database

```bash
# From the backend directory
node init-db.js
```

This will:
- Create the SQLite database
- Run all migrations
- Set up the required tables

### 7. Seed Test Data (Optional)

To populate the database with test accounts and sample data:

```bash
node seed-data.js
```

This creates:
- Test professor accounts
- Test student accounts
- Sample enrollment sessions
- Sample thesis requests

## Running the Application

### Development Mode

You need to run both the backend and frontend servers simultaneously.

#### Terminal 1 - Backend Server

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:3000`

#### Terminal 2 - Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend development server will start on `http://localhost:5173`

### Access the Application

Open your web browser and navigate to:

```
http://localhost:5173
```

### Test Accounts

If you ran the seed script, you can use these test accounts:

**Professor Account:**
- Email: `professor@university.edu`
- Password: `password123`

**Student Account:**
- Email: `student@university.edu`
- Password: `password123`

### Production Build

To create a production build of the frontend:

```bash
cd frontend
npm run build
```

The optimized production files will be generated in the `frontend/dist` directory.

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
dissertation-app/
├── backend/                      # Backend server application
│   ├── config/                   # Configuration files
│   │   ├── auth.js              # Authentication configuration
│   │   ├── config.json          # Database configuration
│   │   ├── database.js          # Database connection setup
│   │   └── session.js           # Session configuration
│   ├── controllers/              # Request handlers
│   │   ├── authController.js    # Authentication logic
│   │   ├── applicationController.js
│   │   ├── requestController.js
│   │   └── sessionController.js
│   ├── middleware/               # Express middleware
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── express-session.js   # Session middleware
│   ├── migrations/               # Database migrations
│   ├── models/                   # Sequelize models
│   │   ├── User.js
│   │   ├── Session.js
│   │   ├── Request.js
│   │   ├── Application.js
│   │   └── index.js
│   ├── routes/                   # API route definitions
│   │   ├── auth.js
│   │   ├── sessions.js
│   │   ├── requests.js
│   │   └── applications.js
│   ├── tests/                    # Test files
│   ├── uploads/                  # File upload directory
│   ├── app.js                    # Express application setup
│   ├── package.json
│   └── .env                      # Environment variables
│
├── frontend/                     # React frontend application
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── api/                  # API client functions
│   │   │   ├── auth.js
│   │   │   ├── sessions.js
│   │   │   ├── requests.js
│   │   │   └── applications.js
│   │   ├── components/           # Reusable React components
│   │   │   ├─�� Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StudentCard.jsx
│   │   │   ├── ApplicationModal.jsx
│   │   │   ├── RequestModal.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/              # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   ├── SessionContext.jsx
│   │   │   ├── RequestContext.jsx
│   │   │   └── ApplicationContext.jsx
│   │   ├── pages/                # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── StudentHomepage.jsx
│   │   │   ├── ProfHomepage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── ApplicationPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── FAQPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── styles/               # Global styles
│   │   │   └── theme.css
│   │   ├── App.jsx               # Root component
│   │   ├── main.jsx              # Application entry point
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── package.json
└── README.md
```

## User Workflows

### Preliminary Request Flow

1. **Student Login**: Student authenticates with university credentials
2. **View Sessions**: Student browses active enrollment sessions
3. **Submit Request**: Student submits preliminary request to chosen professor(s)
4. **Professor Review**: Professor reviews request and either approves or denies with justification
5. **Status Update**: Student receives notification of decision
6. **Automatic Assignment**: If approved, student is assigned to that professor

### Final Request Flow

1. **Document Upload**: Student uploads signed request document
2. **Professor Download**: Professor downloads and reviews the document
3. **Final Decision**: Professor either:
   - Uploads their signature (approval)
   - Rejects the final request with reason
4. **Process Completion**: 
   - If approved: Process complete, student assigned to professor
   - If rejected: Student must apply to a different professor

### Professor Session Management

1. **Create Session**: Professor creates new enrollment session with:
   - Start date
   - End date
   - Maximum student capacity
2. **Validation**: System ensures no overlapping sessions
3. **Activation**: Session becomes visible to students
4. **Management**: Professor can view and manage active sessions

## API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@university.edu",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@university.edu",
    "role": "student",
    "name": "John Doe"
  }
}
```

#### POST `/api/auth/logout`
Invalidate current session.

#### GET `/api/auth/profile`
Get current user profile (requires authentication).

### Session Endpoints

#### GET `/api/sessions`
Get all active sessions.

#### GET `/api/sessions/:id`
Get specific session details.

#### POST `/api/sessions` (Professor only)
Create new enrollment session.

**Request Body:**
```json
{
  "startDate": "2024-01-15",
  "endDate": "2024-02-15",
  "maxStudents": 10
}
```

#### DELETE `/api/sessions/:id` (Professor only)
Delete enrollment session.

### Request Endpoints

#### GET `/api/requests`
Get all requests (filtered by user role).

#### POST `/api/requests` (Student only)
Submit preliminary request.

**Request Body:**
```json
{
  "professorId": 5,
  "sessionId": 12,
  "thesisTitle": "Machine Learning in Healthcare",
  "thesisDescription": "Research on ML applications..."
}
```

#### PUT `/api/requests/:id/approve` (Professor only)
Approve preliminary request.

#### PUT `/api/requests/:id/deny` (Professor only)
Deny preliminary request.

**Request Body:**
```json
{
  "justification": "Reason for denial..."
}
```

### Application Endpoints

#### POST `/api/applications/:id/upload` (Student only)
Upload signed document.

#### POST `/api/applications/:id/approve` (Professor only)
Approve final application with signature upload.

#### POST `/api/applications/:id/reject` (Professor only)
Reject final application.

For complete API documentation, see [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md).

## Database Schema

### Users Table
```sql
CREATE TABLE Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'professor') NOT NULL,
  maxStudents INTEGER DEFAULT NULL,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### Sessions Table
```sql
CREATE TABLE Sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  professorId INTEGER NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  maxStudents INTEGER DEFAULT 10,
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (professorId) REFERENCES Users(id)
);
```

### Requests Table
```sql
CREATE TABLE Requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentId INTEGER NOT NULL,
  professorId INTEGER NOT NULL,
  sessionId INTEGER NOT NULL,
  status ENUM('pending', 'approved', 'denied') DEFAULT 'pending',
  thesisTitle VARCHAR(255),
  thesisDescription TEXT,
  justification TEXT,
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (studentId) REFERENCES Users(id),
  FOREIGN KEY (professorId) REFERENCES Users(id),
  FOREIGN KEY (sessionId) REFERENCES Sessions(id)
);
```

### Applications Table
```sql
CREATE TABLE Applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  requestId INTEGER NOT NULL,
  studentId INTEGER NOT NULL,
  professorId INTEGER NOT NULL,
  sessionId INTEGER NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  studentFilePath VARCHAR(255),
  professorFilePath VARCHAR(255),
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (requestId) REFERENCES Requests(id),
  FOREIGN KEY (studentId) REFERENCES Users(id),
  FOREIGN KEY (professorId) REFERENCES Users(id),
  FOREIGN KEY (sessionId) REFERENCES Sessions(id)
);
```

## Testing

### Backend Tests

Run all backend tests:

```bash
cd backend
npm test
```

Run specific test suites:

```bash
# Database tests
npm run test:db

# Authentication tests
npm run test:auth

# Validation tests
npm run test:validation
```

### Manual Testing

Test accounts are available after running the seed script. See [TESTING_GUIDE.md](backend/TESTING_GUIDE.md) for detailed testing procedures.

### API Testing

Use the provided PowerShell script for endpoint testing:

```powershell
cd backend
.\test-endpoints.ps1
```

Or use tools like Postman or cURL to test individual endpoints.

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit Your Changes**
   ```bash
   git commit -m "Add: description of your changes"
   ```
4. **Push to Your Branch**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request**

### Code Style

- Follow existing code formatting and conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure all tests pass before submitting PR

### Commit Message Convention

- `Add:` for new features
- `Fix:` for bug fixes
- `Update:` for modifications to existing features
- `Refactor:` for code refactoring
- `Docs:` for documentation changes

## License

This project is licensed under the ISC License. See the LICENSE file for details.

## Support

For issues, questions, or contributions, please:

- **Open an Issue**: [GitHub Issues](https://github.com/alessia-badea/dissertation-app/issues)
- **Submit a Pull Request**: [GitHub Pull Requests](https://github.com/alessia-badea/dissertation-app/pulls)

## Acknowledgments

- Built with React and Express
- Database management powered by Sequelize
- Authentication secured with JWT
- UI components styled with custom CSS

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Maintained by**: Alessia Badea

# Applications API Documentation

## Overview
Backend API for managing dissertation applications between students and professors.

## Database Model

### Applications Table
- `id` - INTEGER (Primary Key, Auto Increment)
- `studentId` - INTEGER (Foreign Key → Users.id)
- `professorId` - INTEGER (Foreign Key → Users.id)
- `thesisTitle` - STRING (Required)
- `thesisDescription` - TEXT (Required)
- `status` - ENUM (pending, approved, rejected, document_pending, document_rejected, completed)
- `documentUrl` - STRING (Optional - for student's uploaded document)
- `professorDocumentUrl` - STRING (Optional - for professor's signed document)
- `rejectionMessage` - TEXT (Optional)
- `createdAt` - DATETIME
- `updatedAt` - DATETIME

## API Endpoints

### 1. Create Application
**POST** `/api/applications`
- **Auth Required:** Yes (Student only)
- **Body:**
  ```json
  {
    "professorId": 1,
    "thesisTitle": "AI in Healthcare",
    "thesisDescription": "Description of the thesis..."
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "Cererea a fost trimisă cu succes",
    "application": {
      "id": 1,
      "studentId": 2,
      "professorId": 1,
      "thesisTitle": "AI in Healthcare",
      "thesisDescription": "Description...",
      "status": "pending",
      "professor": {
        "id": 1,
        "name": "Dr. Sarah Mitchell",
        "email": "sarah@example.com"
      }
    }
  }
  ```

### 2. Get My Applications
**GET** `/api/applications`
- **Auth Required:** Yes
- **Response (200):**
  ```json
  {
    "success": true,
    "applications": [
      {
        "id": 1,
        "studentId": 2,
        "professorId": 1,
        "thesisTitle": "AI in Healthcare",
        "status": "pending",
        "professor": {
          "id": 1,
          "name": "Dr. Sarah Mitchell"
        },
        "createdAt": "2026-01-14T10:00:00.000Z"
      }
    ]
  }
  ```

### 3. Get Application by ID
**GET** `/api/applications/:id`
- **Auth Required:** Yes
- **Response (200):**
  ```json
  {
    "success": true,
    "application": {
      "id": 1,
      "thesisTitle": "AI in Healthcare",
      "status": "pending",
      "student": { "id": 2, "name": "John Doe" },
      "professor": { "id": 1, "name": "Dr. Sarah Mitchell" }
    }
  }
  ```

### 4. Update Application Status
**PUT** `/api/applications/:id/status`
- **Auth Required:** Yes (Professor only)
- **Body:**
  ```json
  {
    "status": "approved",
    "rejectionMessage": "Optional rejection reason"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Statusul cererii a fost actualizat",
    "application": { ... }
  }
  ```

### 5. Delete Application
**DELETE** `/api/applications/:id`
- **Auth Required:** Yes (Student only, pending status only)
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Cererea a fost ștearsă"
  }
  ```

## Status Flow

1. **pending** - Student submitted, waiting for professor approval
2. **approved** - Professor approved, student can upload document
3. **rejected** - Professor rejected the proposal
4. **document_pending** - Student uploaded document, waiting for professor review
5. **document_rejected** - Professor rejected document, student must resubmit
6. **completed** - All steps complete, both documents signed

## Business Rules

1. Students can only have ONE active application per professor (pending/approved/document_pending/completed)
2. Only students can create applications
3. Only professors can update application status
4. Only students can delete their own pending applications
5. Applications can only be deleted if status is "pending"

## Files Created

- `backend/models/Application.js` - Sequelize model
- `backend/models/index.js` - Model associations
- `backend/controllers/applicationController.js` - Business logic
- `backend/routes/applications.js` - API routes
- `backend/sync-db.js` - Database sync script
- `frontend/src/api/applications.js` - Frontend API service
- `frontend/src/context/ApplicationContext.jsx` - React context for state management

## Setup

1. Run database sync:
   ```bash
   node backend/sync-db.js
   ```

2. Restart backend server:
   ```bash
   npm start
   ```

3. Frontend will automatically fetch applications on load

## Integration Status

✅ Backend API complete
✅ Database model created
✅ Frontend API service created
✅ React context integrated
✅ ApplicationPage integrated with API
✅ StudentHomepage displays applications from database
✅ Per-user application storage working

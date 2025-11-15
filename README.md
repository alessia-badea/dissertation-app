App Specifications
This app aims to allow students to apply for their bachelor’s thesis project. It will consist of a web application, of Single Page Application type, accessible to browsers, mobile devices or tablets.
Architecture style: SPA frontend (React) + REST API backend (Node.js / Express) + database (SQL or MongoDB).
Communication: JSON over HTTP.
File storage: Local or server file system.
Authentication: JWT-based.
Functionalities
-	The app allows two types of users: students and professors. 
-	Each professor should have enrolment sessions, which cannot overlap
-	During an enrolment session, students can submit a preliminary request to work with a professor on their thesis
-	The request may be either approved, or denied (with reason) by the professor.
-	A student may submit requests to multiple teachers, but may only work with the first professor who approves his request. 
-	After the preliminary request is approved, the student can upload a file (the signed request paper)
-	As response, the professor can upload their own signature, or deny the request, meaning the student has to find a new professor
Feature work flow
Preliminary request flow:
1.	Student logs in.
2.	Student views active sessions.
3.	Student sends a preliminary request to a professor.
4.	Professor receives request, then they approve or denie (with reason).
5.	If approved, the student moves to final request stage.
Final request flow:
1.	Student uploads signed document.
2.	Professor downloads it.
3.	Professor uploads their signature OR rejects the final.
4.	If rejected, the student must apply to someone else.

Project Planning
User roles: student, professor.
Main objects:
-	User
-	Session
-	Preliminary requests
-	Final requests (with file)
-	Professor response
API endpoints:
-	Login (POST)
-	Get user profile (GET)
-	CRUD sessions (GET/POST/DELETE)
-	Create preliminary request (POST)	
-	Approve/reject preliminary (POST)
-	Upload final request file (POST)	
-	Professor final decision (POST)
Database design
Entities:
1.	User (id, name, email, passHash, role)
2.	Session (id, profId, startDate, endDate) + constraint no overlapping sessions for the same professor
3.	Request (id, studId, profId, sessionId, status, justification – nullable, filePathStudent, filePathProf)

Frontend plan
-	Login Page
-	Student Dashboard
-	Professor Dashboard
-	Sessions Management Page (Professor)
-	Request Submission Page (Student)
-	Request Review Page (Professor)


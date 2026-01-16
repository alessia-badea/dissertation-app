# Student Homepage Integration - TODO

## Current Status
✅ Professor side fully integrated with backend (Sessions, Requests, Current Students)
✅ Test data created (5 students, 2 pending requests, 3 approved requests)
✅ Database properly configured
✅ Backend API working correctly

## What Needs to be Done

### 1. Update StudentHomepage.jsx
**Location:** `frontend/src/pages/StudentHomepage.jsx`

**Changes needed:**
- Replace `useApplications` with `useSession` and `useRequest`
- Update "Professors List" tab to show **active registration sessions** instead of mock professors
- Display sessions with:
  - Professor name
  - Session title and dates
  - Available slots (maxStudents - current approved requests)
  - "Apply" button (disabled if already applied or no slots)
  
**Code structure:**
```javascript
// Import contexts
import { useSession } from '../context/SessionContext';
import { useRequest } from '../context/RequestContext';

// Get data
const { sessions } = useSession();
const { myRequests, createRequest } = useRequest();

// Check if already applied to a session
const hasAppliedToSession = (sessionId) => {
  return myRequests?.some(r => r.sessionId === sessionId);
};

// Handle apply button
const handleApplyToSession = async (session) => {
  const result = await createRequest({
    sessionId: session.id,
    professorId: session.professorId
  });
  
  if (result.success) {
    // Show success message
  }
};
```

### 2. Update Dashboard Tab
**Show real request status:**
- Pending requests (waiting for professor approval)
- Approved requests (can upload document)
- Rejected requests (with reason)

**Display:**
```javascript
const hasRequests = myRequests && myRequests.length > 0;

{hasRequests ? (
  myRequests.map(request => (
    <div key={request.id}>
      <h4>{request.professor?.name}</h4>
      <p>{request.session?.title}</p>
      <span className={`status-${request.status}`}>
        {request.status === 'pending' && 'Pending Approval'}
        {request.status === 'approved' && 'Approved - Upload Document'}
        {request.status === 'rejected' && 'Rejected'}
      </span>
    </div>
  ))
) : (
  <p>No active requests</p>
)}
```

### 3. Add Request Context Method
**Location:** `frontend/src/context/RequestContext.jsx`

**Add method to fetch student's own requests:**
```javascript
const fetchMyRequests = async () => {
  try {
    const response = await requestAPI.getMyRequests(); // Need to create this
    setMyRequests(response.requests || []);
  } catch (err) {
    console.error('Failed to fetch my requests:', err);
  }
};
```

### 4. Create Student Request API
**Location:** `frontend/src/api/requests.js`

**Add:**
```javascript
// Get student's own requests
export async function getMyRequests() {
  const response = await fetch(`${API_BASE_URL}/requests/my`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch requests');
  }
  
  return response.json();
}
```

### 5. Backend: Add Student Request Endpoint
**Location:** `backend/controllers/requestController.js`

**Add method:**
```javascript
// Get student's own requests
exports.getMyRequests = async (req, res) => {
  try {
    const studentId = req.session.user.id;
    
    const requests = await Request.findAll({
      where: { studentId },
      include: [
        {
          model: User,
          as: 'professor',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Session,
          as: 'session',
          attributes: ['id', 'title', 'startDate', 'endDate']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving requests'
    });
  }
};
```

**Add route in `backend/routes/requests.js`:**
```javascript
router.get('/my', requireAuth, requireRole('student'), requestController.getMyRequests);
```

## Testing Steps

1. **Login as student:**
   - Email: `emma@test.com`
   - Password: `Student123!`

2. **Check Dashboard:**
   - Should show 1 pending request to Dr. Sarah Mitchell

3. **Browse Sessions:**
   - Should see 1 active session (Jan 11 - Feb 10, 2026)
   - Should show "Applied" button (already applied)

4. **Test with another student:**
   - Login as `sarah@test.com` / `Student123!`
   - Should see approved request
   - Should be able to upload document

## Files to Modify

1. ✅ `frontend/src/pages/StudentHomepage.jsx` - Main UI updates
2. ✅ `frontend/src/context/RequestContext.jsx` - Add myRequests state and fetchMyRequests
3. ✅ `frontend/src/api/requests.js` - Add getMyRequests API call
4. ✅ `backend/controllers/requestController.js` - Add getMyRequests method
5. ✅ `backend/routes/requests.js` - Add GET /my route

## Next Session Goals

1. Complete Student homepage integration
2. Test full workflow: Student applies → Professor approves → Student uploads → Professor reviews
3. Add file upload functionality (if time permits)
4. Polish UI/UX

## Notes

- The backend is already set up correctly with Sessions and Requests
- Test data is in place (2 pending, 3 approved requests)
- Professor side is fully functional
- Just need to connect Student frontend to existing backend APIs

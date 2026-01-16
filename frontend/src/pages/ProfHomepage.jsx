import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSession } from '../context/SessionContext';
import { useRequest } from '../context/RequestContext';
import Header from '../components/Header';
import RequestModal from '../components/RequestModal';
import StudentModal from '../components/StudentModal';
import './ProfHomepage.css';

export default function ProfHomepage() {
  const { user: authUser, logout } = useAuth();
  const { mySessions, createSession: createSessionAPI, deleteSession: deleteSessionAPI, loading: sessionsLoading } = useSession();
  const { requests, updateRequestStatus, loading: requestsLoading } = useRequest();
  const [activeMenu, setActiveMenu] = useState('requests');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [professorDocument, setProfessorDocument] = useState(null);
  const [studentRequests, setStudentRequests] = useState([
    {
      id: 1,
      name: 'Emma Johnson',
      initials: 'EJ',
      thesisTitle: 'Machine Learning Applications in Healthcare Diagnostics',
      thesisDescription: 'This research aims to develop and evaluate machine learning models for early disease detection in medical imaging. The study will focus on creating algorithms that can analyze X-rays, MRIs, and CT scans to identify patterns indicative of various conditions. The methodology includes data collection from medical databases, preprocessing techniques, and the implementation of convolutional neural networks for image classification.',
      faculty: 'Computer Science',
      year: 'Year 3',
      submittedDate: '2 days ago'
    },
    {
      id: 2,
      name: 'Michael Chen',
      initials: 'MC',
      thesisTitle: 'Blockchain Technology for Supply Chain Management',
      thesisDescription: 'This dissertation explores the implementation of blockchain technology to enhance transparency and efficiency in supply chain operations. The research will investigate how distributed ledger technology can track products from manufacturing to delivery, reduce fraud, and improve stakeholder trust. The study includes developing a prototype system and conducting case studies with real-world supply chain scenarios.',
      faculty: 'Computer Science',
      year: 'Year 3',
      submittedDate: '5 days ago'
    },
    {
      id: 3,
      name: 'Sarah Williams',
      initials: 'SW',
      thesisTitle: 'Natural Language Processing for Sentiment Analysis',
      thesisDescription: 'This research focuses on developing advanced NLP techniques for analyzing sentiment in social media data. The project will create models capable of understanding context, sarcasm, and cultural nuances in text. The methodology involves collecting large datasets from Twitter and Reddit, implementing transformer-based models, and evaluating their performance against existing sentiment analysis tools.',
      faculty: 'Computer Science',
      year: 'Year 3',
      submittedDate: '1 week ago'
    }
  ]);
  const [currentStudents, setCurrentStudents] = useState([
    {
      id: 4,
      name: 'David Brown',
      initials: 'DB',
      thesisTitle: 'Deep Learning for Image Recognition in Medical Imaging',
      thesisDescription: 'This research explores deep learning architectures for medical image analysis.',
      faculty: 'Computer Science',
      year: 'Year 3',
      startedDate: '2 months ago',
      hasUploadedDocument: true,
      studentDocumentUrl: 'dissertation_david_brown.pdf',
      studentDocumentDate: '1 week ago',
      professorDocumentUrl: null,
      documentStatus: 'pending_review' // pending_review, approved, rejected
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      initials: 'LA',
      thesisTitle: 'Cybersecurity Frameworks for IoT Devices',
      thesisDescription: 'This study focuses on developing security frameworks for IoT ecosystems.',
      faculty: 'Computer Science',
      year: 'Year 3',
      startedDate: '3 months ago',
      hasUploadedDocument: false,
      studentDocumentUrl: null,
      studentDocumentDate: null,
      professorDocumentUrl: null,
      documentStatus: 'waiting_upload' // waiting_upload, pending_review, approved, rejected
    }
  ]);
  const [registrationSessions, setRegistrationSessions] = useState([
    {
      id: 1,
      startDate: '2024-03-01',
      endDate: '2024-03-15'
    },
    {
      id: 2,
      startDate: '2024-06-01',
      endDate: '2024-06-30'
    }
  ]);
  const [error, setError] = useState('');

  // Format user data for Header component
  const getInitials = (name) => {
    if (!name) return 'PR';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const user = {
    name: authUser?.name || 'Professor',
    role: 'Professor',
    initials: getInitials(authUser?.name)
  };

  const openRequestModal = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
    setDeclineReason('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setDeclineReason('');
  };

  const handleAcceptRequest = () => {
    if (!selectedRequest) {
      console.error('No request selected');
      return;
    }
    
    console.log('Accepted request:', selectedRequest.id);
    
    // Remove from requests list
    setStudentRequests(studentRequests.filter(req => req.id !== selectedRequest.id));
    
    // Add to current students with today's date
    const newStudent = {
      ...selectedRequest,
      startedDate: 'Just now'
    };
    setCurrentStudents([newStudent, ...currentStudents]);
    
    // TODO: Call backend API to accept request
    closeModal();
  };

  const handleDeclineRequest = async () => {
    if (!declineReason.trim()) {
      alert('Please provide a reason for declining');
      return;
    }
    
    const result = await updateRequestStatus(selectedRequest.id, 'rejected', declineReason);
    if (result.success) {
      console.log('Request declined');
    }
    
    closeModal();
  };

  const handleView = (requestId) => {
    const request = requests?.find(r => r.id === requestId);
    if (request) {
      setSelectedStudent(request);
      setShowStudentModal(true);
      setRejectionMessage('');
      setProfessorDocument(null);
    }
  };

  const closeStudentModal = () => {
    setShowStudentModal(false);
    setSelectedStudent(null);
    setRejectionMessage('');
    setProfessorDocument(null);
  };

  const handleApproveDocument = () => {
    if (!professorDocument) {
      alert('Please upload your signed document');
      return;
    }
    
    console.log('Approved document for student:', selectedStudent.id);
    console.log('Professor document:', professorDocument);
    
    // Update student status
    setCurrentStudents(currentStudents.map(s => 
      s.id === selectedStudent.id 
        ? { ...s, documentStatus: 'approved', professorDocumentUrl: professorDocument.name }
        : s
    ));
    
    // TODO: Call backend API to approve and upload professor document
    closeStudentModal();
  };

  const handleRejectDocument = () => {
    if (!rejectionMessage.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    console.log('Rejected document for student:', selectedStudent.id);
    console.log('Rejection reason:', rejectionMessage);
    
    // Update student status
    setCurrentStudents(currentStudents.map(s => 
      s.id === selectedStudent.id 
        ? { ...s, documentStatus: 'rejected', hasUploadedDocument: false, studentDocumentUrl: null }
        : s
    ));
    
    // TODO: Call backend API to reject document with reason
    closeStudentModal();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfessorDocument(file);
    }
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    setError('');

    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    // Create session via backend API
    // Add time to ensure dates are in the future (set to noon to avoid timezone issues)
    const startDateTime = new Date(startDate + 'T12:00:00');
    const endDateTime = new Date(endDate + 'T23:59:59');
    
    const result = await createSessionAPI({
      title: `Registration Session ${startDateTime.toLocaleDateString()}`,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      maxStudents: authUser?.maxStudents || 5
    });

    if (result.success) {
      setStartDate('');
      setEndDate('');
      setError('');
    } else {
      setError(result.error || 'Failed to create session');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    const result = await deleteSessionAPI(sessionId);
    if (!result.success) {
      setError(result.error || 'Failed to delete session');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    const oneYearFromNow = new Date(today);
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    return oneYearFromNow.toISOString().split('T')[0];
  };

  const getSessionStatus = (session) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(session.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(session.endDate);
    end.setHours(0, 0, 0, 0);

    if (today >= start && today <= end) {
      return 'active';
    }
    return 'upcoming';
  };

  return (
    <div className="prof-homepage">
      {/* Header */}
      <Header user={user} />

      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="sidebar-menu">
            <div 
              className={`menu-item ${activeMenu === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveMenu('requests')}
            >
              <svg className="menu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Requests</span>
            </div>
            <div 
              className={`menu-item ${activeMenu === 'current' ? 'active' : ''}`}
              onClick={() => setActiveMenu('current')}
            >
              <svg className="menu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Current Students</span>
            </div>
            <div 
              className={`menu-item ${activeMenu === 'registration' ? 'active' : ''}`}
              onClick={() => {
                setActiveMenu('registration');
                setError('');
              }}
            >
              <svg className="menu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Registration Sessions</span>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="content-area">
          <div className="main-card">
            {/* Page Header */}
            <div className="page-header">
              <div className="page-title-section">
                <div className={`page-icon ${activeMenu === 'requests' ? 'mint' : activeMenu === 'current' ? 'rose' : 'sage'}`}>
                  {activeMenu === 'requests' ? (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : activeMenu === 'current' ? (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className="page-title-content">
                  <h1>
                    {activeMenu === 'requests' ? 'Student Requests' : 
                     activeMenu === 'current' ? 'Current Students' : 
                     'Registration Sessions'}
                  </h1>
                  <p className="page-subtitle">
                    {activeMenu === 'requests' 
                      ? 'Review and respond to dissertation supervision requests' 
                      : activeMenu === 'current'
                      ? 'Manage your current dissertation students'
                      : 'Manage your availability for student registration'}
                  </p>
                </div>
              </div>
              {activeMenu !== 'registration' && (
                <div className="count-badge">
                  {activeMenu === 'requests' 
                    ? (requests?.filter(r => r.status === 'pending').length || 0)
                    : (requests?.filter(r => r.status === 'approved').length || 0)} {activeMenu === 'requests' ? 'Pending' : 'Active'}
                </div>
              )}
            </div>

            {/* Content */}
            {activeMenu === 'requests' ? (
              <div className="student-list">
                {requests && requests.filter(r => r.status === 'pending').length > 0 ? (
                  requests.filter(r => r.status === 'pending').map((request) => (
                    <div key={request.id} className="student-card">
                      <div className="student-avatar">
                        {request.student?.name ? request.student.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'ST'}
                      </div>
                      <div className="student-info">
                        <div 
                          className="student-name clickable" 
                          onClick={() => openRequestModal(request)}
                          style={{ cursor: 'pointer' }}
                        >
                          {request.student?.name || 'Unknown Student'}
                        </div>
                        <div className="thesis-title">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>Request for Session: {request.session?.title || 'N/A'}</span>
                        </div>
                        <div className="student-meta">
                          <div className="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>{request.student?.email || 'N/A'}</span>
                          </div>
                          <div className="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="student-actions">
                        <button className="action-btn btn-accept" onClick={async () => {
                          const result = await updateRequestStatus(request.id, 'approved');
                          if (result.success) {
                            console.log('Request approved');
                          }
                        }}>
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Accept
                        </button>
                        <button className="action-btn btn-decline" onClick={() => openRequestModal(request)}>
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Decline
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3>No Pending Requests</h3>
                    <p>You don't have any pending dissertation supervision requests at the moment.</p>
                  </div>
                )}
              </div>
            ) : activeMenu === 'registration' ? (
              <div className="registration-content">
                {/* Add New Session Form */}
                <div className="registration-form-section">
                  <h3 className="section-title">Add New Registration Period</h3>
                  <form onSubmit={handleAddSession} className="registration-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Start Date</label>
                        <input
                          type="date"
                          className="form-input"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          min={getMinDate()}
                          max={getMaxDate()}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">End Date</label>
                        <input
                          type="date"
                          className="form-input"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={startDate || getMinDate()}
                          max={getMaxDate()}
                        />
                      </div>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="submit-btn">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Add Registration Period
                    </button>
                  </form>
                </div>

                {/* Existing Sessions List */}
                <div className="sessions-list-section">
                  <h3 className="section-title">Scheduled Registration Periods</h3>
                  {mySessions && mySessions.length > 0 ? (
                    <div className="sessions-list">
                      {mySessions.map((session) => {
                        const status = getSessionStatus(session);
                        return (
                          <div key={session.id} className={`session-card ${status}`}>
                            <div className="session-info">
                              <div className="session-dates">
                                <div className="date-item">
                                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  <div>
                                    <span className="date-label">Start</span>
                                    <span className="date-value">{formatDate(session.startDate)}</span>
                                  </div>
                                </div>
                                <div className="date-separator">→</div>
                                <div className="date-item">
                                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  <div>
                                    <span className="date-label">End</span>
                                    <span className="date-value">{formatDate(session.endDate)}</span>
                                  </div>
                                </div>
                              </div>
                              <span className={`status-badge ${status}`}>
                                {status === 'active' ? 'Active Now' : 'Upcoming'}
                              </span>
                            </div>
                            <button 
                              className="delete-session-btn"
                              onClick={() => handleDeleteSession(session.id)}
                              title="Delete session"
                            >
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h3>No Registration Periods Scheduled</h3>
                      <p>Add your first registration period to allow students to apply for dissertation supervision.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : activeMenu === 'requests' ? (
              <div className="student-list">
                {studentRequests.length > 0 ? (
                  studentRequests.map((student) => (
                    <div key={student.id} className="student-card">
                      <div className="student-avatar">{student.initials}</div>
                      <div className="student-info">
                        <div 
                          className="student-name clickable" 
                          onClick={() => openRequestModal(student)}
                          style={{ cursor: 'pointer' }}
                        >
                          {student.name}
                        </div>
                        <div className="thesis-title">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{student.thesisTitle}</span>
                        </div>
                        <div className="student-meta">
                          <div className="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>{student.faculty}</span>
                          </div>
                          <div className="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>{student.year}</span>
                          </div>
                          <div className="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <span>{student.submittedDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="student-actions">
                        <button className="action-btn btn-accept" onClick={() => {
                          setSelectedRequest(student);
                          console.log('Accepted request:', student.id);
                          // TODO: Call backend API to accept request
                        }}>
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Accept
                        </button>
                        <button className="action-btn btn-decline" onClick={() => openRequestModal(student)}>
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Decline
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3>No Pending Requests</h3>
                    <p>You don't have any pending dissertation supervision requests at the moment.</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {(() => {
                  // Get approved requests (these are current students)
                  const approvedRequests = requests?.filter(r => r.status === 'approved') || [];
                  
                  // Separate by file upload status
                  const pendingReview = approvedRequests.filter(r => r.studentFilePath && !r.professorFilePath);
                  const others = approvedRequests.filter(r => !r.studentFilePath || r.professorFilePath);
                  
                  return (
                    <>
                      {/* Pending Review Section */}
                      {pendingReview.length > 0 && (
                        <div className="student-section">
                          <div className="section-header">
                            <h3 className="section-title">
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                              Awaiting Your Review
                            </h3>
                            <span className="section-count">{pendingReview.length}</span>
                          </div>
                          <div className="student-list">
                            {pendingReview.map((request) => (
                              <div key={request.id} className="student-card pending-review">
                                <div className="student-avatar">
                                  {request.student?.name ? request.student.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'ST'}
                                </div>
                                <div className="student-info">
                                  <div className="student-name">{request.student?.name || 'Unknown Student'}</div>
                                  <div className="thesis-title">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span>Session: {request.session?.title || 'N/A'}</span>
                                  </div>
                                  <div className="student-meta">
                                    <div className="meta-item">
                                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                      <span>{request.student?.email || 'N/A'}</span>
                                    </div>
                                    <div className="meta-item">
                                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                      </svg>
                                      <span>Approved {new Date(request.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="meta-item status-indicator">
                                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                      <span className="status-text">Document uploaded - awaiting review</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="student-actions">
                                  <button className="action-btn btn-view" onClick={() => handleView(request.id)}>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Review Document
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Other Students Section */}
                      {others.length > 0 && (
                        <div className="student-section">
                          <div className="section-header">
                            <h3 className="section-title">
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Other Students
                            </h3>
                            <span className="section-count">{others.length}</span>
                          </div>
                          <div className="student-list">
                            {others.map((request) => (
                              <div key={request.id} className="student-card">
                                <div className="student-avatar">
                                  {request.student?.name ? request.student.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'ST'}
                                </div>
                                <div className="student-info">
                                  <div className="student-name">{request.student?.name || 'Unknown Student'}</div>
                                  <div className="thesis-title">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span>Session: {request.session?.title || 'N/A'}</span>
                                  </div>
                                  <div className="student-meta">
                                    <div className="meta-item">
                                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                      <span>{request.student?.email || 'N/A'}</span>
                                    </div>
                                    <div className="meta-item">
                                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                      </svg>
                                      <span>Approved {new Date(request.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="meta-item status-indicator">
                                      {!request.studentFilePath ? (
                                        <>
                                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                          </svg>
                                          <span className="status-text waiting">Waiting for student upload</span>
                                        </>
                                      ) : request.professorFilePath ? (
                                        <>
                                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                          <span className="status-text approved">Completed</span>
                                        </>
                                      ) : (
                                        <>
                                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                            <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                          <span className="status-text rejected">In progress</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="student-actions">
                                  <button className="action-btn btn-view" onClick={() => handleView(request.id)}>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    View Details
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Empty State */}
                      {approvedRequests.length === 0 && (
                        <div className="empty-state">
                          <div className="empty-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <h3>No Current Students</h3>
                          <p>You are not currently supervising any dissertation students.</p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {showModal && (
        <RequestModal
          selectedRequest={selectedRequest}
          declineReason={declineReason}
          setDeclineReason={setDeclineReason}
          onClose={closeModal}
          onAccept={handleAcceptRequest}
          onDecline={handleDeclineRequest}
        />
      )}

      {showStudentModal && (
        <StudentModal
          selectedStudent={selectedStudent}
          rejectionMessage={rejectionMessage}
          setRejectionMessage={setRejectionMessage}
          professorDocument={professorDocument}
          onFileChange={handleFileChange}
          onClose={closeStudentModal}
          onApprove={handleApproveDocument}
          onReject={handleRejectDocument}
        />
      )}
    </div>
  );
}

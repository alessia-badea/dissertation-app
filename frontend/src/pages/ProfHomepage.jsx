import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import './ProfHomepage.css';

export default function ProfHomepage() {
  const { user: authUser, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState('requests');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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

  // Mock data for student requests
  const studentRequests = [
    {
      id: 1,
      name: 'Emma Johnson',
      initials: 'EJ',
      thesisTitle: 'Machine Learning Applications in Healthcare Diagnostics',
      faculty: 'Computer Science',
      year: 'Year 3',
      submittedDate: '2 days ago'
    },
    {
      id: 2,
      name: 'Michael Chen',
      initials: 'MC',
      thesisTitle: 'Blockchain Technology for Supply Chain Management',
      faculty: 'Computer Science',
      year: 'Year 3',
      submittedDate: '5 days ago'
    },
    {
      id: 3,
      name: 'Sarah Williams',
      initials: 'SW',
      thesisTitle: 'Natural Language Processing for Sentiment Analysis',
      faculty: 'Computer Science',
      year: 'Year 3',
      submittedDate: '1 week ago'
    }
  ];

  // Mock data for current students
  const currentStudents = [
    {
      id: 4,
      name: 'David Brown',
      initials: 'DB',
      thesisTitle: 'Deep Learning for Image Recognition in Medical Imaging',
      faculty: 'Computer Science',
      year: 'Year 3',
      startedDate: '2 months ago'
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      initials: 'LA',
      thesisTitle: 'Cybersecurity Frameworks for IoT Devices',
      faculty: 'Computer Science',
      year: 'Year 3',
      startedDate: '3 months ago'
    }
  ];

  const handleAccept = (studentId) => {
    console.log('Accepted student:', studentId);
  };

  const handleDecline = (studentId) => {
    console.log('Declined student:', studentId);
  };

  const handleView = (studentId) => {
    console.log('View student details:', studentId);
  };

  const handleAddSession = (e) => {
    e.preventDefault();
    setError('');

    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneYearFromNow = new Date(today);
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    // Validation
    if (start < today) {
      setError('Start date cannot be in the past');
      return;
    }

    if (end <= start) {
      setError('End date must be after start date');
      return;
    }

    if (start > oneYearFromNow) {
      setError('Registration sessions can only be scheduled up to 1 year in advance');
      return;
    }

    if (end > oneYearFromNow) {
      setError('End date cannot be more than 1 year from today');
      return;
    }

    // Check for overlapping sessions
    const hasOverlap = registrationSessions.some(session => {
      const sessionStart = new Date(session.startDate);
      const sessionEnd = new Date(session.endDate);
      return (start <= sessionEnd && end >= sessionStart);
    });

    if (hasOverlap) {
      setError('This session overlaps with an existing registration period');
      return;
    }

    // Add new session
    const newSession = {
      id: Date.now(),
      startDate: startDate,
      endDate: endDate,
      status: start <= today && end >= today ? 'active' : 'upcoming'
    };

    setRegistrationSessions([...registrationSessions, newSession].sort((a, b) => 
      new Date(a.startDate) - new Date(b.startDate)
    ));
    setStartDate('');
    setEndDate('');
  };

  const handleDeleteSession = (sessionId) => {
    setRegistrationSessions(registrationSessions.filter(session => session.id !== sessionId));
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
                  {activeMenu === 'requests' ? studentRequests.length : currentStudents.length} {activeMenu === 'requests' ? 'Pending' : 'Active'}
                </div>
              )}
            </div>

            {/* Content */}
            {activeMenu === 'registration' ? (
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
                  {registrationSessions.length > 0 ? (
                    <div className="sessions-list">
                      {registrationSessions.map((session) => {
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
                        <div className="student-name">{student.name}</div>
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
                        <button className="action-btn btn-accept" onClick={() => handleAccept(student.id)}>
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Accept
                        </button>
                        <button className="action-btn btn-decline" onClick={() => handleDecline(student.id)}>
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
              <div className="student-list">
                {currentStudents.length > 0 ? (
                  currentStudents.map((student) => (
                    <div key={student.id} className="student-card">
                      <div className="student-avatar">{student.initials}</div>
                      <div className="student-info">
                        <div className="student-name">{student.name}</div>
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
                            <span>Started {student.startedDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="student-actions">
                        <button className="action-btn btn-view" onClick={() => handleView(student.id)}>
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
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
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

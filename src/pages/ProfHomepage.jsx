import React, { useState } from 'react';
import './ProfHomepage.css';

export default function ProfHomepage() {
  const [activeMenu, setActiveMenu] = useState('requests');

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

  return (
    <div className="prof-homepage">
      {/* Header */}
      <header className="prof-header">
        <div className="header-content">
          <div className="header-logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="logo-text">Dissertation Application Manager</span>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">PP</div>
              <div className="user-details">
                <div className="user-name">Pat Professor</div>
                <div className="user-role">Professor</div>
              </div>
            </div>
          </div>
        </div>
      </header>

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
          </nav>
        </aside>

        {/* Main Content */}
        <main className="content-area">
          <div className="main-card">
            {/* Page Header */}
            <div className="page-header">
              <div className="page-title-section">
                <div className={`page-icon ${activeMenu === 'requests' ? 'mint' : 'rose'}`}>
                  {activeMenu === 'requests' ? (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className="page-title-content">
                  <h1>{activeMenu === 'requests' ? 'Student Requests' : 'Current Students'}</h1>
                  <p className="page-subtitle">
                    {activeMenu === 'requests' 
                      ? 'Review and respond to dissertation supervision requests' 
                      : 'Manage your current dissertation students'}
                  </p>
                </div>
              </div>
              <div className="count-badge">
                {activeMenu === 'requests' ? studentRequests.length : currentStudents.length} {activeMenu === 'requests' ? 'Pending' : 'Active'}
              </div>
            </div>

            {/* Student List */}
            {activeMenu === 'requests' ? (
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

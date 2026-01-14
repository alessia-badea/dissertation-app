import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApplications } from '../context/ApplicationContext';
import Header from '../components/Header';
import './StudentHomepage.css';

export default function StudentHomepage() {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const { applications, hasAppliedTo } = useApplications();
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // Format user data for Header component
  const getInitials = (name) => {
    if (!name) return 'ST';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const user = {
    name: authUser?.name || 'Student',
    role: 'Student',
    initials: getInitials(authUser?.name)
  };

  // Mock data for professors
  const professors = [
    {
      id: 1,
      name: 'Dr. Sarah Mitchell',
      initials: 'SM',
      subjects: ['Machine Learning', 'Artificial Intelligence'],
      availableSlots: 3,
      totalSlots: 5
    },
    {
      id: 2,
      name: 'Prof. James Anderson',
      initials: 'JA',
      subjects: ['Software Engineering', 'Web Development'],
      availableSlots: 5,
      totalSlots: 5
    },
    {
      id: 3,
      name: 'Dr. Emily Chen',
      initials: 'EC',
      subjects: ['Data Science', 'Big Data Analytics'],
      availableSlots: 2,
      totalSlots: 5
    },
    {
      id: 4,
      name: 'Prof. Michael Brown',
      initials: 'MB',
      subjects: ['Cybersecurity', 'Network Security'],
      availableSlots: 4,
      totalSlots: 5
    },
    {
      id: 5,
      name: 'Dr. Lisa Williams',
      initials: 'LW',
      subjects: ['Cloud Computing', 'Distributed Systems'],
      availableSlots: 1,
      totalSlots: 5
    }
  ];

  const handleApply = (professorId) => {
    const professor = professors.find(p => p.id === professorId);
    navigate('/application', { state: { professor } });
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'professors':
        return (
          <>
            <div className="page-header">
              <div className="page-title-section">
                <div className="page-icon rose">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="page-title-content">
                  <h1>Available Professors</h1>
                  <p className="page-subtitle">Browse and apply to professors for dissertation supervision</p>
                </div>
              </div>
              <div className="count-badge">{professors.length} Available</div>
            </div>

            <div className="student-list">
              {professors.map((professor) => (
                <div key={professor.id} className="student-card">
                  <div className="student-avatar">{professor.initials}</div>
                  <div className="student-info">
                    <div className="student-name">{professor.name}</div>
                    <div className="thesis-title">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{professor.subjects.join(', ')}</span>
                    </div>
                    <div className="student-meta">
                      <div className="meta-item">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{professor.availableSlots} of {professor.totalSlots} slots available</span>
                      </div>
                    </div>
                  </div>
                  <div className="student-actions">
                    {hasAppliedTo(professor.id) ? (
                      <button 
                        className="action-btn btn-applied" 
                        disabled
                      >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Applied
                      </button>
                    ) : (
                      <button 
                        className="action-btn btn-view" 
                        onClick={() => handleApply(professor.id)}
                        disabled={professor.availableSlots === 0}
                      >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {professor.availableSlots === 0 ? 'No Slots' : 'Apply'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case 'guide':
        return (
          <>
            <div className="page-header">
              <div className="page-title-section">
                <div className="page-icon sage">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="page-title-content">
                  <h1>Application Guide</h1>
                  <p className="page-subtitle">Learn how to use the Dissertation Application Manager</p>
                </div>
              </div>
            </div>

            <div className="guide-content">
              <section className="guide-section">
                <h3 className="guide-section-title">Getting Started</h3>
                <p className="guide-text">
                  Welcome to the Dissertation Application Manager! This platform helps you find and apply to dissertation coordinators 
                  who match your research interests and academic goals.
                </p>
              </section>

              <section className="guide-section">
                <h3 className="guide-section-title">How to Apply</h3>
                <ol className="guide-list">
                  <li>Browse the available professors in the "Professors List" section</li>
                  <li>Review their subjects and available slots</li>
                  <li>Click "Apply" on the professor you wish to work with</li>
                  <li>Fill out your application form with your thesis proposal</li>
                  <li>Submit and wait for the professor's response</li>
                </ol>
              </section>

              <section className="guide-section">
                <h3 className="guide-section-title">Application Status</h3>
                <p className="guide-text">
                  Track your application status on the Dashboard. You'll receive notifications when professors respond to your requests. 
                  You can have multiple pending applications, but only one active dissertation coordinator at a time.
                </p>
              </section>

              <section className="guide-section">
                <h3 className="guide-section-title">Important Notes</h3>
                <ul className="guide-list">
                  <li>Each professor has a limited number of slots (typically 5)</li>
                  <li>Applications are reviewed on a first-come, first-served basis</li>
                  <li>Make sure your thesis proposal aligns with the professor's expertise</li>
                  <li>Check the announcements regularly for important updates</li>
                </ul>
              </section>
            </div>
          </>
        );

      default: // dashboard
        const hasApplications = applications.length > 0;

        return (
          <>
            {/* Application Status Section */}
            <section className="section">
              <div className="section-header">
                <div className="section-icon mint">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="section-title">Application Status</h2>
              </div>
              <div className="section-content">
                {hasApplications ? (
                  <div className="applications-list">
                    {applications.map((app) => (
                      <div key={app.id} className="application-item">
                        <div className="application-info">
                          <h4 className="application-professor">{app.professorName}</h4>
                          <p className="application-thesis">{app.thesisTitle}</p>
                          <span className="application-date">Submitted {app.submittedDate}</span>
                        </div>
                        <div className={`status-badge ${app.status}`}>
                          <span className="status-dot"></span>
                          <span>
                            {app.status === 'pending' && 'Pending Approval'}
                            {app.status === 'approved' && 'Approved - Upload Document'}
                            {app.status === 'document_pending' && 'Document Under Review'}
                            {app.status === 'completed' && 'Completed'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="status-badge">
                    <span className="status-dot"></span>
                    <span>No Active Application</span>
                  </div>
                )}
              </div>
            </section>

            {/* Your Next Step Section */}
            <section className="section">
              <div className="section-header">
                <div className="section-icon rose">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="section-title">Your Next Step</h2>
              </div>
              <div className="section-content">
                <div className="step-card">
                  <p className="step-text">
                    {hasApplications 
                      ? 'Wait for professor approval or browse additional coordinators to submit more applications.'
                      : 'Start your dissertation journey by browsing available coordinators and submitting your first application.'}
                  </p>
                  <button className="step-action" onClick={() => setActiveMenu('professors')}>
                    <span>{hasApplications ? 'Browse More Coordinators' : 'Browse Coordinators'}</span>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </section>

            {/* Announcements Section */}
            <section className="section">
              <div className="section-header">
                <div className="section-icon sage">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="section-title">Announcements</h2>
              </div>
              <div className="section-content">
                <div className="announcements-list">
                  <div className="announcement-item">
                    <div className="announcement-header">
                      <h3 className="announcement-title">Application Period Open</h3>
                      <span className="announcement-date">2 days ago</span>
                    </div>
                    <p className="announcement-text">
                      The dissertation application period is now open. Submit your applications before the deadline on March 31st.
                    </p>
                  </div>
                  <div className="announcement-item">
                    <div className="announcement-header">
                      <h3 className="announcement-title">New Coordinators Available</h3>
                      <span className="announcement-date">1 week ago</span>
                    </div>
                    <p className="announcement-text">
                      Several new coordinators have joined the platform. Check out their profiles and research interests.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="student-homepage">
      {/* Header */}
      <Header user={user} />

      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="sidebar-menu">
            <div 
              className={`menu-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveMenu('dashboard')}
            >
              <svg className="menu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Dashboard</span>
            </div>
            <div 
              className={`menu-item ${activeMenu === 'professors' ? 'active' : ''}`}
              onClick={() => setActiveMenu('professors')}
            >
              <svg className="menu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Professors List</span>
            </div>
            <div 
              className={`menu-item ${activeMenu === 'guide' ? 'active' : ''}`}
              onClick={() => setActiveMenu('guide')}
            >
              <svg className="menu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Guide</span>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="content-area">
          <div className="main-card">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

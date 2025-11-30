import React, { useState } from 'react';
import './StudentHomepage.css';

export default function StudentHomepage() {
  const [activeMenu, setActiveMenu] = useState('option1');

  return (
    <div className="student-homepage">
      {/* Header */}
      <header className="student-header">
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
              <div className="user-avatar">AS</div>
              <div className="user-details">
                <div className="user-name">Alex Student</div>
                <div className="user-role">Student</div>
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
              className={`menu-item ${activeMenu === 'option1' ? 'active' : ''}`}
              onClick={() => setActiveMenu('option1')}
            >
              <svg className="menu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Option 1</span>
            </div>
            <div 
              className={`menu-item ${activeMenu === 'option2' ? 'active' : ''}`}
              onClick={() => setActiveMenu('option2')}
            >
              <svg className="menu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Option 2</span>
            </div>
            <div 
              className={`menu-item ${activeMenu === 'option3' ? 'active' : ''}`}
              onClick={() => setActiveMenu('option3')}
            >
              <svg className="menu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Option 3</span>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="content-area">
          <div className="main-card">
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
                <div className="status-badge">
                  <span className="status-dot"></span>
                  <span>No Active Application</span>
                </div>
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
                    Start your dissertation journey by browsing available coordinators and submitting your first application.
                  </p>
                  <button className="step-action">
                    <span>Browse Coordinators</span>
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
          </div>
        </main>
      </div>
    </div>
  );
}

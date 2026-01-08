import React from "react";
import { useNavigate } from 'react-router-dom';
import "./AboutPage.css";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        <div className="nav-content">
          <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="logo-text">Dissertation Application Manager</span>
          </div>
          <div className="nav-right">
            <div className="nav-links">
              <a href="/about" className="nav-link active">About</a>
              <a href="/faq" className="nav-link">FAQ</a>
              <button onClick={() => navigate('/')} className="nav-btn">Sign In</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="about-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="hero-title">About Our Platform</h1>
          <p className="hero-subtitle">Connecting students and professors for successful dissertation journeys</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="about-content">
        <div className="content-container">
          {/* Mission Section */}
          <section className="content-section">
            <div className="section-header">
              <div className="section-icon mint">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="section-title">Our Mission</h2>
            </div>
            <div className="section-content">
              <p>
                The Dissertation Application Manager is designed to streamline the process of connecting students with their ideal thesis coordinators. 
                We understand that finding the right supervisor is crucial for academic success, and we're here to make that process as smooth and 
                efficient as possible.
              </p>
              <p>
                Our platform bridges the gap between students seeking guidance and professors offering their expertise, creating a collaborative 
                environment where academic excellence can flourish.
              </p>
            </div>
          </section>

          {/* For Students Section */}
          <section className="content-section">
            <div className="section-header">
              <div className="section-icon rose">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="section-title">For Students</h2>
            </div>
            <div className="section-content">
              <p>
                As a student, you can browse through comprehensive faculty profiles, explore research interests, and find professors whose 
                expertise aligns with your dissertation topic. Our intuitive application system allows you to submit proposals, track your 
                application status, and communicate directly with potential supervisors.
              </p>
              <div className="feature-grid">
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <div className="feature-text">Browse faculty profiles and research areas</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <div className="feature-text">Submit and track dissertation proposals</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <div className="feature-text">Receive real-time notifications</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <div className="feature-text">Manage application deadlines</div>
                </div>
              </div>
            </div>
          </section>

          {/* For Professors Section */}
          <section className="content-section">
            <div className="section-header">
              <div className="section-icon sage">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="section-title">For Professors</h2>
            </div>
            <div className="section-content">
              <p>
                Professors can efficiently manage student supervision requests, review proposals, and organize their workload through our 
                centralized dashboard. Set your availability, define capacity limits, and specify your preferred research areas to attract 
                students whose interests align with your expertise.
              </p>
              <div className="feature-grid">
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <div className="feature-text">Review and respond to student requests</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <div className="feature-text">Manage multiple students efficiently</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <div className="feature-text">Set availability and capacity limits</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <div className="feature-text">Track student progress and milestones</div>
                </div>
              </div>
            </div>
          </section>

          {/* Vision Section */}
          <section className="content-section highlight">
            <div className="section-header">
              <div className="section-icon teal">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="section-title">Our Vision</h2>
            </div>
            <div className="section-content">
              <p>
                We envision a future where every student finds the perfect mentor for their academic journey, and every professor can 
                efficiently manage their supervision responsibilities. By leveraging technology, we're creating a more transparent, 
                accessible, and efficient academic ecosystem.
              </p>
              <p>
                Our commitment is to continuously improve the platform based on user feedback, ensuring that we meet the evolving needs 
                of both students and faculty members in the academic community.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="about-footer">
        <div className="footer-content">
          <p>&copy; 2024 Dissertation Application Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

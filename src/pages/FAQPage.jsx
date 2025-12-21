import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./FAQPage.css";

export default function FAQPage() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      category: "General",
      questions: [
        {
          question: "What is the Dissertation Application Manager?",
          answer: "The Dissertation Application Manager is a comprehensive platform designed to connect students with thesis coordinators. It streamlines the process of finding supervisors, submitting proposals, and managing the dissertation application workflow for both students and professors."
        },
        {
          question: "Who can use this platform?",
          answer: "The platform is designed for two main user groups: students seeking dissertation supervisors and professors offering supervision. Both groups need to create an account to access the full features of the platform."
        },
        {
          question: "Is the platform free to use?",
          answer: "Yes, the Dissertation Application Manager is currently free for all registered students and faculty members at participating institutions."
        }
      ]
    },
    {
      category: "For Students",
      questions: [
        {
          question: "How do I find a thesis coordinator?",
          answer: "After logging in, you can browse through faculty profiles, filter by research interests and availability, and view detailed information about each professor's expertise and current supervision capacity."
        },
        {
          question: "Can I apply to multiple professors?",
          answer: "Yes, you can submit applications to multiple professors. However, we recommend tailoring each application to the specific professor's research interests and expertise for the best chance of acceptance."
        },
        {
          question: "How will I know if my application is accepted?",
          answer: "You'll receive real-time notifications through the platform when a professor responds to your application. You can also track all your application statuses in your dashboard."
        },
        {
          question: "What documents do I need to submit?",
          answer: "Typically, you'll need to submit a dissertation proposal, your academic transcript, and a brief statement of interest. Specific requirements may vary by faculty and department."
        }
      ]
    },
    {
      category: "For Professors",
      questions: [
        {
          question: "How do I manage student applications?",
          answer: "Your dashboard provides a centralized view of all incoming applications. You can review proposals, view student profiles, and respond to requests directly through the platform."
        },
        {
          question: "Can I set limits on the number of students I supervise?",
          answer: "Yes, you can set your supervision capacity in your profile settings. Once you reach your limit, your profile will automatically indicate that you're not currently accepting new students."
        },
        {
          question: "How do I update my research interests?",
          answer: "You can update your research interests, areas of expertise, and availability at any time through your profile settings. This helps students find supervisors whose interests align with their dissertation topics."
        },
        {
          question: "Can I communicate with students before accepting them?",
          answer: "Yes, the platform includes messaging features that allow you to communicate with prospective students, ask questions about their proposals, and discuss expectations before making a decision."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "What browsers are supported?",
          answer: "The platform works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated to the latest version for optimal performance."
        },
        {
          question: "I forgot my password. How do I reset it?",
          answer: "Click on the 'Forgot password?' link on the login page. You'll receive an email with instructions to reset your password. If you don't receive the email, check your spam folder or contact support."
        },
        {
          question: "How do I report a technical issue?",
          answer: "If you encounter any technical issues, please contact our support team through the help center. Provide as much detail as possible about the issue, including screenshots if applicable."
        }
      ]
    }
  ];

  return (
    <div className="faq-page">
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
              <a href="/about" className="nav-link">About</a>
              <a href="/faq" className="nav-link active">FAQ</a>
              <button onClick={() => navigate('/')} className="nav-btn">Sign In</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="faq-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="hero-title">Frequently Asked Questions</h1>
          <p className="hero-subtitle">Find answers to common questions about our platform</p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="faq-content">
        <div className="content-container">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="faq-category">
              <div className="category-header">
                <div className={`category-icon ${categoryIndex === 0 ? 'mint' : categoryIndex === 1 ? 'rose' : categoryIndex === 2 ? 'sage' : 'teal'}`}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {categoryIndex === 0 && (
                      <path d="M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    )}
                    {categoryIndex === 1 && (
                      <>
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </>
                    )}
                    {categoryIndex === 2 && (
                      <>
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </>
                    )}
                    {categoryIndex === 3 && (
                      <>
                        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 6h.01M6 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </>
                    )}
                  </svg>
                </div>
                <h2 className="category-title">{category.category}</h2>
              </div>

              <div className="faq-list">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = `${categoryIndex}-${faqIndex}`;
                  const isOpen = openIndex === globalIndex;
                  
                  return (
                    <div key={faqIndex} className={`faq-item ${isOpen ? 'open' : ''}`}>
                      <button 
                        className="faq-question"
                        onClick={() => toggleFAQ(globalIndex)}
                      >
                        <span className="question-text">{faq.question}</span>
                        <svg 
                          className="chevron-icon" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="contact-section">
          <div className="contact-card">
            <div className="contact-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="contact-title">Still have questions?</h3>
            <p className="contact-text">
              Can't find the answer you're looking for? Please reach out to our support team.
            </p>
            <button className="contact-btn">
              Contact Support
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="faq-footer">
        <div className="footer-content">
          <p>&copy; 2024 Dissertation Application Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

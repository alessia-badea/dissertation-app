import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("student"); // "student" or "professor"
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [faculty, setFaculty] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [subjects, setSubjects] = useState([""]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (touched.email) {
      if (!value) {
        setErrors(prev => ({ ...prev, email: "Email is required" }));
      } else if (!validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
      } else {
        setErrors(prev => ({ ...prev, email: "" }));
      }
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    if (touched.password) {
      if (!value) {
        setErrors(prev => ({ ...prev, password: "Password is required" }));
      } else {
        setErrors(prev => ({ ...prev, password: "" }));
      }
    }
  };

  const handleEmailBlur = () => {
    setTouched(prev => ({ ...prev, email: true }));
    
    if (!email) {
      setErrors(prev => ({ ...prev, email: "Email is required" }));
    } else if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
    }
  };

  const handlePasswordBlur = () => {
    setTouched(prev => ({ ...prev, password: true }));
    
    if (!password) {
      setErrors(prev => ({ ...prev, password: "Password is required" }));
    }
  };

  const handleFacultyChange = (e) => {
    const value = e.target.value;
    setFaculty(value);
    
    if (touched.faculty && !value) {
      setErrors(prev => ({ ...prev, faculty: "Faculty is required" }));
    } else {
      setErrors(prev => ({ ...prev, faculty: "" }));
    }
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    setYearOfStudy(value);
    
    if (touched.yearOfStudy && !value) {
      setErrors(prev => ({ ...prev, yearOfStudy: "Year of study is required" }));
    } else {
      setErrors(prev => ({ ...prev, yearOfStudy: "" }));
    }
  };

  const handleFacultyBlur = () => {
    setTouched(prev => ({ ...prev, faculty: true }));
    if (!faculty) {
      setErrors(prev => ({ ...prev, faculty: "Faculty is required" }));
    }
  };

  const handleYearBlur = () => {
    setTouched(prev => ({ ...prev, yearOfStudy: true }));
    if (!yearOfStudy) {
      setErrors(prev => ({ ...prev, yearOfStudy: "Year of study is required" }));
    }
  };

  const handleSubjectChange = (index, value) => {
    const newSubjects = [...subjects];
    newSubjects[index] = value;
    setSubjects(newSubjects);
  };

  const addSubject = () => {
    setSubjects([...subjects, ""]);
  };

  const removeSubject = (index) => {
    if (subjects.length > 1) {
      const newSubjects = subjects.filter((_, i) => i !== index);
      setSubjects(newSubjects);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isSignUp) {
      const newErrors = {};
      
      if (!email) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(email)) {
        newErrors.email = "Please enter a valid email address";
      }
      
      if (!password) {
        newErrors.password = "Password is required";
      }
      
      if (!faculty) {
        newErrors.faculty = "Faculty is required";
      }

      if (!firstName) {
        newErrors.firstName = "First name is required";
      }

      if (!lastName) {
        newErrors.lastName = "Last name is required";
      }
      
      if (userType === "student" && !yearOfStudy) {
        newErrors.yearOfStudy = "Year of study is required";
      }
      
      if (userType === "professor") {
        const hasEmptySubject = subjects.some(s => !s.trim());
        if (hasEmptySubject || subjects.length === 0) {
          newErrors.subjects = "At least one subject is required";
        }
      }
      
      setErrors(newErrors);
      
      if (Object.keys(newErrors).length === 0) {
        if (userType === "student") {
          console.log("Student sign up valid!", { email, password, faculty, yearOfStudy, firstName, lastName });
          navigate('/student');
        } else {
          console.log("Professor sign up valid!", { email, password, faculty, subjects, firstName, lastName });
          navigate('/prof');
        }
      }
    } else {
      const newErrors = {};
      
      if (!email) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(email)) {
        newErrors.email = "Please enter a valid email address";
      }
      
      if (!password) {
        newErrors.password = "Password is required";
      }
      
      setErrors(newErrors);
      
      if (Object.keys(newErrors).length === 0) {
        console.log("Sign in valid!", { userType, email, password });
        navigate(userType === 'student' ? '/student' : '/prof');
      }
    }
  };

  const toggleForm = (e) => {
    e.preventDefault();
    setIsSignUp(!isSignUp);
    setEmail("");
    setPassword("");
    setFaculty("");
    setYearOfStudy("");
    setFirstName("");
    setLastName("");
    setSubjects([""]);
    setErrors({});
    setTouched({});
  };

  const toggleUserType = (type) => {
    setUserType(type);
    setIsSignUp(false);
    setEmail("");
    setPassword("");
    setFaculty("");
    setYearOfStudy("");
    setFirstName("");
    setLastName("");
    setSubjects([""]);
    setErrors({});
    setTouched({});
  };

  // Content for students
  const studentContent = {
    cards: [
      {
        title: "Find a Thesis Coordinator",
        description: "Browse through faculty profiles, research interests, and availability to find the perfect supervisor who aligns with your dissertation topic and academic goals."
      },
      {
        title: "Apply",
        description: "Submit your dissertation proposal with ease using our streamlined application system. Upload documents, track your submission status, and receive instant confirmation."
      },
      {
        title: "Stay Up to Date",
        description: "Receive real-time notifications about your application status, coordinator responses, and important deadlines. Never miss a critical update in your dissertation journey."
      }
    ]
  };

  // Content for professors
  const professorContent = {
    cards: [
      {
        title: "Manage Student Requests",
        description: "Review and respond to dissertation supervision requests from students. View their proposals, academic records, and research interests all in one place."
      },
      {
        title: "Guide & Supervise",
        description: "Provide feedback, set milestones, and track your students' progress throughout their dissertation journey with integrated communication tools."
      },
      {
        title: "Organize Your Workload",
        description: "Manage multiple students efficiently with a centralized dashboard. Set your availability, capacity limits, and preferred research areas."
      }
    ]
  };

  const currentContent = userType === "student" ? studentContent : professorContent;

  return (
    <div className="login-page">
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        <div className="nav-content">
          <div className="nav-logo">
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
            <div className="user-type-toggle">
              <button 
                className={`toggle-btn ${userType === "student" ? "active" : ""}`}
                onClick={() => toggleUserType("student")}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Student
              </button>
              <button 
                className={`toggle-btn ${userType === "professor" ? "active" : ""}`}
                onClick={() => toggleUserType("professor")}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Professor
              </button>
            </div>
            <div className="nav-links">
              <a href="#" className="nav-link">About</a>
              <a href="#" className="nav-link">Features</a>
              <a href="#" className="nav-link">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="login-content">
        {/* Left Section - Info Cards */}
        <div className="info-section">
          <div className="info-cards">
            {currentContent.cards.map((card, index) => (
              <div key={index} className={`info-card ${index === 0 ? 'card-mint' : index === 1 ? 'card-rose' : 'card-sage'}`}>
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {index === 0 && (
                      <>
                        <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </>
                    )}
                  </svg>
                </div>
                <div className="card-content">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Login/Signup Form */}
        <div className="form-section">
          <div className="form-container">
            <div className="form-header">
              <div className="form-icon-circle">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {isSignUp ? (
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12.5 7a4 4 0 11-8 0 4 4 0 018 0zM20 8v6M23 11h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  ) : (
                    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M3 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  )}
                </svg>
              </div>
              <h2 className="form-title">{isSignUp ? "Create Account" : "Sign In"}</h2>
              <p className="form-subtitle">
                {isSignUp 
                  ? `Fill in your details to create a ${userType} account` 
                  : "Enter your credentials to access your account"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {isSignUp && (
                <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <div className={`input-container ${errors.firstName && touched.firstName ? 'error' : ''} ${firstName && !errors.firstName ? 'success' : ''}`}>
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g., Alex"
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value);
                            if (touched.firstName) setErrors(prev => ({ ...prev, firstName: e.target.value ? '' : 'First name is required' }));
                          }}
                          onBlur={() => {
                            setTouched(prev => ({ ...prev, firstName: true }));
                            if (!firstName) setErrors(prev => ({ ...prev, firstName: 'First name is required' }));
                          }}
                        />
                        {firstName && !errors.firstName && (
                          <svg className="success-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      {errors.firstName && touched.firstName && (
                        <span className="error-text">{errors.firstName}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <div className={`input-container ${errors.lastName && touched.lastName ? 'error' : ''} ${lastName && !errors.lastName ? 'success' : ''}`}>
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g., Student"
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.target.value);
                            if (touched.lastName) setErrors(prev => ({ ...prev, lastName: e.target.value ? '' : 'Last name is required' }));
                          }}
                          onBlur={() => {
                            setTouched(prev => ({ ...prev, lastName: true }));
                            if (!lastName) setErrors(prev => ({ ...prev, lastName: 'Last name is required' }));
                          }}
                        />
                        {lastName && !errors.lastName && (
                          <svg className="success-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      {errors.lastName && touched.lastName && (
                        <span className="error-text">{errors.lastName}</span>
                      )}
                    </div>
                  </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className={`input-container ${errors.email && touched.email ? 'error' : ''} ${email && !errors.email ? 'success' : ''}`}>
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                  />
                  {email && !errors.email && (
                    <svg className="success-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                {errors.email && touched.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className={`input-container ${errors.password && touched.password ? 'error' : ''} ${password && !errors.password ? 'success' : ''}`}>
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                  />
                  {password && !errors.password && (
                    <svg className="success-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                {errors.password && touched.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>

              {isSignUp && (
                <>
                  <div className="form-group">
                    <label className="form-label">Faculty</label>
                    <div className={`input-container ${errors.faculty && touched.faculty ? 'error' : ''} ${faculty && !errors.faculty ? 'success' : ''}`}>
                      <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., Computer Science"
                        value={faculty}
                        onChange={handleFacultyChange}
                        onBlur={handleFacultyBlur}
                      />
                      {faculty && !errors.faculty && (
                        <svg className="success-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    {errors.faculty && touched.faculty && (
                      <span className="error-text">{errors.faculty}</span>
                    )}
                  </div>

                  {userType === "student" && (
                    <div className="form-group">
                      <label className="form-label">Year of Study</label>
                      <div className={`input-container ${errors.yearOfStudy && touched.yearOfStudy ? 'error' : ''} ${yearOfStudy && !errors.yearOfStudy ? 'success' : ''}`}>
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <select
                          className="form-input form-select"
                          value={yearOfStudy}
                          onChange={handleYearChange}
                          onBlur={handleYearBlur}
                        >
                          <option value="">Select year</option>
                          <option value="year1">Year 1</option>
                          <option value="year2">Year 2</option>
                          <option value="year3">Year 3</option>
                          <option value="supplementary">Supplementary</option>
                        </select>
                        {yearOfStudy && !errors.yearOfStudy && (
                          <svg className="success-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      {errors.yearOfStudy && touched.yearOfStudy && (
                        <span className="error-text">{errors.yearOfStudy}</span>
                      )}
                    </div>
                  )}

                  {userType === "professor" && (
                    <div className="form-group">
                      <label className="form-label">Subjects Taught</label>
                      {subjects.map((subject, index) => (
                        <div key={index} className="subject-row">
                          <input
                            type="text"
                            className="form-input subject-input"
                            placeholder="e.g., Machine Learning"
                            value={subject}
                            onChange={(e) => handleSubjectChange(index, e.target.value)}
                          />
                          {subjects.length > 1 && (
                            <button
                              type="button"
                              className="remove-subject-btn"
                              onClick={() => removeSubject(index)}
                            >
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        className="add-subject-btn"
                        onClick={addSubject}
                      >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Add Another Subject
                      </button>
                      {errors.subjects && (
                        <span className="error-text">{errors.subjects}</span>
                      )}
                    </div>
                  )}
                </>
              )}

              {!isSignUp && (
                <div className="form-options">
                  <label className="checkbox-container">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-label">Remember me</span>
                  </label>
                  <a href="#" className="forgot-password">Forgot password?</a>
                </div>
              )}

              <button type="submit" className="submit-btn">
                <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>

            <div className="form-footer">
              <p>
                {isSignUp ? (
                  <>Already have an account? <a href="#" onClick={toggleForm} className="signup-link">Sign in</a></>
                ) : (
                  <>Don't have an account? <a href="#" onClick={toggleForm} className="signup-link">Create one</a></>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

          </div>
  );
}

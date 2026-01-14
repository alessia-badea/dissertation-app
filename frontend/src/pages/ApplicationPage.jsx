import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApplications } from '../context/ApplicationContext';
import { createApplication } from '../api/applications';
import Header from '../components/Header';
import './ApplicationPage.css';

export default function ApplicationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const professor = location.state?.professor;
  const { user: authUser } = useAuth();
  const { addApplication } = useApplications();

  const [currentStep, setCurrentStep] = useState(1);
  const [applicationStatus, setApplicationStatus] = useState('draft'); // draft, pending, approved, document_uploaded, document_pending, rejected, completed
  const [formData, setFormData] = useState({
    thesisTitle: '',
    thesisDescription: '',
    uploadedFile: null
  });
  const [errors, setErrors] = useState({});
  const [rejectionMessage, setRejectionMessage] = useState('');

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

  const steps = [
    { number: 1, label: 'Thesis Info', description: 'Submit your proposal' },
    { number: 2, label: 'Upload Document', description: 'Upload signed form' },
    { number: 3, label: 'Final Review', description: 'Professor approval' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.thesisTitle.trim()) {
      newErrors.thesisTitle = 'Thesis title is required';
    }
    
    if (!formData.thesisDescription.trim()) {
      newErrors.thesisDescription = 'Thesis description is required';
    } else if (formData.thesisDescription.trim().length < 50) {
      newErrors.thesisDescription = 'Description must be at least 50 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        try {
          console.log('Submitting application...', {
            professorId: professor?.id,
            thesisTitle: formData.thesisTitle,
            thesisDescription: formData.thesisDescription
          });
          
          // Submit application to backend
          const response = await createApplication(
            professor?.id,
            formData.thesisTitle,
            formData.thesisDescription
          );
          
          console.log('Application submitted successfully:', response);
          
          // Add to context
          addApplication(response.application);
          setApplicationStatus('pending');
          setCurrentStep(2);
        } catch (error) {
          console.error('Error submitting application:', error);
          // Show error message
          setErrors({ submit: error.message || 'Failed to submit application' });
          alert('Error: ' + (error.message || 'Failed to submit application'));
        }
      }
    } else if (currentStep === 2 && applicationStatus === 'approved' && formData.uploadedFile) {
      // Submit document - set to document pending
      setApplicationStatus('document_pending');
      setCurrentStep(3);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    navigate('/student');
  };

  const handleSubmit = () => {
    if (currentStep === 1 && validateStep1()) {
      // Submit Step 1 - set to pending
      setApplicationStatus('pending');
      setCurrentStep(2);
    } else if (currentStep === 2 && formData.uploadedFile) {
      // Submit document - set to document_pending
      setApplicationStatus('document_pending');
      setCurrentStep(3);
    }
  };

  // Demo function to test different states (remove in production)
  const testStatus = (status) => {
    setApplicationStatus(status);
    if (status === 'pending' || status === 'rejected') {
      setCurrentStep(2);
    } else if (status === 'document_pending' || status === 'document_rejected' || status === 'completed') {
      setCurrentStep(3);
    } else if (status === 'approved') {
      setCurrentStep(2);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="step-header">
              <h3 className="step-title">Thesis Information</h3>
              <p className="step-description">
                Provide a title and brief description of your proposed dissertation topic.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Thesis Title *</label>
              <input
                type="text"
                className={`form-input ${errors.thesisTitle ? 'error' : ''}`}
                placeholder="Enter your thesis title"
                value={formData.thesisTitle}
                onChange={(e) => handleInputChange('thesisTitle', e.target.value)}
              />
              {errors.thesisTitle && (
                <span className="error-text">{errors.thesisTitle}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Thesis Description *</label>
              <textarea
                className={`form-textarea ${errors.thesisDescription ? 'error' : ''}`}
                placeholder="Provide a brief description of your thesis topic, research questions, and methodology (minimum 50 characters)"
                rows="8"
                value={formData.thesisDescription}
                onChange={(e) => handleInputChange('thesisDescription', e.target.value)}
              />
              <div className="character-count">
                {formData.thesisDescription.length} characters
              </div>
              {errors.thesisDescription && (
                <span className="error-text">{errors.thesisDescription}</span>
              )}
            </div>
          </div>
        );
      
      case 2:
        // Show different content based on application status
        if (applicationStatus === 'pending') {
          return (
            <div className="step-content">
              <div className="status-message pending">
                <div className="status-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3>Waiting for Professor Approval</h3>
                <p>Your thesis proposal has been submitted and is currently under review by {professor?.name || 'the professor'}.</p>
                <p className="status-note">You will be notified once the professor reviews your application.</p>
              </div>
            </div>
          );
        } else if (applicationStatus === 'rejected') {
          return (
            <div className="step-content">
              <div className="status-message rejected">
                <div className="status-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3>Application Not Approved</h3>
                <p>Unfortunately, your thesis proposal was not approved by the professor.</p>
                {rejectionMessage && (
                  <div className="rejection-reason">
                    <strong>Reason:</strong>
                    <p>{rejectionMessage}</p>
                  </div>
                )}
                <button className="btn btn-primary" onClick={() => navigate('/student')}>
                  Return to Dashboard
                </button>
              </div>
            </div>
          );
        } else {
          // Approved - show document upload
          return (
            <div className="step-content">
              <div className="step-header">
                <h3 className="step-title">Upload Signed Document</h3>
                <p className="step-description">
                  Your thesis proposal has been approved! Please upload the signed dissertation agreement form.
                </p>
              </div>

              <div className="approval-notice">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Proposal Approved by {professor?.name || 'Professor'}</span>
              </div>

              <div className="form-group">
                <label className="form-label">Upload Document *</label>
                <div className="file-upload-area">
                  <input
                    type="file"
                    id="file-upload"
                    className="file-input"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleInputChange('uploadedFile', e.target.files[0])}
                  />
                  <label htmlFor="file-upload" className="file-upload-label">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="upload-text">
                      {formData.uploadedFile ? formData.uploadedFile.name : 'Click to upload or drag and drop'}
                    </span>
                    <span className="upload-hint">PDF, DOC, or DOCX (Max 10MB)</span>
                  </label>
                </div>
                {errors.uploadedFile && (
                  <span className="error-text">{errors.uploadedFile}</span>
                )}
              </div>

              <div className="info-box">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <strong>Important:</strong> Make sure the document is signed by you before uploading. 
                  The professor will review and sign the document in the next step.
                </div>
              </div>
            </div>
          );
        }
      
      case 3:
        // Show different content based on document review status
        if (applicationStatus === 'document_pending') {
          return (
            <div className="step-content">
              <div className="status-message pending">
                <div className="status-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Document Under Review</h3>
                <p>Your signed document has been submitted and is currently being reviewed by {professor?.name || 'the professor'}.</p>
                <div className="uploaded-file-info">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13 2v7h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{formData.uploadedFile?.name || 'Document uploaded'}</span>
                </div>
                <p className="status-note">The professor will either approve and sign the document, or request a new file if changes are needed.</p>
              </div>
            </div>
          );
        } else if (applicationStatus === 'document_rejected') {
          return (
            <div className="step-content">
              <div className="status-message warning">
                <div className="status-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Document Rejected - Resubmission Required</h3>
                <p>The professor has reviewed your document and requested changes.</p>
                {rejectionMessage && (
                  <div className="rejection-reason">
                    <strong>Professor's Feedback:</strong>
                    <p>{rejectionMessage}</p>
                  </div>
                )}
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    setCurrentStep(2);
                    setApplicationStatus('approved');
                    setFormData(prev => ({ ...prev, uploadedFile: null }));
                  }}
                >
                  Upload New Document
                </button>
              </div>
            </div>
          );
        } else if (applicationStatus === 'completed') {
          return (
            <div className="step-content">
              <div className="status-message success">
                <div className="status-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Application Complete!</h3>
                <p>Congratulations! Your dissertation application has been fully approved and all documents have been signed.</p>
                
                <div className="completion-details">
                  <div className="detail-item">
                    <strong>Thesis Coordinator:</strong>
                    <span>{professor?.name || 'Professor Name'}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Thesis Title:</strong>
                    <span>{formData.thesisTitle}</span>
                  </div>
                </div>

                <div className="download-section">
                  <h4>Download Documents</h4>
                  <div className="document-links">
                    <a href="#" className="document-link">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Your Signed Document</span>
                    </a>
                    <a href="#" className="document-link">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Professor's Signed Document</span>
                    </a>
                  </div>
                </div>

                <button className="btn btn-primary" onClick={() => navigate('/student')}>
                  Return to Dashboard
                </button>
              </div>
            </div>
          );
        }
        return null;
      
      default:
        return null;
    }
  };

  return (
    <div className="application-page">
      <Header user={user} />

      <div className="application-container">
        <div className="application-card">
          {/* Card Header */}
          <div className="card-header">
            <div className="application-header-content">
              <h1 className="application-title">Application</h1>
              {professor && (
                <p className="professor-info">
                  Applying to: <strong>{professor.name}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-steps">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="step-item">
                    <div className={`step-circle ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
                      {currentStep > step.number ? (
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <span>{step.number}</span>
                      )}
                    </div>
                    <span className={`step-label ${currentStep >= step.number ? 'active' : ''}`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`step-connector ${currentStep > step.number ? 'completed' : ''}`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="card-content">
            {renderStepContent()}
          </div>

          {/* Card Footer - Action Buttons */}
          <div className="card-footer">
            {/* Show different buttons based on application status */}
            {(applicationStatus === 'pending' || 
              applicationStatus === 'rejected' || 
              applicationStatus === 'document_pending' || 
              applicationStatus === 'document_rejected' ||
              applicationStatus === 'completed') ? (
              // Only show "Return to Dashboard" for waiting/final states
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/student')}
                style={{ marginLeft: 'auto' }}
              >
                Return to Dashboard
              </button>
            ) : (
              // Show normal navigation buttons for active steps
              <>
                <button 
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <div className="footer-right">
                  {currentStep > 1 && applicationStatus !== 'pending' && (
                    <button 
                      className="btn btn-outline"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                  )}
                  <button 
                    className="btn btn-primary"
                    onClick={handleNext}
                  >
                    {currentStep === 1 ? 'Submit Application' : (currentStep === 2 && applicationStatus === 'approved' ? 'Submit Document' : 'Next')}
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import './ApplicationPage.css';

export default function ApplicationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const professor = location.state?.professor;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    thesisTitle: '',
    thesisDescription: ''
  });
  const [errors, setErrors] = useState({});

  const user = {
    name: 'Alex Student',
    role: 'Student',
    initials: 'AS'
  };

  const steps = [
    { number: 1, label: 'Step 1' },
    { number: 2, label: 'Step 2' },
    { number: 3, label: 'Step 3' },
    { number: 4, label: 'Step 4' }
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

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(currentStep + 1);
      }
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
        return (
          <div className="step-content">
            <div className="step-header">
              <h3 className="step-title">Step 2</h3>
              <p className="step-description">
                Content for step 2 will be added here.
              </p>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="step-content">
            <div className="step-header">
              <h3 className="step-title">Step 3</h3>
              <p className="step-description">
                Content for step 3 will be added here.
              </p>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="step-content">
            <div className="step-header">
              <h3 className="step-title">Step 4</h3>
              <p className="step-description">
                Content for step 4 will be added here.
              </p>
            </div>
          </div>
        );
      
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
            <button 
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <div className="footer-right">
              {currentStep > 1 && (
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
                {currentStep === steps.length ? 'Submit' : 'Next'}
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

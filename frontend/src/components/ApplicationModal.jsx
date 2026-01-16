import React, { useState } from 'react';

export default function ApplicationModal({ 
  session,
  onClose,
  onSubmit
}) {
  const [thesisTitle, setThesisTitle] = useState('');
  const [thesisDescription, setThesisDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!session) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!thesisTitle.trim()) {
      alert('Please provide a thesis title');
      return;
    }
    
    if (!thesisDescription.trim()) {
      alert('Please provide a thesis description');
      return;
    }

    if (thesisDescription.trim().length < 50) {
      alert('Thesis description must be at least 50 characters');
      return;
    }

    setIsSubmitting(true);
    await onSubmit({
      sessionId: session.id,
      professorId: session.professorId,
      thesisTitle: thesisTitle.trim(),
      thesisDescription: thesisDescription.trim()
    });
    setIsSubmitting(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Apply for Dissertation Supervision</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Professor Info */}
          <div className="modal-section">
            <h4>Applying to</h4>
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '12px 16px', 
              borderRadius: '8px',
              marginTop: '8px'
            }}>
              <p style={{ fontWeight: '600', marginBottom: '4px' }}>
                {session.professor?.name || 'Professor'}
              </p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                {session.title}
              </p>
              <p style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>
                {new Date(session.startDate).toLocaleDateString()} - {new Date(session.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit}>
            <div className="modal-section">
              <h4>Thesis Title *</h4>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your proposed thesis title"
                value={thesisTitle}
                onChange={(e) => setThesisTitle(e.target.value)}
                maxLength={200}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  marginTop: '8px'
                }}
              />
              <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                {thesisTitle.length}/200 characters
              </p>
            </div>

            <div className="modal-section">
              <h4>Thesis Description *</h4>
              <textarea
                className="decline-reason-textarea"
                placeholder="Describe your research proposal, objectives, methodology, and expected outcomes. Be specific about why you want to work with this professor and how your research aligns with their expertise."
                value={thesisDescription}
                onChange={(e) => setThesisDescription(e.target.value)}
                rows="8"
                maxLength={2000}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  marginTop: '8px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                {thesisDescription.length}/2000 characters (minimum 50 characters)
              </p>
            </div>

            <div className="modal-section" style={{ 
              backgroundColor: '#fff3cd', 
              border: '1px solid #ffc107',
              padding: '12px',
              borderRadius: '6px'
            }}>
              <p style={{ fontSize: '13px', color: '#856404', margin: 0 }}>
                <strong>Note:</strong> Once submitted, your application will be reviewed by the professor. 
                You will be notified when they respond to your request.
              </p>
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button 
            className="modal-btn btn-secondary" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            className="modal-btn btn-accept" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Submit Application
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

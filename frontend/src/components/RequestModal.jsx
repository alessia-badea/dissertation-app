import React from 'react';

export default function RequestModal({ 
  selectedRequest, 
  declineReason, 
  setDeclineReason,
  onClose, 
  onAccept, 
  onDecline 
}) {
  if (!selectedRequest) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Thesis Proposal Details</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-student-info">
            <div className="modal-student-avatar">{selectedRequest.initials}</div>
            <div>
              <h3>{selectedRequest.name}</h3>
              <p>{selectedRequest.faculty} • {selectedRequest.year}</p>
            </div>
          </div>

          <div className="modal-section">
            <h4>Thesis Title</h4>
            <p className="thesis-title-text">{selectedRequest.thesisTitle}</p>
          </div>

          <div className="modal-section">
            <h4>Thesis Description</h4>
            <p className="thesis-description-text">{selectedRequest.thesisDescription}</p>
          </div>

          <div className="modal-section">
            <h4>Decline Reason (Optional)</h4>
            <textarea
              className="decline-reason-textarea"
              placeholder="If declining, please provide a reason for the student..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              rows="4"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn btn-decline" onClick={onDecline}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Decline
          </button>
          <button className="modal-btn btn-accept" onClick={onAccept}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

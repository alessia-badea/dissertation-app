import React from 'react';

export default function StudentModal({ 
  selectedStudent,
  rejectionMessage,
  setRejectionMessage,
  professorDocument,
  onFileChange,
  onClose,
  onApprove,
  onReject
}) {
  if (!selectedStudent) return null;

  // Handle both old mock data structure and new request structure
  const studentName = selectedStudent.student?.name || selectedStudent.name;
  const studentEmail = selectedStudent.student?.email || selectedStudent.email;
  const sessionTitle = selectedStudent.session?.title || selectedStudent.thesisTitle;
  const hasUploadedDocument = !!selectedStudent.studentFilePath;
  const isCompleted = !!(selectedStudent.studentFilePath && selectedStudent.professorFilePath);
  const isPendingReview = hasUploadedDocument && !selectedStudent.professorFilePath;
  
  // Get initials
  const getInitials = (name) => {
    if (!name) return 'ST';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Student Details & Document Management</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Student Info */}
          <div className="modal-student-info">
            <div className="modal-student-avatar">{getInitials(studentName)}</div>
            <div>
              <h3>{studentName}</h3>
              <p>{studentEmail}</p>
              <p style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>
                Approved {new Date(selectedStudent.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Thesis Info */}
          <div className="modal-section">
            <h4>Thesis Description</h4>
            <p className="thesis-description-text">{sessionTitle}</p>
          </div>

          {/* Document Status */}
          <div className="modal-section">
            <h4>Document Status</h4>
            {hasUploadedDocument ? (
              <div className="document-status-card uploaded">
                <div className="document-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="document-info">
                  <p className="document-name">{selectedStudent.studentFilePath.split('/').pop()}</p>
                  <p className="document-date">Uploaded by student</p>
                </div>
                <button className="document-download-btn">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Download
                </button>
              </div>
            ) : (
              <div className="document-status-card waiting">
                <div className="document-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="document-info">
                  <p className="document-name">Waiting for student to upload document</p>
                  <p className="document-date">Student has not completed Step 2 yet</p>
                </div>
              </div>
            )}
          </div>

          {/* Professor Actions - Only show if student uploaded document */}
          {isPendingReview && (
            <>
              <div className="modal-section">
                <h4>Upload Your Signed Document</h4>
                <div className="file-upload-area">
                  <input
                    type="file"
                    id="prof-document"
                    accept=".pdf,.doc,.docx"
                    onChange={onFileChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="prof-document" className="file-upload-label">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {professorDocument ? professorDocument.name : 'Click to upload your signed document'}
                  </label>
                </div>
              </div>

              <div className="modal-section">
                <h4>Rejection Message (if rejecting)</h4>
                <textarea
                  className="decline-reason-textarea"
                  placeholder="Provide a reason if you're rejecting the document and requesting a new one..."
                  value={rejectionMessage}
                  onChange={(e) => setRejectionMessage(e.target.value)}
                  rows="3"
                />
              </div>
            </>
          )}

          {/* Show if already completed */}
          {isCompleted && (
            <div className="modal-section">
              <div className="success-message">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>Document approved! Process completed.</p>
                <p style={{ fontSize: '13px', marginTop: '8px' }}>
                  Your signed document: {selectedStudent.professorFilePath.split('/').pop()}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-btn btn-secondary" onClick={onClose}>
            Close
          </button>
          {isPendingReview && (
            <>
              <button className="modal-btn btn-decline" onClick={onReject}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Reject & Request New
              </button>
              <button className="modal-btn btn-accept" onClick={onApprove}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Approve & Upload
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

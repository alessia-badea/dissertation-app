import React, { useState } from 'react';

export default function StudentUploadModal({ 
  request,
  onClose,
  onUpload
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  console.log('📋 Request data in modal:', request);

  if (!request) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    await onUpload(request.id, selectedFile);
    setIsUploading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Upload Dissertation Document</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Application Details */}
          <div className="modal-section">
            <h4>Your Application</h4>
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '16px', 
              borderRadius: '8px',
              marginTop: '8px'
            }}>
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Professor</p>
                <p style={{ fontWeight: '600', color: '#000' }}>{request.professor?.name || 'Professor'}</p>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Session</p>
                <p style={{ fontWeight: '600', color: '#000' }}>{request.session?.title || 'Registration Session'}</p>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Thesis Title</p>
                <p style={{ fontWeight: '600', color: '#000' }}>{request.thesisTitle || 'N/A'}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Thesis Description</p>
                <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#333' }}>
                  {request.thesisDescription || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="modal-section">
            <h4>Upload Your Document *</h4>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
              Upload your completed dissertation document for professor review. Accepted formats: PDF, DOC, DOCX (Max 10MB)
            </p>
            
            <div style={{
              border: '2px dashed #ddd',
              borderRadius: '8px',
              padding: '24px',
              textAlign: 'center',
              backgroundColor: '#fafafa',
              marginTop: '8px'
            }}>
              <input
                type="file"
                id="student-file-upload"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label 
                htmlFor="student-file-upload" 
                style={{ 
                  cursor: 'pointer',
                  display: 'block'
                }}
              >
                <svg 
                  width="48" 
                  height="48" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ margin: '0 auto 12px', color: '#0891b2' }}
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                  {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                </p>
                <p style={{ fontSize: '12px', color: '#999' }}>
                  PDF, DOC, or DOCX (max 10MB)
                </p>
              </label>
            </div>

            {selectedFile && (
              <div style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#e8f4f8',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#0e7490' }}>{selectedFile.name}</p>
                  <p style={{ fontSize: '12px', color: '#155e75' }}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: '#999'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div className="modal-section" style={{ 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffc107',
            padding: '12px',
            borderRadius: '6px'
          }}>
            <p style={{ fontSize: '13px', color: '#856404', margin: 0 }}>
              <strong>Note:</strong> Once uploaded, your document will be reviewed by your professor. 
              You will be notified when they provide feedback or approve your dissertation.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="modal-btn btn-secondary" 
            onClick={onClose}
            disabled={isUploading}
          >
            Cancel
          </button>
          <button 
            className="modal-btn btn-accept" 
            onClick={handleSubmit}
            disabled={isUploading || !selectedFile}
            style={{ backgroundColor: '#0891b2' }}
          >
            {isUploading ? (
              <>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Upload Document
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

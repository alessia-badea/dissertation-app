import React from 'react';
import './StudentCard.css';

export default function StudentCard({ student, actions, metadata }) {
  return (
    <div className="student-card">
      <div className="student-avatar">{student.initials}</div>
      <div className="student-info">
        <div className="student-name">{student.name}</div>
        {student.thesisTitle && (
          <div className="thesis-title">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{student.thesisTitle}</span>
          </div>
        )}
        {student.subjects && (
          <div className="thesis-title">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{student.subjects.join(', ')}</span>
          </div>
        )}
        {metadata && metadata.length > 0 && (
          <div className="student-meta">
            {metadata.map((item, index) => (
              <div key={index} className="meta-item">
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {actions && actions.length > 0 && (
        <div className="student-actions">
          {actions.map((action, index) => (
            <button
              key={index}
              className={`action-btn ${action.className}`}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

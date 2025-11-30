import React from 'react';
import './PageHeader.css';

export default function PageHeader({ icon, iconColor, title, subtitle, badge }) {
  return (
    <div className="page-header">
      <div className="page-title-section">
        <div className={`page-icon ${iconColor}`}>
          {icon}
        </div>
        <div className="page-title-content">
          <h1>{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
      </div>
      {badge && (
        <div className="count-badge">{badge}</div>
      )}
    </div>
  );
}

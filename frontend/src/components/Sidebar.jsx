import React from 'react';
import './Sidebar.css';

export default function Sidebar({ menuItems, activeMenu, onMenuChange }) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
            onClick={() => onMenuChange(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user: authUser, logout, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form state
  const [formData, setFormData] = useState({
    name: authUser?.name || '',
    email: authUser?.email || '',
    maxStudents: authUser?.maxStudents || 5, // Only for professors
  });

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const getInitials = (name) => {
    if (!name) return 'PR';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const user = {
    name: authUser?.name || 'Professor',
    role: authUser?.role === 'professor' ? 'Professor' : 'Student',
    initials: getInitials(authUser?.name)
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setMessage({ type: '', text: '' });

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all password fields.' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setIsSaving(true);

    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setShowPasswordChange(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to change password.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: authUser?.name || '',
      email: authUser?.email || '',
      maxStudents: authUser?.maxStudents || 5,
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'I confirm') {
      setMessage({ type: 'error', text: 'Please type "I confirm" to delete your account.' });
      return;
    }

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // TODO: Call backend API to delete account
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        // Logout and redirect to login
        await logout();
        navigate('/login');
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to delete account.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete account. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="profile-page">
      <Header user={user} />

      <div className="profile-container">
        <div className="profile-card">
          {/* Header */}
          <div className="profile-header">
            <div className="profile-avatar-large">{user.initials}</div>
            <div className="profile-header-info">
              <h1>{formData.name}</h1>
              <p className="profile-role">{user.role}</p>
              <p className="profile-email">{formData.email}</p>
            </div>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`profile-message ${message.type}`}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {message.type === 'success' ? (
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                  <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                )}
              </svg>
              <span>{message.text}</span>
            </div>
          )}

          {/* Profile Information */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Profile Information</h2>
              {!isEditing && (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>

            <div className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="form-value">{formData.name || 'Not set'}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="form-value">{formData.email}</p>
                  )}
                </div>
              </div>

              {authUser?.role === 'professor' && (
                <div className="form-group">
                  <label>Maximum Students</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="maxStudents"
                      value={formData.maxStudents}
                      onChange={handleInputChange}
                      className="form-input"
                      min="1"
                      max="20"
                    />
                  ) : (
                    <p className="form-value">{formData.maxStudents}</p>
                  )}
                  <p className="form-hint">Maximum number of students you can supervise at once</p>
                </div>
              )}

              {isEditing && (
                <div className="form-actions">
                  <button className="btn-cancel" onClick={handleCancel} disabled={isSaving}>
                    Cancel
                  </button>
                  <button className="btn-save" onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Security Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Security</h2>
            </div>

            {!showPasswordChange ? (
              <button className="change-password-btn" onClick={() => setShowPasswordChange(true)}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Change Password
              </button>
            ) : (
              <div className="password-change-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    placeholder="Enter current password"
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="form-actions">
                  <button 
                    className="btn-cancel" 
                    onClick={() => {
                      setShowPasswordChange(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                      setMessage({ type: '', text: '' });
                    }}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button className="btn-save" onClick={handleChangePassword} disabled={isSaving}>
                    {isSaving ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="profile-section danger-zone">
            <div className="section-header">
              <h2>Account Management</h2>
            </div>
            
            <div className="danger-content">
              <p className="danger-description">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>

              {!showDeleteConfirm ? (
                <button className="delete-account-btn" onClick={() => setShowDeleteConfirm(true)}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Delete Account
                </button>
              ) : (
                <div className="delete-confirm-form">
                  <div className="warning-box">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div>
                      <h4>Warning: This action is permanent!</h4>
                      <p>All your data will be permanently deleted and cannot be recovered.</p>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Type <strong>"I confirm"</strong> to delete your account:</label>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      className="form-input"
                      placeholder='Type "I confirm"'
                    />
                  </div>

                  <div className="form-actions">
                    <button 
                      className="btn-cancel" 
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText('');
                        setMessage({ type: '', text: '' });
                      }}
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={handleDeleteAccount}
                      disabled={isSaving || deleteConfirmText !== 'I confirm'}
                    >
                      {isSaving ? 'Deleting...' : 'Delete My Account'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

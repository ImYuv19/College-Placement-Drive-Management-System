import { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';

/**
 * Student Profile Page
 * Displays official student information (read-only for students).
 */
function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await authAPI.getMe();
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-container"><div className="loading">Loading profile...</div></div>;
  if (!profile) return <div className="page-container"><div className="empty-state"><h3>Profile not found</h3></div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Your official student information.</p>
      </div>

      <div className="detail-card">
        <div className="profile-avatar">
          <div className="avatar-circle">{profile.name?.charAt(0)}</div>
          <h2>{profile.name}</h2>
          <span className="profile-role">Student</span>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">🆔 Student ID</span>
            <span className="detail-value">{profile.studentId}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">👤 Username</span>
            <span className="detail-value">{profile.username}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">📱 Mobile</span>
            <span className="detail-value">{profile.mobile}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">📊 CGPA</span>
            <span className="detail-value cgpa-value">{profile.cgpa}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">🎓 Batch</span>
            <span className="detail-value">{profile.batch?.name || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">✅ Account Status</span>
            <span className="detail-value">{profile.isActive ? 'Active' : 'Disabled'}</span>
          </div>
        </div>

        <div className="info-notice">
          <strong>Note:</strong> To update your official information (CGPA, batch, etc.), please contact the college management office.
        </div>
      </div>
    </div>
  );
}

export default Profile;

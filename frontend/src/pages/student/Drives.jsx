import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { drivesAPI } from '../../services/api';
import DriveCard from '../../components/DriveCard';

/**
 * Student Drives Page
 * Shows all active placement drives available to students.
 */
function Drives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const { data } = await drivesAPI.getAll();
      setDrives(data);
    } catch (err) {
      console.error('Error fetching drives:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-container"><div className="loading">Loading drives...</div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Available Placement Drives</h1>
        <p>Browse and apply for active placement drives. Your CGPA: <strong>{user.cgpa}</strong></p>
      </div>

      {drives.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No Active Drives</h3>
          <p>There are no active placement drives at the moment. Check back later!</p>
        </div>
      ) : (
        <div className="drives-grid">
          {drives.map((drive) => (
            <DriveCard
              key={drive._id}
              drive={drive}
              userCgpa={user.cgpa}
              showStatus={true}
              actionLabel="View Details"
              onAction={() => navigate(`/student/drives/${drive._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Drives;

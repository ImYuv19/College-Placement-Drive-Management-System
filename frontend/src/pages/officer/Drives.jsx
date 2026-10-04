import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { drivesAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

/**
 * Officer Drives Page
 * Full CRUD management for placement drives.
 */
function Drives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

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

  const handleDelete = async (driveId) => {
    if (!window.confirm('Are you sure you want to delete/close this drive?')) return;
    
    try {
      const { data } = await drivesAPI.delete(driveId);
      setMessage({ text: data.message, type: 'success' });
      fetchDrives();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Error deleting drive', type: 'error' });
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  if (loading) return <div className="page-container"><div className="loading">Loading drives...</div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Manage Drives</h1>
        <button className="btn btn-primary" onClick={() => navigate('/officer/drives/create')}>
          + Create New Drive
        </button>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.text}
        </div>
      )}

      {drives.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🚀</div>
          <h3>No Drives Yet</h3>
          <p>Create your first placement drive to get started!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Min CGPA</th>
                <th>Drive Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drives.map((drive) => (
                <tr key={drive._id}>
                  <td className="td-bold">{drive.company?.name}</td>
                  <td>{drive.role}</td>
                  <td>{drive.minCgpa}</td>
                  <td>{formatDate(drive.driveDate)}</td>
                  <td><StatusBadge status={drive.status} /></td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => navigate(`/officer/drives/${drive._id}/applications`)}
                      >
                        Applications
                      </button>
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => navigate(`/officer/drives/${drive._id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(drive._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Drives;

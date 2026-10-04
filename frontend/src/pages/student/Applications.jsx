import { useState, useEffect } from 'react';
import { applicationsAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

/**
 * Student Applications Page
 * Shows all applications submitted by the logged-in student.
 */
function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await applicationsAPI.getMy();
      setApplications(data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  if (loading) return <div className="page-container"><div className="loading">Loading applications...</div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Applications</h1>
        <p>Track the status of all your placement applications.</p>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>No Applications Yet</h3>
          <p>You haven't applied to any placement drives yet. Browse available drives to get started!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Location</th>
                <th>Min CGPA</th>
                <th>Applied On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td className="td-bold">{app.drive?.company?.name || 'N/A'}</td>
                  <td>{app.drive?.role || 'N/A'}</td>
                  <td>{app.drive?.company?.location || 'N/A'}</td>
                  <td>{app.drive?.minCgpa || 'N/A'}</td>
                  <td>{formatDate(app.appliedAt)}</td>
                  <td><StatusBadge status={app.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Applications;

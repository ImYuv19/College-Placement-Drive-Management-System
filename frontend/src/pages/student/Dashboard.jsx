import { useState, useEffect } from 'react';
import { applicationsAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

/**
 * Student Dashboard
 * Shows summary: name, CGPA, batch, applications overview
 */
function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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

  const statusCounts = {
    Applied: applications.filter(a => a.status === 'Applied').length,
    Shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    Selected: applications.filter(a => a.status === 'Selected').length,
    Rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Student Dashboard</h1>
        <p>Welcome back, {user.name}!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">👤</div>
          <div className="stat-info">
            <span className="stat-value">{user.name}</span>
            <span className="stat-label">Student Name</span>
          </div>
        </div>
        <div className="stat-card stat-info-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span className="stat-value">{user.cgpa}</span>
            <span className="stat-label">CGPA</span>
          </div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-icon">🎓</div>
          <div className="stat-info">
            <span className="stat-value">{user.batch?.name || 'N/A'}</span>
            <span className="stat-label">Batch</span>
          </div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <span className="stat-value">{applications.length}</span>
            <span className="stat-label">Total Applications</span>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Application Status Summary</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="stats-grid">
            <div className="stat-card mini stat-applied">
              <span className="stat-value">{statusCounts.Applied}</span>
              <span className="stat-label">Applied</span>
            </div>
            <div className="stat-card mini stat-shortlisted">
              <span className="stat-value">{statusCounts.Shortlisted}</span>
              <span className="stat-label">Shortlisted</span>
            </div>
            <div className="stat-card mini stat-selected">
              <span className="stat-value">{statusCounts.Selected}</span>
              <span className="stat-label">Selected</span>
            </div>
            <div className="stat-card mini stat-rejected">
              <span className="stat-value">{statusCounts.Rejected}</span>
              <span className="stat-label">Rejected</span>
            </div>
          </div>
        )}
      </div>

      {applications.length > 0 && (
        <div className="section">
          <h2>Recent Applications</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Applied On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 5).map((app) => (
                  <tr key={app._id}>
                    <td>{app.drive?.company?.name || 'N/A'}</td>
                    <td>{app.drive?.role || 'N/A'}</td>
                    <td>{new Date(app.appliedAt).toLocaleDateString('en-IN')}</td>
                    <td><StatusBadge status={app.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

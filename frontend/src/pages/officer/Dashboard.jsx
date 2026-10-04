import { useState, useEffect } from 'react';
import { drivesAPI } from '../../services/api';

/**
 * Officer Dashboard
 * Shows summary of active/closed drives and application counts.
 */
function Dashboard() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const activeDrives = drives.filter(d => d.status === 'active');
  const closedDrives = drives.filter(d => d.status === 'closed');

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Officer Dashboard</h1>
        <p>Welcome, {user.name}! Manage placement drives and track applications.</p>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card stat-primary">
              <div className="stat-icon">🚀</div>
              <div className="stat-info">
                <span className="stat-value">{activeDrives.length}</span>
                <span className="stat-label">Active Drives</span>
              </div>
            </div>
            <div className="stat-card stat-warning">
              <div className="stat-icon">🔒</div>
              <div className="stat-info">
                <span className="stat-value">{closedDrives.length}</span>
                <span className="stat-label">Closed Drives</span>
              </div>
            </div>
            <div className="stat-card stat-info-card">
              <div className="stat-icon">📋</div>
              <div className="stat-info">
                <span className="stat-value">{drives.length}</span>
                <span className="stat-label">Total Drives</span>
              </div>
            </div>
          </div>

          {activeDrives.length > 0 && (
            <div className="section">
              <h2>Active Drives</h2>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Role</th>
                      <th>Min CGPA</th>
                      <th>Drive Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeDrives.slice(0, 5).map((drive) => (
                      <tr key={drive._id}>
                        <td className="td-bold">{drive.company?.name}</td>
                        <td>{drive.role}</td>
                        <td>{drive.minCgpa}</td>
                        <td>{new Date(drive.driveDate).toLocaleDateString('en-IN')}</td>
                        <td><span className="status-badge badge-active">{drive.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;

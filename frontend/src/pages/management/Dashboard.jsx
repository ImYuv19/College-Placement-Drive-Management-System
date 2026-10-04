import { useState, useEffect } from 'react';
import { managementAPI } from '../../services/api';

/**
 * Management Dashboard
 * Shows overview: total students, active batch, officer info, etc.
 */
function Dashboard() {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, batchesRes] = await Promise.all([
        managementAPI.getStudents(),
        managementAPI.getBatches()
      ]);
      setStudents(studentsRes.data);
      setBatches(batchesRes.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeBatch = batches.find(b => b.isActive);
  const activeStudents = students.filter(s => s.isActive).length;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Management Dashboard</h1>
        <p>Welcome, {user.name}! Manage students, batches, and accounts.</p>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card stat-primary">
              <div className="stat-icon">🎓</div>
              <div className="stat-info">
                <span className="stat-value">{students.length}</span>
                <span className="stat-label">Total Students</span>
              </div>
            </div>
            <div className="stat-card stat-success">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <span className="stat-value">{activeStudents}</span>
                <span className="stat-label">Active Students</span>
              </div>
            </div>
            <div className="stat-card stat-info-card">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <span className="stat-value">{activeBatch?.name || 'None'}</span>
                <span className="stat-label">Active Batch</span>
              </div>
            </div>
            <div className="stat-card stat-warning">
              <div className="stat-icon">📋</div>
              <div className="stat-info">
                <span className="stat-value">{batches.length}</span>
                <span className="stat-label">Total Batches</span>
              </div>
            </div>
          </div>

          {batches.length > 0 && (
            <div className="section">
              <h2>Batch Overview</h2>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Batch Name</th>
                      <th>Students</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches.map((batch) => (
                      <tr key={batch._id}>
                        <td className="td-bold">{batch.name}</td>
                        <td>{batch.studentCount || 0}</td>
                        <td>
                          <span className={`status-badge ${batch.isActive ? 'badge-active' : 'badge-closed'}`}>
                            {batch.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
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

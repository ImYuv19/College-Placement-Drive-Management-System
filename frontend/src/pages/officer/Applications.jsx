import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { drivesAPI, applicationsAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

/**
 * Officer Applications Page
 * View and manage applications for a specific drive.
 * Officer can update application status (Applied → Shortlisted → Selected / Rejected).
 */
function Applications() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [driveRes, appsRes] = await Promise.all([
        drivesAPI.getById(id),
        drivesAPI.getApplications(id)
      ]);
      setDrive(driveRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await applicationsAPI.updateStatus(appId, newStatus);
      setMessage({ text: `Status updated to ${newStatus}`, type: 'success' });
      fetchData();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Error updating status', type: 'error' });
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  if (loading) return <div className="page-container"><div className="loading">Loading...</div></div>;

  return (
    <div className="page-container">
      <button className="btn btn-ghost" onClick={() => navigate('/officer/drives')}>← Back to Drives</button>

      {drive && (
        <div className="page-header">
          <div>
            <h1>Applications — {drive.company?.name}</h1>
            <p>Role: {drive.role} | Min CGPA: {drive.minCgpa} | Date: {formatDate(drive.driveDate)}</p>
          </div>
          <StatusBadge status={drive.status} />
        </div>
      )}

      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.text}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>No Applications</h3>
          <p>No students have applied for this drive yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>CGPA</th>
                <th>Mobile</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>{app.student?.studentId}</td>
                  <td className="td-bold">{app.student?.name}</td>
                  <td>{app.student?.cgpa}</td>
                  <td>{app.student?.mobile}</td>
                  <td>{formatDate(app.appliedAt)}</td>
                  <td><StatusBadge status={app.status} /></td>
                  <td>
                    <select
                      className="status-select"
                      value={app.status}
                      onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
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

export default Applications;

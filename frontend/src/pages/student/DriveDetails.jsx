import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { drivesAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

/**
 * Drive Details Page
 * Shows full drive information and allows eligible students to apply.
 */
function DriveDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDrive();
  }, [id]);

  const fetchDrive = async () => {
    try {
      const { data } = await drivesAPI.getById(id);
      setDrive(data);
    } catch (err) {
      console.error('Error fetching drive:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    setMessage({ text: '', type: '' });

    try {
      const { data } = await drivesAPI.apply(id);
      setMessage({ text: data.message || 'Application submitted successfully!', type: 'success' });
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to apply';
      const errData = err.response?.data;
      let fullMsg = errMsg;
      if (errData?.requiredCgpa !== undefined) {
        fullMsg += ` Required CGPA: ${errData.requiredCgpa}, Your CGPA: ${errData.yourCgpa}`;
      }
      setMessage({ text: fullMsg, type: 'error' });
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="page-container"><div className="loading">Loading...</div></div>;
  if (!drive) return <div className="page-container"><div className="empty-state"><h3>Drive not found</h3></div></div>;

  const isEligible = user.cgpa >= drive.minCgpa;
  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="page-container">
      <button className="btn btn-ghost" onClick={() => navigate('/student/drives')}>← Back to Drives</button>
      
      <div className="detail-card">
        <div className="detail-header">
          <div>
            <h1>{drive.company?.name}</h1>
            <span className="detail-role">{drive.role}</span>
          </div>
          <StatusBadge status={drive.status} />
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">📍 Location</span>
            <span className="detail-value">{drive.company?.location}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">📊 Minimum CGPA</span>
            <span className="detail-value cgpa-value">{drive.minCgpa}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">📅 Drive Date</span>
            <span className="detail-value">{formatDate(drive.driveDate)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">👤 Your CGPA</span>
            <span className="detail-value">{user.cgpa}</span>
          </div>
        </div>

        {drive.description && (
          <div className="detail-description">
            <h3>Description</h3>
            <p>{drive.description}</p>
          </div>
        )}

        <div className={`eligibility-banner ${isEligible ? 'eligible' : 'not-eligible'}`}>
          {isEligible 
            ? '✅ You meet the CGPA requirement for this drive'
            : `❌ Your CGPA (${user.cgpa}) is below the minimum requirement (${drive.minCgpa})`
          }
        </div>

        {message.text && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {message.text}
          </div>
        )}

        {drive.status === 'active' && (
          <button
            className={`btn btn-primary btn-lg ${!isEligible ? 'btn-disabled' : ''}`}
            onClick={handleApply}
            disabled={!isEligible || applying}
          >
            {applying ? 'Applying...' : isEligible ? 'Apply Now' : 'Not Eligible'}
          </button>
        )}
        {drive.status === 'closed' && (
          <div className="alert alert-warning">This drive is closed and no longer accepting applications.</div>
        )}
      </div>
    </div>
  );
}

export default DriveDetails;

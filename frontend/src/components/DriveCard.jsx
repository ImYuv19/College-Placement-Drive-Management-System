import StatusBadge from './StatusBadge';

/**
 * DriveCard Component
 * 
 * Displays a placement drive as a card with company details, role, CGPA requirement, etc.
 */
function DriveCard({ drive, onAction, actionLabel, showStatus, userCgpa }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isEligible = userCgpa !== undefined ? userCgpa >= drive.minCgpa : null;

  return (
    <div className={`drive-card ${drive.status === 'closed' ? 'drive-closed' : ''}`}>
      <div className="drive-card-header">
        <h3 className="drive-company">{drive.company?.name || 'Unknown Company'}</h3>
        {showStatus && <StatusBadge status={drive.status} />}
      </div>
      <div className="drive-role">{drive.role}</div>
      <div className="drive-details">
        <div className="drive-detail">
          <span className="detail-label">📍 Location:</span>
          <span>{drive.company?.location || 'N/A'}</span>
        </div>
        <div className="drive-detail">
          <span className="detail-label">📊 Min CGPA:</span>
          <span className="cgpa-value">{drive.minCgpa}</span>
        </div>
        <div className="drive-detail">
          <span className="detail-label">📅 Drive Date:</span>
          <span>{formatDate(drive.driveDate)}</span>
        </div>
      </div>
      {drive.description && (
        <p className="drive-description">{drive.description}</p>
      )}
      {isEligible !== null && (
        <div className={`eligibility-indicator ${isEligible ? 'eligible' : 'not-eligible'}`}>
          {isEligible ? '✅ You are eligible' : '❌ CGPA below requirement'}
        </div>
      )}
      {onAction && (
        <button 
          className={`btn btn-primary drive-action-btn ${isEligible === false ? 'btn-disabled' : ''}`}
          onClick={() => onAction(drive)}
          disabled={isEligible === false || drive.status === 'closed'}
        >
          {actionLabel || 'View Details'}
        </button>
      )}
    </div>
  );
}

export default DriveCard;

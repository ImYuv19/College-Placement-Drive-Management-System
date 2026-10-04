/**
 * StatusBadge Component
 * 
 * Displays application status with color-coded badges.
 */
function StatusBadge({ status }) {
  const getStatusClass = () => {
    switch (status) {
      case 'Applied': return 'badge-applied';
      case 'Shortlisted': return 'badge-shortlisted';
      case 'Selected': return 'badge-selected';
      case 'Rejected': return 'badge-rejected';
      case 'active': return 'badge-active';
      case 'closed': return 'badge-closed';
      default: return 'badge-default';
    }
  };

  return (
    <span className={`status-badge ${getStatusClass()}`}>
      {status}
    </span>
  );
}

export default StatusBadge;

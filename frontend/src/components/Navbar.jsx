import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

/**
 * Navbar Component
 * 
 * Dynamic navigation bar that changes based on user role.
 * Shows different menu items for Student, Officer, and Management.
 */
function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // If not logged in, don't show navbar
  if (!token || !user) return null;

  // Define nav links based on role
  const getNavLinks = () => {
    switch (user.role) {
      case 'student':
        return [
          { path: '/student/dashboard', label: 'Dashboard' },
          { path: '/student/drives', label: 'Drives' },
          { path: '/student/applications', label: 'My Applications' },
          { path: '/student/profile', label: 'Profile' },
        ];
      case 'officer':
        return [
          { path: '/officer/dashboard', label: 'Dashboard' },
          { path: '/officer/drives', label: 'Drives' },
          { path: '/officer/applications', label: 'Applications' },
        ];
      case 'management':
        return [
          { path: '/management/dashboard', label: 'Dashboard' },
          { path: '/management/students', label: 'Students' },
          { path: '/management/import', label: 'Import Batch' },
          { path: '/management/batches', label: 'Batches' },
          { path: '/management/officer-account', label: 'Officer Account' },
          { path: '/management/account', label: 'My Account' },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const getRoleLabel = () => {
    switch (user.role) {
      case 'student': return 'Student';
      case 'officer': return 'Placement Officer';
      case 'management': return 'College Management';
      default: return '';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={`/${user.role}/dashboard`} className="navbar-logo">
          🎓 CPDMS
        </Link>
        <span className="navbar-role">{getRoleLabel()}</span>
        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>
      <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <div className="navbar-user">
          <span className="navbar-username">{user.name}</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

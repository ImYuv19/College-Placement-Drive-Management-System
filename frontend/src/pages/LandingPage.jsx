import { Link } from 'react-router-dom';

/**
 * Landing Page
 * 
 * The main entry point of the application.
 * Displays three login choices: Student, Officer, Management.
 */
function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <div className="landing-content">
        <div className="landing-header">
          <div className="landing-icon">🎓</div>
          <h1>College Placement Drive<br />Management System</h1>
          <p className="landing-subtitle">
            Streamlining campus recruitment for students, placement officers, and college management.
          </p>
        </div>
        <div className="login-options">
          <Link to="/login/student" className="login-card login-student">
            <div className="login-card-icon">👨‍🎓</div>
            <h2>Student Login</h2>
            <p>View drives, apply for placements, and track your applications.</p>
            <span className="login-card-arrow">→</span>
          </Link>
          <Link to="/login/officer" className="login-card login-officer">
            <div className="login-card-icon">👨‍💼</div>
            <h2>Placement Officer Login</h2>
            <p>Manage placement drives, review applications, and update statuses.</p>
            <span className="login-card-arrow">→</span>
          </Link>
          <Link to="/login/management" className="login-card login-management">
            <div className="login-card-icon">🏛️</div>
            <h2>College Management Login</h2>
            <p>Manage students, batches, and administrative accounts.</p>
            <span className="login-card-arrow">→</span>
          </Link>
        </div>
        <footer className="landing-footer">
          <p>B.Tech CSE Academic Project — Backend Development</p>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;

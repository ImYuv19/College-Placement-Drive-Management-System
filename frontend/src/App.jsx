import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import StudentLogin from './pages/StudentLogin';
import OfficerLogin from './pages/OfficerLogin';
import ManagementLogin from './pages/ManagementLogin';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentDrives from './pages/student/Drives';
import StudentDriveDetails from './pages/student/DriveDetails';
import StudentApplications from './pages/student/Applications';
import StudentProfile from './pages/student/Profile';

// Officer Pages
import OfficerDashboard from './pages/officer/Dashboard';
import OfficerDrives from './pages/officer/Drives';
import CreateDrive from './pages/officer/CreateDrive';
import EditDrive from './pages/officer/EditDrive';
import OfficerApplications from './pages/officer/Applications';

// Management Pages
import ManagementDashboard from './pages/management/Dashboard';
import ManagementStudents from './pages/management/Students';
import ImportBatch from './pages/management/ImportBatch';
import Batches from './pages/management/Batches';
import OfficerAccount from './pages/management/OfficerAccount';
import ManagementAccount from './pages/management/ManagementAccount';

import './index.css';

/**
 * Main App Component
 * 
 * Sets up routing for all pages:
 * - Public routes: Landing page, three login pages
 * - Student routes: Protected, only accessible by students
 * - Officer routes: Protected, only accessible by officers
 * - Management routes: Protected, only accessible by management
 */
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* ========== Public Routes ========== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/login/officer" element={<OfficerLogin />} />
        <Route path="/login/management" element={<ManagementLogin />} />

        {/* ========== Student Routes (Protected) ========== */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/student/drives" element={
          <ProtectedRoute allowedRoles={['student']}><StudentDrives /></ProtectedRoute>
        } />
        <Route path="/student/drives/:id" element={
          <ProtectedRoute allowedRoles={['student']}><StudentDriveDetails /></ProtectedRoute>
        } />
        <Route path="/student/applications" element={
          <ProtectedRoute allowedRoles={['student']}><StudentApplications /></ProtectedRoute>
        } />
        <Route path="/student/profile" element={
          <ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>
        } />

        {/* ========== Officer Routes (Protected) ========== */}
        <Route path="/officer/dashboard" element={
          <ProtectedRoute allowedRoles={['officer']}><OfficerDashboard /></ProtectedRoute>
        } />
        <Route path="/officer/drives" element={
          <ProtectedRoute allowedRoles={['officer']}><OfficerDrives /></ProtectedRoute>
        } />
        <Route path="/officer/drives/create" element={
          <ProtectedRoute allowedRoles={['officer']}><CreateDrive /></ProtectedRoute>
        } />
        <Route path="/officer/drives/:id/edit" element={
          <ProtectedRoute allowedRoles={['officer']}><EditDrive /></ProtectedRoute>
        } />
        <Route path="/officer/drives/:id/applications" element={
          <ProtectedRoute allowedRoles={['officer']}><OfficerApplications /></ProtectedRoute>
        } />
        <Route path="/officer/applications" element={
          <ProtectedRoute allowedRoles={['officer']}><OfficerDrives /></ProtectedRoute>
        } />

        {/* ========== Management Routes (Protected) ========== */}
        <Route path="/management/dashboard" element={
          <ProtectedRoute allowedRoles={['management']}><ManagementDashboard /></ProtectedRoute>
        } />
        <Route path="/management/students" element={
          <ProtectedRoute allowedRoles={['management']}><ManagementStudents /></ProtectedRoute>
        } />
        <Route path="/management/import" element={
          <ProtectedRoute allowedRoles={['management']}><ImportBatch /></ProtectedRoute>
        } />
        <Route path="/management/batches" element={
          <ProtectedRoute allowedRoles={['management']}><Batches /></ProtectedRoute>
        } />
        <Route path="/management/officer-account" element={
          <ProtectedRoute allowedRoles={['management']}><OfficerAccount /></ProtectedRoute>
        } />
        <Route path="/management/account" element={
          <ProtectedRoute allowedRoles={['management']}><ManagementAccount /></ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;

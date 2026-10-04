import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { drivesAPI, companiesAPI } from '../../services/api';

/**
 * Create Drive Page
 * Form for officers to create a new placement drive.
 */
function CreateDrive() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNewCompany, setShowNewCompany] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', location: '', description: '' });
  const [form, setForm] = useState({
    company: '',
    role: '',
    minCgpa: '',
    description: '',
    driveDate: ''
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data } = await companiesAPI.getAll();
      setCompanies(data);
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    if (!newCompany.name || !newCompany.location) {
      setError('Company name and location are required');
      return;
    }
    try {
      const { data } = await companiesAPI.create(newCompany);
      setCompanies([...companies, data]);
      setForm({ ...form, company: data._id });
      setShowNewCompany(false);
      setNewCompany({ name: '', location: '', description: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating company');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await drivesAPI.create({
        ...form,
        minCgpa: Number(form.minCgpa)
      });
      navigate('/officer/drives');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating drive');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <button className="btn btn-ghost" onClick={() => navigate('/officer/drives')}>← Back to Drives</button>
      
      <div className="form-card">
        <h1>Create Placement Drive</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company *</label>
            <div className="input-with-action">
              <select
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                required
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>{c.name} — {c.location}</option>
                ))}
              </select>
              <button type="button" className="btn btn-sm btn-outline" onClick={() => setShowNewCompany(!showNewCompany)}>
                {showNewCompany ? 'Cancel' : '+ New'}
              </button>
            </div>
          </div>

          {showNewCompany && (
            <div className="inline-form">
              <h3>Add New Company</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Company Name *</label>
                  <input type="text" value={newCompany.name} onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })} placeholder="Company name" />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input type="text" value={newCompany.location} onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })} placeholder="City, State" />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={newCompany.description} onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })} placeholder="Brief description" rows="2" />
              </div>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleAddCompany}>Add Company</button>
            </div>
          )}

          <div className="form-group">
            <label>Job Role *</label>
            <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g., Software Developer" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Minimum CGPA (0-10) *</label>
              <input type="number" step="0.1" min="0" max="10" value={form.minCgpa} onChange={(e) => setForm({ ...form, minCgpa: e.target.value })} placeholder="e.g., 7.0" required />
            </div>
            <div className="form-group">
              <label>Drive Date *</label>
              <input type="date" value={form.driveDate} onChange={(e) => setForm({ ...form, driveDate: e.target.value })} required />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Drive description, requirements, etc." rows="4" />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Drive'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateDrive;

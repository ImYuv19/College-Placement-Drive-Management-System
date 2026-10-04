import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { drivesAPI, companiesAPI } from '../../services/api';

/**
 * Edit Drive Page
 * Form for officers to update an existing placement drive.
 */
function EditDrive() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    company: '',
    role: '',
    minCgpa: '',
    description: '',
    driveDate: '',
    status: 'active'
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [driveRes, companiesRes] = await Promise.all([
        drivesAPI.getById(id),
        companiesAPI.getAll()
      ]);
      const drive = driveRes.data;
      setCompanies(companiesRes.data);
      setForm({
        company: drive.company?._id || '',
        role: drive.role,
        minCgpa: drive.minCgpa,
        description: drive.description || '',
        driveDate: drive.driveDate ? drive.driveDate.split('T')[0] : '',
        status: drive.status
      });
    } catch (err) {
      setError('Error loading drive data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await drivesAPI.update(id, {
        ...form,
        minCgpa: Number(form.minCgpa)
      });
      navigate('/officer/drives');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating drive');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-container"><div className="loading">Loading drive...</div></div>;

  return (
    <div className="page-container">
      <button className="btn btn-ghost" onClick={() => navigate('/officer/drives')}>← Back to Drives</button>
      
      <div className="form-card">
        <h1>Edit Placement Drive</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company *</label>
            <select value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required>
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>{c.name} — {c.location}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Job Role *</label>
            <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Minimum CGPA (0-10) *</label>
              <input type="number" step="0.1" min="0" max="10" value={form.minCgpa} onChange={(e) => setForm({ ...form, minCgpa: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Drive Date *</label>
              <input type="date" value={form.driveDate} onChange={(e) => setForm({ ...form, driveDate: e.target.value })} required />
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="4" />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
            {saving ? 'Saving...' : 'Update Drive'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditDrive;

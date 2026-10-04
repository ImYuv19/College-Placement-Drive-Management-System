import { useState, useEffect } from 'react';
import { managementAPI } from '../../services/api';

/**
 * Officer Account Management Page
 * Management can update the placement officer's credentials.
 */
function OfficerAccount() {
  const [form, setForm] = useState({ name: '', username: '', mobile: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchOfficer();
  }, []);

  const fetchOfficer = async () => {
    try {
      // Get students list to find officer info — or just use the update endpoint
      // We'll fetch current officer data through the update endpoint
      const { data } = await managementAPI.updateOfficer({});
      setForm({ name: data.name, username: data.username, mobile: data.mobile, password: '' });
    } catch (err) {
      // If no data to update, just show empty form
      console.log('Loading officer info');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const updateData = { ...form };
      if (!updateData.password) delete updateData.password;

      await managementAPI.updateOfficer(updateData);
      setMessage({ text: 'Officer account updated successfully', type: 'success' });
      setForm({ ...form, password: '' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Error updating officer', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-container"><div className="loading">Loading...</div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Placement Officer Account</h1>
        <p>Manage the placement officer's credentials and information.</p>
      </div>

      <div className="form-card">
        {message.text && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Officer name" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" />
            </div>
            <div className="form-group">
              <label>Mobile</label>
              <input type="text" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="Mobile number" />
            </div>
          </div>
          <div className="form-group">
            <label>New Password (leave empty to keep current)</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="New password" />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
            {saving ? 'Saving...' : 'Update Officer Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OfficerAccount;

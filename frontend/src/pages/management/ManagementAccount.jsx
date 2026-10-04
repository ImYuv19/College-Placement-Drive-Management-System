import { useState, useEffect } from 'react';
import { managementAPI, authAPI } from '../../services/api';

/**
 * Management Account Page
 * Management can update their own account credentials.
 */
function ManagementAccount() {
  const [form, setForm] = useState({ name: '', username: '', mobile: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    try {
      const { data } = await authAPI.getMe();
      setForm({ name: data.name, username: data.username, mobile: data.mobile, password: '' });
    } catch (err) {
      console.error('Error:', err);
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

      const { data } = await managementAPI.updateAccount(updateData);
      setMessage({ text: 'Account updated successfully', type: 'success' });
      setForm({ ...form, password: '' });

      // Update localStorage with new info
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...user,
        name: data.name,
        username: data.username,
        mobile: data.mobile
      }));
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Error updating account', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-container"><div className="loading">Loading...</div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Account</h1>
        <p>Update your management account credentials.</p>
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
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Mobile</label>
              <input type="text" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>New Password (leave empty to keep current)</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="New password" />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
            {saving ? 'Saving...' : 'Update Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ManagementAccount;

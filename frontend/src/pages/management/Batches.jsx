import { useState, useEffect } from 'react';
import { managementAPI } from '../../services/api';

/**
 * Batch Management Page
 * View, create, and activate academic batches.
 */
function Batches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBatchName, setNewBatchName] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const { data } = await managementAPI.getBatches();
      setBatches(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newBatchName.trim()) return;

    try {
      await managementAPI.createBatch({ name: newBatchName.trim() });
      setMessage({ text: 'Batch created successfully', type: 'success' });
      setNewBatchName('');
      fetchBatches();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Error creating batch', type: 'error' });
    }
  };

  const handleActivate = async (batchId, batchName) => {
    if (!window.confirm(`Activate batch "${batchName}"? This will deactivate all other batches.`)) return;

    try {
      await managementAPI.activateBatch(batchId);
      setMessage({ text: `Batch "${batchName}" is now active`, type: 'success' });
      fetchBatches();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Error activating batch', type: 'error' });
    }
  };

  if (loading) return <div className="page-container"><div className="loading">Loading batches...</div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Batch Management</h1>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.text}
        </div>
      )}

      <div className="form-card compact">
        <h3>Create New Batch</h3>
        <form onSubmit={handleCreate} className="inline-form-row">
          <input
            type="text"
            value={newBatchName}
            onChange={(e) => setNewBatchName(e.target.value)}
            placeholder="e.g., 2027-28"
            required
          />
          <button type="submit" className="btn btn-primary">Create Batch</button>
        </form>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Batch Name</th>
              <th>Students</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch) => (
              <tr key={batch._id}>
                <td className="td-bold">{batch.name}</td>
                <td>{batch.studentCount || 0}</td>
                <td>
                  <span className={`status-badge ${batch.isActive ? 'badge-active' : 'badge-closed'}`}>
                    {batch.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{new Date(batch.createdAt).toLocaleDateString('en-IN')}</td>
                <td>
                  {!batch.isActive && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleActivate(batch._id, batch.name)}
                    >
                      Activate
                    </button>
                  )}
                  {batch.isActive && (
                    <span className="text-muted">Current</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Batches;

import { useState, useEffect } from 'react';
import { managementAPI } from '../../services/api';

/**
 * Management Students Page
 * Search, filter, view, and edit student records.
 */
function Students() {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, batchesRes] = await Promise.all([
        managementAPI.getStudents(),
        managementAPI.getBatches()
      ]);
      setStudents(studentsRes.data);
      setBatches(batchesRes.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (batchFilter) params.batch = batchFilter;
      const { data } = await managementAPI.getStudents(params);
      setStudents(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student._id);
    setEditForm({
      name: student.name,
      username: student.username,
      mobile: student.mobile,
      cgpa: student.cgpa,
      batch: student.batch?._id || '',
      isActive: student.isActive,
      password: ''
    });
  };

  const handleSave = async () => {
    try {
      const updateData = { ...editForm };
      if (!updateData.password) delete updateData.password;
      updateData.cgpa = Number(updateData.cgpa);

      await managementAPI.updateStudent(editingStudent, updateData);
      setMessage({ text: 'Student updated successfully', type: 'success' });
      setEditingStudent(null);
      fetchData();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Error updating student', type: 'error' });
    }
  };

  if (loading) return <div className="page-container"><div className="loading">Loading students...</div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Student Management</h1>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, student ID, or username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <select value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)}>
          <option value="">All Batches</option>
          {batches.map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={handleSearch}>Search</button>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.text}
        </div>
      )}

      {/* Edit Modal */}
      {editingStudent && (
        <div className="modal-overlay" onClick={() => setEditingStudent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Student</h2>
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Mobile</label>
              <input type="text" value={editForm.mobile} onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>CGPA (0-10)</label>
                <input type="number" step="0.1" min="0" max="10" value={editForm.cgpa} onChange={(e) => setEditForm({ ...editForm, cgpa: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Batch</label>
                <select value={editForm.batch} onChange={(e) => setEditForm({ ...editForm, batch: e.target.value })}>
                  <option value="">Select Batch</option>
                  {batches.map((b) => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>New Password (leave empty to keep current)</label>
              <input type="password" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} placeholder="New password" />
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={editForm.isActive} onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })} />
                Account Active
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setEditingStudent(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Username</th>
              <th>CGPA</th>
              <th>Batch</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.studentId}</td>
                <td className="td-bold">{student.name}</td>
                <td>{student.username}</td>
                <td>{student.cgpa}</td>
                <td>{student.batch?.name || 'N/A'}</td>
                <td>{student.mobile}</td>
                <td>
                  <span className={`status-badge ${student.isActive ? 'badge-active' : 'badge-closed'}`}>
                    {student.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline" onClick={() => handleEdit(student)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="table-footer">Showing {students.length} students</p>
    </div>
  );
}

export default Students;

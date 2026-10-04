import { useState } from 'react';
import { managementAPI } from '../../services/api';

/**
 * Import Batch Page
 * Upload CSV/XLSX file to import student data.
 * Shows validation errors and import results.
 */
function ImportBatch() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (!['csv', 'xlsx', 'xls'].includes(ext)) {
        setError('Only CSV and XLSX files are allowed');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
      setResults(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await managementAPI.importStudents(formData);
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error importing file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Import Student Batch</h1>
        <p>Upload a CSV or XLSX file to import student data.</p>
      </div>

      <div className="form-card">
        <div className="import-info">
          <h3>📋 Expected File Format</h3>
          <p>The file should contain the following columns:</p>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>CGPA</th>
                  <th>Batch</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>CSE2027044</td>
                  <td>John Doe</td>
                  <td>9876543210</td>
                  <td>john.doe</td>
                  <td>Password@123</td>
                  <td>8.5</td>
                  <td>2026-27</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="upload-section">
          <div className="file-upload">
            <input
              type="file"
              id="file-upload"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="file-upload" className="file-label">
              <span className="upload-icon">📁</span>
              <span>{file ? file.name : 'Choose file (CSV or XLSX)'}</span>
            </label>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button
            className="btn btn-primary btn-full"
            onClick={handleImport}
            disabled={!file || loading}
          >
            {loading ? 'Importing...' : 'Import Students'}
          </button>
        </div>

        {/* Import Results */}
        {results && (
          <div className="import-results">
            <h3>Import Results</h3>
            <div className="results-summary">
              <div className={`result-item ${results.success > 0 ? 'result-success' : ''}`}>
                <span className="result-value">{results.success}</span>
                <span className="result-label">Successfully Imported</span>
              </div>
              <div className={`result-item ${results.failed > 0 ? 'result-error' : ''}`}>
                <span className="result-value">{results.failed}</span>
                <span className="result-label">Failed</span>
              </div>
            </div>

            {results.errors && results.errors.length > 0 && (
              <div className="error-list">
                <h4>Errors:</h4>
                {results.errors.map((err, idx) => (
                  <div key={idx} className="error-item">
                    <strong>Row {err.row}:</strong> {err.errors.join(', ')}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ImportBatch;

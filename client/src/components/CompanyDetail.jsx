import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContextProvider';
import { companyAPI, userAPI } from '../services/apiService';

const CompanyDetail = () => {
  const { id } = useParams();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  
  const [company, setCompany] = useState(null);
  const [users, setUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    industry: '',
    companySize: ''
  });

  useEffect(() => {
    fetchCompanyAndUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCompanyAndUsers = async () => {
    try {
      setLoading(true);
      const [companyData, allUsers] = await Promise.all([
        companyAPI.getCompanyById(authUser.access_token, id),
        userAPI.getAllUsers(authUser.access_token)
      ]);
      
      setCompany(companyData);
      setFormData({
        name: companyData.name,
        address: companyData.address || '',
        industry: companyData.industry || '',
        companySize: companyData.companySize || ''
      });

      // Get company's users
      const companyUsers = allUsers.filter(u => 
        companyData.userIds?.includes(u.id)
      );
      setUsers(companyUsers);

      // Get available users (not assigned to company)
      const available = allUsers.filter(u => 
        !companyData.userIds?.includes(u.id)
      );
      setAvailableUsers(available);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedCompany = await companyAPI.updateCompany(authUser.access_token, id, formData);
      setCompany(updatedCompany);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddUser = async (userId) => {
    try {
      await companyAPI.addUserToCompany(authUser.access_token, id, userId);
      await fetchCompanyAndUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveUser = async (userId) => {
    if (!window.confirm('Remove this user from the company?')) return;
    
    try {
      await companyAPI.removeUserFromCompany(authUser.access_token, id, userId);
      await fetchCompanyAndUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Company not found</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <button className="btn btn-link" onClick={() => navigate('/companies')}>
            <i className="bi bi-arrow-left"></i>
          </button>
          Company Details
        </h2>
        <button
          className="btn btn-outline-success"
          onClick={() => setEditMode(!editMode)}
        >
          <i className="bi bi-pencil me-2"></i>
          {editMode ? 'Cancel Edit' : 'Edit Company'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Company Info Card */}
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Company Information</h5>
            </div>
            <div className="card-body">
              {editMode ? (
                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Company Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Industry</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Company Size</label>
                    <select
                      className="form-select"
                      value={formData.companySize}
                      onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                    >
                      <option value="">Select size...</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501+">501+ employees</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-success w-100">
                    Save Changes
                  </button>
                </form>
              ) : (
                <>
                  <p><strong>ID:</strong> {company.id}</p>
                  <p><strong>Name:</strong> {company.name}</p>
                  <p><strong>Address:</strong> {company.address || 'N/A'}</p>
                  <p><strong>Industry:</strong> {company.industry || 'N/A'}</p>
                  <p><strong>Company Size:</strong> {company.companySize || 'N/A'}</p>
                  <p><strong>Created At:</strong> {new Date(company.createdAt).toLocaleString()}</p>
                  <p><strong>Updated At:</strong> {new Date(company.updatedAt).toLocaleString()}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Employees Section */}
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Employees ({users.length})</h5>
            </div>
            <div className="card-body">
              {users.length === 0 ? (
                <p className="text-muted">No employees assigned</p>
              ) : (
                <ul className="list-group">
                  {users.map((user) => (
                    <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{user.username}</strong>
                        <br />
                        <small className="text-muted">
                          {user.firstName} {user.lastName} • {user.email}
                        </small>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveUser(user.id)}
                      >
                        <i className="bi bi-x-circle"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Add User Dropdown */}
              {availableUsers.length > 0 && (
                <div className="mt-3">
                  <label className="form-label">Add Employee:</label>
                  <select
                    className="form-select"
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddUser(parseInt(e.target.value));
                        e.target.value = '';
                      }
                    }}
                  >
                    <option value="">Select a user...</option>
                    {availableUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username} - {user.email}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContextProvider';
import { userAPI, companyAPI } from '../services/apiService';

const UserDetail = () => {
  const { id } = useParams();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    fetchUserAndCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchUserAndCompanies = async () => {
    try {
      setLoading(true);
      const [userData, allCompanies] = await Promise.all([
        userAPI.getUserById(authUser.access_token, id),
        companyAPI.getAllCompanies(authUser.access_token)
      ]);
      
      setUser(userData);
      setFormData({
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || ''
      });

      // Get user's companies
      const userCompanies = allCompanies.filter(c => 
        userData.companyIds?.includes(c.id)
      );
      setCompanies(userCompanies);

      // Get available companies (not assigned to user)
      const available = allCompanies.filter(c => 
        !userData.companyIds?.includes(c.id)
      );
      setAvailableCompanies(available);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await userAPI.updateUser(authUser.access_token, id, formData);
      setUser(updatedUser);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddCompany = async (companyId) => {
    try {
      await userAPI.addUserToCompany(authUser.access_token, id, companyId);
      await fetchUserAndCompanies();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveCompany = async (companyId) => {
    if (!window.confirm('Remove this company from the user?')) return;
    
    try {
      await userAPI.removeUserFromCompany(authUser.access_token, id, companyId);
      await fetchUserAndCompanies();
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

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">User not found</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <button className="btn btn-link" onClick={() => navigate('/users')}>
            <i className="bi bi-arrow-left"></i>
          </button>
          User Details
        </h2>
        <button
          className="btn btn-outline-primary"
          onClick={() => setEditMode(!editMode)}
        >
          <i className="bi bi-pencil me-2"></i>
          {editMode ? 'Cancel Edit' : 'Edit User'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* User Info Card */}
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">User Information</h5>
            </div>
            <div className="card-body">
              {editMode ? (
                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn btn-success w-100">
                    Save Changes
                  </button>
                </form>
              ) : (
                <>
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>First Name:</strong> {user.firstName || 'N/A'}</p>
                  <p><strong>Last Name:</strong> {user.lastName || 'N/A'}</p>
                  <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                  <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Companies Section */}
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Companies ({companies.length})</h5>
            </div>
            <div className="card-body">
              {companies.length === 0 ? (
                <p className="text-muted">No companies assigned</p>
              ) : (
                <ul className="list-group">
                  {companies.map((company) => (
                    <li key={company.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{company.name}</strong>
                        <br />
                        <small className="text-muted">{company.industry}</small>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveCompany(company.id)}
                      >
                        <i className="bi bi-x-circle"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Add Company Dropdown */}
              {availableCompanies.length > 0 && (
                <div className="mt-3">
                  <label className="form-label">Add to Company:</label>
                  <select
                    className="form-select"
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddCompany(parseInt(e.target.value));
                        e.target.value = '';
                      }
                    }}
                  >
                    <option value="">Select a company...</option>
                    {availableCompanies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name} - {company.industry}
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

export default UserDetail;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContextProvider';
import { companyAPI } from '../services/apiService';

const CompaniesList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await companyAPI.getAllCompanies(user.access_token);
      setCompanies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (companyId) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;

    try {
      await companyAPI.deleteCompany(user.access_token, companyId);
      setCompanies(companies.filter(c => c.id !== companyId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Get unique industries for filter
  const industries = [...new Set(companies.map(c => c.industry).filter(Boolean))];

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.industry?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = !industryFilter || c.industry === industryFilter;
    
    return matchesSearch && matchesIndustry;
  });

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Companies Management</h2>
        <button
          className="btn btn-success"
          onClick={() => navigate('/companies/create')}
        >
          <i className="bi bi-building me-2"></i>
          Create Company
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, address, or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
          >
            <option value="">All Industries</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="row">
        {filteredCompanies.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info text-center">
              No companies found
            </div>
          </div>
        ) : (
          filteredCompanies.map((company) => (
            <div key={company.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm hover-shadow">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">{company.name}</h5>
                    <span className="badge bg-primary">{company.industry || 'N/A'}</span>
                  </div>
                  
                  <p className="card-text text-muted">
                    <i className="bi bi-geo-alt me-2"></i>
                    {company.address || 'No address'}
                  </p>
                  
                  <p className="card-text">
                    <i className="bi bi-people me-2"></i>
                    <span className="badge bg-info">
                      {company.userIds?.length || 0} employees
                    </span>
                  </p>

                  {company.companySize && (
                    <p className="card-text">
                      <i className="bi bi-bar-chart me-2"></i>
                      Size: {company.companySize}
                    </p>
                  )}
                  
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-muted">
                      Created: {new Date(company.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
                <div className="card-footer bg-white border-0">
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/companies/${company.id}`)}
                    >
                      <i className="bi bi-eye me-1"></i>
                      View
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(company.id)}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card text-center bg-light">
            <div className="card-body">
              <h5 className="card-title">Total Companies</h5>
              <p className="display-6">{companies.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center bg-light">
            <div className="card-body">
              <h5 className="card-title">Industries</h5>
              <p className="display-6">{industries.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompaniesList;

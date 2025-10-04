import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContextProvider';
import { userAPI, companyAPI } from '../services/apiService';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    recentUsers: [],
    recentCompanies: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [users, companies, userInfo] = await Promise.all([
        userAPI.getAllUsers(user.access_token),
        companyAPI.getAllCompanies(user.access_token),
        userAPI.getCurrentUserInfo(user.access_token).catch(() => null)
      ]);

      setCurrentUser(userInfo?.user);
      
      setStats({
        totalUsers: users.length,
        totalCompanies: companies.length,
        recentUsers: users.slice(-5).reverse(),
        recentCompanies: companies.slice(-5).reverse()
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncUser = async () => {
    try {
      const syncedUser = await userAPI.syncCurrentUser(user.access_token);
      console.log(syncedUser);
      setCurrentUser(syncedUser);
      await fetchDashboardData();
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

  return (
    <div className="container-fluid">
      {/* Top Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <i className="bi bi-building me-2"></i>
            Resource Server Dashboard
          </a>
          <div className="d-flex align-items-center">
            <span className="text-white me-3">
              <i className="bi bi-person-circle me-2"></i>
              {user?.profile?.name || user?.profile?.sub}
            </span>
            <button className="btn btn-outline-light btn-sm" onClick={logout}>
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        {/* Welcome Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <h3 className="card-title">
                  Welcome back, {user?.profile?.name || 'User'}! 👋
                </h3>
                <p className="card-text text-muted">
                  Manage your users and companies from this dashboard.
                </p>
                {!currentUser && (
                  <div className="alert alert-warning">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    You haven't synced your profile yet.
                    <button className="btn btn-sm btn-warning ms-3" onClick={handleSyncUser}>
                      Sync Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <div className="card text-white bg-primary shadow">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-uppercase mb-0">Total Users</h6>
                    <h2 className="display-4 mb-0">{stats.totalUsers}</h2>
                  </div>
                  <div className="fs-1">
                    <i className="bi bi-people"></i>
                  </div>
                </div>
                <button
                  className="btn btn-light btn-sm mt-3"
                  onClick={() => navigate('/users')}
                >
                  View All Users
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="card text-white bg-success shadow">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-uppercase mb-0">Total Companies</h6>
                    <h2 className="display-4 mb-0">{stats.totalCompanies}</h2>
                  </div>
                  <div className="fs-1">
                    <i className="bi bi-building"></i>
                  </div>
                </div>
                <button
                  className="btn btn-light btn-sm mt-3"
                  onClick={() => navigate('/companies')}
                >
                  View All Companies
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white">
                <h5 className="mb-0">Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-3 mb-3">
                    <button
                      className="btn btn-outline-primary w-100 py-3"
                      onClick={() => navigate('/users')}
                    >
                      <i className="bi bi-people fs-1 d-block mb-2"></i>
                      Manage Users
                    </button>
                  </div>
                  <div className="col-md-3 mb-3">
                    <button
                      className="btn btn-outline-success w-100 py-3"
                      onClick={() => navigate('/companies')}
                    >
                      <i className="bi bi-building fs-1 d-block mb-2"></i>
                      Manage Companies
                    </button>
                  </div>
                  <div className="col-md-3 mb-3">
                    <button
                      className="btn btn-outline-info w-100 py-3"
                      onClick={() => navigate('/users/create')}
                    >
                      <i className="bi bi-person-plus fs-1 d-block mb-2"></i>
                      Add User
                    </button>
                  </div>
                  <div className="col-md-3 mb-3">
                    <button
                      className="btn btn-outline-warning w-100 py-3"
                      onClick={() => navigate('/companies/create')}
                    >
                      <i className="bi bi-building-add fs-1 d-block mb-2"></i>
                      Add Company
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Recent Users</h5>
              </div>
              <div className="card-body">
                {stats.recentUsers.length === 0 ? (
                  <p className="text-muted">No users yet</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {stats.recentUsers.map((u) => (
                      <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{u.username}</strong>
                          <br />
                          <small className="text-muted">{u.email}</small>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => navigate(`/users/${u.id}`)}
                        >
                          View
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Recent Companies</h5>
              </div>
              <div className="card-body">
                {stats.recentCompanies.length === 0 ? (
                  <p className="text-muted">No companies yet</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {stats.recentCompanies.map((c) => (
                      <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{c.name}</strong>
                          <br />
                          <small className="text-muted">{c.industry}</small>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => navigate(`/companies/${c.id}`)}
                        >
                          View
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState } from 'react';

import { useAuth } from '../providers/AuthContextProvider';

const Home = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resourceData, setResourceData] = useState(null);
  const [error, setError] = useState(null);

  const fetchProtectedResource = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:9090/api/protected', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch protected resource');
      }
      const data = await response.json();
      setResourceData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const fetchUserInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:9090/api/user-info', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const data = await response.json();
      setResourceData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Welcome to the App</h1>

      {user && (
        <div className="card shadow p-4 mb-4">
          <p className="fs-5">Hello, <strong>{user.profile.sub}</strong></p>

          <div className="d-flex gap-2">
            <button onClick={() => fetchUserInfo()} className="btn btn-info">
              Fetch User Info
            </button>
            <button onClick={logout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      )}

      {loading && <div className="alert alert-warning">Loading...</div>}

      {error && <div className="alert alert-danger">Error: {error}</div>}

      {resourceData && (
        <div className="card shadow p-3 mt-4">
          <h3 className="mb-3">Resource Data:</h3>
          <pre className="bg-light p-3 rounded">
            {JSON.stringify(resourceData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Home;

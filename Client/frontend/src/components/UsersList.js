import React, { useState, useEffect } from 'react';
import UserService from '../services/userService';
import LoadingSpinner from './LoadingSpinner';
import Alert from './Alert';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await UserService.getUsers();
      if (result.success) {
        setUsers(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Đã có lỗi xảy ra khi lấy danh sách users.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa user này?')) {
      try {
        const result = await UserService.deleteUser(userId);
        if (result.success) {
          // Refresh danh sách users
          fetchUsers();
          alert('Xóa user thành công!');
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert('Đã có lỗi xảy ra khi xóa user.');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Đang tải danh sách users..." />;
  }

  if (error) {
    return (
      <div className="container mt-5">
        <Alert type="danger" message={error} />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Danh sách Users</h2>
        <button 
          className="btn btn-success"
          onClick={() => fetchUsers()}
        >
          Làm mới
        </button>
      </div>

      {users.length === 0 ? (
        <div className="alert alert-info">
          Không có user nào trong hệ thống.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Họ và tên</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.fullName || 'N/A'}</td>
                  <td>
                    {user.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('vi-VN')
                      : 'N/A'
                    }
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => alert(`Xem chi tiết user: ${user.username}`)}
                      >
                        Chi tiết
                      </button>
                      <button 
                        className="btn btn-sm btn-warning"
                        onClick={() => alert(`Chỉnh sửa user: ${user.username}`)}
                      >
                        Sửa
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-3">
        <small className="text-muted">
          Tổng số users: {users.length}
        </small>
      </div>
    </div>
  );
};

export default UsersList;
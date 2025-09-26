import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <div className="jumbotron bg-primary text-white p-5 rounded">
            <h1 className="display-4">Chào mừng đến với OAuth2 App</h1>
            <p className="lead">
              Ứng dụng demo OAuth2 với Spring Boot và React
            </p>
            <hr className="my-4" style={{ borderColor: 'white' }} />
            
            {isAuthenticated ? (
              <div>
                <p>Xin chào, <strong>{user?.username}</strong>!</p>
                <p>Bạn đã đăng nhập thành công. Hãy khám phá các tính năng của ứng dụng:</p>
                <div className="d-flex gap-3">
                  <Link className="btn btn-light btn-lg" to="/users" role="button">
                    Xem danh sách Users
                  </Link>
                  <Link className="btn btn-outline-light btn-lg" to="/companies" role="button">
                    Xem danh sách Companies
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <p>Vui lòng đăng nhập để sử dụng đầy đủ tính năng của ứng dụng.</p>
                <div className="d-flex gap-3">
                  <Link className="btn btn-light btn-lg" to="/login" role="button">
                    Đăng nhập
                  </Link>
                  <Link className="btn btn-outline-light btn-lg" to="/register" role="button">
                    Đăng ký
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-shield-check"></i> Bảo mật OAuth2
              </h5>
              <p className="card-text">
                Ứng dụng sử dụng chuẩn OAuth2 để đảm bảo bảo mật và ủy quyền truy cập.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-people"></i> Quản lý Users
              </h5>
              <p className="card-text">
                Xem và quản lý danh sách người dùng trong hệ thống.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-building"></i> Quản lý Companies
              </h5>
              <p className="card-text">
                Thêm, sửa, xóa và quản lý thông tin các công ty.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
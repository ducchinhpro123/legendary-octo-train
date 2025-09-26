import React, { useState, useEffect } from 'react';
import CompanyService from '../services/companyService';
import LoadingSpinner from './LoadingSpinner';
import Alert from './Alert';

const CompaniesList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const result = await CompanyService.getCompanies();
      if (result.success) {
        setCompanies(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Đã có lỗi xảy ra khi lấy danh sách companies.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa company này?')) {
      try {
        const result = await CompanyService.deleteCompany(companyId);
        if (result.success) {
          fetchCompanies();
          alert('Xóa company thành công!');
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert('Đã có lỗi xảy ra khi xóa company.');
      }
    }
  };

  const handleShowModal = (company = null) => {
    if (company) {
      setCurrentCompany(company);
      setFormData({
        name: company.name || '',
        description: company.description || '',
        address: company.address || '',
        phone: company.phone || '',
        email: company.email || ''
      });
    } else {
      setCurrentCompany(null);
      setFormData({
        name: '',
        description: '',
        address: '',
        phone: '',
        email: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCompany(null);
    setFormData({
      name: '',
      description: '',
      address: '',
      phone: '',
      email: ''
    });
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (currentCompany) {
        result = await CompanyService.updateCompany(currentCompany.id, formData);
      } else {
        result = await CompanyService.createCompany(formData);
      }

      if (result.success) {
        fetchCompanies();
        handleCloseModal();
        alert(currentCompany ? 'Cập nhật company thành công!' : 'Tạo company thành công!');
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Đã có lỗi xảy ra.');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Đang tải danh sách companies..." />;
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
        <h2>Danh sách Companies</h2>
        <div>
          <button 
            className="btn btn-success me-2"
            onClick={() => handleShowModal()}
          >
            Thêm Company
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => fetchCompanies()}
          >
            Làm mới
          </button>
        </div>
      </div>

      {companies.length === 0 ? (
        <div className="alert alert-info">
          Không có company nào trong hệ thống.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Mô tả</th>
                <th>Địa chỉ</th>
                <th>Điện thoại</th>
                <th>Email</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <td>{company.id}</td>
                  <td>{company.name}</td>
                  <td>{company.description || 'N/A'}</td>
                  <td>{company.address || 'N/A'}</td>
                  <td>{company.phone || 'N/A'}</td>
                  <td>{company.email || 'N/A'}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <button 
                        className="btn btn-sm btn-warning"
                        onClick={() => handleShowModal(company)}
                      >
                        Sửa
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteCompany(company.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {currentCompany ? 'Chỉnh sửa Company' : 'Thêm Company mới'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Tên *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Mô tả</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">Địa chỉ</label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Điện thoại</label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {currentCompany ? 'Cập nhật' : 'Tạo mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-3">
        <small className="text-muted">
          Tổng số companies: {companies.length}
        </small>
      </div>
    </div>
  );
};

export default CompaniesList;
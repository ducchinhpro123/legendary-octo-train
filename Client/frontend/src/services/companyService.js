import { ResourceAPI } from './api';

class CompanyService {
  // Lấy danh sách companies
  async getCompanies() {
    try {
      const response = await ResourceAPI.get('/api/companies');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lấy danh sách companies thất bại' 
      };
    }
  }

  // Lấy thông tin company theo ID
  async getCompanyById(id) {
    try {
      const response = await ResourceAPI.get(`/api/companies/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lấy thông tin company thất bại' 
      };
    }
  }

  // Tạo company mới
  async createCompany(companyData) {
    try {
      const response = await ResourceAPI.post('/api/companies', companyData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Tạo company thất bại' 
      };
    }
  }

  // Cập nhật thông tin company
  async updateCompany(id, companyData) {
    try {
      const response = await ResourceAPI.put(`/api/companies/${id}`, companyData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Cập nhật company thất bại' 
      };
    }
  }

  // Xóa company
  async deleteCompany(id) {
    try {
      const response = await ResourceAPI.delete(`/api/companies/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Xóa company thất bại' 
      };
    }
  }
}

export default new CompanyService();
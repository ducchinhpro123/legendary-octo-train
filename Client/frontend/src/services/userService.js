import { ResourceAPI } from './api';

class UserService {
  // Lấy danh sách users
  async getUsers() {
    try {
      const response = await ResourceAPI.get('/api/users');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lấy danh sách users thất bại' 
      };
    }
  }

  // Lấy thông tin user theo ID
  async getUserById(id) {
    try {
      const response = await ResourceAPI.get(`/api/users/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lấy thông tin user thất bại' 
      };
    }
  }

  // Cập nhật thông tin user
  async updateUser(id, userData) {
    try {
      const response = await ResourceAPI.put(`/api/users/${id}`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Cập nhật user thất bại' 
      };
    }
  }

  // Xóa user
  async deleteUser(id) {
    try {
      const response = await ResourceAPI.delete(`/api/users/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Xóa user thất bại' 
      };
    }
  }
}

export default new UserService();
import axios from 'axios';

// Tạo axios instance cho Authorization Server
const AuthAPI = axios.create({
  baseURL: 'http://localhost:8080', // Authorization Server
});

// Tạo axios instance cho Resource Server
const ResourceAPI = axios.create({
  baseURL: 'http://localhost:9090', // Resource Server
});

// Interceptor để thêm token vào header cho Resource Server
ResourceAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response cho cả hai API
const handleResponseError = (error) => {
  if (error.response?.status === 401) {
    // Token hết hạn, xóa token và redirect về login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

AuthAPI.interceptors.response.use(
  (response) => response,
  handleResponseError
);

ResourceAPI.interceptors.response.use(
  (response) => response,
  handleResponseError
);

export { AuthAPI, ResourceAPI };
export default ResourceAPI;
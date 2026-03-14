import api from './api';

export const productService = {
  getAllProducts: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/products?${params}`);
  },
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getStats: () => api.get('/products/stats')
};

export const orderService = {
  getAllOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post('/orders', data),
  updateOrder: (id, data) => api.put(`/orders/${id}`, data),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
  exportOrderPDF: (id) => api.get(`/orders/${id}/export-pdf`, { responseType: 'blob' }),
  getStats: () => api.get('/orders/stats')
};

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
  adminLogin: (email, password) => api.post('/auth/admin-login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  getAllUsers: () => api.get('/auth/users/all'),
  createUser: (data) => api.post('/auth/users', data),
  updateUser: (id, data) => api.put(`/auth/users/${id}`, data),
  deleteUser: (id) => api.delete(`/auth/users/${id}`)
};

export const customOrderService = {
  getAllCustomOrders: (status = null) => {
    if (status) {
      return api.get(`/custom-orders?status=${status}`);
    }
    return api.get('/custom-orders');
  },
  getMyCustomOrders: () => api.get('/custom-orders/my'),
  getCustomOrderById: (id) => api.get(`/custom-orders/${id}`),
  updateCustomOrderStatus: (id, status) => api.put(`/custom-orders/${id}`, { status }),
  deleteCustomOrder: (id) => api.delete(`/custom-orders/${id}`),
  getStats: () => api.get('/custom-orders/stats')
};

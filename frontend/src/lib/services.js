import api from '../lib/api';

// Auth APIs
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password, role) => 
    api.post('/auth/register', { name, email, password, role }),
  getCurrentUser: () => api.get('/auth/me'),
};

// Product APIs
export const productAPI = {
  getAll: (skip = 0, limit = 100) => api.get('/products/', { params: { skip, limit } }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products/', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  search: (query) => api.get('/products/search/', { params: { q: query } }),
  getLowStock: () => api.get('/products/stock/low'),
};

// Order APIs
export const orderAPI = {
  getAll: (skip = 0, limit = 100, status = null) => 
    api.get('/orders/', { params: { skip, limit, status_filter: status } }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders/', data),
  update: (id, data) => api.put(`/orders/${id}`, data),
};

// Shipment APIs
export const shipmentAPI = {
  getAll: (skip = 0, limit = 100, status = null) => 
    api.get('/shipments/', { params: { skip, limit, status_filter: status } }),
  getById: (id) => api.get(`/shipments/${id}`),
  getByTracking: (trackingNumber) => api.get(`/shipments/tracking/${trackingNumber}`),
  create: (data) => api.post('/shipments/', data),
  update: (id, data) => api.put(`/shipments/${id}`, data),
  getDelayed: () => api.get('/shipments/status/delayed'),
  getInTransit: () => api.get('/shipments/status/in-transit'),
};

// Supplier APIs
export const supplierAPI = {
  getAll: (skip = 0, limit = 100) => api.get('/suppliers/', { params: { skip, limit } }),
  getById: (id) => api.get(`/suppliers/${id}`),
  create: (data) => api.post('/suppliers/', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),
};

// AI Insights APIs
export const aiAPI = {
  getDemandForecast: (productId, daysAhead = 30) => 
    api.get(`/ai/forecast/${productId}`, { params: { days_ahead: daysAhead } }),
  getReorderRecommendations: () => api.get('/ai/reorder-recommendations'),
  detectAnomalies: () => api.get('/ai/anomalies'),
  predictDeliveryDelays: () => api.get('/ai/delivery-delays'),
  getDashboardMetrics: () => api.get('/ai/dashboard-metrics'),
};

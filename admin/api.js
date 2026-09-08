import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCategories = () => api.get('/api/categories');
export const createCategory = (data) => api.post('/api/categories', data);
export const updateCategory = (id, data) => api.put(`/api/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/api/categories/${id}`);

export const getProducts = () => api.get('/api/products');
export const createProduct = (data) => api.post('/api/products', data);
export const updateProduct = (id, data) => api.put(`/api/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);

export const getHeroBanners = () => api.get('/api/hero-banners');
export const createHeroBanner = (data) => api.post('/api/hero-banners', data);
export const updateHeroBanner = (id, data) => api.put(`/api/hero-banners/${id}`, data);
export const deleteHeroBanner = (id) => api.delete(`/api/hero-banners/${id}`);
export const reorderHeroBanners = (data) => api.put('/api/hero-banners/reorder', data);

export const getDesigners = () => api.get('/api/designers');
export const createDesigner = (data) => api.post('/api/designers', data);
export const updateDesigner = (id, data) => api.put(`/api/designers/${id}`, data);
export const deleteDesigner = (id) => api.delete(`/api/designers/${id}`);

export const getCelebrities = () => api.get('/api/celebrities');
export const createCelebrity = (data) => api.post('/api/celebrities', data);
export const updateCelebrity = (id, data) => api.put(`/api/celebrities/${id}`, data);
export const deleteCelebrity = (id) => api.delete(`/api/celebrities/${id}`);

export const getWeddingItems = () => api.get('/api/wedding-items');
export const createWeddingItem = (data) => api.post('/api/wedding-items', data);
export const updateWeddingItem = (id, data) => api.put(`/api/wedding-items/${id}`, data);
export const deleteWeddingItem = (id) => api.delete(`/api/wedding-items/${id}`);

export const getFavourites = () => api.get('/api/favourites');
export const createFavourite = (data) => api.post('/api/favourites', data);
export const updateFavourite = (id, data) => api.put(`/api/favourites/${id}`, data);
export const deleteFavourite = (id) => api.delete(`/api/favourites/${id}`);

export const getCollections = () => api.get('/api/collections');
export const createCollection = (data) => api.post('/api/collections', data);
export const updateCollection = (id, data) => api.put(`/api/collections/${id}`, data);
export const deleteCollection = (id) => api.delete(`/api/collections/${id}`);

export const getCollectionImages = () => api.get('/api/collection-images');
export const createCollectionImage = (data) => api.post('/api/collection-images', data);
export const updateCollectionImage = (id, data) => api.put(`/api/collection-images/${id}`, data);
export const deleteCollectionImage = (id) => api.delete(`/api/collection-images/${id}`);

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getOrders = (params) => api.get('/api/orders', { params });
export const updateOrderStatus = (id, data) => api.patch(`/api/orders/${id}/status`, data);

export const getCustomOrders = (params) => api.get('/api/custom-orders', { params });
export const setCustomOrderPrice = (id, data) => api.patch(`/api/custom-orders/${id}/price`, data);
export const addCustomOrderMessage = (id, data) => api.post(`/api/custom-orders/${id}/messages`, data);
export const updateCustomOrderStatus = (id, data) => api.patch(`/api/custom-orders/${id}/status`, data);

export default api;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Types
export type HeroBanner = {
  _id: string;
  title: string;
  imageUrl: string;
  mobileImageUrl: string;
  linkUrl: string;
  buttonText: string;
  order: number;
  isActive: boolean;
};

export type Category = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  showInHomePage: boolean;
  homePageOrder: number;
};

export type ApiProduct = {
  _id: string;
  category: string | Category;
  title: string;
  subtitle: string;
  currentPrice: number;
  previousPrice: number;
  discountPercentage: number;
  imageUrl: string;
  designerName: string;
  productCode?: string;
  description?: string;
  shippingInfo?: string;
  disclaimer?: string;
  sizes?: string[];
  bottomSizes?: string[];
  stockBySize?: Record<string, number>;
  customTailoringEnabled?: boolean;
  addons?: Array<{
    _id?: string;
    name: string;
    price: number;
    hasSizes?: boolean;
    sizes?: string[];
  }>;
  showInHomePage: boolean;
  variants?: Array<{
    color: string;
    images: string[];
    currentPrice: number;
    previousPrice?: number;
    discountPercentage?: number;
  }>;
  tags?: string[];
  isActive?: boolean;
};

export type Designer = {
  _id: string;
  name: string;
  imageUrl: string;
  subtitle: string;
  profileUrl: string;
  order: number;
  isActive: boolean;
};

export type Celebrity = {
  _id: string;
  name: string;
  imageUrl: string;
  subtitle: string;
  profileUrl: string;
  order: number;
  isActive: boolean;
};

export type WeddingItem = {
  _id: string;
  name: string;
  imageUrl: string;
  subtitle: string;
  href: string;
  order: number;
  isActive: boolean;
  isWide: boolean;
};

export type FavouriteItem = {
  _id: string;
  imageUrl: string;
  href: string;
  position: string;
  order: number;
  isActive: boolean;
};

export type HomepageProductGroup = {
  category: Category;
  products: ApiProduct[];
};

// Helper
async function fetchApi<T>(endpoint: string): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    return [] as unknown as T;
  }
}

async function fetchProductById(productId: string): Promise<ApiProduct | null> {
  try {
    const res = await fetch(`${API_URL}/api/products/${productId}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data._id) return null;
    return data as ApiProduct;
  } catch (error) {
    console.error(`Failed to fetch product ${productId}:`, error);
    return null;
  }
}

// API functions
export const getActiveBanners = () => fetchApi<HeroBanner[]>('/api/hero-banners/active');
export const getHomepageCategories = () => fetchApi<Category[]>('/api/categories/homepage');
export const getBulkShowCategories = () => fetchApi<Category[]>('/api/categories/bulk-show');
export const getHomepageProducts = () => fetchApi<HomepageProductGroup[]>('/api/products/homepage');
export const getBulkShowProducts = () => fetchApi<HomepageProductGroup[]>('/api/products/bulk-show');
export const getCategories = () => fetchApi<Category[]>('/api/categories');
export const getProducts = () => fetchApi<ApiProduct[]>('/api/products');
export const getProductsByCategory = (categoryId: string) => fetchApi<ApiProduct[]>(`/api/products/category/${categoryId}`);
export const getProductById = (productId: string) => fetchProductById(productId);
export const getDesigners = () => fetchApi<Designer[]>('/api/designers');
export const getCelebrities = () => fetchApi<Celebrity[]>('/api/celebrities');
export const getWeddingItems = () => fetchApi<WeddingItem[]>('/api/wedding-items');
export const getFavourites = () => fetchApi<FavouriteItem[]>('/api/favourites');

export type CollectionImage = {
  _id: string;
  collection: string;
  imageUrl: string;
  position: number;
  href: string;
  isActive: boolean;
};

export type Collection = {
  _id: string;
  title: string;
  order: number;
  isActive: boolean;
  images: CollectionImage[];
};

export const getActiveCollections = () => fetchApi<Collection[]>('/api/collections/active');

// Orders & pricing
async function postApi<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `API error: ${res.status}`);
  }
  return res.json();
}

async function patchApi<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `API error: ${res.status}`);
  }
  return res.json();
}

export const calculateProductPrice = (productId: string, data: {
  size: string;
  bottomSize?: string;
  colorIndex?: number;
  addons?: { addonId?: string; name?: string; size?: string }[];
  quantity?: number;
}) => postApi(`/api/pricing/${productId}/calculate-price`, data);

export const calculateCartPrice = (items: {
  productId: string;
  size: string;
  bottomSize?: string;
  colorIndex?: number;
  price?: number;
  addons?: { addonId?: string; name?: string; size?: string }[];
  quantity?: number;
}[]) => postApi('/api/pricing/cart/calculate', { items });

export const getOrders = (params?: { email?: string; mobile?: string }) => {
  const qs = new URLSearchParams();
  if (params?.email) qs.set('email', params.email);
  if (params?.mobile) qs.set('mobile', params.mobile);
  const query = qs.toString();
  return fetchApi<import('@/lib/types').Order[]>(`/api/orders${query ? `?${query}` : ''}`);
};

export const getOrderByNumber = (orderNumber: string) =>
  fetchApi<import('@/lib/types').Order>(`/api/orders/number/${orderNumber}`);

export const createOrder = (data: {
  customerName?: string;
  customerEmail: string;
  customerMobile: string;
  items: {
    productId: string;
    size: string;
    bottomSize?: string;
    colorIndex?: number;
    unitPrice?: number;
    addons?: { addonId?: string; name?: string; size?: string }[];
    quantity?: number;
  }[];
  discount?: number;
}) => postApi<import('@/lib/types').Order>('/api/orders', data);

export const getCustomOrders = (params?: { email?: string; mobile?: string }) => {
  const qs = new URLSearchParams();
  if (params?.email) qs.set('email', params.email);
  if (params?.mobile) qs.set('mobile', params.mobile);
  const query = qs.toString();
  return fetchApi<import('@/lib/types').CustomOrder[]>(`/api/custom-orders${query ? `?${query}` : ''}`);
};

export const getCustomOrderByNumber = (orderNumber: string) =>
  fetchApi<import('@/lib/types').CustomOrder>(`/api/custom-orders/number/${orderNumber}`);

export const createCustomOrder = (data: {
  productId: string;
  color?: string;
  colorIndex?: number;
  unit: 'inches' | 'cms';
  measurements: import('@/lib/types').MeasurementFields;
  customerEmail: string;
  customerMobile: string;
}) => postApi<import('@/lib/types').CustomOrder>('/api/custom-orders', data);

export const addCustomOrderMessage = (orderId: string, data: { sender: 'customer' | 'admin'; text: string }) =>
  postApi<import('@/lib/types').CustomOrder>(`/api/custom-orders/${orderId}/messages`, data);

export const setCustomOrderPrice = (orderId: string, data: { quotedPrice: number; note?: string }) =>
  patchApi<import('@/lib/types').CustomOrder>(`/api/custom-orders/${orderId}/price`, data);

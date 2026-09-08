import type { ApiProduct } from "@/lib/api";
import { getProductById as apiGetProductById, getProducts as apiGetProducts } from "@/lib/api";
import { resolveImage } from "@/lib/images";
import { getMockProductList, getMockRelatedProducts } from "@/lib/mocks/products";
import type { Product, ProductListParams, ProductListResult } from "@/lib/types";

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"];

function mapStock(stockBySize?: Record<string, number> | Map<string, number>): Record<string, number> {
  if (!stockBySize) return {};
  if (stockBySize instanceof Map) return Object.fromEntries(stockBySize);
  return stockBySize;
}

function apiToProduct(p: ApiProduct): Product {
  const variant = p.variants?.[0];
  const price = Number(p.currentPrice ?? variant?.currentPrice ?? 0);
  const prev = Number(p.previousPrice ?? variant?.previousPrice ?? 0);

  return {
    id: p._id,
    categoryId: typeof p.category === "object" ? p.category._id : p.category,
    title: p.title,
    subtitle: p.subtitle,
    designerName: p.designerName || "TRILOKINI",
    currentPrice: price,
    previousPrice: prev > price ? prev : undefined,
    discountPercentage: p.discountPercentage || variant?.discountPercentage,
    imageUrl: resolveImage(p.imageUrl || variant?.images?.[0]),
    variants: p.variants?.map((v) => ({
      color: v.color,
      images: (v.images || []).map(resolveImage),
      currentPrice: v.currentPrice,
      previousPrice: v.previousPrice,
      discountPercentage: v.discountPercentage,
    })),
    tags: p.tags,
    productCode: p.productCode || p._id.slice(-8).toUpperCase(),
    sizes: p.sizes?.length ? p.sizes : DEFAULT_SIZES,
    bottomSizes: p.bottomSizes?.length ? p.bottomSizes : (p.sizes?.length ? p.sizes : DEFAULT_SIZES),
    stockBySize: mapStock(p.stockBySize),
    description: p.description || p.subtitle,
    shippingInfo: p.shippingInfo || "This product will be shipped to you after 3-4 weeks from the date of order placed. All custom made orders are not returnable.",
    disclaimer: p.disclaimer || "This product will be exclusively handcrafted for you, making the colour/texture/pattern slightly vary from the image shown, due to multiple artisan-led techniques and processes involved.",
    customTailoringEnabled: p.customTailoringEnabled ?? true,
    addons: p.addons?.map((a) => ({
      id: a._id || a.name,
      name: a.name,
      price: a.price,
      hasSizes: a.hasSizes,
      sizes: a.sizes,
    })),
  };
}

export async function getProductList(params: ProductListParams = {}): Promise<ProductListResult> {
  try {
    const apiProducts = await apiGetProducts();
    if (Array.isArray(apiProducts) && apiProducts.length > 0) {
      let products = apiProducts.map(apiToProduct);
      const mockResult = getMockProductList(params);

      if (params.category) {
        products = products.filter(
          (p) => p.categoryId === params.category || p.tags?.includes(params.category!)
        );
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        products = products.filter((p) =>
          `${p.title} ${p.designerName}`.toLowerCase().includes(q)
        );
      }
      if (params.sort === "Price - Low to High") products.sort((a, b) => a.currentPrice - b.currentPrice);
      else if (params.sort === "Price - High to Low") products.sort((a, b) => b.currentPrice - a.currentPrice);

      const page = params.page ?? 1;
      const limit = params.limit ?? 12;
      const start = (page - 1) * limit;

      return {
        products: products.slice(start, start + limit),
        total: products.length,
        page,
        totalPages: Math.max(1, Math.ceil(products.length / limit)),
        filterGroups: mockResult.filterGroups,
      };
    }
  } catch {
    // fall through to mock
  }
  return getMockProductList(params);
}

export async function getProduct(id: string): Promise<Product | null> {
  const apiProduct = await apiGetProductById(id);
  if (apiProduct?._id) return apiToProduct(apiProduct);
  return null;
}

export async function getRelatedProducts(id: string, limit = 5): Promise<Product[]> {
  const product = await getProduct(id);
  if (!product) return getMockRelatedProducts(id, limit);

  try {
    const apiProducts = await apiGetProducts();
    if (Array.isArray(apiProducts) && apiProducts.length > 0) {
      return apiProducts
        .filter((p) => p._id !== id)
        .filter((p) => {
          const catId = typeof p.category === "object" ? p.category._id : p.category;
          return !product.categoryId || catId === product.categoryId;
        })
        .slice(0, limit)
        .map(apiToProduct);
    }
  } catch {
    // fall through
  }
  return getMockRelatedProducts(id, limit);
}

export function formatPrice(value: number): string {
  return `Rs. ${value.toLocaleString("en-IN")}`;
}

export function productToCard(product: Product) {
  const image = product.imageUrl.startsWith("http") || product.imageUrl.startsWith("/")
    ? product.imageUrl
    : resolveImage(product.imageUrl);

  return {
    id: product.id,
    src: image,
    designer: product.designerName,
    name: product.title,
    price: formatPrice(product.currentPrice),
    originalPrice: product.previousPrice ? formatPrice(product.previousPrice) : undefined,
    discount: product.discountPercentage ? `${product.discountPercentage}% Off` : undefined,
    href: `/products/${product.id}`,
  };
}

export { apiToProduct, DEFAULT_SIZES };

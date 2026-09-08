"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/components/providers/cart-provider";
import { ProductDetailView, type AddToCartPayload } from "@/components/product-detail-view";
import { calculateProductPrice } from "@/lib/api";
import { resolveImage } from "@/lib/images";
import type { Product } from "@/lib/types";

export function ProductDetailClient({ product, relatedProducts }: { product: Product; relatedProducts: Product[] }) {
  const searchParams = useSearchParams();
  const openCustomTailored = searchParams.get("customTailored") === "1";
  const { addItem } = useCart();
  const router = useRouter();

  const buildCartItem = async (payload: AddToCartPayload) => {
    const result = await calculateProductPrice(product.id, {
      size: payload.size,
      bottomSize: payload.bottomSize,
      colorIndex: payload.colorIndex,
      addons: payload.addons.map((a) => ({ addonId: a.addonId, name: a.name, size: a.size })),
      quantity: 1,
    }) as { unitPrice: number };

    const variant = product.variants?.[payload.colorIndex];
    return {
      productId: product.id,
      title: product.title,
      designerName: product.designerName,
      imageUrl: resolveImage(variant?.images?.[0] || product.imageUrl),
      size: payload.size,
      price: result.unitPrice,
      productCode: product.productCode,
      estimatedShipping: "3-4 weeks",
    };
  };

  const handleAddToCart = async (payload: AddToCartPayload) => {
    const item = await buildCartItem(payload);
    addItem(item);
  };

  const handleBuyNow = async (payload: AddToCartPayload) => {
    const item = await buildCartItem(payload);
    addItem(item);
    router.push("/cart");
  };

  return (
    <ProductDetailView
      product={product}
      relatedProducts={relatedProducts}
      onAddToCart={handleAddToCart}
      onBuyNow={handleBuyNow}
      defaultCustomTailoredOpen={openCustomTailored}
    />
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/product-detail-client";
import { PageShell } from "@/components/templates/page-shell";
import { getProduct, getRelatedProducts } from "@/lib/services/products";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  return {
    title: product ? `${product.designerName} — ${product.title} | Trilokini` : "Product | Trilokini",
    description: product?.subtitle || product?.description,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(id);

  return (
    <PageShell className="pb-0">
      <Suspense fallback={null}>
        <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      </Suspense>
    </PageShell>
  );
}

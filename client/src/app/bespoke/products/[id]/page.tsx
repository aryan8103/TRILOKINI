import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/product-detail-client";
import { PageShell } from "@/components/templates/page-shell";
import { getProduct, getRelatedProducts } from "@/lib/services/products";

export default async function BespokeProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();
  const related = await getRelatedProducts(id);

  return (
    <PageShell>
      <ProductDetailClient product={{ ...product, isBespoke: true }} relatedProducts={related} />
    </PageShell>
  );
}

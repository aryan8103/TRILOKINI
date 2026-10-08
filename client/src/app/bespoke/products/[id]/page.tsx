import { notFound } from "next/navigation";
import { BespokeProductDetailClient } from "@/components/bespoke-product-detail-client";
import { PageShell } from "@/components/templates/page-shell";
import { getProduct } from "@/lib/services/products";

export default async function BespokeProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product?.isBespoke) notFound();

  return (
    <PageShell>
      <BespokeProductDetailClient product={product} />
    </PageShell>
  );
}

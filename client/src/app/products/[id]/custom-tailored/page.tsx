import { redirect } from "next/navigation";
import { getProduct } from "@/lib/services/products";

export default async function CustomTailoredPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) redirect(`/products/${id}`);
  redirect(`/products/${id}?customTailored=1`);
}

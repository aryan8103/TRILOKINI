import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/page-chrome";
import { ProductGrid } from "@/components/commerce";
import { ContentContainer, PageShell } from "@/components/templates/page-shell";
import { getBespokeCollectionById } from "@/lib/api";
import { getBespokeProductList, productToCard } from "@/lib/services/products";

export const dynamic = "force-dynamic";

export default async function BespokeCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [collection, products] = await Promise.all([
    getBespokeCollectionById(id),
    getBespokeProductList(id),
  ]);

  if (!collection?.isActive) notFound();

  const cards = products.map((product) => ({
    ...productToCard(product),
    href: `/bespoke/products/${product.id}`,
  }));

  return (
    <PageShell>
      <ContentContainer className="py-6 lg:py-10">
        <Breadcrumbs items={[
          { label: "BESPOKE", href: "/bespoke" },
          { label: collection.title },
        ]} />
        <header className="mb-6 flex items-end justify-between gap-4 border-b border-black/15 pb-4">
          <div>
            <h1 className="text-[18px] font-semibold uppercase tracking-[0.08em] lg:text-[24px]">{collection.title}</h1>
            {collection.description ? <p className="mt-2 max-w-2xl text-[12px] leading-5 text-gray lg:text-[13px]">{collection.description}</p> : null}
          </div>
          <p className="shrink-0 text-[11px] text-gray">{products.length} {products.length === 1 ? "piece" : "pieces"}</p>
        </header>

        {cards.length ? (
          <ProductGrid products={cards} />
        ) : (
          <div className="border border-black/15 py-16 text-center">
            <p className="text-[13px] font-medium">Pieces for this collection are coming soon.</p>
          </div>
        )}
      </ContentContainer>
    </PageShell>
  );
}
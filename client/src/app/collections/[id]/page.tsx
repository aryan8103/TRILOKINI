import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell, ContentContainer } from "@/components/templates/page-shell";
import { Breadcrumbs } from "@/components/page-chrome";
import { getActiveCollections } from "@/lib/api";
import { resolveImage } from "@/lib/images";
import type { Collection, CollectionImage } from "@/lib/api";

function imageAt(images: CollectionImage[] | undefined, position: number): string {
  const match = images?.find((img) => Number(img.position) === position);
  return resolveImage(match?.imageUrl);
}

const tileLayout = [
  { position: 1, mobile: "col-span-2 aspect-[391/288]", desktop: "col-span-2 col-start-1 aspect-[686/506]" },
  { position: 2, mobile: "aspect-[192/288]", desktop: "col-start-3 h-full min-h-0 self-stretch" },
  { position: 3, mobile: "aspect-[192/288]", desktop: "col-start-4 h-full min-h-0 self-stretch" },
  { position: 4, mobile: "aspect-[192/288]", desktop: "col-start-1 h-full min-h-0 self-stretch" },
  { position: 5, mobile: "aspect-[192/288]", desktop: "col-start-2 h-full min-h-0 self-stretch" },
  { position: 6, mobile: "col-span-2 aspect-[391/288]", desktop: "col-span-2 col-start-3 aspect-[686/506]" },
];

function CollectionDetailContent({ collection }: { collection: Collection }) {
  const images = collection.images || [];

  return (
    <ContentContainer className="py-6 lg:py-10">
      <Breadcrumbs items={[
        { label: "COLLECTIONS", href: "/collections" },
        { label: collection.title },
      ]} />
      <h1 className="mb-6 text-[18px] font-semibold uppercase tracking-[0.72px] lg:text-[24px]">{collection.title}</h1>
      <div className="grid grid-cols-2 gap-2 lg:hidden">
        {tileLayout.map((tile) => (
          <Link key={tile.position} href={images.find((i) => i.position === tile.position)?.href || "/products"} className={`relative block overflow-hidden bg-gray-light ${tile.mobile}`}>
            <Image src={imageAt(images, tile.position)} alt="" fill className="object-cover" />
          </Link>
        ))}
      </div>
      <div className="hidden grid-cols-4 items-stretch gap-x-5 gap-y-[29px] lg:grid">
        {tileLayout.map((tile) => (
          <Link key={tile.position} href={images.find((i) => i.position === tile.position)?.href || "/products"} className={`relative block overflow-hidden bg-gray-light ${tile.desktop}`}>
            <Image src={imageAt(images, tile.position)} alt="" fill className="object-cover" />
          </Link>
        ))}
      </div>
    </ContentContainer>
  );
}

export default async function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collections = await getActiveCollections();
  const collection = Array.isArray(collections) ? collections.find((c) => c._id === id) : null;
  if (!collection) notFound();

  return (
    <PageShell>
      <CollectionDetailContent collection={collection} />
    </PageShell>
  );
}

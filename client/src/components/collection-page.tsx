import Image from "next/image";
import Link from "next/link";
import { Footer, ResponsiveShell } from "./layout";
import type { Collection, CollectionImage } from "@/lib/api";

const PLACEHOLDER = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

function resolveImage(url?: string): string {
  if (!url) return PLACEHOLDER;
  if (url.startsWith("http") || url.startsWith("/images/")) return url;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  return `${apiUrl}${url}`;
}

function imageAt(images: CollectionImage[] | undefined, position: number): string {
  const match = images?.find((image) => Number(image.position) === position);
  return resolveImage(match?.imageUrl);
}

function MosaicTile({
  src,
  alt,
  className,
  href = "#",
}: {
  src: string;
  alt: string;
  className: string;
  href?: string;
}) {
  return (
    <Link href={href} className={`relative block overflow-hidden bg-gray-light ${className}`}>
      <Image src={src} alt={alt} fill className="object-cover transition-transform duration-500 hover:scale-[1.02]" />
    </Link>
  );
}

function CollectionSection({ collection }: { collection: Collection }) {
  const images = collection.images || [];
  const title = collection.title;

  const tiles = [
    { position: 1, mobile: "col-span-2 aspect-[391/288]", desktop: "col-span-2 col-start-1 aspect-[686/506]" },
    { position: 2, mobile: "aspect-[192/288]", desktop: "col-start-3 h-full min-h-0 self-stretch" },
    { position: 3, mobile: "aspect-[192/288]", desktop: "col-start-4 h-full min-h-0 self-stretch" },
    { position: 4, mobile: "aspect-[192/288]", desktop: "col-start-1 h-full min-h-0 self-stretch" },
    { position: 5, mobile: "aspect-[192/288]", desktop: "col-start-2 h-full min-h-0 self-stretch" },
    { position: 6, mobile: "col-span-2 aspect-[391/288]", desktop: "col-span-2 col-start-3 aspect-[686/506]" },
  ];

  const getHref = (position: number) => {
    const match = images?.find((img) => Number(img.position) === position);
    return match?.href || `/collections/${collection._id}`;
  };

  return (
    <section className="space-y-1.5 lg:space-y-2.5">
      <h2 className="px-[5px] text-[14px] font-medium leading-[18px] tracking-[0.42px] lg:px-6 lg:text-[24px] lg:leading-8 lg:tracking-[0.72px]">
        <Link href={`/collections/${collection._id}`} className="hover:underline">{title}</Link>
      </h2>

      <div className="grid grid-cols-2 gap-2 px-[5px] lg:hidden">
        {tiles.map((tile) => (
          <MosaicTile
            key={tile.position}
            src={imageAt(images, tile.position)}
            alt={`${title} ${tile.position}`}
            className={tile.mobile}
            href={getHref(tile.position)}
          />
        ))}
      </div>

      <div className="hidden grid-cols-4 items-stretch gap-x-5 gap-y-[29px] px-6 lg:grid">
        {tiles.map((tile) => (
          <MosaicTile
            key={tile.position}
            src={imageAt(images, tile.position)}
            alt={`${title} ${tile.position}`}
            className={tile.desktop}
            href={getHref(tile.position)}
          />
        ))}
      </div>
    </section>
  );
}

function CollectionContent({ collections }: { collections: Collection[] }) {
  return (
    <main className="overflow-hidden pb-20 pt-[23px] lg:pb-0 lg:pt-[21px]">
      <div className="space-y-6 pb-8 lg:space-y-[26px] lg:pb-[28px]">
        {collections.map((collection) => (
          <CollectionSection key={collection._id} collection={collection} />
        ))}
      </div>
    </main>
  );
}

export default function CollectionPage({ collections }: { collections: Collection[] }) {
  return (
    <ResponsiveShell>
      <CollectionContent collections={collections} />
      <Footer />
    </ResponsiveShell>
  );
}

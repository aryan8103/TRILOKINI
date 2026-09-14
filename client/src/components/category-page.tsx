import Image from "next/image";
import Link from "next/link";
import { Footer, ResponsiveShell } from "./layout";
import type { Category } from "@/lib/api";

const PLACEHOLDER = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

function resolveImage(url?: string): string {
  if (!url) return PLACEHOLDER;
  if (url.startsWith("http") || url.startsWith("/images/")) return url;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  return `${apiUrl}${url}`;
}

function CategoryMosaicTile({
  category,
  className,
}: {
  category: Category;
  className: string;
}) {
  const title = category.title || "NIDHIKA SHEKAR";
  const subtitle = category.description || "SHOP NOW";

  return (
    <Link href={`/products?category=${category._id}`} className={`group relative block overflow-hidden bg-[#f3f3f3] ${className}`}>
      <article className="relative h-full w-full">
        <Image
          src={resolveImage(category.imageUrl)}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />

        <div className="absolute inset-x-0 bottom-[24px] flex flex-col items-center px-2 text-center lg:bottom-[40px]">
          <h2 className="text-[12px] font-bold uppercase leading-[13px] tracking-[0.48px] text-white lg:text-[16px] lg:leading-[31px] lg:tracking-[0.64px]">
            {title}
          </h2>
          <p className="mt-[2px] text-[10px] font-semibold uppercase leading-[13px] tracking-[0.2px] text-white lg:mt-0 lg:text-[14px] lg:leading-[31px] lg:tracking-[0.56px]">
            {subtitle}
          </p>
        </div>
      </article>
    </Link>
  );
}

function MosaicBlock({ categories }: { categories: Category[] }) {
  const slot = (index: number) => categories[index];

  return (
    <>
      <div className="grid grid-cols-2 gap-2 lg:hidden">
        {slot(0) ? <CategoryMosaicTile category={slot(0)} className="aspect-[192/288]" /> : null}
        {slot(1) ? <CategoryMosaicTile category={slot(1)} className="aspect-[192/288]" /> : null}
        {slot(2) ? <CategoryMosaicTile category={slot(2)} className="aspect-[192/288]" /> : null}
        {slot(3) ? <CategoryMosaicTile category={slot(3)} className="aspect-[192/288]" /> : null}
        {slot(4) ? <CategoryMosaicTile category={slot(4)} className="col-span-2 aspect-[391/288]" /> : null}
        {slot(5) ? <CategoryMosaicTile category={slot(5)} className="aspect-[192/294]" /> : null}
        {slot(6) ? <CategoryMosaicTile category={slot(6)} className="aspect-[192/294]" /> : null}
        {slot(7) ? <CategoryMosaicTile category={slot(7)} className="aspect-[192/288]" /> : null}
        {slot(8) ? <CategoryMosaicTile category={slot(8)} className="aspect-[192/288]" /> : null}
        {slot(9) ? <CategoryMosaicTile category={slot(9)} className="col-span-2 aspect-[391/288]" /> : null}
      </div>

      <div className="hidden flex-col lg:flex">
        {(slot(0) || slot(1) || slot(2) || slot(3)) && (
          <div className="grid grid-cols-4 gap-x-[25px]">
            {slot(0) ? <CategoryMosaicTile category={slot(0)} className="aspect-[330/495]" /> : <div />}
            {slot(1) ? <CategoryMosaicTile category={slot(1)} className="aspect-[330/495]" /> : <div />}
            {slot(2) ? <CategoryMosaicTile category={slot(2)} className="aspect-[330/495]" /> : <div />}
            {slot(3) ? <CategoryMosaicTile category={slot(3)} className="aspect-[330/495]" /> : <div />}
          </div>
        )}

        {(slot(4) || slot(5) || slot(6)) && (
          <div className="mt-[21px] grid grid-cols-4 items-stretch gap-x-[25px]">
            {slot(4) ? (
              <CategoryMosaicTile category={slot(4)} className="col-span-2 col-start-1 aspect-[686/506]" />
            ) : (
              <div className="col-span-2 col-start-1" />
            )}
            {slot(5) ? (
              <CategoryMosaicTile category={slot(5)} className="col-start-3 h-full min-h-0 self-stretch" />
            ) : null}
            {slot(6) ? (
              <CategoryMosaicTile category={slot(6)} className="col-start-4 h-full min-h-0 self-stretch" />
            ) : null}
          </div>
        )}

        {(slot(7) || slot(8) || slot(9)) && (
          <div className="mt-[29px] grid grid-cols-4 items-stretch gap-x-[25px]">
            {slot(7) ? (
              <CategoryMosaicTile category={slot(7)} className="col-start-1 h-full min-h-0 self-stretch" />
            ) : null}
            {slot(8) ? (
              <CategoryMosaicTile category={slot(8)} className="col-start-2 h-full min-h-0 self-stretch" />
            ) : null}
            {slot(9) ? (
              <CategoryMosaicTile category={slot(9)} className="col-span-2 col-start-3 aspect-[686/506]" />
            ) : (
              <div className="col-span-2 col-start-3 aspect-[686/506]" />
            )}
          </div>
        )}
      </div>
    </>
  );
}

function CategoryContent({ categories }: { categories: Category[] }) {
  const blocks: Category[][] = [];
  for (let i = 0; i < categories.length; i += 10) {
    blocks.push(categories.slice(i, i + 10));
  }

  return (
    <main className="pb-[58px] pt-[4px] lg:pb-[72px] lg:pt-[20px]">
      <section className="space-y-2 px-[5px] lg:space-y-[29px] lg:px-6">
        {blocks.map((block, index) => (
          <MosaicBlock key={block[0]?._id || index} categories={block} />
        ))}
      </section>
    </main>
  );
}

export default function CategoryPage({ categories }: { categories: Category[] }) {
  return (
    <ResponsiveShell>
      <CategoryContent categories={categories} />
      <Footer />
    </ResponsiveShell>
  );
}

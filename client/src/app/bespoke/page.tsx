import Image from "next/image";
import Link from "next/link";
import { PageShell, ContentContainer } from "@/components/templates/page-shell";
import { getActiveBespokeCollections } from "@/lib/api";
import { resolveImage } from "@/lib/images";

export const metadata = { title: "Bespoke | Trilokini" };
export const dynamic = "force-dynamic";

export default async function BespokePage() {
  const collections = await getActiveBespokeCollections();

  return (
    <PageShell>
      <section className="relative aspect-[1440/505] w-full overflow-hidden bg-black" aria-label="Bespoke promotion">
        <Image
          src="/images/home/sale-banner.png"
          alt="Sale extended: flat 30% off luxe lehengas"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </section>

      <ContentContainer className="pb-10 pt-7 lg:pb-12">
        <section className="mx-auto max-w-4xl text-center" aria-labelledby="bespoke-heading">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray">Made for you</p>
          <h1 id="bespoke-heading" className="mt-2 text-[16px] font-semibold tracking-[0.03em] text-black lg:text-[22px]">
            BESPOKE, YOUR WAY
          </h1>
          <p className="mt-3 text-[12px] leading-6 text-gray sm:text-[13px] lg:text-[14px]">
            Discover pieces made personal. Choose a collection to explore the silhouettes, then make each design your own.
          </p>
        </section>

        <section className="mt-8 lg:mt-10" aria-labelledby="bespoke-collections-heading">
          <div className="mb-4 flex items-end justify-between border-b border-black/15 pb-3">
            <h2 id="bespoke-collections-heading" className="text-[14px] font-semibold uppercase tracking-[0.08em] lg:text-[16px]">
              Bespoke collections
            </h2>
            <span className="text-[11px] text-gray">{collections.length} {collections.length === 1 ? "collection" : "collections"}</span>
          </div>

          {collections.length ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-9">
              {collections.map((collection) => (
                <Link key={collection._id} href={`/bespoke/collections/${collection._id}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-light">
                    <Image
                      src={resolveImage(collection.imageUrl)}
                      alt={collection.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                    />
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-[12px] font-semibold uppercase tracking-[0.06em] lg:text-[13px]">{collection.title}</h3>
                      {collection.description ? <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-gray">{collection.description}</p> : null}
                    </div>
                    <span aria-hidden="true" className="mt-0.5 text-[18px] leading-none transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border border-black/15 py-16 text-center">
              <p className="text-[13px] font-medium">New bespoke collections are on their way.</p>
            </div>
          )}
        </section>
      </ContentContainer>
    </PageShell>
  );
}

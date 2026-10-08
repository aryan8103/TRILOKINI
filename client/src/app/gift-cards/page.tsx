import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/templates/page-shell";
import { mockGiftCards } from "@/lib/mocks/content";

export const metadata = { title: "Gift Cards | Trilokini" };

export default function GiftCardsPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-5 lg:pb-12">
        <header className="border-b border-black/20 pb-2">
          <h1 className="text-[14px] font-medium tracking-[0.03em] text-black">GIFT CARDS</h1>
        </header>
        <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-11 lg:gap-y-[30px]">
          {mockGiftCards.map((card) => (
            <Link key={card.id} href={`/gift-cards/${card.id}`} className="group block">
              <div className="relative aspect-[244/366] overflow-hidden bg-gray-light">
                <Image src={card.imageUrl} alt="For a little happiness gift card" fill sizes="(min-width: 1024px) 17vw, (min-width: 640px) 33vw, 50vw" className="object-cover object-[25%_center] transition-transform duration-500 group-hover:scale-[1.015]" />
              </div>
              <div className="pt-2">
                <h2 className="text-[11px] font-medium uppercase leading-4 tracking-[0.03em] text-black lg:text-[14px] lg:leading-5">{card.title}</h2>
                <p className="mt-1 max-w-[216px] text-[10px] leading-[15px] text-gray lg:mt-2 lg:text-[13px] lg:leading-5">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

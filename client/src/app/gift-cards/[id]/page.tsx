import Image from "next/image";
import { notFound } from "next/navigation";
import { PageShell, ContentContainer } from "@/components/templates/page-shell";
import { GiftCardForm } from "@/components/gift-card-form";
import { getActiveGiftCard } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function GiftCardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const card = await getActiveGiftCard(id);
  if (!card) notFound();

  return (
    <PageShell>
      <ContentContainer className="pt-8 pb-16 lg:pt-[62px] lg:pb-20">
        <div className="mx-auto grid items-start gap-8 xl:ml-[clamp(0px,11.4vw,164px)] xl:mr-0 xl:grid-cols-[minmax(280px,337px)_minmax(340px,656px)] xl:gap-x-[clamp(32px,14vw,203px)]">
          <div className="relative mx-auto aspect-[337/505] w-full max-w-[337px] overflow-hidden bg-gray-light">
            <Image src={card.imageUrl} alt="For a little happiness gift card" fill sizes="(min-width: 1280px) 337px, 70vw" className="object-cover object-[25%_center]" priority />
          </div>
          <GiftCardForm card={card} />
        </div>
      </ContentContainer>
    </PageShell>
  );
}

import Image from "next/image";
import Link from "next/link";
import { PageShell, ContentContainer } from "@/components/templates/page-shell";
import { mockFilmArticles } from "@/lib/mocks/content";
import type { FilmArticle } from "@/lib/types";

export const metadata = { title: "Films | Trilokini" };

const home = "/images/home";

type MosaicSlot = { src: string; href: string; alt: string };

function mosaicSlots(articles: FilmArticle[]): MosaicSlot[] {
  const srcs = [
    `${home}/designer-1.png`,
    `${home}/designer-2.png`,
    `${home}/celebrity-1.png`,
    `${home}/celebrity-2.png`,
    `${home}/designer-3.png`,
    `${home}/celebrity-3.png`,
    `${home}/celebrity-4.png`,
    `${home}/designer-4.png`,
    `${home}/designer-5.png`,
    `${home}/wedding-sunlit.png`,
  ];
  return srcs.map((src, index) => {
    const article = articles[index % articles.length];
    return { src, href: `/films/${article.slug}`, alt: article.title };
  });
}

function MosaicTile({ src, href, alt, className }: MosaicSlot & { className: string }) {
  return (
    <Link href={href} className={`relative block overflow-hidden bg-gray-light ${className}`}>
      <Image src={src} alt={alt} fill className="object-cover transition-transform duration-500 hover:scale-[1.02]" />
    </Link>
  );
}

function FilmArticleCard({ article }: { article: FilmArticle }) {
  const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link href={`/films/${article.slug}`} className="flex gap-4 lg:gap-[27px]">
      <div className="relative h-[95px] w-[169px] shrink-0 overflow-hidden bg-gray-light lg:h-[151px] lg:w-[268px]">
        <Image src={article.imageUrl} alt={article.title} fill className="object-cover" />
      </div>
      <div className="flex min-h-[95px] min-w-0 flex-1 flex-col justify-between lg:min-h-[151px]">
        <div>
          <h2 className="text-[10px] font-semibold uppercase leading-4 tracking-[0.5px] lg:text-[14px] lg:leading-5 lg:tracking-[0.7px]">
            {article.title}
          </h2>
          <p className="mt-1 line-clamp-3 text-[8px] leading-4 tracking-[0.4px] text-black lg:mt-2 lg:text-[11px] lg:leading-5 lg:tracking-[0.55px]">
            {article.excerpt}
          </p>
        </div>
        <p className="text-[8px] tracking-[0.4px] text-gray lg:text-[11px] lg:tracking-[0.55px]">{date}</p>
      </div>
    </Link>
  );
}

export default function FilmsPage() {
  const articles = mockFilmArticles;
  const slots = mosaicSlots(articles);
  const [
    leftLarge1,
    rightTall,
    leftSmall1,
    leftSmall2,
    leftLarge2,
    rightSmall1,
    rightSmall2,
    leftSmall3,
    leftSmall4,
    rightLarge1,
  ] = slots;

  return (
    <PageShell>
      <div className="relative aspect-[402/141] w-full overflow-hidden bg-black lg:aspect-[1440/505]">
        <Image src={`${home}/sale-banner.png`} alt="Sale extended lehengas at flat 30% off" fill className="object-cover" priority />
      </div>

      <ContentContainer className="py-6 lg:py-[26px]">
        <div className="lg:hidden">
          <MosaicTile {...leftLarge1} className="aspect-[392/250]" />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <MosaicTile {...leftSmall1} className="aspect-[192/210]" />
            <MosaicTile {...leftSmall2} className="aspect-[192/210]" />
          </div>
          <MosaicTile {...rightTall} className="mt-2 aspect-square" />
          <MosaicTile {...leftLarge2} className="mt-2 aspect-[392/210]" />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <MosaicTile {...rightSmall1} className="aspect-[192/210]" />
            <MosaicTile {...rightSmall2} className="aspect-[192/210]" />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <MosaicTile {...leftSmall3} className="aspect-[192/214]" />
            <MosaicTile {...leftSmall4} className="aspect-[192/214]" />
          </div>
          <MosaicTile {...rightLarge1} className="mt-2 aspect-[392/210]" />
        </div>

        <div className="hidden lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-5">
          <div className="flex flex-col gap-5">
            <MosaicTile {...leftLarge1} className="aspect-[16/9]" />
            <div className="grid aspect-[16/9] grid-cols-2 gap-5">
              <MosaicTile {...leftSmall1} className="min-h-0" />
              <MosaicTile {...leftSmall2} className="min-h-0" />
            </div>
            <MosaicTile {...leftLarge2} className="aspect-[16/9]" />
            <div className="grid aspect-[16/9] grid-cols-2 gap-5">
              <MosaicTile {...leftSmall3} className="min-h-0" />
              <MosaicTile {...leftSmall4} className="min-h-0" />
            </div>
          </div>
          <div className="flex h-full flex-col gap-5">
            <MosaicTile {...rightTall} className="min-h-0 flex-1" />
            <div className="grid aspect-[16/9] grid-cols-2 gap-5">
              <MosaicTile {...rightSmall1} className="min-h-0" />
              <MosaicTile {...rightSmall2} className="min-h-0" />
            </div>
            <MosaicTile {...rightLarge1} className="aspect-[16/9]" />
          </div>
        </div>

        <div className="mt-5 grid gap-[19px] lg:mt-6 lg:grid-cols-2 lg:gap-x-5 lg:gap-y-5">
          {articles.map((article) => (
            <FilmArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </ContentContainer>
    </PageShell>
  );
}

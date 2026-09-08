import Image from "next/image";
import { Footer, ResponsiveShell } from "./layout";
import { CelebrityTile, DesignerTile, SectionHeading, WeddingTile } from "./content";
import { Product, ProductCarousel, ProductGrid } from "./commerce";
import type { HeroBanner, Category, ApiProduct, Designer, Celebrity, WeddingItem, FavouriteItem, HomepageProductGroup } from "@/lib/api";

const home = "/images/home";

export type HomePageData = {
  banners: HeroBanner[];
  categories: Category[];
  productsByCategory: HomepageProductGroup[];
  designers: Designer[];
  celebrities: Celebrity[];
  weddingItems: WeddingItem[];
  favourites: FavouriteItem[];
  bulkShowProducts: HomepageProductGroup[];
};

function resolveImage(url?: string): string {
  if (!url) return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  if (url.startsWith('http')) return url;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  return `${apiUrl}${url}`;
}

function toClientProduct(p: ApiProduct): Product {
  return {
    id: p._id,
    src: resolveImage(p.imageUrl || p.variants?.[0]?.images?.[0]),
    designer: p.designerName,
    name: p.title,
    price: `Rs. ${p.currentPrice?.toLocaleString('en-IN')}`,
    originalPrice: p.previousPrice ? `Rs. ${p.previousPrice.toLocaleString('en-IN')}` : undefined,
    discount: p.discountPercentage ? `${p.discountPercentage}% Off` : undefined,
    href: `/products/${p._id}`,
  };
}

const staticProducts: Product[] = [
  { id: "sale-1", src: `${home}/hero-product-1.png`, designer: "ISHA GUPTA TAYAL", name: "Pink Organza Floral Printed Lehenga Set", price: "Rs. 43,400", originalPrice: "Rs. 63,500", discount: "30% Off" },
  { id: "sale-2", src: `${home}/hero-product-2.png`, designer: "ISHA GUPTA TAYAL", name: "Pink Organza Floral Printed Lehenga Set", price: "Rs. 43,400", originalPrice: "Rs. 63,500", discount: "30% Off" },
  { id: "sale-3", src: `${home}/hero-product-3.png`, designer: "ISHA GUPTA TAYAL", name: "Pink Organza Floral Printed Lehenga Set", price: "Rs. 43,400", originalPrice: "Rs. 63,500", discount: "30% Off" },
  { id: "sale-4", src: `${home}/hero-product-4.png`, designer: "ISHA GUPTA TAYAL", name: "Pink Organza Floral Printed Lehenga Set", price: "Rs. 43,400", originalPrice: "Rs. 63,500", discount: "30% Off" },
  { id: "sale-5", src: `${home}/hero-product-5.png`, designer: "ISHA GUPTA TAYAL", name: "Pink Organza Floral Printed Lehenga Set", price: "Rs. 43,400", originalPrice: "Rs. 63,500", discount: "30% Off" },
];

const staticDesigners = [
  { src: `${home}/designer-1.png`, title: "NIDHIKA SHEKAR", subtitle: "SHOP NOW" },
  { src: `${home}/designer-2.png`, title: "NIDHIKA SHEKAR", subtitle: "SHOP NOW" },
  { src: `${home}/designer-3.png`, title: "NIDHIKA SHEKAR", subtitle: "SHOP NOW" },
  { src: `${home}/designer-4.png`, title: "NIDHIKA SHEKAR", subtitle: "SHOP NOW" },
  { src: `${home}/designer-5.png`, title: "NIDHIKA SHEKAR", subtitle: "SHOP NOW" },
];

const staticCelebrities = [
  { src: `${home}/celebrity-1.png`, title: "NIDHIKA SHEKAR", subtitle: "SHOP NOW" },
  { src: `${home}/celebrity-2.png`, title: "NIDHIKA SHEKAR", subtitle: "SHOP NOW" },
  { src: `${home}/celebrity-3.png`, title: "NIDHIKA SHEKAR", subtitle: "SHOP NOW" },
  { src: `${home}/celebrity-4.png`, title: "NIDHIKA SHEKAR", subtitle: "SHOP NOW" },
];

const staticWedding = [
  { src: `${home}/wedding-sunlit.png`, title: "NIDHIKA SHEKAR", subtitle: "SHOP NOW" },
  { src: `${home}/wedding-evening.png`, title: "NIDHIKA SHEKAR", subtitle: "SHOP NOW" },
  { src: `${home}/wedding-heritage.png`, title: "NIDHIKA SHEKAR", subtitle: "SHOP NOW" },
  { src: `${home}/wedding-bridesmaid.png`, title: "NIDHIKA SHEKAR", subtitle: "SHOP NOW" },
  { src: `${home}/wedding-hues.png`, title: "NIDHIKA SHEKAR", subtitle: "SHOP NOW" },
  { src: `${home}/wedding-istya.png`, title: "NIDHIKA SHEKAR", subtitle: "SHOP NOW" },
  { src: `${home}/wedding-guest.png`, title: "NIDHIKA SHEKAR", subtitle: "SHOP NOW" },
];

function HomeHero({ banners }: { banners: HeroBanner[] }) {
  if (banners && banners.length > 0) {
    const banner = banners[0];
    return (
      <section className="relative aspect-square w-full overflow-hidden lg:aspect-[1920/480] lg:h-auto">
        <Image src={resolveImage(banner.imageUrl)} alt={banner.title || "Clothing"} fill className="hidden object-cover lg:block" priority />
        <Image src={resolveImage(banner.mobileImageUrl || banner.imageUrl)} alt={banner.title || "Clothing"} fill className="object-cover lg:hidden" priority />
      </section>
    );
  }
  return <section className="relative aspect-square w-full overflow-hidden lg:aspect-[1920/480] lg:h-auto"><Image src={`${home}/desktop-hero.png`} alt="Clothing" fill className="hidden object-cover lg:block" priority /><Image src={`${home}/mobile-hero.png`} alt="Clothing" fill className="object-cover lg:hidden" priority /></section>;
}

function CategoryStrip({ categories }: { categories: Category[] }) {
  const staticItems = ["/images/home/category-1.png", "/images/home/category-2.png", "/images/home/category-3.png", "/images/home/category-4.png"];
  
  // Create an array of 4 items, using DB categories first, then falling back to static
  const items = Array(4).fill(null).map((_, index) => {
    const dbCat = categories && categories[index];
    if (dbCat && dbCat.imageUrl) {
      return { _id: dbCat._id, src: resolveImage(dbCat.imageUrl), title: dbCat.title };
    }
    // Fall back to static image, but preserve DB title/ID if the category exists
    return { 
      _id: dbCat?._id || `static-${index}`, 
      src: staticItems[index], 
      title: dbCat?.title || "" 
    };
  });

  return (
    <section className="grid grid-cols-2 gap-2 px-[5px] pt-[6px] lg:grid-cols-4 lg:gap-10 lg:px-6 lg:pt-8">
      {items.map((item) => (
        <div key={item._id} className="relative aspect-[4/5] w-full overflow-hidden bg-[#f8f8f8]">
          <Image src={item.src} alt={item.title || ""} fill className="object-cover object-top" />
        </div>
      ))}
    </section>
  );
}

function HomePromo() {
  return (
    <div className="relative mt-[22px] w-full bg-gradient-to-r from-[#61200D] to-[#511809]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-center md:flex-row">
        <div className="relative aspect-[720/107] w-full md:w-1/2">
          <Image src={`${home}/promo-text.png`} alt="Proceeds from Isha Life" fill className="object-cover" />
        </div>
        <div className="relative aspect-[720/107] w-full md:w-1/2">
          <Image src={`${home}/promo-logos.png`} alt="Partner Logos" fill className="object-cover" />
        </div>
      </div>
    </div>
  );
}

function DesignerSection({ designers }: { designers: Designer[] }) {
  const items = designers?.length >= 5 ? designers.map(d => ({
    src: resolveImage(d.imageUrl),
    title: d.name,
    subtitle: d.subtitle
  })) : staticDesigners;

  return <section className="space-y-5"><SectionHeading title="BESTSELLING DESIGNERS" /><div className="hidden grid-cols-3 gap-4 px-6 lg:grid"><DesignerTile {...items[0]} className="col-span-2" style={{ aspectRatio: 914 / 572 }} /><DesignerTile {...items[1]} className="col-span-1" style={{ aspectRatio: 460 / 572 }} /><DesignerTile {...items[2]} className="col-span-1" style={{ aspectRatio: 445 / 524 }} /><DesignerTile {...items[3]} className="col-span-1" style={{ aspectRatio: 445 / 524 }} /><DesignerTile {...items[4]} className="col-span-1" style={{ aspectRatio: 445 / 524 }} /></div><div className="grid grid-cols-2 gap-2 px-[5px] lg:hidden">{items.slice(0, 5).map((item) => <DesignerTile key={item.src} {...item} style={{ aspectRatio: 192 / 249 }} />)}</div></section>;
}

function FavouritesSection({ favourites }: { favourites: FavouriteItem[] }) {
  // If no favourites, fallback to static images
  const imgSrc = (pos: string) => {
    const fav = favourites?.find(f => f.position === pos);
    return fav ? resolveImage(fav.imageUrl) : null;
  };

  return (
    <section className="space-y-5">
      <SectionHeading title="FAVOURITES" />
      {/* Mobile View */}
      <div className="px-[5px] lg:hidden">
        <div className="relative aspect-[392/392] overflow-hidden bg-gray-light">
          <Image src={imgSrc('mobile') || `${home}/favourites.png`} alt="Favourites" fill className="object-cover" />
        </div>
      </div>
      {/* Desktop View */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-5 lg:px-6">
        {/* Left Column */}
        <div className="flex flex-col gap-5">
          <div className="relative aspect-[16/9] overflow-hidden bg-gray-light">
            <Image src={imgSrc('left_large_1') || staticDesigners[0].src} alt="" fill className="object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-light">
              <Image src={imgSrc('left_small_1') || `${home}/favourites.png`} alt="" fill className="object-cover" />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-light">
              <Image src={imgSrc('left_small_2') || `${home}/favourites.png`} alt="" fill className="object-cover" />
            </div>
          </div>
          <div className="relative aspect-[16/9] overflow-hidden bg-gray-light">
            <Image src={imgSrc('left_large_2') || staticDesigners[0].src} alt="" fill className="object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-light">
              <Image src={imgSrc('left_small_3') || `${home}/favourites.png`} alt="" fill className="object-cover" />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-light">
              <Image src={imgSrc('left_small_4') || `${home}/favourites.png`} alt="" fill className="object-cover" />
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="flex h-full flex-col gap-5">
          <div className="relative flex-1 overflow-hidden bg-gray-light">
            <Image src={imgSrc('right_tall') || staticWedding[4].src} alt="" fill className="object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-light">
              <Image src={imgSrc('right_small_1') || `${home}/favourites.png`} alt="" fill className="object-cover" />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-light">
              <Image src={imgSrc('right_small_2') || `${home}/favourites.png`} alt="" fill className="object-cover" />
            </div>
          </div>
          <div className="relative aspect-[16/9] overflow-hidden bg-gray-light">
            <Image src={imgSrc('right_large_1') || staticDesigners[0].src} alt="" fill className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

function CelebritySection({ celebrities }: { celebrities: Celebrity[] }) {
  const items = celebrities?.length > 0 ? celebrities.map(c => ({
    src: resolveImage(c.imageUrl),
    title: c.name,
    subtitle: c.subtitle
  })) : staticCelebrities;

  return <section className="space-y-5"><SectionHeading title="CELEBRITY CLOSET" /><div className="flex gap-3 overflow-x-auto px-[5px] lg:grid lg:grid-cols-4 lg:gap-5 lg:px-6">{items.map((item) => <CelebrityTile key={item.src} {...item} className="aspect-[140/210] min-w-[140px] lg:aspect-[331/495] lg:min-w-0" />)}</div></section>;
}

function WeddingSection({ weddingItems }: { weddingItems: WeddingItem[] }) {
  const items = weddingItems?.length >= 7 ? weddingItems.map(w => ({
    src: resolveImage(w.imageUrl),
    title: w.name,
    subtitle: w.subtitle
  })) : staticWedding;

  return <section className="space-y-5"><SectionHeading title="THE WEDDING STUDIO" /><div className="grid grid-cols-2 gap-2 px-[5px] lg:grid-cols-4 lg:gap-5 lg:px-6">{items.slice(0, 7).map((item, index) => <WeddingTile key={item.src} {...item} className={index === 4 ? "col-span-2 aspect-[392/288] lg:aspect-[680/495]" : "aspect-[192/288] lg:aspect-[330/495]"} />)}</div></section>;
}

function HomeContent({ data }: { data: HomePageData }) {
  return (
    <main className="overflow-hidden pb-20 lg:pb-0">
      <HomeHero banners={data?.banners} />
      <CategoryStrip categories={data?.categories} />
      <HomePromo />
      <div className="space-y-12 pt-[10px] lg:space-y-[48px] lg:pt-7">
        
        {data?.productsByCategory && data.productsByCategory.length > 0 ? (
          data.productsByCategory.map((group, index) => (
            <section key={group.category?._id || index} className="space-y-4">
              <SectionHeading title={group.category?.title || "PRODUCTS"} />
              <ProductCarousel products={group.products.map(toClientProduct)} hideFavorite={true} />
            </section>
          ))
        ) : (
          <section className="space-y-4">
            <SectionHeading title="SALE EXTENDED: LUXE LEHENGAS" />
            <ProductCarousel products={staticProducts} hideFavorite={true} />
          </section>
        )}

        <DesignerSection designers={data?.designers} />
        <CelebritySection celebrities={data?.celebrities} />
        <WeddingSection weddingItems={data?.weddingItems} />
        
        {/* 
        <section className="space-y-5">
          <SectionHeading title="TOP SELLING PRODUCTS" />
          <ProductCarousel products={staticProducts} hideFavorite={true} />
        </section>
        */}
        
        <FavouritesSection favourites={data?.favourites} />
        
        {data?.bulkShowProducts && data.bulkShowProducts.length > 0 && (
          data.bulkShowProducts.map((group, index) => (
            <section key={`bulk-${group.category?._id || index}`} className="space-y-5">
              <SectionHeading title={group.category?.title || "PRODUCTS"} />
              <ProductCarousel products={group.products.map(toClientProduct)} hideFavorite={true} />
            </section>
          ))
        )}
        
        <section className="space-y-5">
          <SectionHeading title="CUSTOM LAYOUT" />
          <div className="relative mx-1 aspect-[391/210] w-full overflow-hidden bg-gray-light lg:mx-6 lg:aspect-[1920/480]">
            <Image src={`${home}/desktop-hero.png`} alt="Clothing" fill className="hidden object-cover lg:block" />
            <Image src={`${home}/mobile-custom-layout.png`} alt="Clothing" fill className="object-cover lg:hidden" />
          </div>
          <div className="px-[5px] lg:px-6">
            <ProductGrid products={staticProducts} />
          </div>
        </section>
        
        <section className="px-1 lg:px-6">
          <div className="relative aspect-[1712/328] w-full overflow-hidden bg-gray-light">
            <Image src={`${home}/sale-banner.png`} alt="Sale extended lehengas at flat 30% off" fill className="object-cover" />
          </div>
        </section>
      </div>
    </main>
  );
}

export default function HomePage({ data }: { data: HomePageData }) {
  return <ResponsiveShell><HomeContent data={data} /><Footer /></ResponsiveShell>;
}

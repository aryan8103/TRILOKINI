"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { ProductCarousel } from "@/components/commerce";
import { CustomTailoredModal } from "@/components/custom-tailored-modal";
import { PromoBanner } from "@/components/states";
import { SizeSelectModal } from "@/components/size-select-modal";
import { Accordion } from "@/components/ui";
import { resolveImage } from "@/lib/images";
import { formatPrice, productToCard } from "@/lib/services/products";
import type { Product, ProductAddon } from "@/lib/types";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"];

function SizeButton({
  size,
  selected,
  onClick,
  lowStock,
  disabled,
}: {
  size: string;
  selected: boolean;
  onClick: () => void;
  lowStock?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative h-11 min-w-[48px] border px-3 text-[13px] font-semibold tracking-[0.65px] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        selected ? "border-black bg-black text-white" : "border-gray-light bg-white text-black hover:border-black"
      }`}
    >
      {size}
      {lowStock ? (
        <span className="absolute -right-1 -top-2 bg-white px-1 text-[9px] font-semibold text-black">1 left</span>
      ) : null}
    </button>
  );
}

function ProductImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const displayImages = images.length > 0 ? images : [resolveImage()];

  return (
    <div>
      <div className="lg:hidden">
        <div ref={scrollRef} className="flex snap-x snap-mandatory overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {displayImages.map((src, index) => (
            <div key={`${src}-${index}`} className="relative aspect-[336/505] w-full min-w-full shrink-0 snap-center bg-gray-light">
              <Image src={src} alt={`${alt} view ${index + 1}`} fill className="object-cover" priority={index === 0} />
            </div>
          ))}
        </div>
        {displayImages.length > 1 ? (
          <div className="mt-2 flex justify-center gap-1.5">
            {displayImages.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to image ${index + 1}`}
                onClick={() => {
                  setActive(index);
                  scrollRef.current?.scrollTo({ left: index * scrollRef.current.offsetWidth, behavior: "smooth" });
                }}
                className={`size-1.5 rounded-full ${active === index ? "bg-black" : "bg-gray-light"}`}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="hidden lg:block">
        <div className="grid grid-cols-2 gap-3">
          {displayImages.slice(0, 4).map((src, index) => (
            <div key={`${src}-grid-${index}`} className="relative aspect-[336/505] bg-gray-light">
              <Image src={src} alt={`${alt} view ${index + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
        {displayImages.length > 1 ? (
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
            {displayImages.map((src, index) => (
              <button
                key={`${src}-thumb-${index}`}
                type="button"
                onClick={() => setActive(index)}
                className={`relative size-[78px] min-w-[78px] shrink-0 overflow-hidden border ${active === index ? "border-black" : "border-transparent"}`}
              >
                <Image src={src} alt={`${alt} thumbnail ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export type AddToCartPayload = {
  size: string;
  bottomSize?: string;
  colorIndex: number;
  addons: { addonId: string; name: string; size?: string }[];
};

type Props = {
  product: Product;
  relatedProducts: Product[];
  onAddToCart: (payload: AddToCartPayload) => Promise<void>;
  onBuyNow: (payload: AddToCartPayload) => Promise<void>;
  defaultCustomTailoredOpen?: boolean;
};

export function ProductDetailView({ product, relatedProducts, onAddToCart, onBuyNow, defaultCustomTailoredOpen }: Props) {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>();
  const [selectedBottomSize, setSelectedBottomSize] = useState<string>();
  const [selectedAddons, setSelectedAddons] = useState<Record<string, { selected: boolean; size?: string }>>({});
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [customTailoredOpen, setCustomTailoredOpen] = useState(defaultCustomTailoredOpen ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSupplierInfo, setShowSupplierInfo] = useState(false);

  const colorVariants = product.variants?.length
    ? product.variants
    : [{ color: "Default", images: [product.imageUrl], currentPrice: product.currentPrice }];

  const activeVariant = colorVariants[selectedColor] ?? colorVariants[0];
  const images = activeVariant.images?.length
    ? activeVariant.images.map(resolveImage)
    : [resolveImage(product.imageUrl)];

  const sizes = product.sizes?.filter((s) => s.trim() !== "").length 
    ? product.sizes.filter((s) => s.trim() !== "") 
    : ALL_SIZES;
  const bottomSizes = product.bottomSizes?.filter((s) => s.trim() !== "").length 
    ? product.bottomSizes.filter((s) => s.trim() !== "") 
    : sizes;
  const price = activeVariant.currentPrice ?? product.currentPrice;
  const related = relatedProducts.map(productToCard);
  const carouselSections = [
    "SALE EXTENDED: LUXE LEHENGAS",
    "SIMILAR PRODUCTS",
    "RECENTLY VIEWED",
    "MORE FROM TRILOKINI",
  ];

  const getPayload = (): AddToCartPayload | null => {
    if (!selectedSize) return null;
    const addons = Object.entries(selectedAddons)
      .filter(([, v]) => v.selected)
      .map(([addonId]) => {
        const addon = product.addons?.find((a) => a.id === addonId);
        return {
          addonId,
          name: addon?.name ?? addonId,
          size: selectedAddons[addonId]?.size,
        };
      });
    return { size: selectedSize, bottomSize: selectedBottomSize, colorIndex: selectedColor, addons };
  };

  const handleAction = async (action: (payload: AddToCartPayload) => Promise<void>) => {
    const payload = getPayload();
    if (!payload) {
      setSizeModalOpen(true);
      setError("Please select a size.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await action(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAddon = (addon: ProductAddon) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [addon.id]: { selected: !prev[addon.id]?.selected, size: prev[addon.id]?.size },
    }));
  };

  const isLowStock = (size: string) => {
    const stock = product.stockBySize?.[size];
    return stock !== undefined && stock > 0 && stock <= 1;
  };

  const isOutOfStock = (size: string) => {
    const stock = product.stockBySize?.[size];
    return stock !== undefined && stock <= 0;
  };

  return (
    <div className="mx-auto max-w-[1440px]">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,685px)_1fr] lg:gap-10 lg:px-6 lg:pt-6">
        <div className="px-0">
          <ProductImageGallery images={images} alt={product.title} />
        </div>

        <div className="px-[5px] pt-4 lg:px-0 lg:pt-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[18px] font-semibold uppercase tracking-[0.9px] lg:text-[24px] lg:tracking-[0.72px]">
                {product.designerName}
              </p>
              <h1 className="mt-1 text-[14px] tracking-[0.7px] text-gray lg:text-[14px]">
                {product.title}
              </h1>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" aria-label="Share product" className="flex size-8 items-center justify-center">
                <Share2 size={20} />
              </button>
              <button type="button" aria-label="Add to wishlist" className="flex size-8 items-center justify-center">
                <Heart size={20} />
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-[18px] font-semibold tracking-[0.9px] text-gray lg:text-[18px]">
              {formatPrice(price)}
            </span>
            {product.previousPrice ? (
              <del className="text-[14px] tracking-[0.7px] text-gray-light">{formatPrice(product.previousPrice)}</del>
            ) : null}
            {product.discountPercentage ? (
              <span className="text-[14px] text-sale">{product.discountPercentage}% Off</span>
            ) : null}
          </div>
          <p className="mt-1 text-[13px] tracking-[0.65px] text-gray">Inclusive of all taxes</p>

          <div className="my-5 border-t border-gray-light" />

          <div>
            <p className="mb-3 text-[13px] font-semibold tracking-[0.65px]">Available colours</p>
            <div className="flex gap-2 overflow-x-auto">
              {colorVariants.map((variant, index) => {
                const thumb = resolveImage(variant.images?.[0] || product.imageUrl);
                return (
                  <button
                    key={`${variant.color}-${index}`}
                    type="button"
                    onClick={() => setSelectedColor(index)}
                    className={`relative h-[83px] w-[55px] min-w-[55px] shrink-0 overflow-hidden border ${selectedColor === index ? "border-black" : "border-gray-light"}`}
                  >
                    <Image src={thumb} alt={variant.color} fill className="object-cover" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="my-5 border-t border-gray-light" />

          <div>
            <p className="mb-3 text-[13px] font-semibold tracking-[0.65px]">
              Select Your Size{" "}
              <button type="button" className="text-action underline-offset-2 ">Size Guide</button>
            </p>
            <button
              type="button"
              onClick={() => setSizeModalOpen(true)}
              className="mb-3 flex h-11 w-full items-center justify-between border border-gray-light bg-white px-3 text-[13px] outline-none focus:border-black lg:hidden"
            >
              <span className={selectedSize ? "text-black" : "text-gray"}>{selectedSize || "Select Size"}</span>
              <span className="text-gray">▼</span>
            </button>
            <div className="hidden flex-wrap gap-2 lg:flex">
              {sizes.map((size) => (
                <SizeButton
                  key={size}
                  size={size}
                  selected={selectedSize === size}
                  onClick={() => setSelectedSize(selectedSize === size ? undefined : size)}
                  lowStock={isLowStock(size)}
                  disabled={isOutOfStock(size)}
                />
              ))}
            </div>
            {product.customTailoringEnabled ? (
              <button
                type="button"
                onClick={() => setCustomTailoredOpen(true)}
                className="mt-3 inline-block text-[12px] font-semibold tracking-[0.6px] underline underline-offset-2"
              >
                CUSTOM TAILORING {product.customTailoringPrice ? `(+ ${formatPrice(product.customTailoringPrice)})` : ""}
              </button>
            ) : null}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleAction(onBuyNow)}
              className="h-10 border border-black bg-black text-[13px] font-semibold tracking-[0.65px] text-white hover:bg-gray-900 disabled:opacity-50"
            >
              BUY NOW
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleAction(onAddToCart)}
              className="h-10 border border-black bg-white text-[13px] font-semibold tracking-[0.65px] hover:bg-gray-50 disabled:opacity-50"
            >
              ADD TO CART
            </button>
          </div>

          {error ? <p className="mt-2 text-[12px] text-sale">{error}</p> : null}

          {product.addons?.length ? (
            <div className="mt-8 border-t border-gray-light pt-6">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.65px]">ADD ONS</p>
              <div className="space-y-3">
                {product.addons.map((addon) => (
                  <div key={addon.id}>
                    <div className="flex items-center justify-between">
                      <label className="flex cursor-pointer items-center gap-3 text-[12px] text-gray hover:text-black">
                        <input
                          type="checkbox"
                          checked={!!selectedAddons[addon.id]?.selected}
                          onChange={() => toggleAddon(addon)}
                          className="size-3.5 accent-black border-gray-light"
                        />
                        {addon.name}
                      </label>
                      <span className="text-[12px] text-black">{formatPrice(addon.price)}</span>
                    </div>
                    {addon.hasSizes && selectedAddons[addon.id]?.selected ? (
                      <div className="mt-3 ml-6 pb-2 border-b border-gray-light/50 last:border-0">
                        <p className="mb-2 text-[11px] font-semibold tracking-[0.6px]">
                          Select Bottom Size{" "}
                          <span className="text-action ml-1 hover:underline cursor-pointer">Size Guide</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(addon.sizes ?? bottomSizes).map((s) => (
                            <SizeButton
                              key={s}
                              size={s}
                              selected={selectedAddons[addon.id]?.size === s}
                              onClick={() =>
                                setSelectedAddons((prev) => ({
                                  ...prev,
                                  [addon.id]: { 
                                    ...prev[addon.id], 
                                    selected: true, 
                                    size: prev[addon.id]?.size === s ? undefined : s 
                                  },
                                }))
                              }
                            />
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 border-t border-gray-light">
            <div className="grid grid-cols-[5fr_4fr] gap-6 py-6">
              <div>
                <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.6px]">Product Description</h3>
                <p className="text-[12px] leading-5 text-gray">
                  {product.description || product.subtitle || "Featuring exquisite craftsmanship and contemporary design for celebratory occasions."}
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.6px]">Product Code</h3>
                <p className="text-[12px] leading-5 text-gray">
                  {product.productCode || "DRZC032204"}<br />
                  {product.supplierInfo ? (
                    <button 
                      type="button" 
                      onClick={() => setShowSupplierInfo(!showSupplierInfo)}
                      className="mt-1 text-sale hover:underline"
                    >
                      {showSupplierInfo ? "Hide Supplier Information" : "View Supplier Information"}
                    </button>
                  ) : null}
                </p>
                {showSupplierInfo && product.supplierInfo ? (
                  <div className="mt-3 bg-gray-50 p-3 text-[11px] leading-5 text-gray border border-gray-light">
                    {product.supplierInfo}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="border-t border-gray-light py-6">
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.6px]">Shipping Information</h3>
              <p className="text-[12px] leading-5 text-gray">
                {product.shippingInfo || "This product will be shipped to you after 3-4 weeks from the date of order placed. All custom made orders are not returnable."}
              </p>
            </div>

            <div className="border-b border-t border-gray-light py-6">
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.6px]">Disclaimer</h3>
              <p className="text-[12px] leading-5 text-gray">
                {product.disclaimer || "This product will be exclusively handcrafted for you, making the colour/texture/pattern slightly vary from the image shown, due to multiple artisan-led techniques and processes involved."}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-2 lg:grid-cols-3">
            {[
              { title: "Customisations", sub: "Same style in a bespoke colour" },
              { title: "Worldwide Shipping", sub: "Delivered to your doorstep" },
              { title: "Quality Checked", sub: "Inspected before dispatch" },
              { title: "Secure Payments", sub: "100% safe transactions" },
              { title: "Easy Returns", sub: "On ready-to-ship items" },
              { title: "Expert Styling", sub: "Personal styling assistance" },
            ].map((badge, idx) => (
              <div key={idx} className="flex items-start gap-2 border border-gray-light p-2.5">
                <div className="mt-0.5 flex shrink-0 items-center justify-center">
                  <Image src="/icons/icon-custom.png" width={12} height={12} alt="" className="opacity-70 object-contain h-3 w-3" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-black">{badge.title}</p>
                  <p className="mt-0.5 text-[9px] leading-3 text-gray">{badge.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-10 pb-10 lg:mt-16">
        {related.length > 0 ? (
          <ProductCarousel products={related} title={carouselSections[0]} hideFavorite />
        ) : null}
        <PromoBanner />
        {carouselSections.slice(1).map((title) =>
          related.length > 0 ? (
            <ProductCarousel key={title} products={related} title={title} hideFavorite />
          ) : null
        )}
      </div>

      <SizeSelectModal
        open={sizeModalOpen}
        onClose={() => setSizeModalOpen(false)}
        sizes={sizes}
        price={price}
        stockBySize={product.stockBySize}
        customTailoringEnabled={product.customTailoringEnabled}
        customTailoringPrice={product.customTailoringPrice}
        onSelectSize={setSelectedSize}
        onOpenCustomTailored={() => setCustomTailoredOpen(true)}
      />

      <CustomTailoredModal
        open={customTailoredOpen}
        onClose={() => setCustomTailoredOpen(false)}
        productId={product.id}
        productTitle={product.title}
        color={activeVariant.color}
        colorIndex={selectedColor}
      />
    </div>
  );
}

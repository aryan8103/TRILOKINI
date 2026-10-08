"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/components/providers/cart-provider";
import { calculateProductPrice } from "@/lib/api";
import { resolveImage } from "@/lib/images";
import { formatPrice } from "@/lib/services/products";
import type { BespokeSelection, Product } from "@/lib/types";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"];
const DEFAULT_GALLERY = [
  "/images/bespoke-product/view-01.png",
  "/images/bespoke-product/option-01.png",
  "/images/bespoke-product/view-01.png",
  "/images/bespoke-product/option-01.png",
];

function createSelections(product: Product): Record<string, string> {
  return Object.fromEntries(
    (product.bespokeOptions || []).map((group) => [group.id, group.allowAsIs ? "as-is" : ""]),
  );
}

export function BespokeProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedChoices, setSelectedChoices] = useState(() => createSelections(product));
  const [selectedSize, setSelectedSize] = useState("");
  const [saved, setSaved] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const variantImages = product.variants?.[0]?.images?.filter(Boolean) || [];
  const images = variantImages.length
    ? variantImages
    : product.imageUrl && !product.imageUrl.startsWith("data:")
      ? [product.imageUrl]
      : DEFAULT_GALLERY;
  const gallery = Array.from({ length: 4 }, (_, index) => images[index % images.length]);
  const groups = product.bespokeOptions || [];
  const sections = Array.from(new Set(groups.map((group) => group.section)));
  const selections: BespokeSelection[] = Object.entries(selectedChoices)
    .filter(([, choiceId]) => Boolean(choiceId))
    .map(([groupId, choiceId]) => choiceId === "as-is" ? { groupId, asIs: true } : { groupId, choiceId });
  const optionsTotal = groups.reduce((total, group) => {
    return total + (selectedChoices[group.id] && selectedChoices[group.id] !== "as-is" ? group.price : 0);
  }, 0);
  const displayPrice = product.currentPrice + optionsTotal + (selectedSize === "Custom Tailored" ? product.customTailoringPrice || 0 : 0);

  const saveDesign = () => {
    try {
      const storageKey = "trilokini-bespoke-designs";
      const savedDesigns = JSON.parse(localStorage.getItem(storageKey) || "[]") as Array<Record<string, unknown>>;
      const design = {
        productId: product.id,
        title: product.title,
        selections,
        size: selectedSize,
        savedAt: new Date().toISOString(),
      };
      const next = savedDesigns.filter((item) => item.productId !== product.id);
      localStorage.setItem(storageKey, JSON.stringify([...next, design]));
      setSaved(true);
      toast.success("Design saved");
    } catch {
      toast.error("Could not save this design");
    }
  };

  const shareProduct = async () => {
    try {
      if (navigator.share) await navigator.share({ title: product.title, url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied");
      }
    } catch {
      return;
    }
  };

  const addToCart = async () => {
    if (!selectedSize) {
      toast.error("Select a size to continue");
      return;
    }
    if (groups.some((group) => !selectedChoices[group.id])) {
      toast.error("Choose an option or select as-is for each customization");
      return;
    }

    setIsAdding(true);
    try {
      const pricing = await calculateProductPrice(product.id, {
        size: selectedSize,
        colorIndex: 0,
        bespokeSelections: selections,
      }) as { unitPrice: number };
      const bespokeCustomizations = groups.map((group) => {
        const choice = group.choices.find((item) => item.id === selectedChoices[group.id]);
        return {
          groupId: group.id,
          choiceId: choice?.id || "as-is",
          section: group.section,
          title: group.title,
          choice: choice?.label || "As is",
          price: choice ? group.price : 0,
        };
      });

      addItem({
        productId: product.id,
        title: product.title,
        designerName: product.designerName,
        imageUrl: resolveImage(product.imageUrl.startsWith("data:") ? images[0] : product.imageUrl || images[0]),
        size: selectedSize,
        price: pricing.unitPrice,
        isBespoke: true,
        productCode: product.productCode,
        estimatedShipping: "3-4 weeks",
        colorIndex: 0,
        bespokeSelections: selections,
        bespokeCustomizations,
        customizationKey: JSON.stringify({ size: selectedSize, selections }),
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add this design to your cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1440px] px-3 pb-16 pt-5 lg:px-6 lg:pt-8">
      <div className="mb-4 hidden lg:block">
        <Link href="/bespoke" className="text-[11px] uppercase tracking-[0.04em] text-gray hover:text-black">Bespoke / </Link>
        <span className="text-[11px] uppercase tracking-[0.04em] text-black">{product.title}</span>
      </div>

      <section className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="Product images">
        {gallery.map((src, index) => (
          <div key={`${src}-${index}`} className="relative aspect-[2/3] overflow-hidden bg-gray-light">
            <Image src={resolveImage(src)} alt={`${product.title}, view ${index + 1}`} fill priority={index === 0} sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start" aria-labelledby="product-title">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[18px] font-semibold tracking-[0.03em] lg:text-[24px]">{product.designerName}</p>
              <h1 id="product-title" className="mt-2 text-[13px] tracking-[0.03em] text-gray lg:text-[14px]">{product.title}</h1>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" aria-label="Share product" onClick={shareProduct} className="flex size-9 items-center justify-center border border-black/15 hover:border-black">
                <Share2 size={17} strokeWidth={1.5} />
              </button>
              <button type="button" aria-label="Save product" aria-pressed={isFavorite} onClick={() => setIsFavorite((value) => !value)} className="flex size-9 items-center justify-center border border-black/15 hover:border-black">
                <Heart size={17} strokeWidth={1.5} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="text-[18px] font-semibold tracking-[0.04em]">{formatPrice(displayPrice)}</span>
            {product.previousPrice ? (
              <span className="relative text-[14px] font-semibold text-gray-light">
                {formatPrice(product.previousPrice)}
                <span aria-hidden="true" className="absolute left-0 top-1/2 h-px w-full bg-gray-light" />
              </span>
            ) : null}
            {product.discountPercentage ? <span className="text-[13px] text-sale">{product.discountPercentage}% Off</span> : null}
          </div>
          <p className="mt-1 text-[11px] text-gray">Inclusive of all taxes</p>
        </div>

        <div className="flex flex-col gap-2 lg:w-[298px]">
          <button type="button" onClick={saveDesign} className="h-10 border border-black text-[12px] font-semibold uppercase tracking-[0.04em] hover:bg-gray-50">
            {saved ? "Design saved" : "Save design"}
          </button>
          <button type="button" onClick={addToCart} disabled={isAdding} className="h-10 bg-black text-[12px] font-semibold uppercase tracking-[0.04em] text-white hover:bg-gray-900 disabled:opacity-60">
            {isAdding ? "Adding..." : "Add to cart"}
          </button>
        </div>
      </section>

      <div className="mt-8 border-t border-black/20" />
      {sections.length ? sections.map((section) => (
        <section key={section} className="border-b border-black/20 py-7" aria-labelledby={`section-${section}`}>
          <h2 id={`section-${section}`} className="mb-5 text-[13px] font-semibold uppercase tracking-[0.05em]">{section}</h2>
          <div className="grid gap-x-8 gap-y-7 lg:grid-cols-2">
            {groups.filter((group) => group.section === section).map((group) => (
              <fieldset key={group.id} className="min-w-0">
                <legend className="mb-3 text-[13px]">{group.title}</legend>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {group.choices.map((choice) => {
                    const selected = selectedChoices[group.id] === choice.id;
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setSelectedChoices((current) => ({ ...current, [group.id]: choice.id }))}
                        className={`text-left ${selected ? "outline outline-1 outline-black outline-offset-2" : ""}`}
                      >
                        <span className="relative block aspect-[131/171] overflow-hidden border border-black/30 bg-white">
                          {choice.imageUrl ? <Image src={resolveImage(choice.imageUrl)} alt="" fill sizes="(min-width: 1024px) 12vw, 45vw" className="object-cover" /> : null}
                        </span>
                        <span className="mt-2 flex items-start justify-between gap-2 text-[10px] leading-4">
                          <span>{choice.label}</span>
                          <span className="shrink-0">+{formatPrice(group.price)}</span>
                        </span>
                      </button>
                    );
                  })}
                  {group.allowAsIs ? (
                    <button
                      type="button"
                      aria-pressed={selectedChoices[group.id] === "as-is"}
                      onClick={() => setSelectedChoices((current) => ({ ...current, [group.id]: "as-is" }))}
                      className={`flex min-h-[171px] flex-col items-center justify-center border px-3 text-center text-[11px] ${selectedChoices[group.id] === "as-is" ? "border-black bg-gray-50" : "border-black/30"}`}
                    >
                      <span className="mb-2 flex size-4 items-center justify-center border border-black">
                        {selectedChoices[group.id] === "as-is" ? <span className="size-2 bg-black" /> : null}
                      </span>
                      Let my product as it is
                    </button>
                  ) : null}
                  {!group.choices.length && !group.allowAsIs ? (
                    <p className="col-span-2 text-[11px] leading-5 text-gray sm:col-span-4">Customization choices are being prepared for this design.</p>
                  ) : null}
                </div>
              </fieldset>
            ))}
          </div>
        </section>
      )) : (
        <section className="border-b border-black/20 py-8">
          <p className="text-[12px] text-gray">This bespoke design has no additional customization choices.</p>
        </section>
      )}

      <section className="border-b border-black/20 py-7" aria-labelledby="size-heading">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 id="size-heading" className="text-[13px] font-semibold">Select your size</h2>
          <button type="button" onClick={() => toast("Contact us for the size guide")} className="text-[12px] font-semibold text-sale">Size Guide</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.filter((size) => !product.sizes?.length || product.sizes.includes(size)).map((size) => (
            <button
              key={size}
              type="button"
              aria-pressed={selectedSize === size}
              onClick={() => setSelectedSize((current) => current === size ? "" : size)}
              className={`relative h-11 min-w-12 border px-3 text-[12px] font-semibold ${selectedSize === size ? "border-black bg-black text-white" : "border-gray-light bg-white"}`}
            >
              {size}
              {product.stockBySize?.[size] === 1 ? <span className="absolute -right-1 -top-2 bg-black px-1 text-[9px] text-white">1 left</span> : null}
            </button>
          ))}
          {product.customTailoringEnabled ? (
            <button
              type="button"
              aria-pressed={selectedSize === "Custom Tailored"}
              onClick={() => setSelectedSize((current) => current === "Custom Tailored" ? "" : "Custom Tailored")}
              className={`h-11 border px-4 text-[12px] font-semibold ${selectedSize === "Custom Tailored" ? "border-black bg-black text-white" : "border-gray-light bg-white"}`}
            >
              Custom tailored{product.customTailoringPrice ? ` (+${formatPrice(product.customTailoringPrice)})` : ""}
            </button>
          ) : null}
        </div>
      </section>

      <div className="mt-7 grid gap-5 border-b border-black/20 pb-7 lg:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.04em]">Product description</h2>
          <p className="mt-3 max-w-4xl text-[12px] leading-5 text-gray">
            {product.description || product.subtitle || "This piece is finished by hand and made personal through your bespoke choices."}
          </p>
        </div>
        <div className="lg:min-w-[190px]">
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.04em]">Product code</h2>
          <p className="mt-3 text-[12px] text-gray">{product.productCode || product.id.slice(-8).toUpperCase()}</p>
          {product.supplierInfo ? <p className="mt-1 text-[12px] text-sale">View supplier information</p> : null}
        </div>
      </div>

      <section className="border-b border-black/20 py-6">
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.04em]">Shipping information</h2>
        <p className="mt-3 text-[12px] leading-5 text-gray">{product.shippingInfo}</p>
      </section>
      <section className="border-b border-black/20 py-6">
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.04em]">Disclaimer</h2>
        <p className="mt-3 text-[12px] leading-5 text-gray">{product.disclaimer}</p>
      </section>

      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ["Customisations", "Same style in a bespoke colour"],
          ["Worldwide shipping", "Delivered to your doorstep"],
          ["Quality checked", "Inspected before dispatch"],
          ["Secure payments", "Safe transactions"],
          ["Hand finished", "Made by artisans"],
          ["Expert styling", "Personal styling assistance"],
        ].map(([title, description]) => (
          <div key={title} className="min-h-[60px] border border-black/50 px-3 py-2">
            <p className="text-[10px] font-semibold">{title}</p>
            <p className="mt-1 text-[9px] leading-4 text-gray">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
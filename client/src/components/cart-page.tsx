"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ProductCarousel } from "@/components/commerce";
import { PageHeader } from "@/components/page-chrome";
import { ContentContainer, PageShell } from "@/components/templates/page-shell";
import { useCart } from "@/components/providers/cart-provider";
import { formatPrice, productToCard } from "@/lib/services/products";
import { getMockRelatedProducts } from "@/lib/mocks/products";
import { resolveImage } from "@/lib/images";

export function CartPageView() {
  const { cart, removeItem, setCoupon, setIsGift } = useCart();
  const [couponInput, setCouponInput] = useState(cart.couponCode ?? "");

  const related = getMockRelatedProducts("prod-1", 5).map(productToCard);

  return (
    <PageShell>
      <ContentContainer className="py-6 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <section>
            <h1 className="mb-6 text-[18px] font-semibold uppercase tracking-[0.9px]">YOUR SHOPPING CART</h1>
            {cart.items.length === 0 ? (
              <div className="border border-black/20 py-16 text-center">
                <p className="text-[14px] text-gray">Your cart is empty.</p>
                <Link href="/products" className="mt-4 inline-block border border-black px-6 py-2 text-[12px] font-semibold uppercase tracking-[0.56px]">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-0">
                {cart.items.map((item) => (
                  <article key={item.id} className="flex gap-4 border border-black/20 p-4">
                    <div className="relative size-[88px] shrink-0 bg-gray-light">
                      <Image src={resolveImage(item.imageUrl)} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1 text-[12px] tracking-[0.36px]">
                      <p className="text-[16px] font-semibold">{item.designerName}</p>
                      <p className="mt-1 text-[11px]">{item.title}</p>
                      {item.productCode ? <p className="mt-1 text-[9px]">CODE: {item.productCode}</p> : null}
                      <p className="mt-2 border border-black/40 inline-block px-2 py-0.5 text-[10px]">Size: {item.size}</p>
                      {item.estimatedShipping ? <p className="mt-2 text-[9px] uppercase">Estimated shipping: {item.estimatedShipping}</p> : null}
                    </div>
                    <div className="text-right">
                      <p className="text-[16px] font-semibold">{formatPrice(item.price)}</p>
                      <button type="button" onClick={() => removeItem(item.id)} className="mt-4 text-[12px] text-gray underline">Remove</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <div className="mt-6 flex gap-3">
              <Image src="/payments/visa.png" alt="Visa" width={40} height={16} />
              <Image src="/payments/mastercard.svg" alt="Mastercard" width={60} height={40} />
            </div>
          </section>

          <aside>
            <h2 className="mb-6 text-[18px] font-semibold uppercase tracking-[0.9px]">CART SUMMARY</h2>
            <div className="border border-black/20 p-4 text-[14px]">
              <div className="flex justify-between py-2"><span>Cart Total</span><span>{formatPrice(cart.summary.subtotal)}</span></div>
              <div className="flex justify-between py-2"><span>Total Discount</span><span>(-) {formatPrice(cart.summary.discount)}</span></div>
              <div className="flex justify-between py-2"><span>Shipping</span><span className="text-gray text-[12px]">{cart.summary.shipping !== null ? formatPrice(cart.summary.shipping) : "(calculated at checkout)"}</span></div>
              <label className="mt-4 flex items-center gap-2 text-[13px]">
                <input type="checkbox" checked={cart.isGift} onChange={(e) => setIsGift(e.target.checked)} className="size-3 accent-black" />
                This is a gift item.
              </label>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-[14px] font-semibold uppercase tracking-[0.7px]">Coupon Code</p>
              <div className="flex border border-black/20">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter Coupon Code"
                  className="flex-1 px-3 py-2 text-[13px] outline-none"
                />
                <button type="button" onClick={() => setCoupon(couponInput)} className="bg-black px-4 text-[13px] font-semibold text-white">APPLY</button>
              </div>
            </div>

            <div className="mt-6 border border-black/20 p-4">
              <div className="flex justify-between text-[16px] font-semibold">
                <span>TOTAL PAYABLE</span>
                <span>{formatPrice(cart.summary.total)}</span>
              </div>
              <Link href="/checkout" className="mt-4 flex h-12 w-full items-center justify-center bg-black text-[13px] font-semibold tracking-[0.65px] text-white">PROCEED TO CHECKOUT</Link>
              <Link href="/products" className="mt-3 flex h-12 w-full items-center justify-center border border-black text-[13px] font-semibold tracking-[0.65px]">
                CONTINUE SHOPPING
              </Link>
            </div>
          </aside>
        </div>

        {related.length > 0 ? (
          <div className="mt-16">
            <ProductCarousel products={related} title="SALE EXTENDED: LUXE LEHENGAS" />
          </div>
        ) : null}
      </ContentContainer>
    </PageShell>
  );
}

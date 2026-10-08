"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/providers/cart-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { AuthModal } from "@/components/auth/auth-modal";
import { SearchOverlay } from "@/components/search-overlay";
import { categoryNav, footerLinks, mobileStickyNav, utilityNav } from "@/lib/navigation";
import { CartPopout } from "./commerce";
import { Accordion, IconButton } from "./ui";

const icons = {
  menu: "/icons/menu.svg",
  search: "/icons/search.png",
  account: "/icons/account.png",
  cart: "/icons/cart.png",
  whatsapp: "/icons/whatsapp.png",
  sort: "/icons/sort-down.png",
};

const navIcons = ["/icons/shop-all.png", "/icons/wedding-nav.png", "/icons/reception-nav.png", "/icons/engagement-nav.png", "/icons/sangeet-nav.png"];

export function DesktopHeader() {
  const pathname = usePathname();
  const { openCart, itemCount } = useCart();
  const { user, openAuth } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="relative sticky top-0 z-50 hidden overflow-visible bg-white lg:block" aria-label="Desktop header">
        <div className="flex h-[31px] items-center justify-center bg-[#EAEAEA]">
          <nav className="flex items-center gap-[26px] text-[12px] font-semibold tracking-[0.36px] text-[#757575]" aria-label="Utility navigation">
            {utilityNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${item.label === "CATEGORY" ? "text-[13px] tracking-[0.39px]" : ""} ${pathname.startsWith(item.href) ? "text-black" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link href="/" className="absolute left-[calc(50%+1px)] top-[5px] z-30 -translate-x-1/2">
          <Image
            src="/logos/trilokini-header.png"
            alt="Trilokini"
            width={182}
            height={139}
            className="h-[139px] w-[182px] object-contain"
            priority
          />
        </Link>

        <div className="relative z-10 h-[109px] bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.13)]">
          <div className="flex h-[78px] items-center justify-between px-[86px] text-[12px] font-semibold text-black">
            <div className="flex items-center gap-[52px]">
              <div className="flex items-center gap-[1px]">
                <span>INR</span>
                <Image src={icons.sort} alt="" width={10} height={10} className="size-[10px] object-contain" />
              </div>
              {user ? (
                <Link href="/account">ACCOUNT</Link>
              ) : (
                <button type="button" onClick={() => openAuth("login")}>ACCOUNT</button>
              )}
            </div>

            <div className="relative z-20 flex items-center gap-[20px]">
              <button type="button" onClick={() => setSearchOpen(true)} className="inline-flex size-[28px] items-center justify-center" aria-label="Search">
                <Image src={icons.search} alt="" width={28} height={28} className="size-[28px] object-contain" />
              </button>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="inline-flex size-[28px] items-center justify-center"
              >
                <Image src={icons.whatsapp} alt="" width={28} height={28} className="size-[28px] object-contain" />
              </a>
              <button type="button" onClick={openCart} className="relative inline-flex size-[28px] items-center justify-center" aria-label="Open cart">
                <Image src={icons.cart} alt="" width={28} height={28} className="size-[28px] object-contain" />
                {itemCount > 0 ? (
                  <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white">{itemCount}</span>
                ) : null}
              </button>
            </div>
          </div>

          <nav className="absolute inset-x-0 bottom-[8px] mx-auto flex w-[933px] max-w-[calc(100%-48px)] justify-between text-[12px] font-medium leading-normal text-black" aria-label="Category navigation">
            {categoryNav.map((item) => (
              <Link key={item.href} href={item.href} className={item.highlight ? "text-sale-nav" : "hover:text-gray"}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

export function MobileHeader({ onMenu }: { onMenu?: () => void }) {
  const { openCart, itemCount } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="relative flex h-[50px] items-center justify-between bg-white px-[9px] lg:hidden" aria-label="Mobile header">
        <button
          type="button"
          aria-label="Open menu"
          onClick={onMenu}
          className="relative z-10 inline-flex size-[20px] shrink-0 items-center justify-center"
        >
          <Image src={icons.menu} alt="" width={20} height={20} className="size-[20px] object-cover" />
        </button>
        <Link href="/" className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2">
          <Image src="/logos/trilokini-header.png" alt="Trilokini" width={160} height={34} className="h-[34px] w-[160px] object-contain" priority />
        </Link>
        <div className="relative z-10 flex items-center gap-[6px]">
          <button type="button" aria-label="Search" onClick={() => setSearchOpen(true)} className="inline-flex size-[21px] items-center justify-center">
            <Image src={icons.search} alt="" width={21} height={21} className="size-[21px] object-cover" />
          </button>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="inline-flex size-[21px] items-center justify-center"
          >
            <Image src={icons.whatsapp} alt="" width={21} height={21} className="size-[21px] object-cover" />
          </a>
          <button type="button" onClick={openCart} className="relative inline-flex size-[21px] items-center justify-center" aria-label="Open cart">
            <Image src={icons.cart} alt="" width={21} height={21} className="size-[21px] object-cover" />
            {itemCount > 0 ? <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-black" /> : null}
          </button>
        </div>
      </header>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

const sidebarLinks = [
  { label: "CATEGORY", href: "/categories" },
  { label: "COLLECTIONS", href: "/collections" },
  { label: "FILMS", href: "/films" },
  { label: "BESPOKE", href: "/bespoke" },
  { label: "STORY", href: "/story" },
  { label: "CONTACT US", href: "/contact" },
];

export function Sidebar({ open = false, onClose }: { open?: boolean; onClose?: () => void }) {
  const { user } = useAuth();
  if (!open) return null;
  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-[310px] max-w-[86vw] bg-white shadow-xl" aria-label="Mobile menu">
      <div className="flex items-center justify-between border-b border-gray-light px-4 py-5">
        <p className="font-display text-[32px]">Namaste!</p>
        <IconButton label="Close menu" onClick={onClose} />
      </div>
      <div className="px-5 py-5 text-[14px] tracking-[0.56px]">
        <div className="mb-7 flex justify-between">
          <span>INR</span>
          <Link href={user ? "/account" : "/login"} onClick={onClose}>ACCOUNT</Link>
        </div>
        <nav className="flex flex-col gap-5" aria-label="Mobile navigation">
          {sidebarLinks.map((item) => (
            <Link key={item.href} href={item.href} onClick={onClose}>{item.label}</Link>
          ))}
        </nav>
        <div className="mt-12 border-t border-black/20 pt-6 text-gray">
          <a href="mailto:customercare@trilokini.com">customercare@trilokini.com</a>
          <p className="mt-4">1800 120 000 520 (India)</p>
        </div>
      </div>
    </aside>
  );
}

export function MobileStickyNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-[79px] items-center justify-around overflow-x-auto border-t border-black/20 bg-white px-2 lg:hidden" aria-label="Mobile category navigation">
      {mobileStickyNav.map((item, index) => (
        <Link key={item.href} href={item.href} className="flex min-w-[68px] flex-col items-center gap-1 text-[10px] tracking-[0.36px]">
          <Image src={navIcons[index]} alt="" width={42} height={42} className="size-[42px] object-contain" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function NewsletterForm({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const isMobile = variant === "mobile";

  return (
    <form
      className={isMobile ? "flex w-full flex-col items-center gap-[14px] text-center" : "flex flex-col items-center gap-[14px] text-center"}
      onSubmit={(e) => {
        e.preventDefault();
        setStatus("success");
      }}
    >
      <p
        className={`font-medium text-black ${
          isMobile
            ? "max-w-[240px] text-[9px] leading-[13px] tracking-[0.36px]"
            : "max-w-[320px] text-[9px] leading-[19px] tracking-[0.36px]"
        }`}
      >
        {isMobile
          ? "Signup to get exclusive style tips, new arrival updates and a special discount code."
          : "Signup to get exclusive tips, new arrival updates and a special discount code."}
      </p>
      <button
        type="submit"
        className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap border-[0.3px] border-black leading-none text-black ${
          isMobile
            ? "h-[28px] min-w-[86px] bg-transparent px-3 text-[10px] font-medium tracking-[0.2px]"
            : "h-9 min-w-[104px] bg-white px-3 text-[14px] font-semibold tracking-[0.56px]"
        }`}
      >
        Sign me Up
      </button>
      {status === "success" ? <p className="text-[12px] text-gray">Thank you for subscribing!</p> : null}
    </form>
  );
}

const socialLinks = [
  { href: "https://facebook.com", src: "/icons/facebook.svg", label: "Facebook" },
  { href: "https://instagram.com", src: "/icons/instagram.svg", label: "Instagram" },
  { href: "https://twitter.com", src: "/icons/twitter.svg", label: "X" },
  { href: "https://pinterest.com", src: "/icons/pinterest.svg", label: "Pinterest" },
  { href: "https://youtube.com", src: "/icons/youtube.png", label: "YouTube" },
];

function SocialRow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-[15px] ${className}`}>
      {socialLinks.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          className="inline-flex size-[18px] items-center justify-center"
        >
          <Image src={item.src} alt="" width={18} height={18} className="size-[18px] object-contain" />
        </a>
      ))}
    </div>
  );
}

function PaymentMarks({ compact = false }: { compact?: boolean }) {
  const count = compact ? 2 : 3;
  return (
    <div className={`mt-1 flex items-center ${compact ? "justify-center" : ""}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center">
          <Image
            src="/payments/visa.png"
            alt="Visa"
            width={compact ? 30 : 40}
            height={compact ? 12 : 16}
            className={compact ? "h-3 w-[30px] object-contain" : "h-4 w-10 object-contain"}
          />
          <Image
            src="/payments/mastercard.svg"
            alt="Mastercard"
            width={compact ? 40 : 60}
            height={compact ? 30 : 40}
            className={compact ? "h-[30px] w-10 object-contain" : "h-10 w-[60px] object-contain"}
          />
        </div>
      ))}
    </div>
  );
}

function ContactBlock() {
  return (
    <div className="text-[14px] text-[#757575]">
      <a href="mailto:care@offstore.com" className="underline">
        care@offstore.com
      </a>
      <p className="mt-[18px] leading-6">
        Call us at: 1800-120-000-520 (India)/
        <br />
        +91 8000000001 (International)
        <br />
        10 am - 7 pm, Monday - Saturday
      </p>
    </div>
  );
}

function CopyrightLine() {
  return (
    <div className="flex items-center justify-center gap-[6px] font-display text-[16px] leading-none text-black">
      <Image src="/icons/copyright.png" alt="" width={16} height={16} className="size-4 object-contain" />
      <span>2026 Offstore Fashions Ltd. All rights reserved.</span>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-white" aria-label="Footer">
      {/* Desktop — Figma 9:806 */}
      <div className="relative hidden overflow-hidden lg:block" style={{ background: "rgba(234,234,234,0.67)" }}>
        {/* Landscape pattern stays above the footer bottom edge */}
        <div className="pointer-events-none absolute inset-x-0 top-0 bottom-[78px]">
          <Image
            src="/logos/footer-pattern-desktop-wide.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={false}
          />
        </div>

        <div className="relative mx-auto w-full max-w-[1440px] px-[75px] pb-[40px] pt-[24px]">
          {/* Logo rests on the top rule */}
          <div className="relative z-10 mb-[15px] w-[180px]">
            <Image
              src="/logos/trilokini-footer-mark.png"
              alt="Trilokini"
              width={180}
              height={40}
              className="block h-auto w-[180px] object-contain object-left"
              priority={false}
            />
          </div>

          <div className="border-t border-black pt-[18px]">
            <div className="grid grid-cols-5 gap-x-[48px] border-b border-black pb-[48px]">
              {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title}>
                  <h2 className="mb-[28px] text-[14px] font-semibold tracking-[0.56px] text-black">{title}</h2>
                  <ul className="space-y-[20px] text-[14px] leading-5 text-[#757575]">
                    {links.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className="hover:text-black">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div>
                <h2 className="mb-[28px] text-[14px] font-semibold tracking-[0.56px] text-black">CONTACT</h2>
                <ContactBlock />
                <h2 className="mb-[16px] mt-[32px] text-[14px] font-semibold tracking-[0.56px] text-black">KEEP IN TOUCH</h2>
                <SocialRow />
              </div>
            </div>

            <div className="relative grid grid-cols-2 items-start border-b border-black py-[30px]">
              <div className="absolute left-1/2 top-[30px] h-[93px] w-px -translate-x-1/2 bg-black" />
              <div className="max-w-[500px] pr-12">
                <h2 className="text-[16px] font-semibold tracking-[0.64px] text-black">COMPLETELY SAFE AND SECURE PAYMENT METHOD</h2>
                <p className="mt-[8px] text-[9px] font-semibold tracking-[0.36px] text-black">
                  We accept Netbanking, all major credit cards. We also accept orders with cash payment.
                </p>
                <PaymentMarks />
              </div>
              <div className="flex justify-center pt-[10px]">
                <NewsletterForm variant="desktop" />
              </div>
            </div>

            <div className="pt-[16px]">
              <CopyrightLine />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile — Figma 9:12 */}
      <div className="relative overflow-hidden bg-white shadow-[0_-4px_4px_rgba(0,0,0,0.25)] lg:hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 bottom-[78px]">
          <Image src="/logos/footer-pattern-mobile.png" alt="" fill sizes="405px" className="object-cover object-top opacity-[0.6]" />
        </div>

        <div className="relative px-[28px] pb-[28px] pt-[10px]">
          <div className="flex flex-col items-center">
            <Image
              src="/logos/trilokini-footer-mark.png"
              alt="Trilokini"
              width={140}
              height={31}
              className="h-auto w-[140px] object-contain"
            />
            <div className="mt-[16px] w-full">
              <NewsletterForm variant="mobile" />
            </div>
          </div>

          <div className="mt-[28px]">
            {Object.entries(footerLinks).map(([title, links]) => (
              <Accordion key={title} title={title} className="-mx-[28px] px-[28px]">
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </Accordion>
            ))}
          </div>

          <div className="-mx-[28px] border-t border-black px-[28px] pt-[14px]">
            <h2 className="mb-[16px] text-[14px] font-semibold tracking-[0.56px] text-black">CONTACT</h2>
            <ContactBlock />
            <h2 className="mb-[16px] mt-[24px] text-[14px] font-semibold tracking-[0.56px] text-black">KEEP IN TOUCH</h2>
            <SocialRow className="justify-center" />
          </div>

          <div className="mx-auto mt-[20px] w-[calc(100%+0px)] max-w-[352px] border-t border-black pt-[18px] text-center">
            <h2 className="text-[12px] font-semibold tracking-[0.48px] text-black">
              COMPLETELY SAFE AND SECURE PAYMENT METHOD
            </h2>
            <p className="mt-[4px] text-[7px] font-semibold tracking-[0.28px] text-black">
              We accept Netbanking, all major credit cards. We also accept orders with cash payment.
            </p>
            <div className="mt-[2px]">
              <PaymentMarks compact />
            </div>
          </div>

          <div className="mx-auto mt-[12px] max-w-[352px] border-t border-black pt-[12px]">
            <CopyrightLine />
          </div>
        </div>
      </div>
    </footer>
  );
}

export function ResponsiveShell({ children, hideMobileStickyNav = false }: { children: React.ReactNode; hideMobileStickyNav?: boolean }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { cart, isOpen, closeCart, removeItem } = useCart();

  const cartProducts = cart.items.map((item) => ({
    id: item.id,
    src: item.imageUrl,
    designer: item.designerName,
    name: item.title,
    price: `Rs. ${item.price.toLocaleString("en-IN")}`,
    href: `${item.isBespoke ? "/bespoke" : ""}/products/${item.productId}`,
  }));

  return (
    <>
      <DesktopHeader />
      <MobileHeader onMenu={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen ? <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} /> : null}
      {children}
      {hideMobileStickyNav ? null : <MobileStickyNav />}
      <CartPopout open={isOpen} items={cartProducts} onClose={closeCart} onRemove={removeItem} />
      <AuthModal />
    </>
  );
}

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
  menu: "/icons/menu.png",
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
      <header className="relative hidden overflow-visible bg-white lg:block" aria-label="Desktop header">
        <div className="relative flex h-[max(31px,2.15vw)] items-center justify-center bg-[#EAEAEA] text-[length:max(12px,0.83vw)] font-medium tracking-[0.36px] text-gray">
          <nav className="flex gap-[max(32px,2.22vw)]" aria-label="Utility navigation">
            {utilityNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname.startsWith(item.href) && item.href !== "/" ? "relative font-semibold text-black" : ""}
              >
                {item.label}
                {pathname.startsWith(item.href) && item.href !== "/" ? (
                  <span className="absolute -bottom-[max(6px,0.42vw)] left-1/2 h-[2px] w-[100px] -translate-x-1/2 bg-black" />
                ) : null}
              </Link>
            ))}
          </nav>
        </div>
        <Link href="/" className="absolute left-[calc(50%+1px)] top-[5px] z-10 -translate-x-1/2">
          <Image src="/logos/trilokini-header.png" alt="Trilokini" width={182} height={139} className="h-[139px] w-[182px] object-cover" priority />
        </Link>
        <div className="relative h-[max(109px,7.57vw)] border-b border-gray-light shadow-[0_1px_4px_rgba(0,0,0,0.13)]">
          <div className="flex h-[max(78px,5.41vw)] w-full items-center justify-between px-[max(40px,2.77vw)]">
            <div className="flex items-center gap-[max(40px,2.77vw)] text-[12px] font-semibold leading-[15px] text-black">
              <div className="flex items-center gap-[max(8px,0.55vw)]">
                <span>INR</span>
                <Image src={icons.sort} alt="" width={10} height={10} className="h-[10px] w-[10px]" />
              </div>
              {user ? (
                <Link href="/account" className="hover:underline">ACCOUNT</Link>
              ) : (
                <button type="button" onClick={() => openAuth("login")} className="hover:underline">ACCOUNT</button>
              )}
            </div>
            <div className="relative z-20 flex items-center gap-[max(20px,1.38vw)]">
              <IconButton label="Search" icon={icons.search} onClick={() => setSearchOpen(true)} className="size-7 p-0" />
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="inline-flex size-7 items-center justify-center"
              >
                <Image src={icons.whatsapp} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
              </a>
              <button type="button" onClick={openCart} className="relative inline-flex size-7 items-center justify-center" aria-label="Open cart">
                <Image src={icons.cart} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
                {itemCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white">{itemCount}</span>
                ) : null}
              </button>
            </div>
          </div>
          <nav className="absolute bottom-0 left-1/2 flex w-[max(933px,64.79vw)] -translate-x-1/2 justify-between px-[max(20px,1.38vw)] pb-[max(8px,0.55vw)] text-[12px] font-medium leading-[15px] text-black" aria-label="Category navigation">
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
        <Link href="/" className="absolute left-1/2 top-px z-0 h-[50px] w-[118.5px] -translate-x-1/2">
          <Image src="/logos/trilokini-header.png" alt="Trilokini" width={119} height={50} className="h-[50px] w-[118.5px] object-cover" priority />
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

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => { e.preventDefault(); setStatus("success"); }}
    >
      <label htmlFor="footer-email" className="text-[16px] font-semibold tracking-[0.64px]">KEEP IN TOUCH</label>
      <input id="footer-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="h-10 border border-black bg-white px-3 text-[13px] outline-none placeholder:text-gray" />
      <button type="submit" className="h-9 w-[104px] border border-black bg-white text-[13px] font-semibold tracking-[0.56px]">Sign me Up</button>
      {status === "success" ? <p className="text-[12px] text-gray">Thank you for subscribing!</p> : null}
    </form>
  );
}

export function Footer() {
  return (
    <footer className="bg-white" aria-label="Footer">
      <div className="relative overflow-hidden border-t border-black/20 bg-footer-wash px-6 py-8 lg:px-[75px] lg:py-7">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <Image src="/logos/trilokini-footer.png" alt="" fill className="object-cover" />
        </div>
        <div className="relative mx-auto max-w-[1290px]">
          <div className="hidden grid-cols-5 border-b border-black/20 pb-5 lg:grid">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h2 className="mb-5 text-[14px] font-semibold tracking-[0.56px]">{title}</h2>
                <ul className="space-y-4 text-[14px] leading-5 text-gray">
                  {links.map((link) => (
                    <li key={link.label}><Link href={link.href}>{link.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h2 className="mb-5 text-[14px] font-semibold tracking-[0.56px]">CONTACT</h2>
              <a href="mailto:customercare@trilokini.com" className="text-[14px] text-gray underline">customercare@trilokini.com</a>
              <p className="mt-4 max-w-[256px] text-[14px] leading-6 text-gray">
                Call us at: 1800-120-000-520 (India) / +91 8000000001 (International)<br />
                10 am - 7 pm, Monday - Saturday
              </p>
            </div>
          </div>
          <div className="lg:hidden">
            {Object.entries(footerLinks).map(([title, links]) => (
              <Accordion key={title} title={title}>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}><Link href={link.href}>{link.label}</Link></li>
                  ))}
                </ul>
              </Accordion>
            ))}
            <Accordion title="CONTACT">
              <a href="mailto:customercare@trilokini.com">customercare@trilokini.com</a>
              <p className="mt-3">1800 120 000 520 (India)</p>
            </Accordion>
          </div>
          <div className="grid gap-8 border-b border-black/20 py-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-[16px] font-semibold tracking-[0.64px]">COMPLETELY SAFE AND SECURE PAYMENT METHOD</h2>
              <p className="mt-2 text-[9px] text-gray">We accept Netbanking, all major credit cards. We also accept orders with cash payment.</p>
              <div className="mt-3 flex gap-3">
                <Image src="/payments/visa.png" alt="Visa" width={40} height={16} />
                <Image src="/payments/mastercard.svg" alt="Mastercard" width={60} height={40} />
              </div>
            </div>
            <NewsletterForm />
          </div>
          <div className="flex justify-center pt-5 font-display text-[16px] lg:pt-8">© 2026 Offstore Fashions Ltd. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}

export function ResponsiveShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { cart, isOpen, closeCart, removeItem } = useCart();

  const cartProducts = cart.items.map((item) => ({
    id: item.id,
    src: item.imageUrl,
    designer: item.designerName,
    name: item.title,
    price: `Rs. ${item.price.toLocaleString("en-IN")}`,
    href: `/products/${item.productId}`,
  }));

  return (
    <>
      <DesktopHeader />
      <MobileHeader onMenu={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen ? <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} /> : null}
      {children}
      <MobileStickyNav />
      <CartPopout open={isOpen} items={cartProducts} onClose={closeCart} onRemove={removeItem} />
      <AuthModal />
    </>
  );
}

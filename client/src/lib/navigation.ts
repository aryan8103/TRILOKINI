export type NavLink = { label: string; href: string; highlight?: boolean };

export const utilityNav: NavLink[] = [
  { label: "CATEGORY", href: "/categories" },
  { label: "COLLECTIONS", href: "/collections" },
  { label: "FILMS", href: "/films" },
  { label: "BESPOKE", href: "/bespoke" },
  { label: "STORY", href: "/story" },
];

export const categoryNav: NavLink[] = [
  { label: "NEW", href: "/products?sort=new" },
  { label: "WOMEN", href: "/products?category=women" },
  { label: "LEHENGAS", href: "/products?category=lehengas" },
  { label: "SAREES", href: "/products?category=sarees" },
  { label: "KURTA SETS", href: "/products?category=kurta-sets" },
  { label: "ANARKALIS", href: "/products?category=anarkalis" },
  { label: "SAHARAS", href: "/products?category=saharas" },
  { label: "WESTERN", href: "/products?category=western" },
  { label: "PRET", href: "/products?category=pret" },
  { label: "FUSION", href: "/products?category=fusion" },
  { label: "WEDDING", href: "/products?category=wedding" },
  { label: "READY TO SHIP", href: "/products?category=ready-to-ship" },
  { label: "SALE", href: "/products?category=sale", highlight: true },
];

export const mobileStickyNav: NavLink[] = [
  { label: "SHOP ALL", href: "/products" },
  { label: "WEDDING", href: "/products?category=wedding" },
  { label: "RECEPTION", href: "/products?category=reception" },
  { label: "ENGAGEMENT", href: "/products?category=engagement" },
  { label: "SANGEET", href: "/products?category=sangeet" },
];

export const footerLinks = {
  CATEGORY: [
    { label: "Kurta Pajama", href: "/products?category=kurta-pajama" },
    { label: "Nehru Jackets", href: "/products?category=nehru-jackets" },
    { label: "Indo Western", href: "/products?category=indo-western" },
    { label: "Sherwani", href: "/products?category=sherwani" },
    { label: "Lehenga", href: "/products?category=lehengas" },
    { label: "Saree", href: "/products?category=sarees" },
    { label: "Kids Wear", href: "/products?category=kids-wear" },
    { label: "Accesories", href: "/products?category=accessories" },
  ],
  SUPPORT: [
    { label: "Track Order", href: "/track-orders" },
    { label: "Contact Us", href: "/contact" },
    { label: "My Account", href: "/account" },
  ],
  "QUICK LINKS": [
    { label: "About Us", href: "/story" },
    { label: "Brand Story", href: "/story" },
    { label: "Blogs", href: "/films" },
    { label: "Careers", href: "/pages/careers" },
    { label: "Store Locator", href: "/contact" },
  ],
  "OUR POLICIES": [
    { label: "FAQ's", href: "/faq" },
    { label: "Shipping Details", href: "/pages/shipping" },
    { label: "Return, Exchange and Refund Policy", href: "/pages/returns" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Privacy Policy", href: "/pages/privacy" },
    { label: "Cookie Policy", href: "/pages/cookies" },
  ],
};

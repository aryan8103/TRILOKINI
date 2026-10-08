import type { CMSPage, FAQItem, FilmArticle } from "@/lib/types";

const home = "/images/home";

export const mockFilmArticles: FilmArticle[] = [
  {
    slug: "maternity-fashion-cultural-movement",
    title: "MATERNITY FASHION IS HAVING A CULTURAL MOVEMENT",
    excerpt: "Recently, Anne Hathaway hit the streets of New York promoting The Odyssey in a red peplum maternity ensemble that sparked conversation across fashion circles.",
    body: "Maternity fashion is no longer confined to understated silhouettes. Designers are embracing celebratory dressing for every chapter of life, with bold colours, structured drapes, and occasion-ready separates leading the conversation.",
    imageUrl: `${home}/hero-product-1.png`,
    publishedAt: "2026-07-17",
    featured: true,
  },
  {
    slug: "wedding-season-trends-2026",
    title: "WEDDING SEASON TRENDS TO WATCH IN 2026",
    excerpt: "From heritage drapes to contemporary sharara sets, this season celebrates craftsmanship with a modern lens.",
    body: "The wedding edit this year blends artisanal embroidery with lighter fabrics, making celebratory dressing more versatile than ever.",
    imageUrl: `${home}/hero-product-2.png`,
    publishedAt: "2026-07-10",
  },
  {
    slug: "celebrity-closet-spotlight",
    title: "CELEBRITY CLOSET: RED CARPET REIMAGINED",
    excerpt: "How India's leading stylists are reinterpreting traditional occasionwear for global stages.",
    body: "Celebrity closets continue to influence bridal and reception edits, with pre-draped sarees and statement blouses leading demand.",
    imageUrl: `${home}/hero-product-3.png`,
    publishedAt: "2026-06-28",
  },
  {
    slug: "artisan-collaborations",
    title: "ARTISAN COLLABORATIONS DEFINING LUXE ETHNICWEAR",
    excerpt: "A closer look at the craftspeople behind the collections you love.",
    body: "Hand embroidery, zardozi, and block printing remain at the heart of contemporary Indian luxury fashion.",
    imageUrl: `${home}/hero-product-4.png`,
    publishedAt: "2026-06-15",
  },
  {
    slug: "festival-dressing-guide",
    title: "THE FESTIVAL DRESSING GUIDE",
    excerpt: "Curated looks for sangeet, mehendi, and reception celebrations.",
    body: "Mix textures, layer jewellery, and choose breathable fabrics for long celebrations.",
    imageUrl: `${home}/hero-product-5.png`,
    publishedAt: "2026-06-01",
  },
  {
    slug: "sustainable-luxury",
    title: "SUSTAINABLE LUXURY IN INDIAN FASHION",
    excerpt: "How conscious craftsmanship is shaping the future of occasionwear.",
    body: "Slow fashion principles are influencing production timelines, custom tailoring, and made-to-order collections.",
    imageUrl: `${home}/category-1.png`,
    publishedAt: "2026-05-20",
  },
];

export const mockFAQ: FAQItem[] = [
  { id: "1", question: "How do I track my order?", answer: "Once your order ships, you will receive a tracking link via email and SMS. You can also track orders from your account page." },
  { id: "2", question: "What is your return policy?", answer: "Ready-to-ship items can be returned within 7 days. Custom-made and bespoke orders are non-returnable." },
  { id: "3", question: "Do you offer international shipping?", answer: "Yes, we ship worldwide. Shipping costs are calculated at checkout based on destination." },
  { id: "4", question: "How does custom tailoring work?", answer: "Select custom tailoring on the product page, share measurements, and our team will confirm timelines before production." },
  { id: "5", question: "Can I modify my order after placing it?", answer: "Orders can be modified within 24 hours of placement. Contact customer care for assistance." },
];

export const mockCMSPages: Record<string, CMSPage> = {
  terms: {
    slug: "terms",
    title: "Terms and Conditions",
    content: "These terms govern your use of the Trilokini website and services. By accessing our platform, you agree to comply with all applicable policies.",
    sections: [
      { heading: "Use of Website", body: "You may browse and purchase products for personal use. Commercial resale without authorization is prohibited." },
      { heading: "Orders & Payment", body: "All orders are subject to availability and confirmation. Prices are inclusive of applicable taxes unless stated otherwise." },
      { heading: "Intellectual Property", body: "All content, images, and branding on this website are owned by Trilokini and may not be reproduced without permission." },
    ],
  },
  shipping: {
    slug: "shipping",
    title: "Shipping Details",
    content: "We offer domestic and international shipping on most products.",
    sections: [
      { heading: "Domestic Delivery", body: "Standard delivery within India takes 5-10 business days for ready-to-ship items." },
      { heading: "International Delivery", body: "International orders typically arrive within 10-21 business days depending on customs clearance." },
    ],
  },
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    content: "We respect your privacy and are committed to protecting your personal information.",
    sections: [
      { heading: "Data Collection", body: "We collect information you provide during registration, checkout, and customer support interactions." },
      { heading: "Data Usage", body: "Your data is used to process orders, improve services, and communicate relevant updates." },
    ],
  },
  returns: {
    slug: "returns",
    title: "Return, Exchange and Refund Policy",
    content: "Our return policy varies by product type and customization status.",
    sections: [
      { heading: "Eligible Returns", body: "Unworn ready-to-ship items with tags intact may be returned within 7 days." },
      { heading: "Non-Returnable Items", body: "Custom-made, bespoke, and altered garments cannot be returned." },
    ],
  },
  cookies: {
    slug: "cookies",
    title: "Cookie Policy",
    content: "We use cookies to enhance your browsing experience and analyze site traffic.",
  },
  careers: {
    slug: "careers",
    title: "Careers",
    content: "Join the Trilokini team. We are always looking for passionate individuals in fashion, technology, and customer experience.",
  },
};

export function getMockFilmBySlug(slug: string): FilmArticle | null {
  return mockFilmArticles.find((a) => a.slug === slug) ?? null;
}

export function getMockCMSPage(slug: string): CMSPage | null {
  return mockCMSPages[slug] ?? null;
}

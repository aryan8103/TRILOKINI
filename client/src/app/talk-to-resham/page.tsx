import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/templates/page-shell";

export const metadata = { title: "Talk to Resham | Trilokini" };

const terms = [
  "Welcome to Trilokini, operated by Offstore Fashions Ltd. (“we”, “us” or “our”). These terms apply whenever you browse our website, contact our team, or request help from Resham. By using this page, you agree to the terms that apply to the service you choose. Our contact information and service details are provided on this site and may be updated from time to time. If you continue to use the site, you confirm that you have reviewed the conditions that apply to your request.",
  "Trilokini is a luxury fashion house offering designer clothing and related services through its stores and website. Talk to Resham provides personalised assistance for customers seeking guidance on styles, designers, product details, fit, customisation, or orders. The recommendations given by our team are based on the information you share with us and do not guarantee the availability of any particular item. Our team may ask follow-up questions about your preferences, occasion, budget, or delivery requirements to help us respond accurately. Product availability, delivery times, and service options may vary depending on your request and location.",
  "If there is a substantial change to a service or its terms, we will make the latest information available through our website or contact you directly when appropriate. Please check the relevant details before continuing with a request. Any consultation fee, product price, and applicable delivery costs will be confirmed before an order is placed. We may also contact you to clarify details or discuss any changes needed to fulfil your request.",
  "Please review the product, payment, shipping, and return information before placing an order. When you use any current or future service offered by Trilokini or an affiliated business, you may also be subject to service-specific guidelines. If those guidelines differ from these general terms, the conditions provided with the relevant service or product will apply. Our team will share any additional requirements before confirming an order so you can decide how you wish to proceed.",
];

function PriceAction({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/contact"
      aria-label="Talk to Resham consultation, Rs. 50,000"
      className={`flex h-9 items-center justify-around bg-black text-[14px] font-semibold tracking-[0.04em] text-white ${className}`}
    >
      <span>Rs. 50,000</span>
      <span aria-hidden="true" className="h-[15px] w-px bg-white/80" />
      <span>ADD TO CART</span>
    </Link>
  );
}

export default function TalkToReshamPage() {
  return (
    <PageShell className="pb-0" hideMobileStickyNav>
      <div className="min-h-[calc(100svh-50px)] pb-16 md:min-h-[calc(100svh-140px)] lg:pb-8">
        <header className="px-[17px] pt-[10px] md:px-[44px] md:pt-[26px]">
          <h1 className="text-[14px] font-semibold leading-[18px] tracking-[0.05em] text-[#212121] md:text-[18px] md:tracking-[0.05em]">
            TALK TO RESHAM
          </h1>
        </header>

        <div className="relative mt-[10px] h-[226px] w-full overflow-hidden md:hidden">
          <Image
            src="/images/talk-to-resham/clothing-desktop.png"
            alt="Resham's clothing and styling service"
            fill
            sizes="100vw"
            className="object-cover object-[7%_center]"
            priority
          />
        </div>
        <div className="relative mx-auto mt-[18px] hidden aspect-[1354/360] w-full max-w-[1354px] overflow-hidden md:block">
          <Image
            src="/images/talk-to-resham/clothing-desktop.png"
            alt="Resham's clothing and styling service"
            fill
            sizes="(min-width: 1440px) 1354px, calc(100vw - 88px)"
            className="object-cover"
            priority
          />
        </div>

        <section className="mx-auto mt-2 max-w-[1440px] px-[17px] text-[11px] leading-[18px] tracking-[0.02em] text-[#212121] md:mt-4 md:px-[44px] md:text-[12px]">
          <p className="md:hidden">
            Welcome to Trilokini, operated by Offstore Fashions Ltd. (“we”, “us” or “our”). These terms apply whenever you browse our website, contact our team, or request help from Resham. By using this page, you agree to the terms that apply to the service you choose.
          </p>
          <div className="hidden space-y-3 md:block">
            {terms.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </section>

        <PriceAction className="mx-auto mt-[25px] w-full md:hidden" />
        <PriceAction className="ml-[46px] mt-10 hidden w-[389px] max-w-[calc(100%-92px)] md:flex" />
      </div>
    </PageShell>
  );
}
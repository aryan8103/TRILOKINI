import type { Metadata } from "next";
import { CheckoutPageView } from "@/components/checkout-page";

export const metadata: Metadata = { title: "Checkout | Trilokini" };

import { Suspense } from "react";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center uppercase tracking-widest text-[13px] text-gray">Loading checkout...</div>}>
      <CheckoutPageView />
    </Suspense>
  );
}

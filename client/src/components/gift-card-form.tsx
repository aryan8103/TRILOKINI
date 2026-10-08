"use client";

import { useState } from "react";
import type { GiftCard } from "@/lib/types";

export function GiftCardForm({ card }: { card: GiftCard }) {
  const [amount, setAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <h1 className="text-[18px] font-semibold uppercase tracking-[0.03em] lg:text-[22px]">THE HAPPINESS GIFT CARD</h1>
      <p className="mt-3 max-w-[656px] text-[12px] leading-5 tracking-[0.02em] text-black lg:text-[16px] lg:leading-[26px]">
        Give a present in vogue... a Trilokini gift card. The trendy treat will arrive directly into your recipient&apos;s inbox - a solution to last minute present hunting. Plus, there&apos;s no shipping charge.
      </p>
      <form className="mt-5 flex max-w-[340px] flex-col gap-[18px] lg:mt-9" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
        <label className="sr-only" htmlFor="gift-card-value">Select Value</label>
        <select id="gift-card-value" required value={amount} onChange={(event) => setAmount(event.target.value)} className="h-[34px] w-full border border-[#757575]/60 bg-white px-[10px] text-[11px] text-[#757575] outline-none focus:border-black lg:text-[13px]">
          <option value="" disabled>Select Value</option>
          {card.amounts.map((value) => <option key={value} value={value}>Rs. {value.toLocaleString("en-IN")}</option>)}
        </select>
        <label className="sr-only" htmlFor="gift-card-sender">Your Name</label>
        <input id="gift-card-sender" required placeholder="Your Name" className="h-[34px] w-full border border-[#757575]/60 px-[10px] text-[11px] outline-none placeholder:text-[#757575] focus:border-black lg:text-[13px]" />
        <label className="sr-only" htmlFor="gift-card-recipient">Recipient&apos;s Name</label>
        <input id="gift-card-recipient" required placeholder="Recipient&apos;s Name" className="h-[34px] w-full border border-[#757575]/60 px-[10px] text-[11px] outline-none placeholder:text-[#757575] focus:border-black lg:text-[13px]" />
        <label className="sr-only" htmlFor="gift-card-email">Recipient&apos;s Email id</label>
        <input id="gift-card-email" type="email" required placeholder="Recipient&apos;s Email id" className="h-[34px] w-full border border-[#757575]/60 px-[10px] text-[11px] outline-none placeholder:text-[#757575] focus:border-black lg:text-[13px]" />
        <label className="sr-only" htmlFor="gift-card-whatsapp">Recipient&apos;s Whatsapp No.</label>
        <input id="gift-card-whatsapp" type="tel" placeholder="Recipient&apos;s Whatsapp No." className="h-[34px] w-full border border-[#757575]/60 px-[10px] text-[11px] outline-none placeholder:text-[#757575] focus:border-black lg:text-[13px]" />
        <label className="sr-only" htmlFor="gift-card-message">Message</label>
        <textarea id="gift-card-message" rows={2} placeholder="Message" className="h-[63px] w-full resize-none border border-[#757575]/60 px-[10px] py-[8px] text-[11px] outline-none placeholder:text-[#757575] focus:border-black lg:text-[13px]" />
        <button type="submit" className="mt-4 h-10 w-full bg-black text-[11px] font-semibold uppercase tracking-[0.03em] text-white hover:bg-gray-900 lg:text-[13px]">
          ADD TO CART
        </button>
        {submitted ? <p role="status" className="text-[12px] text-gray">Gift card order received.</p> : null}
      </form>
    </div>
  );
}

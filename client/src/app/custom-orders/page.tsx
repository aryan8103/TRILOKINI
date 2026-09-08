"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { FormPageLayout } from "@/components/templates/page-shell";
import { PageHeader } from "@/components/page-chrome";
import { addCustomOrderMessage, getCustomOrders } from "@/lib/api";
import { resolveImage } from "@/lib/images";
import { formatPrice } from "@/lib/services/products";
import type { CustomOrder } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  price_set: "Price Set",
  payment_pending: "Payment Pending",
  paid: "Paid",
  in_production: "In Production",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function CustomOrdersPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [mobile, setMobile] = useState(searchParams.get("mobile") || "");
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<CustomOrder | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !mobile) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await getCustomOrders({ email: email || undefined, mobile: mobile || undefined });
      const list = Array.isArray(data) ? data : [];
      setOrders(list);
      const orderNum = searchParams.get("order");
      if (orderNum) {
        const match = list.find((o) => o.orderNumber === orderNum);
        if (match) setSelected(match);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selected || !message.trim()) return;
    setSending(true);
    try {
      const updated = await addCustomOrderMessage(selected._id, { sender: "customer", text: message });
      setSelected(updated);
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      setMessage("");
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("email") || searchParams.get("mobile") || searchParams.get("order")) {
      handleSearch({ preventDefault: () => {} } as React.FormEvent);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormPageLayout>
      <PageHeader title="CUSTOM ORDERS" subtitle="Track your custom tailored orders and chat with our team." />

      <form className="mb-8 space-y-4" onSubmit={handleSearch}>
        <label className="block text-[13px] font-semibold">
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 h-11 w-full border border-gray-light px-3 text-[13px] outline-none focus:border-black" />
        </label>
        <label className="block text-[13px] font-semibold">
          Mobile Number
          <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} className="mt-2 h-11 w-full border border-gray-light px-3 text-[13px] outline-none focus:border-black" />
        </label>
        <button type="submit" disabled={loading} className="h-11 w-full border border-black bg-black text-[13px] font-semibold text-white disabled:opacity-50">
          {loading ? "SEARCHING..." : "VIEW CUSTOM ORDERS"}
        </button>
      </form>

      {searched && orders.length === 0 ? (
        <p className="text-[13px] text-gray">No custom orders found.</p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          {orders.map((order) => (
            <button
              key={order._id}
              type="button"
              onClick={() => setSelected(order)}
              className={`w-full border p-4 text-left text-[13px] transition-colors ${selected?._id === order._id ? "border-black" : "border-black/10 hover:border-black/30"}`}
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">{order.orderNumber}</p>
                <span className="text-gray">{STATUS_LABELS[order.status] || order.status}</span>
              </div>
              <p className="mt-1">{order.productTitle}</p>
              {order.finalPrice ? <p className="mt-1">{formatPrice(order.finalPrice)}</p> : <p className="mt-1 text-gray">Price pending</p>}
            </button>
          ))}
        </div>

        {selected ? (
          <div className="border border-black/10 p-6">
            <div className="flex gap-4">
              {selected.imageUrl ? (
                <div className="relative size-20 shrink-0 bg-gray-light">
                  <Image src={resolveImage(selected.imageUrl)} alt={selected.productTitle} fill className="object-cover" />
                </div>
              ) : null}
              <div>
                <h2 className="text-[14px] font-semibold uppercase tracking-[0.7px]">{selected.orderNumber}</h2>
                <p className="text-[12px] font-semibold uppercase">{selected.designerName}</p>
                <p className="text-[13px]">{selected.productTitle}</p>
                <p className="mt-1 text-[12px] text-gray">Status: {STATUS_LABELS[selected.status]}</p>
                {selected.finalPrice ? (
                  <p className="mt-2 text-[14px] font-semibold">{formatPrice(selected.finalPrice)}</p>
                ) : (
                  <p className="mt-2 text-[12px] text-gray">Awaiting price quote from our team</p>
                )}
              </div>
            </div>

            {selected.statusHistory?.length ? (
              <div className="mt-6">
                <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.6px]">Order Timeline</h3>
                <div className="space-y-2">
                  {selected.statusHistory.map((entry, i) => (
                    <div key={i} className="flex gap-3 text-[12px]">
                      <span className="font-medium">{STATUS_LABELS[entry.status] || entry.status}</span>
                      <span className="text-gray">{entry.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {selected.messages?.length ? (
              <div className="mt-6">
                <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.6px]">Chat</h3>
                <div className="max-h-[200px] space-y-2 overflow-y-auto border border-gray-light p-3">
                  {selected.messages.map((msg, i) => (
                    <div key={i} className={`text-[12px] ${msg.sender === "admin" ? "text-left" : "text-right"}`}>
                      <span className={`inline-block rounded px-2 py-1 ${msg.sender === "admin" ? "bg-gray-100" : "bg-black text-white"}`}>
                        {msg.text}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="h-10 flex-1 border border-gray-light px-3 text-[12px] outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={sending || !message.trim()}
                    className="h-10 border border-black bg-black px-4 text-[12px] font-semibold text-white disabled:opacity-50"
                  >
                    SEND
                  </button>
                </div>
              </div>
            ) : null}

            {selected.status === "price_set" && selected.paymentStatus === "pending" ? (
              <div className="mt-6 border border-gray-light p-4 text-center">
                <p className="text-[13px]">Your custom order price has been set.</p>
                <p className="mt-1 text-[12px] text-gray">Payment via Razorpay will be available after login.</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </FormPageLayout>
  );
}

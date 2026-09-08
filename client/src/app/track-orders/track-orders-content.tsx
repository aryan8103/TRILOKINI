"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { FormPageLayout } from "@/components/templates/page-shell";
import { PageHeader } from "@/components/page-chrome";
import { getOrders } from "@/lib/api";
import { resolveImage } from "@/lib/images";
import { formatPrice } from "@/lib/services/products";
import type { Order } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function TrackOrdersContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [mobile, setMobile] = useState(searchParams.get("mobile") || "");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<Order | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !mobile) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await getOrders({ email: email || undefined, mobile: mobile || undefined });
      setOrders(Array.isArray(data) ? data : []);
      const orderNum = searchParams.get("order");
      if (orderNum) {
        const match = (Array.isArray(data) ? data : []).find((o) => o.orderNumber === orderNum);
        if (match) setSelected(match);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("email") || searchParams.get("mobile")) {
      handleSearch({ preventDefault: () => {} } as React.FormEvent);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormPageLayout>
      <PageHeader title="TRACK YOUR ORDERS" subtitle="Enter your email or mobile number to view order status." />

      <form className="mb-8 space-y-4" onSubmit={handleSearch}>
        <label className="block text-[13px] font-semibold">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 h-11 w-full border border-gray-light px-3 text-[13px] outline-none focus:border-black"
          />
        </label>
        <label className="block text-[13px] font-semibold">
          Mobile Number
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="mt-2 h-11 w-full border border-gray-light px-3 text-[13px] outline-none focus:border-black"
          />
        </label>
        <button type="submit" disabled={loading} className="h-11 w-full border border-black bg-black text-[13px] font-semibold text-white disabled:opacity-50">
          {loading ? "SEARCHING..." : "TRACK ORDERS"}
        </button>
      </form>

      {searched && orders.length === 0 ? (
        <p className="text-[13px] text-gray">No orders found for the provided details.</p>
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
              <p className="mt-1 text-gray">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
              <p className="mt-1">{formatPrice(order.total)}</p>
            </button>
          ))}
        </div>

        {selected ? (
          <div className="border border-black/10 p-6">
            <h2 className="text-[14px] font-semibold uppercase tracking-[0.7px]">{selected.orderNumber}</h2>
            <p className="mt-1 text-[13px] text-gray">Status: {STATUS_LABELS[selected.status] || selected.status}</p>
            {selected.trackingNumber ? (
              <p className="mt-1 text-[13px]">Tracking: {selected.trackingNumber}</p>
            ) : null}

            <div className="mt-6 space-y-4">
              {selected.items.map((item, i) => (
                <div key={i} className="flex gap-3 border-b border-gray-light pb-4">
                  {item.imageUrl ? (
                    <div className="relative size-16 shrink-0 bg-gray-light">
                      <Image src={resolveImage(item.imageUrl)} alt={item.productTitle} fill className="object-cover" />
                    </div>
                  ) : null}
                  <div>
                    <p className="text-[12px] font-semibold uppercase">{item.designerName}</p>
                    <p className="text-[13px]">{item.productTitle}</p>
                    <p className="text-[12px] text-gray">Size: {item.size}{item.bottomSize ? ` / Bottom: ${item.bottomSize}` : ""}</p>
                    <p className="text-[13px]">{formatPrice(item.lineTotal)}</p>
                  </div>
                </div>
              ))}
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

            <div className="mt-6 border-t border-gray-light pt-4 text-[13px]">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(selected.subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(selected.shipping)}</span></div>
              <div className="mt-2 flex justify-between font-semibold"><span>Total</span><span>{formatPrice(selected.total)}</span></div>
            </div>
          </div>
        ) : null}
      </div>
    </FormPageLayout>
  );
}

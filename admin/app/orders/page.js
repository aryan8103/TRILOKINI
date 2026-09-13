"use client";
import { useState, useEffect } from "react";
import { getOrders, updateOrderStatus } from "../../api";
import DataTable from "../../components/DataTable";
import { PageToolbar, Pill } from "../../components/ui";
import { X } from "lucide-react";

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try { setOrders((await getOrders()).data || []); } catch (error) { console.error(error); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, { status, note: `Status updated to ${status}` });
      const res = await getOrders();
      setOrders(res.data || []);
      setSelected((res.data || []).find((o) => o._id === id) || null);
    } catch (error) { console.error(error); }
  };

  const columns = [
    { key: "orderNumber", label: "Order #", render: (val) => <span className="font-medium text-white">{val}</span> },
    { key: "customerEmail", label: "Customer", render: (val, row) => <div><p>{val}</p><p className="text-xs" style={{ color: "var(--text-muted)" }}>{row.customerMobile}</p></div> },
    { key: "total", label: "Total", render: (val) => `₹${val?.toLocaleString("en-IN")}` },
    { key: "status", label: "Status", render: (val) => <Pill>{val}</Pill> },
    { key: "paymentStatus", label: "Payment", render: (val) => <Pill tone={val === "paid" ? "yes" : "warn"}>{val}</Pill> },
    { key: "createdAt", label: "Date", render: (val) => new Date(val).toLocaleDateString("en-IN") },
  ];

  return (
    <div className="space-y-6">
      <PageToolbar title="Orders" description="Ready-to-wear purchases and fulfilment." />
      <DataTable columns={columns} data={orders} onEdit={(row) => setSelected(row)} />

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="relative w-full max-w-lg rounded-2xl p-6" style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }} onClick={(e) => e.stopPropagation()}>
            <button className="absolute right-4 top-4" style={{ color: "var(--text-muted)" }} onClick={() => setSelected(null)}><X size={18} /></button>
            <p className="text-xs uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>Order detail</p>
            <h3 className="mt-1 text-xl font-semibold text-white">{selected.orderNumber}</h3>
            <div className="mt-5 space-y-3 text-sm" style={{ color: "var(--text-muted)" }}>
              <p>{selected.customerEmail} · {selected.customerMobile}</p>
              <p className="text-white">₹{selected.total?.toLocaleString("en-IN")}</p>
              {selected.trackingNumber ? <p>Tracking: {selected.trackingNumber}</p> : null}
              <div className="rounded-xl p-3" style={{ background: "var(--input-bg)" }}>
                {selected.items?.map((item, i) => (
                  <p key={i} className="py-1">{item.productTitle} — {item.size} — ₹{item.lineTotal}</p>
                ))}
              </div>
              <label className="block text-white">Update status</label>
              <select value={selected.status} onChange={(e) => handleStatusChange(selected._id, e.target.value)} className="admin-input">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

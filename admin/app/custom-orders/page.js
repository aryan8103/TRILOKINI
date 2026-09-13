"use client";
import { useState, useEffect } from "react";
import { getCustomOrders, setCustomOrderPrice, addCustomOrderMessage, updateCustomOrderStatus } from "../../api";
import DataTable from "../../components/DataTable";
import { PageToolbar, Pill } from "../../components/ui";
import { X } from "lucide-react";

const STATUS_OPTIONS = ["submitted", "under_review", "price_set", "payment_pending", "paid", "in_production", "shipped", "delivered", "cancelled"];

const MEASUREMENT_LABELS = {
  shoulder: "Shoulder", bust: "Bust", underBust: "Under Bust", armHole: "Arm Hole",
  sleeveLength: "Sleeve Length", bicep: "Bicep", elbow: "Elbow", wrist: "Wrist",
  waist: "Waist", lowerWaist: "Lower Waist", hip: "Hip",
  topLength: "Top Length", bottomLength: "Bottom Length", kurtaLength: "Kurta Length",
  frontNeckDepth: "Front Neck Depth", backNeckDepth: "Back Neck Depth",
  crotchLength: "Crotch Length", thighCircumference: "Thigh Circumference",
  kneeCircumference: "Knee Circumference", calfCircumference: "Calf Circumference",
  ankleCircumference: "Ankle Circumference",
};

export default function CustomOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try { setOrders((await getCustomOrders()).data || []); } catch (error) { console.error(error); }
  };

  const refreshSelected = async (id) => {
    const res = await getCustomOrders();
    setOrders(res.data || []);
    setSelected((res.data || []).find((o) => o._id === id) || null);
  };

  const handleSetPrice = async () => {
    if (!selected || !price) return;
    await setCustomOrderPrice(selected._id, { quotedPrice: Number(price), note: `Price set to ₹${Number(price).toLocaleString("en-IN")}` });
    setPrice("");
    await refreshSelected(selected._id);
  };

  const handleSendMessage = async () => {
    if (!selected || !message.trim()) return;
    await addCustomOrderMessage(selected._id, { sender: "admin", text: message });
    setMessage("");
    await refreshSelected(selected._id);
  };

  const columns = [
    { key: "orderNumber", label: "Order #", render: (val) => <span className="font-medium text-white">{val}</span> },
    { key: "productTitle", label: "Product", render: (val, row) => <div><p className="font-medium text-white">{val}</p><p className="text-xs" style={{ color: "var(--text-muted)" }}>{row.designerName}</p></div> },
    { key: "customerEmail", label: "Customer", render: (val, row) => <div><p>{val}</p><p className="text-xs" style={{ color: "var(--text-muted)" }}>{row.customerMobile}</p></div> },
    { key: "finalPrice", label: "Price", render: (val) => val ? `₹${val.toLocaleString("en-IN")}` : <span style={{ color: "var(--text-muted)" }}>Pending</span> },
    { key: "status", label: "Status", render: (val) => <Pill>{val?.replace(/_/g, " ")}</Pill> },
    { key: "createdAt", label: "Date", render: (val) => new Date(val).toLocaleDateString("en-IN") },
  ];

  return (
    <div className="space-y-6">
      <PageToolbar title="Custom orders" description="Measurements, chat and quoted pricing." />
      <DataTable columns={columns} data={orders} onEdit={(row) => setSelected(row)} />

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6" style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }} onClick={(e) => e.stopPropagation()}>
            <button className="absolute right-4 top-4" style={{ color: "var(--text-muted)" }} onClick={() => setSelected(null)}><X size={18} /></button>
            <p className="text-xs uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>Custom order</p>
            <h3 className="mt-1 text-xl font-semibold text-white">{selected.orderNumber}</h3>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{selected.productTitle} — {selected.designerName}</p>

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl p-4 text-xs" style={{ background: "var(--input-bg)", color: "var(--text-muted)" }}>
              {Object.entries(selected.measurements || {}).filter(([, v]) => v).map(([key, val]) => (
                <p key={key}><span className="text-white">{MEASUREMENT_LABELS[key] || key}:</span> {val} {selected.unit}</p>
              ))}
            </div>

            <div className="mt-4 max-h-40 space-y-2 overflow-y-auto rounded-xl p-3" style={{ background: "var(--input-bg)" }}>
              {(selected.messages || []).map((msg, i) => (
                <p key={i} className={`text-sm ${msg.sender === "admin" ? "text-right" : ""}`}>
                  <span className="text-xs uppercase" style={{ color: "var(--text-muted)" }}>{msg.sender}</span>
                  <span className="ml-2 text-white">{msg.text}</span>
                </p>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message the customer" className="admin-input" />
              <button onClick={handleSendMessage} className="admin-btn-primary">Send</button>
            </div>
            <div className="mt-3 flex gap-2">
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Quoted price (₹)" className="admin-input" />
              <button onClick={handleSetPrice} className="admin-btn-primary">Set price</button>
            </div>
            <select value={selected.status} onChange={(e) => updateCustomOrderStatus(selected._id, { status: e.target.value, note: `Status updated to ${e.target.value}` }).then(() => refreshSelected(selected._id))} className="admin-input mt-3">
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
            </select>
          </div>
        </div>
      ) : null}
    </div>
  );
}

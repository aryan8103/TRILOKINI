"use client";
import { useState, useEffect } from "react";
import { getCustomOrders, setCustomOrderPrice, addCustomOrderMessage, updateCustomOrderStatus } from "../../api";
import DataTable from "../../components/DataTable";

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
    try {
      const res = await getCustomOrders();
      setOrders(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetPrice = async () => {
    if (!selected || !price) return;
    try {
      await setCustomOrderPrice(selected._id, { quotedPrice: Number(price), note: `Price set to ₹${Number(price).toLocaleString("en-IN")}` });
      fetchOrders();
      setPrice("");
      const res = await getCustomOrders();
      const updated = (res.data || []).find((o) => o._id === selected._id);
      setSelected(updated);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async () => {
    if (!selected || !message.trim()) return;
    try {
      await addCustomOrderMessage(selected._id, { sender: "admin", text: message });
      setMessage("");
      const res = await getCustomOrders();
      const updated = (res.data || []).find((o) => o._id === selected._id);
      setSelected(updated);
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (status) => {
    if (!selected) return;
    try {
      await updateCustomOrderStatus(selected._id, { status, note: `Status updated to ${status}` });
      fetchOrders();
      const res = await getCustomOrders();
      const updated = (res.data || []).find((o) => o._id === selected._id);
      setSelected(updated);
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { key: "orderNumber", label: "Order #", render: (val) => <span className="font-medium">{val}</span> },
    { key: "productTitle", label: "Product", render: (val, row) => <div><p className="font-medium">{val}</p><p className="text-xs text-gray-500">{row.designerName}</p></div> },
    { key: "customerEmail", label: "Customer", render: (val, row) => <div><p>{val}</p><p className="text-xs text-gray-500">{row.customerMobile}</p></div> },
    { key: "finalPrice", label: "Price", render: (val) => val ? `₹${val.toLocaleString("en-IN")}` : <span className="text-gray-400">Pending</span> },
    { key: "status", label: "Status", render: (val) => (
      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 capitalize">{val?.replace(/_/g, " ")}</span>
    )},
    { key: "createdAt", label: "Date", render: (val) => new Date(val).toLocaleDateString("en-IN") },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-gray-800">Custom Tailored Orders</h2>

      <DataTable columns={columns} data={orders} onEdit={(row) => setSelected(row)} />

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-2">{selected.orderNumber}</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{selected.productTitle} — {selected.designerName}</p>

            <div className="grid grid-cols-2 gap-2 mb-4 text-xs" style={{ color: 'var(--text-muted)' }}>
              {Object.entries(selected.measurements || {}).filter(([, v]) => v).map(([key, val]) => (
                <p key={key}>{MEASUREMENT_LABELS[key] || key}: {val} {selected.unit}</p>
              ))}
            </div>

            {selected.messages?.length > 0 && (
              <div className="mb-4 max-h-32 overflow-y-auto border rounded-lg p-3" style={{ borderColor: 'var(--border-color)' }}>
                {selected.messages.map((msg, i) => (
                  <p key={i} className={`text-xs mb-1 ${msg.sender === 'admin' ? 'text-right' : ''}`} style={{ color: 'var(--text-muted)' }}>
                    <span className="font-medium">{msg.sender}:</span> {msg.text}
                  </p>
                ))}
              </div>
            )}

            <div className="flex gap-2 mb-4">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Send message to customer..."
                className="flex-1 px-3 py-2 rounded-lg text-sm"
                style={{ background: '#0f0f0f', border: '1px solid var(--border-color)', color: 'white' }}
              />
              <button onClick={handleSendMessage} className="px-4 py-2 rounded-lg text-sm text-white" style={{ background: 'var(--primary-teal)' }}>Send</button>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Set quoted price (₹)"
                className="flex-1 px-3 py-2 rounded-lg text-sm"
                style={{ background: '#0f0f0f', border: '1px solid var(--border-color)', color: 'white' }}
              />
              <button onClick={handleSetPrice} className="px-4 py-2 rounded-lg text-sm text-white" style={{ background: 'var(--primary-teal)' }}>Set Price</button>
            </div>

            <select
              value={selected.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm mb-4"
              style={{ background: '#0f0f0f', border: '1px solid var(--border-color)', color: 'white' }}
            >
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
            </select>

            <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-lg bg-gray-700 text-white text-sm">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

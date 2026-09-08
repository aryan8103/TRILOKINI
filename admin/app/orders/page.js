"use client";
import { useState, useEffect } from "react";
import { getOrders, updateOrderStatus } from "../../api";
import DataTable from "../../components/DataTable";

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, { status, note: `Status updated to ${status}` });
      fetchOrders();
      if (selected?._id === id) {
        const res = await getOrders();
        const updated = (res.data || []).find((o) => o._id === id);
        setSelected(updated);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { key: "orderNumber", label: "Order #", render: (val) => <span className="font-medium">{val}</span> },
    { key: "customerEmail", label: "Customer", render: (val, row) => <div><p>{val}</p><p className="text-xs text-gray-500">{row.customerMobile}</p></div> },
    { key: "total", label: "Total", render: (val) => `₹${val?.toLocaleString("en-IN")}` },
    { key: "status", label: "Status", render: (val) => (
      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">{val}</span>
    )},
    { key: "paymentStatus", label: "Payment", render: (val) => (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${val === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{val}</span>
    )},
    { key: "createdAt", label: "Date", render: (val) => new Date(val).toLocaleDateString("en-IN") },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-gray-800">Orders</h2>

      <DataTable
        columns={columns}
        data={orders}
        onEdit={(row) => setSelected(row)}
      />

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="relative w-full max-w-lg rounded-2xl p-6 shadow-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">{selected.orderNumber}</h3>
            <div className="space-y-3 text-sm" style={{ color: 'var(--text-muted)' }}>
              <p>Customer: {selected.customerEmail} / {selected.customerMobile}</p>
              <p>Total: ₹{selected.total?.toLocaleString("en-IN")}</p>
              <p>Payment: {selected.paymentStatus}</p>
              {selected.trackingNumber && <p>Tracking: {selected.trackingNumber}</p>}
              <div>
                <p className="font-medium text-white mb-2">Items:</p>
                {selected.items?.map((item, i) => (
                  <p key={i}>{item.productTitle} — {item.size} — ₹{item.lineTotal}</p>
                ))}
              </div>
              <div>
                <label className="block text-white mb-1">Update Status</label>
                <select
                  value={selected.status}
                  onChange={(e) => handleStatusChange(selected._id, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: '#0f0f0f', border: '1px solid var(--border-color)', color: 'white' }}
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="mt-4 px-4 py-2 rounded-lg bg-gray-700 text-white text-sm">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

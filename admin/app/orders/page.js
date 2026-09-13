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
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6" style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }} onClick={(e) => e.stopPropagation()}>
            <button className="absolute right-4 top-4" style={{ color: "var(--text-muted)" }} onClick={() => setSelected(null)}><X size={18} /></button>
            <p className="text-xs uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>Order detail</p>
            <h3 className="mt-1 text-2xl font-semibold text-white">{selected.orderNumber}</h3>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Customer Information</h4>
                <div className="text-sm space-y-1" style={{ color: "var(--text-muted)" }}>
                  <p>{selected.customerName || "Guest"}</p>
                  <p>{selected.customerEmail}</p>
                  <p>{selected.customerMobile}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-white mb-2">Order Information</h4>
                <div className="text-sm space-y-1" style={{ color: "var(--text-muted)" }}>
                  <p>Date: {new Date(selected.createdAt).toLocaleString("en-IN")}</p>
                  <p>Payment: <span className="uppercase text-white">{selected.paymentStatus}</span></p>
                  {selected.razorpayPaymentId && <p>Razorpay ID: <span className="text-white">{selected.razorpayPaymentId}</span></p>}
                  {selected.trackingNumber && <p>Tracking: <span className="text-white">{selected.trackingNumber}</span></p>}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-sm font-medium text-white mb-4">Items</h4>
              <div className="space-y-4">
                {selected.items?.map((item, i) => (
                  <div key={i} className="rounded-xl p-4 border" style={{ background: "var(--input-bg)", borderColor: "var(--border-color)" }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium">{item.productTitle}</p>
                        {item.designerName && <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Designer: {item.designerName}</p>}
                        <div className="mt-3 text-sm space-y-1" style={{ color: "var(--text-muted)" }}>
                          <p>Size: <span className="text-white">{item.size}</span></p>
                          {item.bottomSize && <p>Bottom Size: <span className="text-white">{item.bottomSize}</span></p>}
                          {item.color && <p>Color: <span className="text-white">{item.color}</span></p>}
                        </div>
                        {item.addons?.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Addons:</p>
                            <ul className="text-xs space-y-1">
                              {item.addons.map((addon, j) => (
                                <li key={j} className="text-white flex items-center gap-2">
                                  <span className="w-1 h-1 rounded-full bg-white opacity-50"></span>
                                  {addon.name} ({addon.size}): ₹{addon.price}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">₹{item.lineTotal?.toLocaleString("en-IN")}</p>
                        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Qty: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t pt-4" style={{ borderColor: "var(--border-color)" }}>
              <div className="flex justify-between text-sm mb-2" style={{ color: "var(--text-muted)" }}>
                <p>Subtotal</p>
                <p>₹{selected.subtotal?.toLocaleString("en-IN")}</p>
              </div>
              <div className="flex justify-between text-sm mb-2" style={{ color: "var(--text-muted)" }}>
                <p>Shipping</p>
                <p>₹{selected.shipping?.toLocaleString("en-IN")}</p>
              </div>
              {selected.discount > 0 && (
                <div className="flex justify-between text-sm mb-2 text-green-400">
                  <p>Discount</p>
                  <p>-₹{selected.discount?.toLocaleString("en-IN")}</p>
                </div>
              )}
              <div className="flex justify-between text-lg font-medium text-white mt-4 pt-4 border-t" style={{ borderColor: "var(--border-color)" }}>
                <p>Total</p>
                <p>₹{selected.total?.toLocaleString("en-IN")}</p>
              </div>
            </div>

            <div className="mt-8 border-t pt-6" style={{ borderColor: "var(--border-color)" }}>
              <label className="block text-white mb-3 font-medium">Update Status</label>
              <select value={selected.status} onChange={(e) => handleStatusChange(selected._id, e.target.value)} className="admin-input w-full md:w-1/2">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="uppercase">{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

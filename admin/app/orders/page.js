"use client";
import { useState, useEffect } from "react";
import { getOrders, updateOrderStatus } from "../../api";
import DataTable from "../../components/DataTable";
import { PageToolbar, Pill } from "../../components/ui";
import { X, Package, User, CreditCard, MapPin, Tag, ChevronRight, CheckCircle, Clock, Truck, XCircle } from "lucide-react";

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const STATUS_COLORS = {
  pending: { bg: "#2a2a1a", border: "#6b5a00", text: "#facc15", dot: "#facc15" },
  confirmed: { bg: "#0f2a1a", border: "#064e3b", text: "#34d399", dot: "#34d399" },
  processing: { bg: "#1a1a2a", border: "#1e1b4b", text: "#818cf8", dot: "#818cf8" },
  shipped: { bg: "#0f1e2a", border: "#0c4a6e", text: "#38bdf8", dot: "#38bdf8" },
  delivered: { bg: "#0a1f0a", border: "#14532d", text: "#4ade80", dot: "#4ade80" },
  cancelled: { bg: "#2a0a0a", border: "#7f1d1d", text: "#f87171", dot: "#f87171" },
};

const PAYMENT_COLORS = {
  paid: { bg: "#0f2a1a", border: "#064e3b", text: "#34d399" },
  pending: { bg: "#2a2a1a", border: "#6b5a00", text: "#facc15" },
  failed: { bg: "#2a0a0a", border: "#7f1d1d", text: "#f87171" },
  refunded: { bg: "#1a1a2a", border: "#1e1b4b", text: "#818cf8" },
};

function StatusBadge({ value }) {
  const s = STATUS_COLORS[value] || STATUS_COLORS.pending;
  return (
    <span style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text, padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block", boxShadow: `0 0 6px ${s.dot}` }} />
      {value}
    </span>
  );
}

function PaymentBadge({ value }) {
  const p = PAYMENT_COLORS[value] || PAYMENT_COLORS.pending;
  return (
    <span style={{ background: p.bg, border: `1px solid ${p.border}`, color: p.text, padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
      {value}
    </span>
  );
}

function InfoRow({ label, value, mono }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, flexShrink: 0 }}>{label}</span>
      <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, textAlign: "right", fontFamily: mono ? "monospace" : "inherit", wordBreak: "break-all" }}>{value}</span>
    </div>
  );
}

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
    { key: "status", label: "Status", render: (val) => <StatusBadge value={val} /> },
    { key: "paymentStatus", label: "Payment", render: (val) => <PaymentBadge value={val} /> },
    { key: "createdAt", label: "Date", render: (val) => new Date(val).toLocaleDateString("en-IN") },
  ];

  return (
    <div className="space-y-6">
      <PageToolbar title="Orders" description="Ready-to-wear purchases and fulfilment." />
      <DataTable columns={columns} data={orders} onEdit={(row) => setSelected(row)} />

      {selected && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{ position: "relative", width: "100%", maxWidth: 680, maxHeight: "92vh", overflowY: "auto", borderRadius: 20, background: "#0d0d0f", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 120px rgba(0,0,0,0.8)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: "28px 32px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", position: "sticky", top: 0, background: "#0d0d0f", zIndex: 10, borderRadius: "20px 20px 0 0" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6 }}>Order Detail</p>
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.01em", marginBottom: 10 }}>{selected.orderNumber}</h2>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <StatusBadge value={selected.status} />
                    <PaymentBadge value={selected.paymentStatus} />
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  style={{ padding: 8, borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", cursor: "pointer", flexShrink: 0, transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Info Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* Customer */}
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 18, border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <div style={{ padding: 7, borderRadius: 9, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}>
                      <User size={14} color="#818cf8" />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Customer</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{selected.customerName || "Guest"}</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{selected.customerEmail}</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{selected.customerMobile}</p>
                  </div>
                </div>

                {/* Order Info */}
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 18, border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <div style={{ padding: 7, borderRadius: 9, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)" }}>
                      <CreditCard size={14} color="#34d399" />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Payment</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{new Date(selected.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                    {selected.razorpayPaymentId && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", wordBreak: "break-all" }}>{selected.razorpayPaymentId}</p>}
                    {selected.trackingNumber && <p style={{ fontSize: 12, color: "#60a5fa" }}>Tracking: {selected.trackingNumber}</p>}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ padding: 7, borderRadius: 9, background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.25)" }}>
                    <Package size={14} color="#fbbf24" />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Items ({selected.items?.length})</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {selected.items?.map((item, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{item.productTitle}</p>
                          {item.designerName && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>by {item.designerName}</p>}

                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                            {item.size && (
                              <span style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "3px 10px", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                                Size: <strong style={{ color: "#fff" }}>{item.size}</strong>
                              </span>
                            )}
                            {item.bottomSize && (
                              <span style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "3px 10px", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                                Bottom: <strong style={{ color: "#fff" }}>{item.bottomSize}</strong>
                              </span>
                            )}
                            {item.color && (
                              <span style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "3px 10px", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                                Color: <strong style={{ color: "#fff" }}>{item.color}</strong>
                              </span>
                            )}
                          </div>

                          {item.addons?.length > 0 && (
                            <div style={{ marginTop: 12 }}>
                              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Add-ons</p>
                              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                {item.addons.map((addon, j) => (
                                  <div key={j} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                                    <span style={{ color: "rgba(255,255,255,0.55)" }}>{addon.name} {addon.size ? `(${addon.size})` : ""}</span>
                                    <span style={{ color: "rgba(255,255,255,0.8)" }}>+₹{addon.price?.toLocaleString("en-IN")}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <p style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>₹{item.lineTotal?.toLocaleString("en-IN")}</p>
                          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>Qty {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Subtotal</span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>₹{selected.subtotal?.toLocaleString("en-IN")}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Shipping</span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{selected.shipping === 0 ? "Free" : `₹${selected.shipping?.toLocaleString("en-IN")}`}</span>
                  </div>
                  {selected.discount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ fontSize: 13, color: "#4ade80" }}>Discount</span>
                      <span style={{ fontSize: 13, color: "#4ade80" }}>-₹{selected.discount?.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 4px" }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Total</span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>₹{selected.total?.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Update Status */}
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Update Order Status</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {STATUS_OPTIONS.filter(s => s !== "pending").map((s) => {
                    const sc = STATUS_COLORS[s];
                    const isActive = selected.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(selected._id, s)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 10,
                          border: `1px solid ${isActive ? sc.border : "rgba(255,255,255,0.1)"}`,
                          background: isActive ? sc.bg : "rgba(255,255,255,0.04)",
                          color: isActive ? sc.text : "rgba(255,255,255,0.5)",
                          fontSize: 13,
                          fontWeight: isActive ? 600 : 400,
                          cursor: "pointer",
                          textTransform: "capitalize",
                          transition: "all 0.2s",
                          letterSpacing: "0.03em",
                        }}
                        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = sc.bg; e.currentTarget.style.color = sc.text; e.currentTarget.style.borderColor = sc.border; }}}
                        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}}
                      >
                        {isActive && "✓ "}{s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

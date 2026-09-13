"use client";
import { useState, useEffect } from "react";
import StatCard from "../components/StatCard";
import { PageToolbar } from "../components/ui";
import { Box, ShoppingBag, Users, Image as ImageIcon, ArrowRight, Activity, ListOrdered, Package, Scissors } from "lucide-react";
import Link from "next/link";
import { getCategories, getProducts, getDesigners, getHeroBanners, getOrders, getCustomOrders } from "../api";

export default function AdminHome() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    customOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, catRes, desRes, banRes, orderRes, customRes] = await Promise.all([
          getProducts().catch(() => ({ data: [] })),
          getCategories().catch(() => ({ data: [] })),
          getDesigners().catch(() => ({ data: [] })),
          getHeroBanners().catch(() => ({ data: [] })),
          getOrders().catch(() => ({ data: [] })),
          getCustomOrders().catch(() => ({ data: [] })),
        ]);

        const orders = orderRes.data || [];
        setStats({
          products: prodRes.data?.length || 0,
          categories: catRes.data?.length || 0,
          orders: orders.length,
          customOrders: customRes.data?.length || 0,
        });
        setRecentOrders(orders.slice(0, 6));
        void desRes;
        void banRes;
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <PageToolbar title="Dashboard" description="Catalog and order snapshot." />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Products" value={loading ? "…" : stats.products} icon={ShoppingBag} subtitle="In catalog" />
        <StatCard title="Categories" value={loading ? "…" : stats.categories} icon={Box} subtitle="Storefront groups" />
        <StatCard title="Orders" value={loading ? "…" : stats.orders} icon={Package} subtitle="Ready-to-wear" />
        <StatCard title="Custom orders" value={loading ? "…" : stats.customOrders} icon={Scissors} subtitle="Awaiting quote or production" />
      </div>

      <div className="grid grid-cols-1 gap-6 pt-2 lg:grid-cols-2">
        <div className="page-card min-h-[380px]">
          <div className="mb-6 flex items-center gap-2">
            <Activity size={20} className="text-[var(--primary)]" />
            <h3 className="text-lg font-medium text-white">Quick actions</h3>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { title: "Products", icon: ShoppingBag, href: "/products" },
              { title: "Categories", icon: Box, href: "/categories" },
              { title: "Hero banners", icon: ImageIcon, href: "/hero-banners" },
              { title: "Designers", icon: Users, href: "/designers" },
              { title: "Orders", icon: Package, href: "/orders" },
              { title: "Custom orders", icon: Scissors, href: "/custom-orders" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center justify-between rounded-xl p-4 bg-[var(--input-bg)] border border-[var(--border-color)] hover:border-[var(--primary)] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg p-2 bg-[rgba(124,109,250,0.1)]">
                    <action.icon size={18} className="text-[var(--primary)]" />
                  </div>
                  <span className="font-medium text-white">{action.title}</span>
                </div>
                <ArrowRight size={16} className="text-[var(--text-muted)] group-hover:translate-x-1 group-hover:text-white transition-all" />
              </Link>
            ))}
          </div>
        </div>

        <div className="page-card flex flex-col min-h-[380px]">
          <div className="mb-6 flex items-center gap-2">
            <ListOrdered size={20} className="text-[var(--primary)]" />
            <h3 className="text-lg font-medium text-white">Recent orders</h3>
          </div>
          {recentOrders.length === 0 ? (
            <p className="flex flex-1 items-center justify-center text-[var(--text-muted)]">
              {loading ? "Loading…" : "No orders yet"}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between rounded-xl p-4 bg-[var(--input-bg)] border border-[var(--border-color)]">
                  <div>
                    <p className="text-sm font-medium text-white">{order.orderNumber}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{order.customerEmail}</p>
                  </div>
                  <p className="text-sm font-medium text-white">₹{order.total?.toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

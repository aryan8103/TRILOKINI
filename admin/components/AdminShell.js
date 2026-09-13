"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Box, ShoppingBag, ImageIcon, Package, Scissors, 
  Users, Star, Heart, Bookmark, Layers, Images, Menu, X, LogOut
} from "lucide-react";

const navGroups = [
  {
    label: "MAIN",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Categories", href: "/categories", icon: Box },
      { name: "Products", href: "/products", icon: ShoppingBag },
      { name: "Hero Banners", href: "/hero-banners", icon: ImageIcon },
    ]
  },
  {
    label: "ORDERS",
    items: [
      { name: "Orders", href: "/orders", icon: Package },
      { name: "Custom Orders", href: "/custom-orders", icon: Scissors },
    ]
  },
  {
    label: "CONTENT",
    items: [
      { name: "Designers", href: "/designers", icon: Users },
      { name: "Celebrities", href: "/celebrities", icon: Star },
      { name: "Wedding Studio", href: "/wedding", icon: Heart },
      { name: "Favourites", href: "/favourites", icon: Bookmark },
      { name: "Collections", href: "/collections", icon: Layers },
      { name: "Collection Images", href: "/collection-images", icon: Images },
    ]
  }
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard";
    const path = pathname.split("/")[1];
    return path ? path.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Dashboard";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] w-[240px]">
      <div className="px-5 py-5 border-b border-[var(--border-color)]">
        <h1 className="text-lg font-bold tracking-widest text-[var(--primary)]">TRILOKINI</h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">Admin Panel</p>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar py-4 px-3 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] px-4 mt-4 mb-1 font-semibold">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`sidebar-item ${isActive ? "sidebar-item-active" : ""}`}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <SidebarContent />
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden" 
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-[var(--border-color)] flex items-center justify-between px-4 md:px-8 bg-[var(--sidebar-bg)] md:bg-transparent">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-[var(--text-muted)] hover:text-white" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
            <h2 className="text-sm font-semibold text-white hidden md:block">{getPageTitle()}</h2>
            <h2 className="text-sm font-semibold text-white md:hidden">TRILOKINI</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[var(--text-muted)] hidden sm:block">Admin</span>
            <button className="p-2 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-6 bg-[var(--background)] custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}

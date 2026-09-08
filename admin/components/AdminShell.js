"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Box, 
  ShoppingBag,
  Users, 
  Star,
  Heart,
  Bookmark,
  Layers,
  Images,
  Menu,
  X,
  Moon,
  LogOut,
  Settings,
  Package,
  Scissors
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  // { name: "Hero Banners", href: "/hero-banners", icon: ImageIcon },
  { name: "Categories", href: "/categories", icon: Box },
  { name: "Products", href: "/products", icon: ShoppingBag },
  { name: "Orders", href: "/orders", icon: Package },
  { name: "Custom Orders", href: "/custom-orders", icon: Scissors },
  { name: "Designers", href: "/designers", icon: Users },
  { name: "Celebrities", href: "/celebrities", icon: Star },
  { name: "Wedding Studio", href: "/wedding", icon: Heart },
  { name: "Favourites", href: "/favourites", icon: Bookmark },
  { name: "Collections", href: "/collections", icon: Layers },
  { name: "Collection Images", href: "/collection-images", icon: Images },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3" style={{ background: 'var(--card-bg)' }}>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold tracking-widest" style={{ color: 'var(--primary-teal)' }}>TRILOKINI</h1>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Superadmin</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ color: 'white' }}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay (mobile) */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-20" 
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 fixed md:relative z-30 md:z-0
          flex flex-col h-full transition-transform duration-300
        `}
        style={{ width: '260px', minWidth: '260px', background: 'var(--card-bg)', color: '#9ca3af', borderRight: '1px solid var(--border-color)' }}
      >
        {/* Logo */}
        <div className="hidden md:flex flex-col justify-center py-6 px-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-1.5 rounded-md" style={{ border: '1px solid var(--border-color)' }}>
              <Settings size={20} style={{ color: 'var(--primary-teal)' }} />
            </div>
            <h1 className="text-xl font-bold tracking-widest" style={{ color: 'var(--primary-teal)' }}>
              TRILOKINI
            </h1>
          </div>
          <span className="text-sm pl-[38px]" style={{ color: 'var(--text-muted)' }}>Superadmin</span>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              
              return (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: '500',
                    background: isActive ? 'var(--primary-teal)' : 'transparent',
                    color: isActive ? '#000000' : 'var(--foreground)',
                  }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.color = 'var(--primary-teal)'; } }}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.color = 'var(--foreground)'; } }}
                >
                  <Icon size={20} strokeWidth={2} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between shrink-0" style={{ height: '72px', padding: '0 32px' }}>
          <div className="flex items-center gap-2">
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
              {pathname === '/' ? 'Dashboard' : pathname.split('/').filter(Boolean).join(' ').replaceAll('-', ' ')}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <button style={{ color: 'var(--foreground)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-teal)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--foreground)'}>
              <Moon size={20} />
            </button>
            <button style={{ color: 'var(--foreground)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-teal)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--foreground)'}>
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '0 32px 32px 32px', paddingTop: '24px' }}>
          <div className="md:hidden" style={{ height: '56px' }} />
          {children}
        </div>
      </div>
    </div>
  );
}

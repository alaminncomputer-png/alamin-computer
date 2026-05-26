"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Star,
  Tag, BarChart2, Settings, LogOut, Menu, X, ChevronRight
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, loadUser, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadUser().then(() => {
      const u = useAuthStore.getState().user;
      if (!u || u.role !== "admin") router.push("/auth/login");
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-cyan text-xl font-head font-bold animate-pulse">Loading Admin...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 h-screen w-64 bg-[rgba(8,15,28,0.98)] border-r border-[rgba(26,107,255,0.15)] flex flex-col z-50 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Logo */}
        <div className="p-5 border-b border-[rgba(26,107,255,0.15)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-3 to-blue rounded-lg flex items-center justify-center text-lg">💻</div>
            <div>
              <p className="font-head font-bold text-white text-sm">ALAMIN</p>
              <p className="text-cyan text-[10px] font-semibold tracking-wider uppercase">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <p className="text-muted-2 text-[10px] font-semibold tracking-widest uppercase px-3 mb-2 mt-2">Main Menu</p>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-all ${
                  active
                    ? "bg-blue text-white shadow-[0_0_15px_rgba(26,107,255,0.3)]"
                    : "text-muted hover:text-text hover:bg-[rgba(26,107,255,0.1)]"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
                {active && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User / logout */}
        <div className="p-4 border-t border-[rgba(26,107,255,0.15)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-3 border border-blue flex items-center justify-center text-white font-bold text-sm">
              {user.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user.name}</p>
              <p className="text-muted-2 text-[10px] truncate">Administrator</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="w-full flex items-center gap-2 text-danger text-xs hover:bg-[rgba(255,59,59,0.08)] px-2 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="h-14 bg-[rgba(4,8,15,0.95)] border-b border-[rgba(26,107,255,0.15)] flex items-center px-4 gap-3 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-muted hover:text-text p-1.5">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-head font-bold text-white text-lg">
            {navItems.find(n => pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href)))?.label || "Admin"}
          </span>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/" target="_blank" className="text-muted hover:text-cyan text-xs transition-colors">
              View Store →
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

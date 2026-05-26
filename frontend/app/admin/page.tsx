"use client";
import { useEffect, useState } from "react";
import { Package, ShoppingCart, Users, DollarSign, Clock, TrendingUp } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  pending: "text-orange bg-orange/10 border-orange/20",
  confirmed: "text-blue bg-blue/10 border-blue/20",
  processing: "text-cyan bg-cyan/10 border-cyan/20",
  shipped: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  delivered: "text-green bg-green/10 border-green/20",
  cancelled: "text-danger bg-danger/10 border-danger/20",
};

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card rounded-xl h-28 animate-pulse" />
        ))}
      </div>
    );
  }

  const { stats, monthlyRevenue = [], topProducts = [], recentOrders = [] } = data || {};

  const statCards = [
    { label: "Total Revenue", value: `ETB ${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "text-green", bg: "bg-green/10", border: "border-green/20" },
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingCart, color: "text-blue", bg: "bg-blue/10", border: "border-blue/20" },
    { label: "Total Products", value: stats?.totalProducts || 0, icon: Package, color: "text-cyan", bg: "bg-cyan/10", border: "border-cyan/20" },
    { label: "Total Customers", value: stats?.totalUsers || 0, icon: Users, color: "text-orange", bg: "bg-orange/10", border: "border-orange/20" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-head text-3xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-muted text-sm mt-1">Here's what's happening with your store today.</p>
        </div>
        {stats?.pendingOrders > 0 && (
          <Link href="/admin/orders?status=pending" className="flex items-center gap-2 bg-orange/10 border border-orange/30 text-orange text-sm font-semibold px-4 py-2 rounded-lg hover:bg-orange/20 transition-colors">
            <Clock className="w-4 h-4" />
            {stats.pendingOrders} Pending Orders
          </Link>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`card rounded-xl p-5 border ${border}`}>
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-4`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="font-head text-2xl font-bold text-white">{value}</p>
            <p className="text-muted text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-head font-bold text-white">Recent Orders</h3>
            <Link href="/admin/orders" className="text-cyan text-xs hover:text-white transition-colors">View All →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-muted text-sm text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order: any) => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-[rgba(26,107,255,0.04)] rounded-lg">
                  <div>
                    <p className="text-white text-sm font-semibold">{order.orderNumber}</p>
                    <p className="text-muted text-xs">{order.user?.name} · {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-bold">ETB {order.totalPrice?.toLocaleString()}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${STATUS_COLORS[order.orderStatus] || ""}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-head font-bold text-white">Top Selling Products</h3>
            <TrendingUp className="w-4 h-4 text-cyan" />
          </div>
          {topProducts.length === 0 ? (
            <p className="text-muted text-sm text-center py-8">No sales data yet</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p: any, i: number) => (
                <div key={p._id} className="flex items-center gap-3">
                  <span className="font-head font-bold text-muted-2 text-sm w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{p.name}</p>
                    <div className="h-1.5 bg-[rgba(26,107,255,0.1)] rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-3 to-blue rounded-full"
                        style={{ width: `${Math.min(100, (p.sold / (topProducts[0]?.sold || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan text-sm font-bold">{p.sold} sold</p>
                    <p className="text-muted-2 text-xs">ETB {p.revenue?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card rounded-xl p-5">
        <h3 className="font-head font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/admin/products/new", label: "Add Product", icon: "➕", desc: "List a new laptop" },
            { href: "/admin/orders", label: "Manage Orders", icon: "📦", desc: "View & update orders" },
            { href: "/admin/customers", label: "View Customers", icon: "👥", desc: "Customer accounts" },
            { href: "/admin/reviews", label: "Approve Reviews", icon: "⭐", desc: "Manage reviews" },
          ].map(({ href, label, icon, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 p-4 bg-[rgba(26,107,255,0.04)] hover:bg-[rgba(26,107,255,0.1)] border border-[rgba(26,107,255,0.1)] hover:border-blue rounded-xl transition-all text-center group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
              <p className="text-white text-sm font-semibold">{label}</p>
              <p className="text-muted-2 text-[10px]">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

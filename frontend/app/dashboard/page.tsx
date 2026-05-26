"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, User, MapPin, Heart, ChevronRight, Clock } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";

const STATUS_COLORS: Record<string, string> = {
  pending: "text-orange border-orange/30 bg-orange/10",
  confirmed: "text-blue border-blue/30 bg-blue/10",
  processing: "text-cyan border-cyan/30 bg-cyan/10",
  shipped: "text-purple-400 border-purple-400/30 bg-purple-400/10",
  delivered: "text-green border-green/30 bg-green/10",
  cancelled: "text-danger border-danger/30 bg-danger/10",
};

export default function DashboardPage() {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    if (!isLoading && !user) { router.push("/auth/login"); return; }
    if (user) {
      api.get("/orders/my")
        .then(({ data }) => setOrders(data))
        .catch(console.error)
        .finally(() => setLoadingOrders(false));
    }
  }, [user, isLoading, router]);

  if (!user) return null;

  const tabs = [
    { key: "orders", label: "My Orders", icon: Package },
    { key: "profile", label: "Profile", icon: User },
    { key: "addresses", label: "Addresses", icon: MapPin },
  ];

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-12">
      <h1 className="font-head text-4xl font-bold text-white mb-2">My Account</h1>
      <p className="text-muted mb-8">Welcome back, {user.name}!</p>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-56 flex-shrink-0">
          <div className="card rounded-xl overflow-hidden">
            <div className="p-4 bg-[rgba(26,107,255,0.08)] border-b border-[rgba(26,107,255,0.15)]">
              <div className="w-12 h-12 rounded-full bg-blue-3 border border-blue flex items-center justify-center text-white font-bold text-xl mb-2">
                {user.name[0]}
              </div>
              <p className="text-white font-semibold text-sm">{user.name}</p>
              <p className="text-muted-2 text-xs truncate">{user.email}</p>
            </div>
            <nav className="p-2">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === key
                      ? "bg-blue text-white"
                      : "text-muted hover:text-text hover:bg-[rgba(26,107,255,0.1)]"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
              {user.role === "admin" && (
                <Link href="/admin" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-cyan hover:bg-[rgba(0,212,255,0.08)] transition-colors mt-1">
                  🛡️ Admin Panel
                </Link>
              )}
            </nav>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1">
          {activeTab === "orders" && (
            <div>
              <h2 className="font-head text-2xl font-bold text-white mb-5">My Orders</h2>
              {loadingOrders ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="card rounded-xl h-24 animate-pulse" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="card rounded-xl p-12 text-center">
                  <Package className="w-12 h-12 text-muted-2 mx-auto mb-3" />
                  <p className="text-muted">No orders yet</p>
                  <Link href="/shop" className="btn-primary btn-sm mt-4 inline-block">Browse Laptops</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order._id} className="card rounded-xl p-5 hover:border-[rgba(26,107,255,0.4)] transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div>
                          <p className="text-white font-semibold">{order.orderNumber}</p>
                          <p className="text-muted text-xs flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${STATUS_COLORS[order.orderStatus] || ""}`}>
                            {order.orderStatus}
                          </span>
                          <span className="font-head font-bold text-white">
                            ETB {order.totalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.items.slice(0, 3).map((item: any) => (
                          <div key={item._id} className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#080f1c] border border-[rgba(26,107,255,0.15)]">
                            <Image src={item.image || "https://placehold.co/40x40/0b1527/1a6bff?text=💻"} alt={item.name} fill className="object-cover" />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-muted text-xs">+{order.items.length - 3} more</span>
                        )}
                        <Link href={`/dashboard/orders/${order._id}`} className="ml-auto text-blue text-xs hover:text-cyan flex items-center gap-1">
                          View Details <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <ProfileTab user={user} />
          )}

          {activeTab === "addresses" && (
            <div>
              <h2 className="font-head text-2xl font-bold text-white mb-5">My Addresses</h2>
              {((user as any).addresses) && ((user as any).addresses).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {((user as any).addresses).map((addr: any) => (
                    <div key={addr._id} className="card rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-cyan text-xs font-semibold">{addr.label}</span>
                        {addr.isDefault && <span className="text-green text-[10px] border border-green/30 bg-green/10 px-2 py-0.5 rounded-full">Default</span>}
                      </div>
                      <p className="text-white text-sm font-semibold">{addr.fullName}</p>
                      <p className="text-muted text-xs mt-1">{addr.address}, {addr.city}</p>
                      <p className="text-muted text-xs">{addr.phone}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card rounded-xl p-12 text-center">
                  <MapPin className="w-12 h-12 text-muted-2 mx-auto mb-3" />
                  <p className="text-muted">No saved addresses</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ user }: { user: any }) {
  const [form, setForm] = useState({ name: user.name, phone: user.phone || "" });
  const { updateProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-head text-2xl font-bold text-white mb-5">Profile Settings</h2>
      <div className="card rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-wider">Full Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-wider">Email</label>
            <input value={user.email} disabled className="input opacity-50 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-wider">Phone</label>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input" placeholder="+251..." />
          </div>
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

const STATUS_COLORS: Record<string, string> = {
  pending: "text-orange bg-orange/10 border-orange/20",
  confirmed: "text-blue bg-blue/10 border-blue/20",
  processing: "text-cyan bg-cyan/10 border-cyan/20",
  shipped: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  delivered: "text-green bg-green/10 border-green/20",
  cancelled: "text-danger bg-danger/10 border-danger/20",
};

const STATUSES = ["", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: "20" };
      if (status) params.status = status;
      const { data } = await api.get("/orders", { params });
      setOrders(data.orders);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page, status]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter(o =>
    search === "" ||
    o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-head text-2xl font-bold text-white">Orders</h2>
          <p className="text-muted text-sm">{total} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-2" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order # or customer..." className="input pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`text-xs font-semibold px-3 py-2 rounded-lg capitalize transition-all ${
                status === s ? "bg-blue text-white" : "border border-[rgba(26,107,255,0.2)] text-muted hover:text-text hover:border-blue"
              }`}
            >
              {s || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(26,107,255,0.15)] bg-[rgba(26,107,255,0.04)]">
                {["Order #", "Customer", "Items", "Total", "Payment", "Status", "Date", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted text-xs font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-[rgba(26,107,255,0.08)]">
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-[rgba(26,107,255,0.06)] rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted">No orders found</td>
                </tr>
              ) : (
                filtered.map(order => (
                  <tr key={order._id} className="border-b border-[rgba(26,107,255,0.08)] hover:bg-[rgba(26,107,255,0.03)] transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-cyan font-semibold font-head">{order.orderNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{order.user?.name || "Guest"}</p>
                      <p className="text-muted-2 text-xs truncate max-w-[120px]">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-muted">{order.items?.length} item(s)</td>
                    <td className="px-4 py-3">
                      <span className="text-white font-bold font-head">ETB {order.totalPrice?.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                        order.isPaid ? "text-green bg-green/10 border-green/20" : "text-orange bg-orange/10 border-orange/20"
                      }`}>
                        {order.isPaid ? "Paid" : order.paymentMethod === "cod" ? "COD" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.orderStatus}
                        onChange={e => updateStatus(order._id, e.target.value)}
                        disabled={updating === order._id}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border bg-transparent cursor-pointer capitalize ${STATUS_COLORS[order.orderStatus] || ""} disabled:opacity-60`}
                      >
                        {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map(s => (
                          <option key={s} value={s} className="bg-[#080f1c] text-white">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-muted text-xs whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 items-center">
                        {order.shippingAddress?.phone && (
                          <a
                            href={`https://wa.me/${order.shippingAddress.phone.replace(/\D/g,"")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#25d366] text-xs hover:underline"
                          >
                            💬 WA
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-xs border border-[rgba(26,107,255,0.2)] text-muted rounded-lg disabled:opacity-40 hover:border-blue hover:text-text">
            ← Prev
          </button>
          <span className="text-muted text-xs">Page {page} of {pages}</span>
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="px-3 py-1.5 text-xs border border-[rgba(26,107,255,0.2)] text-muted rounded-lg disabled:opacity-40 hover:border-blue hover:text-text">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

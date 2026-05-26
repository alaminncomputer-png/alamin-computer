"use client";
import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";

const STATUSES = ["", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

function AdminOrdersPageInner() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(searchParams.get("status") || "");

  useEffect(() => {
    api.get("/admin/orders", { params: status ? { status } : {} })
      .then(res => setOrders(res.data.orders || res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div className="text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="mb-4">
        <select
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          {STATUSES.map(s => (
            <option key={s} value={s}>{s || "All Statuses"}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No orders found</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order._id} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm text-gray-400">#{order._id?.slice(-8)}</span>
                <span className="text-sm px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">{order.status}</span>
              </div>
              <div className="mt-2 text-sm text-gray-300">
                Total: ETB {order.totalPrice?.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
      <AdminOrdersPageInner />
    </Suspense>
  );
}

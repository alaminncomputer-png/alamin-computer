"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    api.get("/admin/users")
      .then(({ data }) => { setUsers(data.users); setTotal(data.total); })
      .catch(() => toast.error("Failed to load customers"))
      .finally(() => setLoading(false));
  }, []);

  const toggleActive = async (id: string, current: boolean) => {
    try {
      await api.put(`/admin/users/${id}`, { isActive: !current });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: !current } : u));
      toast.success("Status updated");
    } catch { toast.error("Failed to update"); }
  };

  const filtered = users.filter(u =>
    search === "" ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-head text-2xl font-bold text-white">Customers</h2>
        <p className="text-muted text-sm">{total} registered users</p>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-2" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." className="input pl-9" />
      </div>

      <div className="card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(26,107,255,0.15)] bg-[rgba(26,107,255,0.04)]">
                {["Customer", "Phone", "Role", "Joined", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted text-xs font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-[rgba(26,107,255,0.08)]">
                    {[...Array(6)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-[rgba(26,107,255,0.06)] rounded animate-pulse" /></td>)}
                  </tr>
                ))
              ) : filtered.map(u => (
                <tr key={u._id} className="border-b border-[rgba(26,107,255,0.08)] hover:bg-[rgba(26,107,255,0.03)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-3 border border-blue flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="text-white font-medium">{u.name}</p>
                        <p className="text-muted-2 text-xs">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">{u.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                      u.role === "admin" ? "text-cyan bg-cyan/10 border-cyan/20" : "text-muted bg-[rgba(26,107,255,0.05)] border-[rgba(26,107,255,0.15)]"
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                      u.isActive ? "text-green bg-green/10 border-green/20" : "text-danger bg-danger/10 border-danger/20"
                    }`}>{u.isActive ? "Active" : "Suspended"}</span>
                  </td>
                  <td className="px-4 py-3">
                    {u.role !== "admin" && (
                      <button
                        onClick={() => toggleActive(u._id, u.isActive)}
                        className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-colors ${
                          u.isActive ? "border-danger/30 text-danger hover:bg-danger/10" : "border-green/30 text-green hover:bg-green/10"
                        }`}
                      >
                        {u.isActive ? "Suspend" : "Activate"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

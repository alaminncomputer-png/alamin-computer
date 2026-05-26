"use client";
import { useState, useEffect } from "react";
import { Star, Check, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filter === "pending") params.approved = "false";
      if (filter === "approved") params.approved = "true";
      const { data } = await api.get("/admin/reviews", { params });
      setReviews(data);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [filter]);

  const approve = async (id: string) => {
    try {
      await api.put(`/admin/reviews/${id}/approve`);
      setReviews(prev => prev.filter(r => r._id !== id));
      toast.success("Review approved!");
    } catch { toast.error("Failed to approve"); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      setReviews(prev => prev.filter(r => r._id !== id));
      toast.success("Review deleted");
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-head text-2xl font-bold text-white">Reviews</h2>
        <p className="text-muted text-sm">Manage customer reviews</p>
      </div>

      <div className="flex gap-2">
        {(["pending", "approved", "all"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm font-semibold px-4 py-2 rounded-lg capitalize transition-all ${
              filter === f ? "bg-blue text-white" : "border border-[rgba(26,107,255,0.2)] text-muted hover:text-text hover:border-blue"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="card rounded-xl h-28 animate-pulse" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="card rounded-xl p-12 text-center">
          <Star className="w-12 h-12 text-muted-2 mx-auto mb-3" />
          <p className="text-muted">No {filter} reviews</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r._id} className="card rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-3 border border-blue flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {r.user?.name?.[0] || "U"}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{r.user?.name || "Customer"}</p>
                      <p className="text-muted-2 text-xs">{r.user?.email}</p>
                    </div>
                    <div className="flex ml-2">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "text-orange fill-orange" : "text-muted-2"}`} />
                      ))}
                    </div>
                  </div>
                  <div className="ml-11">
                    <p className="text-cyan text-xs font-semibold mb-1">
                      Product: {r.product?.name || "Unknown"}
                    </p>
                    {r.title && <p className="text-white text-sm font-semibold mb-1">{r.title}</p>}
                    <p className="text-muted text-sm">{r.comment}</p>
                    <p className="text-muted-2 text-xs mt-2">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!r.isApproved && (
                    <button
                      onClick={() => approve(r._id)}
                      className="flex items-center gap-1.5 bg-green/10 border border-green/30 text-green text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-green/20 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}
                  {r.isApproved && (
                    <span className="flex items-center gap-1.5 text-green text-xs font-semibold px-3 py-1.5 border border-green/20 rounded-lg bg-green/5">
                      <Check className="w-3.5 h-3.5" /> Approved
                    </span>
                  )}
                  <button
                    onClick={() => remove(r._id)}
                    className="p-1.5 text-muted hover:text-danger transition-colors rounded-lg hover:bg-danger/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

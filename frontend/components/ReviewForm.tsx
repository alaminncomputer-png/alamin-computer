"use client";
import React, { useState } from "react";
import api from "@/lib/api";

export default function ReviewForm({ productId, onReviewAdded }: { productId: string; onReviewAdded: (r: any) => void }) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hover, setHover] = useState(0);

  const handleSubmit = async () => {
    if (!comment) { alert("Please write a comment!"); return; }
    setLoading(true);
    try {
      const res = await api.post("/reviews", { product: productId, rating, title, comment });
      onReviewAdded(res.data.review);
      setSubmitted(true);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit review. Please login first.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div style={{textAlign:"center",padding:"16px",color:"#00c77a",fontWeight:"bold"}}>
      ✅ Thank you for your review!
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
      <div>
        <p style={{color:"#7a90b8",fontSize:"13px",marginBottom:"6px"}}>Rating</p>
        <div style={{display:"flex",gap:"4px"}}>
          {[1,2,3,4,5].map(s => (
            <button key={s}
              onClick={() => setRating(s)}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              style={{background:"none",border:"none",cursor:"pointer",fontSize:"24px",color:(hover || rating) >= s ? "#ff8c00" : "#3a4a6a"}}>
              ★
            </button>
          ))}
        </div>
      </div>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Review title (optional)" style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",padding:"10px",color:"white",outline:"none",boxSizing:"border-box"}} />
      <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Write your review..." rows={3} style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",padding:"10px",color:"white",outline:"none",boxSizing:"border-box",resize:"none"}} />
      <button onClick={handleSubmit} disabled={loading} style={{padding:"12px",borderRadius:"10px",background:loading?"#333":"#1a6bff",border:"none",color:"white",fontWeight:"bold",cursor:"pointer",fontSize:"15px"}}>
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}

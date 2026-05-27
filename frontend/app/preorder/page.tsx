"use client";
import React, { useState } from "react";

const WHATSAPP = "+251933264444";
const TELEGRAM = "Al_Aminn_computer";

export default function PreOrderPage() {
  const [form, setForm] = useState({ name: "", phone: "", product: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
      return;
    }
    const message = "🛒 *PRE-ORDER REQUEST*

" +
      "👤 Name: " + form.name + "
" +
      "📞 Phone: " + form.phone + "
" +
      "💻 Product: " + form.product + "
" +
      "📝 Notes: " + (form.notes || "None");
    const waUrl = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(message);
    window.open(waUrl, "_blank");
    setSubmitted(true);
  };

  return (
    <div style={{minHeight:"100vh",background:"#04080f",color:"white",padding:"24px 16px"}}>
      <div style={{maxWidth:"500px",margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"32px"}}>
          <div style={{fontSize:"40px",marginBottom:"12px"}}>🛒</div>
          <h1 style={{fontSize:"28px",fontWeight:"bold",marginBottom:"8px"}}>Pre-Order</h1>
          <p style={{color:"#7a90b8",fontSize:"14px"}}>Reserve your laptop before it arrives. We will contact you when it is ready.</p>
        </div>

        {submitted ? (
          <div style={{background:"rgba(0,199,122,0.1)",border:"1px solid rgba(0,199,122,0.3)",borderRadius:"16px",padding:"32px",textAlign:"center"}}>
            <div style={{fontSize:"48px",marginBottom:"16px"}}>✅</div>
            <h2 style={{fontSize:"20px",fontWeight:"bold",color:"#00c77a",marginBottom:"8px"}}>Pre-Order Sent!</h2>
            <p style={{color:"#7a90b8",fontSize:"14px"}}>We received your request via WhatsApp. We will contact you soon!</p>
            <button onClick={() => setSubmitted(false)}
              style={{marginTop:"20px",padding:"10px 24px",borderRadius:"8px",background:"#1a6bff",border:"none",color:"white",fontWeight:"bold",cursor:"pointer"}}>
              New Pre-Order
            </button>
          </div>
        ) : (
          <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"24px",display:"flex",flexDirection:"column",gap:"16px"}}>
            <div>
              <label style={{fontSize:"13px",color:"#7a90b8",display:"block",marginBottom:"6px"}}>Your Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                placeholder="e.g. Mohammed Alamin"
                style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",padding:"10px 14px",color:"white",outline:"none",boxSizing:"border-box"}} />
            </div>
            <div>
              <label style={{fontSize:"13px",color:"#7a90b8",display:"block",marginBottom:"6px"}}>Phone Number *</label>
              <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                placeholder="e.g. 0933264444"
                style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",padding:"10px 14px",color:"white",outline:"none",boxSizing:"border-box"}} />
            </div>
            <div>
              <label style={{fontSize:"13px",color:"#7a90b8",display:"block",marginBottom:"6px"}}>Product You Want *</label>
              <input value={form.product} onChange={e => setForm(f => ({...f, product: e.target.value}))}
                placeholder="e.g. HP EliteBook 840 G8 i7 16GB"
                style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",padding:"10px 14px",color:"white",outline:"none",boxSizing:"border-box"}} />
            </div>
            <div>
              <label style={{fontSize:"13px",color:"#7a90b8",display:"block",marginBottom:"6px"}}>Additional Notes</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}
                placeholder="Budget, preferred specs, delivery location..."
                rows={3}
                style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",padding:"10px 14px",color:"white",outline:"none",boxSizing:"border-box",resize:"none"}} />
            </div>
            <button onClick={handleSubmit}
              style={{width:"100%",padding:"14px",borderRadius:"12px",background:"#25d366",border:"none",color:"white",fontWeight:"bold",fontSize:"16px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
              📱 Send Pre-Order via WhatsApp
            </button>
            <a href={"https://t.me/" + TELEGRAM}
              target="_blank" rel="noopener noreferrer"
              style={{width:"100%",padding:"14px",borderRadius:"12px",background:"#229ed9",color:"white",fontWeight:"bold",fontSize:"16px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",textDecoration:"none"}}>
              ✈️ Order via Telegram
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

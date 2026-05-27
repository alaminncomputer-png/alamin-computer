"use client";
import React, { useState } from "react";

const WHATSAPP = "+251933264444";
const TELEGRAM = "Al_Aminn_computer";

export default function PreOrderPage() {
  const [form, setForm] = useState({ name: "", phone: "", product: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const msg = "PRE-ORDER - Name: " + form.name + " | Phone: " + form.phone + " | Product: " + form.product + " | Notes: " + (form.notes || "None");
    window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg), "_blank");
    setSubmitted(true);
  };

  if (submitted) return (
    <div style={{minHeight:"100vh",background:"#04080f",color:"white",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"16px"}}>
      <div style={{fontSize:"48px"}}>✅</div>
      <h2 style={{color:"#00c77a",fontSize:"22px",fontWeight:"bold"}}>Pre-Order Sent!</h2>
      <p style={{color:"#7a90b8",textAlign:"center",padding:"0 24px"}}>We will contact you soon!</p>
      <button onClick={() => setSubmitted(false)} style={{padding:"12px 28px",borderRadius:"10px",background:"#1a6bff",border:"none",color:"white",fontWeight:"bold",cursor:"pointer",fontSize:"15px"}}>New Pre-Order</button>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#04080f",color:"white",padding:"24px 16px"}}>
      <div style={{maxWidth:"500px",margin:"0 auto"}}>
        <h1 style={{fontSize:"28px",fontWeight:"bold",marginBottom:"8px",textAlign:"center"}}>🛒 Pre-Order</h1>
        <p style={{color:"#7a90b8",fontSize:"14px",textAlign:"center",marginBottom:"24px"}}>Reserve your product before it arrives!</p>
        <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
          <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Your Name *" style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",padding:"12px",color:"white",outline:"none",boxSizing:"border-box"}} />
          <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="Phone Number *" style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",padding:"12px",color:"white",outline:"none",boxSizing:"border-box"}} />
          <input value={form.product} onChange={e => setForm(f => ({...f, product: e.target.value}))} placeholder="Product You Want * (e.g. HP EliteBook i7)" style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",padding:"12px",color:"white",outline:"none",boxSizing:"border-box"}} />
          <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} placeholder="Notes: budget, specs, delivery location..." rows={3} style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",padding:"12px",color:"white",outline:"none",boxSizing:"border-box",resize:"none"}} />
          <button onClick={handleSubmit} style={{width:"100%",padding:"14px",borderRadius:"12px",background:"#25d366",border:"none",color:"white",fontWeight:"bold",fontSize:"16px",cursor:"pointer"}}>📱 Send via WhatsApp</button>
          <a href={"https://t.me/" + TELEGRAM} target="_blank" rel="noopener noreferrer" style={{width:"100%",padding:"14px",borderRadius:"12px",background:"#229ed9",color:"white",fontWeight:"bold",fontSize:"16px",display:"block",textAlign:"center",textDecoration:"none"}}>✈️ Order via Telegram</a>
        </div>
      </div>
    </div>
  );
}

"use client";
import React from "react";

const WHATSAPP = "+251933264444";
const TELEGRAM = "Al_Aminn_computer";

export function WhatsAppFloat() {
  return (
    <div style={{position:"fixed",bottom:"24px",right:"16px",zIndex:50,display:"flex",flexDirection:"column",gap:"12px"}}>
      <a href={"https://t.me/" + TELEGRAM} target="_blank" rel="noopener noreferrer"
        style={{display:"flex",alignItems:"center",justifyContent:"center",width:"56px",height:"56px",borderRadius:"50%",background:"#229ed9"}}>
        <span style={{color:"white",fontWeight:"bold",fontSize:"20px"}}>TG</span>
      </a>
      <a href={"https://wa.me/" + WHATSAPP} target="_blank" rel="noopener noreferrer"
        style={{display:"flex",alignItems:"center",justifyContent:"center",width:"56px",height:"56px",borderRadius:"50%",background:"#25d366"}}>
        <span style={{color:"white",fontWeight:"bold",fontSize:"20px"}}>WA</span>
      </a>
    </div>
  );
}

export function OrderButtons({ product }: { product: any }) {
  const message = "Hello! I want to order: " + product?.name + " Price: ETB " + product?.price;
  const waUrl = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(message);
  const tgUrl = "https://t.me/" + TELEGRAM + "?text=" + encodeURIComponent(message);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"12px",width:"100%"}}>
      <a href={waUrl} target="_blank" rel="noopener noreferrer"
        style={{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",padding:"12px",borderRadius:"12px",background:"#25d366",fontWeight:"bold",color:"white",textDecoration:"none"}}>
        Order via WhatsApp
      </a>
      <a href={tgUrl} target="_blank" rel="noopener noreferrer"
        style={{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",padding:"12px",borderRadius:"12px",background:"#229ed9",fontWeight:"bold",color:"white",textDecoration:"none"}}>
        Order via Telegram
      </a>
    </div>
  );
}

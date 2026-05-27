"use client";
import React, { useState } from "react";

export default function AIRecommend() {
  const [budget, setBudget] = useState("");
  const [use, setUse] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [open, setOpen] = useState(false);

  const askAI = async () => {
    if (!budget && !use) { alert("Please fill at least one field!"); return; }
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: "You are a laptop expert at Alamin Computer store in Addis Ababa Ethiopia. A customer needs help choosing a laptop. Budget: " + (budget || "not specified") + " ETB. Use case: " + (use || "not specified") + ". Recommend 2-3 specific laptop models with specs and prices in ETB. Keep response short and practical for Ethiopian market. Focus on HP EliteBook, Dell Latitude, Lenovo ThinkPad, ASUS, Acer brands."
          }]
        })
      });
      const data = await res.json();
      setResult(data.content?.[0]?.text || "Sorry, could not get recommendation.");
    } catch {
      setResult("Sorry, AI is temporarily unavailable. Please contact us on WhatsApp: +251933264444");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{position:"fixed",bottom:"100px",left:"16px",zIndex:50}}>
      {!open ? (
        <button onClick={() => setOpen(true)}
          style={{background:"linear-gradient(135deg,#1a6bff,#00d4ff)",border:"none",borderRadius:"50px",padding:"12px 20px",color:"white",fontWeight:"bold",fontSize:"14px",cursor:"pointer",boxShadow:"0 4px 20px rgba(26,107,255,0.4)",display:"flex",alignItems:"center",gap:"8px"}}>
          🤖 AI Laptop Finder
        </button>
      ) : (
        <div style={{background:"#0b1527",border:"1px solid rgba(26,107,255,0.3)",borderRadius:"16px",padding:"20px",width:"300px",boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
            <h3 style={{color:"white",fontWeight:"bold",fontSize:"15px",margin:0}}>🤖 AI Laptop Finder</h3>
            <button onClick={() => setOpen(false)} style={{background:"none",border:"none",color:"#7a90b8",cursor:"pointer",fontSize:"18px"}}>✕</button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            <input value={budget} onChange={e => setBudget(e.target.value)}
              placeholder="Your budget (ETB)"
              style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",padding:"10px",color:"white",outline:"none",width:"100%",boxSizing:"border-box"}} />
            <select value={use} onChange={e => setUse(e.target.value)}
              style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",padding:"10px",color:"white",outline:"none",width:"100%"}}>
              <option value="">Select use case</option>
              <option value="office work and browsing">Office & Browsing</option>
              <option value="gaming">Gaming</option>
              <option value="student studies">Student</option>
              <option value="video editing and design">Video Editing & Design</option>
              <option value="programming and coding">Programming</option>
              <option value="business presentations">Business</option>
            </select>
            <button onClick={askAI} disabled={loading}
              style={{background:"linear-gradient(135deg,#1a6bff,#00d4ff)",border:"none",borderRadius:"8px",padding:"10px",color:"white",fontWeight:"bold",cursor:loading?"wait":"pointer",fontSize:"14px"}}>
              {loading ? "Finding best laptops..." : "Find My Perfect Laptop"}
            </button>
            {result && (
              <div style={{background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:"8px",padding:"12px",color:"#e8f0ff",fontSize:"13px",lineHeight:"1.6",maxHeight:"200px",overflowY:"auto"}}>
                {result}
              </div>
            )}
            {result && (
              <a href="https://wa.me/+251933264444?text=I want to buy a laptop" target="_blank"
                style={{background:"#25d366",borderRadius:"8px",padding:"10px",color:"white",fontWeight:"bold",textAlign:"center",textDecoration:"none",fontSize:"14px"}}>
                📱 Order on WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

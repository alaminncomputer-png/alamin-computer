"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/products?limit=100")
      .then(res => setProducts(res.data.products || res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const updateStock = async (id: string, stock: number) => {
    setUpdating(id);
    try {
      await api.put("/products/" + id, { stock });
      setProducts(prev => prev.map(p => p._id === id ? { ...p, stock } : p));
    } catch {
      alert("Failed to update stock");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const outOfStock = products.filter(p => p.stock === 0).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 3).length;
  const inStock = products.filter(p => p.stock > 3).length;

  const getStockColor = (stock: number) => {
    if (stock === 0) return "#ff3b3b";
    if (stock <= 3) return "#ff8c00";
    return "#00c77a";
  };

  const getStockLabel = (stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 3) return "Low Stock";
    return "In Stock";
  };

  return (
    <div style={{minHeight:"100vh",background:"#04080f",color:"white",padding:"16px"}}>
      <div style={{maxWidth:"800px",margin:"0 auto"}}>
        <h1 style={{fontSize:"24px",fontWeight:"bold",marginBottom:"20px"}}>Inventory Tracking</h1>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px",marginBottom:"20px"}}>
          <div style={{background:"rgba(0,199,122,0.1)",border:"1px solid rgba(0,199,122,0.3)",borderRadius:"12px",padding:"16px",textAlign:"center"}}>
            <div style={{fontSize:"28px",fontWeight:"bold",color:"#00c77a"}}>{inStock}</div>
            <div style={{fontSize:"12px",color:"#7a90b8",marginTop:"4px"}}>In Stock</div>
          </div>
          <div style={{background:"rgba(255,140,0,0.1)",border:"1px solid rgba(255,140,0,0.3)",borderRadius:"12px",padding:"16px",textAlign:"center"}}>
            <div style={{fontSize:"28px",fontWeight:"bold",color:"#ff8c00"}}>{lowStock}</div>
            <div style={{fontSize:"12px",color:"#7a90b8",marginTop:"4px"}}>Low Stock</div>
          </div>
          <div style={{background:"rgba(255,59,59,0.1)",border:"1px solid rgba(255,59,59,0.3)",borderRadius:"12px",padding:"16px",textAlign:"center"}}>
            <div style={{fontSize:"28px",fontWeight:"bold",color:"#ff3b3b"}}>{outOfStock}</div>
            <div style={{fontSize:"12px",color:"#7a90b8",marginTop:"4px"}}>Out of Stock</div>
          </div>
        </div>

        {lowStock > 0 && (
          <div style={{background:"rgba(255,140,0,0.15)",border:"1px solid rgba(255,140,0,0.4)",borderRadius:"12px",padding:"12px 16px",marginBottom:"16px",display:"flex",alignItems:"center",gap:"8px"}}>
            <span style={{fontSize:"20px"}}>⚠️</span>
            <span style={{color:"#ff8c00",fontWeight:"bold"}}>{lowStock} product(s) are running low on stock!</span>
          </div>
        )}

        {outOfStock > 0 && (
          <div style={{background:"rgba(255,59,59,0.15)",border:"1px solid rgba(255,59,59,0.4)",borderRadius:"12px",padding:"12px 16px",marginBottom:"16px",display:"flex",alignItems:"center",gap:"8px"}}>
            <span style={{fontSize:"20px"}}>🚫</span>
            <span style={{color:"#ff3b3b",fontWeight:"bold"}}>{outOfStock} product(s) are out of stock!</span>
          </div>
        )}

        <input
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",padding:"10px 14px",color:"white",outline:"none",marginBottom:"16px",boxSizing:"border-box"}}
        />

        {loading ? (
          <div style={{textAlign:"center",padding:"40px",color:"#7a90b8"}}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{textAlign:"center",padding:"40px",color:"#7a90b8"}}>No products found</div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            {filtered.map((product: any) => (
              <div key={product._id} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"12px",padding:"14px",display:"flex",alignItems:"center",gap:"12px"}}>
                {product.images?.[0] && (
                  <img src={product.images[0].url} alt={product.name} style={{width:"50px",height:"50px",objectFit:"cover",borderRadius:"8px"}} />
                )}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:"600",fontSize:"14px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{product.name}</div>
                  <div style={{fontSize:"12px",color:"#7a90b8",marginTop:"2px"}}>ETB {product.price?.toLocaleString()}</div>
                  <div style={{display:"flex",alignItems:"center",gap:"6px",marginTop:"4px"}}>
                    <span style={{width:"8px",height:"8px",borderRadius:"50%",background:getStockColor(product.stock),display:"inline-block"}}></span>
                    <span style={{fontSize:"11px",color:getStockColor(product.stock)}}>{getStockLabel(product.stock)}</span>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                  <button
                    onClick={() => updateStock(product._id, Math.max(0, (product.stock || 0) - 1))}
                    disabled={updating === product._id || product.stock === 0}
                    style={{width:"32px",height:"32px",borderRadius:"8px",background:"rgba(255,255,255,0.1)",border:"none",color:"white",fontSize:"18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    -
                  </button>
                  <span style={{minWidth:"30px",textAlign:"center",fontWeight:"bold",color:getStockColor(product.stock)}}>{product.stock || 0}</span>
                  <button
                    onClick={() => updateStock(product._id, (product.stock || 0) + 1)}
                    disabled={updating === product._id}
                    style={{width:"32px",height:"32px",borderRadius:"8px",background:"rgba(26,107,255,0.3)",border:"none",color:"white",fontSize:"18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

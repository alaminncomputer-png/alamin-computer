"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/blog")
      .then(res => setPosts(res.data.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{minHeight:"100vh",background:"#04080f",color:"white",padding:"24px 16px"}}>
      <div style={{maxWidth:"800px",margin:"0 auto"}}>
        <h1 style={{fontSize:"32px",fontWeight:"bold",marginBottom:"8px"}}>📝 Blog</h1>
        <p style={{color:"#7a90b8",marginBottom:"32px"}}>Laptop tips, guides and news from Alamin Computer</p>
        {loading ? (
          <div style={{textAlign:"center",padding:"40px",color:"#7a90b8"}}>Loading...</div>
        ) : posts.length === 0 ? (
          <div style={{textAlign:"center",padding:"60px",color:"#7a90b8"}}>
            <div style={{fontSize:"48px",marginBottom:"16px"}}>📝</div>
            <p>No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
            {posts.map((post: any) => (
              <Link key={post._id} href={"/blog/" + post.slug} style={{textDecoration:"none"}}>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:"16px",padding:"20px",cursor:"pointer",transition:"all 0.2s"}}>
                  {post.coverImage && <img src={post.coverImage} alt={post.title} style={{width:"100%",height:"180px",objectFit:"cover",borderRadius:"10px",marginBottom:"16px"}} />}
                  <div style={{display:"flex",gap:"8px",marginBottom:"8px"}}>
                    {post.tags?.map((tag: string) => (
                      <span key={tag} style={{background:"rgba(26,107,255,0.2)",color:"#1a6bff",fontSize:"11px",padding:"3px 10px",borderRadius:"20px"}}>{tag}</span>
                    ))}
                  </div>
                  <h2 style={{color:"white",fontSize:"18px",fontWeight:"bold",marginBottom:"8px"}}>{post.title}</h2>
                  <p style={{color:"#7a90b8",fontSize:"14px",lineHeight:"1.6"}}>{post.excerpt}</p>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"12px"}}>
                    <span style={{color:"#7a90b8",fontSize:"12px"}}>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span style={{color:"#1a6bff",fontSize:"13px",fontWeight:"bold"}}>Read more →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.slug) return;
    api.get("/blog/" + params.slug)
      .then(res => setPost(res.data.post))
      .catch(() => router.push("/blog"))
      .finally(() => setLoading(false));
  }, [params?.slug]);

  if (loading) return <div style={{minHeight:"100vh",background:"#04080f",display:"flex",alignItems:"center",justifyContent:"center",color:"white"}}>Loading...</div>;
  if (!post) return null;

  return (
    <div style={{minHeight:"100vh",background:"#04080f",color:"white",padding:"24px 16px"}}>
      <div style={{maxWidth:"700px",margin:"0 auto"}}>
        <button onClick={() => router.push("/blog")} style={{background:"none",border:"none",color:"#1a6bff",cursor:"pointer",fontSize:"14px",marginBottom:"20px",padding:0}}>← Back to Blog</button>
        {post.coverImage && <img src={post.coverImage} alt={post.title} style={{width:"100%",height:"220px",objectFit:"cover",borderRadius:"12px",marginBottom:"24px"}} />}
        <div style={{display:"flex",gap:"8px",marginBottom:"12px"}}>
          {post.tags?.map((tag: string) => (
            <span key={tag} style={{background:"rgba(26,107,255,0.2)",color:"#1a6bff",fontSize:"11px",padding:"3px 10px",borderRadius:"20px"}}>{tag}</span>
          ))}
        </div>
        <h1 style={{fontSize:"26px",fontWeight:"bold",marginBottom:"12px",lineHeight:"1.4"}}>{post.title}</h1>
        <p style={{color:"#7a90b8",fontSize:"13px",marginBottom:"24px"}}>{new Date(post.createdAt).toLocaleDateString()} · {post.readTime || "5"} min read</p>
        <div style={{color:"#e8f0ff",lineHeight:"1.8",fontSize:"15px",whiteSpace:"pre-wrap"}}>{post.content}</div>
        <div style={{marginTop:"40px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:"12px",padding:"20px",textAlign:"center"}}>
          <p style={{color:"white",fontWeight:"bold",marginBottom:"12px"}}>Looking for a laptop? Contact us!</p>
          <a href="https://wa.me/+251933264444" target="_blank" style={{background:"#25d366",padding:"10px 24px",borderRadius:"8px",color:"white",fontWeight:"bold",textDecoration:"none",fontSize:"14px"}}>📱 WhatsApp Us</a>
        </div>
      </div>
    </div>
  );
}

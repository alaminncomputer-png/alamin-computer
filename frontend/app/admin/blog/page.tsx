"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editPost, setEditPost] = useState<any>(null);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", coverImage: "", tags: "", readTime: "5" });

  useEffect(() => {
    api.get("/blog")
      .then(res => setPosts(res.data.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const data = { ...form, tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean) };
      if (editPost) {
        const res = await api.put("/blog/" + editPost._id, data);
        setPosts(prev => prev.map(p => p._id === editPost._id ? res.data.post : p));
      } else {
        const res = await api.post("/blog", data);
        setPosts(prev => [res.data.post, ...prev]);
      }
      setShowForm(false);
      setEditPost(null);
      setForm({ title: "", excerpt: "", content: "", coverImage: "", tags: "", readTime: "5" });
    } catch (err: any) {
      alert("Failed: " + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post: any) => {
    setEditPost(post);
    setForm({ title: post.title, excerpt: post.excerpt || "", content: post.content, coverImage: post.coverImage || "", tags: (post.tags || []).join(", "), readTime: post.readTime || "5" });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete("/blog/" + id);
      setPosts(prev => prev.filter(p => p._id !== id));
    } catch {
      alert("Failed to delete");
    }
  };

  const inputStyle: any = { width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 12px", color: "white", outline: "none", boxSizing: "border-box", fontSize: "14px" };

  return (
    <div style={{minHeight:"100vh",background:"#04080f",color:"white",padding:"16px"}}>
      <div style={{maxWidth:"800px",margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px"}}>
          <h1 style={{fontSize:"24px",fontWeight:"bold"}}>📝 Blog Management</h1>
          <button onClick={() => { setShowForm(true); setEditPost(null); setForm({ title: "", excerpt: "", content: "", coverImage: "", tags: "", readTime: "5" }); }}
            style={{background:"#1a6bff",border:"none",borderRadius:"10px",padding:"10px 18px",color:"white",fontWeight:"bold",cursor:"pointer",fontSize:"14px"}}>
            + New Post
          </button>
        </div>

        {showForm && (
          <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:"16px",padding:"20px",marginBottom:"24px"}}>
            <h2 style={{fontSize:"18px",fontWeight:"bold",marginBottom:"16px"}}>{editPost ? "Edit Post" : "New Blog Post"}</h2>
            <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
              <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="Post Title *" style={inputStyle} />
              <input value={form.excerpt} onChange={e => setForm(f => ({...f, excerpt: e.target.value}))} placeholder="Short excerpt (shown in listing)" style={inputStyle} />
              <input value={form.coverImage} onChange={e => setForm(f => ({...f, coverImage: e.target.value}))} placeholder="Cover Image URL (optional)" style={inputStyle} />
              <input value={form.tags} onChange={e => setForm(f => ({...f, tags: e.target.value}))} placeholder="Tags (comma separated): laptop, guide, tips" style={inputStyle} />
              <input value={form.readTime} onChange={e => setForm(f => ({...f, readTime: e.target.value}))} placeholder="Read time (minutes)" style={inputStyle} />
              <textarea value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} placeholder="Write your blog post content here..." rows={10} style={{...inputStyle, resize:"vertical"}} />
              <div style={{display:"flex",gap:"10px"}}>
                <button onClick={handleSubmit} disabled={saving}
                  style={{flex:1,background:saving?"#333":"#1a6bff",border:"none",borderRadius:"8px",padding:"12px",color:"white",fontWeight:"bold",cursor:"pointer",fontSize:"14px"}}>
                  {saving ? "Saving..." : editPost ? "Update Post" : "Publish Post"}
                </button>
                <button onClick={() => { setShowForm(false); setEditPost(null); }}
                  style={{padding:"12px 20px",background:"rgba(255,255,255,0.1)",border:"none",borderRadius:"8px",color:"white",cursor:"pointer"}}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{textAlign:"center",padding:"40px",color:"#7a90b8"}}>Loading...</div>
        ) : posts.length === 0 ? (
          <div style={{textAlign:"center",padding:"60px",color:"#7a90b8"}}>
            <div style={{fontSize:"48px",marginBottom:"16px"}}>📝</div>
            <p>No blog posts yet. Create your first post!</p>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
            {posts.map((post: any) => (
              <div key={post._id} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"12px",padding:"16px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"12px"}}>
                <div style={{flex:1,minWidth:0}}>
                  <h3 style={{fontWeight:"bold",fontSize:"15px",marginBottom:"4px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{post.title}</h3>
                  <p style={{color:"#7a90b8",fontSize:"12px"}}>{new Date(post.createdAt).toLocaleDateString()} · {post.readTime || 5} min read</p>
                  <div style={{display:"flex",gap:"4px",marginTop:"6px",flexWrap:"wrap"}}>
                    {post.tags?.map((tag: string) => (
                      <span key={tag} style={{background:"rgba(26,107,255,0.2)",color:"#1a6bff",fontSize:"10px",padding:"2px 8px",borderRadius:"20px"}}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div style={{display:"flex",gap:"8px",flexShrink:0}}>
                  <button onClick={() => handleEdit(post)}
                    style={{padding:"8px 14px",background:"rgba(26,107,255,0.2)",border:"none",borderRadius:"8px",color:"#1a6bff",cursor:"pointer",fontSize:"13px",fontWeight:"bold"}}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(post._id)}
                    style={{padding:"8px 14px",background:"rgba(255,59,59,0.2)",border:"none",borderRadius:"8px",color:"#ff3b3b",cursor:"pointer",fontSize:"13px",fontWeight:"bold"}}>
                    Delete
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

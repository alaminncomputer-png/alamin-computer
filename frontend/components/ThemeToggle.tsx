"use client";
import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setDark(false);
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      setDark(true);
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggle = () => {
    if (dark) {
      setDark(false);
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      document.body.style.background = "#f0f4ff";
      document.body.style.color = "#0a0f1e";
    } else {
      setDark(true);
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.body.style.background = "#04080f";
      document.body.style.color = "#e8f0ff";
    }
  };

  return (
    <button
      onClick={toggle}
      title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      style={{
        background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "50%",
        width: "38px",
        height: "38px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: "18px",
        transition: "all 0.3s",
      }}>
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Lock, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error("Passwords don't match"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    try {
      await register(form.name, form.email, form.phone, form.password);
      toast.success("Account created! Welcome to Alamin Computer.");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">💻</div>
          <h1 className="font-head text-3xl font-bold text-white">Create Account</h1>
          <p className="text-muted mt-2 text-sm">Join thousands of happy customers</p>
        </div>

        <div className="card rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "name", label: "Full Name", icon: User, type: "text", placeholder: "Abebe Tadesse" },
              { name: "email", label: "Email", icon: Mail, type: "email", placeholder: "your@email.com" },
              { name: "phone", label: "Phone", icon: Phone, type: "tel", placeholder: "+251 9XX XXX XXX" },
            ].map(field => (
              <div key={field.name}>
                <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-wider">{field.label}</label>
                <div className="relative">
                  <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-2" />
                  <input
                    type={field.type}
                    name={field.name}
                    value={(form as any)[field.name]}
                    onChange={handleChange}
                    required={field.name !== "phone"}
                    placeholder={field.placeholder}
                    className="input pl-10"
                  />
                </div>
              </div>
            ))}
            <div>
              <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-2" />
                <input
                  type={showPw ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="Min. 6 characters"
                  className="input pl-10 pr-10"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-2">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-2" />
                <input
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  required
                  placeholder="Repeat password"
                  className="input pl-10"
                />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2 disabled:opacity-60">
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-muted text-sm mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-cyan hover:text-white transition-colors font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

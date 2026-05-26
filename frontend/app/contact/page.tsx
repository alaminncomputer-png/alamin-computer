"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const WA = process.env.NEXT_PUBLIC_WHATSAPP || "+251933264444";
  const TG = process.env.NEXT_PUBLIC_TELEGRAM || "Al_Aminn_computer";
  const FB = process.env.NEXT_PUBLIC_FACEBOOK || "https://facebook.com/Al_Aminn_computer";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Message sent! We'll respond within 24 hours.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-cyan text-xs font-semibold tracking-[0.18em] uppercase flex items-center justify-center gap-3 mb-3">
          <span className="w-7 h-0.5 bg-cyan inline-block" /> Get In Touch <span className="w-7 h-0.5 bg-cyan inline-block" />
        </p>
        <h1 className="font-head text-5xl font-bold text-white mb-4">
          Contact <span className="text-cyan">Us</span>
        </h1>
        <p className="text-muted max-w-lg mx-auto text-[15px]">
          Have a question about a laptop? Want a wholesale quote? We&apos;re here to help — reach out via any channel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-5">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/${WA.replace(/\D/g,"")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card rounded-xl p-5 flex items-center gap-4 hover:border-[#25d366]/50 group transition-colors block"
          >
            <div className="w-12 h-12 rounded-xl bg-[#25d366]/10 border border-[#25d366]/20 flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-[#25d366]/20 transition-colors">
              💬
            </div>
            <div>
              <p className="text-white font-semibold">WhatsApp</p>
              <p className="text-muted text-sm">{WA}</p>
              <p className="text-[#25d366] text-xs mt-0.5">Chat with us →</p>
            </div>
          </a>

          {/* Telegram */}
          <a
            href={`https://t.me/${TG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card rounded-xl p-5 flex items-center gap-4 hover:border-[#229ed9]/50 group transition-colors block"
          >
            <div className="w-12 h-12 rounded-xl bg-[#229ed9]/10 border border-[#229ed9]/20 flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-[#229ed9]/20 transition-colors">
              ✈️
            </div>
            <div>
              <p className="text-white font-semibold">Telegram</p>
              <p className="text-muted text-sm">@{TG}</p>
              <p className="text-[#229ed9] text-xs mt-0.5">Message us →</p>
            </div>
          </a>

          {/* Facebook */}
          <a
            href={FB}
            target="_blank"
            rel="noopener noreferrer"
            className="card rounded-xl p-5 flex items-center gap-4 hover:border-[#1877f2]/50 group transition-colors block"
          >
            <div className="w-12 h-12 rounded-xl bg-[#1877f2]/10 border border-[#1877f2]/20 flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-[#1877f2]/20 transition-colors">
              📘
            </div>
            <div>
              <p className="text-white font-semibold">Facebook</p>
              <p className="text-muted text-sm">Alamin Computer</p>
              <p className="text-[#1877f2] text-xs mt-0.5">Follow our page →</p>
            </div>
          </a>

          {/* Phone */}
          <a href={`tel:${WA}`} className="card rounded-xl p-5 flex items-center gap-4 hover:border-blue/50 group transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue/10 border border-blue/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue/20 transition-colors">
              <Phone className="w-5 h-5 text-blue" />
            </div>
            <div>
              <p className="text-white font-semibold">Phone</p>
              <p className="text-muted text-sm">{WA}</p>
              <p className="text-cyan text-xs mt-0.5">Call us directly →</p>
            </div>
          </a>

          {/* Email */}
          <a href="mailto:info@Al_Aminn_computer.com" className="card rounded-xl p-5 flex items-center gap-4 hover:border-blue/50 group transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue/10 border border-blue/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue/20 transition-colors">
              <Mail className="w-5 h-5 text-blue" />
            </div>
            <div>
              <p className="text-white font-semibold">Email</p>
              <p className="text-muted text-sm">info@Al_Aminn_computer.com</p>
              <p className="text-cyan text-xs mt-0.5">Send email →</p>
            </div>
          </a>

          {/* Address */}
          <div className="card rounded-xl p-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue/10 border border-blue/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-blue" />
            </div>
            <div>
              <p className="text-white font-semibold">Location</p>
              <p className="text-muted text-sm">Addis Ababa, Ethiopia</p>
              <p className="text-muted text-sm">Bole Sub-City</p>
              <p className="text-muted-2 text-xs mt-1">Mon–Sat: 8AM–7PM</p>
            </div>
          </div>
        </div>

        {/* Contact Form + Map */}
        <div className="lg:col-span-2 space-y-6">
          {/* Google Maps Embed */}
          <div className="card rounded-xl overflow-hidden h-52">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.519607455736!2d38.76328931527395!3d9.010004493528895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa%20Bole!5e0!3m2!1sen!2set!4v1614789012345!5m2!1sen!2set"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Alamin Computer Location"
            />
          </div>

          {/* Contact Form */}
          <div className="card rounded-xl p-6">
            <h2 className="font-head text-2xl font-bold text-white mb-5">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-wider">Your Name *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                    className="input"
                    placeholder="Abebe Tadesse"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-wider">Phone</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="input"
                    placeholder="+251..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-wider">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  className="input"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-wider">Subject</label>
                <select
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  className="input"
                >
                  <option value="">Select a topic</option>
                  <option>Laptop Inquiry</option>
                  <option>Wholesale Pricing</option>
                  <option>Order Support</option>
                  <option>Warranty Claim</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-wider">Message *</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  required
                  rows={5}
                  className="input resize-none"
                  placeholder="Tell us what laptop you're looking for, or ask us anything..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

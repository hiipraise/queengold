"use client";

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us — Queen Gold",
  description: "Get in touch with Queen Gold. We are here to assist with your timepiece, order, or verification query.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="pt-12 pb-12 text-center">
          <p className="font-display text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: "var(--gold-muted)" }}>Queen Gold</p>
          <h1 className="font-serif text-5xl text-gold-gradient mb-4">Contact Us</h1>
          <div className="divider-gold w-20 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {[
            { label: "General Enquiries",     value: "hello@queengold.com",    icon: "✉" },
            { label: "Sales",                 value: "sales@queengold.com",    icon: "◇" },
            { label: "After-Sales Service",   value: "service@queengold.com",  icon: "○" },
            { label: "Lagos Showroom",         value: "+234 (0) 800 000 0000",  icon: "△" },
          ].map((item) => (
            <div key={item.label} className="card-luxury p-6">
              <p className="font-serif text-2xl mb-3" style={{ color: "var(--gold)", opacity: 0.7 }}>{item.icon}</p>
              <p className="font-display text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--gold-muted)" }}>
                {item.label}
              </p>
              <p className="font-body text-sm" style={{ color: "var(--text-primary)" }}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="card-luxury p-8">
          <h2 className="font-serif text-2xl text-gold-gradient mb-6">Send a Message</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-display text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--gold-muted)" }}>First Name</label>
                <input type="text" className="input-luxury w-full h-11 px-4 text-sm rounded-sm" autoComplete="given-name" />
              </div>
              <div>
                <label className="block font-display text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--gold-muted)" }}>Last Name</label>
                <input type="text" className="input-luxury w-full h-11 px-4 text-sm rounded-sm" autoComplete="family-name" />
              </div>
            </div>
            <div>
              <label className="block font-display text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--gold-muted)" }}>Email Address</label>
              <input type="email" className="input-luxury w-full h-11 px-4 text-sm rounded-sm" autoComplete="email" />
            </div>
            <div>
              <label className="block font-display text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--gold-muted)" }}>Subject</label>
              <select className="input-luxury w-full h-11 px-3 text-sm rounded-sm">
                <option value="">Select a topic</option>
                <option>Order Enquiry</option>
                <option>Watch Verification</option>
                <option>After-Sales Service</option>
                <option>Trade / Wholesale</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block font-display text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--gold-muted)" }}>Message</label>
              <textarea className="input-luxury w-full px-4 py-3 text-sm rounded-sm resize-none" rows={5} />
            </div>
            <button type="submit" className="btn-gold px-8 h-12 text-xs rounded-sm">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}
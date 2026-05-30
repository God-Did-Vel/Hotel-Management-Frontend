"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, X } from "lucide-react";
import { apiClient } from "@/lib/api";
import Image from "next/image";

/* ── Gallery images ── */
const GALLERY = [
  {
    src: "https://res.cloudinary.com/duweg8kpv/image/upload/kp00_-_Copy_e1xzqj.png",
    label: "The Main Floor",
    span: "col-span-2 row-span-2",
  },
  {
    src: "https://res.cloudinary.com/duweg8kpv/image/upload/gb5_ceteci.png",
    label: "",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop",
    label: "Live Performances",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=600&auto=format&fit=crop",
    label: "The DJ Booth",
    span: "col-span-1 row-span-2",
  },
];

const EXPERIENCES = [
  {
    num: "01",
    title: "The Main Stage",
    desc: "World-class DJs and live acts perform nightly under a ceiling of choreographed lights and laser displays.",
  },
  {
    num: "02",
    title: "VIP Sanctuary",
    desc: "Exclusive booths with dedicated service, premium bottle menus, and panoramic views of the dance floor below.",
  },
  {
    num: "03",
    title: "Craft Cocktail Bar",
    desc: "Our award-winning mixologists craft signature cocktails using rare spirits and house-made botanicals.",
  },
  {
    num: "04",
    title: "Private Rooms",
    desc: "Intimate event spaces for groups, birthdays, and corporate evenings — fully customised to your vision.",
  },
];

export default function NightlifePage() {
  const [isBooking, setIsBooking] = useState(false);
  const [formData, setFormData] = useState({
    guest_name: "",
    guest_email: "",
    guest_phone: "",
    booking_date: "",
    service_type: "General Entry",
  });
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message?: string;
    code?: string;
  }>({ type: "idle" });

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading" });
    try {
      const { data } = await apiClient.post("/api/nightlife/book", formData);
      setStatus({ type: "success", message: "Reservation confirmed.", code: data.tracking_code });
      setIsBooking(false);
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Failed to reserve. Please try again.",
      });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Raleway:wght@200;300;400;500&display=swap');

        :root {
          --black:    #050507;
          --deep:     #0a0a0f;
          --surface:  #111116;
          --gold:     #c9922a;
          --gold-lt:  #e8b84b;
          --gold-dim: rgba(201,146,42,0.18);
          --white:    #f5f0ea;
          --dim:      rgba(245,240,234,0.45);
          --border:   rgba(201,146,42,0.14);
        }

        .nl-root {
          background: var(--black);
          min-height: 100vh;
          font-family: 'Raleway', sans-serif;
          color: var(--white);
          overflow-x: hidden;
        }

        /* ── grain overlay ── */
        .nl-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
        }

        /* ── hero ── */
        .nl-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 8rem 2rem 6rem;
          overflow: hidden;
        }

        .nl-hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,146,42,0.08) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 20% 80%, rgba(120,40,200,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 50% at 80% 20%, rgba(200,50,80,0.05) 0%, transparent 60%);
        }

        /* animated spotlight lines */
        .nl-hero-lines {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .nl-line {
          position: absolute;
          top: 0;
          width: 1px;
          height: 100%;
          background: linear-gradient(180deg, transparent 0%, rgba(201,146,42,0.25) 40%, transparent 100%);
          animation: lineFall 6s ease-in-out infinite;
        }

        .nl-line:nth-child(1) { left: 20%; animation-delay: 0s; }
        .nl-line:nth-child(2) { left: 45%; animation-delay: 1.5s; opacity: 0.6; }
        .nl-line:nth-child(3) { left: 70%; animation-delay: 3s; opacity: 0.4; }
        .nl-line:nth-child(4) { left: 85%; animation-delay: 4.5s; opacity: 0.3; }

        @keyframes lineFall {
          0%, 100% { transform: scaleY(0) translateY(-100%); opacity: 0; }
          20%       { opacity: 1; }
          50%       { transform: scaleY(1) translateY(0); }
          80%       { opacity: 0.5; }
        }

        .nl-eyebrow {
          font-size: 0.6rem;
          font-weight: 400;
          letter-spacing: 0.55em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 1.5rem;
        }

        .nl-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3.5rem, 10vw, 8rem);
          font-weight: 400;
          line-height: 0.92;
          letter-spacing: -0.02em;
          margin-bottom: 1rem;
        }

        .nl-hero-title em {
          font-style: italic;
          color: var(--gold-lt);
        }

        .nl-hero-rule {
          width: 1px;
          height: 60px;
          background: linear-gradient(180deg, var(--gold), transparent);
          margin: 2rem auto;
        }

        .nl-hero-sub {
          font-size: clamp(0.75rem, 1.5vw, 0.85rem);
          font-weight: 300;
          letter-spacing: 0.12em;
          color: var(--dim);
          max-width: 480px;
          line-height: 1.9;
          margin: 0 auto 3rem;
        }

        .nl-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.9rem 2.5rem;
          border: 1px solid var(--gold);
          color: var(--gold-lt);
          font-family: 'Raleway', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          background: transparent;
          cursor: pointer;
          transition: background 0.35s ease, color 0.35s ease;
          position: relative;
          overflow: hidden;
        }

        .nl-cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--gold);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
        }

        .nl-cta-btn:hover::before { transform: scaleX(1); }
        .nl-cta-btn:hover { color: #000; }
        .nl-cta-btn span { position: relative; z-index: 1; }

        /* ── hours strip ── */
        .nl-hours {
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 1.2rem 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
          background: rgba(201,146,42,0.03);
        }

        .nl-hours-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .nl-hours-day {
          font-size: 0.55rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 400;
        }

        .nl-hours-time {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 400;
          color: var(--white);
        }

        /* ── section wrapper ── */
        .nl-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 6rem clamp(1.5rem, 5vw, 4rem);
        }

        /* ── section heading ── */
        .nl-section-heading {
          margin-bottom: 4rem;
        }

        .nl-section-eyebrow {
          font-size: 0.58rem;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 300;
          display: block;
          margin-bottom: 1rem;
        }

        .nl-section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 400;
          line-height: 1.1;
          color: var(--white);
        }

        .nl-section-title em { font-style: italic; color: var(--gold-lt); }

        /* ── gallery mosaic ── */
        .nl-gallery {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: 260px 260px;
          gap: 8px;
        }

        .nl-gallery-cell-0 { grid-column: span 2; grid-row: span 2; }
        .nl-gallery-cell-1 { grid-column: span 1; grid-row: span 1; }
        .nl-gallery-cell-2 { grid-column: span 1; grid-row: span 1; }
        .nl-gallery-cell-3 { grid-column: span 1; grid-row: span 2; }
        .nl-gallery-cell-4 { grid-column: span 2; grid-row: span 1; }

        @media (max-width: 768px) {
          .nl-gallery {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto;
          }
          .nl-gallery-cell-0 { grid-column: span 2; grid-row: span 1; height: 240px; }
          .nl-gallery-cell-3 { grid-column: span 2; grid-row: span 1; }
          .nl-gallery-cell-4 { grid-column: span 2; }
        }

        .nl-gallery-cell {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          background: var(--surface);
        }

        .nl-gallery-cell img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.75) saturate(0.85);
          transition: transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94),
                      filter 0.9s ease;
        }

        .nl-gallery-cell:hover img {
          transform: scale(1.08);
          filter: brightness(0.6) saturate(1.1);
        }

        .nl-gallery-cell::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(5,5,7,0.8) 0%, transparent 60%);
          pointer-events: none;
        }

        .nl-gallery-label {
          position: absolute;
          bottom: 1rem;
          left: 1.2rem;
          z-index: 2;
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--gold-lt);
          font-weight: 300;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.3s, transform 0.3s;
        }

        .nl-gallery-cell:hover .nl-gallery-label {
          opacity: 1;
          transform: translateY(0);
        }

        /* gold border on hover */
        .nl-gallery-cell::before {
          content: '';
          position: absolute;
          inset: 0;
          border: 1px solid transparent;
          z-index: 3;
          pointer-events: none;
          transition: border-color 0.4s;
        }

        .nl-gallery-cell:hover::before {
          border-color: rgba(201,146,42,0.4);
        }

        /* ── experience grid ── */
        .nl-experience-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
        }

        @media (max-width: 640px) {
          .nl-experience-grid { grid-template-columns: 1fr; }
        }

        .nl-experience-item {
          background: var(--black);
          padding: 3rem 2.5rem;
          position: relative;
          transition: background 0.3s;
        }

        .nl-experience-item:hover { background: var(--deep); }

        .nl-exp-num {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          font-weight: 400;
          color: rgba(201,146,42,0.12);
          line-height: 1;
          margin-bottom: 1.5rem;
          transition: color 0.3s;
        }

        .nl-experience-item:hover .nl-exp-num {
          color: rgba(201,146,42,0.25);
        }

        .nl-exp-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 400;
          color: var(--white);
          margin-bottom: 0.75rem;
        }

        .nl-exp-desc {
          font-size: 0.8rem;
          font-weight: 300;
          color: var(--dim);
          line-height: 1.8;
        }

        .nl-exp-line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--gold);
          transition: width 0.5s ease;
        }

        .nl-experience-item:hover .nl-exp-line { width: 100%; }

        /* ── form modal ── */
        .nl-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(5,5,7,0.92);
          backdrop-filter: blur(12px);
          padding: 1rem;
        }

        .nl-modal {
          background: var(--deep);
          border: 1px solid var(--border);
          padding: clamp(2rem, 5vw, 3.5rem);
          width: 100%;
          max-width: 560px;
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
        }

        .nl-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          font-weight: 400;
          color: var(--white);
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .nl-modal-sub {
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .nl-field label {
          display: block;
          font-size: 0.58rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--dim);
          margin-bottom: 0.5rem;
        }

        .nl-field input,
        .nl-field select {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(245,240,234,0.15);
          padding-bottom: 0.6rem;
          color: var(--white);
          font-family: 'Raleway', sans-serif;
          font-size: 0.85rem;
          font-weight: 300;
          outline: none;
          transition: border-color 0.2s;
        }

        .nl-field input::placeholder { color: rgba(245,240,234,0.2); }
        .nl-field input:focus,
        .nl-field select:focus { border-bottom-color: var(--gold); }
        .nl-field select option { background: #111; color: #fff; }
        .nl-field input[type="datetime-local"] { color-scheme: dark; }

        .nl-submit {
          width: 100%;
          padding: 1rem;
          border: 1px solid var(--gold);
          background: transparent;
          color: var(--gold-lt);
          font-family: 'Raleway', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: background 0.3s, color 0.3s;
          margin-top: 2rem;
        }

        .nl-submit:hover:not(:disabled) {
          background: var(--gold);
          color: #000;
        }

        .nl-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── success overlay ── */
        .nl-success {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(5,5,7,0.97);
          backdrop-filter: blur(16px);
          padding: 2rem;
          text-align: center;
        }

        .nl-success-code {
          background: var(--gold-dim);
          border: 1px solid rgba(201,146,42,0.3);
          padding: 1.5rem 2.5rem;
          display: inline-block;
          margin: 1.5rem 0 2.5rem;
        }

        .nl-success-code span {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          color: var(--gold-lt);
          letter-spacing: 0.1em;
        }
      `}</style>

      <div className="nl-root">

        {/* ── HERO ── */}
        <section className="nl-hero">
          <div className="nl-hero-bg" />
          <div className="nl-hero-lines">
            <div className="nl-line" />
            <div className="nl-line" />
            <div className="nl-line" />
            <div className="nl-line" />
          </div>

          <motion.p className="nl-eyebrow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            N&amp;B Italian Hotel · Nightlife
          </motion.p>

          <motion.h1 className="nl-hero-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            After<br /><em>Dark</em>
          </motion.h1>

          <motion.div className="nl-hero-rule" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.55, duration: 0.8 }} />

          <motion.p className="nl-hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
            When the sun sets, a different world awakens. Surrender to the night — where world-class music, rare spirits, and unforgettable energy converge.
          </motion.p>

          {/* <motion.button
            className="nl-cta-btn"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            onClick={() => setIsBooking(true)}
          >
            <span>Reserve Your Evening</span>
          </motion.button> */}
        </section>

        {/* ── HOURS STRIP ── */}
        <div className="nl-hours">
          {[
            { day: "Mon – Wed", time: "10pm – 3am" },
            { day: "Thu – Fri", time: "10pm – 5am" },
            { day: "Saturday", time: "9pm – 6am" },
            { day: "Sunday", time: "9pm – 3am" },
          ].map((h) => (
            <div key={h.day} className="nl-hours-item">
              <span className="nl-hours-day">{h.day}</span>
              <span className="nl-hours-time">{h.time}</span>
            </div>
          ))}
        </div>

        {/* ── GALLERY ── */}
        <section className="nl-section">
          <div className="nl-section-heading">
            <span className="nl-section-eyebrow">Visual Diary</span>
            <h2 className="nl-section-title">Inside the <em>Night</em></h2>
          </div>

          <div className="nl-gallery">
            {GALLERY.map((img, i) => (
              <motion.div
                key={i}
                className={`nl-gallery-cell nl-gallery-cell-${i}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.7 }}
              >
                <img src={img.src} alt={img.label} loading={i === 0 ? "eager" : "lazy"} />
                <span className="nl-gallery-label">{img.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── EXPERIENCES ── */}
        <section className="nl-section" style={{ paddingTop: 0 }}>
          <div className="nl-section-heading">
            <span className="nl-section-eyebrow">The Experience</span>
            <h2 className="nl-section-title">Crafted for the <em>Night</em></h2>
          </div>

          <div className="nl-experience-grid">
            {EXPERIENCES.map((exp, i) => (
              <motion.div
                key={i}
                className="nl-experience-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="nl-exp-num">{exp.num}</div>
                <h3 className="nl-exp-title">{exp.title}</h3>
                <p className="nl-exp-desc">{exp.desc}</p>
                <div className="nl-exp-line" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── RESERVE CTA BANNER ── */}
        <section style={{
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "5rem 2rem",
          textAlign: "center",
          background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(201,146,42,0.06) 0%, transparent 70%)",
        }}>
          <motion.p
            className="nl-eyebrow"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          >
            Tonight Awaits
          </motion.p>
          {/* <motion.h2
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,6vw,4rem)", fontWeight: 400, marginBottom: "2rem", lineHeight: 1.1 }}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          >
            Reserve Your Table
          </motion.h2> */}
          <motion.p
            style={{ color: "var(--dim)", fontSize: "0.82rem", fontWeight: 300, letterSpacing: "0.1em", marginBottom: "2.5rem", maxWidth: 400, margin: "0 auto 2.5rem" }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          >
            Secure your spot for an unforgettable evening. VIP tables and bottle service available.
          </motion.p>
          {/* <motion.button
            className="nl-cta-btn"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            onClick={() => setIsBooking(true)}
          >
            <span>Book a Table</span> */}
          {/* </motion.button> */}
        </section>

      </div>

      {/* ── BOOKING MODAL ── */}
      <AnimatePresence>
        {isBooking && (
          <motion.div
            className="nl-modal-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="nl-modal"
              initial={{ scale: 0.95, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 24 }}
            >
              <button
                onClick={() => setIsBooking(false)}
                style={{ position: "absolute", top: "1.2rem", right: "1.5rem", background: "none", border: "none", color: "rgba(245,240,234,0.4)", cursor: "pointer" }}
              >
                <X size={18} />
              </button>

              {/* <h3 className="nl-modal-title">Reserve Your Evening</h3> */}
              {/* <p className="nl-modal-sub">Complete the details below</p> */}

              {status.type === "error" && (
                <div style={{ marginBottom: "1.5rem", padding: "1rem", border: "1px solid rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.08)", color: "#fca5a5", fontSize: "0.78rem", borderRadius: 2 }}>
                  {status.message}
                </div>
              )}

              <form onSubmit={handleBook} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="nl-field">
                    <label>Full Name</label>
                    <input type="text" required placeholder="Your name" value={formData.guest_name}
                      onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })} />
                  </div>
                  <div className="nl-field">
                    <label>Phone</label>
                    <input type="tel" required placeholder="+1 234 567 890" value={formData.guest_phone}
                      onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })} />
                  </div>
                </div>

                <div className="nl-field">
                  <label>Email Address</label>
                  <input type="email" required placeholder="you@example.com" value={formData.guest_email}
                    onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="nl-field">
                    <label>Date &amp; Time</label>
                    <input type="datetime-local" required value={formData.booking_date}
                      onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })} />
                  </div>
                  <div className="nl-field">
                    <label>Experience</label>
                    <select value={formData.service_type}
                      onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}>
                      <option value="General Entry">General Entry</option>
                      <option value="VIP Table">VIP Table Service</option>
                      <option value="Bottle Service">Bottle Service Package</option>
                      <option value="Private Room">Private Room Hire</option>
                      <option value="Birthday Package">Birthday Package</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="nl-submit" disabled={status.type === "loading"}>
                  {status.type === "loading"
                    ? <><Loader2 size={16} className="animate-spin" /> Processing...</>
                    : "Confirm Reservation"
                  }
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SUCCESS OVERLAY ── */}
      <AnimatePresence>
        {status.type === "success" && status.code && (
          <motion.div
            className="nl-success"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}>
              <CheckCircle2 size={56} strokeWidth={1} style={{ color: "var(--gold)", margin: "0 auto 1.5rem", display: "block" }} />
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 400, marginBottom: "0.75rem" }}>
                Evening Reserved
              </h3>
              <p style={{ color: "var(--dim)", fontSize: "0.8rem", fontWeight: 300, letterSpacing: "0.1em", maxWidth: 380, margin: "0 auto 0.5rem", lineHeight: 1.8 }}>
                Your table has been secured. Present your tracking code at the door.
              </p>
              <div className="nl-success-code">
                <span style={{ display: "block", fontSize: "0.55rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.5rem" }}>
                  Tracking Code
                </span>
                <span>{status.code}</span>
              </div>
              <button
                onClick={() => setStatus({ type: "idle" })}
                style={{ background: "none", border: "none", color: "var(--dim)", fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", cursor: "pointer", borderBottom: "1px solid transparent", paddingBottom: "2px", transition: "color 0.2s, border-color 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--gold-lt)"; e.currentTarget.style.borderBottomColor = "var(--gold)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--dim)"; e.currentTarget.style.borderBottomColor = "transparent"; }}
              >
                Return to Nightlife
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
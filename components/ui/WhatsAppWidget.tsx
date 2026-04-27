"use client";

import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "09031269748"; // ← replace with your number
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER.replace(/^0/, "234")}`;

export default function WhatsAppWidget() {
  const [visible, setVisible] = useState(false);   // bubble pop-in
  const [open, setOpen] = useState(false);          // card expanded
  const [dismissed, setDismissed] = useState(false);// user closed card

  // auto-open the greeting card after 2.5 s
  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 400);
    const t2 = setTimeout(() => {
      if (!dismissed) setOpen(true);
    }, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [dismissed]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
    setDismissed(true);
  };

  const toggleCard = () => {
    setOpen((o) => !o);
    setDismissed(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Jost:wght@200;300;400&display=swap');

        :root {
          --wa-green:   #25d366;
          --wa-dark:    #128c7e;
          --gold:       #c9a96e;
          --gold-light: #e8d4a8;
          --bg-card:    #0f0f0d;
          --bg-card2:   #161612;
          --text-main:  #f5f0e8;
          --text-dim:   rgba(245,240,232,0.5);
          --border:     rgba(201,169,110,0.18);
        }

        /* ── FAB button ── */
        .wa-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9990;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--wa-green);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 30px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.4);
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.3s ease,
                      opacity 0.5s ease;
          opacity: 0;
          transform: scale(0.5) translateY(20px);
          outline: none;
          /* ripple base */
        }

        .wa-fab.fab-visible {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        .wa-fab:hover {
          transform: scale(1.1) translateY(-2px);
          box-shadow: 0 10px 40px rgba(37,211,102,0.55), 0 3px 12px rgba(0,0,0,0.4);
        }

        .wa-fab svg {
          width: 30px;
          height: 30px;
          fill: #fff;
          transition: transform 0.3s ease;
        }

        /* ring pulse when card is closed */
        .wa-fab::before {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 2px solid rgba(37,211,102,0.5);
          animation: waPulse 2.2s ease-out infinite;
          pointer-events: none;
        }

        .wa-fab.fab-open::before { animation: none; opacity: 0; }

        @keyframes waPulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          70%  { transform: scale(1.55); opacity: 0; }
          100% { transform: scale(1.55); opacity: 0; }
        }

        /* notification dot */
        .wa-dot {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 14px;
          height: 14px;
          background: var(--gold);
          border-radius: 50%;
          border: 2px solid var(--bg-card);
          animation: dotBounce 1.8s ease-in-out infinite;
        }

        .wa-fab.fab-open .wa-dot { display: none; }

        @keyframes dotBounce {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.25); }
        }

        /* ── greeting card ── */
        .wa-card {
          position: fixed;
          bottom: 102px;
          right: 28px;
          z-index: 9989;
          width: 310px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,169,110,0.08);
          transform-origin: bottom right;
          transition: transform 0.45s cubic-bezier(0.34,1.46,0.64,1),
                      opacity 0.35s ease;
          opacity: 0;
          transform: scale(0.85) translateY(16px);
          pointer-events: none;
        }

        .wa-card.card-open {
          opacity: 1;
          transform: scale(1) translateY(0);
          pointer-events: all;
        }

        /* card header */
        .wac-header {
          background: linear-gradient(135deg, #0b3d2e 0%, #0d4d38 100%);
          padding: 1.2rem 1.2rem 1rem;
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .wac-header::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent);
        }

        .wac-avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gold-light), var(--gold));
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 0 2px rgba(201,169,110,0.3);
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          color: #0b3d2e;
          font-weight: 400;
        }

        .wac-info { flex: 1; min-width: 0; }

        .wac-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          font-weight: 400;
          color: var(--text-main);
          line-height: 1.2;
          letter-spacing: 0.02em;
        }

        .wac-role {
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--gold);
          margin-top: 2px;
        }

        .wac-status {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 4px;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--wa-green);
          animation: statusPulse 2s ease-in-out infinite;
        }

        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }

        .status-text {
          font-family: 'Jost', sans-serif;
          font-size: 0.6rem;
          font-weight: 300;
          color: rgba(245,240,232,0.5);
          letter-spacing: 0.1em;
        }

        .wac-close {
          background: rgba(255,255,255,0.07);
          border: none;
          color: rgba(245,240,232,0.5);
          cursor: pointer;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, color 0.2s;
          flex-shrink: 0;
          align-self: flex-start;
        }

        .wac-close:hover { background: rgba(255,255,255,0.15); color: var(--text-main); }
        .wac-close svg { width: 12px; height: 12px; stroke: currentColor; fill: none; stroke-width: 2; }

        /* card body */
        .wac-body {
          padding: 1.2rem;
          background: var(--bg-card2);
        }

        /* chat bubble */
        .wac-bubble {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 4px 14px 14px 14px;
          padding: 0.85rem 1rem;
          margin-bottom: 1rem;
          position: relative;
          animation: bubbleIn 0.5s cubic-bezier(0.34,1.46,0.64,1) 0.2s both;
        }

        @keyframes bubbleIn {
          from { opacity: 0; transform: translateX(-12px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }

        .wac-bubble p {
          font-family: 'Jost', sans-serif;
          font-size: 0.78rem;
          font-weight: 300;
          color: var(--text-main);
          line-height: 1.7;
          margin: 0;
        }

        .wac-bubble p strong {
          font-weight: 400;
          color: var(--gold-light);
        }

        .wac-bubble-time {
          font-size: 0.55rem;
          color: var(--text-dim);
          font-family: 'Jost', sans-serif;
          font-weight: 200;
          text-align: right;
          margin-top: 6px;
          letter-spacing: 0.1em;
        }

        /* gold rule */
        .wac-rule {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .wac-rule span { flex: 1; height: 1px; background: rgba(201,169,110,0.15); }
        .wac-rule i { font-style: normal; font-size: 0.5rem; color: var(--gold); opacity: 0.6; }

        /* CTA button */
        .wac-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          width: 100%;
          padding: 0.85rem 1rem;
          background: var(--wa-green);
          border-radius: 10px;
          color: #fff;
          text-decoration: none;
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          transition: background 0.3s ease, transform 0.25s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 18px rgba(37,211,102,0.3);
        }

        .wac-cta:hover {
          background: var(--wa-dark);
          transform: translateY(-1px);
          box-shadow: 0 7px 24px rgba(37,211,102,0.4);
        }

        .wac-cta svg {
          width: 16px;
          height: 16px;
          fill: #fff;
          flex-shrink: 0;
        }

        /* footer note */
        .wac-footer {
          padding: 0.65rem 1.2rem 0.8rem;
          text-align: center;
          font-family: 'Jost', sans-serif;
          font-size: 0.55rem;
          font-weight: 200;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(201,169,110,0.4);
          border-top: 1px solid var(--border);
        }

        /* typing indicator */
        .typing {
          display: flex;
          gap: 4px;
          align-items: center;
          height: 14px;
        }
        .typing span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--gold);
          opacity: 0.4;
          animation: typingDot 1.2s ease-in-out infinite;
        }
        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30%            { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>

      {/* ── Greeting Card ── */}
      <div
        className={`wa-card${open ? " card-open" : ""}`}
        role="dialog"
        aria-label="Chat with N&B Hotel"
      >
        {/* Header */}
        <div className="wac-header">
          <div className="wac-avatar">N</div>
          <div className="wac-info">
            <div className="wac-name">N&amp;B Italian Hotel</div>
            <div className="wac-role">Concierge · Guest Relations</div>
            <div className="wac-status">
              <span className="status-dot" />
              <span className="status-text">Online · Typically replies instantly</span>
            </div>
          </div>
          <button
            className="wac-close"
            onClick={handleDismiss}
            aria-label="Close chat"
          >
            <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="wac-body">
          <div className="wac-bubble">
            <p>
              Welcome to <strong>N&amp;B Italian Hotel</strong> 🏨
            </p>
            <p style={{ marginTop: "0.5rem" }}>
              Good day! I'm your personal concierge. Whether you'd like to{" "}
              <strong>reserve a suite</strong>, enquire about our dining experience,
              or plan a bespoke stay — we're here to assist you.
            </p>
            <div className="wac-bubble-time">Just now</div>
          </div>

          <div className="wac-rule">
            <span />
            <i>◆</i>
            <span />
          </div>

          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="wac-cta"
            aria-label="Open WhatsApp chat"
          >
            {/* WhatsApp icon */}
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat with Concierge
          </a>
        </div>

        <div className="wac-footer">N&amp;B Italian Hotel · Luxury &amp; Comfort</div>
      </div>

      {/* ── FAB ── */}
      <button
        className={`wa-fab${visible ? " fab-visible" : ""}${open ? " fab-open" : ""}`}
        onClick={toggleCard}
        aria-label="Chat with us on WhatsApp"
        aria-expanded={open}
      >
        {open ? (
          /* close X when card is open */
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          /* WhatsApp icon */
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="#fff"/>
          </svg>
        )}
        {!open && <span className="wa-dot" />}
      </button>
    </>
  );
}
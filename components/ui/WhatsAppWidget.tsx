"use client";

import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "09031269748";
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER.replace(/^0/, "234")}`;

export default function WhatsAppWidget() {
  const [fabVisible,   setFabVisible]   = useState(false);
  const [labelVisible, setLabelVisible] = useState(false);
  const [labelFading,  setLabelFading]  = useState(false);

  useEffect(() => {
    // 1. FAB springs in at 0.6 s
    const t1 = setTimeout(() => setFabVisible(true),   600);
    // 2. Label appears above FAB at 1.1 s
    const t2 = setTimeout(() => setLabelVisible(true), 1100);
    // 3. After 5 s of visibility (6.1 s total) start slow fade-out
    const t3 = setTimeout(() => setLabelFading(true),  6100);
    // 4. Remove from layout after fade completes (1 s fade)
    const t4 = setTimeout(() => setLabelVisible(false), 8500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Jost:wght@200;300;400&display=swap');

        /* ── root wrapper — stacks label above FAB ── */
        .wa-root {
          position: fixed;
          bottom: clamp(16px, 3vw, 28px);
          right:  clamp(16px, 3vw, 28px);
          z-index: 9990;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(8px, 1.5vw, 12px);
          pointer-events: none; /* children opt in */
        }

        /* ── label pill ── */
        .wa-label {
          pointer-events: none;
          position: relative;
          display: flex;
          align-items: center;
          gap: clamp(5px, 1vw, 8px);
          background: #0f0f0d;
          border: 1px solid rgba(201,169,110,0.3);
          border-radius: 999px;
          padding: clamp(5px,1vw,8px) clamp(10px,2vw,16px) clamp(5px,1vw,8px) clamp(8px,1.5vw,12px);
          white-space: nowrap;
          box-shadow:
            0 8px 30px rgba(0,0,0,0.55),
            0 0 0 1px rgba(201,169,110,0.06),
            inset 0 1px 0 rgba(255,255,255,0.04);

          /* hidden state */
          opacity: 0;
          transform: translateY(10px) scale(0.92);
          transition:
            opacity  0.5s cubic-bezier(0.34,1.4,0.64,1),
            transform 0.5s cubic-bezier(0.34,1.4,0.64,1);
        }

        /* visible */
        .wa-label.lbl-show {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* slow fade out override */
        .wa-label.lbl-fade {
          opacity: 0 !important;
          transform: translateY(-6px) scale(0.96) !important;
          transition:
            opacity  1s ease,
            transform 1s ease !important;
        }

        /* left gold accent bar */
        .wa-label::before {
          content: '';
          position: absolute;
          left: 0; top: 18%; bottom: 18%;
          width: 2px;
          border-radius: 2px;
          background: linear-gradient(180deg, transparent, #c9a96e, transparent);
        }

        /* downward pointer tail */
        .wa-label::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 10px;
          height: 10px;
          background: #0f0f0d;
          border-right: 1px solid rgba(201,169,110,0.3);
          border-bottom: 1px solid rgba(201,169,110,0.3);
        }

        /* live green dot inside label */
        .lbl-dot {
          width:  clamp(6px,1.2vw,8px);
          height: clamp(6px,1.2vw,8px);
          border-radius: 50%;
          background: #25d366;
          flex-shrink: 0;
          animation: liveDot 1.7s ease-in-out infinite;
        }

        @keyframes liveDot {
          0%,100% { opacity:1; }
          50%      { opacity:0.3; }
        }

        /* label text */
        .lbl-text {
          font-family: 'Jost', sans-serif;
          font-size: clamp(0.6rem, 1.4vw, 0.72rem);
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #f5f0e8;
          line-height: 1;
        }

        .lbl-text strong {
          font-weight: 400;
          color: #e8d4a8;
        }

        /* ── FAB ── */
        .wa-fab {
          pointer-events: all;
          position: relative;
          width:  clamp(50px, 8vw, 62px);
          height: clamp(50px, 8vw, 62px);
          border-radius: 50%;
          background: #25d366;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          box-shadow:
            0 6px 26px rgba(37,211,102,0.45),
            0 2px 8px  rgba(0,0,0,0.35);

          /* entrance hidden */
          opacity: 0;
          transform: scale(0.35) translateY(20px);
          transition:
            opacity   0.55s cubic-bezier(0.34,1.56,0.64,1),
            transform 0.55s cubic-bezier(0.34,1.56,0.64,1),
            box-shadow 0.3s ease;
        }

        .wa-fab.fab-on {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        .wa-fab:hover {
          transform: scale(1.1) translateY(-3px);
          box-shadow:
            0 14px 38px rgba(37,211,102,0.55),
            0 4px 14px  rgba(0,0,0,0.4);
        }

        /* WhatsApp SVG */
        .wa-fab svg {
          width:  clamp(24px, 4.5vw, 30px);
          height: clamp(24px, 4.5vw, 30px);
          fill: #fff;
          display: block;
        }

        /* pulse ring */
        .wa-fab::before {
          content: '';
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 2px solid rgba(37,211,102,0.4);
          animation: ring 2.6s ease-out infinite;
          pointer-events: none;
        }

        @keyframes ring {
          0%   { transform: scale(1);    opacity: 0.85; }
          70%  { transform: scale(1.65); opacity: 0;    }
          100% { transform: scale(1.65); opacity: 0;    }
        }

        /* gold notification dot */
        .wa-notif {
          position: absolute;
          top:   clamp(1px, 0.4vw, 3px);
          right: clamp(1px, 0.4vw, 3px);
          width:  clamp(11px, 2vw, 15px);
          height: clamp(11px, 2vw, 15px);
          border-radius: 50%;
          background: #c9a96e;
          border: 2px solid #080808;
          animation: notifPop 2s ease-in-out infinite;
        }

        @keyframes notifPop {
          0%,100% { transform: scale(1);   }
          50%      { transform: scale(1.3); }
        }

        /* ── mobile tweaks (≤ 380 px) ── */
        @media (max-width: 380px) {
          .wa-root {
            bottom: 14px;
            right:  14px;
            gap: 8px;
          }
          .wa-label {
            padding: 5px 10px 5px 8px;
          }
          .lbl-text {
            font-size: 0.58rem;
            letter-spacing: 0.14em;
          }
          .wa-fab {
            width:  48px;
            height: 48px;
          }
        }
      `}</style>

      <div className="wa-root">

        {/* ── Label pill ── */}
        {labelVisible && (
          <div
            className={[
              "wa-label",
              labelVisible && !labelFading ? "lbl-show" : "",
              labelFading ? "lbl-fade" : "",
            ].join(" ")}
            aria-hidden="true"
          >
            <span className="lbl-dot" />
            <span className="lbl-text">
              <strong>Chat</strong>&nbsp;with us on WhatsApp
            </span>
          </div>
        )}

        {/* ── FAB → straight to WhatsApp ── */}
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className={`wa-fab${fabVisible ? " fab-on" : ""}`}
          aria-label="Chat with us on WhatsApp"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span className="wa-notif" />
        </a>

      </div>
    </>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import ExtendedLuxuryText from "@/components/sections/ExtendedLuxuryText";

const images = [
  {
    src: "https://res.cloudinary.com/duweg8kpv/image/upload/v1774272416/N10_q1nxp0.jpg",
    label: "Exterior",
    span: "col-span-2 row-span-2",
  },
  {
    src: "https://res.cloudinary.com/duweg8kpv/image/upload/v1774272414/N8_e2gfi5.jpg",
    label: "Suite",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://res.cloudinary.com/duweg8kpv/image/upload/v1774272415/N14_kasepl.jpg",
    label: "Lounge",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://res.cloudinary.com/duweg8kpv/image/upload/v1774272415/N3_tcbn2l.jpg",
    label: "Dining",
    span: "col-span-1 row-span-2",
  },
  {
    src: "https://res.cloudinary.com/duweg8kpv/image/upload/v1772119961/d3_xsxaea.jpg",
    label: "Lobby",
    span: "col-span-2 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop",
    label: "Spa",
    span: "col-span-1 row-span-1",
  },
];

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((l) => ((l ?? 0) + 1) % images.length);
      if (e.key === "ArrowLeft")
        setLightbox((l) => ((l ?? 0) - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

        :root {
          --gold: #c9a96e;
          --gold-light: #e8d4a8;
          --gold-dark: #8b6e3a;
          --cream: #f5f0e8;
          --black: #080808;
          --surface: #0f0f0e;
        }

        .gallery-root {
          font-family: 'Jost', sans-serif;
          background: var(--black);
          min-height: 100vh;
          color: var(--cream);
          overflow-x: hidden;
        }

        /* ── HERO HEADER ── */
        .gallery-header {
          position: relative;
          padding: 11rem 2rem 5rem;
          text-align: center;
          overflow: hidden;
        }

        .gallery-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(201,169,110,0.10) 0%, transparent 70%);
          pointer-events: none;
        }

        .eyebrow {
          font-family: 'Jost', sans-serif;
          font-weight: 200;
          font-size: 0.65rem;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 1.5rem;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s;
        }

        .gallery-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3.2rem, 8vw, 7.5rem);
          font-weight: 300;
          line-height: 0.95;
          letter-spacing: -0.01em;
          color: var(--cream);
          margin: 0 0 1.2rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1s ease 0.25s, transform 1s ease 0.25s;
        }

        .gallery-title em {
          font-style: italic;
          color: var(--gold-light);
        }

        .title-rule {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin: 1.8rem auto 1.5rem;
          opacity: 0;
          transition: opacity 1s ease 0.4s;
        }

        .title-rule span {
          display: block;
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
        }

        .title-rule i {
          font-style: normal;
          color: var(--gold);
          font-size: 0.5rem;
        }

        .gallery-subtitle {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.82rem;
          letter-spacing: 0.15em;
          color: rgba(245,240,232,0.45);
          max-width: 440px;
          margin: 0 auto;
          line-height: 1.9;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 1s ease 0.5s, transform 1s ease 0.5s;
        }

        /* loaded state */
        .is-loaded .eyebrow,
        .is-loaded .gallery-title,
        .is-loaded .title-rule,
        .is-loaded .gallery-subtitle {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── MOSAIC GRID ── */
        .mosaic-wrap {
          padding: 0 2.5rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .mosaic {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(3, 320px);
          gap: 10px;
        }

        @media (max-width: 900px) {
          .mosaic {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto;
          }
          .item-0 { grid-column: span 2; }
          .item-3, .item-4 { grid-column: span 2; }
        }

        @media (max-width: 560px) {
          .mosaic { grid-template-columns: 1fr; }
          .item-0 { grid-column: span 1; }
          .item-3, .item-4 { grid-column: span 1; }
          .mosaic { grid-template-rows: auto; }
        }

        /* cell spans */
        .item-0 { grid-column: span 2; grid-row: span 2; }
        .item-1 { grid-column: span 1; grid-row: span 1; }
        .item-2 { grid-column: span 1; grid-row: span 1; }
        .item-3 { grid-column: span 1; grid-row: span 2; }
        .item-4 { grid-column: span 2; grid-row: span 1; }
        .item-5 { grid-column: span 1; grid-row: span 1; }

        .mosaic-cell {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          background: #111;
        }

        /* subtle gold border on hover */
        .mosaic-cell::after {
          content: '';
          position: absolute;
          inset: 0;
          border: 1px solid transparent;
          transition: border-color 0.5s ease;
          z-index: 3;
          pointer-events: none;
        }

        .mosaic-cell:hover::after {
          border-color: rgba(201,169,110,0.35);
        }

        .mosaic-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      filter 0.9s ease;
          filter: brightness(0.88) saturate(0.9);
          display: block;
        }

        .mosaic-cell:hover .mosaic-img {
          transform: scale(1.07);
          filter: brightness(0.75) saturate(1.05);
        }

        /* overlay on hover */
        .mosaic-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(8,8,8,0) 40%,
            rgba(8,8,8,0.7) 100%
          );
          opacity: 0;
          transition: opacity 0.5s ease;
          z-index: 2;
        }

        .mosaic-cell:hover .mosaic-overlay { opacity: 1; }

        .mosaic-label {
          position: absolute;
          bottom: 1.4rem;
          left: 1.5rem;
          z-index: 4;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.4s ease 0.05s, transform 0.4s ease 0.05s;
        }

        .mosaic-cell:hover .mosaic-label {
          opacity: 1;
          transform: translateY(0);
        }

        .label-eyebrow {
          display: block;
          font-size: 0.55rem;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 300;
          margin-bottom: 0.3rem;
        }

        .label-name {
          display: block;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 300;
          color: var(--cream);
          line-height: 1;
        }

        /* index number – top right of cell */
        .mosaic-index {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 0.55rem;
          letter-spacing: 0.3em;
          color: rgba(201,169,110,0.5);
          font-weight: 300;
          z-index: 4;
          opacity: 0;
          transition: opacity 0.4s;
        }

        .mosaic-cell:hover .mosaic-index { opacity: 1; }

        /* view icon */
        .view-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.7);
          opacity: 0;
          z-index: 4;
          transition: opacity 0.4s ease, transform 0.4s ease;
          width: 52px;
          height: 52px;
          border: 1px solid rgba(201,169,110,0.6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .view-icon svg {
          width: 18px;
          height: 18px;
          stroke: var(--gold-light);
          fill: none;
          stroke-width: 1.2;
        }

        .mosaic-cell:hover .view-icon {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        /* ── DIVIDER ── */
        .section-divider {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          max-width: 260px;
          margin: 5rem auto 4.5rem;
          opacity: 0.6;
        }

        .section-divider span {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold-dark));
        }

        .section-divider span:last-child {
          background: linear-gradient(90deg, var(--gold-dark), transparent);
        }

        .divider-diamond {
          width: 6px;
          height: 6px;
          border: 1px solid var(--gold);
          transform: rotate(45deg);
          flex-shrink: 0;
        }

        /* ── LIGHTBOX ── */
        .lightbox-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.97);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: lbFadeIn 0.35s ease forwards;
        }

        @keyframes lbFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox-img-wrap {
          position: relative;
          max-width: 88vw;
          max-height: 85vh;
          animation: lbSlideUp 0.4s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
        }

        @keyframes lbSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .lightbox-img-wrap img {
          max-width: 88vw;
          max-height: 80vh;
          object-fit: contain;
          display: block;
        }

        .lightbox-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 0 0;
        }

        .lightbox-meta {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 300;
          color: var(--gold-light);
        }

        .lightbox-count {
          font-size: 0.6rem;
          letter-spacing: 0.35em;
          color: rgba(245,240,232,0.35);
          font-family: 'Jost', sans-serif;
          font-weight: 200;
        }

        .lb-btn {
          background: none;
          border: 1px solid rgba(201,169,110,0.3);
          color: var(--gold-light);
          cursor: pointer;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.3s, background 0.3s;
        }

        .lb-btn:hover {
          border-color: var(--gold);
          background: rgba(201,169,110,0.08);
        }

        .lb-btn svg {
          width: 16px;
          height: 16px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.5;
        }

        .lb-close {
          position: absolute;
          top: -3rem;
          right: 0;
        }

        .lb-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          gap: 0.5rem;
        }

        .lb-nav-left  { left: -4.5rem; }
        .lb-nav-right { right: -4.5rem; }

        @media (max-width: 700px) {
          .lb-nav-left  { left: -2.8rem; }
          .lb-nav-right { right: -2.8rem; }
        }

        /* entrance stagger for cells */
        .mosaic-cell {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.7s ease, transform 0.7s ease,
                      box-shadow 0.5s ease;
        }

        .mosaic-cell.visible { opacity: 1; transform: translateY(0); }

        .mosaic-cell:hover {
          box-shadow: 0 12px 48px rgba(0,0,0,0.6);
          z-index: 2;
        }
      `}</style>

      <div className={`gallery-root${loaded ? " is-loaded" : ""}`} ref={containerRef}>
        {/* ── HEADER ── */}
        <header className="gallery-header">
          <p className="eyebrow">N&amp;B Italian Hotel · Visual Journey</p>
          <h1 className="gallery-title">
            The Art of<br /><em>Refined Living</em>
          </h1>
          <div className="title-rule">
            <span />
            <i>◆</i>
            <span />
          </div>
          <p className="gallery-subtitle">
            Each space at N&amp;B is a composition — light, texture, and
            silence in perfect balance. Step inside our world.
          </p>
        </header>

        {/* ── MOSAIC ── */}
        <section className="mosaic-wrap">
          <MosaicGrid images={images} onOpen={setLightbox} />
        </section>

        {/* ── DIVIDER ── */}
        <div className="section-divider">
          <span />
          <div className="divider-diamond" />
          <span />
        </div>

        <ExtendedLuxuryText />
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox !== null && (
        <div
          className="lightbox-backdrop"
          onClick={() => setLightbox(null)}
        >
          <div
            className="lightbox-img-wrap"
            onClick={(e) => e.stopPropagation()}
          >
            {/* close */}
            <button
              className="lb-btn lb-close"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
            </button>

            {/* prev */}
            <div className="lb-nav lb-nav-left">
              <button
                className="lb-btn"
                onClick={() => setLightbox((l) => ((l ?? 0) - 1 + images.length) % images.length)}
                aria-label="Previous"
              >
                <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>

            {/* next */}
            <div className="lb-nav lb-nav-right">
              <button
                className="lb-btn"
                onClick={() => setLightbox((l) => ((l ?? 0) + 1) % images.length)}
                aria-label="Next"
              >
                <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>

            <img
              src={images[lightbox].src}
              alt={images[lightbox].label}
            />

            <div className="lightbox-bar">
              <span className="lightbox-meta">{images[lightbox].label}</span>
              <span className="lightbox-count">
                {String(lightbox + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── sub-component so we can use IntersectionObserver ── */
function MosaicGrid({
  images,
  onOpen,
}: {
  images: { src: string; label: string }[];
  onOpen: (i: number) => void;
}) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    refs.current.forEach((el, i) => {
      if (el) {
        (el as HTMLElement).style.transitionDelay = `${i * 80}ms`;
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="mosaic">
      {images.map((img, i) => (
        <div
          key={i}
          className={`mosaic-cell item-${i}`}
          ref={(el) => { refs.current[i] = el; }}
          onClick={() => onOpen(i)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onOpen(i)}
          aria-label={`Open ${img.label} in lightbox`}
        >
          <img
            src={img.src}
            alt={img.label}
            className="mosaic-img"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="mosaic-overlay" />

          {/* index */}
          <span className="mosaic-index">
            {String(i + 1).padStart(2, "0")}
          </span>

          {/* expand icon */}
          <div className="view-icon">
            <svg viewBox="0 0 24 24">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* label */}
          <div className="mosaic-label">
            <span className="label-eyebrow">N&amp;B Collection</span>
            <span className="label-name">{img.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
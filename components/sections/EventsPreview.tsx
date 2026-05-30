"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { getImageUrl } from "@/lib/api";

const events = [
  {
    src: "https://res.cloudinary.com/duweg8kpv/image/upload/u1_vsfgfg.jpg",
    title: "ALL WHITE POOL PARTY",
    subtitle: "An unforgettable night pool party of elegance, live music, and fine dining.",
    date: "07 Oct 2026",
    location: "N&B Italian Hotel · Grand Ballroom",
    category: "Gala night",
  },
  {
    src: "https://res.cloudinary.com/duweg8kpv/image/upload/u4_wn3yn0.jpg",
    title: "SEXY VALANTINE STRIPPERS",
    subtitle: "World-class strppers, curated networking, and refined hospitality.",
    date: "14 feb 2026",
    location: "N&B Italian Hotel · Conference Wing",
    category: "Valantine",
  },
  {
    src: "https://res.cloudinary.com/duweg8kpv/image/upload/u7_n9bbyg.jpg",
    title: "LADIES STRIPPER NIGHT",
    subtitle: "Every detail considered — your perfect day, flawlessly orchestrated.",
    date: "22 Feb 2027",
    location: "N&B Italian Hotel · Garden Terrace",
    category: "Wedding",
  },
  {
    src: "https://res.cloudinary.com/duweg8kpv/image/upload/u3_behk8h.jpg",
    title: "HANGOUT PARTY WITH PE-SONG ",
    subtitle: "Exclusive luxury party experiences tailored for distinguished guests.",
    date: "26 Apr, 2026",
    location: "N&B Italian Hotel · Private Dining Room",
    category: "Corporate",
  },
  {
    src: "https://res.cloudinary.com/duweg8kpv/image/upload/u5_rmyzzp.jpg",
    title: "NEW YEAR CHILDREN POOL PARTY",
    subtitle: "An immersive celebration of African Children party, music, and culture.",
    date: "30 Apr 2027",
    location: "N&B Italian Hotel · The Atrium",
    category: "Cultural",
  },
];

export default function EventsPreview() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback(
    (index: number, dir: 1 | -1) => {
      setDirection(dir);
      setCurrent(index);
    },
    []
  );

  const next = useCallback(() => {
    goTo((current + 1) % events.length, 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + events.length) % events.length, -1);
  }, [current, goTo]);

  // Auto-advance every 5s
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "6%" : "-6%",
      opacity: 0,
    }),
    center: { x: "0%", opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? "-6%" : "6%",
      opacity: 0,
    }),
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

        :root {
          --ev-gold:    #c9a96e;
          --ev-gold-lt: #e8d4a8;
          --ev-ink:     #080808;
          --ev-cream:   #f5f0e8;
          --ev-dim:     rgba(245,240,232,0.42);
          --ev-border:  rgba(201,169,110,0.18);
        }

        .ev-section {
          position: relative;
          background: var(--ev-ink);
          overflow: hidden;
          padding: 0 0 6rem;
          font-family: 'Jost', sans-serif;
        }

        /* subtle top border gradient */
        .ev-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--ev-gold), transparent);
        }

        /* ── Header ── */
        .ev-header {
          max-width: 1280px;
          margin: 0 auto;
          padding: 5rem clamp(1.5rem, 5vw, 4rem) 3.5rem;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .ev-header-left {}

        .ev-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.1rem;
        }

        .ev-eyebrow-line {
          width: 40px;
          height: 1px;
          background: var(--ev-gold);
        }

        .ev-eyebrow-text {
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: var(--ev-gold);
        }

        .ev-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 300;
          line-height: 1.1;
          color: var(--ev-cream);
          max-width: 520px;
        }

        .ev-heading em {
          font-style: italic;
          color: var(--ev-gold-lt);
        }

        .ev-header-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1rem;
        }

        .ev-count {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.8rem;
          font-weight: 300;
          color: var(--ev-dim);
          letter-spacing: 0.2em;
        }

        .ev-count strong {
          font-weight: 400;
          color: var(--ev-gold-lt);
          font-size: 1.1rem;
        }

        .ev-view-all {
          font-size: 0.6rem;
          font-weight: 300;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: var(--ev-gold);
          text-decoration: none;
          border-bottom: 1px solid rgba(201,169,110,0.3);
          padding-bottom: 2px;
          transition: color 0.2s, border-color 0.2s;
        }

        .ev-view-all:hover {
          color: var(--ev-gold-lt);
          border-color: var(--ev-gold-lt);
        }

        /* ── Slider ── */
        .ev-slider {
          position: relative;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(1.5rem, 5vw, 4rem);
        }

        .ev-track {
          position: relative;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: clamp(1.5rem, 3vw, 3rem);
          align-items: center;
          min-height: 560px;
        }

        @media (max-width: 768px) {
          .ev-track { grid-template-columns: 1fr; min-height: auto; }
        }

        /* image side */
        .ev-img-wrap {
          position: relative;
          height: clamp(360px, 55vw, 580px);
          overflow: hidden;
        }

        /* offset decorative border */
        .ev-img-wrap::before {
          content: '';
          position: absolute;
          top: -12px; left: -12px;
          right: 12px; bottom: 12px;
          border: 1px solid var(--ev-border);
          z-index: 0;
          pointer-events: none;
        }

        .ev-img-inner {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
        }

        .ev-img-inner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.82) saturate(0.88);
          transition: filter 0.6s ease;
        }

        .ev-img-wrap:hover .ev-img-inner img {
          filter: brightness(0.72) saturate(0.95);
        }

        /* category badge */
        .ev-badge {
          position: absolute;
          top: 1.2rem;
          left: 1.2rem;
          z-index: 3;
          font-size: 0.52rem;
          font-weight: 300;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: var(--ev-ink);
          background: var(--ev-gold);
          padding: 5px 12px;
        }

        /* image index */
        .ev-img-index {
          position: absolute;
          bottom: 1.2rem;
          right: 1.2rem;
          z-index: 3;
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.75rem;
          font-weight: 300;
          color: rgba(245,240,232,0.4);
          letter-spacing: 0.2em;
        }

        /* content side */
        .ev-content {
          padding: clamp(1rem, 3vw, 2rem) 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .ev-event-category {
          font-size: 0.55rem;
          letter-spacing: 0.42em;
          text-transform: uppercase;
          color: var(--ev-gold);
          font-weight: 300;
          margin-bottom: 1.2rem;
        }

        .ev-event-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 4vw, 2.9rem);
          font-weight: 300;
          line-height: 1.12;
          color: var(--ev-cream);
          margin-bottom: 1.2rem;
        }

        .ev-event-rule {
          width: 40px;
          height: 1px;
          background: var(--ev-gold);
          margin-bottom: 1.4rem;
        }

        .ev-event-subtitle {
          font-size: 0.82rem;
          font-weight: 300;
          color: var(--ev-dim);
          line-height: 1.9;
          margin-bottom: 2rem;
          max-width: 380px;
        }

        .ev-meta {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-bottom: 2.5rem;
        }

        .ev-meta-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .ev-meta-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--ev-gold);
          flex-shrink: 0;
        }

        .ev-meta-text {
          font-size: 0.7rem;
          font-weight: 300;
          letter-spacing: 0.12em;
          color: var(--ev-dim);
        }

        .ev-enquire-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.82rem 2.2rem;
          border: 1px solid var(--ev-gold);
          color: var(--ev-gold-lt);
          font-family: 'Jost', sans-serif;
          font-size: 0.6rem;
          font-weight: 300;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          text-decoration: none;
          background: transparent;
          position: relative;
          overflow: hidden;
          transition: color 0.35s ease;
          align-self: flex-start;
        }

        .ev-enquire-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--ev-gold);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
        }

        .ev-enquire-btn:hover::before { transform: scaleX(1); }
        .ev-enquire-btn:hover { color: #000; }
        .ev-enquire-btn span { position: relative; z-index: 1; }

        /* ── nav controls ── */
        .ev-controls {
          max-width: 1280px;
          margin: 3rem auto 0;
          padding: 0 clamp(1.5rem, 5vw, 4rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        /* prev / next */
        .ev-arrows {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .ev-arrow {
          width: 48px;
          height: 48px;
          border: 1px solid var(--ev-border);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--ev-cream);
          transition: border-color 0.25s, background 0.25s, color 0.25s;
        }

        .ev-arrow:hover {
          border-color: var(--ev-gold);
          background: var(--ev-gold);
          color: #000;
        }

        .ev-arrow svg {
          width: 16px;
          height: 16px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        /* progress dots */
        .ev-dots {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .ev-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          border: 1px solid var(--ev-border);
          background: transparent;
          cursor: pointer;
          transition: background 0.3s, border-color 0.3s, transform 0.3s;
        }

        .ev-dot.active {
          background: var(--ev-gold);
          border-color: var(--ev-gold);
          transform: scale(1.35);
        }

        /* progress bar */
        .ev-progress {
          flex: 1;
          max-width: 200px;
          height: 1px;
          background: rgba(201,169,110,0.12);
          position: relative;
          overflow: hidden;
        }

        .ev-progress-fill {
          position: absolute;
          top: 0; left: 0; bottom: 0;
          background: var(--ev-gold);
          transition: width 0.4s ease;
        }

        /* ── thumbnail strip ── */
        .ev-thumbs {
          max-width: 1280px;
          margin: 2rem auto 0;
          padding: 0 clamp(1.5rem, 5vw, 4rem);
          display: flex;
          gap: 0.6rem;
        }

        .ev-thumb {
          flex: 1;
          height: 64px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          opacity: 0.35;
          transition: opacity 0.3s;
          border: 1px solid transparent;
        }

        .ev-thumb.active {
          opacity: 1;
          border-color: var(--ev-gold);
        }

        .ev-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0.7);
          transition: filter 0.3s;
        }

        .ev-thumb.active img { filter: saturate(1); }
        .ev-thumb:hover { opacity: 0.75; }
      `}</style>

      <section
        className="ev-section"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* ── HEADER ── */}
        <div className="ev-header">
          <motion.div
            className="ev-header-left"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="ev-eyebrow">
              <div className="ev-eyebrow-line" />
              <span className="ev-eyebrow-text">Signature Events &amp; Gatherings</span>
            </div>
            <h2 className="ev-heading">
              Moments Crafted<br />for the <em>Extraordinary</em>
            </h2>
          </motion.div>

          <motion.div
            className="ev-header-right"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <span className="ev-count">
              <strong>{String(current + 1).padStart(2, "0")}</strong>
              {" "}/{" "}
              {String(events.length).padStart(2, "0")}
            </span>
            <Link href="/events" className="ev-view-all">
              View All Events
            </Link>
          </motion.div>
        </div>

        {/* ── MAIN SLIDER ── */}
        <div className="ev-slider">
          <div className="ev-track">

            {/* Image */}
            <div className="ev-img-wrap">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={current}
                  className="ev-img-inner"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <img
                    src={getImageUrl(events[current].src)}
                    alt={events[current].title}
                  />
                  <span className="ev-badge">{events[current].category}</span>
                  <span className="ev-img-index">
                    {String(current + 1).padStart(2, "0")} / {String(events.length).padStart(2, "0")}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Content */}
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={`content-${current}`}
                className="ev-content"
                custom={direction}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <span className="ev-event-category">{events[current].category}</span>
                <h3 className="ev-event-title">{events[current].title}</h3>
                <div className="ev-event-rule" />
                <p className="ev-event-subtitle">{events[current].subtitle}</p>

                <div className="ev-meta">
                  <div className="ev-meta-row">
                    <span className="ev-meta-dot" />
                    <span className="ev-meta-text">{events[current].date}</span>
                  </div>
                  <div className="ev-meta-row">
                    <span className="ev-meta-dot" />
                    <span className="ev-meta-text">{events[current].location}</span>
                  </div>
                </div>

                <Link href="/contact" className="ev-enquire-btn">
                  <span>Enquire About This Event</span>
                </Link>
              </motion.div>
            </AnimatePresence>

          </div>
        </div>

        {/* ── THUMBNAIL STRIP ── */}
        <div className="ev-thumbs">
          {events.map((ev, i) => (
            <button
              key={i}
              className={`ev-thumb${i === current ? " active" : ""}`}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              aria-label={`Go to event ${i + 1}`}
            >
              <img src={getImageUrl(ev.src)} alt={ev.title} />
            </button>
          ))}
        </div>

        {/* ── CONTROLS ── */}
        <div className="ev-controls">
          {/* Arrows */}
          <div className="ev-arrows">
            <button className="ev-arrow" onClick={prev} aria-label="Previous event">
              <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button className="ev-arrow" onClick={next} aria-label="Next event">
              <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>

          {/* Progress bar */}
          <div className="ev-progress">
            <div
              className="ev-progress-fill"
              style={{ width: `${((current + 1) / events.length) * 100}%` }}
            />
          </div>

          {/* Dots */}
          <div className="ev-dots">
            {events.map((_, i) => (
              <button
                key={i}
                className={`ev-dot${i === current ? " active" : ""}`}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                aria-label={`Go to event ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </section>
    </>
  );
}
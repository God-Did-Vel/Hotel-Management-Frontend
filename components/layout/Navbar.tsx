"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";



const LOGO_URL =
  "https://res.cloudinary.com/duweg8kpv/image/upload/v1772902061/logo_geg3c4.png";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms & Suites" },
  { href: "/gallery", label: "Gallery" },
  { href: "/login", label: "Sign In" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const markerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* ── Thin announcement bar ── */}
      <div className="nb-announce">
        <span>✦</span>
        <span>Complimentary Spa Access on Stays of 3 Nights or More</span>
        <span>✦</span>
        <span className="nb-phone">
          <Phone size={11} style={{ display: "inline", marginRight: 5 }} />
          +234 91 1234 5678
        </span>
      </div>

      {/* ── Main Navbar ── */}
      <nav className={`nb-nav ${scrolled ? "nb-nav--scrolled" : ""}`}>
        {/* Top ornamental line */}
        <div className="nb-ornament-line" />

        <div className="nb-inner">
          {/* ── Logo ── */}
          <Link href="/" className="nb-logo" aria-label="N&B Italian Hotel Home">
            <img
              src={LOGO_URL}
              alt="N&B Italian Hotel"
              className={`nb-logo-img ${scrolled ? "nb-logo-img--sm" : ""}`}
            />
            {/* Fallback wordmark shown when logo fails or is hidden */}
            <span className="nb-wordmark">
              <span className="nb-wordmark-main">N&B</span>
              <span className="nb-wordmark-sub">Italian Hotel</span>
            </span>
          </Link>

          {/* ── Desktop Links ── */}
          <div className="nb-links" ref={navRef}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setActiveLink(link.href)}
                className={`nb-link ${activeLink === link.href ? "nb-link--active" : ""}`}
              >
                {link.label}
                <span className="nb-link-bar" />
              </Link>
            ))}

            <div className="nb-divider" />

            <Link href="/book" className="nb-cta">
              <span className="nb-cta-fill" />
              <span className="nb-cta-text">Book Now</span>
            </Link>
          </div>

          {/* ── Mobile Toggle ── */}
          <button
            className="nb-hamburger"
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            <span className={`nb-ham-icon ${isOpen ? "nb-ham-icon--open" : ""}`}>
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>

        {/* Bottom ornamental line */}
        <div className="nb-ornament-line nb-ornament-line--bottom" />
      </nav>

      {/* ── Mobile Drawer ── */}
      <div className={`nb-drawer ${isOpen ? "nb-drawer--open" : ""}`} aria-hidden={!isOpen}>
        <div className="nb-drawer-inner">
          <img src={LOGO_URL} alt="N&B Italian Hotel" className="nb-drawer-logo" />

          <div className="nb-drawer-ornament">
            <span />
            <span className="nb-drawer-diamond">◆</span>
            <span />
          </div>

          <nav className="nb-drawer-links">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => { setIsOpen(false); setActiveLink(link.href); }}
                className="nb-drawer-link"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/book"
            onClick={() => setIsOpen(false)}
            className="nb-drawer-cta"
          >
            Reserve Your Stay
          </Link>

          <p className="nb-drawer-phone">
            <Phone size={12} />
            +234 91 1234 5678
          </p>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="nb-overlay" onClick={() => setIsOpen(false)} aria-hidden />
      )}

      <style>{`
        /* ── Google Fonts ── */
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

        /* ── Tokens ── */
        :root {
          --nb-gold: #c9a96e;
          --nb-gold-light: #e8d5aa;
          --nb-gold-dark: #a07840;
          --nb-black: #0a0a0a;
          --nb-white: #f5f0e8;
          --nb-glass: rgba(8, 6, 4, 0.88);
          --nb-serif: 'Cormorant Garamond', Georgia, serif;
          --nb-sans: 'Montserrat', sans-serif;
        }

        /* ── Announcement Bar ── */
        .nb-announce {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 60;
          background: var(--nb-gold-dark);
          color: var(--nb-white);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding: 6px 16px;
          font-family: var(--nb-sans);
          font-size: 9.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .nb-phone { margin-left: auto; display: flex; align-items: center; gap: 4px; opacity: 0.85; }
        @media (max-width: 600px) { .nb-phone { display: none; } }

        /* ── Navbar Shell ── */
        .nb-nav {
          position: fixed;
          top: 28px; left: 0; right: 0;
          z-index: 50;
          transition: background 0.5s ease, padding 0.4s ease, top 0.4s ease, box-shadow 0.4s ease;
          background: linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 100%);
          padding: 20px 0 0;
        }
        .nb-nav--scrolled {
          background: var(--nb-glass);
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          box-shadow: 0 2px 40px rgba(0,0,0,0.6), 0 1px 0 rgba(201,169,110,0.25);
          padding: 0;
        }

        /* ── Ornament lines ── */
        .nb-ornament-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--nb-gold) 30%, var(--nb-gold) 70%, transparent);
          opacity: 0.3;
          transition: opacity 0.4s;
        }
        .nb-nav--scrolled .nb-ornament-line { opacity: 0.5; }
        .nb-ornament-line--bottom { opacity: 0; }
        .nb-nav--scrolled .nb-ornament-line--bottom { opacity: 0.2; }

        /* ── Inner layout ── */
        .nb-inner {
          max-width: 1340px;
          margin: 0 auto;
          padding: 14px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        @media (max-width: 900px) { .nb-inner { padding: 12px 24px; } }

        /* ── Logo ── */
        .nb-logo {
          display: flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .nb-logo-img {
          height: 52px;
          width: auto;
          object-fit: contain;
          transition: height 0.4s ease, filter 0.4s ease;
          filter: brightness(0) invert(1);  /* white logo; remove if logo already fits */
        }
        .nb-logo-img--sm { height: 38px; }
        .nb-wordmark {
          display: flex;
          flex-direction: column;
          line-height: 1;
          border-left: 1px solid rgba(201,169,110,0.5);
          padding-left: 14px;
        }
        .nb-wordmark-main {
          font-family: var(--nb-serif);
          font-size: 22px;
          font-weight: 300;
          letter-spacing: 0.12em;
          color: var(--nb-white);
          font-style: italic;
        }
        .nb-wordmark-sub {
          font-family: var(--nb-sans);
          font-size: 7.5px;
          font-weight: 500;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--nb-gold);
          margin-top: 3px;
        }

        /* ── Desktop links ── */
        .nb-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        @media (max-width: 768px) { .nb-links { display: none; } }

        .nb-link {
          position: relative;
          font-family: var(--nb-sans);
          font-size: 9.5px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.8);
          text-decoration: none;
          transition: color 0.3s;
          padding-bottom: 2px;
        }
        .nb-link:hover, .nb-link--active { color: var(--nb-gold-light); }
        .nb-link-bar {
          position: absolute;
          bottom: -2px; left: 0;
          height: 1px;
          width: 0;
          background: var(--nb-gold);
          transition: width 0.35s cubic-bezier(.4,0,.2,1);
        }
        .nb-link:hover .nb-link-bar,
        .nb-link--active .nb-link-bar { width: 100%; }

        .nb-divider {
          width: 1px;
          height: 18px;
          background: linear-gradient(180deg, transparent, var(--nb-gold), transparent);
          opacity: 0.5;
        }

        /* ── CTA Button ── */
        .nb-cta {
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          border: 1px solid var(--nb-gold);
          padding: 10px 24px;
          font-family: var(--nb-sans);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--nb-gold);
          text-decoration: none;
          transition: color 0.35s;
          white-space: nowrap;
        }
        .nb-cta:hover { color: var(--nb-black); }
        .nb-cta-fill {
          position: absolute;
          inset: 0;
          background: var(--nb-gold);
          transform: translateY(100%);
          transition: transform 0.35s cubic-bezier(.4,0,.2,1);
        }
        .nb-cta:hover .nb-cta-fill { transform: translateY(0); }
        .nb-cta-text { position: relative; z-index: 1; }

        /* ── Hamburger ── */
        .nb-hamburger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        @media (max-width: 768px) { .nb-hamburger { display: block; } }

        .nb-ham-icon {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 26px;
        }
        .nb-ham-icon span {
          display: block;
          height: 1px;
          background: var(--nb-gold-light);
          transition: transform 0.3s, opacity 0.3s, width 0.3s;
        }
        .nb-ham-icon span:nth-child(2) { width: 70%; margin-left: auto; }
        .nb-ham-icon--open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .nb-ham-icon--open span:nth-child(2) { opacity: 0; width: 100%; }
        .nb-ham-icon--open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

        /* ── Mobile Drawer ── */
        .nb-overlay {
          position: fixed;
          inset: 0;
          z-index: 55;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
        }
        .nb-drawer {
          position: fixed;
          top: 0; right: 0;
          z-index: 56;
          width: min(360px, 85vw);
          height: 100dvh;
          background: #0d0b08;
          border-left: 1px solid rgba(201,169,110,0.2);
          transform: translateX(100%);
          transition: transform 0.45s cubic-bezier(.4,0,.2,1);
          display: flex;
          flex-direction: column;
        }
        .nb-drawer--open { transform: translateX(0); }
        .nb-drawer-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px 32px 40px;
          height: 100%;
        }
        .nb-drawer-logo {
          height: 44px;
          width: auto;
          object-fit: contain;
          filter: brightness(0) invert(1);
          margin-bottom: 28px;
        }
        .nb-drawer-ornament {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          margin-bottom: 36px;
        }
        .nb-drawer-ornament span:not(.nb-drawer-diamond) {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,169,110,0.4));
        }
        .nb-drawer-ornament span:last-child {
          background: linear-gradient(270deg, transparent, rgba(201,169,110,0.4));
        }
        .nb-drawer-diamond {
          font-size: 8px;
          color: var(--nb-gold);
          flex: 0;
        }
        .nb-drawer-links {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          width: 100%;
          flex: 1;
        }
        .nb-drawer-link {
          font-family: var(--nb-serif);
          font-size: 22px;
          font-weight: 300;
          font-style: italic;
          letter-spacing: 0.05em;
          color: rgba(245,240,232,0.75);
          text-decoration: none;
          padding: 8px 0;
          transition: color 0.25s, transform 0.25s;
          animation: nb-fade-in 0.4s ease both;
        }
        .nb-drawer-link:hover { color: var(--nb-gold-light); transform: translateX(6px); }

        @keyframes nb-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .nb-drawer-cta {
          display: block;
          width: 100%;
          text-align: center;
          border: 1px solid var(--nb-gold);
          color: var(--nb-gold);
          font-family: var(--nb-sans);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 14px;
          margin-bottom: 20px;
          transition: background 0.3s, color 0.3s;
        }
        .nb-drawer-cta:hover { background: var(--nb-gold); color: var(--nb-black); }
        .nb-drawer-phone {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--nb-sans);
          font-size: 10px;
          letter-spacing: 0.12em;
          color: rgba(201,169,110,0.5);
          margin: 0;
        }
      `}</style>
    </>
  );
}
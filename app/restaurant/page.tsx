"use client";

import { motion } from "framer-motion";
import { Flame, UtensilsCrossed, Wine } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/api";

const meals = [
  // Soups & Starters
  { name: "Ofe Onugbu", description: "Bitter leaf soup slow-cooked with assorted meats, orishirishi, and hand-pressed palm oil.", price: "₦18,500", category: "Soup" },
  { name: "Egusi Royale", description: "Ground melon seed soup enriched with uziza leaves, smoked catfish, and goat meat.", price: "₦17,000", category: "Soup" },
  { name: "Pepper Soup du Jour", description: "Spiced aromatic broth with fresh catfish or goat offal — served tableside.", price: "₦14,500", category: "Starter" },
  { name: "Edikaikong", description: "Verdant Cross-River vegetable soup with waterleaf, fluted pumpkin, and periwinkles.", price: "₦19,000", category: "Soup" },

  // Mains
  { name: "Jollof Rice Prestige", description: "Long-grain parboiled rice, slow-smoked in firewood tomato sauce, served with plantain and a whole grilled tilapia.", price: "₦24,000", category: "Main" },
  { name: "Ofada Rice & Ayamase", description: "Local unpolished ofada rice paired with the iconic designer stew — assorted meats, tatashe, and locust bean.", price: "₦22,500", category: "Main" },
  { name: "Suya Platter", description: "Skewered prime beef and chicken, spiced with our house yaji blend, served with sliced onion and tomato.", price: "₦28,000", category: "Main" },
  { name: "Nkwobi Experience", description: "Spiced cow foot slow-cooked in palm kernel sauce with utazi leaves and garden egg.", price: "₦26,000", category: "Main" },
  { name: "Banga Soup & Starch", description: "Urhobo-style palm nut soup, aromatic with oburunbebe spice, beletete herb, and assorted seafood.", price: "₦23,000", category: "Main" },
  { name: "Grilled Whole Tilapia", description: "Seasoned with African spices, char-grilled over hardwood, served with fried yam and pepper sauce.", price: "₦32,000", category: "Main" },

  // Sides & Swallows
  { name: "Pounded Yam Artisanal", description: "Freshly pounded in a traditional mortar — served warm with your choice of soup.", price: "₦6,500", category: "Swallow" },
  { name: "Plantain Duo", description: "Bole and dodo — roasted and fried ripe plantain served with groundnut sauce.", price: "₦9,000", category: "Side" },

  // Desserts
  { name: "Puff Puff Soufflé", description: "Light Nigerian doughnuts dusted in cinnamon sugar, served with baobab caramel dipping sauce.", price: "₦11,500", category: "Dessert" },
  { name: "Zobo Granita", description: "Chilled hibiscus and ginger sorbet, garnished with dried roselle petals.", price: "₦9,500", category: "Dessert" },
];

const experiences = [
  {
    icon: Flame,
    title: "The Firewood Kitchen",
    desc: "Our open kitchen uses traditional firewood and clay pots to honour the smoke-kissed depth that defines authentic Nigerian cuisine.",
  },
  {
    icon: UtensilsCrossed,
    title: "Private Dining",
    desc: "Intimate rooms dressed in Ankara prints and hand-carved mahogany — bespoke menus and dedicated service for your most special occasions.",
  },
  {
    icon: Wine,
    title: "Palm Wine & Craft Bar",
    desc: "Fresh-tapped palm wine, zobo cocktails, and curated African spirits served in our candlelit lounge overlooking the garden terrace.",
  },
];

export default function RestaurantPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@200;300;400;500&display=swap');

        :root {
          --ink:      #080805;
          --surface:  #100f0c;
          --card:     #141310;
          --cream:    #f4ede0;
          --gold:     #b87333;
          --gold-lt:  #d4944a;
          --gold-dim: rgba(184,115,51,0.14);
          --dim:      rgba(244,237,224,0.42);
          --green:    #2d5a1b;
          --border:   rgba(184,115,51,0.14);
          --rule:     rgba(244,237,224,0.07);
        }

        .rp { background: var(--ink); min-height: 100vh; color: var(--cream); font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

        /* noise */
        .rp::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        /* ── HERO ── */
        .rp-hero {
          position: relative;
          height: 100vh;
          min-height: 600px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding-bottom: 7rem;
          text-align: center;
          overflow: hidden;
        }

        .rp-hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .rp-hero-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.32) saturate(0.65);
        }

        .rp-hero-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(8,8,5,0.15) 0%, rgba(8,8,5,0) 30%, rgba(8,8,5,0.88) 100%);
          z-index: 1;
        }

        .rp-hero-content { position: relative; z-index: 2; }

        .rp-eyebrow {
          display: block;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.52em;
          text-transform: uppercase;
          color: var(--gold-lt);
          margin-bottom: 1.2rem;
        }

        .rp-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3.6rem, 6vw, 6rem);
          font-weight: 300;
          line-height: 0.9;
          letter-spacing: -0.01em;
          color: var(--cream);
          margin: 0 0 1.5rem;
        }

        .rp-h1 em { font-style: italic; color: var(--gold-lt); }

        .rp-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin: 0 auto 1.5rem;
        }

        .rp-divider span { width: 50px; height: 1px; }
        .rp-divider span:first-child { background: linear-gradient(90deg, transparent, var(--gold-lt)); }
        .rp-divider span:last-child  { background: linear-gradient(90deg, var(--gold-lt), transparent); }
        .rp-divider i { font-style: normal; font-size: 0.42rem; color: var(--gold-lt); }

        .rp-hero-sub {
          font-size: clamp(0.72rem, 1.4vw, 0.82rem);
          font-weight: 300;
          letter-spacing: 0.14em;
          color: var(--dim);
          max-width: 460px;
          margin: 0 auto 2.5rem;
          line-height: 2;
        }

        .rp-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 2.4rem;
          border: 1px solid var(--gold);
          color: var(--gold-lt);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6rem;
          font-weight: 400;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          text-decoration: none;
          background: transparent;
          position: relative;
          overflow: hidden;
          transition: color 0.35s ease;
          cursor: pointer;
        }

        .rp-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--gold);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
        }

        .rp-btn:hover::before { transform: scaleX(1); }
        .rp-btn:hover { color: #000; }
        .rp-btn > * { position: relative; z-index: 1; }

        /* scroll indicator */
        .rp-scroll {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .rp-scroll-line {
          width: 1px;
          height: 44px;
          background: linear-gradient(180deg, var(--gold), transparent);
          animation: scrollPulse 2.2s ease-in-out infinite;
        }

        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 1; }
        }

        .rp-scroll-text {
          font-size: 0.48rem;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 300;
        }

        /* ── LAYOUT WRAPPER ── */
        .rp-wrap {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 clamp(1.5rem, 5vw, 4rem);
          position: relative;
          z-index: 1;
        }

        /* ── STORY ── */
        .rp-story {
          padding: 8rem 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(3rem, 6vw, 6rem);
          align-items: center;
        }

        @media (max-width: 768px) { .rp-story { grid-template-columns: 1fr; } }

        .rp-story-img {
          position: relative;
          height: 580px;
          overflow: hidden;
        }

        /* offset frame */
        .rp-story-img::before {
          content: '';
          position: absolute;
          top: -14px;
          left: -14px;
          right: 14px;
          bottom: 14px;
          border: 1px solid var(--border);
          z-index: 0;
          pointer-events: none;
        }

        .rp-story-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: relative;
          z-index: 1;
          transition: transform 1s cubic-bezier(0.25,0.46,0.45,0.94);
        }

        .rp-story-img:hover img { transform: scale(1.04); }

        .rp-label {
          font-size: 0.56rem;
          letter-spacing: 0.48em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 300;
          display: block;
          margin-bottom: 1.1rem;
        }

        .rp-h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4.5vw, 3.2rem);
          font-weight: 300;
          line-height: 1.15;
          color: var(--cream);
          margin-bottom: 1.4rem;
        }

        .rp-h2 em { font-style: italic; color: var(--gold-lt); }

        .rp-rule { width: 44px; height: 1px; background: var(--gold); margin-bottom: 1.5rem; }

        .rp-body {
          font-size: 0.84rem;
          font-weight: 300;
          color: var(--dim);
          line-height: 2;
          margin-bottom: 1.2rem;
        }

        .rp-hours {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 2.4rem;
        }

        .rp-hours span:first-child {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gold);
          flex-shrink: 0;
          display: inline-block;
        }

        .rp-hours-text {
          font-size: 0.72rem;
          font-weight: 300;
          letter-spacing: 0.12em;
          color: var(--dim);
        }

        /* ── MENU ── */
        .rp-menu-section {
          padding: 5rem 0 7rem;
          border-top: 1px solid var(--rule);
        }

        .rp-menu-header {
          text-align: center;
          margin-bottom: 4.5rem;
        }

        .rp-menu-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 6vw, 4.2rem);
          font-weight: 300;
          color: var(--cream);
          line-height: 1;
          margin: 0.6rem 0 0.75rem;
        }

        .rp-menu-title em { font-style: italic; color: var(--gold-lt); }

        .rp-menu-sub {
          font-size: 0.7rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          color: var(--dim);
        }

        .rp-center-rule {
          width: 1px;
          height: 36px;
          background: linear-gradient(180deg, var(--gold), transparent);
          margin: 1.2rem auto 0;
        }

        /* category dividers */
        .rp-menu-category-header {
          grid-column: 1 / -1;
          padding: 2rem 0 0.75rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 0.5rem;
        }

        .rp-menu-category-label {
          font-size: 0.55rem;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 300;
        }

        .rp-menu-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }

        @media (max-width: 680px) { .rp-menu-grid { grid-template-columns: 1fr; } }

        .rp-menu-item {
          padding: 1.8rem 0;
          border-bottom: 1px solid var(--rule);
          transition: background 0.2s;
          cursor: default;
        }

        .rp-menu-item:nth-child(odd)  { padding-right: clamp(1rem, 4vw, 3rem); }
        .rp-menu-item:nth-child(even) { padding-left: clamp(1rem, 4vw, 3rem); border-left: 1px solid var(--rule); }
        .rp-menu-item:hover { background: rgba(184,115,51,0.03); }

        .rp-menu-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.35rem;
          gap: 1rem;
        }

        .rp-menu-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.12rem;
          font-weight: 400;
          color: var(--cream);
          transition: color 0.2s;
          line-height: 1.2;
        }

        .rp-menu-item:hover .rp-menu-name { color: var(--gold-lt); }

        .rp-menu-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.95rem;
          font-weight: 300;
          color: var(--gold);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .rp-menu-desc {
          font-size: 0.74rem;
          font-weight: 300;
          font-style: italic;
          color: var(--dim);
          line-height: 1.7;
          margin-bottom: 0.45rem;
        }

        .rp-menu-tag {
          font-size: 0.5rem;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: rgba(184,115,51,0.5);
          font-weight: 300;
        }

        /* ── EXPERIENCES ── */
        .rp-exp-section {
          padding: 6rem 0 5rem;
          border-top: 1px solid var(--rule);
        }

        .rp-exp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--rule);
          border: 1px solid var(--rule);
          margin-top: 4rem;
        }

        @media (max-width: 768px) { .rp-exp-grid { grid-template-columns: 1fr; } }

        .rp-exp-item {
          background: var(--ink);
          padding: 2.8rem 2.2rem;
          text-align: center;
          position: relative;
          transition: background 0.3s;
        }

        .rp-exp-item:hover { background: var(--surface); }

        .rp-exp-icon {
          width: 38px;
          height: 38px;
          color: var(--gold);
          margin: 0 auto 1.6rem;
          display: block;
        }

        .rp-exp-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.25rem;
          font-weight: 400;
          color: var(--cream);
          margin-bottom: 0.7rem;
        }

        .rp-exp-desc {
          font-size: 0.78rem;
          font-weight: 300;
          color: var(--dim);
          line-height: 1.85;
        }

        .rp-exp-bar {
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 2px;
          background: var(--gold);
          transition: width 0.5s ease;
        }

        .rp-exp-item:hover .rp-exp-bar { width: 100%; }

        /* ── CTA BAND ── */
        .rp-cta {
          border-top: 1px solid var(--rule);
          padding: 6rem clamp(1.5rem, 5vw, 4rem);
          text-align: center;
          background: linear-gradient(180deg, transparent, rgba(184,115,51,0.04));
          position: relative;
          z-index: 1;
        }

        .rp-cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 300;
          color: var(--cream);
          margin: 0.8rem 0 1rem;
          line-height: 1.1;
        }

        .rp-cta-title em { font-style: italic; color: var(--gold-lt); }

        .rp-cta-sub {
          font-size: 0.78rem;
          font-weight: 300;
          letter-spacing: 0.12em;
          color: var(--dim);
          max-width: 420px;
          margin: 0 auto 2.5rem;
          line-height: 2;
        }
      `}</style>

      <div className="rp">

        {/* ── HERO ── */}
        <section className="rp-hero">
          <div className="rp-hero-bg">
            <img
              src={getImageUrl("https://res.cloudinary.com/duweg8kpv/image/upload/v1773930508/Restaurant_thhdgg.jpg")}
              alt="N&B African Dining Room"
            />
          </div>
          <div className="rp-hero-vignette" />

          <motion.div
            className="rp-hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* <span className="rp-eyebrow">N&amp;B Hotel · African Culinary Arts</span> */}
            <h1 className="rp-h1">
              Taste of<br /><em>Africa</em>
            </h1>
            <div className="rp-divider">
              <span /><i>◆</i><span />
            </div>
            <p className="rp-hero-sub">
              Where the richness of Nigerian and African tradition meets the elegance of fine dining. Every dish is a homecoming.
            </p>
            <Link href="/book" className="rp-btn">
              <span>Reserve a Table</span>
            </Link>
          </motion.div>

          <div className="rp-scroll">
            <div className="rp-scroll-line" />
            <span className="rp-scroll-text">Scroll</span>
          </div>
        </section>

        {/* ── STORY ── */}
        <div className="rp-wrap">
          <div className="rp-story">
            <motion.div
              className="rp-story-img"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              <Image
                src={getImageUrl("https://res.cloudinary.com/duweg8kpv/image/upload/v1773930508/Restaurant_thhdgg.jpg")}
                alt="The African Dining Room"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 580px"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              <span className="rp-label">The Signature Restaurant</span>
              <h2 className="rp-h2">
                The African<br /><em>Dining Room</em>
              </h2>
              <div className="rp-rule" />
              <p className="rp-body">
                Our kitchen honours the depth and complexity of West African cuisine — rooted in centuries of tradition, elevated for the contemporary palate. Every recipe is sourced from the finest regional ingredients: fresh palm oil from Benue, smoked catfish from the Niger Delta, and heirloom spices from Jos markets.
              </p>
              <p className="rp-body">
                The dining room is dressed in warm earth tones, hand-woven kente accents, and soft candlelight — a space where culture and comfort are one.
              </p>
              <div className="rp-hours">
                <span />
                <span className="rp-hours-text">Open daily · 12:00 PM — 11:00 PM</span>
              </div>
              <Link href="/book" className="rp-btn">
                <span>Reserve a Table</span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ── MENU ── */}
        <div className="rp-wrap">
          <section className="rp-menu-section">
            <div className="rp-menu-header">
              <motion.span className="rp-label" style={{ display: "block" }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                Curated Selections
              </motion.span>
              <motion.h2 className="rp-menu-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                À La Carte <em>Menu</em>
              </motion.h2>
              <motion.p className="rp-menu-sub" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                All prices inclusive of VAT · Menu changes with market season
              </motion.p>
              <div className="rp-center-rule" />
            </div>

            <div className="rp-menu-grid">
              {meals.map((meal, i) => (
                <motion.div
                  key={i}
                  className="rp-menu-item"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="rp-menu-top">
                    <span className="rp-menu-name">{meal.name}</span>
                    <span className="rp-menu-price">{meal.price}</span>
                  </div>
                  <p className="rp-menu-desc">{meal.description}</p>
                  <span className="rp-menu-tag">{meal.category}</span>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* ── EXPERIENCES ── */}
        <div className="rp-wrap">
          <section className="rp-exp-section">
            <div style={{ textAlign: "center" }}>
              <motion.span className="rp-label" style={{ display: "block" }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                Beyond the Plate
              </motion.span>
              <motion.h2
                className="rp-h2"
                style={{ textAlign: "center", fontSize: "clamp(2rem,5vw,3rem)" }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              >
                Every Moment, <em>Considered</em>
              </motion.h2>
            </div>

            <div className="rp-exp-grid">
              {experiences.map((item, i) => (
                <motion.div
                  key={i}
                  className="rp-exp-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                >
                  <item.icon className="rp-exp-icon" strokeWidth={1} />
                  <h4 className="rp-exp-title">{item.title}</h4>
                  <p className="rp-exp-desc">{item.desc}</p>
                  <div className="rp-exp-bar" />
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* ── CTA BAND ── */}
        <div className="rp-cta">
          <motion.span className="rp-eyebrow" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            An Invitation to Dine
          </motion.span>
          <motion.h2 className="rp-cta-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            Your Table<br /><em>Awaits</em>
          </motion.h2>
          <motion.p className="rp-cta-sub" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            Reservations are recommended. Private dining rooms available for groups, celebrations, and corporate evenings.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <Link href="/book" className="rp-btn">
              <span>Make a Reservation</span>
            </Link>
          </motion.div>
        </div>

      </div>
    </>
  );
}
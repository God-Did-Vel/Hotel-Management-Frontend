"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  /* auto-play muted on mount */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, []);

  /* track progress */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setProgress((v.currentTime / v.duration) * 100 || 0);
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
    } else {
      v.play().catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@200;300;400&display=swap');

        :root {
          --vs-gold:    #c9a96e;
          --vs-gold-lt: #e8d4a8;
          --vs-cream:   #f5f0e8;
          --vs-dim:     rgba(245,240,232,0.45);
          --vs-border:  rgba(201,169,110,0.25);
        }

        .vs-root {
          position: relative;
          width: 100%;
          height: 100svh;
          min-height: 560px;
          overflow: hidden;
          background: #050505;
          font-family: 'Jost', sans-serif;
        }

        /* ── video ── */
        .vs-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          opacity: 0;
          transition: opacity 1.2s ease;
        }

        .vs-video.loaded { opacity: 1; }

        /* ── layered overlays ── */
        .vs-overlay-base {
          position: absolute;
          inset: 0;
          background: rgba(5,5,5,0.55);
          z-index: 1;
        }

        .vs-overlay-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(5,5,5,0.65) 100%);
          z-index: 2;
        }

        .vs-overlay-bottom {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 40%;
          background: linear-gradient(to top, rgba(5,5,5,0.9) 0%, transparent 100%);
          z-index: 3;
        }

        /* ── top strip ── */
        .vs-top-strip {
          position: absolute;
          top: 0; left: 0; right: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: clamp(1.2rem, 3vw, 2rem) clamp(1.5rem, 5vw, 3.5rem);
        }

        .vs-strip-label {
          font-size: 0.55rem;
          font-weight: 300;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: var(--vs-gold);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .vs-strip-label::before {
          content: '';
          display: inline-block;
          width: 32px;
          height: 1px;
          background: var(--vs-gold);
        }

        .vs-mute-btn {
          background: rgba(245,240,232,0.06);
          border: 1px solid var(--vs-border);
          color: var(--vs-cream);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.25s, border-color 0.25s;
        }

        .vs-mute-btn:hover {
          background: rgba(201,169,110,0.12);
          border-color: var(--vs-gold);
        }

        .vs-mute-btn svg {
          width: 14px;
          height: 14px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        /* ── centre content ── */
        .vs-center {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 clamp(1.5rem, 5vw, 3rem);
        }

        /* play button */
        .vs-play-ring {
          position: relative;
          width: clamp(72px, 10vw, 96px);
          height: clamp(72px, 10vw, 96px);
          margin-bottom: clamp(2rem, 4vw, 3rem);
          cursor: pointer;
        }

        /* outer spinning ring */
        .vs-play-ring::before {
          content: '';
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 1px solid rgba(201,169,110,0.25);
          animation: ringRotate 12s linear infinite;
        }

        @keyframes ringRotate {
          to { transform: rotate(360deg); }
        }

        /* dashed segment */
        .vs-play-ring::after {
          content: '';
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 1px dashed rgba(201,169,110,0.15);
        }

        .vs-play-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(245,240,232,0.07);
          border: 1px solid var(--vs-border);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s, border-color 0.3s, transform 0.3s;
        }

        .vs-play-ring:hover .vs-play-inner {
          background: rgba(201,169,110,0.15);
          border-color: var(--vs-gold);
          transform: scale(1.06);
        }

        .vs-play-inner svg {
          width: clamp(18px, 2.5vw, 24px);
          height: clamp(18px, 2.5vw, 24px);
          stroke: var(--vs-cream);
          fill: none;
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: stroke 0.25s;
        }

        .vs-play-ring:hover .vs-play-inner svg { stroke: var(--vs-gold-lt); }

        /* eyebrow */
        .vs-eyebrow {
          font-size: clamp(0.55rem, 1.2vw, 0.65rem);
          font-weight: 300;
          letter-spacing: 0.52em;
          text-transform: uppercase;
          color: var(--vs-gold);
          margin-bottom: 1.2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .vs-eyebrow span { display: inline-block; width: 28px; height: 1px; background: var(--vs-gold); }

        .vs-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.6rem, 7vw, 6.5rem);
          font-weight: 300;
          color: var(--vs-cream);
          line-height: 0.95;
          letter-spacing: -0.01em;
          margin-bottom: 1rem;
        }

        .vs-title em { font-style: italic; color: var(--vs-gold-lt); }

        .vs-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.4rem 0 1.6rem;
        }

        .vs-divider span { width: 40px; height: 1px; }
        .vs-divider span:first-child { background: linear-gradient(90deg, transparent, var(--vs-gold-lt)); }
        .vs-divider span:last-child  { background: linear-gradient(90deg, var(--vs-gold-lt), transparent); }
        .vs-divider i { font-style: normal; font-size: 0.4rem; color: var(--vs-gold-lt); }

        .vs-subtitle {
          font-size: clamp(0.7rem, 1.3vw, 0.82rem);
          font-weight: 300;
          letter-spacing: 0.15em;
          color: var(--vs-dim);
          max-width: 440px;
          line-height: 1.9;
        }

        /* ── bottom bar ── */
        .vs-bottom-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          z-index: 10;
          padding: clamp(1rem, 2.5vw, 1.8rem) clamp(1.5rem, 5vw, 3.5rem);
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        /* scroll indicator */
        .vs-scroll {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .vs-scroll-line {
          width: 1px;
          height: 42px;
          background: linear-gradient(180deg, var(--vs-gold), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }

        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 1; }
        }

        .vs-scroll-text {
          font-size: 0.48rem;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: var(--vs-gold);
          font-weight: 300;
          writing-mode: vertical-lr;
          transform: rotate(180deg);
        }

        /* progress bar */
        .vs-progress-wrap {
          flex: 1;
          max-width: 220px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: flex-end;
        }

        .vs-progress-label {
          font-size: 0.5rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(201,169,110,0.5);
          font-weight: 300;
        }

        .vs-progress-track {
          width: 100%;
          height: 1px;
          background: rgba(245,240,232,0.1);
          position: relative;
        }

        .vs-progress-fill {
          position: absolute;
          top: 0; left: 0; bottom: 0;
          background: var(--vs-gold);
          transition: width 0.3s linear;
        }

        /* stat pills */
        .vs-stats {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .vs-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .vs-stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          font-weight: 300;
          color: var(--vs-cream);
          line-height: 1;
        }

        .vs-stat-label {
          font-size: 0.52rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(201,169,110,0.55);
          font-weight: 300;
        }

        /* error fallback */
        .vs-fallback {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0a0808 0%, #1a1008 50%, #0a0a08 100%);
        }

        /* responsive */
        @media (max-width: 480px) {
          .vs-stats { display: none; }
          .vs-progress-wrap { display: none; }
        }
      `}</style>

      <section className="vs-root">

        {/* Fallback bg if video fails */}
        {videoError && <div className="vs-fallback" />}

        {/* Video */}
        {!videoError && (
          <video
            ref={videoRef}
            className={`vs-video${isLoaded ? " loaded" : ""}`}
            onCanPlayThrough={() => setIsLoaded(true)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => { setVideoError(true); setIsPlaying(false); }}
            loop
            playsInline
            muted={isMuted}
            preload="auto"
          >
            <source
              src="https://res.cloudinary.com/duweg8kpv/video/upload/kk8_ci5xtb.mp4"
              type="video/mp4"
            />
          </video>
        )}

        {/* Overlays */}
        <div className="vs-overlay-base" />
        <div className="vs-overlay-vignette" />
        <div className="vs-overlay-bottom" />

        {/* Top strip */}
        <div className="vs-top-strip">
          <span className="vs-strip-label">N&amp;B Italian Hotel · Feature Film</span>
          <button className="vs-mute-btn" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
            {isMuted ? (
              <VolumeX />
            ) : (
              <Volume2 />
            )}
          </button>
        </div>

        {/* Centre content */}
        <div className="vs-center">

          {/* Play / Pause ring */}
          <motion.div
            className="vs-play-ring"
            onClick={togglePlay}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && togglePlay()}
          >
            <div className="vs-play-inner">
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.svg
                    key="pause"
                    viewBox="0 0 24 24"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path d="M6 4h4v16H6zM14 4h4v16h-4z" strokeWidth="1.5" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="play"
                    viewBox="0 0 24 24"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path d="M5 3l14 9-14 9V3z" strokeWidth="1.5" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            className="vs-eyebrow"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.7 }}
          >
            <span />
            Discover the Experience
            <span />
          </motion.div>

          <motion.h2
            className="vs-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.38, duration: 0.9 }}
          >
            The Art of<br /><em>Luxury Living</em>
          </motion.h2>

          <motion.div
            className="vs-divider"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55 }}
          >
            <span /><i>◆</i><span />
          </motion.div>

          <motion.p
            className="vs-subtitle"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.65, duration: 0.8 }}
          >
            Where every detail is considered and every moment is an invitation to experience something truly extraordinary.
          </motion.p>

        </div>

        {/* Bottom bar */}
        <div className="vs-bottom-bar">

          {/* Scroll indicator */}
          <motion.div
            className="vs-scroll"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
          >
            <div className="vs-scroll-line" />
            <span className="vs-scroll-text">Scroll</span>
          </motion.div>

          {/* Hotel stats */}
          <motion.div
            className="vs-stats"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            {[
              { num: "48", label: "Suites" },
              { num: "12+", label: "Years" },
              { num: "5★", label: "Rating" },
            ].map((s) => (
              <div key={s.label} className="vs-stat">
                <span className="vs-stat-num">{s.num}</span>
                <span className="vs-stat-label">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="vs-progress-wrap"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.85 }}
          >
            <span className="vs-progress-label">Video Progress</span>
            <div className="vs-progress-track">
              <div className="vs-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </motion.div>

        </div>

      </section>
    </>
  );
}
"use client";

import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useRef, useState } from "react";

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">

      <video
        ref={videoRef}
        src="https://res.cloudinary.com/duweg8kpv/video/upload/q_auto,f_auto/v1771522393/White_and_Brown_Food_Facebook_Video_Promo_1_qswwkv.mp4"
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      ></video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 text-center px-6">

        <motion.div
          onClick={togglePlay}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full border border-white/30 backdrop-blur-sm cursor-pointer hover:bg-white/10 hover:border-white transition-all duration-300 group"
        >
          {isPlaying ? (
            <Pause className="text-white w-8 h-8 group-hover:text-accent transition-colors" />
          ) : (
            <Play className="text-white ml-2 w-8 h-8 group-hover:text-accent transition-colors" />
          )}
        </motion.div>

        <motion.h4
          className="text-accent uppercase tracking-[0.3em] text-sm mb-4 font-light"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Discover
        </motion.h4>

        <motion.h2
          className="text-4xl md:text-6xl font-serif text-white tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          The Art of Luxury
        </motion.h2>

      </div>

    </section>
  );
}
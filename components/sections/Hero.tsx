"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const SLIDES = [
    "https://res.cloudinary.com/duweg8kpv/image/upload/v1772119962/d5_okuxgh.jpg",
    "https://res.cloudinary.com/duweg8kpv/image/upload/v1772988986/360_F_692511356_6jleOpKpvIMrGRtXo7TZk70aD8ePbZvQ_q7ahz9.jpg",
    "https://res.cloudinary.com/duweg8kpv/image/upload/v1771601790/N_B4_tjbkfy.jpg"
];

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
            {/* Background Slider */}
            {SLIDES.map((slide, index) => (
                <motion.div
                    key={slide}
                    className="absolute inset-0 w-full h-full"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{
                        opacity: index === currentSlide ? 1 : 0,
                        scale: index === currentSlide ? 1 : 1.1,
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${slide})` }}
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/50" />
                </motion.div>
            ))}

            {/* Content */}
            <div className="relative z-10 text-center px-6">
                <motion.span
                    className="block text-accent uppercase tracking-[0.3em] text-lg mb-4 font-light"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    Welcome to
                </motion.span>

                <motion.h1
                    className="text-3xl md:text-5xl lg:text-8xl font-serif text-white mb-8 tracking-wider"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.7 }}
                >
                    N&B Italian Hotel
                </motion.h1>

                <motion.p
                    className="text-gray-300 font-light max-w-2xl mx-auto mb-10 text-lg md:text-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                >
                    Experience uncompromised luxury and unparalleled comfort in the heart of the city.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                >
                    <Link
                        href="/rooms"
                        className="text-xs inline-block border border-accent text-accent px-8 py-3 uppercase tracking-[0.2em] hover:bg-accent hover:text-black transition-all duration-300"
                    >
                        Discover Rooms
                    </Link>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2 }}
            >
                <span className="text-xs uppercase tracking-widest mb-2 font-light"></span>
                <div className="w-[1px] h-16 bg-white/20 relative overflow-hidden">
                    <motion.div
                        className="w-full h-full bg-accent origin-top"
                        animate={{ scaleY: [0, 1, 0], translateY: ['-100%', '0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </motion.div>
        </section>
    );
}

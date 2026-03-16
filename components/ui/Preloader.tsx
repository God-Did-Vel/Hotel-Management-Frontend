"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time as requested by user (4.5 seconds)
        const timer = setTimeout(() => {
            setLoading(false);
        }, 4500); // 4.5 seconds total preloader duration
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    key="preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center pointer-events-none"
                >
                    {/* Spinning circle */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full mb-8"
                    />

                    {/* Yellow loading bar growing left to right */}
                    <div className="w-48 h-[2px] bg-white/10 overflow-hidden relative">
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "0%" }}
                            transition={{ duration: 4.0, ease: "easeInOut" }}
                            className="absolute top-0 left-0 h-full w-full bg-yellow-600"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

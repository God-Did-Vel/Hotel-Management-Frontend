'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ children }: { children: React.ReactNode }) {
    const [showSplash, setShowSplash] = useState(true);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Immediately hide splash screen if on admin route
        if (window.location.pathname.startsWith('/admin')) {
            setShowSplash(false);
            return;
        }

        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!isClient) return null; // Prevent hydration mismatch

    return (
        <>
            <AnimatePresence>
                {showSplash && (
                    <motion.div
                        initial={{ y: 0 }}
                        exit={{ y: '-100%' }}
                        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }} // Smooth cinematic slide out
                        className="fixed inset-0 z-[10001] flex items-center justify-center bg-black"
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="font-playfair text-3xl md:text-4xl lg:text-5xl text-gold text-center px-4 leading-relaxed tracking-wider text-[#d4af37]"
                        >
                            Experience Luxury at N&B italian hotels <br /> your home of comfort
                        </motion.h1>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Wait until splash is done sliding to fully reveal layout contents, or reveal behind it smoothly */}
            {children}
        </>
    );
}

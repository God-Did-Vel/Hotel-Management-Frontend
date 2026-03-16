'use client';

import { motion } from 'framer-motion';

export default function BubbleLoader() {
    // Defines the rotating motion for the entire container of bubbles
    const containerVariants = {
        animate: {
            rotate: 360,
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
            } as any
        }
    };

    // Staggering pulses for individual bubbles
    const bubbleVariants = {
        animate: (custom: number) => ({
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
            transition: {
                duration: 1.8,
                repeat: Infinity,
                delay: custom * 0.1,
                ease: "easeInOut"
            } as any
        })
    };

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 pointer-events-none">
            <motion.div
                variants={containerVariants}
                animate="animate"
                className="relative flex items-center justify-center w-24 h-24"
            >
                {/* 3 bubbles arranged in a triangle/circle pattern */}
                <motion.div
                    custom={0}
                    variants={bubbleVariants}
                    animate="animate"
                    className="absolute top-0 w-6 h-6 rounded-full"
                    style={{
                        background: 'linear-gradient(135deg, #d4af37 0%, #ffffff 100%)',
                        boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
                    }}
                />

                <motion.div
                    custom={1}
                    variants={bubbleVariants}
                    animate="animate"
                    className="absolute bottom-2 left-2 w-6 h-6 rounded-full"
                    style={{
                        background: 'linear-gradient(135deg, #fcdca3 0%, #d4af37 100%)',
                        boxShadow: '0 0 10px rgba(252, 220, 163, 0.5)'
                    }}
                />

                <motion.div
                    custom={2}
                    variants={bubbleVariants}
                    animate="animate"
                    className="absolute bottom-2 right-2 w-6 h-6 rounded-full"
                    style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #fcdca3 100%)',
                        boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                    }}
                />
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" } as any}
                className="mt-8 text-accent uppercase tracking-[0.2em] text-xs font-medium"
            >
                Loading
            </motion.p>
        </div>
    );
}

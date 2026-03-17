'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import BubbleLoader from '@/components/ui/BubbleLoader';

function TopProgressBarContent() {
    const [showLoader, setShowLoader] = useState(false);
    const [showProgress, setShowProgress] = useState(false);

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        
        setShowLoader(true);
        setShowProgress(false);

     
        const progressTimer = setTimeout(() => {
            setShowProgress(true);
        }, 1000);

      
        const resetTimer = setTimeout(() => {
            setShowLoader(false);
            setShowProgress(false);
        }, 4000);

        return () => {
            clearTimeout(progressTimer);
            clearTimeout(resetTimer);
        };
    }, [pathname, searchParams]);

    return (
        <AnimatePresence>
            {showLoader && (
                <motion.div
                    key="page-loader"
                    initial={{ y: 0 }}
                    exit={{ y: '-100%' }} // Slides out upwards
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[10000] bg-black overflow-hidden pointer-events-none"
                >
                    <BubbleLoader />

                    {showProgress && (
                        <motion.div
                            initial={{ width: '0%', opacity: 1 }}
                            animate={{ width: '100%', opacity: 1 }}
                            transition={{ duration: 3.0, ease: 'easeInOut' }}
                            className="absolute top-0 left-0 h-1 z-[10001]"
                            style={{ background: 'linear-gradient(90deg, #d4af37 0%, #fcdca3 50%, #d4af37 100%)' }} // Soft gold progression
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default function TopProgressBar() {
    return (
        <Suspense fallback={null}>
            <TopProgressBarContent />
        </Suspense>
    );
}
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const minMute = () => {
            // Just a check to ensure we only run on client
        };
        minMute();

        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target) return;
            const tagName = target.tagName?.toLowerCase();
            if (
                tagName === "a" ||
                tagName === "button" ||
                tagName === "h1" ||
                tagName === "h2" ||
                target.closest("a") ||
                target.closest("button")
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", updatePosition);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", updatePosition);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    return (
        <>
            <motion.div
                className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference bg-white ${isHovering ? "w-16 h-16 border border-white bg-transparent" : "w-4 h-4"
                    }`}
                animate={{
                    x: position.x - (isHovering ? 32 : 8),
                    y: position.y - (isHovering ? 32 : 8),
                }}
                transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 15,
                    mass: 0.1,
                }}
                style={{
                    boxShadow: isHovering ? "0 0 10px rgba(255,255,255,0.5)" : "none",
                }}
            />
        </>
    );
}

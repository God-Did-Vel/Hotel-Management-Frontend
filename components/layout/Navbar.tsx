"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/rooms", label: "Rooms & Suites" },
        { href: "/gallery", label: "Gallery" },
        { href: "/login", label: "Sign In" },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-500 ${
                scrolled
                    ? "bg-black/90 backdrop-blur-md py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                    : "bg-gradient-to-b from-black/60 to-transparent py-5"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">

                {/* Logo */}
                <Link href="/" className="flex items-center group">
                    <div className="relative flex items-center">
                        <Image
                            src="https://res.cloudinary.com/duweg8kpv/image/upload/v1774293111/fordham-removebg-preview_wtipq2.png"
                            alt="Fordham Suites"
                            width={160}
                            height={60}
                            className={`w-auto object-contain transition-all duration-500 ${
                                scrolled ? "h-10 md:h-12" : "h-12 md:h-16"
                            }`}
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Menu */}
               <div className="hidden md:flex items-center space-x-4 lg:space-x-5">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="relative text-[10px] lg:text-[11px] font-semibold uppercase tracking-[0.15em] text-white/90 hover:text-[#c8a97e] transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-[#c8a97e] after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap"
                        >
                            {link.label}
                        </Link>
                    ))}

                    {/* Divider */}
                    <div className="h-4 w-px bg-[#d4af37]" />

                    {/* Book Now CTA */}
                    <Link
                        href="/book"
                        className="relative overflow-hidden border border-[#d4af37] text-[#d4af37] font-semibold px-7 py-2.5 uppercase tracking-[0.2em] text-[11px] transition-all duration-300 hover:text-black group"
                    >
                        <span className="absolute inset-0 bg-[#d4af37] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative z-10">Book Now</span>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-white hover:text-[#c8a97e] transition-colors focus:outline-none"
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <div
                className={`md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-md flex flex-col items-center py-10 space-y-7 transition-all duration-300 ${
                    isOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-4 pointer-events-none"
                }`}
            >
                {/* Mobile Logo */}
                <Image
                    src="https://res.cloudinary.com/duweg8kpv/image/upload/v1774293111/fordham-removebg-preview_wtipq2.png"
                    alt="Fordham Suites"
                    width={120}
                    height={45}
                    className="h-10 w-auto object-contain mb-2"
                />

                {/* Divider */}
                <div className="w-16 h-px bg-[#c8a97e]/40" />

                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-sm uppercase tracking-[0.3em] text-white/80 hover:text-[#c8a97e] transition-colors duration-300"
                    >
                        {link.label}
                    </Link>
                ))}

                <Link
                    href="/book"
                    onClick={() => setIsOpen(false)}
                    className="mt-2 border border-[#c8a97e] text-[#c8a97e] px-10 py-3 uppercase tracking-[0.2em] text-xs hover:bg-[#c8a97e] hover:text-black transition-all duration-300"
                >
                    Book Now
                </Link>
            </div>
        </nav>
    );
}
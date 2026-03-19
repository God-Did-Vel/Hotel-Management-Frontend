"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-md py-4 shadow-lg" : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-4 lg:px-7 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-sm md:text-sm font-serif text-accent tracking-widest uppercase flex items-center">
                    {/* Public logo from Cloudinary */}
                    <img src="https://res.cloudinary.com/duweg8kpv/image/upload/v1772902061/logo_geg3c4.png" alt="N&B Italian Hotel" className="h-8 md:h-10 w-auto mr-2 md:mr-3" />
                    <span className="hidden sm:inline-block">N&B Italian Hotel</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-3 items-center">
                    <Link href="/" className="relative text-xs font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:text-[#c8a97e] after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-[#c8a97e] after:transition-all hover:after:w-full">
                        Home
                    </Link>
                    <Link href="/rooms" className="relative text-xs font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:text-[#c8a97e] after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-[#c8a97e] after:transition-all hover:after:w-full">
                        Rooms & Suites
                    </Link>
                    <Link href="/gallery" className="relative text-xs font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:text-[#c8a97e] after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-[#c8a97e] after:transition-all hover:after:w-full">
                        Gallery
                    </Link>
                    <Link href="/login" className="relative text-xs font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:text-[#c8a97e] after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-[#c8a97e] after:transition-all hover:after:w-full">
                        SignIn
                    </Link>
                    <Link
                        href="/book"
                        className="border border-accent text-accent font-semibold px-6 py-2 uppercase tracking-wider text-xs hover:bg-accent hover:text-background transition-colors"
                    >
                        Book Now
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-accent focus:outline-none">
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-md flex flex-col items-center py-8 space-y-6">
                    <Link href="/" onClick={() => setIsOpen(false)} className="text-lg uppercase tracking-wider hover:text-accent transition-colors">
                        Home
                    </Link>
                    <Link href="/rooms" onClick={() => setIsOpen(false)} className="text-lg uppercase tracking-wider hover:text-accent transition-colors">
                        Rooms & Suites
                    </Link>
                    <Link href="/gallery" onClick={() => setIsOpen(false)} className="text-lg uppercase tracking-wider hover:text-accent transition-colors">
                        Gallery
                    </Link>
                    <Link href="/login" onClick={() => setIsOpen(false)} className="text-lg uppercase tracking-wider hover:text-accent transition-colors">
                        Sign In
                    </Link>
                    <Link
                        href="/book"
                        onClick={() => setIsOpen(false)}
                        className="border border-accent text-accent px-8 py-3 uppercase tracking-wider text-sm hover:bg-accent hover:text-background transition-colors"
                    >
                        Book Now
                    </Link>
                </div>
            )}
        </nav>
    );
}

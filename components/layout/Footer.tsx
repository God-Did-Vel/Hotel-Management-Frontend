"use client";

import { useState } from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Loader2 } from "lucide-react";
import axios from "axios";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message?: string }>({ type: 'idle' });

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) return;

        setStatus({ type: 'loading' });

        try {
            await axios.post("http://localhost:5000/api/newsletter/subscribe", { email });
            setStatus({ type: 'success', message: "Subscribed successfully!" });
            setEmail("");
        } catch (error: any) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || "Failed to subscribe."
            });
        }
    };

    return (
        <footer className="bg-[#050505] text-white pt-20 pb-10 border-t border-white/5 relative z-50">
            <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
                {/* Brand */}
                <div className="space-y-4">
                    <Link href="/" className="text-2xl font-serif text-accent tracking-widest uppercase block">
                        N&B Italian Hotel<span className="text-white"></span>
                    </Link>
                    <p className="text-gray-400 font-light leading-relaxed">
                        Experience the ultimate luxury. Our hotel offers unparalleled views, exquisite dining, and world-class service.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h4 className="text-lg uppercase tracking-wider mb-6 font-serif">Explore</h4>
                    <ul className="space-y-3 font-light text-gray-400">
                        <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
                        <li><Link href="/rooms" className="hover:text-accent transition-colors">Rooms & Suites</Link></li>
                        <li><Link href="/restaurant" className="hover:text-accent transition-colors">Restaurant & Bar</Link></li>
                        <li><Link href="/spa" className="hover:text-accent transition-colors">Wellness & Spa</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-lg uppercase tracking-wider mb-6 font-serif">Contact</h4>
                    <ul className="space-y-3 font-light text-gray-400">
                        <li>123 Luxury Ave, NY 10012</li>
                        <li>+1 (234) 567 8900</li>
                        <li>info@nb-italian-hotel.com</li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="text-lg uppercase tracking-wider mb-6 font-serif">Newsletter</h4>
                    <p className="font-light text-gray-400 mb-4">Subscribe to our newsletter for exclusive offers.</p>

                    <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-transparent border-b border-gray-600 px-2 py-2 focus:outline-none focus:border-accent w-full text-white"
                            />
                            <button
                                type="submit"
                                disabled={status.type === 'loading'}
                                className="text-accent hover:text-white transition-colors uppercase tracking-wider text-xs ml-4 border-b border-transparent hover:border-white disabled:opacity-50 flex items-center"
                            >
                                {status.type === 'loading' ? <Loader2 className="animate-spin w-4 h-4" /> : 'Subscribe'}
                            </button>
                        </div>
                        {status.message && (
                            <span className={`text-xs mt-2 ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {status.message}
                            </span>
                        )}
                    </form>
                </div>
            </div>

            <div className="container mx-auto px-6 lg:px-12 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-gray-500 text-xs font-light">
                <p>&copy; {new Date().getFullYear()} N&B Italian Hotel. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-accent transition-colors"><Instagram size={18} /></a>
                    <a href="#" className="hover:text-accent transition-colors"><Facebook size={18} /></a>
                    <a href="#" className="hover:text-accent transition-colors"><Twitter size={18} /></a>
                </div>
            </div>
        </footer>
    );
}

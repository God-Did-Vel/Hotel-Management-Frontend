"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function EventsPreview() {
    return (
        <section className="py-32 bg-[#121212] text-white">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="mb-16">
                    <div className="flex items-center space-x-4 mb-4">
                        <span className="w-12 h-[1px] bg-white/20"></span>
                        <h4 className="text-[10px] uppercase font-bold tracking-widest text-white/50">Plan your events & meetings</h4>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif max-w-2xl leading-tight">
                        Free changes and cancellations for new reservations.
                    </h2>
                </div>

                <div className="flex space-x-6 text-xs text-white/50 font-bold uppercase tracking-wider mb-8 border-b border-white/10 pb-4">
                    <button className="text-white border-b-2 border-accent pb-4 -mb-[17px]">All Events (8)</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Navigation Buttons */}
                    <button className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1a1a1a] flex items-center justify-center z-10 hover:bg-accent transition-colors">
                        <ChevronLeft size={16} />
                    </button>
                    <button className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1a1a1a] flex items-center justify-center z-10 hover:bg-accent transition-colors">
                        <ChevronRight size={16} />
                    </button>

                    <div className="text-center group">
                        <div className="overflow-hidden mb-6 aspect-[4/5] relative">
                            <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Summit" />
                        </div>
                        <h3 className="font-serif text-xl mb-2">The Caterer Marketing & PR Summit</h3>
                        <p className="text-[10px] uppercase tracking-widest text-white/50">07 Oct 2026<br />N&amp;B Italian Hotel, London</p>
                    </div>

                    <div className="text-center group">
                        <div className="overflow-hidden mb-6 aspect-[4/5] relative">
                            <img src="https://res.cloudinary.com/duweg8kpv/image/upload/v1772988986/360_F_692511356_6jleOpKpvIMrGRtXo7TZk70aD8ePbZvQ_q7ahz9.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Summit" />
                        </div>
                        <h3 className="font-serif text-xl mb-2">Envato LLC Marketing & PR Summit</h3>
                        <p className="text-[10px] uppercase tracking-widest text-white/50">10 Nov 2026<br />N&amp;B Italian Hotel, Melbourne</p>
                    </div>

                    <div className="text-center group">
                        <div className="overflow-hidden mb-6 aspect-[4/5] relative">
                            <img src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Summit" />
                        </div>
                        <h3 className="font-serif text-xl mb-2">3rd Natro Hosting & Summit</h3>
                        <p className="text-[10px] uppercase tracking-widest text-white/50">30 Aug 2026<br />N&amp;B Italian Hotel, Istanbul</p>
                    </div>
                </div>

                <div className="flex justify-center mt-12 space-x-2">
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                    <span className="w-2 h-2 rounded-full bg-white/20"></span>
                    <span className="w-2 h-2 rounded-full bg-white/20"></span>
                </div>
            </div>
        </section>
    );
}

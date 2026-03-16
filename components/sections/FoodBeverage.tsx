"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function FoodBeverage() {
    return (
        <section className="py-34 bg-[#0a0a0a]">
            <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 items-center">
                <div className="bg-[#d4af37] p-12 md:p-24 h-full flex flex-col justify-center">
                    <motion.h4
                        className="text-white/70 uppercase tracking-[0.2em] text-xs font-bold mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Food & Beverage
                    </motion.h4>
                    <motion.h2
                        className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Why wouldn't you dine in?
                    </motion.h2>
                    <motion.p
                        className="text-white/90 font-light leading-relaxed mb-10 max-w-sm"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        Unlike other hotels, N&amp;B Italian Hotel prides itself on offering our guests in-house award-winning restaurants and our food philosophy is simple: seasonal, ingredients to showcase the region's finest flavours.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link
                            href="/restaurant"
                            className="inline-block border border-white text-white py-3 px-8 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#8c7853] transition-colors"
                        >
                            See Restaurants & Bars
                        </Link>
                    </motion.div>
                </div>
                <div className="h-[400px] md:h-full min-h-[500px] w-full relative">
                    <img
                        src="https://res.cloudinary.com/duweg8kpv/image/upload/v1771930902/ricceee_cjmnwu.jpg"
                        alt="Fine Dining Experience"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
            </div>
        </section>
    );
}

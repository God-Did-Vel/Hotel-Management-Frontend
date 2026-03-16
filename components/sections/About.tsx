"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    return (
        <section ref={sectionRef} className="py-32 bg-background relative overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Text Content */}
                    <div className="order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                        >
                            <h4 className="text-accent uppercase tracking-[0.3em] text-sm mb-4 font-light">The N&B Italian Hotel Experience</h4>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-8 leading-tight">
                                A Legacy of <br />
                                <span className="text-gray-400 italic">Unrivaled Luxury</span>
                            </h2>

                            <div className="space-y-6 text-gray-400 font-light leading-relaxed mb-10">
                                <p>
                                    Since its inception, N&B Italian Hotel has redefined the art of hospitality. Nestled in breathtaking surroundings, our establishment combines classical elegance with state-of-the-art modern comforts.
                                </p>
                                <p>
                                    Every detail, from the meticulously curated artwork adorning our halls to the bespoke furnishings in each suite, has been carefully selected to ensure an unforgettable stay. We believe luxury is not just seen, but felt.
                                </p>
                            </div>

                            <div className="flex items-center space-x-6">
                                <div>
                                    <span className="block text-3xl font-serif text-accent mb-1">25+</span>
                                    <span className="text-xs uppercase tracking-wider text-gray-500">Years of Excellence</span>
                                </div>
                                <div className="w-[1px] h-12 bg-white/10" />
                                <div>
                                    <span className="block text-3xl font-serif text-accent mb-1">100</span>
                                    <span className="text-xs uppercase tracking-wider text-gray-500">Luxury Suites</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Image Content */}
                    <div className="order-1 lg:order-2 relative h-[600px] w-full mt-10 lg:mt-0 xl:p-10">
                        <motion.div
                            className="w-full h-full relative overflow-hidden"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1 }}
                        >
                            {/* Cinematic Reveal Overlay */}
                            <motion.div
                                className="absolute inset-0 bg-black z-20"
                                initial={{ x: "0%" }}
                                whileInView={{ x: "100%" }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
                            />

                            <motion.img
                                src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1600&auto=format&fit=crop"
                                alt="Luxury Hotel Lobby"
                                className="w-full h-full object-cover relative z-10"
                                style={{ y }}
                            />
                        </motion.div>

                        {/* Decorative Outline Box */}
                        <motion.div
                            className="absolute top-0 right-0 w-[80%] h-[90%] border border-accent/30 -z-10 hidden xl:block"
                            initial={{ opacity: 0, x: -20, y: 20 }}
                            whileInView={{ opacity: 1, x: 20, y: -20 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5 }}
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}

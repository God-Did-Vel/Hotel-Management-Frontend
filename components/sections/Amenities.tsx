"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const AMENITIES = [
    {
        title: "The Spa Sanctuary",
        description: "Rejuvenate your body and mind in our award-winning spa featuring holistic treatments and thermal baths.",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1600&auto=format&fit=crop",
        link: "/spa",
    },
    {
        title: "Gastronomic Excellence",
        description: "Indulge in culinary masterpieces at our Michelin-starred restaurant, crafted by world-renowned chefs.",
        image: "https://res.cloudinary.com/duweg8kpv/image/upload/v1772915872/bb3feec381e3e248e2bd6557bab0e8f7_l5sequ.jpg",
        link: "/restaurant",
    },
    {
        title: "Infinity Pool",
        description: "Swim to the edge of the horizon in our temperature-controlled infinity pool overlooking the city skyline.",
        image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1600&auto=format&fit=crop",
        link: "/gallery",
    }
];

export default function Amenities() {
    return (
        <section className="py-32 bg-background overflow-hidden relative">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="mb-24 md:flex md:justify-between md:items-end">
                    <div className="max-w-xl">
                        <motion.h4
                            className="text-accent uppercase tracking-[0.3em] text-sm mb-4 font-light"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            Exclusive Facilities
                        </motion.h4>
                        <motion.h2
                            className="text-4xl md:text-5xl font-serif text-white tracking-wide"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            Beyond Expectation
                        </motion.h2>
                    </div>
                    <motion.p
                        className="text-gray-400 font-light max-w-md mt-6 md:mt-0"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        Our carefully curated amenities ensure that every moment of your stay is nothing short of extraordinary.
                    </motion.p>
                </div>

                <div className="space-y-32">
                    {AMENITIES.map((amenity, index) => (
                        <div
                            key={index}
                            className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-24`}
                        >
                            {/* Image Container with Reveal */}
                            <div className="w-full lg:w-1/2 relative h-[500px]">
                                <motion.div
                                    className="w-full h-full relative overflow-hidden"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 1 }}
                                >
                                    <motion.div
                                        className={`absolute inset-0 bg-black z-20 origin-${index % 2 === 0 ? 'left' : 'right'}`}
                                        initial={{ scaleX: 1 }}
                                        whileInView={{ scaleX: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1], delay: 0.2 }}
                                    />
                                    <img
                                        src={amenity.image}
                                        alt={amenity.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                                    />
                                </motion.div>

                                {/* Decorative Element */}
                                <div className={`absolute -bottom-6 ${index % 2 === 0 ? '-right-6' : '-left-6'} w-32 h-32 border-b-2 border-${index % 2 === 0 ? 'r' : 'l'}-2 border-accent/20 -z-10`} />
                            </div>

                            {/* Text Container */}
                            <div className="w-full lg:w-1/2">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    <h3 className="text-3xl lg:text-4xl font-serif text-white mb-6">
                                        {amenity.title}
                                    </h3>
                                    <p className="text-gray-400 font-light leading-relaxed text-lg">
                                        {amenity.description}
                                    </p>
                                    <Link href={amenity.link} className="mt-10 uppercase tracking-[0.2em] text-sm text-accent hover:text-white transition-colors flex items-center group">
                                        Discover More
                                        <span className="ml-4 w-12 h-[1px] bg-accent group-hover:w-16 group-hover:bg-white transition-all duration-300" />
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
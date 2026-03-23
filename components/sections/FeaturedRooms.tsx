"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// Mock data for initial UI before API integration
const FEATURED_ROOMS = [
    {
        id: 1,
        name: "Royal Suite",
        size: "120 sqm",
        price: 80,
        image: "https://res.cloudinary.com/duweg8kpv/image/upload/v1774272413/N11_amqfvq.jpg",
        features: ["Ocean View", "King Bed", "Private Balcony", "Butler Service"]
    },
    {
        id: 2,
        name: "Deluxe Ocean View",
        size: "85 sqm",
        price: 50,
        image: "https://res.cloudinary.com/duweg8kpv/image/upload/v1774272414/N9_nttuhn.jpg",
        features: ["Ocean View", "Queen Bed", "Marble Bathroom"]
    },
    {
        id: 3,
        name: "Premium Executive",
        size: "65 sqm",
        price: 40,
        image: "https://res.cloudinary.com/duweg8kpv/image/upload/v1774272414/N7_rg7g2i.jpg",
        features: ["City View", "King Bed", "Work Desk", "Lounge Access"]
    }
];

export default function FeaturedRooms() {
    return (
        <section className="py-32 bg-[#050505]">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center mb-20">
                    <motion.h4
                        className="text-accent uppercase tracking-[0.3em] text-sm mb-4 font-light"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Our Accommodations
                    </motion.h4>
                    <motion.h2
                        className="text-4xl md:text-5xl font-serif text-white tracking-wide"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Featured Suites
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {FEATURED_ROOMS.map((room, index) => (
                        <motion.div
                            key={room.id}
                            className="group relative bg-[#0a0a0a] overflow-hidden border border-white/5"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            {/* Image Container */}
                            <div className="overflow-hidden h-72 relative">
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${room.image})` }}
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 text-sm font-serif">
                                    ₦{room.price} <span className="text-xs text-gray-400 font-sans">/ Night</span>
                                </div>
                            </div>

                            {/* Content Container */}
                            <div className="p-8">
                                <h3 className="text-2xl font-serif text-white mb-2 group-hover:text-accent transition-colors duration-300">
                                    {room.name}
                                </h3>
                                <p className="text-sm text-gray-400 font-light mb-6 uppercase tracking-wider">
                                    {room.size}
                                </p>

                                <ul className="space-y-2 mb-8 border-t border-white/10 pt-6">
                                    {room.features.slice(0, 3).map((feature, i) => (
                                        <li key={i} className="text-gray-300 font-light text-sm flex items-center">
                                            <span className="w-1.5 h-1.5 bg-accent/50 rounded-full mr-3" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/rooms"
                                    className="block text-center border border-white/20 text-white py-3 uppercase tracking-widest text-sm hover:border-accent hover:text-accent transition-colors duration-300"
                                >
                                    View Details
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="text-center mt-20"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                >
                    <Link
                        href="/rooms"
                        className="inline-block relative overflow-hidden text-white uppercase tracking-[0.2em] font-light text-sm group"
                    >
                        <span className="relative z-10 px-8 py-4 inline-block">Explore All Rooms</span>
                        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent transform origin-left transition-transform duration-300 group-hover:scale-x-100" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

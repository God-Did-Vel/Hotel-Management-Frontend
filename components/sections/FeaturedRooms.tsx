"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { apiClient, getImageUrl } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface Room {
    _id: string;
    name: string;
    slug: string;
    room_size: string;
    price_per_night: number;
    image?: string;
    images?: string[];
    amenities: string[];
    featured: boolean;
}

export default function FeaturedRooms() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const { data } = await apiClient.get("/api/rooms");
                // Filter for featured rooms
                const featured = data.filter((room: Room) => room.featured);
                setRooms(featured.slice(0, 3));
            } catch (error) {
                console.error("Error fetching featured rooms:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRooms();
    }, []);

    // Default fallback image from Cloudinary
    const defaultImage = "https://res.cloudinary.com/duweg8kpv/image/upload/v1774272414/N8_e2gfi5.jpg";

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

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-accent animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {rooms.map((room, index) => (
                            <motion.div
                                key={room._id}
                                className="group relative bg-[#0a0a0a] overflow-hidden border border-white/5"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                            >
                                {/* Image Container */}
                                <div className="overflow-hidden h-72 relative">
                                    <Image
                                        src={getImageUrl(room.images?.[0] || room.image || defaultImage)}
                                        alt={room.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                                    <div className="absolute top-4 right-4 bg-black/85 backdrop-blur-sm text-white px-4 py-2 text-sm font-serif z-10 border border-white/5">
                                        ₦{room.price_per_night.toLocaleString()} <span className="text-xs text-gray-400 font-sans">/ Night</span>
                                    </div>
                                </div>

                                {/* Content Container */}
                                <div className="p-8">
                                    <h3 className="text-2xl font-serif text-white mb-2 group-hover:text-accent transition-colors duration-300">
                                        <Link href={`/rooms/${room.slug}`}>
                                            {room.name}
                                        </Link>
                                    </h3>
                                    <p className="text-sm text-gray-400 font-light mb-6 uppercase tracking-wider">
                                        {room.room_size}
                                    </p>

                                    <ul className="space-y-2 mb-8 border-t border-white/10 pt-6">
                                        {room.amenities.slice(0, 3).map((feature, i) => (
                                            <li key={i} className="text-gray-300 font-light text-sm flex items-center">
                                                <span className="w-1.5 h-1.5 bg-accent/50 rounded-full mr-3" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Link
                                            href={`/rooms/${room.slug}`}
                                            className="block text-center border border-white/10 text-gray-400 py-3 uppercase tracking-widest text-[10px] hover:border-white hover:text-white transition-colors duration-300"
                                        >
                                            Details
                                        </Link>
                                        <Link
                                            href={`/book?roomId=${room._id}`}
                                            className="block text-center border border-accent/40 text-accent py-3 uppercase tracking-widest text-[10px] hover:bg-accent/10 hover:text-white transition-colors duration-300 font-semibold"
                                        >
                                            Book Now
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

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
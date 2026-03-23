"use client";

import { motion } from "framer-motion";

const GALLERY_IMAGES = [
    "https://res.cloudinary.com/duweg8kpv/image/upload/v1774272416/N10_q1nxp0.jpg", // Exterior
    "https://res.cloudinary.com/duweg8kpv/image/upload/v1774272414/N8_e2gfi5.jpg", // Room
    "https://res.cloudinary.com/duweg8kpv/image/upload/v1774272415/N14_kasepl.jpg", // Lounge
    "https://res.cloudinary.com/duweg8kpv/image/upload/v1774272415/N3_tcbn2l.jpg", // Food
    "https://res.cloudinary.com/duweg8kpv/image/upload/v1772119961/d3_xsxaea.jpg", // Lobby
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop", // Spa
];

export default function GalleryPreview() {
    return (
        <section className="py-10 bg-[#050505]">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                {GALLERY_IMAGES.map((img, index) => (
                    <motion.div
                        key={index}
                        className="relative aspect-square overflow-hidden group cursor-pointer bg-black"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <div
                            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                            style={{ backgroundImage: `url(${img})` }}
                        />
                        {/* Overlay icon on hover */}
                        <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300 flex items-center justify-center">
                            <span className="w-10 h-10 border border-white rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                +
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css";

const TESTIMONIALS = [
    {
        quote: "The most exquisite hotel experience of my life. The attention to detail and personalized service is unmatched anywhere else in the world.",
        author: "Eleanor Rothschild",
        title: "Global Traveler"
    },
    {
        quote: "A true masterpiece of design and hospitality. From the spa to the dining, every moment was curated to absolute perfection.",
        author: "James Sterling",
        title: "Executive Director"
    },
    {
        quote: "Quardo Deluxe doesn't just offer a place to stay; it offers an immersion into absolute luxury and tranquility.",
        author: "Sophia Laurent",
        title: "Fashion Editor"
    }
];

export default function Testimonials() {
    return (
        <section className="py-32 bg-[#0a0a0a] relative overflow-hidden">
            {/* Decorative large quote mark */}
            <div className="absolute top-20 left-10 text-[20rem] text-white/5 font-serif leading-none select-none">

            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <Swiper
                        modules={[Autoplay]}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        loop={true}
                        allowTouchMove={false}
                        className="w-full"
                    >
                        {TESTIMONIALS.map((testimonial, index) => (
                            <SwiperSlide key={index}>
                                <div className="py-10">
                                    <p className="text-2xl md:text-3xl lg:text-4xl font-serif text-white font-light leading-relaxed mb-12 italic">
                                        {testimonial.quote}
                                    </p>
                                    <div className="flex flex-col items-center">
                                        <span className="w-12 h-[1px] bg-accent mb-6" />
                                        <h5 className="text-white font-serif text-xl tracking-wide">{testimonial.author}</h5>
                                        <p className="text-gray-500 text-sm uppercase tracking-widest mt-2">{testimonial.title}</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>
            </div>
        </section>
    );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flower2, Wind, Droplet, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { apiClient } from "@/lib/api";

export default function SpaPage() {
    const [isBooking, setIsBooking] = useState(false);
    const [formData, setFormData] = useState({
        guest_name: "",
        guest_email: "",
        guest_phone: "",
        booking_date: "",
        service_type: "Swedish Massage",
    });
    const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message?: string, code?: string }>({ type: 'idle' });

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: 'loading' });

        try {
            // Point to our newly created backend Spa API
            const { data } = await apiClient.post("/api/spa/book", formData);

            setStatus({
                type: 'success',
                message: "Your spa appointment has been successfully requested.",
                code: data.tracking_code,
            });
            setIsBooking(false); // Close form, show success
        } catch (error: any) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || "Failed to book appointment. Please try again."
            });
        }
    };

    return (
        <div className="pt-32 pb-20 bg-background min-h-screen text-foreground relative">

            {/* Header */}
            <div className="container mx-auto px-6 lg:px-12 text-center mb-20 mt-8">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-accent uppercase tracking-[0.3em] text-xs mb-4 block"
                >
                    Serenity & Wellness
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-serif text-white mb-6"
                >
                    The Oasis Spa
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 max-w-2xl mx-auto font-light leading-relaxed"
                >
                    Rejuvenate your body and soul in our world-class spa facilities. A sanctuary designed for absolute relaxation.
                </motion.p>
            </div>

            {/* Experience Cards */}
            <div className="container mx-auto px-6 lg:px-12 grid md:grid-cols-4 gap-8 mb-24">
                {[
                    { icon: Flower2, title: "Aromatherapy", desc: "Essential oil wellness." },
                    { icon: Wind, title: "Steam Room", desc: "Purify and detoxify." },
                    { icon: Droplet, title: "Hydrotherapy", desc: "Healing water rituals." },
                    { icon: Sparkles, title: "Facials", desc: "Radiant skin treatments." }
                ].map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/5 p-8 text-center border border-white/5 rounded-xl hover:border-accent/40 transition-colors"
                    >
                        <item.icon className="w-8 h-8 text-accent mx-auto mb-4" strokeWidth={1} />
                        <h4 className="text-lg font-serif text-white mb-2">{item.title}</h4>
                        <p className="text-gray-400 font-light text-xs">{item.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Main Feature */}
            <div className="container mx-auto px-6 lg:px-12 mb-24">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[600px] w-full rounded-2xl overflow-hidden group"
                    >
                        <img
                            src="https://res.cloudinary.com/duweg8kpv/image/upload/v1773844187/spa_b8moxk.jpg"
                            alt="Spa and Wellness"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-serif text-white mb-6 leading-relaxed">
                            A Sanctuary for the Senses
                        </h2>
                        <div className="w-12 h-px bg-accent mb-6" />
                        <p className="text-gray-400 font-light leading-relaxed mb-6">
                            Escape the bustle of the city and step into an oasis of tranquility.
                            Our expert therapists offer an extensive menu of treatments designed
                            to relax your body, calm your mind, and invigorate your spirit.
                        </p>
                        <p className="text-gray-400 font-light leading-relaxed mb-10">
                            From deep tissue massages and hot stone therapies to bespoke facials
                            and hydrotherapy, every detail is tailored to your unique wellness journey.
                        </p>

                        {!isBooking && status.type !== 'success' && (
                            <button
                                onClick={() => setIsBooking(true)}
                                className="inline-block border border-accent bg-accent text-black hover:bg-transparent hover:text-accent px-8 py-3 uppercase tracking-widest text-xs transition-colors"
                            >
                                Book a Treatment
                            </button>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Booking Modal / Form overlay */}
            <AnimatePresence>
                {isBooking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#111] border border-white/10 p-8 md:p-12 w-full max-w-xl rounded-2xl relative"
                        >
                            <button
                                onClick={() => setIsBooking(false)}
                                className="absolute top-4 right-6 text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>

                            <h3 className="text-2xl font-serif text-white mb-2 text-center">Schedule Treatment</h3>
                            <p className="text-gray-400 text-sm text-center mb-8 font-light">
                                Fill in the details to secure your relaxing session.
                            </p>

                            {status.type === 'error' && (
                                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 text-red-200 text-sm rounded">
                                    {status.message}
                                </div>
                            )}

                            <form onSubmit={handleBook} className="space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-transparent border-b border-white/20 pb-2 text-white placeholder:text-gray-600 focus:outline-none focus:border-accent transition-colors"
                                            placeholder="John Doe"
                                            value={formData.guest_name}
                                            onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            required
                                            className="w-full bg-transparent border-b border-white/20 pb-2 text-white placeholder:text-gray-600 focus:outline-none focus:border-accent transition-colors"
                                            placeholder="+1 234 567 890"
                                            value={formData.guest_phone}
                                            onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-transparent border-b border-white/20 pb-2 text-white placeholder:text-gray-600 focus:outline-none focus:border-accent transition-colors"
                                        placeholder="john@example.com"
                                        value={formData.guest_email}
                                        onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            required
                                            className="w-full bg-transparent border-b border-white/20 pb-2 text-white focus:outline-none focus:border-accent transition-colors [color-scheme:dark]"
                                            value={formData.booking_date}
                                            onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Treatment</label>
                                        <select
                                            className="w-full bg-transparent border-b border-white/20 pb-2 text-white focus:outline-none focus:border-accent transition-colors [&>option]:bg-[#111]"
                                            value={formData.service_type}
                                            onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                                        >
                                            <option value="Swedish Massage">Swedish Massage</option>
                                            <option value="Deep Tissue">Deep Tissue Massage</option>
                                            <option value="Aromatherapy">Aromatherapy</option>
                                            <option value="Facial Therapy">Facial Therapy</option>
                                            <option value="Hot Stone">Hot Stone Treatment</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status.type === 'loading'}
                                    className="w-full mt-8 border border-accent bg-accent text-black hover:bg-transparent hover:text-accent py-4 uppercase tracking-widest text-sm transition-colors flex justify-center items-center"
                                >
                                    {status.type === 'loading' ? <Loader2 className="animate-spin w-5 h-5" /> : 'Confirm Booking'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Overlay */}
            <AnimatePresence>
                {status.type === 'success' && status.code && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-transparent text-center p-8 max-w-lg"
                        >
                            <CheckCircle2 className="w-20 h-20 text-accent mx-auto mb-6" strokeWidth={1} />
                            <h3 className="text-3xl font-serif text-white mb-4">Request Confirmed</h3>
                            <p className="text-gray-400 font-light leading-relaxed mb-8">
                                Thank you for booking with The Oasis Spa. Please keep your tracking code safe for reference when you arrive.
                            </p>

                            <div className="bg-white/5 border border-accent/30 rounded-lg p-6 mb-8 inline-block">
                                <span className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Tracking Code</span>
                                <span className="text-2xl md:text-3xl font-mono text-accent tracking-wider font-semibold">
                                    {status.code}
                                </span>
                            </div>

                            <div>
                                <button
                                    onClick={() => setStatus({ type: 'idle' })}
                                    className="text-white hover:text-accent border-b border-transparent hover:border-accent pb-1 transition-all uppercase tracking-widest text-xs"
                                >
                                    Return to Spa
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

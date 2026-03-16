"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Users, MapPin, CheckCircle, Loader2 } from "lucide-react";
import ExtendedLuxuryText from "@/components/sections/ExtendedLuxuryText";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function BookPage() {
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState<any[]>([]);
    const [error, setError] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);
    const [roomId, setRoomId] = useState("");

    useEffect(() => {
        // Fetch rooms for the dropdown
        const fetchRooms = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/rooms");
                // Only show available rooms ideally, but we fetch all to let them see
                setRooms(res.data);
                if (res.data.length > 0) {
                    setRoomId(res.data[0]._id);
                }
            } catch (err) {
                console.error("Failed to load rooms", err);
            }
        };

        fetchRooms();
    }, []);

    const calculateTotal = (room_id: string, inDate: string, outDate: string) => {
        if (!room_id || !inDate || !outDate) return 0;
        const room = rooms.find(r => r._id === room_id);
        if (!room) return 0;

        const start = new Date(inDate);
        const end = new Date(outDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays > 0 ? diffDays * room.price_per_night : room.price_per_night;
    };

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const totalAmount = calculateTotal(roomId, checkIn, checkOut);
            if (totalAmount <= 0) {
                setError("Please select valid check-in and check-out dates.");
                setLoading(false);
                return;
            }

            const token = localStorage.getItem("userToken");
            console.log("Booking with user token:", token ? "Present" : "None");
            const config = {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            };

            await axios.post("http://localhost:5000/api/bookings", {
                guest_name: `${firstName} ${lastName}`,
                guest_email: email,
                guest_phone: phone,
                room_id: roomId,
                check_in_date: checkIn,
                check_out_date: checkOut,
                number_of_guests: guests,
                total_amount: totalAmount
            }, config);

            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create reservation. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-20 bg-black min-h-screen">
            <div className="container mx-auto px-6 lg:px-12 text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">Make a Reservation</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">Book your stay at N&B Italian Hotel and prepare for an unforgettable luxury experience.</p>
            </div>

            <div className="container mx-auto px-6 lg:px-12 max-w-4xl relative">
                <AnimatePresence>
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 z-50 bg-[#0a0a0a] border border-accent rounded-2xl p-12 flex flex-col items-center justify-center text-center"
                        >
                            <CheckCircle size={80} className="text-accent mb-6" />
                            <h2 className="text-3xl font-serif text-white mb-4">Congratulations! 🎉</h2>
                            <p className="text-gray-400 font-light text-lg mb-8 max-w-lg">
                                Your room has been successfully reserved. Thanks for choosing N&B Italian Hotel for your luxury getaway.
                            </p>
                            <Link href="/dashboard" className="bg-[#8c7853] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#726242] transition-colors">
                                View Dashboard
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="bg-[#141414] border border-white/5 rounded-2xl p-8 md:p-12 relative z-10">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-4 mb-6 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleBooking}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Check-in Date</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                        <Calendar size={18} />
                                    </div>
                                    <input
                                        type="date"
                                        required
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        className="w-full bg-[#0a0a0a] border border-white/10 text-white p-4 pl-12 focus:outline-none focus:border-accent transition-colors rounded-lg"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Check-out Date</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                        <Calendar size={18} />
                                    </div>
                                    <input
                                        type="date"
                                        required
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                        className="w-full bg-[#0a0a0a] border border-white/10 text-white p-4 pl-12 focus:outline-none focus:border-accent transition-colors rounded-lg"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Guests</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                        <Users size={18} />
                                    </div>
                                    <select
                                        value={guests}
                                        onChange={(e) => setGuests(Number(e.target.value))}
                                        className="w-full bg-[#0a0a0a] border border-white/10 text-white p-4 pl-12 focus:outline-none focus:border-accent transition-colors rounded-lg appearance-none"
                                    >
                                        <option value={1}>1 Guest</option>
                                        <option value={2}>2 Guests</option>
                                        <option value={3}>3 Guests</option>
                                        <option value={4}>4+ Guests</option>
                                    </select>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Room Type</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                        <MapPin size={18} />
                                    </div>
                                    <select
                                        required
                                        value={roomId}
                                        onChange={(e) => setRoomId(e.target.value)}
                                        className="w-full bg-[#0a0a0a] border border-white/10 text-white p-4 pl-12 focus:outline-none focus:border-accent transition-colors rounded-lg appearance-none"
                                    >
                                        {rooms.map((room) => (
                                            <option key={room._id} value={room._id}>
                                                {room.name} - ${room.price_per_night}/night
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">First Name</label>
                                <input
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="John"
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white p-4 focus:outline-none focus:border-accent transition-colors rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Doe"
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white p-4 focus:outline-none focus:border-accent transition-colors rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white p-4 focus:outline-none focus:border-accent transition-colors rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+1 234 567 8900"
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white p-4 focus:outline-none focus:border-accent transition-colors rounded-lg"
                                />
                            </div>
                        </div>

                        {roomId && checkIn && checkOut && (
                            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-white/10 mt-6 flex justify-between items-center">
                                <span className="text-gray-400">Total Estimated Cost:</span>
                                <span className="text-2xl font-serif text-accent flex items-center">
                                    ${calculateTotal(roomId, checkIn, checkOut).toLocaleString()}
                                </span>
                            </div>
                        )}

                        <div className="pt-8">
                            <button
                                type="submit"
                                disabled={loading || !roomId || rooms.length === 0}
                                className="w-full flex justify-center items-center bg-accent text-black font-semibold py-4 uppercase tracking-widest hover:bg-white transition-colors rounded-lg disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Confirm Reservation'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ExtendedLuxuryText />
        </div>
    );
}

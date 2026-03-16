"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Calendar, Clock, CreditCard, User, Loader2 } from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import BubbleLoader from "@/components/ui/BubbleLoader";

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    createdAt?: string;
}

interface Booking {
    _id: string;
    room_id: {
        name: string;
        price_per_night: number;
    };
    check_in_date: string;
    check_out_date: string;
    booking_status: string;
    total_amount: number;
}

interface PaymentMethod {
    _id: string;
    provider: string;
    details: string;
}

export default function ClientDashboard() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem("userToken");

            if (!token) {
                router.push("/login");
                return;
            }

            try {
                // Fetch User Profile
                const userConfig = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const userRes = await axios.get("http://localhost:5000/api/users/profile", userConfig);
                setUser(userRes.data);

                // Fetch User Bookings
                const bookingsRes = await axios.get("http://localhost:5000/api/bookings/mybookings", userConfig);
                setBookings(bookingsRes.data);

                // Fetch Active Payment Methods
                const methodsRes = await axios.get("http://localhost:5000/api/payment-methods");
                setPaymentMethods(methodsRes.data);

            } catch (error) {
                console.error(error);
                localStorage.removeItem("userToken");
                router.push("/login");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        toast.success("Logged out safely.");
        setTimeout(() => {
            router.push("/login");
        }, 1000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 flex justify-center items-center">
                <BubbleLoader />
            </div>
        );
    }

    if (!user) return null;

    // Format date roughly
    const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently';

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20">
            <Toaster position="top-center" toastOptions={{ style: { background: '#111', color: '#fff', border: '1px solid #333' } }} />

            <div className="container mx-auto px-6 lg:px-12 max-w-6xl">

                {/* Header Profile Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-8 border-b border-white/10">
                    <div className="flex items-center space-x-6 mb-6 md:mb-0">
                        <div className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-white/20">
                            <User size={32} className="text-gray-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-serif text-white mb-1">Welcome back, {user.name}</h1>
                            <p className="text-gray-400 text-sm">N&B Rewards Member since {memberSince}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <LogOut size={16} className="mr-2" />
                        <span className="text-sm uppercase tracking-widest font-bold">Sign Out</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-xl font-serif text-white mb-6 flex items-center">
                                <Calendar className="mr-3 text-accent" /> Your Upcoming Stays
                            </h2>

                            {bookings.length > 0 ? (
                                bookings.map((booking, idx) => (
                                    <div key={idx} className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden mb-6 group hover:border-white/20 transition-colors">
                                        <div className="p-8">
                                            <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                                                <div>
                                                    <h3 className="text-2xl font-serif text-white mb-1">{booking.room_id?.name || "Premium Suite"}</h3>
                                                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Booking #{booking._id.substring(0, 8)}</p>

                                                    <div className="flex items-center space-x-4 mt-3">
                                                        <div className="bg-[#1a1a1a] px-3 py-1.5 rounded flex flex-col">
                                                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Per Night</span>
                                                            <span className="text-white font-serif">${booking.room_id?.price_per_night?.toLocaleString() || "0"}</span>
                                                        </div>
                                                        <div className="bg-[#1a1a1a] px-3 py-1.5 rounded flex flex-col">
                                                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Total Est.</span>
                                                            <span className="text-accent font-serif">${booking.total_amount?.toLocaleString() || "0"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-widest font-bold ${booking.booking_status === 'confirmed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                    {booking.booking_status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mt-6">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Check-in</p>
                                                    <p className="text-white">{new Date(booking.check_in_date).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Check-out</p>
                                                    <p className="text-white">{new Date(booking.check_out_date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-[#121212] border border-white/5 rounded-2xl p-8 text-center text-gray-500">
                                    You have no upcoming stays. <br /><Link href="/rooms" className="text-accent underline mt-2 block">Browse Rooms</Link>
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="text-xl font-serif text-white mb-6 flex items-center">
                                <Clock className="mr-3 text-gray-500" /> Past Stays
                            </h2>
                            <div className="bg-[#121212] border border-white/5 rounded-2xl p-8 text-center text-gray-500">
                                You have no past stays with us.
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-[#141414] border border-white/5 rounded-2xl p-8">
                            <h3 className="text-lg font-serif text-white mb-6 border-b border-white/10 pb-4">Profile Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Full Name</p>
                                    <p className="text-white">{user.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Email Address</p>
                                    <p className="text-white">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Password</p>
                                    <p className="text-white">********</p>
                                </div>
                                <button className="text-xs uppercase tracking-widest text-accent pt-4 font-bold hover:text-white transition-colors">Edit Profile</button>
                            </div>
                        </div>

                        <div className="bg-[#141414] border border-white/5 rounded-2xl p-8">
                            <h3 className="text-lg font-serif text-white mb-6 border-b border-white/10 pb-4 flex items-center">
                                <CreditCard size={18} className="mr-2" /> Payment Options
                            </h3>

                            {paymentMethods.length > 0 ? (
                                <div className="space-y-4">
                                    {paymentMethods.map((method) => (
                                        <div key={method._id} className="bg-[#1a1a1a] border border-white/5 rounded p-4">
                                            <h4 className="text-white font-serif mb-2">{method.provider}</h4>
                                            <p className="text-xs text-gray-400 font-light whitespace-pre-wrap leading-relaxed">{method.details}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 mb-4">No payment methods configured by hotel.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

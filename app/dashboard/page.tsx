"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Calendar, Clock, CreditCard, User, Loader2, ShieldCheck, X } from "lucide-react";
import { apiClient, getImageUrl } from "@/lib/api";
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
    room_id?: {
        _id: string;
        name: string;
        price_per_night: number;
        description?: string;
    } | null;
    check_in_date: string;
    check_out_date: string;
    booking_status: "pending" | "confirmed" | "approved" | "cancelled";
    total_amount: number;
    payment?: {
        _id: string;
        status: string;
        amount: number;
        payment_method: string;
        payment_date?: string;
    } | null;
}

interface PaymentMethod {
    _id: string;
    provider: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    details: string;
    isActive: boolean;
}

export default function ClientDashboard() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [submittingPaymentId, setSubmittingPaymentId] = useState<string | null>(null);
    const lastPaymentMethodsStrRef = useRef("");
    const router = useRouter();

    const fetchDashboardData = async () => {
        const token = localStorage.getItem("userToken");

        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const userConfig = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const userRes = await apiClient.get("/api/users/profile", userConfig);
            setUser(userRes.data);

            const bookingsRes = await apiClient.get("/api/bookings/mybookings", userConfig);
            setBookings(bookingsRes.data || []);

            const methodsRes = await apiClient.get("/api/paymentmethods");
            const data = methodsRes.data || [];
            setPaymentMethods(data);
            lastPaymentMethodsStrRef.current = JSON.stringify(data);

        } catch (error) {
            console.error("Dashboard error:", error);
            localStorage.removeItem("userToken");
            router.push("/login");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();

        const interval = setInterval(() => {
            const token = localStorage.getItem("userToken");
            if (token) {
                const userConfig = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                apiClient.get("/api/bookings/mybookings", userConfig)
                    .then((res) => { setBookings(res.data || []); })
                    .catch((err) => console.warn("Poll bookings error:", err));

                apiClient.get("/api/paymentmethods")
                    .then((res) => {
                        const newMethods = res.data || [];
                        const newStr = JSON.stringify(newMethods);
                        if (lastPaymentMethodsStrRef.current && newStr !== lastPaymentMethodsStrRef.current) {
                            toast.success("Hotel payment account details have been updated.", {
                                icon: "🔔",
                                style: {
                                    background: "#141414",
                                    color: "#fff",
                                    border: "1px solid #d4af37",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    padding: "16px",
                                },
                                duration: 6000,
                            });
                        }
                        setPaymentMethods(newMethods);
                        lastPaymentMethodsStrRef.current = newStr;
                    })
                    .catch((err) => console.warn("Poll payment methods error:", err));
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        toast.success("Logged out safely.");
        setTimeout(() => { router.push("/login"); }, 1000);
    };

    const handleConfirmPayment = async (bookingId: string, amount: number) => {
        setSubmittingPaymentId(bookingId);
        try {
            const token = localStorage.getItem("userToken");
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await apiClient.post("/api/payments", {
                booking_id: bookingId,
                amount: amount,
                payment_method: "bank_transfer",
                receipt_url: ""
            }, config);

            toast.success("✅ Payment status submitted! The admin will verify your payment shortly.");

            const bookingsRes = await apiClient.get("/api/bookings/mybookings", config);
            setBookings(bookingsRes.data || []);
        } catch (error: any) {
            console.error("Error submitting payment:", error);
            toast.error(error.response?.data?.message || "Failed to submit payment status");
        } finally {
            setSubmittingPaymentId(null);
        }
    };

    // ✅ FIX: isLoading return was missing its wrapping </div>,
    // which caused the JSX tree to be off by one tag, pushing the
    // function's closing } onto the same line as a </div> at line 623.
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 flex flex-col justify-center items-center">
                <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
                <p className="text-gray-400 font-light tracking-widest uppercase text-xs">
                    Loading Secure Dashboard...
                </p>
            </div>
        );
    }

    if (!user) return null;

    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "Recently";

    const pendingBookings   = bookings.filter((b) => b.booking_status === "pending");
    const activeBookings    = bookings.filter((b) => b.booking_status === "confirmed" || b.booking_status === "approved");
    const cancelledBookings = bookings.filter((b) => b.booking_status === "cancelled");

    const unpaidPendingBooking = bookings.find(
        (b) => b.booking_status === "pending" && !b.payment
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20 font-sans">
            <Toaster
                position="top-center"
                toastOptions={{ style: { background: "#111", color: "#fff", border: "1px solid #333" } }}
            />

            <div className="container mx-auto px-6 lg:px-12 max-w-6xl">

                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-8 border-b border-white/10 gap-6">
                    <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-white/10">
                            <User size={28} className="text-accent" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-serif text-white mb-1">
                                Welcome, {user.name}
                            </h1>
                            <p className="text-gray-500 text-xs tracking-wider uppercase">
                                Luxury Rewards Member Since {memberSince}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer border border-white/10 px-4 py-2 hover:bg-white/5 rounded-md"
                    >
                        <LogOut size={16} className="mr-2 text-red-500" />
                        <span className="text-xs uppercase tracking-widest font-bold font-sans">Sign Out</span>
                    </button>
                </div>

                {unpaidPendingBooking ? (
                    /* ── LOCKED: Payment Required ── */
                    <div className="max-w-2xl mx-auto bg-[#141414] border border-yellow-500/30 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-yellow-500/50">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-2 h-2 bg-yellow-500 rounded-full animate-ping" />
                                        <h3 className="text-xl font-serif text-white font-semibold">
                                            🔒 Locked — Payment Required
                                        </h3>
                                    </div>
                                    <p className="text-xs uppercase tracking-widest text-gray-500 font-mono">
                                        Booking Reference: #{unpaidPendingBooking._id.substring(0, 8)}
                                    </p>
                                </div>
                                <span className="px-3 py-1 rounded bg-yellow-500/10 text-yellow-500 text-xs font-bold uppercase tracking-wider">
                                    Awaiting Payment
                                </span>
                            </div>

                            <div className="bg-yellow-500/5 border border-yellow-500/10 p-6 rounded-lg mb-6">
                                <p className="text-sm text-yellow-500/80 leading-relaxed mb-4">
                                    To unlock your suite details and access your full booking history, please transfer the exact booking cost manually using the bank account details displayed below. Once you have transferred the funds, click the <strong>"Payment Made"</strong> button.
                                </p>

                                <div className="space-y-4 mb-6 border-t border-b border-white/5 py-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Reserved Room:</span>
                                        <span className="text-white font-medium">
                                            {(unpaidPendingBooking.room_id as any)?.name || "Premium Suite"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Location:</span>
                                        <span className="text-white font-medium">
                                            {(unpaidPendingBooking.room_id as any)?.location || "Benin"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Dates:</span>
                                        <span className="text-white font-medium">
                                            {new Date(unpaidPendingBooking.check_in_date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                                            {" "}–{" "}
                                            {new Date(unpaidPendingBooking.check_out_date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center bg-black/40 p-4 border border-white/5 rounded-lg mb-6">
                                    <span className="text-gray-400 text-xs uppercase tracking-widest">Amount to Transfer:</span>
                                    <span className="text-2xl font-serif text-accent font-semibold">
                                        ₦{unpaidPendingBooking.total_amount.toLocaleString()}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs uppercase tracking-wider text-gray-400 font-bold border-b border-white/5 pb-2">
                                        Hotel Bank Details:
                                    </h4>
                                    {paymentMethods.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-3">
                                            {paymentMethods.map((method) => (
                                                <div key={method._id} className="bg-black/30 border border-white/5 p-4 rounded-lg">
                                                    <div className="flex justify-between border-b border-white/5 pb-2 mb-2 text-xs">
                                                        <span className="text-gray-500 uppercase font-semibold">Method</span>
                                                        <span className="text-white font-medium">{method.provider}</span>
                                                    </div>
                                                    {method.bankName && (
                                                        <div className="flex justify-between text-xs mb-1">
                                                            <span className="text-gray-500">Bank Name</span>
                                                            <span className="text-white font-medium">{method.bankName}</span>
                                                        </div>
                                                    )}
                                                    {method.accountNumber && (
                                                        <div className="flex justify-between text-xs mb-1">
                                                            <span className="text-gray-500">Account Number</span>
                                                            <span className="text-accent font-mono tracking-widest font-semibold">{method.accountNumber}</span>
                                                        </div>
                                                    )}
                                                    {method.accountName && (
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-gray-500">Account Name</span>
                                                            <span className="text-white">{method.accountName}</span>
                                                        </div>
                                                    )}
                                                    {(!method.bankName && !method.accountNumber) && (
                                                        <p className="text-[11px] text-gray-400 whitespace-pre-wrap mt-2 font-mono">
                                                            {method.details}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-black/50 border border-white/5 p-4 rounded text-center">
                                            <Loader2 size={16} className="animate-spin mx-auto text-accent mb-2" />
                                            <p className="text-xs text-gray-500">Retrieving official payment accounts...</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => handleConfirmPayment(unpaidPendingBooking._id, unpaidPendingBooking.total_amount)}
                                disabled={submittingPaymentId === unpaidPendingBooking._id}
                                className="w-full bg-accent hover:bg-white text-black font-bold py-4 uppercase tracking-widest text-xs transition-colors flex justify-center items-center gap-2 rounded cursor-pointer mt-6"
                            >
                                {submittingPaymentId === unpaidPendingBooking._id ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Submitting Payment...
                                    </>
                                ) : (
                                    "Payment Made"
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ── UNLOCKED DASHBOARD ── */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-12">

                            {/* 1. Pending Bookings */}
                            {pendingBookings.length > 0 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-2">
                                        <Clock className="text-yellow-500 animate-pulse" size={24} />
                                        Pending Reservations
                                    </h2>

                                    {pendingBookings.map((booking) => {
                                        const roomImages = (booking.room_id as any)?.images || [];
                                        const roomImage  = roomImages.length > 0 ? roomImages[0] : "/images/room-placeholder.jpg";
                                        return (
                                            <div key={booking._id} className="bg-[#141414] border border-yellow-500/20 rounded-xl overflow-hidden mb-6">
                                                <div className="relative w-full h-56 bg-zinc-950">
                                                    <Image
                                                        src={getImageUrl(roomImage)}
                                                        alt={booking.room_id?.name || "Room"}
                                                        fill
                                                        className="object-cover opacity-75"
                                                        sizes="(max-width: 768px) 100vw, 800px"
                                                        priority
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
                                                    <span className="absolute top-4 left-4 z-10 text-[10px] tracking-[0.25em] uppercase text-yellow-500 bg-black/85 border border-yellow-500/20 px-3 py-1.5 backdrop-blur-sm">
                                                        Awaiting Verification
                                                    </span>
                                                </div>

                                                <div className="p-8">
                                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-white/5 gap-4">
                                                        <div>
                                                            <h3 className="text-2xl font-serif text-white font-medium">
                                                                {booking.room_id?.name || "Premium Room"}
                                                            </h3>
                                                            <p className="text-xs uppercase tracking-widest text-gray-500 mt-1 font-mono">
                                                                Ref: #{booking._id.substring(0, 8)}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-accent font-serif text-2xl font-bold">
                                                                ₦{booking.total_amount.toLocaleString()}
                                                            </span>
                                                            <span className="block text-[9px] tracking-wider text-gray-500 uppercase mt-0.5">
                                                                Total Price (Paid)
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300 mb-6">
                                                        <div>
                                                            <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Check-In Date</span>
                                                            <p className="text-white font-medium">
                                                                {new Date(booking.check_in_date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Check-Out Date</span>
                                                            <p className="text-white font-medium">
                                                                {new Date(booking.check_out_date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {booking.room_id?.description && (
                                                        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                                                            {booking.room_id.description}
                                                        </p>
                                                    )}

                                                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-3">
                                                        <Loader2 className="w-5 h-5 text-yellow-500 animate-spin flex-shrink-0" />
                                                        <p className="text-xs text-yellow-400 font-medium">
                                                            ⏳ Payment submitted! Our accounting desk is verifying your transaction. Your stay status will update automatically.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* 2. Active / Confirmed Stays */}
                            <div>
                                <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-2">
                                    <ShieldCheck className="text-green-500" size={24} />
                                    Upcoming Stays
                                </h2>

                                {activeBookings.length > 0 ? (
                                    activeBookings.map((booking) => {
                                        const roomImages = (booking.room_id as any)?.images || [];
                                        const roomImage  = roomImages.length > 0 ? roomImages[0] : "/images/room-placeholder.jpg";
                                        return (
                                            <div key={booking._id} className="bg-[#141414] border border-green-500/20 rounded-xl overflow-hidden mb-6">
                                                <div className="relative w-full h-56 bg-zinc-950">
                                                    <Image
                                                        src={getImageUrl(roomImage)}
                                                        alt={booking.room_id?.name || "Room"}
                                                        fill
                                                        className="object-cover opacity-80"
                                                        sizes="(max-width: 768px) 100vw, 800px"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
                                                    <span className="absolute top-4 left-4 z-10 text-[10px] tracking-[0.25em] uppercase text-green-500 bg-black/85 border border-green-500/20 px-3 py-1.5 backdrop-blur-sm">
                                                        Confirmed stay
                                                    </span>
                                                </div>

                                                <div className="p-8">
                                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-white/5 gap-4">
                                                        <div>
                                                            <h3 className="text-2xl font-serif text-white font-medium">
                                                                {booking.room_id?.name || "Premium Suite"}
                                                            </h3>
                                                            <p className="text-xs uppercase tracking-widest text-gray-500 mt-1 font-mono">
                                                                Ref: #{booking._id.substring(0, 8)}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-green-500 font-serif text-2xl font-bold">
                                                                ₦{booking.total_amount.toLocaleString()}
                                                            </span>
                                                            <span className="block text-[9px] tracking-wider text-gray-500 uppercase mt-0.5">
                                                                Paid Amount
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300 mb-6">
                                                        <div>
                                                            <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Arrival Date</span>
                                                            <p className="text-white font-medium">
                                                                {new Date(booking.check_in_date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Departure Date</span>
                                                            <p className="text-white font-medium">
                                                                {new Date(booking.check_out_date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
                                                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                                                        <p className="text-xs text-green-400 font-medium">
                                                            🏨 Welcome! Your room reservation has been approved and locked in. We are looking forward to hosting you.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="bg-[#121212] border border-white/5 rounded-xl p-8 text-center text-gray-500">
                                        You have no active stays booked.{" "}
                                        <Link href="/rooms" className="text-accent underline mt-2 block font-medium hover:text-white transition-colors">
                                            Browse Available Rooms
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* 3. Cancelled Reservations */}
                            {cancelledBookings.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-serif text-white mb-6">
                                        Cancelled Reservations
                                    </h2>
                                    <div className="space-y-4">
                                        {cancelledBookings.map((booking) => (
                                            <div key={booking._id} className="bg-[#141414] border border-red-500/20 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div>
                                                    <h3 className="text-lg font-serif text-white font-medium">
                                                        {booking.room_id?.name || "Room"}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(booking.check_in_date).toLocaleDateString()} –{" "}
                                                        {new Date(booking.check_out_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className="px-3 py-1 rounded bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider">
                                                    Cancelled
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>{/* end lg:col-span-2 */}

                        {/* ── Sidebar ── */}
                        <div className="space-y-8">

                            {/* Profile Block */}
                            <div className="bg-[#141414] border border-white/5 rounded-xl p-8">
                                <h3 className="text-lg font-serif text-white mb-6 border-b border-white/5 pb-3">
                                    Guest Profile
                                </h3>
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Guest Name</p>
                                        <p className="text-white font-medium">{user.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Email Address</p>
                                        <p className="text-white font-medium">{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="bg-[#141414] border border-white/5 rounded-xl p-8">
                                <h3 className="text-lg font-serif text-white mb-6 border-b border-white/5 pb-3 flex items-center gap-2">
                                    <CreditCard size={18} className="text-accent" /> Payment Methods
                                </h3>

                                {paymentMethods.length > 0 ? (
                                    <div className="space-y-4">
                                        {paymentMethods.map((method) => (
                                            <div key={method._id} className="bg-[#1a1a1a] border border-white/5 rounded p-4 text-xs space-y-1.5">
                                                <div className="flex justify-between border-b border-white/5 pb-1.5 mb-1.5">
                                                    <span className="text-gray-500 uppercase font-semibold text-[9px] tracking-wider">Method</span>
                                                    <span className="text-white font-medium">{method.provider}</span>
                                                </div>
                                                {method.bankName && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Bank:</span>
                                                        <span className="text-white">{method.bankName}</span>
                                                    </div>
                                                )}
                                                {method.accountNumber && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Account No:</span>
                                                        <span className="text-accent font-mono tracking-widest font-semibold">{method.accountNumber}</span>
                                                    </div>
                                                )}
                                                {method.accountName && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Account Name:</span>
                                                        <span className="text-white truncate max-w-[140px]" title={method.accountName}>{method.accountName}</span>
                                                    </div>
                                                )}
                                                {method.details && (
                                                    <p className="text-[10px] text-gray-400 leading-relaxed font-light mt-2 pt-2 border-t border-white/5 whitespace-pre-wrap font-sans">
                                                        {method.details}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500 italic">
                                        No payment accounts configured yet.
                                    </p>
                                )}
                            </div>

                        </div>{/* end sidebar */}

                    </div> /* end grid */
                )}

            </div>
        </div>
    );
}
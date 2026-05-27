"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient, getImageUrl } from "@/lib/api";
import Image from "next/image";
import {
    Loader2,
    Check,
    XCircle,
    DollarSign,
    Users,
    Bed,
    Calendar
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Room {
    _id: string;
    name: string;
    slug: string;
    price_per_night: number;
    availability_status: boolean;
}

interface Booking {
    _id: string;
    guest_name: string;
    guest_email: string;
    guest_phone: string;
    room_id?: { name: string; _id: string };
    user_id?: { name: string; _id: string };
    check_in_date: string;
    check_out_date: string;
    number_of_guests: number;
    total_amount: number;
    booking_status: "pending" | "approved" | "cancelled" | "confirmed";
}

interface Payment {
    _id: string;
    amount: number;
    status: "paid" | "pending" | "unpaid" | "flagged";
    payment_method: string;
    createdAt: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
}

export default function AdminDashboardOverview() {
    const router = useRouter();
    const [adminName, setAdminName] = useState("");
    const [rooms, setRooms] = useState<Room[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [roomImages, setRoomImages] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [processingBookingId, setProcessingBookingId] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        const name = localStorage.getItem("adminName");

        if (!token) {
            router.push("/admin/login");
            return;
        }

        setAdminName(name || "Admin");
        fetchOverviewData();

        const interval = setInterval(() => {
            fetchOverviewData();
        }, 30000); // Poll every 30 seconds

        return () => clearInterval(interval);
    }, [router]);

    const fetchOverviewData = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            const [roomsRes, bookingsRes, paymentsRes, usersRes, roomImagesRes] = await Promise.all([
                apiClient.get("/api/rooms", config).catch(() => ({ data: [] })),
                apiClient.get("/api/bookings", config).catch(() => ({ data: [] })),
                apiClient.get("/api/payments", config).catch(() => ({ data: [] })),
                apiClient.get("/api/users", config).catch(() => ({ data: [] })),
                apiClient.get("/api/roomimages").catch(() => ({ data: [] })),
            ]);

            setRooms(roomsRes.data || []);
            setBookings(bookingsRes.data || []);
            setPayments(paymentsRes.data || []);
            setUsers(usersRes.data || []);

            if (roomImagesRes.data && Array.isArray(roomImagesRes.data)) {
                const imageMap: Record<string, string> = {};
                roomImagesRes.data.forEach((img: any) => {
                    if (img.room_id && img.image_url) {
                        const roomId = typeof img.room_id === 'string' ? img.room_id : img.room_id._id;
                        if (!imageMap[roomId]) {
                            imageMap[roomId] = img.image_url;
                        }
                    }
                });
                setRoomImages(imageMap);
            }

            setIsLoading(false);
        } catch (error) {
            console.error("Overview fetch error:", error);
            toast.error("Failed to load overview data");
            setIsLoading(false);
        }
    };

    const handleApproveBooking = async (bookingId: string) => {
        setProcessingBookingId(bookingId);
        try {
            const token = localStorage.getItem("adminToken");
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            await apiClient.patch(
                `/api/bookings/${bookingId}/status`,
                { booking_status: "approved" },
                config
            );

            toast.success("✅ Booking approved!");
            fetchOverviewData();
        } catch (error) {
            console.error("Error approving booking:", error);
            toast.error("Failed to approve booking");
        } finally {
            setProcessingBookingId(null);
        }
    };

    const handleRejectBooking = async (bookingId: string) => {
        setProcessingBookingId(bookingId);
        try {
            const token = localStorage.getItem("adminToken");
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            await apiClient.patch(
                `/api/bookings/${bookingId}/status`,
                { booking_status: "cancelled" },
                config
            );

            toast.success("❌ Booking rejected");
            fetchOverviewData();
        } catch (error) {
            console.error("Error rejecting booking:", error);
            toast.error("Failed to reject booking");
        } finally {
            setProcessingBookingId(null);
        }
    };

    const totalRevenue = payments
        .filter(p => p.status === "paid")
        .reduce((acc, p) => acc + (p.amount || 0), 0);
        
    const pendingBookings = bookings.filter((b) => b.booking_status === "pending").length;
    const availableRooms = rooms.filter((r) => r.availability_status).length;
    const activeGuests = users.length;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
                <p className="text-gray-400 font-light tracking-wider uppercase text-xs">Loading Dashboard Overview...</p>
            </div>
        );
    }

    const pendingApprovalsList = bookings.filter((b) => b.booking_status === "pending");
    const recentBookingsList = bookings.slice(0, 5);

    return (
        <div className="space-y-8">
            <Toaster position="top-right" toastOptions={{ style: { background: '#111', color: '#fff', border: '1px solid #333' } }} />

            <div>
                <h2 className="text-3xl font-serif text-white mb-2">Dashboard Overview</h2>
                <p className="text-gray-400 font-light">Welcome back, <span className="text-white font-medium">{adminName}</span>. Here is an overview of your hotel's current performance.</p>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#141414] p-6 border border-white/5 rounded-lg flex flex-col justify-between">
                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider">Total Rooms</p>
                        <h3 className="text-3xl font-bold text-white mt-2">{rooms.length}</h3>
                    </div>
                    <div className="text-xs text-green-500 mt-4 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        {availableRooms} Rooms Available
                    </div>
                </div>

                <div className="bg-[#141414] p-6 border border-white/5 rounded-lg flex flex-col justify-between">
                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider">Pending Approvals</p>
                        <h3 className="text-3xl font-bold text-white mt-2">{pendingBookings}</h3>
                    </div>
                    <div className="text-xs text-yellow-500 mt-4 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-pulse"></span>
                        {pendingBookings} Bookings Awaiting Action
                    </div>
                </div>

                <div className="bg-[#141414] p-6 border border-white/5 rounded-lg flex flex-col justify-between">
                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider">Total Revenue</p>
                        <h3 className="text-3xl font-bold text-accent mt-2">₦{totalRevenue.toLocaleString()}</h3>
                    </div>
                    <div className="text-xs text-gray-400 mt-4">
                        From approved paid bookings
                    </div>
                </div>

                <div className="bg-[#141414] p-6 border border-white/5 rounded-lg flex flex-col justify-between">
                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider">Registered Guests</p>
                        <h3 className="text-3xl font-bold text-white mt-2">{activeGuests}</h3>
                    </div>
                    <div className="text-xs text-gray-400 mt-4">
                        Total customer profiles
                    </div>
                </div>
            </div>

            {/* Pending Approvals Table */}
            {pendingApprovalsList.length > 0 && (
                <div className="bg-[#141414] border border-yellow-500/20 rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5 bg-[#0d0d0d] flex justify-between items-center">
                        <h3 className="text-lg font-serif text-white">Pending Approvals</h3>
                        <span className="bg-yellow-500/10 text-yellow-500 text-xs px-2.5 py-1 rounded font-bold uppercase">Action Required</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#080808] text-gray-500 text-xs uppercase tracking-wider border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-3">Room</th>
                                    <th className="px-6 py-3">Guest Details</th>
                                    <th className="px-6 py-3">Stay Dates</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {pendingApprovalsList.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {booking.room_id && roomImages[booking.room_id._id] ? (
                                                    <div className="relative w-10 h-10 rounded overflow-hidden border border-white/10 flex-shrink-0">
                                                        <Image
                                                            src={getImageUrl(roomImages[booking.room_id._id])}
                                                            alt={booking.room_id.name}
                                                            fill
                                                            className="object-cover"
                                                            sizes="40px"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center text-[10px] text-gray-500">
                                                        No Image
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-white font-medium">{booking.room_id?.name || "N/A"}</p>
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Ref: #{booking._id.substring(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-white font-serif">{booking.guest_name}</p>
                                            <p className="text-xs text-gray-400 font-sans">{booking.guest_email} • {booking.guest_phone}</p>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-300 font-light">
                                            {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-white font-serif font-semibold">
                                            ₦{booking.total_amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button
                                                onClick={() => handleApproveBooking(booking._id)}
                                                disabled={processingBookingId === booking._id}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded transition-colors text-xs disabled:opacity-50 font-bold uppercase tracking-wider"
                                            >
                                                {processingBookingId === booking._id ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    <Check size={14} />
                                                )}
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleRejectBooking(booking._id)}
                                                disabled={processingBookingId === booking._id}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded transition-colors text-xs disabled:opacity-50 font-bold uppercase tracking-wider"
                                            >
                                                <XCircle size={14} />
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Recent Bookings List */}
            <div className="bg-[#141414] border border-white/5 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 bg-[#0d0d0d]">
                    <h3 className="text-lg font-serif text-white">Recent Reservations</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#080808] text-gray-500 text-xs uppercase tracking-wider border-b border-white/5">
                            <tr>
                                <th className="px-6 py-3">Guest Name</th>
                                <th className="px-6 py-3">Stay Dates</th>
                                <th className="px-6 py-3">Total Cost</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentBookingsList.map((booking) => (
                                <tr key={booking._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-white font-medium">{booking.guest_name}</p>
                                        <p className="text-xs text-gray-500">{booking.guest_email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-400">
                                        {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-white font-semibold">
                                        ₦{booking.total_amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded ${
                                                booking.booking_status === "approved" ||
                                                booking.booking_status === "confirmed"
                                                    ? "bg-green-500/15 text-green-400"
                                                    : booking.booking_status === "pending"
                                                    ? "bg-yellow-500/15 text-yellow-400"
                                                    : "bg-red-500/15 text-red-400"
                                            }`}
                                        >
                                            {booking.booking_status}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                            {recentBookingsList.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-light bg-black/10">
                                        No recent reservations found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import {
    Bed,
    Calendar,
    DollarSign,
    Users,
    Loader2,
    LogOut,
    Menu,
    X,
    Plus,
    Edit2,
    Trash2,
    Eye,
    Check,
    XCircle,
    Settings,
    Mail,
    Sparkles,
    Upload,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Room {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price_per_night: number;
    max_guests: number;
    room_size: string;
    bed_type: string;
    amenities: string[];
    availability_status: boolean;
    featured: boolean;
    createdAt: string;
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
    createdAt: string;
}

interface Payment {
    _id: string;
    booking_id?: string;
    amount: number;
    status: "paid" | "pending" | "unpaid" | "flagged";
    payment_method: string;
    receipt_url?: string;
    payment_date?: string;
    createdAt: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    role: string;
    createdAt: string;
}

interface SpaBooking {
    _id: string;
    guest_name: string;
    guest_email: string;
    guest_phone: string;
    user_id?: { name: string };
    booking_date: string;
    tracking_code: string;
    service_type: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    createdAt: string;
}

interface Gallery {
    _id: string;
    image_url: string;
    alt_text: string;
    category: string;
    createdAt: string;
}

interface Newsletter {
    _id: string;
    email: string;
    is_active: boolean;
    createdAt: string;
}

interface PaymentMethod {
    _id: string;
    provider: string;
    details: string;
    isActive: boolean;
    createdAt: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [adminName, setAdminName] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    // Data states
    const [rooms, setRooms] = useState<Room[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [spaBookings, setSpaBookings] = useState<SpaBooking[]>([]);
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [roomImages, setRoomImages] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    // Booking management states
    const [processingBookingId, setProcessingBookingId] = useState<string | null>(null);

    // Payment method form states
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [paymentFormData, setPaymentFormData] = useState({
        provider: "",
        details: "",
    });

    // Check authentication
    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        const name = localStorage.getItem("adminName");

        if (!token) {
            router.push("/admin/login");
            return;
        }

        setAdminName(name || "Admin");
        fetchAllData();
        
        // UPDATED: Poll for new bookings every 30 seconds (quieter)
        const interval = setInterval(() => {
            fetchAllData();
        }, 30000);

        return () => clearInterval(interval);
    }, [router]);

    // Fetch all data
    const fetchAllData = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            const [
                roomsRes,
                bookingsRes,
                paymentsRes,
                usersRes,
                spaRes,
                galleryRes,
                newsletterRes,
                paymentMethodsRes,
                roomImagesRes,
            ] = await Promise.all([
                apiClient.get("/api/rooms", config).catch(() => ({ data: [] })),
                apiClient.get("/api/bookings", config).catch(() => ({ data: [] })),
                apiClient.get("/api/payments", config).catch(() => ({ data: [] })),
                apiClient.get("/api/users", config).catch(() => ({ data: [] })),
                apiClient.get("/api/spa-bookings", config).catch(() => ({ data: [] })),
                apiClient.get("/api/gallery", config).catch(() => ({ data: [] })),
                apiClient.get("/api/newsletter", config).catch(() => ({ data: [] })),
                apiClient.get("/api/paymentmethods", config).catch(() => ({ data: [] })),
                apiClient.get("/api/roomimages").catch(() => ({ data: [] })),
            ]);

            setRooms(roomsRes.data || []);
            setBookings(bookingsRes.data || []);
            setPayments(paymentsRes.data || []);
            setUsers(usersRes.data || []);
            setSpaBookings(spaRes.data || []);
            setGalleries(galleryRes.data || []);
            setNewsletters(newsletterRes.data || []);
            setPaymentMethods(paymentMethodsRes.data || []);

            // Process room images
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
            console.error("Fetch error:", error);
            toast.error("Failed to load data");
            setIsLoading(false);
        }
    };

    // Handle booking approval
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

            // Update local state immediately
            setBookings(
                bookings.map((b) =>
                    b._id === bookingId ? { ...b, booking_status: "approved" } : b
                )
            );
        } catch (error) {
            console.error("Error approving booking:", error);
            toast.error("Failed to approve booking");
        } finally {
            setProcessingBookingId(null);
        }
    };

    // Handle booking rejection
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

            // Update local state immediately
            setBookings(
                bookings.map((b) =>
                    b._id === bookingId ? { ...b, booking_status: "cancelled" } : b
                )
            );
        } catch (error) {
            console.error("Error rejecting booking:", error);
            toast.error("Failed to reject booking");
        } finally {
            setProcessingBookingId(null);
        }
    };

    // Handle payment method submission
    const handleAddPaymentMethod = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!paymentFormData.provider || !paymentFormData.details) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            const token = localStorage.getItem("adminToken");
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            const response = await apiClient.post(
                "/api/paymentmethods",
                {
                    provider: paymentFormData.provider,
                    details: paymentFormData.details,
                    isActive: true,
                },
                config
            );

            toast.success("✅ Payment method added!");
            setPaymentMethods([...paymentMethods, response.data]);
            setPaymentFormData({ provider: "", details: "" });
            setShowPaymentForm(false);
        } catch (error) {
            console.error("Error adding payment method:", error);
            toast.error("Failed to add payment method");
        }
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminId");
        localStorage.removeItem("adminName");
        localStorage.removeItem("adminEmail");
        router.push("/admin/login");
    };

    // Calculate stats
    const totalRevenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
    const confirmedBookings = bookings.filter((b) => b.booking_status === "approved" || b.booking_status === "confirmed").length;
    const pendingBookings = bookings.filter((b) => b.booking_status === "pending").length;
    const availableRooms = rooms.filter((r) => r.availability_status).length;
    const paidPayments = payments.filter((p) => p.status === "paid").length;

    // Navigation items
    const navItems = [
        { id: "overview", label: "--- Overview", icon: "---" },
        { id: "rooms", label: "--- Rooms", icon: "---" },
        { id: "bookings", label: "--- Bookings", icon: "---" },
        { id: "payments", label: "--- Payments", icon: "---" },
        { id: "payment-settings", label: "--- Payment Settings", icon: "---" },
        { id: "users", label: "--- Users", icon: "---" },
        { id: "spa", label: "--- Spa Bookings", icon: "---" },
        { id: "gallery", label: "--- Gallery", icon: "---" },
        { id: "newsletter", label: "--- Newsletter", icon: "---" },
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Toaster position="top-right" />

            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#0a0a0a] border-b border-white/5">
                <div className="px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-serif text-accent tracking-widest uppercase">N&B Admin</h1>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-sm text-gray-400">
                            👋 Welcome, <span className="text-white font-semibold">{adminName}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded transition-colors text-sm"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:flex lg:w-64 bg-[#0a0a0a] border-r border-white/5 flex-col p-6 h-[calc(100vh-73px)] sticky top-16 overflow-y-auto">
                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full text-left px-4 py-3 rounded transition-colors text-sm ${
                                    activeTab === item.id
                                        ? "bg-accent/20 text-accent font-semibold"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Mobile Menu */}
                <div className="lg:hidden absolute top-20 left-6 z-50">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded transition-colors"
                    >
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    {sidebarOpen && (
                        <div className="absolute top-12 left-0 bg-[#0a0a0a] border border-white/5 rounded p-4 space-y-2 min-w-[200px]">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setSidebarOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 rounded transition-colors text-sm ${
                                        activeTab === item.id
                                            ? "bg-accent/20 text-accent"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
                    {/* OVERVIEW TAB */}
                    {activeTab === "overview" && (
                        <div className="space-y-8">
                            <h2 className="text-3xl font-serif text-white">Dashboard Overview</h2>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-[#141414] p-6 border border-white/5 rounded-lg">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-gray-500 text-sm uppercase tracking-wider">Total Rooms</p>
                                            <h3 className="text-3xl font-bold text-white mt-2">{rooms.length}</h3>
                                        </div>
                                        <span className="text-4xl"></span>
                                    </div>
                                    <p className="text-sm text-green-500">{availableRooms} available</p>
                                </div>

                                <div className="bg-[#141414] p-6 border border-white/5 rounded-lg">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-gray-500 text-sm uppercase tracking-wider">Total Bookings</p>
                                            <h3 className="text-3xl font-bold text-white mt-2">{bookings.length}</h3>
                                        </div>
                                        <span className="text-4xl"></span>
                                    </div>
                                    <p className="text-sm text-yellow-500">{pendingBookings} pending approval</p>
                                </div>

                                <div className="bg-[#141414] p-6 border border-white/5 rounded-lg">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-gray-500 text-sm uppercase tracking-wider">Total Revenue</p>
                                            <h3 className="text-3xl font-bold text-white mt-2">
                                                ${totalRevenue.toLocaleString()}
                                            </h3>
                                        </div>
                                        <span className="text-4xl"></span>
                                    </div>
                                    <p className="text-sm text-green-500">{paidPayments} paid</p>
                                </div>

                                <div className="bg-[#141414] p-6 border border-white/5 rounded-lg">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-gray-500 text-sm uppercase tracking-wider">Total Guests</p>
                                            <h3 className="text-3xl font-bold text-white mt-2">{users.length}</h3>
                                        </div>
                                        <span className="text-4xl">👥</span>
                                    </div>
                                    <p className="text-sm text-blue-500">Registered users</p>
                                </div>
                            </div>

                            {/* Pending Bookings Alert */}
                            {pendingBookings > 0 && (
                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
                                    <h3 className="text-lg text-yellow-500 font-semibold mb-2">
                                      {pendingBookings} Pending Booking{pendingBookings > 1 ? "s" : ""} Awaiting Approval
                                    </h3>
                                    <p className="text-yellow-400/80">
                                        Review and approve/reject bookings in the Bookings tab to process them.
                                    </p>
                                </div>
                            )}

                            {/* Recent Pending Bookings */}
                            {pendingBookings > 0 && (
                                <div className="bg-[#141414] border border-white/5 rounded-lg overflow-hidden">
                                    <div className="px-6 py-4 border-b border-white/5 bg-[#0a0a0a]">
                                        <h3 className="text-lg font-semibold">Pending Approvals</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-[#0a0a0a]">
                                                <tr className="border-b border-white/5">
                                                    <th className="px-6 py-3 text-left text-gray-500">Room & Guest</th>
                                                    <th className="px-6 py-3 text-left text-gray-500">Check-in</th>
                                                    <th className="px-6 py-3 text-left text-gray-500">Check-out</th>
                                                    <th className="px-6 py-3 text-left text-gray-500">Amount</th>
                                                    <th className="px-6 py-3 text-left text-gray-500">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bookings
                                                    .filter((b) => b.booking_status === "pending")
                                                    .slice(0, 5)
                                                    .map((booking) => (
                                                        <tr key={booking._id} className="border-b border-white/5 hover:bg-white/5">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    {booking.room_id && roomImages[booking.room_id._id] ? (
                                                                        <img 
                                                                            src={roomImages[booking.room_id._id]} 
                                                                            alt={booking.room_id.name}
                                                                            className="w-10 h-10 rounded object-cover"
                                                                            onError={(e) => {
                                                                                console.error("Image failed:", roomImages[booking.room_id!._id]);
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-500">
                                                                            No img
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <p className="text-sm font-medium">{booking.room_id?.name || "N/A"}</p>
                                                                        <p className="text-xs text-gray-400">{booking.guest_name}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {new Date(booking.check_in_date).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {new Date(booking.check_out_date).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-6 py-4">${booking.total_amount.toLocaleString()}</td>
                                                            <td className="px-6 py-4 flex gap-2">
                                                                <button
                                                                    onClick={() => handleApproveBooking(booking._id)}
                                                                    disabled={processingBookingId === booking._id}
                                                                    className="flex items-center gap-1 px-3 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded transition-colors text-xs disabled:opacity-50"
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
                                                                    className="flex items-center gap-1 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded transition-colors text-xs disabled:opacity-50"
                                                                >
                                                                    {processingBookingId === booking._id ? (
                                                                        <Loader2 size={14} className="animate-spin" />
                                                                    ) : (
                                                                        <XCircle size={14} />
                                                                    )}
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

                            {/* Recent Bookings */}
                            <div className="bg-[#141414] border border-white/5 rounded-lg overflow-hidden">
                                <div className="px-6 py-4 border-b border-white/5 bg-[#0a0a0a]">
                                    <h3 className="text-lg font-semibold">Recent Bookings</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-[#0a0a0a]">
                                            <tr className="border-b border-white/5">
                                                <th className="px-6 py-3 text-left text-gray-500">Guest Name</th>
                                                <th className="px-6 py-3 text-left text-gray-500">Check-in</th>
                                                <th className="px-6 py-3 text-left text-gray-500">Check-out</th>
                                                <th className="px-6 py-3 text-left text-gray-500">Amount</th>
                                                <th className="px-6 py-3 text-left text-gray-500">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookings.slice(0, 5).map((booking) => (
                                                <tr key={booking._id} className="border-b border-white/5 hover:bg-white/5">
                                                    <td className="px-6 py-4">{booking.guest_name}</td>
                                                    <td className="px-6 py-4">
                                                        {new Date(booking.check_in_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {new Date(booking.check_out_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">${booking.total_amount.toLocaleString()}</td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`px-3 py-1 text-xs rounded-full ${
                                                                booking.booking_status === "approved" ||
                                                                booking.booking_status === "confirmed"
                                                                    ? "bg-green-500/20 text-green-500"
                                                                    : booking.booking_status === "pending"
                                                                    ? "bg-yellow-500/20 text-yellow-500"
                                                                    : "bg-red-500/20 text-red-500"
                                                            }`}
                                                        >
                                                            {booking.booking_status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BOOKINGS TAB */}
                    {activeTab === "bookings" && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-serif text-white">Bookings Management</h2>

                            {/* Pending Bookings Section */}
                            {pendingBookings > 0 && (
                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 mb-6">
                                    <h3 className="text-lg text-yellow-500 font-semibold mb-4">
                                        Pending Bookings ({pendingBookings})
                                    </h3>
                                    <div className="bg-[#141414] border border-white/5 rounded-lg overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-[#0a0a0a]">
                                                    <tr className="border-b border-white/5">
                                                        <th className="px-6 py-3 text-left text-gray-500">Room</th>
                                                        <th className="px-6 py-3 text-left text-gray-500">Guest Name</th>
                                                        <th className="px-6 py-3 text-left text-gray-500">Email</th>
                                                        <th className="px-6 py-3 text-left text-gray-500">Phone</th>
                                                        <th className="px-6 py-3 text-left text-gray-500">Check-in</th>
                                                        <th className="px-6 py-3 text-left text-gray-500">Check-out</th>
                                                        <th className="px-6 py-3 text-left text-gray-500">Guests</th>
                                                        <th className="px-6 py-3 text-left text-gray-500">Amount</th>
                                                        <th className="px-6 py-3 text-left text-gray-500">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {bookings
                                                        .filter((b) => b.booking_status === "pending")
                                                        .map((booking) => (
                                                            <tr key={booking._id} className="border-b border-white/5 hover:bg-white/5">
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        {booking.room_id && roomImages[booking.room_id._id] ? (
                                                                            <img 
                                                                                src={roomImages[booking.room_id._id]} 
                                                                                alt={booking.room_id.name}
                                                                                className="w-12 h-12 rounded object-cover"
                                                                                onError={(e) => {
                                                                                    console.error("Image failed:", roomImages[booking.room_id!._id]);
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-500">
                                                                                No image
                                                                            </div>
                                                                        )}
                                                                        <span className="text-sm">{booking.room_id?.name || "N/A"}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">{booking.guest_name}</td>
                                                                <td className="px-6 py-4 text-gray-400">{booking.guest_email}</td>
                                                                <td className="px-6 py-4 text-gray-400">{booking.guest_phone}</td>
                                                                <td className="px-6 py-4">
                                                                    {new Date(booking.check_in_date).toLocaleDateString()}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {new Date(booking.check_out_date).toLocaleDateString()}
                                                                </td>
                                                                <td className="px-6 py-4">{booking.number_of_guests}</td>
                                                                <td className="px-6 py-4">${booking.total_amount.toLocaleString()}</td>
                                                                <td className="px-6 py-4 flex gap-2">
                                                                    <button
                                                                        onClick={() => handleApproveBooking(booking._id)}
                                                                        disabled={processingBookingId === booking._id}
                                                                        className="flex items-center gap-1 px-3 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded transition-colors text-xs disabled:opacity-50"
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
                                                                        className="flex items-center gap-1 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded transition-colors text-xs disabled:opacity-50"
                                                                    >
                                                                        {processingBookingId === booking._id ? (
                                                                            <Loader2 size={14} className="animate-spin" />
                                                                        ) : (
                                                                            <XCircle size={14} />
                                                                        )}
                                                                        Reject
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* All Bookings */}
                            <div className="bg-[#141414] border border-white/5 rounded-lg overflow-hidden">
                                <div className="px-6 py-4 border-b border-white/5 bg-[#0a0a0a]">
                                    <h3 className="text-lg font-semibold">All Bookings (Including User Bookings)</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-[#0a0a0a]">
                                            <tr className="border-b border-white/5">
                                                <th className="px-6 py-3 text-left text-gray-500">Room</th>
                                                <th className="px-6 py-3 text-left text-gray-500">Guest Name</th>
                                                <th className="px-6 py-3 text-left text-gray-500">Email</th>
                                                <th className="px-6 py-3 text-left text-gray-500">Check-in</th>
                                                <th className="px-6 py-3 text-left text-gray-500">Check-out</th>
                                                <th className="px-6 py-3 text-left text-gray-500">Total</th>
                                                <th className="px-6 py-3 text-left text-gray-500">Status</th>
                                                <th className="px-6 py-3 text-left text-gray-500">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookings.map((booking) => (
                                                <tr key={booking._id} className="border-b border-white/5 hover:bg-white/5">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            {booking.room_id && roomImages[booking.room_id._id] ? (
                                                                <img 
                                                                    src={roomImages[booking.room_id._id]} 
                                                                    alt={booking.room_id.name}
                                                                    className="w-12 h-12 rounded object-cover"
                                                                    onError={(e) => {
                                                                        console.error("Image failed:", roomImages[booking.room_id!._id]);
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-500">
                                                                    No image
                                                                </div>
                                                            )}
                                                            <span className="text-sm">{booking.room_id?.name || "N/A"}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">{booking.guest_name}</td>
                                                    <td className="px-6 py-4 text-gray-400">{booking.guest_email}</td>
                                                    <td className="px-6 py-4">
                                                        {new Date(booking.check_in_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {new Date(booking.check_out_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">${booking.total_amount.toLocaleString()}</td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`px-3 py-1 text-xs rounded-full ${
                                                                booking.booking_status === "approved" ||
                                                                booking.booking_status === "confirmed"
                                                                    ? "bg-green-500/20 text-green-500"
                                                                    : booking.booking_status === "pending"
                                                                    ? "bg-yellow-500/20 text-yellow-500"
                                                                    : "bg-red-500/20 text-red-500"
                                                            }`}
                                                        >
                                                            {booking.booking_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {booking.booking_status === "pending" && (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleApproveBooking(booking._id)}
                                                                    disabled={processingBookingId === booking._id}
                                                                    className="flex items-center gap-1 px-3 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded transition-colors text-xs disabled:opacity-50"
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
                                                                    className="flex items-center gap-1 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded transition-colors text-xs disabled:opacity-50"
                                                                >
                                                                    {processingBookingId === booking._id ? (
                                                                        <Loader2 size={14} className="animate-spin" />
                                                                    ) : (
                                                                        <XCircle size={14} />
                                                                    )}
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        )}
                                                        {booking.booking_status !== "pending" && (
                                                            <span className="text-gray-500 text-xs">—</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PAYMENT SETTINGS TAB */}
                    {activeTab === "payment-settings" && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-serif text-white">Payment Methods</h2>
                                <button
                                    onClick={() => setShowPaymentForm(!showPaymentForm)}
                                    className="flex items-center gap-2 px-4 py-2 bg-accent text-black rounded hover:bg-white transition-colors font-semibold"
                                >
                                    <Plus size={20} /> Add Payment Method
                                </button>
                            </div>

                            {/* Add Payment Method Form */}
                            {showPaymentForm && (
                                <div className="bg-[#141414] border border-accent/50 rounded-lg p-8">
                                    <h3 className="text-xl font-serif text-white mb-6">Add New Payment Method</h3>
                                    <form onSubmit={handleAddPaymentMethod} className="space-y-6">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">
                                                Payment Provider
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentFormData.provider}
                                                onChange={(e) =>
                                                    setPaymentFormData({
                                                        ...paymentFormData,
                                                        provider: e.target.value,
                                                    })
                                                }
                                                placeholder="e.g., Bank Transfer, PayPal, Bitcoin"
                                                className="w-full bg-[#0a0a0a] border border-white/10 text-white p-3 rounded focus:outline-none focus:border-accent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">
                                                Account Details
                                            </label>
                                            <textarea
                                                value={paymentFormData.details}
                                                onChange={(e) =>
                                                    setPaymentFormData({
                                                        ...paymentFormData,
                                                        details: e.target.value,
                                                    })
                                                }
                                                placeholder="Enter account details, bank information, etc."
                                                rows={4}
                                                className="w-full bg-[#0a0a0a] border border-white/10 text-white p-3 rounded focus:outline-none focus:border-accent resize-none"
                                            />
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                type="submit"
                                                className="flex-1 bg-accent text-black font-semibold py-3 rounded hover:bg-white transition-colors"
                                            >
                                                Save Payment Method
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowPaymentForm(false)}
                                                className="flex-1 bg-gray-700 text-white font-semibold py-3 rounded hover:bg-gray-600 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Payment Methods List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {paymentMethods.length > 0 ? (
                                    paymentMethods.map((method) => (
                                        <div
                                            key={method._id}
                                            className="bg-[#141414] border border-white/5 rounded-lg p-6"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-lg font-serif text-white">
                                                    {method.provider}
                                                </h3>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${
                                                        method.isActive
                                                            ? "bg-green-500/20 text-green-500"
                                                            : "bg-red-500/20 text-red-500"
                                                    }`}
                                                >
                                                    {method.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-400 whitespace-pre-wrap leading-relaxed mb-4">
                                                {method.details}
                                            </p>
                                            <div className="flex gap-2">
                                                <button className="flex-1 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded text-sm transition-colors">
                                                    Edit
                                                </button>
                                                <button className="flex-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded text-sm transition-colors">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full bg-[#141414] border border-white/5 rounded-lg p-8 text-center">
                                        <p className="text-gray-500 mb-4">No payment methods configured yet.</p>
                                        <button
                                            onClick={() => setShowPaymentForm(true)}
                                            className="text-accent hover:text-white transition-colors font-semibold"
                                        >
                                            Add the first payment method
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* OTHER TABS (SIMPLIFIED - keeping existing functionality) */}
                    {activeTab === "rooms" && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-serif text-white">Rooms Management</h2>
                            <div className="text-center text-gray-500 py-12">
                                <p>Room management interface coming soon...</p>
                            </div>
                        </div>
                    )}

                    {activeTab === "payments" && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-serif text-white">Payments Management</h2>
                            <div className="bg-[#141414] border border-white/5 rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-[#0a0a0a]">
                                            <tr className="border-b border-white/5">
                                                <th className="px-6 py-3 text-left text-gray-500">Amount</th>
                                                <th className="px-6 py-3 text-left text-gray-500">Status</th>
                                                <th className="px-6 py-3 text-left text-gray-500">Method</th>
                                                <th className="px-6 py-3 text-left text-gray-500">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payments.map((payment) => (
                                                <tr key={payment._id} className="border-b border-white/5 hover:bg-white/5">
                                                    <td className="px-6 py-4 font-semibold">
                                                        ${payment.amount.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`px-3 py-1 text-xs rounded-full ${
                                                                payment.status === "paid"
                                                                    ? "bg-green-500/20 text-green-500"
                                                                    : "bg-yellow-500/20 text-yellow-500"
                                                            }`}
                                                        >
                                                            {payment.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-400">{payment.payment_method}</td>
                                                    <td className="px-6 py-4">
                                                        {new Date(payment.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "users" && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-serif text-white">Guests Management</h2>
                            <div className="bg-[#141414] border border-white/5 rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-[#0a0a0a]">
                                            <tr className="border-b border-white/5">
                                                <th className="px-6 py-3 text-left text-gray-500">Name</th>
                                                <th className="px-6 py-3 text-left text-gray-500">Email</th>
                                                <th className="px-6 py-3 text-left text-gray-500">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user._id} className="border-b border-white/5 hover:bg-white/5">
                                                    <td className="px-6 py-4">{user.name}</td>
                                                    <td className="px-6 py-4 text-gray-400">{user.email}</td>
                                                    <td className="px-6 py-4">
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {(activeTab === "spa" ||
                        activeTab === "gallery" ||
                        activeTab === "newsletter") && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-serif text-white capitalize">
                                {activeTab === "spa"
                                    ? "Spa Bookings"
                                    : activeTab === "gallery"
                                    ? "Gallery"
                                    : "Newsletter"}{" "}
                                Management
                            </h2>
                            <div className="text-center text-gray-500 py-12">
                                <p>This section content coming soon...</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

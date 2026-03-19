"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Calendar, Clock, CreditCard, User, Loader2, X } from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast, Toaster } from "react-hot-toast";
import BubbleLoader from "@/components/ui/BubbleLoader";

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    createdAt?: string;
}

interface Room {
    _id: string;
    name: string;
    price_per_night: number;
    description?: string;
}

interface RoomImage {
    _id: string;
    room_id: string | { _id: string; name?: string };
    image_url: string;
    alt_text: string;
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
}

interface PaymentMethod {
    _id: string;
    provider: string;
    details: string;
}

export default function ClientDashboard() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [roomImages, setRoomImages] = useState<Record<string, string>>({});
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
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

                // Fetch User Profile
                console.log("Fetching user profile...");
                const userRes = await apiClient.get("/api/users/profile", userConfig);
                setUser(userRes.data);
                console.log("User profile:", userRes.data);

                // Fetch User Bookings
                console.log("Fetching bookings...");
                const bookingsRes = await apiClient.get("/api/bookings/mybookings", userConfig);
                console.log("Bookings response:", bookingsRes.data);
                setBookings(bookingsRes.data || []);

                // Fetch Active Payment Methods
                try {
                    const methodsRes = await apiClient.get("/api/paymentmethods");
                    setPaymentMethods(methodsRes.data || []);
                } catch (payError) {
                    console.warn("Could not fetch payment methods:", payError);
                }

            } catch (error) {
                console.error("Dashboard error:", error);
                localStorage.removeItem("userToken");
                router.push("/login");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();

        // ADDED: Poll for booking status updates every 5 seconds
        const interval = setInterval(() => {
            console.log("Polling for booking status updates...");
            const token = localStorage.getItem("userToken");
            if (token) {
                const userConfig = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                apiClient.get("/api/bookings/mybookings", userConfig)
                    .then((res) => {
                        console.log("Updated bookings from poll:", res.data);
                        setBookings(res.data || []);
                    })
                    .catch((err) => console.warn("Poll error:", err));
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [router]);

    // Fetch room images when component mounts
    useEffect(() => {
        const fetchRoomImages = async () => {
            try {
                console.log("Fetching room images...");
                const response = await apiClient.get("/api/roomimages");
                console.log("Room images from API:", response.data);
                
                if (response.data && Array.isArray(response.data)) {
                    const imageMap: Record<string, string> = {};
                    
                    response.data.forEach((img: RoomImage) => {
                        console.log("Processing image:", img);
                        
                        if (img.room_id && img.image_url) {
                            let roomId: string | null = null;
                            
                            if (typeof img.room_id === 'string') {
                                roomId = img.room_id;
                            } else if (typeof img.room_id === 'object' && img.room_id._id) {
                                roomId = (img.room_id as any)._id;
                            }
                            
                            if (roomId) {
                                imageMap[roomId] = img.image_url;
                                console.log(`✅ Mapped room ${roomId} to image:`, img.image_url);
                            }
                        }
                    });
                    
                    console.log("Final image map:", imageMap);
                    console.log("Image map keys:", Object.keys(imageMap));
                    setRoomImages(imageMap);
                }
            } catch (error) {
                console.error("Error fetching room images:", error);
            }
        };

        fetchRoomImages();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        toast.success("Logged out safely.");
        setTimeout(() => {
            router.push("/login");
        }, 1000);
    };

    const getBookingCardColor = (status: string) => {
        switch (status) {
            case "confirmed":
            case "approved":
                return "border-green-500/30 bg-green-500/5";
            case "pending":
                return "border-yellow-500/30 bg-yellow-500/5";
            case "cancelled":
                return "border-red-500/30 bg-red-500/5";
            default:
                return "border-white/5";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed":
            case "approved":
                return "bg-green-500/10 text-green-500";
            case "pending":
                return "bg-yellow-500/10 text-yellow-500";
            case "cancelled":
                return "bg-red-500/10 text-red-500";
            default:
                return "bg-gray-500/10 text-gray-500";
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 flex justify-center items-center">
                <BubbleLoader />
            </div>
        );
    }

    if (!user) return null;

    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "Recently";

    // Separate confirmed and pending bookings
    const upcomingBookings = bookings.filter(
        (b) => b.booking_status === "confirmed" || b.booking_status === "approved"
    );
    const pendingBookings = bookings.filter((b) => b.booking_status === "pending");
    const cancelledBookings = bookings.filter((b) => b.booking_status === "cancelled");

    // Helper function to get image for booking
    const getBookingImage = (booking: Booking) => {
        if (!booking.room_id?._id) return null;
        
        console.log(`Looking for image for room: ${booking.room_id._id}`);
        console.log(`Available images:`, roomImages);
        
        const image = roomImages[booking.room_id._id];
        console.log(`Found image: ${image || "NOT FOUND"}`);
        
        return image;
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20">
            <Toaster
                position="top-center"
                toastOptions={{ style: { background: "#111", color: "#fff", border: "1px solid #333" } }}
            />

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl w-full">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-10 right-0 text-white hover:text-gray-400"
                        >
                            <X size={24} />
                        </button>
                        <img src={selectedImage} alt="Room" className="w-full h-auto rounded-lg" />
                    </div>
                </div>
            )}

            <div className="container mx-auto px-6 lg:px-12 max-w-6xl">

                {/* Header Profile Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-8 border-b border-white/10">
                    <div className="flex items-center space-x-6 mb-6 md:mb-0">
                        <div className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-white/20">
                            <User size={32} className="text-gray-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-serif text-white mb-1">
                                Welcome back, {user.name}
                            </h1>
                            <p className="text-gray-400 text-sm">
                                N&B Rewards Member since {memberSince}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <LogOut size={16} className="mr-2" />
                        <span className="text-sm uppercase tracking-widest font-bold">Sign Out</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Pending Bookings */}
                        {pendingBookings.length > 0 && (
                            <div>
                                <h2 className="text-xl font-serif text-white mb-6 flex items-center">
                                    <Clock className="mr-3 text-yellow-500" /> Pending Reservations
                                </h2>

                                {pendingBookings.map((booking, idx) => {
                                    const bookingImage = getBookingImage(booking);
                                    
                                    return (
                                        <div
                                            key={idx}
                                            className={`bg-[#141414] border ${getBookingCardColor(
                                                booking.booking_status
                                            )} rounded-2xl overflow-hidden mb-6 group hover:border-white/20 transition-colors`}
                                        >
                                            {/* Room Image */}
                                            {bookingImage ? (
                                                <div
                                                    className="w-full h-48 overflow-hidden border-b border-white/5 cursor-pointer group"
                                                    onClick={() => setSelectedImage(bookingImage)}
                                                >
                                                    <img
                                                        src={bookingImage}
                                                        alt={booking.room_id?.name || "Room"}
                                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                        onError={(e) => {
                                                            console.error("Image failed to load:", bookingImage);
                                                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Room+Image";
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 border-b border-white/5 flex items-center justify-center">
                                                    <span className="text-gray-500">Loading image...</span>
                                                </div>
                                            )}

                                            <div className="p-8">
                                                <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-2xl font-serif text-white mb-1">
                                                            {booking.room_id?.name || "Room"}
                                                        </h3>
                                                        <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                                                            Booking #{booking._id.substring(0, 8)}
                                                        </p>

                                                        {booking.room_id?.description && (
                                                            <p className="text-sm text-gray-400 mb-2 leading-relaxed max-w-xl">
                                                                {booking.room_id.description}
                                                            </p>
                                                        )}

                                                        <div className="flex items-center space-x-4 mt-3">
                                                            <div className="bg-[#1a1a1a] px-3 py-1.5 rounded flex flex-col">
                                                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                                                                    Per Night
                                                                </span>
                                                                <span className="text-white font-serif">
                                                                    ${booking.room_id?.price_per_night?.toLocaleString() || "0"}
                                                                </span>
                                                            </div>
                                                            <div className="bg-[#1a1a1a] px-3 py-1.5 rounded flex flex-col">
                                                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                                                                    Total Est.
                                                                </span>
                                                                <span className="text-accent font-serif">
                                                                    ${booking.total_amount?.toLocaleString() || "0"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs uppercase tracking-widest font-bold ${getStatusColor(
                                                            booking.booking_status
                                                        )} whitespace-nowrap ml-4`}
                                                    >
                                                        {booking.booking_status}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mt-6">
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                                            Check-in
                                                        </p>
                                                        <p className="text-white">
                                                            {new Date(booking.check_in_date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                                            Check-out
                                                        </p>
                                                        <p className="text-white">
                                                            {new Date(booking.check_out_date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* CHANGED: Status message changes based on admin action */}
                                                {booking.booking_status === "pending" && (
                                                    <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded">
                                                        <p className="text-sm text-yellow-500">
                                                            ⏳ Awaiting admin confirmation. Your booking is under review.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Confirmed Bookings */}
                        <div>
                            <h2 className="text-xl font-serif text-white mb-6 flex items-center">
                                <Calendar className="mr-3 text-accent" /> Your Upcoming Stays
                            </h2>

                            {upcomingBookings.length > 0 ? (
                                upcomingBookings.map((booking, idx) => {
                                    const bookingImage = getBookingImage(booking);
                                    
                                    return (
                                        <div
                                            key={idx}
                                            className={`bg-[#141414] border ${getBookingCardColor(
                                                booking.booking_status
                                            )} rounded-2xl overflow-hidden mb-6 group hover:border-white/20 transition-colors`}
                                        >
                                            {/* Room Image */}
                                            {bookingImage ? (
                                                <div
                                                    className="w-full h-48 overflow-hidden border-b border-white/5 cursor-pointer group"
                                                    onClick={() => setSelectedImage(bookingImage)}
                                                >
                                                    <img
                                                        src={bookingImage}
                                                        alt={booking.room_id?.name || "Room"}
                                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                        onError={(e) => {
                                                            console.error("Image failed to load:", bookingImage);
                                                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Room+Image";
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 border-b border-white/5 flex items-center justify-center">
                                                    <span className="text-gray-500">Loading image...</span>
                                                </div>
                                            )}

                                            <div className="p-8">
                                                <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-2xl font-serif text-white mb-1">
                                                            {booking.room_id?.name || "Room"}
                                                        </h3>
                                                        <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                                                            Booking #{booking._id.substring(0, 8)}
                                                        </p>

                                                        {booking.room_id?.description && (
                                                            <p className="text-sm text-gray-400 mb-2 leading-relaxed max-w-xl">
                                                                {booking.room_id.description}
                                                            </p>
                                                        )}

                                                        <div className="flex items-center space-x-4 mt-3">
                                                            <div className="bg-[#1a1a1a] px-3 py-1.5 rounded flex flex-col">
                                                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                                                                    Per Night
                                                                </span>
                                                                <span className="text-white font-serif">
                                                                    ${booking.room_id?.price_per_night?.toLocaleString() || "0"}
                                                                </span>
                                                            </div>
                                                            <div className="bg-[#1a1a1a] px-3 py-1.5 rounded flex flex-col">
                                                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                                                                    Total Est.
                                                                </span>
                                                                <span className="text-accent font-serif">
                                                                    ${booking.total_amount?.toLocaleString() || "0"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs uppercase tracking-widest font-bold ${getStatusColor(
                                                            booking.booking_status
                                                        )} whitespace-nowrap ml-4`}
                                                    >
                                                        {booking.booking_status}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mt-6">
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                                            Check-in
                                                        </p>
                                                        <p className="text-white">
                                                            {new Date(booking.check_in_date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                                            Check-out
                                                        </p>
                                                        <p className="text-white">
                                                            {new Date(booking.check_out_date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* CHANGED: Different message for approved bookings */}
                                                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded">
                                                    <p className="text-sm text-green-500">
                                                        🏨 Room Reserved
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="bg-[#121212] border border-white/5 rounded-2xl p-8 text-center text-gray-500">
                                    You have no upcoming stays.{" "}
                                    <Link href="/rooms" className="text-accent underline mt-2 block">
                                        Browse Rooms
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Cancelled Bookings */}
                        {cancelledBookings.length > 0 && (
                            <div>
                                <h2 className="text-xl font-serif text-white mb-6 flex items-center">
                                    <Clock className="mr-3 text-red-500" /> Cancelled Reservations
                                </h2>

                                {cancelledBookings.map((booking, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-[#141414] border border-red-500/30 rounded-2xl overflow-hidden mb-6 p-8"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-serif text-white mb-2">
                                                    {booking.room_id?.name || "Room"}
                                                </h3>
                                                <p className="text-gray-400">
                                                    {new Date(booking.check_in_date).toLocaleDateString()} -{" "}
                                                    {new Date(booking.check_out_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className="px-3 py-1 rounded-full text-xs uppercase tracking-widest font-bold bg-red-500/10 text-red-500">
                                                Cancelled
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-[#141414] border border-white/5 rounded-2xl p-8">
                            <h3 className="text-lg font-serif text-white mb-6 border-b border-white/10 pb-4">
                                Profile Details
                            </h3>
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
                                <button className="text-xs uppercase tracking-widest text-accent pt-4 font-bold hover:text-white transition-colors">
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#141414] border border-white/5 rounded-2xl p-8">
                            <h3 className="text-lg font-serif text-white mb-6 border-b border-white/10 pb-4 flex items-center">
                                <CreditCard size={18} className="mr-2" /> Payment Options
                            </h3>

                            {paymentMethods.length > 0 ? (
                                <div className="space-y-4">
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method._id}
                                            className="bg-[#1a1a1a] border border-white/5 rounded p-4"
                                        >
                                            <h4 className="text-white font-serif mb-2">{method.provider}</h4>
                                            <p className="text-xs text-gray-400 font-light whitespace-pre-wrap leading-relaxed">
                                                {method.details}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 mb-4">
                                    No payment methods configured by hotel.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

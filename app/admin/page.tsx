"use client";

import { useQuery } from "@tanstack/react-query";
import { Bed, Calendar, DollarSign, Image as ImageIcon } from "lucide-react";
import axios from "axios";

// Helper to fetch generic stats - we'll infer them from the resources we have API endpoints for
const fetchDashboardStats = async () => {
    const token = localStorage.getItem("adminToken");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // In a real production app we'd aggregate this in a single backend endpoint to save calls
    const [rooms, bookings, payments, gallery] = await Promise.all([
        axios.get("http://localhost:5000/api/rooms", config).catch(() => ({ data: [] })),
        axios.get("http://localhost:5000/api/bookings", config).catch(() => ({ data: [] })),
        axios.get("http://localhost:5000/api/payments", config).catch(() => ({ data: [] })),
        axios.get("http://localhost:5000/api/gallery", config).catch(() => ({ data: [] }))
    ]);

    const totalRevenue = payments.data.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

    return {
        totalRooms: rooms.data.length || 0,
        totalBookings: bookings.data.length || 0,
        totalRevenue: totalRevenue || 0,
        galleryImages: gallery.data.length || 0,
        recentBookings: bookings.data.slice(0, 5) // Get latest 5
    };
}

export default function AdminOverview() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ["admin-stats"],
        queryFn: fetchDashboardStats,
        refetchInterval: 60000 // Refresh every minute
    });

    return (
        <div>
            <h2 className="text-3xl font-serif text-white mb-2">Dashboard Overview</h2>
            <p className="text-gray-400 font-light mb-10">Welcome back to the N&B Italian Hotel Admin Portal.</p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-[#141414] p-6 border border-white/5 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Total Rooms</p>
                        <h3 className="text-3xl font-serif text-white">{isLoading ? "-" : stats?.totalRooms}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                        <Bed size={24} />
                    </div>
                </div>

                <div className="bg-[#141414] p-6 border border-white/5 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Total Bookings</p>
                        <h3 className="text-3xl font-serif text-white">{isLoading ? "-" : stats?.totalBookings}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Calendar size={24} />
                    </div>
                </div>

                <div className="bg-[#141414] p-6 border border-white/5 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Total Revenue</p>
                        <h3 className="text-3xl font-serif text-white">${isLoading ? "-" : stats?.totalRevenue.toLocaleString()}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                        <DollarSign size={24} />
                    </div>
                </div>

                <div className="bg-[#141414] p-6 border border-white/5 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Gallery</p>
                        <h3 className="text-3xl font-serif text-white">{isLoading ? "-" : stats?.galleryImages}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <ImageIcon size={24} />
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#141414] border border-white/5 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5">
                    <h4 className="text-lg font-serif text-white">Recent Reservations</h4>
                </div>
                <div className="divide-y divide-white/5">
                    {isLoading ? (
                        <div className="p-6 text-center text-gray-500">Loading recent activity...</div>
                    ) : stats?.recentBookings?.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">No recent bookings found.</div>
                    ) : (
                        stats?.recentBookings.map((booking: any) => (
                            <div key={booking._id} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                <div>
                                    <p className="text-white font-medium">{booking.user_id?.name || 'Guest'}</p>
                                    <p className="text-gray-500 text-sm">
                                        {booking.room_id?.name || 'Room'} - {new Date(booking.check_in_date).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 text-xs uppercase tracking-wider rounded-full ${booking.booking_status === 'confirmed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                    {booking.booking_status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function BookingsManagement() {
    const { data: bookings, isLoading, refetch } = useQuery({
        queryKey: ["admin-bookings"],
        queryFn: async () => {
            const token = localStorage.getItem("adminToken");
            const { data } = await apiClient.get("/bookings", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data;
        }
    });

    const handleStatusChange = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem("adminToken");
            await apiClient.patch(`/bookings/${id}/status`, { booking_status: status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Booking ${status} successfully.`);
            refetch();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update booking status");
            console.error("Failed to update booking status", error);
        }
    };

    return (
        <div>
            <Toaster position="top-right" toastOptions={{ style: { background: '#111', color: '#fff', border: '1px solid #333' } }} />

            <h2 className="text-3xl font-serif text-white mb-2">Reservation Management</h2>
            <p className="text-gray-400 font-light mb-10">View and manage guest bookings.</p>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                </div>
            ) : (
                <div className="bg-[#141414] border border-white/5 rounded-lg overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-[#0a0a0a] border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Guest Details</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Room & Dates</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Total Amount</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Status</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {bookings?.map((booking: any) => (
                                <tr key={booking._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-white font-serif">{booking.user_id?.name || booking.guest_name || 'Unknown Guest'}</div>
                                        <div className="text-gray-500 text-sm font-sans">{booking.user_id?.email || booking.guest_email || 'N/A'}</div>
                                        <div className="text-[10px] uppercase tracking-widest text-accent mt-1">Booking #{booking._id.substring(0, 8)}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-white font-medium">{booking.room_id?.name || 'Unknown Room'}</div>
                                        <div className="text-gray-400 text-sm">
                                            {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">
                                        ${booking.total_amount?.toLocaleString() || 0}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs uppercase tracking-wider rounded-full ${booking.booking_status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                                            booking.booking_status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                                'bg-red-500/20 text-red-500'
                                            }`}>
                                            {booking.booking_status === 'confirmed' ? 'accepted' : booking.booking_status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {booking.booking_status === 'pending' && (
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleStatusChange(booking._id, 'confirmed')}
                                                    className="text-gray-400 hover:text-green-500 transition-colors"
                                                    title="Accept Booking"
                                                >
                                                    <CheckCircle size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(booking._id, 'cancelled')}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Cancel Booking"
                                                >
                                                    <XCircle size={20} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {(!bookings || bookings.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-light">
                                        No reservations found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

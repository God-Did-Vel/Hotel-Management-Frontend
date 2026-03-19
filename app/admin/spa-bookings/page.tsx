"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function SpaBookingsManagement() {
    const { data: spaBookings, isLoading } = useQuery({
        queryKey: ["admin-spa-bookings"],
        queryFn: async () => {
            const token = localStorage.getItem("adminToken");
            const { data } = await apiClient.get("/api/spa", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data;
        }
    });

    return (
        <div>
            <div className="mb-10">
                <h2 className="text-3xl font-serif text-white mb-2">Spa Appointments</h2>
                <p className="text-gray-400 font-light">Review exclusive N&B Spa bookings and requests.</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                </div>
            ) : (
                <div className="bg-[#141414] border border-white/5 rounded-lg overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-[#0a0a0a] border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Tracking Code</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Guest Details</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Treatment & Details</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Created On</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {spaBookings?.map((booking: any) => (
                                <tr key={booking._id} className="hover:bg-white/5 transition-colors align-top">
                                    <td className="px-6 py-4">
                                        <span className="text-accent font-mono text-sm tracking-wider bg-accent/10 py-1 px-2 rounded">
                                            {booking.tracking_code}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-white font-medium">{booking.name}</div>
                                        <div className="text-gray-500 text-sm">{booking.email}</div>
                                        <div className="text-gray-500 text-sm mt-1">{booking.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-white capitalize">{booking.treatment?.replace(/-/g, ' ')}</div>
                                        <div className="text-gray-400 text-sm mt-1">
                                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                        </div>
                                        {booking.special_requests && (
                                            <div className="mt-2 text-xs text-gray-500 italic border-l-2 border-white/10 pl-2">
                                                "{booking.special_requests}"
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {new Date(booking.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}

                            {(!spaBookings || spaBookings.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-light">
                                        No spa appointments found.
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

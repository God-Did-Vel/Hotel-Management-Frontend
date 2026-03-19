"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Loader2, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function PaymentsManagement() {
    const { data: payments, isLoading, refetch } = useQuery({
        queryKey: ["admin-payments"],
        queryFn: async () => {
            const token = localStorage.getItem("adminToken");
            const { data } = await apiClient.get("/api/payments", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data;
        }
    });

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const token = localStorage.getItem("adminToken");
            await apiClient.put(`/api/payments/${id}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Payment marked as ${newStatus}`);
            refetch();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update payment status");
        }
    };

    return (
        <div>
            <Toaster position="top-right" toastOptions={{ style: { background: '#111', color: '#fff', border: '1px solid #333' } }} />

            <div className="mb-10">
                <h2 className="text-3xl font-serif text-white mb-2">Payment Management</h2>
                <p className="text-gray-400 font-light">Review uploaded receipts and confirm guest payments.</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                </div>
            ) : (
                <div className="bg-[#141414] border border-white/5 rounded-lg overflow-x-auto">
                    <table className="w-full text-left min-w-[900px]">
                        <thead className="bg-[#0a0a0a] border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Guest & Booking</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Amount</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Method</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Receipt</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Status</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {payments?.map((payment: any) => (
                                <tr key={payment._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-white font-medium">
                                            {payment.booking_id?.user_id?.name || "Unknown Guest"}
                                        </div>
                                        <div className="text-gray-500 text-sm font-mono mt-1 w-32 truncate">
                                            Ref: {payment.booking_id?._id?.substring(0, 8) || "N/A"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-white">
                                        ${payment.amount?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="capitalize text-gray-400">{payment.payment_method?.replace('_', ' ')}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {payment.receipt_url ? (
                                            <a
                                                href={payment.receipt_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-accent hover:text-white transition-colors text-sm"
                                            >
                                                View Receipt <ExternalLink size={14} className="ml-1" />
                                            </a>
                                        ) : (
                                            <span className="text-gray-600 text-sm italic">No receipt</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs uppercase tracking-wider rounded-full 
                                            ${payment.status === 'paid' ? 'bg-green-500/20 text-green-500' :
                                                payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                                    payment.status === 'flagged' ? 'bg-red-500/20 text-red-500' :
                                                        'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {payment.status === 'pending' && (
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleStatusChange(payment._id, 'paid')}
                                                    className="text-gray-400 hover:text-green-500 transition-colors"
                                                    title="Mark as Paid"
                                                >
                                                    <CheckCircle size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(payment._id, 'flagged')}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Flag Issue"
                                                >
                                                    <AlertTriangle size={20} />
                                                </button>
                                            </div>
                                        )}
                                        {payment.status === 'flagged' && (
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleStatusChange(payment._id, 'pending')}
                                                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                                                    title="Reset to Pending"
                                                >
                                                    <Loader2 size={20} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {(!payments || payments.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-light">
                                        No payments found.
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

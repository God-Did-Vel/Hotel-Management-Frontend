"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Loader2, Plus, Trash2, Check, X } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function AdminPaymentMethods() {
    const [isAdding, setIsAdding] = useState(false);
    const [newProvider, setNewProvider] = useState("");
    const [newDetails, setNewDetails] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const { data: methods, isLoading, refetch } = useQuery({
        queryKey: ["admin-payment-methods"],
        queryFn: async () => {
            const token = localStorage.getItem("adminToken");
            const { data } = await apiClient.get("/payment-methods/admin", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data;
        }
    });

    const handleAddMethod = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const token = localStorage.getItem("adminToken");
            await apiClient.post("/payment-methods", {
                provider: newProvider,
                details: newDetails,
                isActive: true
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Payment method added");
            setNewProvider("");
            setNewDetails("");
            setIsAdding(false);
            refetch();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add method");
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem("adminToken");
            await apiClient.put(`/payment-methods/${id}`, { isActive: !currentStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Payment method ${!currentStatus ? 'activated' : 'deactivated'}`);
            refetch();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this payment method?")) return;
        try {
            const token = localStorage.getItem("adminToken");
            await apiClient.delete(`/payment-methods/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Payment method deleted");
            refetch();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete method");
        }
    };

    return (
        <div>
            <Toaster position="top-right" toastOptions={{ style: { background: '#111', color: '#fff', border: '1px solid #333' } }} />

            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-serif text-white mb-2">Payment Methods</h2>
                    <p className="text-gray-400 font-light">Configure how clients can pay for their bookings.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center text-xs uppercase tracking-widest font-bold bg-white text-black px-6 py-3 rounded hover:bg-gray-200 transition-colors"
                >
                    {isAdding ? "Cancel" : <><Plus size={16} className="mr-2" /> Add Method</>}
                </button>
            </div>

            {isAdding && (
                <div className="bg-[#141414] border border-white/5 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-serif text-white mb-4">Add New Payment Method</h3>
                    <form onSubmit={handleAddMethod} className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Provider (e.g., Bank Transfer, Bitcoin)</label>
                            <input
                                type="text"
                                value={newProvider}
                                onChange={(e) => setNewProvider(e.target.value)}
                                required
                                className="w-full bg-[#0a0a0a] border border-white/10 text-white p-3 focus:outline-none focus:border-accent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Payment Details / Instructions</label>
                            <textarea
                                value={newDetails}
                                onChange={(e) => setNewDetails(e.target.value)}
                                required
                                rows={4}
                                className="w-full bg-[#0a0a0a] border border-white/10 text-white p-3 focus:outline-none focus:border-accent transition-colors"
                                placeholder="Account Name: N&B Hotel&#10;Account Number: 1234567890&#10;Bank: Chase Bank"
                            />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex justify-center items-center bg-accent text-black font-semibold px-8 py-3 uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : 'Save Method'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {methods?.map((method: any) => (
                        <div key={method._id} className="bg-[#141414] border border-white/5 rounded-lg p-6 relative group">
                            <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                                <h3 className="text-xl font-serif text-white">{method.provider}</h3>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleToggleActive(method._id, method.isActive)}
                                        className={`px-3 py-1 rounded text-xs uppercase tracking-wider font-bold transition-colors ${method.isActive ? 'bg-green-500/10 text-green-500 hover:bg-red-500/10 hover:text-red-500' : 'bg-gray-500/10 text-gray-500 hover:bg-green-500/10 hover:text-green-500'}`}
                                        title={method.isActive ? "Click to Deactivate" : "Click to Activate"}
                                    >
                                        {method.isActive ? "Active" : "Inactive"}
                                    </button>
                                </div>
                            </div>

                            <div className="mb-6 whitespace-pre-wrap text-gray-400 text-sm font-light leading-relaxed">
                                {method.details}
                            </div>

                            <button
                                onClick={() => handleDelete(method._id)}
                                className="absolute bottom-6 right-6 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete Method"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}

                    {(!methods || methods.length === 0) && (
                        <div className="col-span-full py-12 text-center text-gray-500 font-light bg-[#141414] border border-white/5 rounded-lg">
                            No payment methods configured yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

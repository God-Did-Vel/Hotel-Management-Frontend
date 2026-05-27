"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Loader2, Plus, Edit2, Trash2, Check, X, CreditCard } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

interface PaymentMethod {
    _id: string;
    provider: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    details: string;
    isActive: boolean;
}

export default function AdminPaymentMethods() {
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Add Form State
    const [newProvider, setNewProvider] = useState("");
    const [newBankName, setNewBankName] = useState("");
    const [newAccountNumber, setNewAccountNumber] = useState("");
    const [newAccountName, setNewAccountName] = useState("");
    const [newDetails, setNewDetails] = useState("");

    // Edit Form State
    const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
    const [editProvider, setEditProvider] = useState("");
    const [editBankName, setEditBankName] = useState("");
    const [editAccountNumber, setEditAccountNumber] = useState("");
    const [editAccountName, setEditAccountName] = useState("");
    const [editDetails, setEditDetails] = useState("");

    const { data: methods, isLoading, refetch } = useQuery<PaymentMethod[]>({
        queryKey: ["admin-payment-methods"],
        queryFn: async () => {
            const token = localStorage.getItem("adminToken");
            const { data } = await apiClient.get("/api/paymentmethods?all=true", {
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
            
            // Build auto-details if details are empty but bank fields are filled
            let details = newDetails;
            if (!details && newBankName && newAccountNumber) {
                details = `Bank Name: ${newBankName}\nAccount Number: ${newAccountNumber}\nAccount Name: ${newAccountName}`;
            }

            await apiClient.post("/api/paymentmethods", {
                provider: newProvider,
                bankName: newBankName,
                accountNumber: newAccountNumber,
                accountName: newAccountName,
                details: details,
                isActive: true
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            toast.success("Payment method added successfully!");
            
            // Reset state
            setNewProvider("");
            setNewBankName("");
            setNewAccountNumber("");
            setNewAccountName("");
            setNewDetails("");
            setIsAdding(false);
            refetch();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add method");
        } finally {
            setIsSaving(false);
        }
    };

    const handleStartEdit = (method: PaymentMethod) => {
        setEditingMethod(method);
        setEditProvider(method.provider);
        setEditBankName(method.bankName || "");
        setEditAccountNumber(method.accountNumber || "");
        setEditAccountName(method.accountName || "");
        setEditDetails(method.details || "");
    };

    const handleUpdateMethod = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMethod) return;

        setIsSaving(true);
        try {
            const token = localStorage.getItem("adminToken");
            
            let details = editDetails;
            if (!details && editBankName && editAccountNumber) {
                details = `Bank Name: ${editBankName}\nAccount Number: ${editAccountNumber}\nAccount Name: ${editAccountName}`;
            }

            await apiClient.put(`/api/paymentmethods/${editingMethod._id}`, {
                provider: editProvider,
                bankName: editBankName,
                accountNumber: editAccountNumber,
                accountName: editAccountName,
                details: details,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            toast.success("Payment method updated successfully!");
            setEditingMethod(null);
            refetch();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update method");
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem("adminToken");
            await apiClient.put(`/api/paymentmethods/${id}`, { isActive: !currentStatus }, {
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
            await apiClient.delete(`/api/paymentmethods/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Payment method deleted successfully");
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
                    <p className="text-gray-400 font-light">Configure how clients can pay for their bookings manually via Bank Transfer.</p>
                </div>
                {!editingMethod && (
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="flex items-center text-xs uppercase tracking-widest font-bold bg-white text-black px-6 py-3 hover:bg-gray-200 transition-colors"
                    >
                        {isAdding ? "Cancel" : <><Plus size={16} className="mr-2" /> Add Method</>}
                    </button>
                )}
            </div>

            {/* Add Payment Method Form */}
            {isAdding && !editingMethod && (
                <div className="bg-[#141414] border border-white/5 rounded-lg p-8 mb-8">
                    <h3 className="text-lg font-serif text-white mb-6 border-b border-white/5 pb-2">Add New Payment Account</h3>
                    <form onSubmit={handleAddMethod} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Payment Provider (e.g. Bank Transfer)</label>
                                <input
                                    type="text"
                                    value={newProvider}
                                    onChange={(e) => setNewProvider(e.target.value)}
                                    required
                                    placeholder="e.g. Bank Transfer"
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white p-3 focus:outline-none focus:border-accent rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Bank Name</label>
                                <input
                                    type="text"
                                    value={newBankName}
                                    onChange={(e) => setNewBankName(e.target.value)}
                                    required
                                    placeholder="e.g. Zenith Bank"
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white p-3 focus:outline-none focus:border-accent rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Account Number</label>
                                <input
                                    type="text"
                                    value={newAccountNumber}
                                    onChange={(e) => setNewAccountNumber(e.target.value)}
                                    required
                                    placeholder="e.g. 1012345678"
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white p-3 focus:outline-none focus:border-accent rounded-lg font-mono tracking-wider"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Account Name</label>
                                <input
                                    type="text"
                                    value={newAccountName}
                                    onChange={(e) => setNewAccountName(e.target.value)}
                                    required
                                    placeholder="e.g. N&B Italian Hotels Ltd"
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white p-3 focus:outline-none focus:border-accent rounded-lg"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Additional Instructions / Details (Optional)</label>
                            <textarea
                                value={newDetails}
                                onChange={(e) => setNewDetails(e.target.value)}
                                rows={3}
                                className="w-full bg-[#0a0a0a] border border-white/10 text-white p-3 focus:outline-none focus:border-accent rounded-lg resize-none"
                                placeholder="Any additional text instructions for client..."
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex justify-center items-center bg-accent text-black font-semibold px-8 py-3 uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : 'Save Account'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Edit Payment Method Form */}
            {editingMethod && (
                <div className="bg-[#141414] border border-accent/30 rounded-lg p-8 mb-8">
                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                        <h3 className="text-lg font-serif text-white">Edit Payment Account</h3>
                        <button onClick={() => setEditingMethod(null)} className="text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleUpdateMethod} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Payment Provider</label>
                                <input
                                    type="text"
                                    value={editProvider}
                                    onChange={(e) => setEditProvider(e.target.value)}
                                    required
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white p-3 focus:outline-none focus:border-accent rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Bank Name</label>
                                <input
                                    type="text"
                                    value={editBankName}
                                    onChange={(e) => setEditBankName(e.target.value)}
                                    required
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white p-3 focus:outline-none focus:border-accent rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Account Number</label>
                                <input
                                    type="text"
                                    value={editAccountNumber}
                                    onChange={(e) => setEditAccountNumber(e.target.value)}
                                    required
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white p-3 focus:outline-none focus:border-accent rounded-lg font-mono tracking-wider"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Account Name</label>
                                <input
                                    type="text"
                                    value={editAccountName}
                                    onChange={(e) => setEditAccountName(e.target.value)}
                                    required
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white p-3 focus:outline-none focus:border-accent rounded-lg"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Additional Instructions / Details (Optional)</label>
                            <textarea
                                value={editDetails}
                                onChange={(e) => setEditDetails(e.target.value)}
                                rows={3}
                                className="w-full bg-[#0a0a0a] border border-white/10 text-white p-3 focus:outline-none focus:border-accent rounded-lg resize-none"
                            />
                        </div>

                        <div className="flex justify-end space-x-4 pt-2">
                            <button
                                type="button"
                                onClick={() => setEditingMethod(null)}
                                className="px-6 py-3 bg-gray-800 text-white font-semibold hover:bg-gray-700 transition-colors uppercase tracking-wider text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex justify-center items-center bg-accent text-black font-semibold px-8 py-3 uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : 'Save Changes'}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {methods?.map((method) => (
                        <div key={method._id} className="bg-[#141414] border border-white/5 rounded-lg p-6 relative group flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                                    <div className="flex items-center space-x-2">
                                        <CreditCard size={18} className="text-accent" />
                                        <h3 className="text-xl font-serif text-white">{method.provider}</h3>
                                    </div>
                                    <button
                                        onClick={() => handleToggleActive(method._id, method.isActive)}
                                        className={`px-3 py-1 rounded text-[10px] uppercase tracking-wider font-bold transition-colors ${method.isActive ? 'bg-green-500/10 text-green-500 hover:bg-red-500/10 hover:text-red-500' : 'bg-gray-500/10 text-gray-500 hover:bg-green-500/10 hover:text-green-500'}`}
                                        title={method.isActive ? "Click to Deactivate" : "Click to Activate"}
                                    >
                                        {method.isActive ? "Active" : "Inactive"}
                                    </button>
                                </div>

                                <div className="space-y-2 mb-6">
                                    {method.bankName && (
                                        <div className="text-xs flex justify-between">
                                            <span className="text-gray-500">Bank Name</span>
                                            <span className="text-white font-medium">{method.bankName}</span>
                                        </div>
                                    )}
                                    {method.accountNumber && (
                                        <div className="text-xs flex justify-between">
                                            <span className="text-gray-500">Account Number</span>
                                            <span className="text-white font-mono tracking-wider font-semibold">{method.accountNumber}</span>
                                        </div>
                                    )}
                                    {method.accountName && (
                                        <div className="text-xs flex justify-between">
                                            <span className="text-gray-500">Account Name</span>
                                            <span className="text-white">{method.accountName}</span>
                                        </div>
                                    )}
                                    {method.details && (
                                        <div className="text-xs text-gray-400 font-light mt-4 p-3 bg-black/35 rounded border border-white/5 whitespace-pre-wrap">
                                            {method.details}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex space-x-2 mt-4 pt-4 border-t border-white/5">
                                <button
                                    onClick={() => handleStartEdit(method)}
                                    className="flex-1 flex justify-center items-center px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 rounded text-xs transition-colors"
                                >
                                    <Edit2 size={12} className="mr-1.5" /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(method._id)}
                                    className="flex-1 flex justify-center items-center px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded text-xs transition-colors"
                                >
                                    <Trash2 size={12} className="mr-1.5" /> Delete
                                </button>
                            </div>
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

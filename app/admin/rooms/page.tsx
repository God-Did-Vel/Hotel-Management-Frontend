"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Loader2, Plus, Edit, Trash2, X } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function RoomsManagement() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        price_per_night: 0,
        max_guests: 1,
        room_size: "",
        bed_type: "",
        images: [] as string[],
    });

    const { data: rooms, isLoading, refetch } = useQuery({
        queryKey: ["admin-rooms"],
        queryFn: async () => {
            const { data } = await apiClient.get("/api/rooms");
            return data;
        }
    });

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this room?")) {
            try {
                const token = localStorage.getItem("adminToken");
                await apiClient.delete(`/api/rooms/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Room deleted successfully");
                refetch();
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Failed to delete room");
            }
        }
    }

    const handleAddRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("adminToken");
            await apiClient.post("/api/rooms", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Room created successfully!");
            setIsAddModalOpen(false);
            setFormData({
                name: "", slug: "", description: "", price_per_night: 0,
                max_guests: 1, room_size: "", bed_type: "", images: []
            });
            refetch();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create room");
        } finally {
            setIsSubmitting(false);
        }
    };

    const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formDataFile = new FormData();
        formDataFile.append("image", file);
        setUploadingImage(true);

        try {
            const token = localStorage.getItem("adminToken");
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            };

            // Assuming axios/apiClient works identically for multipart
            const { data } = await apiClient.post("/api/upload", formDataFile, config);
            
            setFormData({ ...formData, images: [...formData.images, data] });
            toast.success("Image uploaded!");
        } catch (error: any) {
            console.error(error);
            toast.error("Image upload failed");
        } finally {
            setUploadingImage(false);
        }
    };

    return (
        <div>
            <Toaster position="top-right" toastOptions={{ style: { background: '#111', color: '#fff', border: '1px solid #333' } }} />

            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-3xl font-serif text-white mb-2">Room Management</h2>
                    <p className="text-gray-400 font-light">Manage hotel suites and accommodations.</p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-accent text-black px-6 py-3 uppercase tracking-wider text-sm font-medium flex items-center hover:bg-white transition-colors"
                >
                    <Plus size={18} className="mr-2" /> Add Room
                </button>
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
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Room Name</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Price/Night</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Capacity</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Status</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {rooms?.map((room: any) => (
                                <tr key={room._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-white font-serif">{room.name}</div>
                                        <div className="text-gray-500 text-sm">{room.room_size} • {room.bed_type}</div>
                                    </td>
                                    <td className="px-6 py-4 text-white">${room.price_per_night}</td>
                                    <td className="px-6 py-4 text-gray-400">Up to {room.max_guests} Guests</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs uppercase tracking-wider rounded-full ${room.availability_status ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                            {room.availability_status ? 'Available' : 'Unavailable'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => handleDelete(room._id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                title="Delete Room"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {(!rooms || rooms.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-light">
                                        No rooms available. Create your first room.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Room Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-white/10 p-8 rounded-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="text-2xl font-serif text-white mb-6">Add New Room</h3>

                        <form onSubmit={handleAddRoom} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Room Name</label>
                                    <input
                                        type="text" required
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent"
                                        placeholder="e.g. Royal Suite"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Slug (URL)</label>
                                    <input
                                        type="text" required
                                        value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent"
                                        placeholder="e.g. royal-suite"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Description</label>
                                <textarea
                                    required rows={3}
                                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Room Image</label>
                                <input
                                    type="file"
                                    onChange={uploadFileHandler}
                                    className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-black hover:file:bg-white"
                                />
                                {uploadingImage && <Loader2 className="w-4 h-4 text-accent animate-spin mt-2" />}
                                {formData.images.length > 0 && (
                                    <div className="mt-2 text-xs text-green-500">{formData.images.length} Image(s) Attached</div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Price Per Night ($)</label>
                                    <input
                                        type="number" required min="0"
                                        value={formData.price_per_night} onChange={e => setFormData({ ...formData, price_per_night: Number(e.target.value) })}
                                        className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Max Guests</label>
                                    <input
                                        type="number" required min="1"
                                        value={formData.max_guests} onChange={e => setFormData({ ...formData, max_guests: Number(e.target.value) })}
                                        className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Room Size</label>
                                    <input
                                        type="text" required
                                        value={formData.room_size} onChange={e => setFormData({ ...formData, room_size: e.target.value })}
                                        className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent"
                                        placeholder="e.g. 850 sq ft"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Bed Type</label>
                                    <input
                                        type="text" required
                                        value={formData.bed_type} onChange={e => setFormData({ ...formData, bed_type: e.target.value })}
                                        className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent"
                                        placeholder="e.g. King Size"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit" disabled={isSubmitting}
                                className="w-full bg-accent text-black font-semibold py-4 uppercase tracking-wider hover:bg-white transition-colors flex justify-center mt-4 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Save Room"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

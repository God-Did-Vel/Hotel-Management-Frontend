"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function GalleryManagement() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        image_url: "",
        category: "exterior",
        caption: ""
    });

    const { data: images, isLoading, refetch } = useQuery({
        queryKey: ["admin-gallery"],
        queryFn: async () => {
            const { data } = await apiClient.get("/gallery");
            return data;
        }
    });

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this image?")) {
            try {
                const token = localStorage.getItem("adminToken");
                await apiClient.delete(`/gallery/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Image deleted successfully");
                refetch();
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Failed to delete gallery image");
            }
        }
    }

    const handleAddImage = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("adminToken");
            await apiClient.post("/gallery", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Image added to gallery!");
            setIsAddModalOpen(false);
            setFormData({ image_url: "", category: "exterior", caption: "" });
            refetch();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add image");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Toaster position="top-right" toastOptions={{ style: { background: '#111', color: '#fff', border: '1px solid #333' } }} />

            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-3xl font-serif text-white mb-2">Gallery Management</h2>
                    <p className="text-gray-400 font-light">Manage hotel showcase imagery.</p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-accent text-black px-6 py-3 uppercase tracking-wider text-sm font-medium flex items-center hover:bg-white transition-colors"
                >
                    <Plus size={18} className="mr-2" /> Upload Image
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images?.map((img: any) => (
                        <div key={img._id} className="relative group rounded-lg overflow-hidden bg-[#141414] aspect-square border border-white/5">
                            <img
                                src={img.image_url}
                                alt={img.caption || img.category || "Gallery Image"}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                            />

                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                                <p className="text-white text-sm font-medium mb-1 truncate w-full">{img.caption}</p>
                                <p className="text-accent text-xs uppercase tracking-widest mb-4">{img.category}</p>

                                <button
                                    onClick={() => handleDelete(img._id)}
                                    className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                    title="Delete Image"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {(!images || images.length === 0) && (
                        <div className="col-span-full py-20 text-center border border-dashed border-white/20 rounded-lg">
                            <p className="text-gray-500 font-light">Your gallery is empty.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Add Image Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-white/10 p-8 rounded-lg w-full max-w-md relative">
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="text-2xl font-serif text-white mb-6">Add Gallery Image</h3>

                        <form onSubmit={handleAddImage} className="space-y-6">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Image URL</label>
                                <input
                                    type="url" required
                                    value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                    className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Category</label>
                                <select
                                    value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent"
                                >
                                    <option value="exterior">Exterior</option>
                                    <option value="interior">Interior</option>
                                    <option value="room">Room</option>
                                    <option value="dining">Dining</option>
                                    <option value="spa">Spa</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Caption (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.caption} onChange={e => setFormData({ ...formData, caption: e.target.value })}
                                    className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent"
                                    placeholder="Premium Ocean View"
                                />
                            </div>

                            <button
                                type="submit" disabled={isSubmitting}
                                className="w-full bg-accent text-black font-semibold py-4 uppercase tracking-wider hover:bg-white transition-colors flex justify-center mt-4 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Upload"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

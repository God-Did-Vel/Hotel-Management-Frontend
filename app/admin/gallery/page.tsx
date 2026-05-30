"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient, getImageUrl } from "@/lib/api";
import Image from "next/image";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function GalleryManagement() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [formData, setFormData] = useState({
        image_url: "",
        category: "exterior",
        caption: ""
    });

    const { data: images, isLoading, refetch } = useQuery({
        queryKey: ["admin-gallery"],
        queryFn: async () => {
            const { data } = await apiClient.get("/api/gallery");
            return data || [];
        }
    });

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this image?")) {
            try {
                const token = localStorage.getItem("adminToken");
                await apiClient.delete(`/api/gallery/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Image deleted successfully");
                refetch();
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Failed to delete gallery image");
            }
        }
    };

    const handleAddImage = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.image_url) {
            toast.error("Please upload an image first.");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("adminToken");
            
            // Ensure image_url is a string
            const payloadData = {
                image_url: typeof formData.image_url === 'string' ? formData.image_url : formData.image_url,
                alt_text: formData.caption || "Gallery Image",
                category: formData.category
            };

            await apiClient.post("/api/gallery", payloadData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            toast.success("Image added to gallery!");
            setIsAddModalOpen(false);
            setFormData({ image_url: "", category: "exterior", caption: "" });
            refetch();
        } catch (error: any) {
            console.error("Error adding image:", error);
            toast.error(error.response?.data?.message || "Failed to add image to gallery");
        } finally {
            setIsSubmitting(false);
        }
    };

    const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        const formDataFile = new FormData();
        formDataFile.append("image", file);
        setUploadingImage(true);

        try {
            const token = localStorage.getItem("adminToken");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            };

            const response = await apiClient.post("/api/upload", formDataFile, config);
            
            // Handle both response formats
            let imageUrl = "";
            if (typeof response.data === "string") {
                imageUrl = response.data;
            } else if (response.data?.url) {
                imageUrl = response.data.url;
            } else {
                throw new Error("Invalid upload response");
            }

            setFormData(prev => ({ ...prev, image_url: imageUrl }));
            toast.success("Image uploaded successfully!");
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.response?.data?.message || "Image upload failed");
        } finally {
            setUploadingImage(false);
        }
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        setFormData({ image_url: "", category: "exterior", caption: "" });
    };

    return (
        <div>
            <Toaster 
                position="top-right" 
                toastOptions={{ 
                    style: { background: '#111', color: '#fff', border: '1px solid #333' },
                    duration: 4000
                }} 
            />

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
                    {images && images.length > 0 ? (
                        images.map((img: any) => (
                            <div 
                                key={img._id} 
                                className="relative group rounded-lg overflow-hidden bg-[#141414] aspect-square border border-white/5 hover:border-accent/30 transition-colors"
                            >
                                <Image
                                    src={getImageUrl(img.image_url)}
                                    alt={img.caption || img.category || "Gallery Image"}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />

                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                                    <p className="text-white text-sm font-medium mb-1 truncate w-full">
                                        {img.caption || "Image"}
                                    </p>
                                    <p className="text-accent text-xs uppercase tracking-widest mb-4">
                                        {img.category}
                                    </p>

                                    <button
                                        onClick={() => handleDelete(img._id)}
                                        className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                        title="Delete Image"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center border border-dashed border-white/20 rounded-lg">
                            <p className="text-gray-500 font-light">Your gallery is empty. Start by uploading images.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Add Image Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-white/10 p-8 rounded-lg w-full max-w-md relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="text-2xl font-serif text-white mb-6">Add Gallery Image</h3>

                        <form onSubmit={handleAddImage} className="space-y-6">
                            {/* File Upload Section */}
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-3 font-semibold">
                                    Upload Image File
                                </label>
                                <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-accent/40 transition-colors bg-[#141414]/50">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        required
                                        onChange={uploadFileHandler}
                                        disabled={uploadingImage}
                                        className="hidden"
                                    />
                                    <div className="text-center">
                                        {uploadingImage ? (
                                            <div className="flex flex-col items-center">
                                                <Loader2 className="w-6 h-6 text-accent animate-spin mb-2" />
                                                <p className="text-sm text-gray-400">Uploading...</p>
                                            </div>
                                        ) : formData.image_url ? (
                                            <div className="flex flex-col items-center">
                                                <Plus className="w-6 h-6 text-accent mb-2" />
                                                <p className="text-sm text-gray-300">Image uploaded! Click to change</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <Plus className="w-6 h-6 text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-300">Click to upload or drag image</p>
                                                <p className="text-xs text-gray-500 mt-1">Max 5MB</p>
                                            </div>
                                        )}
                                    </div>
                                </label>

                                {/* Image Preview */}
                                {formData.image_url && (
                                    <div className="mt-4 relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-black/50">
                                        <Image
                                            src={getImageUrl(formData.image_url)}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                            sizes="400px"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    </div>
                                )}
                            </div>

                            {/* Category Selection */}
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-3 font-semibold">
                                    Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-[#141414] border border-white/10 text-white p-3 rounded focus:outline-none focus:border-accent transition-colors"
                                >
                                    <option value="exterior">Exterior</option>
                                    <option value="interior">Interior</option>
                                    <option value="room">Room</option>
                                    <option value="dining">Dining</option>
                                    <option value="spa">Spa & Wellness</option>
                                    <option value="lobby">Lobby</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Caption Input */}
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-3 font-semibold">
                                    Caption (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.caption}
                                    onChange={e => setFormData({ ...formData, caption: e.target.value })}
                                    maxLength={100}
                                    className="w-full bg-[#141414] border border-white/10 text-white p-3 rounded focus:outline-none focus:border-accent transition-colors"
                                    placeholder="e.g. Premium Ocean View Suite"
                                />
                                <p className="text-xs text-gray-500 mt-1">{formData.caption.length}/100</p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || uploadingImage || !formData.image_url}
                                className="w-full bg-accent text-black font-semibold py-4 uppercase tracking-wider rounded hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin w-5 h-5" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={20} />
                                        Add to Gallery
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
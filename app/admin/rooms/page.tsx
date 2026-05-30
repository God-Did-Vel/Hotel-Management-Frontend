"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient, getImageUrl } from "@/lib/api";
import Image from "next/image";
import { Loader2, Plus, Edit, Trash2, X } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

interface Room {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price_per_night: number;
    max_guests: number;
    room_size: string;
    bed_type: string;
    location: "Benin" | "Ore";
    room_type: "Room" | "Suite";
    amenities: string[];
    images: string[];
    availability_status: boolean;
    featured: boolean;
}

export default function RoomsManagement() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Form State for Add
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        price_per_night: 0,
        max_guests: 1,
        room_size: "",
        bed_type: "",
        location: "Benin",
        room_type: "Room",
        amenities: "",
        images: [] as string[],
        availability_status: true,
        featured: false,
    });

    // Form State for Edit
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [editFormData, setEditFormData] = useState({
        name: "",
        slug: "",
        description: "",
        price_per_night: 0,
        max_guests: 1,
        room_size: "",
        bed_type: "",
        location: "Benin",
        room_type: "Room",
        amenities: "",
        images: [] as string[],
        availability_status: true,
        featured: false,
    });

    const { data: rooms, isLoading, refetch } = useQuery<Room[]>({
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
    };

    const handleAddRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("adminToken");
            const dataToSubmit = {
                ...formData,
                amenities: formData.amenities.split(",").map(a => a.trim()).filter(Boolean),
            };
            await apiClient.post("/api/rooms", dataToSubmit, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Room created successfully!");
            setIsAddModalOpen(false);
            setFormData({
                name: "", slug: "", description: "", price_per_night: 0,
                max_guests: 1, room_size: "", bed_type: "", location: "Benin",
                room_type: "Room", amenities: "", images: [], availability_status: true, featured: false
            });
            refetch();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create room");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStartEdit = (room: Room) => {
        setEditingRoom(room);
        setEditFormData({
            name: room.name,
            slug: room.slug,
            description: room.description,
            price_per_night: room.price_per_night,
            max_guests: room.max_guests,
            room_size: room.room_size,
            bed_type: room.bed_type,
            location: room.location || "Benin",
            room_type: room.room_type || "Room",
            amenities: Array.isArray(room.amenities) ? room.amenities.join(", ") : "",
            images: room.images || [],
            availability_status: room.availability_status !== undefined ? room.availability_status : true,
            featured: room.featured !== undefined ? room.featured : false,
        });
    };

    const handleUpdateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRoom) return;
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("adminToken");
            const dataToSubmit = {
                ...editFormData,
                amenities: editFormData.amenities.split(",").map(a => a.trim()).filter(Boolean),
            };
            await apiClient.put(`/api/rooms/${editingRoom._id}`, dataToSubmit, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Room updated successfully!");
            setEditingRoom(null);
            refetch();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update room");
        } finally {
            setIsSubmitting(false);
        }
    };

    const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formDataFile = new FormData();
        formDataFile.append("image", file);
        setUploadingImage(true);

        // Reset the file input so the same file can be re-selected if needed
        e.target.value = "";

        try {
            const token = localStorage.getItem("adminToken");

            // Do NOT set Content-Type manually — let Axios/browser set the
            // correct multipart boundary automatically when FormData is passed.
            const { data } = await apiClient.post("/api/upload", formDataFile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            // Backend responds with { url: "https://res.cloudinary.com/..." }
            const imageUrl: string = data?.url || data;

            if (!imageUrl || typeof imageUrl !== "string") {
                throw new Error("Upload succeeded but no URL was returned.");
            }

            if (isEdit) {
                setEditFormData(prev => ({ ...prev, images: [...prev.images, imageUrl] }));
            } else {
                setFormData(prev => ({ ...prev, images: [...prev.images, imageUrl] }));
            }
            toast.success("Image uploaded successfully!");
        } catch (error: any) {
            const serverMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Image upload failed. Please try again.";
            console.error("Upload error:", serverMessage, error);
            toast.error(serverMessage);
        } finally {
            setUploadingImage(false);
        }
    };

    const removeImage = (urlToRemove: string, isEdit: boolean = false) => {
        if (isEdit) {
            setEditFormData(prev => ({
                ...prev,
                images: prev.images.filter(url => url !== urlToRemove)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter(url => url !== urlToRemove)
            }));
        }
        toast.success("Image removed");
    };

    return (
        <div>
            <Toaster position="top-right" toastOptions={{ style: { background: '#111', color: '#fff', border: '1px solid #333' } }} />

            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-3xl font-serif text-white mb-2">Room Management</h2>
                    <p className="text-gray-400 font-light">Manage hotel suites and accommodations dynamically.</p>
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
                    <table className="w-full text-left min-w-[900px]">
                        <thead className="bg-[#0a0a0a] border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Room Name & Type</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Location</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Price/Night</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Status</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {rooms?.map((room: any) => (
                                <tr key={room._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-white font-serif text-base">{room.name}</div>
                                        <div className="text-gray-500 text-sm">{room.room_type || "Room"} • {room.room_size} • {room.bed_type}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 font-light">
                                        {room.location || "Benin"}
                                    </td>
                                    <td className="px-6 py-4 text-white font-serif">₦{room.price_per_night.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5">
                                            <span className={`w-fit px-3 py-0.5 text-[10px] uppercase tracking-wider rounded-full ${room.availability_status ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                                {room.availability_status ? 'Available' : 'Unavailable'}
                                            </span>
                                            {room.featured && (
                                                <span className="w-fit px-3 py-0.5 text-[10px] uppercase tracking-wider rounded-full bg-accent/20 text-accent font-semibold">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-4">
                                            <button
                                                onClick={() => handleStartEdit(room)}
                                                className="text-gray-400 hover:text-accent transition-colors"
                                                title="Edit Room"
                                            >
                                                <Edit size={18} />
                                            </button>
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

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Location</label>
                                    <select
                                        value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent"
                                    >
                                        <option value="Benin">Benin</option>
                                        <option value="Ore">Ore</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Room Type</label>
                                    <select
                                        value={formData.room_type} onChange={e => setFormData({ ...formData, room_type: e.target.value })}
                                        className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent"
                                    >
                                        <option value="Room">Room</option>
                                        <option value="Suite">Suite</option>
                                    </select>
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
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Amenities (Comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.amenities} onChange={e => setFormData({ ...formData, amenities: e.target.value })}
                                    className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent"
                                    placeholder="e.g. Free WiFi, Air Conditioning, Smart TV, Mini Bar, Room Service"
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Room Images</label>
                                <input
                                    type="file"
                                    onChange={(e) => uploadFileHandler(e, false)}
                                    className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-black hover:file:bg-white cursor-pointer"
                                />
                                {uploadingImage && <Loader2 className="w-4 h-4 text-accent animate-spin mt-2" />}
                                {formData.images.length > 0 && (
                                    <div className="mt-2">
                                        <div className="text-xs text-green-500 mb-2">{formData.images.length} Image(s) Attached:</div>
                                        <div className="grid grid-cols-4 gap-3">
                                            {formData.images.map((url, i) => (
                                                <div key={i} className="relative group aspect-video rounded overflow-hidden bg-black/40 border border-white/10">
                                                    <Image
                                                        src={getImageUrl(url)}
                                                        alt="preview"
                                                        fill
                                                        className="object-cover"
                                                        sizes="150px"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(url, false)}
                                                        className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Price Per Night (₦)</label>
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

                            <div className="grid grid-cols-2 gap-6 pt-2">
                                <label className="flex items-center text-white text-sm cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={formData.availability_status}
                                        onChange={e => setFormData({ ...formData, availability_status: e.target.checked })}
                                        className="mr-3 w-4 h-4 rounded border-white/10 bg-[#141414] text-accent focus:ring-accent"
                                    />
                                    Available for booking
                                </label>
                                <label className="flex items-center text-white text-sm cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                                        className="mr-3 w-4 h-4 rounded border-white/10 bg-[#141414] text-accent focus:ring-accent"
                                    />
                                    Feature on Homepage
                                </label>
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

            {/* Edit Room Modal */}
            {editingRoom && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-accent/40 p-8 rounded-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar animate-enter">
                        <button
                            onClick={() => setEditingRoom(null)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="text-2xl font-serif text-white mb-6">Edit Room: {editingRoom.name}</h3>

                        <form onSubmit={handleUpdateRoom} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Room Name</label>
                                    <input
                                        type="text" required
                                        value={editFormData.name} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                                        className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent"
                                        placeholder="e.g. Royal Suite"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Slug (URL)</label>
                                    <input
                                        type="text" required
                                        value={editFormData.slug} onChange={e => setEditFormData({ ...editFormData, slug: e.target.value })}
                                        className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent"
                                        placeholder="e.g. royal-suite"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Location</label>
                                    <select
                                        value={editFormData.location} onChange={e => setEditFormData({ ...editFormData, location: e.target.value as any })}
                                        className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent"
                                    >
                                        <option value="Benin">Benin</option>
                                        <option value="Ore">Ore</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Room Type</label>
                                    <select
                                        value={editFormData.room_type} onChange={e => setEditFormData({ ...editFormData, room_type: e.target.value as any })}
                                        className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent"
                                    >
                                        <option value="Room">Room</option>
                                        <option value="Suite">Suite</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Description</label>
                                <textarea
                                    required rows={3}
                                    value={editFormData.description} onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
                                    className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Amenities (Comma separated)</label>
                                <input
                                    type="text"
                                    value={editFormData.amenities} onChange={e => setEditFormData({ ...editFormData, amenities: e.target.value })}
                                    className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent"
                                    placeholder="e.g. Free WiFi, Air Conditioning, Smart TV"
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Room Images</label>
                                <input
                                    type="file"
                                    onChange={(e) => uploadFileHandler(e, true)}
                                    className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-black hover:file:bg-white cursor-pointer"
                                />
                                {uploadingImage && <Loader2 className="w-4 h-4 text-accent animate-spin mt-2" />}
                                {editFormData.images.length > 0 && (
                                    <div className="mt-2">
                                        <div className="text-xs text-green-500 mb-2">{editFormData.images.length} Image(s) Attached:</div>
                                        <div className="grid grid-cols-4 gap-3">
                                            {editFormData.images.map((url, i) => (
                                                <div key={i} className="relative group aspect-video rounded overflow-hidden bg-black/40 border border-white/10">
                                                    <Image
                                                        src={getImageUrl(url)}
                                                        alt="preview"
                                                        fill
                                                        className="object-cover"
                                                        sizes="150px"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(url, true)}
                                                        className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Price Per Night (₦)</label>
                                    <input
                                        type="number" required min="0"
                                        value={editFormData.price_per_night} onChange={e => setEditFormData({ ...editFormData, price_per_night: Number(e.target.value) })}
                                        className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Max Guests</label>
                                    <input
                                        type="number" required min="1"
                                        value={editFormData.max_guests} onChange={e => setEditFormData({ ...editFormData, max_guests: Number(e.target.value) })}
                                        className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Room Size</label>
                                    <input
                                        type="text" required
                                        value={editFormData.room_size} onChange={e => setEditFormData({ ...editFormData, room_size: e.target.value })}
                                        className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Bed Type</label>
                                    <input
                                        type="text" required
                                        value={editFormData.bed_type} onChange={e => setEditFormData({ ...editFormData, bed_type: e.target.value })}
                                        className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-2">
                                <label className="flex items-center text-white text-sm cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={editFormData.availability_status}
                                        onChange={e => setEditFormData({ ...editFormData, availability_status: e.target.checked })}
                                        className="mr-3 w-4 h-4 rounded border-white/10 bg-[#141414] text-accent focus:ring-accent"
                                    />
                                    Available for booking
                                </label>
                                <label className="flex items-center text-white text-sm cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={editFormData.featured}
                                        onChange={e => setEditFormData({ ...editFormData, featured: e.target.checked })}
                                        className="mr-3 w-4 h-4 rounded border-white/10 bg-[#141414] text-accent focus:ring-accent"
                                    />
                                    Feature on Homepage
                                </label>
                            </div>

                            <div className="flex justify-end space-x-4 pt-4 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setEditingRoom(null)}
                                    className="px-6 py-3 bg-[#222] text-white hover:bg-[#333] transition-colors uppercase tracking-wider text-xs font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit" disabled={isSubmitting}
                                    className="px-8 py-3 bg-accent text-black hover:bg-white transition-colors uppercase tracking-wider text-xs font-semibold flex items-center justify-center min-w-[120px]"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

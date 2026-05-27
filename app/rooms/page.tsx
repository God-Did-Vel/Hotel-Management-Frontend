"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RoomCardSkeleton } from "@/components/ui/Skeleton";
import { Bed, Wifi, Coffee, Wine, Star, MapPin, Compass, Users, Sparkles } from "lucide-react";
import ExtendedLuxuryText from "@/components/sections/ExtendedLuxuryText";
import { apiClient, getImageUrl } from "@/lib/api";

type Room = {
    _id: string;
    name: string;
    slug: string;
    price_per_night: number;
    description: string;
    image: string;
    bed_type: string;
    amenities: string[];
    badge?: string;
    featured?: boolean;
    location?: "Benin" | "Ore";
    room_type?: "Room" | "Suite";
    room_size: string;
    max_guests?: number;
};

function AmenityIcon({ amenity }: { amenity: string }) {
    const iconClass = "mr-2 h-3.5 w-3.5 text-accent/80 shrink-0";
    const lower = amenity.toLowerCase();
    if (lower.includes("wifi"))     return <Wifi     className={iconClass} />;
    if (lower.includes("coffee"))   return <Coffee   className={iconClass} />;
    if (lower.includes("champagne") ||
        lower.includes("bar") ||
        lower.includes("wine"))     return <Wine     className={iconClass} />;
    if (lower.includes("bed") ||
        lower.includes("king"))     return <Bed      className={iconClass} />;
    return <Sparkles className={iconClass} />;
}

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState<string>("All");
    const [selectedType, setSelectedType] = useState<string>("All");

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const { data } = await apiClient.get("/api/rooms");
                // Filter out unavailable rooms for general guest browsing
                setRooms((data || []).filter((r: any) => r.availability_status));
            } catch (error) {
                console.error("Error fetching rooms:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRooms();
    }, []);

    // Filter logic
    const filteredRooms = rooms.filter(room => {
        const roomLoc = room.location || "Benin";
        const roomTp = room.room_type || "Room";
        const matchesLocation = selectedLocation === "All" || roomLoc === selectedLocation;
        const matchesType = selectedType === "All" || roomTp === selectedType;
        return matchesLocation && matchesType;
    });

    if (isLoading) {
        return (
            <div className="pt-36 pb-24 bg-[#050505] min-h-screen">
                {/* Page Header Skeleton */}
                <div className="container mx-auto px-6 lg:px-12 text-center mb-16 animate-pulse">
                    <div className="h-4 w-48 bg-zinc-900 mx-auto mb-4 rounded" />
                    <div className="h-12 w-64 bg-zinc-800 mx-auto mb-6 rounded" />
                    <div className="h-4 w-[28rem] bg-zinc-900 mx-auto mb-2 rounded" />
                </div>

                {/* Skeletons Grid */}
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <RoomCardSkeleton />
                        <RoomCardSkeleton />
                        <RoomCardSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-36 pb-24 bg-[#050505] min-h-screen text-foreground selection:bg-accent selection:text-black">

            {/* ── Page Header ── */}
            <div className="container mx-auto px-6 lg:px-12 text-center mb-16">
                <p className="text-[10px] tracking-[0.4em] uppercase text-accent font-medium mb-3">
                    N&B Italian Hotel &nbsp;·&nbsp; Premium Collections
                </p>
                <h1 className="text-4xl md:text-6xl font-serif text-white mt-2 tracking-wide font-light">
                    Rooms &amp; <span className="italic text-accent">Suites</span>
                </h1>
                <div className="flex items-center justify-center gap-4 my-6">
                    <span className="block w-16 h-px bg-gradient-to-r from-transparent to-accent/40" />
                    <span className="block w-1.5 h-1.5 bg-accent/60 rotate-45" />
                    <span className="block w-16 h-px bg-gradient-to-l from-transparent to-accent/40" />
                </div>
                <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed tracking-wide font-light">
                    Each space is a sanctuary of refined elegance. Curated finishes, bespoke Italian furnishings,
                    and unhurried silence — yours, entirely.
                </p>
            </div>

            {/* ── Minimalist Classic Filter Controls ── */}
            <div className="container mx-auto px-6 lg:px-12 mb-16">
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-white/[0.01] via-white/[0.03] to-white/[0.01] backdrop-blur-md border-y border-white/[0.05] py-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
                    {/* Location Selection */}
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-accent/60 font-semibold flex items-center">
                            <MapPin size={10} className="mr-1.5" /> Destination
                        </span>
                        <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
                            {["All", "Benin", "Ore"].map(loc => (
                                <button
                                    key={loc}
                                    onClick={() => setSelectedLocation(loc)}
                                    className="relative py-1 text-[10px] uppercase tracking-[0.3em] font-medium transition-all duration-300 group"
                                >
                                    <span className={selectedLocation === loc ? "text-accent" : "text-gray-400 hover:text-white"}>
                                        {loc === "All" ? "All Locations" : `${loc} Hotel`}
                                    </span>
                                    <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-accent transition-transform duration-300 origin-left ${selectedLocation === loc ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <span className="hidden md:inline h-8 w-px bg-white/[0.08]" />

                    {/* Accommodation Type Selection */}
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-accent/60 font-semibold flex items-center">
                            <Compass size={10} className="mr-1.5" /> Suite Type
                        </span>
                        <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
                            {["All", "Room", "Suite"].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedType(type)}
                                    className="relative py-1 text-[10px] uppercase tracking-[0.3em] font-medium transition-all duration-300 group"
                                >
                                    <span className={selectedType === type ? "text-accent" : "text-gray-400 hover:text-white"}>
                                        {type === "All" ? "All Collections" : `${type}s`}
                                    </span>
                                    <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-accent transition-transform duration-300 origin-left ${selectedType === type ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Rooms Grid ── */}
            <div className="container mx-auto px-6 lg:px-12">
                {filteredRooms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredRooms.map((room) => {
                            const roomLoc = room.location || "Benin";
                            const roomTp = room.room_type || "Room";

                            return (
                                <div
                                    key={room._id}
                                    className={`
                                        group relative bg-gradient-to-b from-[#0d0c0a] to-[#070605]
                                        border border-white/[0.04] hover:border-accent/30 transition-all duration-700
                                        rounded-sm overflow-hidden flex flex-col justify-between
                                        ${room.featured ? "lg:col-span-2 md:col-span-2 lg:flex-row" : "h-full"}
                                    `}
                                >
                                    {/* Image Wrapper */}
                                    <div className={`relative overflow-hidden w-full ${room.featured ? "lg:w-1/2 h-80 lg:h-full min-h-[350px]" : "h-72"} shrink-0`}>
                                        {/* Thin Luxury Inner Gold Frame */}
                                        <div className="absolute inset-4 border border-accent/15 pointer-events-none z-20 transition-all duration-500 group-hover:inset-3 group-hover:border-accent/35" />
                                        
                                        {/* Badge */}
                                        {(room.badge || room.featured) && (
                                            <span className="absolute top-6 left-6 z-20 text-[9px] tracking-[0.25em] uppercase text-accent bg-black/85 border border-accent/30 px-3 py-1.5 backdrop-blur-md font-medium">
                                                {room.badge || "Featured Suite"}
                                            </span>
                                        )}
                                        
                                        {/* Image */}
                                        <Image
                                            src={getImageUrl(room.image)}
                                            alt={room.name}
                                            fill
                                            className="object-cover brightness-[0.88] contrast-[1.02] group-hover:brightness-100 group-hover:scale-105 transition-all duration-[1500ms] ease-out"
                                            sizes={room.featured ? "(max-width: 1024px) 100vw, 800px" : "(max-width: 768px) 100vw, 400px"}
                                        />
                                        
                                        {/* Location */}
                                        <span className="absolute bottom-6 left-6 z-20 flex items-center text-[9px] tracking-[0.2em] uppercase text-gray-300 bg-black/90 border border-white/5 px-3 py-1.5 backdrop-blur-sm font-light">
                                            <MapPin size={10} className="mr-1.5 text-accent" /> {roomLoc} Suite
                                        </span>

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 z-10" />
                                    </div>

                                    {/* Content Wrapper */}
                                    <div className={`p-8 ${room.featured ? "lg:w-1/2 lg:p-10 flex flex-col justify-between h-full" : "flex flex-col justify-between flex-grow"}`}>
                                        <div>
                                            {/* Category & Price */}
                                            <div className="flex justify-between items-baseline mb-4">
                                                <span className="text-[9px] tracking-[0.25em] uppercase text-accent font-medium">
                                                    {roomTp} Collection
                                                </span>
                                                <div className="text-right">
                                                    <span className="text-accent font-serif text-2xl font-light">
                                                        ₦{room.price_per_night.toLocaleString()}
                                                    </span>
                                                    <span className="block text-[8px] tracking-[0.2em] uppercase text-gray-500 mt-1">
                                                        per night
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-2xl md:text-3xl font-serif text-white mb-4 leading-tight group-hover:text-accent transition-colors duration-500">
                                                <Link href={`/rooms/${room.slug}`}>
                                                    {room.name}
                                                </Link>
                                            </h3>

                                            {/* Description */}
                                            <p className="text-gray-400 text-xs leading-relaxed mb-6 font-light line-clamp-3">
                                                {room.description}
                                            </p>

                                            {/* Room Specs */}
                                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-white/[0.05] pt-5 mb-6">
                                                <div className="flex items-center text-[10px] tracking-[0.15em] uppercase text-gray-300">
                                                    <Bed size={13} className="mr-2 text-accent/60 shrink-0" />
                                                    {room.bed_type}
                                                </div>
                                                <div className="flex items-center text-[10px] tracking-[0.15em] uppercase text-gray-300">
                                                    <Compass size={13} className="mr-2 text-accent/60 shrink-0" />
                                                    {room.room_size}
                                                </div>
                                                <div className="flex items-center text-[10px] tracking-[0.15em] uppercase text-gray-300 col-span-2">
                                                    <Users size={13} className="mr-2 text-accent/60 shrink-0" />
                                                    Up to {room.max_guests || 2} guests allowed
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            {/* Amenities */}
                                            <div className="flex flex-wrap gap-1.5 mb-8">
                                                {room.amenities.slice(0, 3).map((amenity) => (
                                                    <span
                                                        key={amenity}
                                                        className="flex items-center text-[9px] tracking-[0.15em] uppercase text-gray-300 bg-white/[0.02] border border-white/[0.05] px-3 py-1.5 hover:bg-white/[0.04] transition-colors"
                                                    >
                                                        <AmenityIcon amenity={amenity} />
                                                        {amenity}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.05]">
                                                <Link
                                                    href={`/rooms/${room.slug}`}
                                                    className="block text-center text-[9px] tracking-[0.3em] uppercase text-gray-300 border border-white/10 py-4 hover:bg-white/5 hover:text-white transition-all duration-300 rounded-sm"
                                                >
                                                    Details
                                                </Link>
                                                <Link
                                                    href={`/book?roomId=${room._id}`}
                                                    className="block text-center text-[9px] tracking-[0.3em] uppercase text-black bg-gradient-to-r from-accent to-[#b5942b] py-4 hover:from-[#e3be43] hover:to-[#c5a331] transition-all duration-300 font-semibold rounded-sm shadow-lg shadow-accent/5"
                                                >
                                                    Reserve
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-20 text-center border border-white/5 bg-[#0a0a0a] rounded-sm max-w-xl mx-auto mt-10">
                        <p className="text-gray-400 font-light text-sm">No luxury accommodations match your exact filter selection.</p>
                        <button
                            onClick={() => { setSelectedLocation("All"); setSelectedType("All"); }}
                            className="mt-6 text-xs text-accent tracking-[0.2em] uppercase hover:text-white transition-colors border-b border-accent pb-1"
                        >
                            Reset Active Filters
                        </button>
                    </div>
                )}
            </div>

            {/* ── Exquisite Stats Bar ── */}
            <div className="container mx-auto px-6 lg:px-12 mt-28">
                <div className="border-t border-white/[0.05] pt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { value: "Benin & Ore", label: "Elite Locations" },
                        { value: "24/7", label: "VIP Concierge" },
                        { value: "5-Star", label: "Italian Quality" },
                        { value: "₦40k", label: "From / Suite Night" },
                    ].map(({ value, label }) => (
                        <div key={label} className="text-center group">
                            <span className="block font-serif text-3xl md:text-4xl text-accent font-light mb-2 transition-transform duration-500 group-hover:scale-105">{value}</span>
                            <span className="text-[9px] tracking-[0.3em] uppercase text-gray-500">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <ExtendedLuxuryText />
        </div>
    );
}
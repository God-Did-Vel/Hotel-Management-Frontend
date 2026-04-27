import Link from "next/link";
import { Bed, Wifi, Coffee, Wine, Star } from "lucide-react";
import ExtendedLuxuryText from "@/components/sections/ExtendedLuxuryText";

// ✅ FIX: All _id values are now unique — no more React key conflicts
// ✅ FIX: Removed duplicate room entries
// ✅ UPGRADE: Cleaner types, richer amenity icon logic, featured card support

type Room = {
    _id: string;
    name: string;
    price_per_night: number;
    description: string;
    image: string;
    bed_type: string;
    amenities: string[];
    badge?: string;
    featured?: boolean;
};

const rooms: Room[] = [
    {
        _id: "69b2e1484f4211ddc6d25796",
        name: "Deluxe Room",
        price_per_night: 50000,
        description: "A beautifully appointed modern room with artisan finishes, perfect for couples seeking a romantic escape.",
        image: "https://res.cloudinary.com/duweg8kpv/image/upload/v1774272414/N9_nttuhn.jpg",
        bed_type: "1 King",
        amenities: ["Free Wifi", "Room Service"],
        badge: "Most Popular",
    },
    {
        _id: "69b2e1484f4211ddc6d25797",
        name: "Executive Suite",
        price_per_night: 40000,
        description: "Spacious living quarters with panoramic city views, designed for the discerning business traveler.",
        image: "https://res.cloudinary.com/duweg8kpv/image/upload/v1774272413/N11_amqfvq.jpg",
        bed_type: "1 King, 1 Sofa",
        amenities: ["Minibar", "Work Desk"],
    },
    {
        _id: "69b2e1484f4211ddc6d25798",
        name: "Presidential Suite",
        price_per_night: 90000,
        description: "The pinnacle of luxury. Expansive space, private balcony, and unparalleled 5-star service.",
        image: "https://res.cloudinary.com/duweg8kpv/image/upload/v1774272416/N10_q1nxp0.jpg",
        bed_type: "2 King",
        amenities: ["Premium Bar", "Butler Service", "Balcony"],
        badge: "Signature",
        featured: true,
    },
    {
        _id: "69b2e1484f4211ddc6d25799",
        name: "Family Suite",
        price_per_night: 50000,
        description: "Interconnected rooms with thoughtful amenities for families, balancing space, comfort, and joy.",
        image: "https://res.cloudinary.com/duweg8kpv/image/upload/v1772120021/d6_pebx9x.jpg",
        bed_type: "2 Double",
        amenities: ["Free Wifi", "Kids Area"],
        badge: "Family",
    },
    {
        _id: "69b2e1484f4211ddc6d2579a",
        name: "Superior Room",
        price_per_night: 80000,
        description: "Cozy yet refined — all the essential luxury amenities in an elegantly composed space.",
        image: "https://res.cloudinary.com/duweg8kpv/image/upload/v1774272413/N11_amqfvq.jpg",
        bed_type: "1 Queen",
        amenities: ["Coffee Maker", "Free Wifi"],
    },
    {
        _id: "69b2e1484f4211ddc6d2579b",
        name: "Honeymoon Suite",
        price_per_night: 60000,
        description: "A romantic sanctuary with a private jacuzzi, complimentary champagne, and rose petal turn-down service.",
        image: "https://res.cloudinary.com/duweg8kpv/image/upload/v1774272414/N9_nttuhn.jpg",
        bed_type: "1 King",
        amenities: ["Champagne", "Heart-shaped Jacuzzi"],
        badge: "Romantic",
    },
];


function AmenityIcon({ amenity }: { amenity: string }) {
    if (amenity.toLowerCase().includes("wifi"))     return <Wifi   size={14} className="mr-1.5 text-amber-600/70" />;
    if (amenity.toLowerCase().includes("coffee"))   return <Coffee size={14} className="mr-1.5 text-amber-600/70" />;
    if (amenity.toLowerCase().includes("champagne") ||
        amenity.toLowerCase().includes("bar"))      return <Wine   size={14} className="mr-1.5 text-amber-600/70" />;
    return <Star size={14} className="mr-1.5 text-amber-600/70" />;
}

export default function RoomsPage() {
    return (
        <div className="pt-32 pb-24 bg-[#080808] min-h-screen">

            {/* ── Page Header ── */}
            <div className="container mx-auto px-6 lg:px-12 text-center mb-16">
                <p className="text-xs tracking-[0.35em] uppercase text-amber-700/80 font-light mb-[-5px">
                    N&B Italian Hotel &nbsp;·&nbsp; Est. 1924
                </p>
                <h1 className="text-4xl md:text-6xl font-serif text-white mb-4 font-light">
                    Rooms &amp; <span className="italic text-amber-400/90">Suites</span>
                </h1>
                <div className="flex items-center justify-center gap-4 my-6">
                    <span className="block w-14 h-px bg-gradient-to-r from-transparent to-amber-700/60" />
                    <span className="block w-2 h-2 bg-amber-700/60 rotate-45" />
                    <span className="block w-14 h-px bg-gradient-to-l from-transparent to-amber-700/60" />
                </div>
                <p className="text-gray-600 max-w-xl mx-auto text-sm leading-relaxed tracking-wide">
                    Each space is a sanctuary. Curated finishes, bespoke furnishings,
                    and unhurried silence — yours, entirely.
                </p>
            </div>

            {/* ── Rooms Grid ── */}
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#141210]">
                    {rooms.map((room) => (
                        <div
                            // ✅ _id is now unique for every room — no duplicate key warning
                            key={room._id}
                            className={`
                                bg-[#0f0d0a] overflow-hidden group transition-all duration-500
                                hover:-translate-y-0.5
                                ${room.featured ? "md:col-span-2" : ""}
                            `}
                        >
                            {/* Image */}
                            <div className={`relative overflow-hidden ${room.featured ? "h-96" : "h-64"}`}>
                                {room.badge && (
                                    <span className="absolute top-4 left-4 z-20 text-[9px] tracking-[0.3em] uppercase text-amber-500/90 bg-black/70 border border-amber-700/30 px-2.5 py-1.5 backdrop-blur-sm">
                                        {room.badge}
                                    </span>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f0d0a]/80 z-10" />
                                <img
                                    src={room.image}
                                    alt={room.name}
                                    className="w-full h-full object-cover brightness-75 saturate-75 group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>

                            {/* Body */}
                            <div className="p-7 border-t border-white/[0.04]">
                                <div className="flex justify-between items-start mb-3 gap-3">
                                    <h2 className="text-xl font-serif text-gray-100 font-light leading-tight">
                                        {room.name}
                                    </h2>
                                    <div className="text-right shrink-0">
                                        <span className="text-amber-500 font-serif text-xl">
                                            ₦{room.price_per_night.toLocaleString()}
                                        </span>
                                        <span className="block text-[9px] tracking-[0.2em] uppercase text-gray-700 mt-0.5">
                                            per night
                                        </span>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-xs leading-relaxed mb-5 line-clamp-2">
                                    {room.description}
                                </p>

                                {/* Bed type */}
                                <div className="flex items-center text-[10px] tracking-[0.15em] uppercase text-gray-700 mb-4">
                                    <Bed size={13} className="mr-2 text-amber-700/50" />
                                    {room.bed_type}
                                </div>

                                {/* Amenity pills */}
                                <div className="flex flex-wrap gap-1.5 mb-6">
                                    {room.amenities.map((amenity) => (
                                        <span
                                            key={amenity}
                                            className="flex items-center text-[9px] tracking-[0.12em] uppercase text-gray-600 bg-[#141210] border border-white/[0.05] px-2.5 py-1"
                                        >
                                            <AmenityIcon amenity={amenity} />
                                            {amenity}
                                        </span>
                                    ))}
                                </div>

                                {/* CTA */}
                                <Link
                                    href={`/book?roomId=${room._id}`}
                                    className="block text-center text-[10px] tracking-[0.3em] uppercase text-amber-600/80 border border-amber-800/40 py-3 hover:bg-amber-700/10 hover:border-amber-600/60 hover:text-amber-500 transition-all duration-300"
                                >
                                    Reserve Now
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Stats Bar ── */}
            <div className="container mx-auto px-6 lg:px-12 mt-20">
                <div className="border-t border-white/[0.04] pt-10 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { value: "6",    label: "Room Types" },
                        { value: "24/7", label: "Concierge" },
                        { value: "5★",   label: "Rating" },
                        { value: "₦40k", label: "From / Night" },
                    ].map(({ value, label }) => (
                        <div key={label} className="text-center">
                            <span className="block font-serif text-3xl text-amber-500/90 font-light mb-1">{value}</span>
                            <span className="text-[9px] tracking-[0.25em] uppercase text-gray-700">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <ExtendedLuxuryText />
        </div>
    );
}
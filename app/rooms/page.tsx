import Link from "next/link";
import { Bed, Wifi, Coffee, Wine } from "lucide-react";
import ExtendedLuxuryText from "@/components/sections/ExtendedLuxuryText";

const rooms = [
    {
        _id: "69b2e1484f4211ddc6d25796",
        name: "Deluxe Room",
        price_per_night: 250,
        description: "A beautiful modern room with luxurious amenities, perfect for couples seeking a romantic getaway.",
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop",
        bed_type: "1 King",
        amenities: ["Free Wifi"]
    },
    {
        _id: "69b2e1484f4211ddc6d25797",
        name: "Executive Suite",
        price_per_night: 450,
        description: "Spacious living area and panoramic city views for the discerning traveler looking for extra comfort.",
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1974&auto=format&fit=crop",
        bed_type: "1 King, 1 Sofa",
        amenities: ["Minibar"]
    },
    {
        _id: "69b2e1484f4211ddc6d25798",
        name: "Presidential Suite",
        price_per_night: 950,
        description: "The pinnacle of luxury. Expansive space, private balcony, and unparalleled 5-star service.",
        image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop",
        bed_type: "2 King",
        amenities: ["Premium Bar"]
    },
    {
        _id: "69b2e1484f4211ddc6d25799",
        name: "Family Suite",
        price_per_night: 350,
        description: "Perfect for family vacations, featuring interconnected rooms and special amenities for children.",
        image: "https://res.cloudinary.com/duweg8kpv/image/upload/v1772120021/d6_pebx9x.jpg",
        bed_type: "2 Double",
        amenities: ["Free Wifi"]
    },
    {
        _id: "69b2e1484f4211ddc6d2579a",
        name: "Superior Room",
        price_per_night: 180,
        description: "A cozy and elegant room designed for short stays with all essential luxury amenities.",
        image: "https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=2070&auto=format&fit=crop",
        bed_type: "1 Queen",
        amenities: ["Coffee Maker"]
    },
    {
        _id: "69b2e1484f4211ddc6d2579b",
        name: "Honeymoon Suite",
        price_per_night: 600,
        description: "Romantic escape featuring a heart-shaped jacuzzi, complimentary champagne, and rose petal decorations.",
        image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070&auto=format&fit=crop",
        bed_type: "1 King",
        amenities: ["Champagne", "Heart-shaped jacuzzi"]
    }
];

export default function RoomsPage() {
    return (
        <div className="pt-32 pb-20 bg-black min-h-screen">
            <div className="container mx-auto px-6 lg:px-12 text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">Our Rooms & Suites</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">Experience unparalleled comfort and luxury in our masterfully designed spaces.</p>
            </div>

            <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rooms.map((room) => (
                    <div key={room._id} className="bg-[#141414] rounded-xl overflow-hidden group border border-white/5 hover:border-accent transition-colors duration-500">
                        <div className="h-[400px] w-full bg-gray-800 overflow-hidden relative">
                            {/* Placeholder for actual room image */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0a] to-transparent z-10 opacity-60"></div>
                            <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl text-white font-serif">{room.name}</h2>
                                <p className="text-accent font-serif text-xl">${room.price_per_night}<span className="text-sm text-gray-500">/night</span></p>
                            </div>
                            <p className="text-gray-400 mb-6 line-clamp-2">{room.description}</p>
                            <div className="flex space-x-4 mb-8 text-gray-400">
                                <div className="flex items-center"><Bed size={16} className="mr-2" /> {room.bed_type}</div>
                                {room.amenities.length > 0 && (
                                    <div className="flex items-center">
                                        {room.amenities[0].includes("Wifi") && <Wifi size={16} className="mr-2" />}
                                        {room.amenities[0].includes("Coffee") && <Coffee size={16} className="mr-2" />}
                                        {room.amenities[0].includes("Champagne") && <Wine size={16} className="mr-2" />}
                                        {room.amenities[0]}
                                    </div>
                                )}
                            </div>
                            {/* FIXED: Link to book page with roomId parameter */}
                            <Link 
                                href={`/book?roomId=${room._id}`} 
                                className="block text-center border border-accent text-accent hover:bg-accent hover:text-black py-3 uppercase tracking-wider text-sm transition-colors w-full"
                            >
                                Book Now
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <ExtendedLuxuryText />
        </div>
    );
}
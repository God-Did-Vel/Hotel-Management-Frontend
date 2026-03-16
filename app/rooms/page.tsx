import Link from "next/link";
import { Bed, Wifi, Coffee, Wine } from "lucide-react";
import ExtendedLuxuryText from "@/components/sections/ExtendedLuxuryText";

export default function RoomsPage() {
    return (
        <div className="pt-32 pb-20 bg-black min-h-screen">
            <div className="container mx-auto px-6 lg:px-12 text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">Our Rooms & Suites</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">Experience unparalleled comfort and luxury in our masterfully designed spaces.</p>
            </div>

            <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Room 1 */}
                <div className="bg-[#141414] rounded-xl overflow-hidden group border border-white/5 hover:border-accent transition-colors duration-500">
                    <div className="h-[400px] w-full bg-gray-800 overflow-hidden relative">
                        {/* Placeholder for actual room image */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0a] to-transparent z-10 opacity-60"></div>
                        <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop" alt="Deluxe Room" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl text-white font-serif">Deluxe Room</h2>
                            <p className="text-accent font-serif text-xl">₦20<span className="text-sm text-gray-500">/night</span></p>
                        </div>
                        <p className="text-gray-400 mb-6 line-clamp-2">A beautiful modern room with luxurious amenities, perfect for couples seeking a romantic getaway.</p>
                        <div className="flex space-x-4 mb-8 text-gray-400">
                            <div className="flex items-center"><Bed size={16} className="mr-2" /> 1 King</div>
                            <div className="flex items-center"><Wifi size={16} className="mr-2" /> Free Wifi</div>
                        </div>
                        <Link href="/book" className="block text-center border border-accent text-accent hover:bg-accent hover:text-black py-3 uppercase tracking-wider text-sm transition-colors w-full">
                            Book Now
                        </Link>
                    </div>
                </div>

                {/* Room 2 */}
                <div className="bg-[#141414] rounded-xl overflow-hidden group border border-white/5 hover:border-accent transition-colors duration-500">
                    <div className="h-[400px] w-full bg-gray-800 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0a] to-transparent z-10 opacity-60"></div>
                        <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1974&auto=format&fit=crop" alt="Executive Suite" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl text-white font-serif">Executive Suite</h2>
                            <p className="text-accent font-serif text-xl">₦50<span className="text-sm text-gray-500">/night</span></p>
                        </div>
                        <p className="text-gray-400 mb-6 line-clamp-2">Spacious living area and panoramic city views for the discerning traveler looking for extra comfort.</p>
                        <div className="flex space-x-4 mb-8 text-gray-400">
                            <div className="flex items-center"><Bed size={16} className="mr-2" /> 1 King, 1 Sofa</div>
                            <div className="flex items-center"><Coffee size={16} className="mr-2" /> Minibar</div>
                        </div>
                        <Link href="/book" className="block text-center border border-accent text-accent hover:bg-accent hover:text-black py-3 uppercase tracking-wider text-sm transition-colors w-full">
                            Book Now
                        </Link>
                    </div>
                </div>

                {/* Room 3 */}
                <div className="bg-[#141414] rounded-xl overflow-hidden group border border-white/5 hover:border-accent transition-colors duration-500">
                    <div className="h-[400px] w-full bg-gray-800 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0a] to-transparent z-10 opacity-60"></div>
                        <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop" alt="Presidential Suite" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl text-white font-serif">Presidential Suite</h2>
                            <p className="text-accent font-serif text-xl">₦90<span className="text-sm text-gray-500">/night</span></p>
                        </div>
                        <p className="text-gray-400 mb-6 line-clamp-2">The pinnacle of luxury. Expansive space, private balcony, and unparalleled 5-star service.</p>
                        <div className="flex space-x-4 mb-8 text-gray-400">
                            <div className="flex items-center"><Bed size={16} className="mr-2" /> 2 King</div>
                            <div className="flex items-center"><Wine size={16} className="mr-2" /> Premium Bar</div>
                        </div>
                        <Link href="/book" className="block text-center border border-accent text-accent hover:bg-accent hover:text-black py-3 uppercase tracking-wider text-sm transition-colors w-full">
                            Book Now
                        </Link>
                    </div>
                </div>
                {/* Room 4 */}
                <div className="bg-[#141414] rounded-xl overflow-hidden group border border-white/5 hover:border-accent transition-colors duration-500">
                    <div className="h-[400px] w-full bg-gray-800 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0a] to-transparent z-10 opacity-60"></div>
                        <img src="https://images.unsplash.com/photo-1574643039659-1e3a6c17242d?q=80&w=2070&auto=format&fit=crop" alt="Family Suite" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl text-white font-serif">Family Suite</h2>
                            <p className="text-accent font-serif text-xl">₦50<span className="text-sm text-gray-500">/night</span></p>
                        </div>
                        <p className="text-gray-400 mb-6 line-clamp-2">Perfect for family vacations, featuring interconnected rooms and special amenities for children.</p>
                        <div className="flex space-x-4 mb-8 text-gray-400">
                            <div className="flex items-center"><Bed size={16} className="mr-2" /> 2 Double</div>
                            <div className="flex items-center"><Wifi size={16} className="mr-2" /> Free Wifi</div>
                        </div>
                        <Link href="/book" className="block text-center border border-accent text-accent hover:bg-accent hover:text-black py-3 uppercase tracking-wider text-sm transition-colors w-full">
                            Book Now
                        </Link>
                    </div>
                </div>

                {/* Room 5 */}
                <div className="bg-[#141414] rounded-xl overflow-hidden group border border-white/5 hover:border-accent transition-colors duration-500">
                    <div className="h-[400px] w-full bg-gray-800 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0a] to-transparent z-10 opacity-60"></div>
                        <img src="https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=2070&auto=format&fit=crop" alt="Superior Room" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl text-white font-serif">Superior Room</h2>
                            <p className="text-accent font-serif text-xl">₦80<span className="text-sm text-gray-500">/night</span></p>
                        </div>
                        <p className="text-gray-400 mb-6 line-clamp-2">A cozy and elegant room designed for short stays with all essential luxury amenities.</p>
                        <div className="flex space-x-4 mb-8 text-gray-400">
                            <div className="flex items-center"><Bed size={16} className="mr-2" /> 1 Queen</div>
                            <div className="flex items-center"><Coffee size={16} className="mr-2" /> Coffee Maker</div>
                        </div>
                        <Link href="/book" className="block text-center border border-accent text-accent hover:bg-accent hover:text-black py-3 uppercase tracking-wider text-sm transition-colors w-full">
                            Book Now
                        </Link>
                    </div>
                </div>

                {/* Room 6 */}
                <div className="bg-[#141414] rounded-xl overflow-hidden group border border-white/5 hover:border-accent transition-colors duration-500">
                    <div className="h-[400px] w-full bg-gray-800 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0a] to-transparent z-10 opacity-60"></div>
                        <img src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070&auto=format&fit=crop" alt="Honeymoon Suite" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl text-white font-serif">Honeymoon Suite</h2>
                            <p className="text-accent font-serif text-xl">₦100<span className="text-sm text-gray-500">/night</span></p>
                        </div>
                        <p className="text-gray-400 mb-6 line-clamp-2">Romantic escape featuring a heart-shaped jacuzzi, complimentary champagne, and rose petal decorations.</p>
                        <div className="flex space-x-4 mb-8 text-gray-400">
                            <div className="flex items-center"><Bed size={16} className="mr-2" /> 1 King</div>
                            <div className="flex items-center"><Wine size={16} className="mr-2" /> Champagne</div>
                        </div>
                        <Link href="/book" className="block text-center border border-accent text-accent hover:bg-accent hover:text-black py-3 uppercase tracking-wider text-sm transition-colors w-full">
                            Book Now
                        </Link>
                    </div>
                </div>
            </div>

            <ExtendedLuxuryText />
        </div>
    );
}

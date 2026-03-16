import ExtendedLuxuryText from "@/components/sections/ExtendedLuxuryText";

export default function GalleryPage() {
    // Array of luxury hotel images for the gallery
    const images = [
        "https://res.cloudinary.com/duweg8kpv/image/upload/v1772119962/d4_s0joyk.jpg",
        "https://res.cloudinary.com/duweg8kpv/image/upload/v1772120021/d6_pebx9x.jpg",
        "https://res.cloudinary.com/duweg8kpv/image/upload/v1772988986/360_F_692511356_6jleOpKpvIMrGRtXo7TZk70aD8ePbZvQ_q7ahz9.jpg",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
        "https://res.cloudinary.com/duweg8kpv/image/upload/v1772119961/d3_xsxaea.jpg"
    ];

    return (
        <div className="pt-32 pb-20 bg-black min-h-screen">
            <div className="container mx-auto px-6 lg:px-12 text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">Our Gallery</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">Take a glimpse into the beautiful aesthetics and atmosphere of N&B Italian Hotel.</p>
            </div>

            <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((src, i) => (
                    <div key={i} className="group relative overflow-hidden aspect-[4/3] rounded-lg cursor-pointer">
                        <img
                            src={src}
                            alt={`Gallery ${i}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white font-serif tracking-widest uppercase border-b border-white pb-1">View Image</span>
                        </div>
                    </div>
                ))}
            </div>

            <ExtendedLuxuryText />
        </div>
    );
}

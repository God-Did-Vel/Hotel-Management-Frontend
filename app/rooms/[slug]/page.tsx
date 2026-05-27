import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bed, Users, Expand, ShieldCheck, MapPin } from "lucide-react";
import ExtendedLuxuryText from "@/components/sections/ExtendedLuxuryText";
import { getImageUrl } from "@/lib/api";

interface Props {
  params: { slug: string };
}

async function getRoom(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${baseUrl}/api/rooms/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("Error fetching room in server component:", err);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const room = await getRoom(params.slug);
  if (!room) {
    return {
      title: "Suite Not Found | N&B Italian Hotel",
      description: "The requested luxury suite could not be found.",
    };
  }

  const locationName = room.location || "Benin";
  const roomTypeName = room.room_type || "Suite";
  
  // Specific localized target titles to rank well on Google
  const pageTitle = roomTypeName === "Suite" 
    ? `Luxury Suite in ${locationName} | ${room.name} | N&B Italian Hotel`
    : `Premium Room in ${locationName} | ${room.name} | N&B Italian Hotel`;

  return {
    title: pageTitle,
    description: `Book ${room.name}, a premium ${room.room_size} ${roomTypeName.toLowerCase()} in ${locationName} at N&B Italian Hotel starting at ₦${room.price_per_night.toLocaleString()}/night. Amenities: ${room.amenities?.join(', ')}.`,
    openGraph: {
      title: pageTitle,
      description: room.description,
      images: room.images && room.images.length > 0 ? [{ url: room.images[0] }] : [],
    }
  };
}

export default async function RoomDetailsPage({ params }: Props) {
  const room = await getRoom(params.slug);
  if (!room) {
    notFound();
  }

  const roomImages = room.images && room.images.length > 0 ? room.images : ['/images/room-placeholder.jpg'];
  const primaryImage = roomImages[0];
  const locationName = room.location || "Benin";
  const roomTypeName = room.room_type || "Suite";

  // Google Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    "name": room.name,
    "description": room.description,
    "bed": room.bed_type,
    "occupancy": {
      "@type": "QuantitativeValue",
      "maxValue": room.max_guests
    },
    "amenityFeature": room.amenities?.map((amenity: string) => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity,
      "value": true
    })),
    "offers": {
      "@type": "Offer",
      "priceCurrency": "NGN",
      "price": room.price_per_night,
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": room.price_per_night,
        "priceCurrency": "NGN",
        "unitText": "NIGHT"
      }
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": locationName,
      "addressCountry": "NG",
      "name": `N&B Italian Hotel ${locationName}`
    }
  };

  return (
    <div className="bg-[#080808] text-white min-h-screen pt-32 pb-24 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        {/* Breadcrumbs / Back Link */}
        <div className="mb-8">
          <Link href="/rooms" className="text-accent text-xs uppercase tracking-widest hover:text-white transition-colors">
            ← Back to Rooms &amp; Suites
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Image Gallery & Description */}
          <div className="lg:col-span-8 space-y-8">
            {/* Primary Big Image */}
            <div className="relative aspect-video w-full overflow-hidden border border-white/5 bg-zinc-950">
              <Image
                src={getImageUrl(primaryImage)}
                alt={room.name}
                fill
                className="object-cover brightness-90 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 800px"
                priority
              />
              <span className="absolute top-4 left-4 z-10 text-[9px] tracking-[0.3em] uppercase text-accent bg-black/85 border border-accent/30 px-3 py-1.5 backdrop-blur-sm">
                {roomTypeName} in {locationName}
              </span>
            </div>

            {/* Thumbnail Previews (if multiple) */}
            {roomImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {roomImages.map((imgUrl: string, idx: number) => (
                  <div key={idx} className="relative aspect-video overflow-hidden border border-white/5 bg-zinc-950 rounded">
                    <Image
                      src={getImageUrl(imgUrl)}
                      alt={`${room.name} view ${idx + 1}`}
                      fill
                      className="object-cover opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                      sizes="150px"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Room Details Text */}
            <div className="pt-6">
              <h1 className="text-3xl md:text-5xl font-serif text-white mb-6 font-light">{room.name}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-wider text-gray-400 mb-8 border-b border-white/5 pb-6">
                <span className="flex items-center gap-2">
                  <Bed size={16} className="text-accent" /> {room.bed_type}
                </span>
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-accent" /> Up to {room.max_guests} Guests
                </span>
                <span className="flex items-center gap-2">
                  <Expand size={16} className="text-accent" /> {room.room_size}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-accent" /> Located in {locationName}
                </span>
              </div>

              <div className="prose prose-invert max-w-none text-gray-400 font-light leading-relaxed space-y-4">
                <p className="whitespace-pre-line">{room.description}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Reservation Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#111] border border-white/10 p-8 rounded-lg shadow-xl sticky top-36">
              <span className="text-[10px] tracking-[0.25em] uppercase text-gray-500 block mb-1">Pricing From</span>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-serif text-accent font-semibold">₦{room.price_per_night.toLocaleString()}</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest">/ Night</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-3 bg-black/40 border border-white/5 rounded text-xs text-gray-300">
                  <ShieldCheck size={16} className="text-green-500 flex-shrink-0" />
                  <span>Instant Booking &amp; Secure Manual Transfer Confirmation</span>
                </div>
              </div>

              <Link
                href={`/book?roomId=${room._id}`}
                className="block text-center bg-accent text-black font-semibold py-4 uppercase tracking-widest text-xs hover:bg-white transition-colors"
              >
                Reserve This Suite
              </Link>
            </div>
          </div>
        </div>

        {/* Amenities Section */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="mt-20 border-t border-white/5 pt-16">
            <h3 className="text-2xl font-serif text-white mb-8">Suite Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {room.amenities.map((amenity: string) => (
                <div key={amenity} className="flex items-center gap-3 text-sm text-gray-300 font-light">
                  <span className="w-5 h-5 rounded-full bg-[#1e1e1e] border border-accent/20 flex items-center justify-center text-accent text-xs flex-shrink-0 font-bold">
                    ✓
                  </span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ExtendedLuxuryText />
    </div>
  );
}

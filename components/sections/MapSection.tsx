/// <reference types="@types/google.maps" />
"use client";

import { useEffect, useRef } from "react";

export default function MapSection() {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initMap = async () => {
            const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;

            if (mapRef.current) {
                new Map(mapRef.current, {
                    center: { lat: 6.5148, lng: 3.2985 }, 
                    zoom: 12,
                    mapId: "DEMO_MAP_ID", 
                    disableDefaultUI: true,
                });
            }
        };

        
        if (typeof google !== "undefined" && google.maps) {
            initMap();
        }
    }, []);

    return (
        <section className="h-[500px] w-full bg-[#121212] flex items-center justify-center relative border-t border-white/5">
            <div className="absolute top-10 text-center z-10 bg-black/80 backdrop-blur-md px-8 py-3 rounded-full border border-white/10">
                <span className="text-white uppercase tracking-widest text-xs font-bold">Find Us in Benin & Lagos</span>
            </div>

            <div ref={mapRef} className="w-full h-full filter grayscale invert hue-rotate-180" />

            {/* Fallback if GMaps doesn't load immediately */}
            {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY && (
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126848.97237890981!2d3.298547211116246!3d6.514755106604113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a36715d!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: " invert(90%) hue-rotate(180deg)", position: 'absolute', zIndex: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            )}
        </section>
    );
}

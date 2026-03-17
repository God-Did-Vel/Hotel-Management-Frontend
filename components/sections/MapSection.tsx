/// <reference types="@types/google.maps" />
"use client";

export default function MapSection() {
    return (
        <section className="h-[500px] w-full bg-[#121212] flex items-center justify-center relative border-t border-white/5">
            <div className="absolute top-10 text-center z-10 bg-black/80 backdrop-blur-md px-8 py-3 rounded-full border border-white/10">
                <span className="text-white uppercase tracking-widest text-xs font-bold">Find Us in Benin & Lagos</span>
            </div>

        
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126848.97237890981!2d3.298547211116246!3d6.514755106604113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a36715d!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1710667200000"
                width="100%"
                height="100%"
                style={{ 
                    border: 0,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}
                allowFullScreen={true}
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </section>
    );
}
"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppWidget() {
    return (
        <a
            href="https://wa.me/09031269748" // Replace with actual number
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-[9990] bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
            aria-label="Chat with us on WhatsApp"
        >
            <MessageCircle size={32} />
        </a>
    );
}

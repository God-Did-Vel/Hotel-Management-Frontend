"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppWidget from "@/components/ui/WhatsAppWidget";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith("/admin");

    return (
        <>
            {!isAdminRoute && <Navbar />}
            <main className="min-h-screen">
                {children}
            </main>
            {!isAdminRoute && <Footer />}
            {!isAdminRoute && <WhatsAppWidget />}
        </>
    );
}

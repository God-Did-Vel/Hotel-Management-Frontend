"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Bed, Calendar, Image as ImageIcon, LogOut, Loader2, CreditCard, Users, Sparkles, Mail, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // In a real app, validate token with backend here
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/login");
        } else {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminId");
        router.push("/admin/login");
    };

    if (!isMounted) return null;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
                <p className="text-gray-400 font-light tracking-widest uppercase text-sm">Loading Admin</p>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-background flex text-foreground">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 hidden xl:flex flex-col overflow-y-auto custom-scrollbar">
                <div className="p-8 border-b border-white/5 sticky top-0 bg-[#0a0a0a] z-10">
                    <h1 className="text-2xl font-serif text-accent tracking-widest uppercase">N&B Italian Hotel<span className="text-white">.</span></h1>
                    <p className="text-xs uppercase tracking-widest text-gray-500 mt-2">Admin Dashboard</p>
                </div>

                <nav className="flex-1 py-8 px-4 space-y-1">
                    <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                        <LayoutDashboard size={20} />
                        <span className="text-sm font-light tracking-wider">Overview</span>
                    </Link>
                    <Link href="/admin/rooms" className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                        <Bed size={20} />
                        <span className="text-sm font-light tracking-wider">Rooms</span>
                    </Link>
                    <Link href="/admin/bookings" className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                        <Calendar size={20} />
                        <span className="text-sm font-light tracking-wider">Bookings</span>
                    </Link>
                    <Link href="/admin/payments" className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                        <CreditCard size={20} />
                        <span className="text-sm font-light tracking-wider">Payments</span>
                    </Link>
                    <Link href="/admin/payment-methods" className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                        <Settings size={20} />
                        <span className="text-sm font-light tracking-wider">Payment Settings</span>
                    </Link>
                    <Link href="/admin/users" className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                        <Users size={20} />
                        <span className="text-sm font-light tracking-wider">Guests</span>
                    </Link>
                    <Link href="/admin/spa-bookings" className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                        <Sparkles size={20} />
                        <span className="text-sm font-light tracking-wider">Spa Bookings</span>
                    </Link>
                    <Link href="/admin/newsletter" className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                        <Mail size={20} />
                        <span className="text-sm font-light tracking-wider">Newsletter</span>
                    </Link>
                    <Link href="/admin/gallery" className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                        <ImageIcon size={20} />
                        <span className="text-sm font-light tracking-wider">Gallery</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/5 sticky bottom-0 bg-[#0a0a0a]">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full space-x-3 px-4 py-3 rounded-md hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="text-sm font-light tracking-wider">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto min-h-screen">
                {/* Mobile Header */}
                <div className="xl:hidden bg-[#0a0a0a] p-4 border-b border-white/5 flex justify-between items-center sticky top-0 z-20">
                    <h1 className="text-xl font-serif text-accent tracking-widest uppercase truncate max-w-[70%]">N&B Italian Hotel</h1>
                    <button onClick={handleLogout} className="text-gray-400"><LogOut size={20} /></button>
                </div>

                <div className="p-4 md:p-8 lg:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Bed, Calendar, Image as ImageIcon, LogOut, Loader2, CreditCard, Users, Sparkles, Mail, Settings, Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                
                if (!token) {
                    // No token, redirect to login
                    router.push("/admin/login");
                    return;
                }

                // Token exists, we're authenticated
                setIsLoading(false);
            } catch (error) {
                console.error("Auth check error:", error);
                router.push("/admin/login");
            }
        };

        checkAuth();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminId");
        localStorage.removeItem("adminEmail");
        router.push("/admin/login");
    };

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
                <p className="text-gray-400 font-light tracking-widest uppercase text-sm">Loading Admin</p>
            </div>
        );
    }

    const navItems = [
        { href: "/admin", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/rooms", label: "Rooms", icon: Bed },
        { href: "/admin/bookings", label: "Bookings", icon: Calendar },
        { href: "/admin/payments", label: "Payments", icon: CreditCard },
        { href: "/admin/payment-methods", label: "Payment Settings", icon: Settings },
        { href: "/admin/users", label: "Guests", icon: Users },
        { href: "/admin/spa-bookings", label: "Spa Bookings", icon: Sparkles },
        { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
        { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <div className="min-h-screen bg-black flex text-white">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:w-64 bg-[#0a0a0a] border-r border-white/5 flex-col">
                <div className="p-6 border-b border-white/5">
                    <h1 className="text-2xl font-serif text-accent tracking-widest uppercase">
                        N&B<span className="text-white">.</span>
                    </h1>
                    <p className="text-xs uppercase tracking-widest text-gray-500 mt-2">Admin</p>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                                isActive(item.href)
                                    ? "bg-accent/20 text-accent"
                                    : "text-gray-300 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <item.icon size={20} />
                            <span className="text-sm font-light tracking-wider">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full space-x-3 px-4 py-3 rounded-md hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="text-sm font-light tracking-wider">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            {sidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h1 className="text-2xl font-serif text-accent tracking-widest uppercase">N&B</h1>
                            <button onClick={() => setSidebarOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                                        isActive(item.href)
                                            ? "bg-accent/20 text-accent"
                                            : "text-gray-300 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    <item.icon size={20} />
                                    <span className="text-sm font-light tracking-wider">{item.label}</span>
                                </Link>
                            ))}
                        </nav>

                        <div className="p-4 border-t border-white/5">
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full space-x-3 px-4 py-3 rounded-md hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <LogOut size={20} />
                                <span className="text-sm font-light tracking-wider">Sign Out</span>
                            </button>
                        </div>
                    </aside>
                </>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto min-h-screen">
                {/* Mobile Header */}
                <div className="lg:hidden bg-[#0a0a0a] p-4 border-b border-white/5 flex justify-between items-center sticky top-0 z-40">
                    <h1 className="text-xl font-serif text-accent tracking-widest uppercase">N&B Admin</h1>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <div className="p-4 md:p-8 lg:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
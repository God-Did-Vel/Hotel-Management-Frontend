"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // If on login page, skip auth check and let it render
            if (pathname === "/admin/login") {
                setIsLoading(false);
                return;
            }

            // For other pages, check if authenticated
            const token = localStorage.getItem("adminToken");

            if (!token) {
                // Not authenticated, redirect to login
                router.push("/admin/login");
                return;
            }

            // Authenticated, allow access
            setIsLoading(false);
        };

        checkAuth();
    }, [pathname, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-accent animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
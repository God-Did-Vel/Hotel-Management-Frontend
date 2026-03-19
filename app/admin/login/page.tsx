"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            console.log("Attempting login with:", { email, password });

            // Call backend: POST /api/admin/login
            const { data } = await apiClient.post("/api/admin/login", {
                email,
                password,
            });

            console.log("Login response:", data);

            if (data.token) {
                // Store token and admin info in localStorage
                localStorage.setItem("adminToken", data.token);
                localStorage.setItem("adminId", data._id);
                localStorage.setItem("adminName", data.name);
                localStorage.setItem("adminEmail", data.email);

                toast.success("✅ Login successful! Redirecting...");

                // Redirect to admin dashboard after short delay
                setTimeout(() => {
                    window.location.href = "/admin";
                }, 1000);
            } else {
                toast.error("❌ No token received from server");
                setIsLoading(false);
            }
        } catch (error: any) {
            console.error("Login error:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Login failed. Please check your credentials.";
            toast.error(`❌ ${errorMessage}`);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
            <Toaster
                position="top-center"
                toastOptions={{
                    style: { background: "#111", color: "#fff", border: "1px solid #333" },
                    duration: 4000,
                }}
            />

            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />

            <div className="w-full max-w-md relative z-10">
                {/* Login Card */}
                <div className="bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-lg p-10 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-serif text-accent tracking-widest uppercase mb-2">
                            N&B Italian Hotel
                            <span className="text-white">.</span>
                        </h1>
                        <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
                            Admin Portal
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-3 font-semibold">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                                disabled={isLoading}
                                autoFocus
                                className="w-full bg-[#141414] border border-white/10 text-white p-4 rounded focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all placeholder-gray-600 disabled:opacity-50"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-3 font-semibold">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                disabled={isLoading}
                                className="w-full bg-[#141414] border border-white/10 text-white p-4 rounded focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all placeholder-gray-600 disabled:opacity-50"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-accent text-black font-semibold py-4 uppercase tracking-widest text-sm rounded hover:bg-white hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-xs text-gray-500">
                            🔐 Secure admin login. Your credentials are encrypted.
                        </p>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                    <p className="text-xs text-blue-300">
                        Demo: Use your admin email and password
                    </p>
                </div>
            </div>
        </div>
    );
}
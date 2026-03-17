"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { toast, Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function ClientLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data } = await apiClient.post("/api/users/login", {
                email,
                password
            });

            // Store user token
            localStorage.setItem("userToken", data.token);

            toast.success("Login successful! Redirecting...");

            setTimeout(() => {
                router.push("/dashboard");
            }, 1000);

        } catch (error: any) {
            toast.error(error.response?.data?.message || "Invalid email or password");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black pt-32 pb-20 flex items-center justify-center p-6 bg-[url('https://res.cloudinary.com/duweg8kpv/image/upload/v1772119962/d6_q8zjkp.jpg')] bg-cover bg-center relative">
            <Toaster position="top-center" toastOptions={{ style: { background: '#111', color: '#fff', border: '1px solid #333' } }} />

            <div className="absolute inset-0 bg-black/80" />

            <div className="w-full max-w-md bg-[#0a0a0a]/90 backdrop-blur-md p-10 border border-white/10 rounded-lg relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-serif text-accent tracking-widest uppercase mb-4">N&B Italian Hotel<span className="text-white">.</span></h1>
                    <p className="text-sm tracking-wide text-gray-400 font-light leading-relaxed px-4">
                        Guest Portal. Sign in to view your bookings and manage your profile.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            required
                            className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent transition-colors placeholder-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent transition-colors placeholder-gray-600"
                        />
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="accent-accent" />
                            <span>Remember Me</span>
                        </label>
                        <a href="#" className="hover:text-accent transition-colors">Forgot Password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center bg-accent text-black font-semibold py-3 uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign In'}
                    </button>

                    <div className="text-center text-sm text-gray-500 pt-4 border-t border-white/10">
                        Don't have an account? <Link href="/register" className="text-accent hover:text-white transition-colors block mt-2">Register Here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
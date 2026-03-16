"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function ClientRegister() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!name.trim() || !email.trim() || !password.trim()) {
                toast.error("Please fill in all fields");
                setIsLoading(false);
                return;
            }

            const { data } = await axios.post("http://localhost:5000/api/users", {
                name: name.trim(),
                email: email.trim(),
                password: password.trim()
            });

            // Store user token
            localStorage.setItem("userToken", data.token);

            toast.success("Account created successfully! Redirecting...");

            setTimeout(() => {
                router.push("/dashboard");
            }, 1000);

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to create account.";
            toast.error(errorMessage);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black pt-32 pb-20 flex items-center justify-center p-6 bg-[url('https://res.cloudinary.com/duweg8kpv/image/upload/v1772119962/d6_q8zjkp.jpg')] bg-cover bg-center relative">
            <Toaster position="top-center" toastOptions={{ style: { background: '#111', color: '#fff', border: '1px solid #333' } }} />

            <div className="absolute inset-0 bg-black/80" />

            <div className="w-full max-w-md bg-[#0a0a0a]/90 backdrop-blur-md p-10 border border-white/10 rounded-lg relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-serif text-accent tracking-widest uppercase mb-2">N&B Italian Hotel<span className="text-white">.</span></h1>
                    <p className="text-sm uppercase tracking-widest text-gray-500">Create Account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            required
                            className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent transition-colors placeholder-gray-600"
                        />
                    </div>

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
                            placeholder="Minimum 6 characters"
                            required
                            className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent transition-colors placeholder-gray-600"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center bg-accent text-black font-semibold py-3 uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account'}
                    </button>

                    <div className="text-center text-sm text-gray-500 pt-4 border-t border-white/10">
                        Already have an account? <Link href="/login" className="text-accent hover:text-white transition-colors block mt-2">Sign In</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
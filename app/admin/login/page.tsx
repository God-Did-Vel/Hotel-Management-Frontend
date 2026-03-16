"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await apiClient.post("/admin/login", { email, password });

            // We know it's admin if it hits admin API, but just verifying response structure
            if (response.data.token) {
                localStorage.setItem("adminToken", response.data.token);
                localStorage.setItem("adminId", response.data._id);
                router.push("/admin");
            } else {
                setError("Invalid admin credentials");
            }

            // handled above
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-[#0a0a0a] p-10 border border-white/10 rounded-lg">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-serif text-accent tracking-widest uppercase mb-2">N&B Italian Hotel<span className="text-white">.</span></h1>
                    <p className="text-sm uppercase tracking-widest text-gray-500">Admin Portal</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 mb-6 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-[#141414] border border-white/10 text-white p-3 focus:outline-none focus:border-accent transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent text-black font-semibold py-3 uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50"
                    >
                        {loading ? "Authenticating..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}

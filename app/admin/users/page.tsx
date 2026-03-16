"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function UsersManagement() {
    const { data: users, isLoading } = useQuery({
        queryKey: ["admin-users"],
        queryFn: async () => {
            const token = localStorage.getItem("adminToken");
            const { data } = await apiClient.get("/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data;
        }
    });

    return (
        <div>
            <div className="mb-10">
                <h2 className="text-3xl font-serif text-white mb-2">Registered Guests</h2>
                <p className="text-gray-400 font-light">View and manage registered hotel users.</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                </div>
            ) : (
                <div className="bg-[#141414] border border-white/5 rounded-lg overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-[#0a0a0a] border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Guest Name</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Email Address</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Member Since</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users?.map((user: any) => (
                                <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-white font-serif">{user.name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs uppercase tracking-wider rounded-full 
                                            ${user.role === 'admin' ? 'bg-accent/20 text-accent' : 'bg-white/10 text-gray-300'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                            {(!users || users.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-light">
                                        No registered guests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

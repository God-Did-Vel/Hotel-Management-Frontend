"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Loader2, Mail } from "lucide-react";

export default function NewsletterManagement() {
    const { data: subscribers, isLoading } = useQuery({
        queryKey: ["admin-newsletter"],
        queryFn: async () => {
            const token = localStorage.getItem("adminToken");
            const { data } = await apiClient.get("/api/newsletter", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data;
        }
    });

    return (
        <div>
            <div className="mb-10">
                <h2 className="text-3xl font-serif text-white mb-2">Newsletter Subscribers</h2>
                <p className="text-gray-400 font-light">View and export the list of email subscribers.</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                </div>
            ) : (
                <div className="bg-[#141414] border border-white/5 rounded-lg overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-[#0a0a0a] border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Email Address</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Subscribed Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {subscribers?.map((sub: any) => (
                                <tr key={sub._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 flex items-center text-white">
                                        <Mail size={16} className="text-gray-500 mr-3" />
                                        {sub.email}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {new Date(sub.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}

                            {(!subscribers || subscribers.length === 0) && (
                                <tr>
                                    <td colSpan={2} className="px-6 py-12 text-center text-gray-500 font-light">
                                        No subscribers found.
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

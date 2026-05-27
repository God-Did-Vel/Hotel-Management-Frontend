import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nb-hotel-management.vercel.app";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Static routes
  const routes = [
    "",
    "/rooms",
    "/gallery",
    "/book",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Fetch dynamic rooms from the API to index details pages
  try {
    const res = await fetch(`${apiUrl}/api/rooms`, {
      next: { revalidate: 3600 }, // cache for an hour
    });
    
    if (res.ok) {
      const rooms = await res.json();
      const roomRoutes = (rooms || [])
        .filter((room: any) => room.availability_status && room.slug)
        .map((room: any) => ({
          url: `${siteUrl}/rooms/${room.slug}`,
          lastModified: new Date(room.updatedAt || new Date()),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }));

      return [...routes, ...roomRoutes];
    }
  } catch (error) {
    console.error("Failed to fetch rooms for dynamic sitemap generation:", error);
  }

  return routes;
}

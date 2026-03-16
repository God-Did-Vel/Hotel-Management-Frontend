import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import FeaturedRooms from "@/components/sections/FeaturedRooms";
import Amenities from "@/components/sections/Amenities";
import GalleryPreview from "@/components/sections/GalleryPreview";
import VideoSection from "@/components/sections/VideoSection";
import Testimonials from "@/components/sections/Testimonials";
import FoodBeverage from "@/components/sections/FoodBeverage";
import EventsPreview from "@/components/sections/EventsPreview";
import MapSection from "@/components/sections/MapSection";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <FeaturedRooms />
      <Amenities />
      <FoodBeverage />
      <EventsPreview />
      <VideoSection />
      <Testimonials />
      <GalleryPreview />
      <MapSection />
    </>
  );
}

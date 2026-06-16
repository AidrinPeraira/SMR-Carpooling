import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { HowSection } from "@/components/HowSection";
import { Navbar } from "@/components/Navbar";
import { RideSection } from "@/components/RideSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HeroSection />
      <RideSection />
      <HowSection />
      <Footer className="flex-grow" />
    </div>
  );
}

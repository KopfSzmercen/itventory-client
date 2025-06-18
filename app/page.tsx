import Footer from "@/app/_lib/Footer";
import Header from "@/app/_lib/Header";
import Hero from "@/app/_lib/Hero";
import LandingFeatures from "@/app/_lib/LandingFeatures";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      <Hero />
      <LandingFeatures />
      <Footer />
    </div>
  );
}

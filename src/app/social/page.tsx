import Nav from "@/components/nav";
import Footer from "@/components/footer";
import FirstTouch from "@/components/first-touch";

export const metadata = { title: "Your next move | Hop In Real Estate", description: "Explore buying, leasing, relocating, or selling in Dallas–Fort Worth. Useful tools first, a conversation when you're ready." };

export default function SocialPage() {
  return <div className="min-h-screen bg-cream"><Nav /><main id="main-content" tabIndex={-1}><FirstTouch /></main><Footer /></div>;
}

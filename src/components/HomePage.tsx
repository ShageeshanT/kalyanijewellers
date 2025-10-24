import Header from "./Header";
import HeroCarousel from "./HeroCarousel";
import FeaturedCollections from "./FeaturedCollections";
import PromotionalBanner from "./PromotionalBanner";
import ProductGrid from "./ProductGrid";
import TrustBadges from "./TrustBadges";
import StoreLocator from "./StoreLocator";
import Footer from "./Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroCarousel />
      <FeaturedCollections />
      <PromotionalBanner />
      <ProductGrid />
      <TrustBadges />
      <StoreLocator />
      <Footer />
    </div>
  );
};

export default HomePage;


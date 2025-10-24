import { useState } from "react";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import FeaturedCollections from "@/components/FeaturedCollections";
import PromotionalBanner from "@/components/PromotionalBanner";
import BestSellingPieces from "@/components/BestSellingPieces";
import TrustBadges from "@/components/TrustBadges";
import StoreLocator from "@/components/StoreLocator";
import ReviewsDisplay from "@/components/ReviewsDisplay";
import ReviewSubmission from "@/components/ReviewSubmission";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquarePlus } from "lucide-react";

const Index = () => {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const handleReviewSuccess = () => {
    // e.preventDefault();
    setIsReviewDialogOpen(false);
    // Optionally refresh the reviews display
    // window.location.reload();
  };

  return (
    <div className="min-h-screen">
      <Header />
      <HeroCarousel />
      <FeaturedCollections />
      <PromotionalBanner />
      <BestSellingPieces />
      <TrustBadges />
      <StoreLocator />
      <ReviewsDisplay 
        title="Customer Reviews" 
        subtitle="See what our customers are saying about their Jewellery experience"
        maxReviews={6}
      />
      
      {/* Add Review Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="font-display text-3xl mb-4 text-foreground">Share Your Experience</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Help other customers by sharing your experience with our Jewellery. Your review will be moderated before being published.
          </p>
          
          <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <MessageSquarePlus className="h-5 w-5 mr-2" />
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display">Share Your Experience</DialogTitle>
              </DialogHeader>
              <ReviewSubmission onSuccess={handleReviewSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
/*import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import FeaturedCollections from "@/components/FeaturedCollections";
import PromotionalBanner from "@/components/PromotionalBanner";
import ProductGrid from "@/components/ProductGrid";
import TrustBadges from "@/components/TrustBadges";
import StoreLocator from "@/components/StoreLocator";
import Footer from "@/components/Footer";

const Index = () => {
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

export default Index;*/

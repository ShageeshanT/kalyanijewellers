import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const StoreLocator = () => {
  return (
    <section className="py-20 px-4 bg-card">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary mb-6 elegant-shadow">
            <MapPin className="h-10 w-10 text-primary-foreground" />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">
            Visit Our Showrooms
          </h2>
          <p className="text-lg text-muted-foreground font-body mb-4 max-w-2xl mx-auto">
            Experience the beauty of our collections firsthand. Our expert consultants are ready to help you find or create the perfect piece.
          </p>
          <p className="text-base text-muted-foreground font-body mb-8 max-w-2xl mx-auto">
            Each showroom offers personalized service, complimentary consultations, and the opportunity to see our master craftsmen at work.
          </p>
          <Link to="/contact">
            <Button variant="hero" size="xl">
              Find Stores Near You
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-background rounded-lg p-6 card-shadow hover:elegant-shadow transition-elegant">
            <h3 className="text-xl font-display font-semibold text-primary mb-2">
              Visit Our Showrooms
            </h3>
            <p className="text-muted-foreground font-body text-sm mb-4">
              Experience our collections in person at any of our locations
            </p>
            <p className="text-sm text-foreground font-body">
              Find the perfect piece with our expert consultants
            </p>
          </div>
          <div className="bg-background rounded-lg p-6 card-shadow hover:elegant-shadow transition-elegant">
            <h3 className="text-xl font-display font-semibold text-primary mb-2">
              Expert Consultation
            </h3>
            <p className="text-muted-foreground font-body text-sm mb-4">
              Get personalized advice from our jewelry experts
            </p>
            <p className="text-sm text-foreground font-body">
              Custom design and repair services available
            </p>
          </div>
          <div className="bg-background rounded-lg p-6 card-shadow hover:elegant-shadow transition-elegant">
            <h3 className="text-xl font-display font-semibold text-primary mb-2">
              Quality Assurance
            </h3>
            <p className="text-muted-foreground font-body text-sm mb-4">
              Every piece crafted with precision and care
            </p>
            <p className="text-sm text-foreground font-body">
              Lifetime warranty on all our jewelry
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreLocator;

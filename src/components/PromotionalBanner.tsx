import { Button } from "@/components/ui/button";
import promoBanner from "@/assets/promo-bridal.jpg";
import { Link } from "react-router-dom";

const PromotionalBanner = () => {
  return (
    <section id="bridal" className="py-20 px-4 bg-card">
      <div className="container mx-auto">
        <div className="relative rounded-2xl overflow-hidden elegant-shadow">
          <img
            src={promoBanner}
            alt="Signature Bridal Collection"
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
          
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-8 lg:px-16">
              <div className="max-w-2xl text-card">
                <span className="inline-block px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-body font-semibold mb-4">
                  Signature Collection
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                  Bridal Elegance Redefined
                </h2>
                <p className="text-lg md:text-xl font-body mb-4 text-card/90">
                  Our signature bridal collection features timeless designs crafted with the finest diamonds and precious metals. Each piece is a testament to enduring love and exceptional craftsmanship.
                </p>
                <p className="text-lg font-body mb-8 text-card/90">
                  Make your special day truly unforgettable with Jewellery as unique as your love story.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/bridal">
                  <Button variant="hero" size="xl">
                    Explore Bridal Collection
                  </Button>
                  </Link>
                  {/*<Button variant="outline" size="xl" className="bg-card/10 backdrop-blur-sm border-card text-card hover:bg-card hover:text-primary">
                    Book Consultation
                  </Button>*/}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanner;

import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart, Sparkles, Shield, Gift } from "lucide-react";
import bridalHero from "@/assets/bridal-hero.jpg";
import bridalNecklaces from "@/assets/bridal-necklaces.jpg";
import bridalEarrings from "@/assets/bridal-earrings.jpg";
import bridalBangles from "@/assets/bridal-bangles.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiClient, ProductDTO } from "@/lib/api";

const bridalCategories = [
  { name: "Bridal Necklace Sets", image: bridalNecklaces, route: "necklace-sets" },
  { name: "Bridal Earrings", image: bridalEarrings, route: "earrings" },
  { name: "Bridal Bangles & Bracelets", image: bridalBangles, route: "bangles-bracelets" },
  { name: "Bridal Rings", image: bridalNecklaces, route: "rings" },
  { name: "Bridal Accessories", image: bridalEarrings, route: "accessories" },
  { name: "Complete Bridal Sets", image: bridalBangles, route: "complete-sets" },
];

const services = [
  { icon: Sparkles, title: "Free Design Consultation", description: "Expert guidance for your special day" },
  { icon: Heart, title: "Wedding Package Discounts", description: "Special pricing for bridal sets" },
  { icon: Shield, title: "Lifetime Warranty", description: "Forever protection for forever Jewellery" },
  { icon: Gift, title: "Complimentary Gift Packaging", description: "Elegant presentation for your treasures" },
];

const BridalCollection = () => {
  // Hardcoded product IDs for featured bridal pieces
  const featuredProductIds = [1, 2, 3, 4]; // You can change these IDs as needed
  const [featuredProducts, setFeaturedProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch products by their IDs
        const productPromises = featuredProductIds.map(id => 
          apiClient.getProduct(id).catch(err => {
            console.warn(`Failed to fetch product ${id}:`, err);
            return null; // Return null for failed requests
          })
        );
        
        const products = await Promise.all(productPromises);
        const validProducts = products.filter((product): product is ProductDTO => product !== null);
        
        setFeaturedProducts(validProducts);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <img src={bridalHero} alt="Bridal Collection" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-transparent flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-6 animate-fade-in">
            Bridal Collection
          </h1>
          <p className="text-white/90 text-xl md:text-2xl max-w-2xl mb-8 animate-fade-in">
            Celebrate your forever with timeless elegance
          </p>
          <Link to="/bridal">
          <Button size="lg" variant="hero" className="animate-fade-in">
            Explore Collection
          </Button>
          </Link>
        </div>
      </section>

      {/* Introduction */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-20 h-1 bg-accent mx-auto mb-6"></div>
          <p className="text-lg text-foreground leading-relaxed mb-6">
            Every bride deserves to shine on her special day. Our exquisite bridal collection combines traditional
            craftsmanship with contemporary elegance, creating pieces that will be cherished for generations.
          </p>
          <p className="text-lg text-foreground leading-relaxed">
            From intricate necklace sets to delicate earrings, each piece is meticulously crafted to make your wedding
            day unforgettable. Let our master artisans help you find the perfect adornment for your journey into forever.
          </p>
          <div className="w-20 h-1 bg-accent mx-auto mt-6"></div>
        </div>
      </section>

      {/* Collection Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-display text-4xl text-center mb-12 text-foreground">Bridal Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bridalCategories.map((category, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg card-shadow hover:hover-shadow transition-smooth animate-fade-in"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-elegant"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent flex flex-col justify-end p-6">
                <h3 className="font-display text-2xl text-white mb-4">{category.name}</h3>
                <Link to={`/bridal/collection/${category.route}`}>
                  <Button variant="secondary" className="w-full">
                    View Collection
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl text-center mb-4 text-foreground">Featured Bridal Pieces</h2>
          <p className="text-center text-muted-foreground mb-12">Handpicked treasures for your special day</p>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-muted-foreground">Loading featured products...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-destructive">{error}</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredProducts.map((product) => (
                <div key={product.productId} className="bg-card rounded-lg overflow-hidden card-shadow hover:hover-shadow transition-smooth">
                  <div className="aspect-square overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0].imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover hover:scale-110 transition-elegant" 
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg mb-1 text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">ID: {product.productId}</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      {product.category.name} • {product.metal.metalType} {product.metal.metalPurity}
                    </p>
                    <Link to={`/product/${product.productId}`}>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center">
            <Button variant="default" size="lg">
              View All Bridal Jewellery
            </Button>
          </div>
        </div>
      </section>

      {/* Custom Bridal Design */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="overflow-hidden rounded-lg">
            <img src={bridalNecklaces} alt="Custom Bridal Design" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-display text-4xl mb-6 text-foreground">Custom Bridal Designs</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Create a one-of-a-kind piece that tells your unique love story. Our expert designers work closely with you
              to bring your vision to life.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Heart className="h-6 w-6 text-accent mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Personalized Consultations</h4>
                  <p className="text-muted-foreground">One-on-one sessions with our master designers</p>
                </div>
              </li>
              <li className="flex items-start">
                <Sparkles className="h-6 w-6 text-accent mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Unique Design Creation</h4>
                  <p className="text-muted-foreground">Custom pieces tailored to your preferences</p>
                </div>
              </li>
              <li className="flex items-start">
                <Shield className="h-6 w-6 text-accent mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Expert Craftsmanship</h4>
                  <p className="text-muted-foreground">Decades of experience in bridal Jewellery</p>
                </div>
              </li>
            </ul>
            <Button size="lg" variant="default" onClick={() => navigate("/custom-design")}>
              Request Custom Design
            </Button>
          </div>
        </div>
      </section>

      {/* Bridal Services */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl text-center mb-12 text-foreground">Bridal Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-card p-6 rounded-lg card-shadow text-center">
                <service.icon className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-display text-xl mb-2 text-foreground">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BridalCollection;

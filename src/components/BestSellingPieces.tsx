import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { apiClient, ProductDTO } from "@/lib/api";
import { getFilteredProduct, formatPriceForDisplay, formatProductIdForDisplay } from "@/lib/productUtils";

// Hardcoded product IDs for best selling pieces
const bestSellingProductIds = [1, 2, 3, 4, 5, 6, 7, 8]; // You can change these IDs as needed

const BestSellingPieces = () => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const translateXRef = useRef(0);

  // Auto-slide functionality with truly continuous infinite loop
  useEffect(() => {
    if (isAutoPlaying && products.length > 0) {
      const animate = () => {
        translateXRef.current -= 0.5; // Move 0.5px per frame for smooth sliding
        
        // Never reset - let it scroll continuously
        // The tripled products array ensures seamless continuation
        if (carouselRef.current) {
          carouselRef.current.style.transform = `translateX(${translateXRef.current}px)`;
        }
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAutoPlaying, products.length]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch products by their IDs
        const productPromises = bestSellingProductIds.map(id => 
          apiClient.getProduct(id).catch(err => {
            console.warn(`Failed to fetch product ${id}:`, err);
            return null; // Return null for failed requests
          })
        );
        
        const fetchedProducts = await Promise.all(productPromises);
        const validProducts = fetchedProducts.filter((product): product is ProductDTO => product !== null);
        
        setProducts(validProducts);
      } catch (err) {
        console.error('Error fetching best selling products:', err);
        setError('Failed to load best selling products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle manual navigation with continuous infinite loop
  const goToPrevious = () => {
    setIsAutoPlaying(false);
    if (carouselRef.current) {
      translateXRef.current += 300; // Move back by 300px
      carouselRef.current.style.transform = `translateX(${translateXRef.current}px)`;
    }
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    if (carouselRef.current) {
      translateXRef.current -= 300; // Move forward by 300px
      carouselRef.current.style.transform = `translateX(${translateXRef.current}px)`;
    }
  };

  // Handle mouse events for pause/resume
  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  // Create infinite loop by duplicating products multiple times
  const createInfiniteProducts = () => {
    if (products.length === 0) return [];
    // Create many copies to ensure truly infinite scrolling
    return [...products, ...products, ...products, ...products, ...products, ...products]; // 6 copies for seamless infinite loop
  };

  const infiniteProducts = createInfiniteProducts();

  if (loading) {
    return (
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-display text-4xl mb-4 text-foreground">Best Selling Pieces</h2>
            <p className="text-lg text-muted-foreground mb-12">
              Discover our most cherished designs, loved by Jewellery connoisseurs worldwide
            </p>
            <div className="text-muted-foreground">Loading best selling pieces...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-display text-4xl mb-4 text-foreground">Best Selling Pieces</h2>
            <p className="text-lg text-muted-foreground mb-12">
              Discover our most cherished designs, loved by Jewellery connoisseurs worldwide
            </p>
            <div className="text-destructive">{error}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-muted py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl mb-4 text-foreground">Best Selling Pieces</h2>
          <p className="text-lg text-muted-foreground">
            Discover our most cherished designs, loved by Jewellery connoisseurs worldwide
          </p>
        </div>

        <div 
          className="relative overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Previous products"
          >
            <ChevronLeft className="h-6 w-6 text-foreground" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Next products"
          >
            <ChevronRight className="h-6 w-6 text-foreground" />
          </button>

          {/* Products Container with Smooth Sliding */}
          <div 
            ref={carouselRef}
            className="flex gap-6 transition-transform duration-300 ease-out"
            style={{ 
              width: `${infiniteProducts.length * 300}px`, // 300px per product + gap
              transform: `translateX(${translateXRef.current}px)`
            }}
          >
            {infiniteProducts.map((product, index) => {
              const filteredProduct = getFilteredProduct(product);
              const priceDisplay = formatPriceForDisplay(product);
              const productIdDisplay = formatProductIdForDisplay(product);
              
              return (
                <div 
                  key={`${product.productId}-${index}`} 
                  className="flex-shrink-0 w-[280px] bg-card rounded-lg overflow-hidden card-shadow hover:hover-shadow transition-smooth"
                >
                  <div className="aspect-square overflow-hidden">
                    {filteredProduct.images && filteredProduct.images.length > 0 ? (
                      <img 
                        src={filteredProduct.images[0].imageUrl} 
                        alt={filteredProduct.name} 
                        className="w-full h-full object-cover hover:scale-110 transition-elegant" 
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg mb-1 text-foreground">{filteredProduct.name}</h3>
                    {productIdDisplay && (
                      <p className="text-sm text-muted-foreground mb-2">{productIdDisplay}</p>
                    )}
                    <p className="text-sm text-muted-foreground mb-3">
                      {filteredProduct.category.name} • {filteredProduct.metal.metalType} {filteredProduct.metal.metalPurity}
                    </p>
                    {priceDisplay && (
                      <p className="text-sm font-semibold text-accent mb-3">
                        {priceDisplay}
                      </p>
                    )}
                    <Link to={`/product/${product.productId}`}>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellingPieces;

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { apiClient, ProductDTO } from "@/lib/api";
import { getFilteredProduct, formatPriceForDisplay, formatProductIdForDisplay } from "@/lib/productUtils";

// Define hardcoded product IDs for each category
const categoryProductIds: { [key: string]: number[] } = {
  "necklace-sets": [1, 2], // Example IDs for necklace sets
  "earrings": [3, 4], // Example IDs for earrings
  "bangles-bracelets": [4, 5], // Example IDs for bangles & bracelets
  "rings": [1], // Example IDs for rings
  "accessories": [7], // Example IDs for accessories
  "complete-sets": [2], // Example IDs for complete sets
};

const categoryTitles: { [key: string]: string } = {
  "necklace-sets": "Bridal Necklace Sets",
  "earrings": "Bridal Earrings", 
  "bangles-bracelets": "Bridal Bangles & Bracelets",
  "rings": "Bridal Rings",
  "accessories": "Bridal Accessories",
  "complete-sets": "Complete Bridal Sets",
};

const BridalCategoryCollection = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const productIds = categoryProductIds[category] || [];
        
        // Fetch products by their IDs
        const productPromises = productIds.map(id => 
          apiClient.getProduct(id).catch(err => {
            console.warn(`Failed to fetch product ${id}:`, err);
            return null; // Return null for failed requests
          })
        );
        
        const fetchedProducts = await Promise.all(productPromises);
        const validProducts = fetchedProducts.filter((product): product is ProductDTO => product !== null);
        
        setProducts(validProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const categoryTitle = category ? categoryTitles[category] : "Bridal Collection";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <section className="bg-muted py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/bridal" className="hover:text-foreground transition-colors">Bridal Collection</Link>
            <span>/</span>
            <span className="text-foreground">{categoryTitle}</span>
          </div>
        </div>
      </section>

      {/* Header */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/bridal">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Collections
            </Button>
          </Link>
        </div>
        
        <div className="text-center">
          <h1 className="font-display text-4xl md:text-5xl mb-4 text-foreground">
            {categoryTitle}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our exquisite collection of {categoryTitle.toLowerCase()}, 
            carefully curated for your special day.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 pb-16">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-muted-foreground">Loading products...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-destructive">{error}</div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-muted-foreground">No products found in this collection.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const filteredProduct = getFilteredProduct(product);
              const priceDisplay = formatPriceForDisplay(product);
              const productIdDisplay = formatProductIdForDisplay(product);
              
              return (
                <div key={product.productId} className="bg-card rounded-lg overflow-hidden card-shadow hover:hover-shadow transition-smooth">
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
                    {filteredProduct.productDescription && (
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {filteredProduct.productDescription}
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
        )}
      </section>

      <Footer />
    </div>
  );
};

export default BridalCategoryCollection;

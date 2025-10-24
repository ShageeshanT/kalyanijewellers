import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { getFilteredProduct, formatPriceForDisplay, formatProductIdForDisplay, isAdminUser } from "@/lib/productUtils";

// Import the ProductDTO from api.ts to ensure type consistency
import { ProductDTO } from "@/lib/api";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product details from backend
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching product details for ID:', id);

        const response = await axiosInstance.get(`/api/products/${id}`);
        console.log('Product response:', response.data);

        const fetchedProduct = response.data;
        setProduct(fetchedProduct);
        console.log('Product loaded successfully:', fetchedProduct.name);
      } catch (error: any) {
        console.error('Error fetching product:', error);
        console.error('Error details:', error.response?.data);
        setError(`Failed to load product: ${error.response?.data?.message || error.message}`);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading product details...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h2>
                <p className="text-muted-foreground mb-4">
                  {error || "The product you're looking for doesn't exist."}
                </p>
                <Button onClick={() => window.history.back()}>
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredProduct = getFilteredProduct(product);
  const priceDisplay = formatPriceForDisplay(product);
  const productIdDisplay = formatProductIdForDisplay(product);
  const isAdmin = isAdminUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-smooth">Home</Link>
            <span className="mx-2">/</span>
            <Link to={`/jewellery/${filteredProduct.category.name.toLowerCase()}`} className="hover:text-primary transition-smooth">
              {filteredProduct.category.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{filteredProduct.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="w-89 h-89 overflow-hidden rounded-lg card-shadow bg-muted group relative"> 
                <img
                  src={filteredProduct.images?.[0]?.imageUrl || "/placeholder.svg"}
                  alt={filteredProduct.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-150 cursor-zoom-in"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
                {filteredProduct.hasGemstone && (
                  <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    Gemstone
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">
                  {filteredProduct.category.name}
                </p>
                <h1 className="text-3xl lg:text-4xl font-display font-bold text-primary mb-2">
                  {filteredProduct.name}
                </h1>
                {productIdDisplay && (
                  <p className="text-lg text-muted-foreground">{productIdDisplay}</p>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-foreground leading-relaxed">
                  {filteredProduct.productDescription || "Gold prices vary daily. Please WhatsApp us for today's price."}
                </p>
                {priceDisplay && (
                  <p className="text-lg font-semibold text-accent">
                    {priceDisplay}
                  </p>
                )}
                {isAdmin && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {product.quantity > 0 ? (
                      <span className="text-green-600">In Stock ({product.quantity})</span>
                    ) : (
                      <span className="text-red-600">Out of Stock</span>
                    )}
                  </div>
                )}
              </div>

              {/* <div className="pt-4">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp us to order
                </Button>
              </div> */}

              {/* Specifications Accordion */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="specifications">
                  <AccordionTrigger className="text-lg font-display">
                    Specification
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Metal</span>
                        <span className="font-medium text-foreground">
                          {filteredProduct.metal.metalType} - {filteredProduct.metal.metalPurity}
                        </span>
                      </div>
                      {isAdmin && product.weight && (
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-muted-foreground">Weight</span>
                          <span className="font-medium text-foreground">{product.weight}g</span>
                        </div>
                      )}
                      {isAdmin && product.size && (
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-muted-foreground">Size</span>
                          <span className="font-medium text-foreground">{product.size}</span>
                        </div>
                      )}
                      {filteredProduct.gems.length > 0 && (
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-muted-foreground">Gems</span>
                          <span className="font-medium text-foreground">
                            {filteredProduct.gems.map(gem => gem.name).join(', ')}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 border-b border-border last:border-0">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium text-foreground">{filteredProduct.category.name}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="care">
                  <AccordionTrigger className="text-lg font-display">
                    Jewellery Care Guide
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-foreground">Store in a soft cloth pouch</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-foreground">Avoid contact with perfumes and chemicals</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-foreground">Clean with a soft brush and mild soap</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-foreground">Polish regularly with a jewellery cloth</span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="warranty">
                  <AccordionTrigger className="text-lg font-display">
                    Warranty Details
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-foreground">
                      1 year manufacturing warranty against defects. Covers manufacturing faults only.
                    </p>
                  </AccordionContent>
                </AccordionItem>

              </Accordion>

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;

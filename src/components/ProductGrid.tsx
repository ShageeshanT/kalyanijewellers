import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Link } from "react-router-dom";

const ProductGrid = () => {
  // Fetch products from API
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => apiClient.getProducts()
  });

  // Get first 8 products for homepage display
  const displayProducts = products.slice(0, 8);
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
            Best Selling Pieces
          </h2>
          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            Discover our most cherished designs, loved by Jewellery connoisseurs worldwide
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-muted-foreground">Loading products...</div>
          </div>
        )}

        {!isLoading && displayProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayProducts.map((product) => (
              <Link
                to={`/product/${product.productId}`}
                key={product.productId}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg bg-card card-shadow hover:hover-shadow transition-elegant mb-4">
                  <img
                    src={product.images[0]?.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-elegant"
                  />
                  {product.hasGemstone && (
                    <div className="absolute top-3 left-3 bg-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                      Gemstone
                    </div>
                  )}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-elegant">
                    <button className="bg-card p-3 rounded-full card-shadow hover:elegant-shadow transition-smooth">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-display font-semibold text-primary mb-1">
                  {product.name}
                </h3>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && displayProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;

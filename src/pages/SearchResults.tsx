import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

// const allProducts = [
//   { id: "JW001", name: "Diamond Solitaire Ring", category: "Rings", metal: "18K Gold", image: product1 },
//   { id: "JW002", name: "Pearl Necklace Set", category: "Necklaces", metal: "22K Gold", image: product2 },
//   { id: "JW003", name: "Emerald Drop Earrings", category: "Earrings", metal: "18K Gold", image: product3 },
// ];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [sortBy, setSortBy] = useState("relevance");

  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Search Header */}
      <section className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for Jewellery..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
              <Button type="submit" size="lg" className="absolute right-2 top-1/2 -translate-y-1/2">
                Search
              </Button>
            </div>
          </form>
          {searchTerm && (
            <p className="text-center mt-6 text-muted-foreground">
              Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{searchTerm}"
            </p>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Sort Options */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl text-foreground">Search Results</h2>
          <div className="flex items-center gap-4">
            <label className="text-sm text-muted-foreground">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-border rounded-md px-3 py-2 bg-card"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-card rounded-lg overflow-hidden card-shadow hover:hover-shadow transition-smooth"
              >
                <div className="relative overflow-hidden aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-elegant"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg mb-1 text-foreground">
                    {product.name.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, i) =>
                      part.toLowerCase() === searchTerm.toLowerCase() ? (
                        <mark key={i} className="bg-accent/30 font-semibold">{part}</mark>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">ID: {product.id}</p>
                  <p className="text-sm text-muted-foreground mb-3">{product.metal}</p>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display text-3xl mb-4 text-foreground">No products found for "{searchTerm}"</h3>
            <p className="text-muted-foreground mb-6">Try different keywords or browse our collections</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
              <Button variant="outline">Browse All Products</Button>
            </div>
          </div>
        )}

        {/* Popular Products */}
        {filteredProducts.length === 0 && (
          <section className="mt-16">
            <h3 className="font-display text-2xl mb-8 text-center text-foreground">Popular Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-card rounded-lg overflow-hidden card-shadow hover:hover-shadow transition-smooth"
                >
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-elegant"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg mb-1 text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-1">ID: {product.id}</p>
                    <p className="text-sm text-muted-foreground mb-3">{product.metal}</p>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;

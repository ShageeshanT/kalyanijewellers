import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Gem, Sparkles, Crown, Heart, Circle, Square, Triangle } from "lucide-react";
import { apiClient, CategoryDTO } from "@/lib/api";

// Icon mapping for different jewellery categories
const categoryIcons: Record<string, any> = {
  rings: Circle,
  necklaces: Heart,
  earrings: Triangle,
  bangles: Circle,
  pendants: Heart,
  chains: Square,
  bracelets: Circle,
  brooches: Gem,
  default: Sparkles
};

// Mock category images for visual appeal
const categoryImages: Record<string, string> = {
  rings: "/src/assets/category-rings.jpg",
  necklaces: "/src/assets/category-necklaces.jpg",
  earrings: "/src/assets/category-earrings.jpg",
  bangles: "/src/assets/category-bangles.jpg",
  pendants: "/src/assets/category-pendants.jpg",
  chains: "/src/assets/category-chains.jpg",
  bracelets: "/src/assets/category-bangles.jpg",
  brooches: "/src/assets/category-earrings.jpg"
};

const JewelleryCategories = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch categories from backend API
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.getCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get category slug from category name (convert to lowercase and replace spaces with hyphens)
  const getCategorySlug = (categoryName: string) => {
    return categoryName.toLowerCase().replace(/\s+/g, '-');
  };

  // Get icon for category
  const getCategoryIcon = (categoryName: string) => {
    const slug = getCategorySlug(categoryName);
    const IconComponent = categoryIcons[slug] || categoryIcons.default;
    return IconComponent;
  };

  // Get image for category
  const getCategoryImage = (categoryName: string) => {
    const slug = getCategorySlug(categoryName);
    return categoryImages[slug] || "/placeholder.svg";
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="max-w-md mx-auto">
              <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                Unable to Load Categories
              </h1>
              <p className="text-muted-foreground mb-6">
                We're having trouble loading our jewellery categories. Please try again later.
              </p>
              <Link to="/">
                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Return Home
                </button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-16 text-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                <Crown className="h-10 w-10 text-white" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
                Our Jewellery Collections
              </h1>
              <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                Discover our exquisite range of handcrafted jewellery, each piece telling a story of elegance and timeless beauty.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-12">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                />
                <Sparkles className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading our beautiful collections...</p>
                </div>
              </div>
            )}

            {/* Categories Grid */}
            {!isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCategories.map((category) => {
                  const IconComponent = getCategoryIcon(category.categoryName);
                  const categoryImage = getCategoryImage(category.categoryName);
                  const categorySlug = getCategorySlug(category.categoryName);

                  return (
                    <Link
                      key={category.categoryId}
                      to={`/jewellery/${categorySlug}`}
                      className="group"
                    >
                      <Card className="overflow-hidden card-shadow hover:hover-shadow transition-all duration-300 h-full">
                        <div className="aspect-square overflow-hidden bg-muted relative">
                          <img
                            src={categoryImage}
                            alt={category.categoryName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <IconComponent className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-display font-semibold text-xl text-white group-hover:text-primary-foreground transition-colors">
                                  {category.categoryName}
                                </h3>
                                <p className="text-white/80 text-sm">
                                  Explore Collection
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-5 w-5 text-primary" />
                              <span className="text-sm font-medium text-muted-foreground">
                                Jewellery Category
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ID: {category.categoryId}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* No Categories Found */}
            {!isLoading && filteredCategories.length === 0 && searchTerm && (
              <div className="text-center py-16">
                <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                  No categories found
                </h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any categories matching "{searchTerm}". Try a different search term.
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* No Categories Available */}
            {!isLoading && categories.length === 0 && !searchTerm && (
              <div className="text-center py-16">
                <Gem className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                  No categories available
                </h3>
                <p className="text-muted-foreground">
                  Our jewellery categories are being prepared. Please check back soon.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-muted py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Need Help Choosing?
              </h2>
              <p className="text-muted-foreground mb-8">
                Our expert consultants are here to help you find the perfect piece of jewellery for any occasion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Contact Us
                  </button>
                </Link>
                <Link to="/stores">
                  <button className="border border-border text-foreground px-8 py-3 rounded-lg font-medium hover:bg-muted transition-colors">
                    Visit Our Stores
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default JewelleryCategories;

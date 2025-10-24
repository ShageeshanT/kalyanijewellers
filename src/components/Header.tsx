import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, X, LogIn} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import axiosInstance from "@/lib/axios";
import categoryNecklaces from "@/assets/category-necklaces.jpg";
import categoryChains from "@/assets/category-chains.jpg";
import categoryPendants from "@/assets/category-pendants.jpg";
import categoryBangles from "@/assets/category-bangles.jpg";
import categoryEarrings from "@/assets/category-earrings.jpg";
import categoryRings from "@/assets/category-rings.jpg";

// Backend category interface
interface CategoryDTO {
  categoryId: number;
  name: string;
}

// Frontend category interface with image mapping
interface CategoryWithImage {
  categoryId: number;
  name: string;
  href: string;
  image: string;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryWithImage[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Image mapping for categories
  const categoryImageMap: Record<string, string> = {
    'necklaces': categoryNecklaces,
    'chains': categoryChains,
    'pendants': categoryPendants,
    'bangles': categoryBangles,
    'earrings': categoryEarrings,
    'rings': categoryRings,
  };

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        console.log('Fetching categories from backend...');
        const response = await axiosInstance.get('/api/categories');
        console.log('Categories response:', response.data);
        
        const backendCategories = response.data as CategoryDTO[];
        
        // Map backend categories to frontend format with images
        const categoriesWithImages = backendCategories.map(category => ({
          categoryId: category.categoryId,
          name: category.name,
          href: `/jewellery/${category.name.toLowerCase()}`,
          image: categoryImageMap[category.name.toLowerCase()] || categoryRings // fallback to rings image
        }));
        
        setCategories(categoriesWithImages);
        console.log('Categories loaded successfully:', categoriesWithImages.length, 'categories');
      } catch (error: any) {
        console.error('Error fetching categories:', error);
        console.error('Error details:', error.response?.data);
        
        // Fallback to hardcoded categories if backend fails
        const fallbackCategories = [
          { categoryId: 1, name: "Necklaces", href: "/jewellery/necklaces", image: categoryNecklaces },
          { categoryId: 2, name: "Chains", href: "/jewellery/chains", image: categoryChains },
          { categoryId: 3, name: "Pendants", href: "/jewellery/pendants", image: categoryPendants },
          { categoryId: 4, name: "Bangles", href: "/jewellery/bangles", image: categoryBangles },
          { categoryId: 5, name: "Earrings", href: "/jewellery/earrings", image: categoryEarrings },
          { categoryId: 6, name: "Rings", href: "/jewellery/rings", image: categoryRings },
        ];
        setCategories(fallbackCategories);
        console.log('Using fallback categories due to backend error');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Bridal", href: "/bridal" },
    { label: "Custom Design", href: "/custom-design" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

// Categories are now fetched dynamically from backend

// Latest products removed - will be fetched dynamically if needed

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border elegant-shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-accent rounded-md transition-smooth"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo - Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2 lg:static lg:transform-none">
            <Link to="/" className="text-2xl lg:text-3xl font-display font-bold text-primary tracking-wider">
              New Kalyani Jewellers
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/"
              className="text-sm font-body font-medium text-foreground hover:text-primary transition-smooth relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
            >
              Home
            </Link>

            
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-body font-medium bg-transparent hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-primary">
                    Jewellery
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="container mx-auto py-12 px-4">
                      <div className="grid grid-cols-12 gap-8">
                        {/* OUR JEWELLERY Section */}
                        <div className="col-span-3">
                          <h3 className="text-2xl font-display font-bold text-foreground mb-6 uppercase tracking-wide">
                            Our Jewellery
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            {categoriesLoading ? (
                              // Loading state
                              [...Array(6)].map((_, index) => (
                                <div key={index} className="flex flex-col items-center space-y-2 p-2 rounded-lg">
                                  <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
                                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                              ))
                            ) : (
                              categories.map((category) => (
                              <Link
                                key={category.name}
                                to={category.href}
                                className="group flex flex-col items-center space-y-2 p-2 rounded-lg transition-all hover:bg-accent/30"
                              >
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-card shadow-md group-hover:shadow-lg transition-all group-hover:scale-110">
                                  <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="text-sm font-medium text-foreground text-center">
                                  {category.name}
                                </div>
                              </Link>
                              ))
                            )}
                          </div>
                        </div>

                        {/* LATEST PRODUCTS Section }
                        <div className="col-span-5">
                          <h3 className="text-2xl font-display font-bold text-foreground mb-6 uppercase tracking-wide">
                            Latest Products
                          </h3>
                          <div className="grid grid-cols-4 gap-4">
                            {latestProducts.map((product) => (
                              <Link
                                key={product.id}
                                to={`/product/${product.id}`}
                                className="group"
                              >
                                <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all">
                                  <div className="aspect-square bg-muted">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                  </div>
                                  <div className="p-2 text-center">
                                    <p className="text-xs font-medium text-foreground">{product.id}</p>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>*/}

                        {/* Promotional Image */}
                        <div className="col-span-4">
                          <div className="h-full rounded-lg overflow-hidden shadow-lg">
                            <img
                              src="/placeholder.svg"
                              alt="Featured Collection"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link
              to="/gems"
              className="text-sm font-body font-medium text-foreground hover:text-primary transition-smooth relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
            >
              Gems
            </Link>

            {menuItems.slice(1).map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-body font-medium text-foreground hover:text-primary transition-smooth relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2">
            {/*<Button variant="ghost" size="icon" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>*/}
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Search"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Link to="/auth/login">
              <Button 
                variant="ghost" 
                size="icon" 
                aria-label="User Login"
              >
                <LogIn className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" aria-label="Shopping bag">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-border animate-fade-in">
            <form onSubmit={(e) => { e.preventDefault(); const formData = new FormData(e.currentTarget); window.location.href = `/search?q=${formData.get('q')}`; }} className="flex gap-2">
              <input
                type="text"
                name="q"
                placeholder="Search for Jewellery..."
                className="flex-1 px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit">Search</Button>
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-base font-body font-medium text-foreground hover:text-primary transition-smooth py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-2">
                <div className="text-base font-body font-medium text-foreground pb-2">Jewellery</div>
                <div className="flex flex-col space-y-2 pl-4">
                  {categoriesLoading ? (
                    // Loading state
                    [...Array(6)].map((_, index) => (
                      <div key={index} className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    ))
                  ) : (
                    categories.map((category) => (
                    <Link
                      key={category.name}
                      to={category.href}
                      className="text-sm font-body text-muted-foreground hover:text-primary transition-smooth py-1 flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <img src={category.image} alt={category.name} className="w-6 h-6 rounded-full object-cover" />
                      {category.name}
                    </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

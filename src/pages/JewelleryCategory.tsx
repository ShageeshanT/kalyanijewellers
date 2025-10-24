import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axios";

// Backend interfaces
interface ProductDTO {
  productId: number;
  name: string;
  size?: string;
  weight?: number;
  hasGemstone: boolean;
  initialProductionCost: number;
  quantity: number;
  productDescription?: string;
  category: {
    categoryId: number;
    name: string;
  };
  metal: {
    metalId: number;
    metalType: string;
    metalPurity: string;
  };
  gems: Array<{
    gemId: number;
    gemName: string;
    karatRate: number;
  }>;
  images: Array<{
    imageId: number;
    imageUrl: string;
  }>;
}

interface CategoryDTO {
  categoryId: number;
  name: string;
}

interface MetalDTO {
  metalId: number;
  metalType: string;
  metalPurity: string;
}

const JewelleryCategory = () => {
  const { category } = useParams();
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [metals, setMetals] = useState<MetalDTO[]>([]);
  const [selectedMetals, setSelectedMetals] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDTO | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Jewellery";

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories from backend...');
        const response = await axiosInstance.get('/api/categories');
        console.log('Categories response:', response.data);
        setCategories(response.data);
      } catch (error: any) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  // Fetch metals from backend
  useEffect(() => {
    const fetchMetals = async () => {
      try {
        console.log('Fetching metals from backend...');
        const response = await axiosInstance.get('/api/metals');
        console.log('Metals response:', response.data);
        setMetals(response.data);
      } catch (error: any) {
        console.error('Error fetching metals:', error);
        setError('Failed to load metals');
      }
    };

    fetchMetals();
  }, []);

  // Find selected category
  useEffect(() => {
    if (categories.length > 0 && category) {
      const foundCategory = categories.find(cat => 
        cat.name.toLowerCase() === category.toLowerCase()
      );
      setSelectedCategory(foundCategory || null);
      console.log('Selected category:', foundCategory);
    }
  }, [categories, category]);

  // Fetch products based on category
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategory) return;

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching products for category:', selectedCategory.name);

        // Use ProductSearchRequest to filter by category
        const searchRequest = {
          categoryIds: [selectedCategory.categoryId],
          page: 0,
          pageSize: 100, // Get all products for this category
          sortBy: "name",
          sortDirection: "asc"
        };

        console.log('Search request:', searchRequest);
        const response = await axiosInstance.post('/api/products/search', searchRequest);
        console.log('Products response:', response.data);

        const fetchedProducts = response.data.content || response.data;
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        console.log('Products loaded successfully:', fetchedProducts.length, 'products');
      } catch (error: any) {
        console.error('Error fetching products:', error);
        console.error('Error details:', error.response?.data);
        setError(`Failed to load products: ${error.response?.data?.message || error.message}`);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // Filter products based on selected metals
  useEffect(() => {
    if (selectedMetals.length === 0) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        selectedMetals.includes(product.metal.metalId)
      );
      setFilteredProducts(filtered);
    }
  }, [products, selectedMetals]);

  const toggleMetal = (metalId: number) => {
    setSelectedMetals(prev => 
      prev.includes(metalId) 
        ? prev.filter(id => id !== metalId)
        : [...prev, metalId]
    );
  };

  const resetFilters = () => {
    setSelectedMetals([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-4">Error Loading Products</h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-primary">
              {categoryTitle}
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
              <Card className="p-6 card-shadow sticky top-24">
                <h2 className="text-lg font-display font-semibold mb-6 text-primary">Filters</h2>

                {/* Metal Type Filter */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">Metal Type</Label>
                  <div className="space-y-3">
                    {metals.map(metal => (
                      <div key={metal.metalId} className="flex items-center space-x-2">
                        <Checkbox
                          id={`metal-${metal.metalId}`}
                          checked={selectedMetals.includes(metal.metalId)}
                          onCheckedChange={() => toggleMetal(metal.metalId)}
                        />
                        <Label
                          htmlFor={`metal-${metal.metalId}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {metal.metalType} - {metal.metalPurity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </Card>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.productId}
                    to={`/product/${product.productId}`}
                    className="group"
                  >
                    <Card className="overflow-hidden card-shadow hover:hover-shadow transition-all duration-300 h-full">
                      <div className="aspect-square overflow-hidden bg-muted relative">
                        <img
                          src={product.images?.[0]?.imageUrl || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {product.hasGemstone && (
                          <div className="absolute top-3 left-3 bg-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                            Gemstone
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-display font-semibold text-lg mb-2 text-primary group-hover:text-secondary transition-smooth">
                          {product.name}
                        </h3>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>Category: {product.category.name}</p>
                          <p>Metal: {product.metal.metalType} - {product.metal.metalPurity}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {filteredProducts.length === 0 && !loading && (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground">
                    No products found in this category.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JewelleryCategory;
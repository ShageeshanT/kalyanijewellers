import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { apiClient, Branch } from "@/lib/api";

// Extract unique cities from branch addresses for filtering
const extractCities = (branches: Branch[]): string[] => {
  const cities = new Set<string>();
  branches.forEach(branch => {
    // Simple extraction - you might want to improve this logic
    const addressParts = branch.branchAddress.split(',');
    if (addressParts.length >= 2) {
      cities.add(addressParts[addressParts.length - 2].trim());
    }
  });
  return Array.from(cities).sort();
};

const StoreLocator = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [searchTerm, setSearchTerm] = useState("");

  // Load branches from API
  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getAllBranches();
      setBranches(data);
    } catch (error: any) {
      console.error('Failed to load branches:', error);
      // Fallback to empty array if API fails - this is a public page so we don't show error toasts
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  const cities = ["All Cities", ...extractCities(branches)];

  const filteredBranches = branches.filter((branch) => {
    const matchesCity = selectedCity === "All Cities" || 
                       branch.branchAddress.toLowerCase().includes(selectedCity.toLowerCase());
    const matchesSearch = branch.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.branchAddress.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCity && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4">Our Boutiques</h1>
          <p className="text-white/90 text-xl">Find New Kalyani Jewellers near you</p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by area or pincode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="md:w-auto">
              <Navigation className="h-4 w-4 mr-2" />
              Near Me
            </Button>
          </div>
        </div>
      </section>

      {/* Map & Branch List */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Branch List */}
          <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto">
            <h2 className="font-display text-2xl mb-4 text-foreground">
              {loading ? "Loading..." : `${filteredBranches.length} Store${filteredBranches.length !== 1 ? 's' : ''} Found`}
            </h2>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-muted-foreground">Loading branches...</div>
              </div>
            ) : (
              filteredBranches.map((branch) => (
                <div key={branch.branchId} className="bg-card p-6 rounded-lg card-shadow hover:hover-shadow transition-smooth">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display text-xl text-foreground">{branch.branchName}</h3>
                    <span className="text-sm text-accent font-semibold">{branch.branchCode}</span>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <p className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 flex-shrink-0 mt-1" />
                      <span>{branch.branchAddress}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <a href={`tel:${branch.branchTelephone}`} className="hover:text-accent transition-smooth">
                        {branch.branchTelephone}
                      </a>
                    </p>
                    <p className="flex items-start gap-2">
                      <Clock className="h-4 w-4 flex-shrink-0 mt-1" />
                      <span>{branch.branchHours}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Navigation className="h-4 w-4 mr-2" />
                      Directions
                    </Button>
                    <Button variant="default" size="sm" className="flex-1">
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Map Placeholder */}
          <div className="lg:col-span-3 bg-muted rounded-lg overflow-hidden min-h-[600px] sticky top-4">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-accent mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">Map View</p>
                <p className="text-muted-foreground text-sm">Interactive map would display here</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StoreLocator;

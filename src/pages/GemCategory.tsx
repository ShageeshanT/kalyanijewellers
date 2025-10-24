import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axios";

// Backend interfaces
interface GemDTO {
  gemId: number;
  name: string;
  price?: number;
  imageFileName?: string;
  imageContentType?: string;
  imageFileSize?: number;
  imageUrl?: string;
}

const GemCategory = () => {
  const [gems, setGems] = useState<GemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch gems from backend
  useEffect(() => {
    const fetchGems = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching gems from backend...');
        
        const response = await axiosInstance.get('/api/gems');
        console.log('Gems response:', response.data);
        
        const fetchedGems = response.data;
        setGems(fetchedGems);
        console.log('Gems loaded successfully:', fetchedGems.length, 'gems');
      } catch (error: any) {
        console.error('Error fetching gems:', error);
        console.error('Error details:', error.response?.data);
        setError(`Failed to load gems: ${error.response?.data?.message || error.message}`);
        setGems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGems();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading gems...</p>
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
                <h2 className="text-2xl font-bold text-foreground mb-4">Error Loading Gems</h2>
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
          {/* Breadcrumb */}
          <div className="text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-smooth">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground capitalize">Gems</span>
          </div>

          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-4 capitalize">
              Gem Collection
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover our exquisite collection of natural gemstones, each carefully selected for its exceptional quality and beauty.
            </p>
          </div>

          {/* Gems Grid - 4 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gems.map((gem) => (
              <Link
                key={gem.gemId}
                to={`/gem/${gem.gemId}`}
                className="group"
              >
                <Card className="overflow-hidden card-shadow hover:hover-shadow transition-all duration-300 h-full">
                  <div className="aspect-square overflow-hidden bg-muted relative">
                    <div className="absolute top-3 left-3 bg-emerald-600 text-white px-2 py-1 rounded-md text-xs font-medium z-10 shadow-md">
                      💎 Gemstone
                    </div>
                    <img
                      src={gem.imageUrl || "/placeholder.svg"}
                      alt={gem.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-lg mb-2 text-primary group-hover:text-secondary transition-smooth">
                      {gem.name}
                    </h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>ID: GM-{gem.gemId.toString().padStart(3, '0')}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {gems.length === 0 && !loading && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-foreground mb-4">No Gems Available</h2>
              <p className="text-lg text-muted-foreground">
                We're currently updating our gem collection. Please check back soon!
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GemCategory;
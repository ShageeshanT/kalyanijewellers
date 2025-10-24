import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle, Loader2 } from "lucide-react";
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

const GemDetail = () => {
  const { id } = useParams();
  const [gem, setGem] = useState<GemDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch gem details from backend
  useEffect(() => {
    const fetchGem = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching gem details for ID:', id);

        const response = await axiosInstance.get(`/api/gems/${id}`);
        console.log('Gem response:', response.data);

        const fetchedGem = response.data;
        setGem(fetchedGem);
        console.log('Gem loaded successfully:', fetchedGem.name);
      } catch (error: any) {
        console.error('Error fetching gem:', error);
        console.error('Error details:', error.response?.data);
        setError(`Failed to load gem: ${error.response?.data?.message || error.message}`);
        setGem(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGem();
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
                <p className="text-muted-foreground">Loading gem details...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !gem) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-4">Gem Not Found</h2>
                <p className="text-muted-foreground mb-4">
                  {error || "The gem you're looking for doesn't exist."}
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-smooth">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/gems" className="hover:text-primary transition-smooth">
              Gems
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{gem.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Gem Images */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg card-shadow bg-muted group relative">
                <img
                  src={gem.imageUrl || "/placeholder.svg"}
                  alt={gem.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-150 cursor-zoom-in"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
                <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  Gemstone
                </div>
              </div>
            </div>

            {/* Gem Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">
                  GEMSTONE
                </p>
                <h1 className="text-3xl lg:text-4xl font-display font-bold text-primary mb-2">
                  {gem.name}
                </h1>
                <p className="text-lg text-muted-foreground">ID: GM-{gem.gemId.toString().padStart(3, '0')}</p>
              </div>

              <div className="space-y-2">
                <p className="text-foreground leading-relaxed">
                  Discover the natural beauty and exceptional quality of our {gem.name} gemstone. 
                  Each gem is carefully selected for its unique characteristics and stunning appearance.
                </p>
                {gem.price && gem.price > 0 && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="text-lg font-semibold text-primary">
                      Price: LKR {gem.price.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* <div className="pt-4">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp us to order
                </Button>
              </div> */}

              {/* Gem Information Accordion */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="specifications">
                  <AccordionTrigger className="text-lg font-display">
                    Gem Specifications
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Gem Name</span>
                        <span className="font-medium text-foreground">{gem.name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Gem ID</span>
                        <span className="font-medium text-foreground">GM-{gem.gemId.toString().padStart(3, '0')}</span>
                      </div>
                      {gem.price && gem.price > 0 && (
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-muted-foreground">Price</span>
                          <span className="font-medium text-foreground">LKR {gem.price.toLocaleString()}</span>
                        </div>
                      )}
                      {gem.imageFileName && (
                        <div className="flex justify-between py-2 border-b border-border last:border-0">
                          <span className="text-muted-foreground">Image</span>
                          <span className="font-medium text-foreground">Available</span>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="care">
                  <AccordionTrigger className="text-lg font-display">
                    Gemstone Care Guide
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-foreground">Store in a soft cloth pouch or jewellery box</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-foreground">Avoid exposure to harsh chemicals and cleaning agents</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-foreground">Clean gently with warm soapy water and soft brush</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-foreground">Remove before swimming or physical activities</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-foreground">Have your gemstone professionally cleaned annually</span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="quality">
                  <AccordionTrigger className="text-lg font-display">
                    Quality Assurance
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-foreground">
                      All our gemstones are authenticated and come with quality certificates. 
                      We ensure that each gem meets our high standards for clarity, color, and cut. 
                      Our gemstones are sourced from trusted suppliers and verified for authenticity.
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

export default GemDetail;

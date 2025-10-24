import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import bridalImg from "@/assets/collection-bridal.jpg";
import gemsImg from "@/assets/collection-gems.jpg";
import chainsImg from "@/assets/collection-chains.jpg";
import ringsImg from "@/assets/collection-rings.jpg";

const collections = [
  {
    image: bridalImg,
    title: "Bridal Collection",
    description: "Celebrate your eternal love with our exquisite bridal Jewellery, crafted to perfection for your special day.",
    link: "/bridal"
  },
  {
    image: gemsImg,
    title: "Precious Gems",
    description: "Discover the brilliance of certified gemstones set in stunning designs that captivate and inspire.",
    link: "/gems"
  },
  {
    image: chainsImg,
    title: "Gold Chains",
    description: "Timeless elegance in every link. Our gold chain collection combines tradition with contemporary style.",
    link: "/jewellery/chains",
  },
  {
    image: ringsImg,
    title: "Gemstone Rings",
    description: "From engagement to statement pieces, our rings showcase exceptional craftsmanship and beauty.",
    link: "/jewellery/ring"
  },
];

const FeaturedCollections = () => {
  return (
    <section id="collections" className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
            Featured Collections
          </h2>
          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            Explore our carefully curated collections, where each piece tells a story of elegance and sophistication
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {collections.map((collection, index) => (
            <div
              key={index}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg card-shadow hover:hover-shadow transition-elegant mb-4">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-elegant"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-elegant flex items-end p-6">
                  <Button asChild variant="hero" size="sm">
                    <Link to={collection.link}>View Collection</Link>
                  </Button>
                </div>
              </div>
              <h3 className="text-2xl font-display font-semibold text-primary mb-2">
                {collection.title}
              </h3>
              <p className="text-muted-foreground font-body">
                {collection.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Explore Collections Button */}
        <div className="text-center mt-12">
          <Link to="/bridal">
            <Button size="lg" variant="default">
              Explore Our Collections
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;

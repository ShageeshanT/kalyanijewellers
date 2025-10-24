import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewsDisplay from "@/components/ReviewsDisplay";
import { Button } from "@/components/ui/button";
import { Award, Heart, Shield, Gem } from "lucide-react";
import { Link } from "react-router-dom";
import aboutHero from "@/assets/about-hero.jpg";
import customProcess from "@/assets/custom-process.jpg";


const values = [
  { icon: Gem, title: "Excellence in Craftsmanship", description: "Every piece reflects our commitment to perfection" },
  { icon: Shield, title: "Customer Trust", description: "Building lasting relationships through integrity" },
  { icon: Award, title: "Authentic Materials", description: "Only the finest certified gems and metals" },
  { icon: Heart, title: "Timeless Designs", description: "Creating heirlooms for generations" },
];

const milestones = [
  { year: "1998", event: "Founded by master jeweler Shri Rajesh Kumar" },
  { year: "2005", event: "Expanded to 5 boutique locations" },
  { year: "2010", event: "Introduced custom design services" },
  { year: "2015", event: "Served 50,000+ happy customers" },
  { year: "2020", event: "Received National Jeweler's Award" },
  { year: "2024", event: "Celebrating 26 years of excellence" },
];

const stats = [
  { number: "26+", label: "Years in Business" },
  { number: "100K+", label: "Happy Customers" },
  { number: "500K+", label: "Jewellery Pieces Crafted" },
  { number: "15", label: "Branches Nationwide" },
];

const whyChooseUs = [
  "Certified Gemstones",
  "Hallmarked Gold",
  "Lifetime Warranty",
  "Expert Craftsmen",
  "Ethical Sourcing",
  "Custom Design Services",
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <img src={aboutHero} alt="About Us" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-4 animate-fade-in">
            About New Kalyani Jewellers
          </h1>
          <p className="text-white/90 text-xl md:text-2xl max-w-2xl animate-fade-in">A Legacy of Excellence</p>
        </div>
      </section>

      {/* Brand Story Section 1 */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-4xl mb-6 text-foreground">Our Heritage</h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              Founded in 1989 by Mr Amararatna Kodagoda, New Kalyani Jewellers began as a small workshop with a
              big dream: to create Jewellery that tells stories and celebrates life's precious moments.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Over the past 26 years, we have grown from a single boutique to a trusted name with 15 locations across
              the country, serving over 100,000 satisfied customers. Yet, our commitment to excellence and personal
              service remains unchanged.
            </p>
          </div>
          <div className="overflow-hidden rounded-lg elegant-shadow">
            <img src={customProcess} alt="Heritage" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Brand Story Section 2 */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="overflow-hidden rounded-lg elegant-shadow order-2 md:order-1">
              <img src={aboutHero} alt="Craftsmanship" className="w-full h-full object-cover" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="font-display text-4xl mb-6 text-foreground">Our Journey</h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                What started as a passion for creating beautiful Jewellery has evolved into a legacy of trust and
                excellence. Each piece that leaves our workshop carries with it decades of expertise and a commitment to
                quality that our customers have come to trust.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Today, we continue to honor traditional craftsmanship while embracing modern design sensibilities,
                ensuring that every piece is both timeless and contemporary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-display text-4xl text-center mb-12 text-foreground">Our Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <value.icon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-display text-xl mb-2 text-foreground">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Reviews */}
      <ReviewsDisplay 
        title="What Our Customers Say" 
        subtitle="Hear from our valued customers about their experience with our Jewellery"
        maxReviews={6}
      />

      {/* Statistics */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-display text-5xl md:text-6xl text-accent mb-2">{stat.number}</div>
              <p className="text-lg text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl text-center mb-12 text-foreground">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {whyChooseUs.map((reason, index) => (
              <div key={index} className="bg-card p-6 rounded-lg card-shadow text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <p className="font-semibold text-foreground">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-4xl mb-6 text-foreground">Visit Our Showroom</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Experience our collections in person and let our experts guide you to the perfect piece
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/bridal">
            <Button size="lg" variant="default">
              Explore Our Collections
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline">
              Find a Store Near You
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;

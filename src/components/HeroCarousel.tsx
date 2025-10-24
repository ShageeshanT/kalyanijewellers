import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import { Link } from "react-router-dom";

const slides = [
  {
    image: hero1,
    title: "Exquisite Craftsmanship",
    subtitle: "Discover our signature collection of handcrafted luxury Jewellery",
    cta: "Explore Collection",
    link: "/custom-design",
  },
  {
    image: hero2,
    title: "Bridal Elegance",
    subtitle: "Timeless pieces for your special day",
    cta: "View Bridal Collection",
    link: "/bridal",
  },
  {
    image: hero3,
    title: "Custom Designs",
    subtitle: "Create your unique masterpiece with our expert artisans",
    cta: "Start Designing",
    link: "/custom-design",
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[600px] lg:h-[700px] overflow-hidden mt-20">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide
              ? "opacity-100 z-10 pointer-events-auto"
              : "opacity-0 z-0 pointer-events-none"
          }`}
          aria-hidden={index !== currentSlide}
        >
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-card animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 text-shadow">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl font-body mb-8 text-card/90">
                {slide.subtitle}
              </p>
              <Button asChild variant="hero" size="xl">
                <Link to={slide.link}>{slide.cta}</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card p-3 rounded-full transition-smooth elegant-shadow"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-primary" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card p-3 rounded-full transition-smooth elegant-shadow"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-primary" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-smooth ${
              index === currentSlide ? "bg-card scale-125" : "bg-card/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;

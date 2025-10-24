import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, Droplets, Sun, Shield } from "lucide-react";

const careInstructions = [
  {
    icon: Sparkles,
    title: "Daily Care",
    items: [
      "Remove Jewellery before washing hands, bathing, or swimming",
      "Apply cosmetics, perfumes, and lotions before wearing Jewellery",
      "Wipe Jewellery with a soft cloth after each wear",
      "Store each piece separately to prevent scratches",
    ],
  },
  {
    icon: Droplets,
    title: "Cleaning",
    items: [
      "Use mild soap and warm water for regular cleaning",
      "Gently scrub with a soft brush for intricate designs",
      "Pat dry with a soft, lint-free cloth",
      "Professional cleaning recommended once a year",
    ],
  },
  {
    icon: Sun,
    title: "Storage",
    items: [
      "Store in a cool, dry place away from direct sunlight",
      "Use individual pouches or lined Jewellery boxes",
      "Keep gold and silver Jewellery separately",
      "Ensure clasps are fastened to prevent tangling",
    ],
  },
  {
    icon: Shield,
    title: "What to Avoid",
    items: [
      "Harsh chemicals, chlorine, and bleach",
      "Extreme temperatures and humidity",
      "Physical activities and heavy work",
      "Ultrasonic cleaners for delicate pieces",
    ],
  },
];

const metalCare = [
  {
    metal: "Gold Jewellery",
    care: "Gold is durable but can scratch. Clean with warm soapy water and a soft cloth. For deeper cleaning, use a professional jeweler. Avoid contact with chlorine and chemicals.",
  },
  {
    metal: "Diamond Jewellery",
    care: "Diamonds attract oil and dirt. Clean regularly with warm soapy water or a commercial diamond cleaner. Use a soft brush for settings. Professional cleaning recommended every 6 months.",
  },
  {
    metal: "Silver Jewellery",
    care: "Silver tarnishes over time. Use a silver polishing cloth or silver cleaner. Store in anti-tarnish bags. Wear frequently - body oils help prevent tarnish.",
  },
  {
    metal: "Gemstone Jewellery",
    care: "Different gems require different care. Most can be cleaned with warm soapy water. Avoid ultrasonic cleaners for soft stones like pearls, opals, and emeralds. Consult your jeweler for specific care.",
  },
];

const CareGuide = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4">Jewellery Care Guide</h1>
          <p className="text-white/90 text-xl max-w-2xl mx-auto">
            Keep your precious Jewellery sparkling for generations
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Proper care ensures your Jewellery maintains its beauty and lasts a lifetime. Follow these
            guidelines to protect your investment and keep your treasures looking as stunning as the day
            you got them.
          </p>
        </div>
      </section>

      {/* Care Instructions */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {careInstructions.map((section, index) => (
            <div key={index} className="bg-card p-8 rounded-lg card-shadow">
              <section.icon className="h-12 w-12 text-accent mb-4" />
              <h2 className="font-display text-2xl mb-4 text-foreground">{section.title}</h2>
              <ul className="space-y-3">
                {section.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Metal-Specific Care */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl text-center mb-12 text-foreground">
            Metal-Specific Care
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {metalCare.map((item, index) => (
              <div key={index} className="bg-card p-6 rounded-lg card-shadow">
                <h3 className="font-display text-xl mb-3 text-foreground">{item.metal}</h3>
                <p className="text-muted-foreground">{item.care}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Services */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-card p-12 rounded-lg card-shadow text-center max-w-3xl mx-auto">
          <Shield className="h-16 w-16 text-accent mx-auto mb-6" />
          <h2 className="font-display text-3xl mb-4 text-foreground">Professional Services</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Bring your Jewellery to our store for professional cleaning, inspection, and maintenance.
            We offer complimentary cleaning services and can identify any issues before they become problems.
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md hover:bg-primary/90 transition-smooth font-medium"
          >
            Visit Our Store
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CareGuide;

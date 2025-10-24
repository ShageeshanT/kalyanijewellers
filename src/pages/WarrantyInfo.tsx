import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, CheckCircle, Clock, Award } from "lucide-react";

const warrantyFeatures = [
  {
    icon: Shield,
    title: "Lifetime Warranty",
    description: "All our Jewellery comes with a comprehensive lifetime warranty against manufacturing defects.",
  },
  {
    icon: CheckCircle,
    title: "Quality Guaranteed",
    description: "Every piece is inspected and certified to meet our exacting standards.",
  },
  {
    icon: Clock,
    title: "Free Repairs",
    description: "Complimentary repairs for any manufacturing defects during the warranty period.",
  },
  {
    icon: Award,
    title: "Certificate of Authenticity",
    description: "Each piece comes with a detailed certificate verifying materials and craftsmanship.",
  },
];

const coverageDetails = [
  {
    title: "What's Covered",
    items: [
      "Manufacturing defects in materials and workmanship",
      "Structural integrity of settings and clasps",
      "Stone security and prong integrity",
      "Chain and link failures",
      "Plating defects (first year)",
    ],
  },
  {
    title: "What's Not Covered",
    items: [
      "Normal wear and tear",
      "Loss or theft",
      "Damage from accidents or misuse",
      "Alterations by unauthorized jewelers",
      "Cosmetic scratches on metal surfaces",
    ],
  },
];

const WarrantyInfo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-5xl md:text-6xl text-foreground mb-4">Warranty Information</h1>
          <p className="text-foreground/90 text-xl max-w-2xl mx-auto">
            Your investment is protected with our comprehensive warranty
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            At New Kalyani Jewellers, we stand behind the quality of our craftsmanship. Every piece of
            Jewellery is backed by our comprehensive warranty, ensuring your complete satisfaction and peace
            of mind.
          </p>
        </div>
      </section>

      {/* Warranty Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {warrantyFeatures.map((feature, index) => (
            <div key={index} className="bg-card p-6 rounded-lg card-shadow text-center">
              <feature.icon className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="font-display text-xl mb-3 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Coverage Details */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl text-center mb-12 text-foreground">Coverage Details</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {coverageDetails.map((section, index) => (
              <div key={index} className="bg-card p-8 rounded-lg card-shadow">
                <h3 className="font-display text-2xl mb-6 text-foreground">{section.title}</h3>
                <ul className="space-y-4">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        index === 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {index === 0 ? '✓' : '×'}
                      </span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warranty Process */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-display text-4xl text-center mb-12 text-foreground">How to Use Your Warranty</h2>
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary font-bold text-lg">
              1
            </div>
            <div>
              <h3 className="font-display text-xl mb-2 text-foreground">Contact Us</h3>
              <p className="text-muted-foreground">
                Visit any of our branches or contact our customer service team with your concern.
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary font-bold text-lg">
              2
            </div>
            <div>
              <h3 className="font-display text-xl mb-2 text-foreground">Inspection</h3>
              <p className="text-muted-foreground">
                Our experts will inspect your Jewellery to determine if the issue is covered under warranty.
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary font-bold text-lg">
              3
            </div>
            <div>
              <h3 className="font-display text-xl mb-2 text-foreground">Repair or Replacement</h3>
              <p className="text-muted-foreground">
                If covered, we'll repair or replace your Jewellery at no additional cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Note */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="bg-card p-8 rounded-lg card-shadow max-w-3xl mx-auto">
            <h3 className="font-display text-2xl mb-4 text-foreground">Important Note</h3>
            <p className="text-muted-foreground mb-4">
              To maintain your warranty coverage, please retain your original purchase receipt and
              certificate of authenticity. Regular maintenance and inspections are recommended to ensure
              the longevity of your Jewellery.
            </p>
            <p className="text-muted-foreground">
              For any questions about your warranty, please contact us at{" "}
              <a href="tel:+918022345678" className="text-primary hover:underline">
                +91 80 2234 5678
              </a>{" "}
              or visit any of our branches.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WarrantyInfo;

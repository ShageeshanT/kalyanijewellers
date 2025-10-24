import { Shield, Sparkles, Award, DollarSign } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Lifetime Warranty",
    description: "Complete peace of mind with our comprehensive lifetime warranty on all Jewellery pieces",
  },
  {
    icon: Sparkles,
    title: "Custom Design Services",
    description: "Collaborate with our master craftsmen to create your unique, one-of-a-kind Jewellery",
  },
  {
    icon: Award,
    title: "Certified Gems",
    description: "Every gemstone is certified and sourced ethically from trusted suppliers worldwide",
  },
  {
    icon: DollarSign,
    title: "Affordable Pricing",
    description: "Luxury doesn't have to break the bank. Transparent pricing with no hidden costs",
  },
];

const TrustBadges = () => {
  return (
    <section className="py-20 px-4 gradient-hero">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-6 group-hover:scale-110 transition-elegant card-shadow">
                  <Icon className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-display font-semibold text-card mb-3">
                  {feature.title}
                </h3>
                <p className="text-card/80 font-body">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;

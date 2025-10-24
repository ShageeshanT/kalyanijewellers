import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Ruler, Hand, Circle } from "lucide-react";

const ringSizes = [
  { us: "5", india: "10", diameter: "15.7mm", circumference: "49.3mm" },
  { us: "6", india: "12", diameter: "16.5mm", circumference: "51.9mm" },
  { us: "7", india: "14", diameter: "17.3mm", circumference: "54.4mm" },
  { us: "8", india: "16", diameter: "18.2mm", circumference: "57.0mm" },
  { us: "9", india: "18", diameter: "19.0mm", circumference: "59.5mm" },
  { us: "10", india: "20", diameter: "19.8mm", circumference: "62.1mm" },
];

const bangleSizes = [
  { size: "2.2", circumference: "7.0 inches", fitFor: "Small wrist" },
  { size: "2.4", circumference: "7.5 inches", fitFor: "Medium wrist" },
  { size: "2.6", circumference: "8.0 inches", fitFor: "Large wrist" },
  { size: "2.8", circumference: "8.5 inches", fitFor: "Extra large wrist" },
];

const measuringTips = [
  {
    icon: Ruler,
    title: "Use a Ring Sizer",
    description: "Visit any of our branches for a professional ring sizing using our calibrated ring sizers.",
  },
  {
    icon: Hand,
    title: "Measure at the Right Time",
    description: "Measure your finger at the end of the day when it's warmest and slightly larger.",
  },
  {
    icon: Circle,
    title: "Consider Ring Width",
    description: "Wider bands require a larger size. If buying a wide band, go up half a size.",
  },
];

const SizingGuide = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-5xl md:text-6xl text-foreground mb-4">Sizing Guide</h1>
          <p className="text-foreground/90 text-xl max-w-2xl mx-auto">
            Find your perfect fit with our comprehensive sizing guide
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Getting the right size is essential for comfort and security. Use this guide to find your
            perfect fit, or visit any of our branches for professional sizing assistance.
          </p>
        </div>
      </section>

      {/* Measuring Tips */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-display text-4xl text-center mb-12 text-foreground">Measuring Tips</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {measuringTips.map((tip, index) => (
            <div key={index} className="bg-card p-6 rounded-lg card-shadow text-center">
              <tip.icon className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="font-display text-xl mb-3 text-foreground">{tip.title}</h3>
              <p className="text-sm text-muted-foreground">{tip.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ring Size Chart */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl text-center mb-12 text-foreground">Ring Size Chart</h2>
          <div className="max-w-4xl mx-auto bg-card rounded-lg card-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary text-primary-foreground">
                  <tr>
                    <th className="px-6 py-4 text-left font-display">US Size</th>
                    <th className="px-6 py-4 text-left font-display">India Size</th>
                    <th className="px-6 py-4 text-left font-display">Diameter</th>
                    <th className="px-6 py-4 text-left font-display">Circumference</th>
                  </tr>
                </thead>
                <tbody>
                  {ringSizes.map((size, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="px-6 py-4">{size.us}</td>
                      <td className="px-6 py-4">{size.india}</td>
                      <td className="px-6 py-4">{size.diameter}</td>
                      <td className="px-6 py-4">{size.circumference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Bangle Size Chart */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-display text-4xl text-center mb-12 text-foreground">Bangle Size Chart</h2>
        <div className="max-w-4xl mx-auto bg-card rounded-lg card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="px-6 py-4 text-left font-display">Size</th>
                  <th className="px-6 py-4 text-left font-display">Circumference</th>
                  <th className="px-6 py-4 text-left font-display">Best For</th>
                </tr>
              </thead>
              <tbody>
                {bangleSizes.map((size, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="px-6 py-4">{size.size}</td>
                    <td className="px-6 py-4">{size.circumference}</td>
                    <td className="px-6 py-4">{size.fitFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How to Measure at Home */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl text-center mb-12 text-foreground">
            How to Measure at Home
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-card p-8 rounded-lg card-shadow">
              <h3 className="font-display text-2xl mb-4 text-foreground">Ring Size</h3>
              <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
                <li>Take a piece of string or paper strip</li>
                <li>Wrap it around the base of your finger</li>
                <li>Mark where the string/paper overlaps</li>
                <li>Measure the length in millimeters</li>
                <li>Use the circumference column in our chart to find your size</li>
              </ol>
            </div>

            <div className="bg-card p-8 rounded-lg card-shadow">
              <h3 className="font-display text-2xl mb-4 text-foreground">Bangle Size</h3>
              <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
                <li>Bring your thumb and little finger together</li>
                <li>Measure around the widest part of your hand</li>
                <li>Add 1 inch to this measurement</li>
                <li>Match the result to our bangle size chart</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Sizing */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-card p-12 rounded-lg card-shadow text-center max-w-3xl mx-auto">
          <Ruler className="h-16 w-16 text-accent mx-auto mb-6" />
          <h2 className="font-display text-3xl mb-4 text-foreground">Professional Sizing</h2>
          <p className="text-lg text-muted-foreground mb-8">
            For the most accurate sizing, visit any of our branches. Our experts will measure your finger
            professionally and help you find the perfect fit.
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md hover:bg-primary/90 transition-smooth font-medium"
          >
            Find a Store Near You
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SizingGuide;

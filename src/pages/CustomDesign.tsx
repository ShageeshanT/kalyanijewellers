import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MessageCircle, Pencil, CheckCircle, Sparkles, Heart, Award } from "lucide-react";
import { toast } from "sonner";
import customDesignHero from "@/assets/custom-design-hero.jpg";
import customProcess1 from "@/assets/custom-process.jpg";
import customProcess2 from "@/assets/custom-process1.jpg";
import customProcess3 from "@/assets/custom-process3.jpg";
import axiosInstance from '@/lib/axios';

interface Metal {
  metalId: number;
  metalType: string;
  metalPurity: string;
}

const steps = [
  {
    icon: MessageCircle,
    title: "Consultation",
    description: "Share your ideas with our expert designers",
    image: customProcess1,
  },
  {
    icon: Pencil,
    title: "Design & Sketch",
    description: "We create detailed sketches and 3D renderings",
    image: customProcess2,
  },
  {
    icon: CheckCircle,
    title: "Approval & Crafting",
    description: "Approve design and our craftsmen begin work",
    image: customProcess3,
  },
];

const designOptions = [
  { title: "Engagement Rings", description: "Unique symbols of your love" },
  { title: "Wedding Bands", description: "Perfect pairs for your special day" },
  { title: "Anniversary Gifts", description: "Celebrate milestones together" },
  { title: "Family Heirlooms Redesign", description: "Breathe new life into treasured pieces" },
  { title: "Corporate Gifts", description: "Elegant business tokens" },
  { title: "Personal Signature Pieces", description: "Express your unique style" },
];

const CustomDesign = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    budget: "",
    preferredMetalId: "none",
  });
  const [designImages, setDesignImages] = useState<File[]>([]);
  const [metals, setMetals] = useState<Metal[]>([]);
  const [metalsLoading, setMetalsLoading] = useState(true);

  // Fetch metals from backend
  useEffect(() => {
    const fetchMetals = async () => {
      try {
        setMetalsLoading(true);
        console.log('Fetching metals from /api/metals...');
        const response = await axiosInstance.get('/api/metals');
        console.log('Metals response:', response.data);
        setMetals(response.data);
        console.log('Metals loaded successfully:', response.data.length, 'metals');
      } catch (error) {
        console.error('Error fetching metals:', error);
        console.error('Error details:', error);
        toast.error('Failed to load metal options. Please refresh the page.');
      } finally {
        setMetalsLoading(false);
      }
    };

    fetchMetals();
  }, []);





const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (designImages.length === 0) {
    toast.error("Please upload one design image");
    return;
  }

  try {
    const reader = new FileReader();
    reader.readAsDataURL(designImages[0]); // reads file as base64
    reader.onload = async () => {
      let base64String = reader.result as string;
      // optional: remove "data:image/png;base64," prefix if needed
      const commaIndex = base64String.indexOf(',');
      if (commaIndex > -1) {
        base64String = base64String.substring(commaIndex + 1);
      }

      const payload = {
        assignedUserId: null,
        customerFname: formData.firstName.trim(),
        customerLname: formData.lastName.trim(),
        email: formData.email.trim(),
        contactNumber: formData.contactNo.trim(),
        budget: formData.budget ? Number(formData.budget) : null,
        image: base64String, // send just the base64 content
        ticketDate: new Date().toISOString(),
        status: "NEW",
        preferredMetalId: formData.preferredMetalId && formData.preferredMetalId !== "none" ? Number(formData.preferredMetalId) : null,
      };

      const response = await axiosInstance.post(
        "/api/customdesign/create",
        payload
      );

      console.log(response.data);
      toast.success("Your custom design request was submitted successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        contactNo: "",
        budget: "",
        preferredMetalId: "none",
      });
      setDesignImages([]);
    };
  } catch (error) {
    console.error(error);
    toast.error("Failed to submit design request. Please try again.");
  }
}















  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + designImages.length > 3) {
        toast.error("Maximum 3 images allowed");
        return;
      }
      setDesignImages([...designImages, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setDesignImages(designImages.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <img src={customDesignHero} alt="Custom Design" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-6 animate-fade-in">
            Custom Jewelry Design
          </h1>
          <p className="text-white/90 text-xl md:text-2xl max-w-2xl mb-8 animate-fade-in">
            Bring your vision to life
          </p>
          <Button size="lg" variant="hero" className="animate-fade-in" onClick={() => document.getElementById('design-form')?.scrollIntoView({ behavior: 'smooth' })}>
            Start Your Design Journey
          </Button>
        </div>
      </section>

      {/* Introduction */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-4xl mb-6 text-foreground">Create Something Extraordinary</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Our custom design service allows you to create a truly unique piece of jewelry that reflects your personal
            style and story. From engagement rings to statement necklaces, our expert craftsmen bring your dreams to
            reality.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            With decades of experience and access to the finest materials, we transform your ideas into timeless
            treasures that will be cherished for generations.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl text-center mb-12 text-foreground">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center animate-fade-in">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 text-6xl font-bold text-accent/20">
                    {index + 1}
                  </div>
                </div>
                <h3 className="font-display text-2xl mb-3 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground mb-6">{step.description}</p>
                <div className="overflow-hidden rounded-lg">
                  <img src={step.image} alt={step.title} className="w-full h-48 object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Design Options */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-display text-4xl text-center mb-12 text-foreground">What We Can Create</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designOptions.map((option, index) => (
            <div key={index} className="bg-card p-6 rounded-lg card-shadow hover:hover-shadow transition-smooth">
              <Sparkles className="h-8 w-8 text-accent mb-3" />
              <h3 className="font-display text-xl mb-2 text-foreground">{option.title}</h3>
              <p className="text-muted-foreground">{option.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Request Form */}
      <section id="design-form" className="bg-muted py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-display text-4xl text-center mb-4 text-foreground">Request Custom Design</h2>
          <p className="text-center text-muted-foreground mb-12">Fill out the form below and we'll get back to you within 24 hours</p>

          <form onSubmit={handleSubmit} className="bg-card p-8 rounded-lg card-shadow space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input 
                  id="firstName" 
                  required 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input 
                  id="lastName" 
                  required 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              />
            </div>

            <div>
              <Label htmlFor="contactNo">Contact Number *</Label>
              <Input 
                id="contactNo" 
                type="tel" 
                required 
                value={formData.contactNo} 
                onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })} 
              />
            </div>

            <div>
              <Label htmlFor="budget">Budget (Optional)</Label>
              <Input 
                id="budget" 
                placeholder="e.g., LKR 50,000"
                value={formData.budget} 
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })} 
              />
            </div>

            <div>
              <Label htmlFor="preferredMetal">Preferred Metal Type (Optional)</Label>
              <Select 
                value={formData.preferredMetalId} 
                onValueChange={(value) => setFormData({ ...formData, preferredMetalId: value })}
                disabled={metalsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    metalsLoading 
                      ? "Loading metal options..." 
                      : metals.length === 0 
                        ? "No metal options available" 
                        : "Select your preferred metal type"
                  } />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None selected</SelectItem>
                  {metals.map((metal) => (
                    <SelectItem key={metal.metalId} value={metal.metalId.toString()}>
                      {metal.metalType} - {metal.metalPurity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-2">
                {metalsLoading 
                  ? "Loading available metal types..." 
                  : metals.length === 0 
                    ? "No metal options are currently available" 
                    : `Choose your preferred metal type for the custom design (${metals.length} options available)`
                }
              </p>
            </div>

            <div>
              <Label htmlFor="images">Design Image (Max 1) *</Label>
              <Input 
                id="images" 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Upload reference images for your custom design
              </p>
              {designImages.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {designImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Design ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full">
              Submit Design Request
            </Button>
          </form>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <Award className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="font-display text-2xl mb-2 text-foreground">25+ Years Experience</h3>
            <p className="text-muted-foreground">Master craftsmen with decades of expertise</p>
          </div>
          <div>
            <Heart className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="font-display text-2xl mb-2 text-foreground">5000+ Custom Pieces</h3>
            <p className="text-muted-foreground">Thousands of dreams brought to life</p>
          </div>
          <div>
            <Sparkles className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="font-display text-2xl mb-2 text-foreground">100% Satisfaction</h3>
            <p className="text-muted-foreground">We perfect every detail until you're delighted</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CustomDesign;

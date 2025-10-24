import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { apiClient, Branch } from "@/lib/api";
import { Link } from "react-router-dom";

const Contact = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // Load branches from API
  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getAllBranches();
      setBranches(data);
    } catch (error: any) {
      console.error('Failed to load branches:', error);
      // Fallback to empty array if API fails - this is a public page so we don't show error toasts
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 text-center">
        <div className="container mx-auto px-4 mt-10">
          <h1 className="font-display text-5xl md:text-6xl text-foreground mb-4">Contact Us</h1>
          <p className="text-foreground/90 text-xl">We're here to help</p>
        </div>       
      </section>

      {/* Contact Information Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Head Office */}
          <div className="bg-card p-8 rounded-lg card-shadow">
            <MapPin className="h-10 w-10 text-accent mb-4" />
            <h3 className="font-display text-2xl mb-4 text-foreground">Head Office</h3>
            <div className="space-y-3 text-muted-foreground">
              <p className="flex items-start gap-2">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-1" />
                <span>475/A Kaduwela Road, Sri Jayawardenepura Kotte, Colombo 560001</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a href="tel:+941122571482" className="hover:text-accent transition-smooth">
                +94 112 257 1482
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a href="mailto:info@kalyani.com" className="hover:text-accent transition-smooth">
                  info@kalyani.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 flex-shrink-0" />
                <a href="https://wa.me/94767888657" className="hover:text-accent transition-smooth">
                  +94 76 788 8657
                </a>
              </p>
              <p className="flex items-start gap-2">
                <Clock className="h-5 w-5 flex-shrink-0 mt-1" />
                <span>Mon-Sat: 10:00 AM - 8:00 PM<br />Sun: 11:00 AM - 6:00 PM</span>
              </p>
            </div>
          </div>

          {/* Customer Service */}
          <div className="bg-card p-8 rounded-lg card-shadow">
            <Phone className="h-10 w-10 text-accent mb-4" />
            <h3 className="font-display text-2xl mb-4 text-foreground">Customer Service</h3>
            <div className="space-y-3 text-muted-foreground">
              <p className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a href="tel:+941122571482" className="hover:text-accent transition-smooth">
                +94 112 257 1482
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a href="mailto:support@kalyani.com" className="hover:text-accent transition-smooth">
                  support@kalyani.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 flex-shrink-0" />
                <a href="https://wa.me/94767888657" className="hover:text-accent transition-smooth">
                  +94 76 788 8657 (WhatsApp)
                </a>
              </p>
              <p className="flex items-start gap-2">
                <Clock className="h-5 w-5 flex-shrink-0 mt-1" />
                <span>Available: Mon-Sat, 9:00 AM - 7:00 PM</span>
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
         <div className="max-w-3xl mx-auto">
          <div className="bg-card p-8 rounded-lg card-shadow">
            <h2 className="font-display text-3xl mb-6 text-center text-foreground">Send Us a Message</h2>
            {/* <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
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
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  rows={6}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <Button type="submit" size="lg" className="w-full">
                Send Message
              </Button>
            </form> */}
            
            {/* Request Service Button */}
            <div className="mt-6 text-center">
              <Link to="/jewellery-repairs">
                <Button variant="outline" size="lg" className="w-full">
                  Request a Service
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Branch Locations */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl text-center mb-12 text-foreground">Our Locations</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-muted-foreground">Loading branches...</div>
            </div>
          ) : branches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No branches available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((branch) => (
                <div key={branch.branchId} className="bg-card p-6 rounded-lg card-shadow">
                  <h3 className="font-display text-xl mb-4 text-foreground">{branch.branchName}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 flex-shrink-0 mt-1" />
                      <span>{branch.branchAddress}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <a href={`tel:${branch.branchTelephone}`} className="hover:text-accent transition-smooth">
                        {branch.branchTelephone}
                      </a>
                    </p>
                    <p className="flex items-start gap-2">
                      <Clock className="h-4 w-4 flex-shrink-0 mt-1" />
                      <span className="text-xs">{branch.branchHours}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;

import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Wrench } from "lucide-react";
import axiosInstance from '@/lib/axios';


const JewelleryRepairs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    serviceType: "",
    preferredDate: "",
    note: "",
    type: ""
  });




const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const payload = {
      customerFname: formData.firstName.trim(),
      customerLname: formData.lastName.trim(),
      email: formData.email.trim(),
      contactNumber: formData.contactNumber.trim(),
      preferredDate: new Date().toISOString(),
      note: formData.note.trim(),
      type: formData.serviceType
    };

    const response = await axiosInstance.post(
      "/api/serviceticket/create",
      payload
    );

    console.log(response.data);
  
    toast.success("Repair request submitted successfully! We'll contact you soon.");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      serviceType: "",
      preferredDate: "",
      note: "",
      type: ""
    });
  } catch (error) {
    console.error(error);
    toast.error("Failed to submit request. Please try again.");
  }
}

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Wrench className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            Service Ticket
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our expert craftsmen can restore your precious pieces to their original beauty. 
            Fill out the form below and we'll get back to you within 24 hours.
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-8 md:p-12 card-shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  type="tel"
                  required
                  value={formData.contactNumber}
                  onChange={(e) => handleChange("contactNumber", e.target.value)}
                  placeholder="+91 12345 67890"
                />
              </div>
            </div>

            {/* Service Type */}
            <div>
              <Label htmlFor="serviceType">Service Type *</Label>
              <Select value={formData.serviceType} onValueChange={(value) => handleChange("serviceType", value)} required>
                <SelectTrigger id="serviceType">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLEANING">cleaning</SelectItem>
                  <SelectItem value="REPAIR">repair</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preferred Date */}
            <div>
              <Label htmlFor="preferredDate">Preferred Date (Optional)</Label>
              <Input
                id="preferredDate"
                type="date"
                value={formData.preferredDate}
                onChange={(e) => handleChange("preferredDate", e.target.value)}
              />
            </div>

            {/* Note */}
            <div>
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => handleChange("note", e.target.value)}
                placeholder="Please describe the issue or repair needed..."
                rows={5}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" size="lg" className="w-full">
              Submit Repair Request
            </Button>
          </form>
        </Card>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              Expert Craftsmen
            </h3>
            <p className="text-sm text-muted-foreground">
              30+ years of experience in jewelry repair and restoration
            </p>
          </div>
          <div className="p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              Quality Guarantee
            </h3>
            <p className="text-sm text-muted-foreground">
              All repairs come with a 6-month workmanship warranty
            </p>
          </div>
          <div className="p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              Quick Turnaround
            </h3>
            <p className="text-sm text-muted-foreground">
              Most repairs completed within 7-10 business days
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default JewelleryRepairs;

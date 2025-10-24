import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { GemDTO } from "@/lib/api";

interface GemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  initialData?: GemDTO;
}

export default function GemFormModal({ isOpen, onClose, onSubmit, initialData }: GemFormModalProps) {
  const [gemName, setGemName] = useState("");
  const [karatRate, setKaratRate] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setGemName(initialData.name);
      setKaratRate(initialData.price?.toString() || "");
      setImage(null);
    } else {
      setGemName("");
      setKaratRate("");
      setImage(null);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('gemName', gemName.trim());
    
    if (karatRate.trim()) {
      formData.append('karatRate', karatRate.trim());
    }
    
    if (image) {
      formData.append('image', image);
    }
    
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">
            {initialData ? "Edit Gem" : "Add New Gem"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <Label htmlFor="gemName">Gem Name *</Label>
            <Input
              id="gemName"
              value={gemName}
              onChange={(e) => setGemName(e.target.value)}
              placeholder="e.g., Ruby, Diamond, Emerald"
              required
            />
          </div>

          <div>
            <Label htmlFor="karatRate">Price/Rate (Optional)</Label>
            <Input
              id="karatRate"
              type="number"
              step="0.01"
              value={karatRate}
              onChange={(e) => setKaratRate(e.target.value)}
              placeholder="e.g., 5000.00"
            />
            <p className="text-xs text-muted-foreground mt-1">Price per unit or karat rate</p>
          </div>

          <div>
            <Label htmlFor="image">Gem Image (Optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImage(file);
                }
              }}
            />
            {image && (
              <p className="text-xs text-muted-foreground mt-1">
                Selected: {image.name}
              </p>
            )}
          </div>

          <div className="flex justify-start gap-3 pt-4">
            <Button type="submit" className="bg-[--gold-0] hover:bg-[--gold-1] text-[--bg-0]">
              {initialData ? "Update Gem" : "Create Gem"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Export for backward compatibility
export type GemFormData = FormData;

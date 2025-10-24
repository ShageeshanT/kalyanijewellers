import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MetalFormData {
  metalType: string;
  metalPurity: string;
}

interface MetalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (metalType: string, metalPurity: string) => void;
  initialData?: MetalFormData;
}

export default function MetalFormModal({ isOpen, onClose, onSubmit, initialData }: MetalFormModalProps) {
  const [formData, setFormData] = useState<MetalFormData>({
    metalType: "",
    metalPurity: ""
  });
  const [errors, setErrors] = useState<Partial<Record<keyof MetalFormData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        metalType: "",
        metalPurity: ""
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof MetalFormData, string>> = {};

    if (!formData.metalType) newErrors.metalType = "Metal type is required";
    if (!formData.metalPurity.trim()) newErrors.metalPurity = "Metal purity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData.metalType, formData.metalPurity.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">
            {initialData ? "Edit Metal" : "Add New Metal"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <Label htmlFor="metalType">Metal Type *</Label>
            <Select 
              value={formData.metalType} 
              onValueChange={(value) => setFormData({ ...formData, metalType: value })}
            >
              <SelectTrigger className={errors.metalType ? "border-destructive" : ""}>
                <SelectValue placeholder="Select metal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GOLD">Gold</SelectItem>
                <SelectItem value="SILVER">Silver</SelectItem>
                <SelectItem value="ROSE_GOLD">Rose Gold</SelectItem>
              </SelectContent>
            </Select>
            {errors.metalType && <p className="text-xs text-destructive mt-1">{errors.metalType}</p>}
          </div>

          <div>
            <Label htmlFor="metalPurity">Metal Purity *</Label>
            <Input
              id="metalPurity"
              value={formData.metalPurity}
              onChange={(e) => setFormData({ ...formData, metalPurity: e.target.value })}
              placeholder="e.g., 24K, 18K, 925, PT950"
              className={errors.metalPurity ? "border-destructive" : ""}
            />
            {errors.metalPurity && <p className="text-xs text-destructive mt-1">{errors.metalPurity}</p>}
          </div>

          <div className="flex justify-start gap-3 pt-4">
            <Button type="submit" className="bg-[--gold-0] hover:bg-[--gold-1] text-[--bg-0]">
              {initialData ? "Update Metal" : "Create Metal"}
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

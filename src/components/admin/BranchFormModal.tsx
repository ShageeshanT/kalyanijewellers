import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Branch } from "@/lib/api";

interface BranchFormData {
  branchName: string;
  branchCode: string;
  branchAddress: string;
  branchTelephone: string;
  branchHours: string;
}

interface BranchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BranchFormData) => void;
  initialData?: Branch;
}

export default function BranchFormModal({ isOpen, onClose, onSubmit, initialData }: BranchFormModalProps) {
  const [formData, setFormData] = useState<BranchFormData>({
    branchName: "",
    branchCode: "",
    branchAddress: "",
    branchTelephone: "",
    branchHours: "Mon-Sat: 10AM-8PM, Sun: Closed"
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BranchFormData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        branchName: initialData.branchName,
        branchCode: initialData.branchCode,
        branchAddress: initialData.branchAddress,
        branchTelephone: initialData.branchTelephone,
        branchHours: initialData.branchHours
      });
    } else {
      setFormData({
        branchName: "",
        branchCode: "",
        branchAddress: "",
        branchTelephone: "",
        branchHours: "Mon-Sat: 10AM-8PM, Sun: Closed"
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof BranchFormData, string>> = {};

    if (!formData.branchName.trim()) newErrors.branchName = "Branch name is required";
    if (!formData.branchAddress.trim()) newErrors.branchAddress = "Address is required";
    if (!formData.branchCode.trim()) newErrors.branchCode = "Branch code is required";
    if (!formData.branchTelephone.trim()) newErrors.branchTelephone = "Phone number is required";
    if (!formData.branchHours.trim()) newErrors.branchHours = "Operating hours are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">
            {initialData ? "Edit Branch" : "Add New Branch"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="branchName">Branch Name *</Label>
              <Input
                id="branchName"
                value={formData.branchName}
                onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                placeholder="New Kalyani Jewellers - Location"
                className={errors.branchName ? "border-destructive" : ""}
              />
              {errors.branchName && <p className="text-xs text-destructive mt-1">{errors.branchName}</p>}
            </div>

            <div>
              <Label htmlFor="branchCode">Branch Code *</Label>
              <Input
                id="branchCode"
                value={formData.branchCode}
                onChange={(e) => setFormData({ ...formData, branchCode: e.target.value })}
                placeholder="NK-MUM-01"
                className={errors.branchCode ? "border-destructive" : ""}
              />
              {errors.branchCode && <p className="text-xs text-destructive mt-1">{errors.branchCode}</p>}
            </div>

            <div>
              <Label htmlFor="branchTelephone">Phone Number *</Label>
              <Input
                id="branchTelephone"
                value={formData.branchTelephone}
                onChange={(e) => setFormData({ ...formData, branchTelephone: e.target.value })}
                placeholder="+91 22 1234 5678"
                className={errors.branchTelephone ? "border-destructive" : ""}
              />
              {errors.branchTelephone && <p className="text-xs text-destructive mt-1">{errors.branchTelephone}</p>}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="branchAddress">Address *</Label>
              <Input
                id="branchAddress"
                value={formData.branchAddress}
                onChange={(e) => setFormData({ ...formData, branchAddress: e.target.value })}
                placeholder="123 Main Street, City, State, Country"
                className={errors.branchAddress ? "border-destructive" : ""}
              />
              {errors.branchAddress && <p className="text-xs text-destructive mt-1">{errors.branchAddress}</p>}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="branchHours">Operating Hours *</Label>
              <Input
                id="branchHours"
                value={formData.branchHours}
                onChange={(e) => setFormData({ ...formData, branchHours: e.target.value })}
                placeholder="Mon-Sat: 10AM-8PM, Sun: Closed"
                className={errors.branchHours ? "border-destructive" : ""}
              />
              {errors.branchHours && <p className="text-xs text-destructive mt-1">{errors.branchHours}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="hero">
              {initialData ? "Update Branch" : "Add Branch"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

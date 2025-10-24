import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RoleFormData {
  name: string;
  description: string;
  color: string;
  permissions: string[];
}

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RoleFormData) => void;
  initialData?: RoleFormData;
}

const AVAILABLE_PERMISSIONS = {
  "Branch Management": ["view_branches", "add_branches", "edit_branches", "delete_branches"],
  "Product Management": ["view_products", "add_products", "edit_products", "delete_products", "publish_products"],
  "Customer Requests": ["view_all_requests", "view_assigned_requests", "accept_reject_requests", "respond_requests"],
  "Review Management": ["view_reviews", "approve_reviews", "reject_reviews", "delete_reviews"],
  "User Management": ["view_users", "add_users", "edit_users", "delete_users", "manage_roles"],
};

export default function RoleFormModal({ isOpen, onClose, onSubmit, initialData }: RoleFormModalProps) {
  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    description: "",
    color: "#2F4156",
    permissions: []
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RoleFormData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        description: "",
        color: "#2F4156",
        permissions: []
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof RoleFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = "Role name is required";
    if (formData.permissions.length === 0) newErrors.permissions = "Select at least one permission";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const togglePermission = (permission: string) => {
    setFormData({
      ...formData,
      permissions: formData.permissions.includes(permission)
        ? formData.permissions.filter(p => p !== permission)
        : [...formData.permissions, permission]
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">
            {initialData ? "Edit Role" : "Create New Role"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Role Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Store Manager"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="color">Role Color</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#2F4156"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this role's responsibilities..."
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Permissions *</Label>
              {errors.permissions && <p className="text-xs text-destructive mt-1">{errors.permissions}</p>}
            </div>

            {Object.entries(AVAILABLE_PERMISSIONS).map(([category, perms]) => (
              <div key={category} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-sm">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {perms.map((perm) => (
                    <div key={perm} className="flex items-center space-x-2">
                      <Checkbox
                        id={perm}
                        checked={formData.permissions.includes(perm)}
                        onCheckedChange={() => togglePermission(perm)}
                      />
                      <label
                        htmlFor={perm}
                        className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {perm.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="hero">
              {initialData ? "Update Role" : "Create Role"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

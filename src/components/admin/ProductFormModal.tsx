import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { CategoryDTO, MetalDTO, GemDTO, ProductDTO } from "@/lib/api";
import axios from "@/lib/axios";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  initialData?: ProductDTO;
}

export default function ProductFormModal({ isOpen, onClose, onSubmit, initialData }: ProductFormModalProps) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [metalId, setMetalId] = useState("");
  const [weight, setWeight] = useState("");
  const [initialProductionCost, setInitialProductionCost] = useState("");
  const [quantity, setQuantity] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [size, setSize] = useState("");
  const [hasGemstone, setHasGemstone] = useState(false);
  const [selectedGems, setSelectedGems] = useState<number[]>([]);
  const [images, setImages] = useState<FileList | null>(null);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get<CategoryDTO[]>('/api/categories');
      return response.data;
    }
  });

  // Fetch metals
  const { data: metals = [] } = useQuery({
    queryKey: ['metals'],
    queryFn: async () => {
      const response = await axios.get<MetalDTO[]>('/api/metals');
      return response.data;
    }
  });

  // Fetch gems
  const { data: gems = [] } = useQuery({
    queryKey: ['gems'],
    queryFn: async () => {
      const response = await axios.get<GemDTO[]>('/api/gems');
      return response.data;
    }
  });

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategoryId(initialData.category.categoryId.toString());
      setMetalId(initialData.metal.metalId.toString());
      setWeight(initialData.weight.toString());
      setInitialProductionCost(initialData.initialProductionCost.toString());
      setQuantity(initialData.quantity.toString());
      setProductDescription(initialData.productDescription);
      setSize(initialData.size || "");
      setHasGemstone(initialData.hasGemstone);
      setSelectedGems(initialData.gems.map(g => g.gemId));
      setImages(null);
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const resetForm = () => {
    setName("");
    setCategoryId("");
    setMetalId("");
    setWeight("");
    setInitialProductionCost("");
    setQuantity("");
    setProductDescription("");
    setSize("");
    setHasGemstone(false);
    setSelectedGems([]);
    setImages(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('categoryId', categoryId);
    formData.append('metalId', metalId);
    formData.append('weight', weight);
    formData.append('initialProductionCost', initialProductionCost);
    formData.append('quantity', quantity);
    formData.append('productDescription', productDescription.trim());
    
    if (size.trim()) {
      formData.append('size', size.trim());
    }
    
    formData.append('hasGemstone', hasGemstone.toString());
    
    if (hasGemstone && selectedGems.length > 0) {
      formData.append('gemIds', selectedGems.join(','));
    }
    
    if (images) {
      Array.from(images).forEach((file) => {
        formData.append('images', file);
      });
    }
    
    onSubmit(formData);
  };

  const toggleGem = (gemId: number) => {
    setSelectedGems(prev =>
      prev.includes(gemId)
        ? prev.filter(id => id !== gemId)
        : [...prev, gemId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">
            {initialData ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="md:col-span-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Diamond Ring"
                required
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.categoryId} value={category.categoryId.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Metal */}
            <div>
              <Label htmlFor="metal">Metal Type *</Label>
              <Select value={metalId} onValueChange={setMetalId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select metal" />
                </SelectTrigger>
                <SelectContent>
                  {metals.map((metal) => (
                    <SelectItem key={metal.metalId} value={metal.metalId.toString()}>
                      {metal.metalType} - {metal.metalPurity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Weight */}
            <div>
              <Label htmlFor="weight">Weight (grams) *</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g., 15.5"
                required
              />
            </div>

            {/* Size */}
            <div>
              <Label htmlFor="size">Size (Optional)</Label>
              <Input
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g., 7, Medium"
              />
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="price">Price (LKR) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={initialProductionCost}
                onChange={(e) => setInitialProductionCost(e.target.value)}
                placeholder="e.g., 50000"
                required
              />
            </div>

            {/* Quantity */}
            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g., 10"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label htmlFor="description">Product Description *</Label>
              <Textarea
                id="description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Detailed product description..."
                rows={3}
                required
              />
            </div>

            {/* Has Gemstone Checkbox */}
            <div className="md:col-span-2 flex items-center space-x-2">
              <Checkbox
                id="hasGemstone"
                checked={hasGemstone}
                onCheckedChange={(checked) => setHasGemstone(checked as boolean)}
              />
              <Label htmlFor="hasGemstone" className="cursor-pointer">
                This product has gemstones
              </Label>
            </div>

            {/* Gem Selection */}
            {hasGemstone && (
              <div className="md:col-span-2">
                <Label>Select Gemstones</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 p-4 border rounded-lg max-h-40 overflow-y-auto">
                  {gems.map((gem) => (
                    <div key={gem.gemId} className="flex items-center space-x-2">
                      <Checkbox
                        id={`gem-${gem.gemId}`}
                        checked={selectedGems.includes(gem.gemId)}
                        onCheckedChange={() => toggleGem(gem.gemId)}
                      />
                      <Label htmlFor={`gem-${gem.gemId}`} className="cursor-pointer text-sm">
                        {gem.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div className="md:col-span-2">
              <Label htmlFor="images">Product Images</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImages(e.target.files)}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-1">
                You can select multiple images
              </p>
            </div>
          </div>

          <div className="flex justify-start gap-3 pt-4">
            <Button type="submit" className="bg-[--gold-0] hover:bg-[--gold-1] text-[--bg-0]">
              {initialData ? "Update Product" : "Create Product"}
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
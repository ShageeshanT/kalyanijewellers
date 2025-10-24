import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ProductFormModal from "@/components/admin/ProductFormModal";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import { ProductDTO } from "@/lib/api";
import axios from "@/lib/axios";

export default function ProductManagement() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDTO | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductDTO | null>(null);

  // Fetch products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axios.get<ProductDTO[]>('/api/products');
      return response.data;
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post<ProductDTO>('/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success("Product added successfully");
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || "Failed to add product";
      toast.error(`Error: ${errorMessage}`);
      console.error('Create product error:', error);
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      const response = await axios.put<ProductDTO>(`/api/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success("Product updated successfully");
      setEditingProduct(null);
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || "Failed to update product";
      toast.error(`Error: ${errorMessage}`);
      console.error('Update product error:', error);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.delete(`/api/products/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success("Product deleted successfully");
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || "Failed to delete product";
      toast.error(`Error: ${errorMessage}`);
      console.error('Delete product error:', error);
    }
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category.categoryId.toString() === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = (formData: FormData) => {
    createMutation.mutate(formData);
  };

  const handleEditProduct = (formData: FormData) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.productId, formData });
    }
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete.productId);
    }
  };

  // Extract unique categories from products for filter
  const uniqueCategories = Array.from(
    new Map(products.map(p => [p.category.categoryId, p.category])).values()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Product Catalog</h1>
          <p className="text-muted-foreground mt-1">Manage jewellery products and collections</p>
        </div>
        <Button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} size="lg" variant="hero">
          <Plus className="mr-2 h-5 w-5" />
          Add New Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {uniqueCategories.map((cat) => (
              <SelectItem key={cat.categoryId} value={cat.categoryId.toString()}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-muted-foreground">Loading products...</div>
        </div>
      )}

      {/* Product Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.productId} className="overflow-hidden card-shadow hover:elegant-shadow transition-all group">
              <div className="aspect-square relative overflow-hidden bg-muted">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <span className="text-4xl font-display text-primary/50">{product.name.charAt(0)}</span>
                  </div>
                )}
                <span className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-primary/90 text-white">
                  {product.metal.metalType}
                </span>
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category.name}</p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{product.weight}g</span>
                  <span className="text-muted-foreground">Qty: {product.quantity}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold text-lg text-primary">
                    LKR {product.initialProductionCost.toLocaleString()}
                  </span>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setProductToDelete(product); setDeleteDialogOpen(true); }}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredProducts.length === 0 && (
        <Card className="p-12 text-center">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || categoryFilter !== "all"
              ? "Try adjusting your filters"
              : "Get started by adding your first product"}
          </p>
        </Card>
      )}

      {/* Modals */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProduct(null); }}
        onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
        initialData={editingProduct || undefined}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => { setDeleteDialogOpen(false); setProductToDelete(null); }}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        description={`Are you sure you want to delete ${productToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
}

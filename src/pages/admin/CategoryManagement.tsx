import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import CategoryFormModal from "@/components/admin/CategoryFormModal";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import { CategoryDTO } from "@/lib/api";
import axios from "@/lib/axios";

/*export default function CategoryManagement() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDTO | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryDTO | null>(null);

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.getCategories()
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (name: string) => apiClient.createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Category added successfully");
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to add category");
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => apiClient.updateCategory(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Category updated successfully");
      setEditingCategory(null);
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to update category");
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Category deleted successfully");
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    },
    onError: () => {
      toast.error("Failed to delete category");
    }
  });

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = (name: string) => {
    createMutation.mutate(name);
  };

  const handleEditCategory = (name: string) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, name });
    }
  };

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header 
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Category Management</h1>
          <p className="text-muted-foreground mt-1">Manage product categories</p>
        </div>
        <Button onClick={() => { setEditingCategory(null); setIsModalOpen(true); }} size="lg" variant="hero">
          <Plus className="mr-2 h-5 w-5" />
          Add New Category
        </Button>
      </div>

      {/* Search 
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Grid 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="overflow-hidden card-shadow hover:elegant-shadow transition-all group">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-center h-20">
                <h3 className="font-display font-semibold text-2xl text-foreground text-center">{category.name}</h3>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => { setEditingCategory(category); setIsModalOpen(true); }}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setCategoryToDelete(category); setDeleteDialogOpen(true); }}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <Card className="p-12 text-center">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No categories found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "Try adjusting your search"
              : "Get started by adding your first category"}
          </p>
        </Card>
      )}

      {/* Modals 
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingCategory(null); }}
        onSubmit={editingCategory ? handleEditCategory : handleAddCategory}
        initialData={editingCategory?.name}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => { setDeleteDialogOpen(false); setCategoryToDelete(null); }}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        description={`Are you sure you want to delete ${categoryToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
}*/

export default function CategoryManagement() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDTO | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryDTO | null>(null);

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get<CategoryDTO[]>('/api/categories');
      return response.data;
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await axios.post<CategoryDTO>('/api/categories', { name });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Category added successfully");
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to add category");
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const response = await axios.put<CategoryDTO>(`/api/categories/${id}`, { name });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Category updated successfully");
      setEditingCategory(null);
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to update category");
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Category deleted successfully");
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    },
    onError: () => {
      toast.error("Failed to delete category");
    }
  });

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = (name: string) => {
    createMutation.mutate(name);
  };

  const handleEditCategory = (name: string) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.categoryId, name });
    }
  };

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete.categoryId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Category Management</h1>
          <p className="text-muted-foreground mt-1">Manage product categories</p>
        </div>
        <Button onClick={() => { setEditingCategory(null); setIsModalOpen(true); }} size="lg" variant="hero">
          <Plus className="mr-2 h-5 w-5" />
          Add New Category
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.categoryId} className="overflow-hidden card-shadow hover:elegant-shadow transition-all group">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-center h-20">
                <h3 className="font-display font-semibold text-2xl text-foreground text-center">{category.name}</h3>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => { setEditingCategory(category); setIsModalOpen(true); }}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setCategoryToDelete(category); setDeleteDialogOpen(true); }}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <Card className="p-12 text-center">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No categories found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "Try adjusting your search"
              : "Get started by adding your first category"}
          </p>
        </Card>
      )}

      {/* Modals */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingCategory(null); }}
        onSubmit={editingCategory ? handleEditCategory : handleAddCategory}
        initialData={editingCategory?.name}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => { setDeleteDialogOpen(false); setCategoryToDelete(null); }}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        description={`Are you sure you want to delete ${categoryToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
}

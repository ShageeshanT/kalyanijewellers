import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import MetalFormModal from "@/components/admin/MetalFormModal";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import { apiClient, MetalDTO } from "@/lib/api";
import axios from "@/lib/axios";

export default function MetalManagement() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMetal, setEditingMetal] = useState<MetalDTO | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [metalToDelete, setMetalToDelete] = useState<MetalDTO | null>(null);

  // Fetch metals
  const { data: metals = [], isLoading } = useQuery({
    queryKey: ['metals'],
    queryFn: async () => {
      const response = await axios.get<MetalDTO[]>('/api/metals');
      return response.data;
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async ({ metalType, metalPurity }: { metalType: string; metalPurity: string }) => {
      const response = await axios.post<MetalDTO>('/api/metals/add', { metalType, metalPurity });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metals'] });
      toast.success("Metal added successfully");
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || "Failed to add metal";
      toast.error(`Error: ${errorMessage}`);
      console.error('Create metal error:', error);
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, metalType, metalPurity }: { id: number; metalType: string; metalPurity: string }) => {
      const response = await axios.put<MetalDTO>(`/api/metals/${id}`, { metalType, metalPurity });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metals'] });
      toast.success("Metal updated successfully");
      setEditingMetal(null);
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || "Failed to update metal";
      toast.error(`Error: ${errorMessage}`);
      console.error('Update metal error:', error);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/metals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metals'] });
      toast.success("Metal deleted successfully");
      setDeleteDialogOpen(false);
      setMetalToDelete(null);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || "Failed to delete metal";
      toast.error(`Error: ${errorMessage}`);
      console.error('Delete metal error:', error);
    }
  });

  const filteredMetals = metals.filter(metal =>
    metal.metalType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    metal.metalPurity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMetal = (metalType: string, metalPurity: string) => {
    createMutation.mutate({ metalType, metalPurity });
  };

  const handleEditMetal = (metalType: string, metalPurity: string) => {
    if (editingMetal) {
      updateMutation.mutate({ id: editingMetal.metalId, metalType, metalPurity });
    }
  };

  const handleDeleteMetal = () => {
    if (metalToDelete) {
      deleteMutation.mutate(metalToDelete.metalId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Metal Management</h1>
          <p className="text-muted-foreground mt-1">Manage metal types and purity</p>
        </div>
        <Button onClick={() => { setEditingMetal(null); setIsModalOpen(true); }} size="lg" variant="hero">
          <Plus className="mr-2 h-5 w-5" />
          Add New Metal
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search metals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Metal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMetals.map((metal) => (
          <Card key={metal.metalId} className="overflow-hidden card-shadow hover:elegant-shadow transition-all group">
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {metal.metalType}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground text-center">
                  {metal.metalPurity}
                </h3>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => { setEditingMetal(metal); setIsModalOpen(true); }}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setMetalToDelete(metal); setDeleteDialogOpen(true); }}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredMetals.length === 0 && (
        <Card className="p-12 text-center">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No metals found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "Try adjusting your search"
              : "Get started by adding your first metal"}
          </p>
        </Card>
      )}

      {/* Modals */}
      <MetalFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingMetal(null); }}
        onSubmit={editingMetal ? handleEditMetal : handleAddMetal}
        initialData={editingMetal ? {
          metalType: editingMetal.metalType,
          metalPurity: editingMetal.metalPurity
        } : undefined}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => { setDeleteDialogOpen(false); setMetalToDelete(null); }}
        onConfirm={handleDeleteMetal}
        title="Delete Metal"
        description={`Are you sure you want to delete ${metalToDelete?.metalType} - ${metalToDelete?.metalPurity}? This action cannot be undone.`}
      />
    </div>
  );
}

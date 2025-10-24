import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Search, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import  GemFormModal from "@/components/admin/GemFormModal";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import { GemDTO } from "@/lib/api";
import { toast } from "sonner";
import axios from "@/lib/axios";

export default function GemManagement() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGem, setEditingGem] = useState<GemDTO | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [gemToDelete, setGemToDelete] = useState<GemDTO | null>(null);

  // Fetch gems
  const { data: gems = [], isLoading } = useQuery({
    queryKey: ['gems'],
    queryFn: async () => {
      const response = await axios.get<GemDTO[]>('/api/gems');
      return response.data;
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post<GemDTO>('/api/gems', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gems'] });
      toast.success("Gem added successfully");
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || "Failed to add gem";
      toast.error(`Error: ${errorMessage}`);
      console.error('Create gem error:', error);
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      const response = await axios.put<GemDTO>(`/api/gems/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gems'] });
      toast.success("Gem updated successfully");
      setEditingGem(null);
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || "Failed to update gem";
      toast.error(`Error: ${errorMessage}`);
      console.error('Update gem error:', error);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.delete(`/api/gems/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gems'] });
      toast.success("Gem deleted successfully");
      setDeleteDialogOpen(false);
      setGemToDelete(null);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || "Failed to delete gem";
      toast.error(`Error: ${errorMessage}`);
      console.error('Delete gem error:', error);
    }
  });

  const filteredGems = gems.filter(gem =>
    gem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddGem = (formData: FormData) => {
    createMutation.mutate(formData);
  };

  const handleEditGem = (formData: FormData) => {
    if (editingGem) {
      updateMutation.mutate({ id: editingGem.gemId, formData });
    }
  };

  const handleDeleteGem = () => {
    if (gemToDelete) {
      deleteMutation.mutate(gemToDelete.gemId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Gem Management</h1>
          <p className="text-muted-foreground mt-1">Manage gemstone catalog and pricing</p>
        </div>
        <Button onClick={() => { setEditingGem(null); setIsModalOpen(true); }} size="lg" variant="hero">
          <Plus className="mr-2 h-5 w-5" />
          Add New Gem
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search gems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-muted-foreground">Loading gems...</div>
        </div>
      )}

      {/* Gem Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGems.map((gem) => (
            <Card key={gem.gemId} className="overflow-hidden card-shadow hover:elegant-shadow transition-all group">
              <div className="aspect-square overflow-hidden bg-muted relative">
                {gem.imageUrl ? (
                  <img
                    src={gem.imageUrl}
                    alt={gem.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <span className="text-4xl font-display text-primary/50">{gem.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-display font-semibold text-xl text-foreground">{gem.name}</h3>
                  {gem.price && (
                    <p className="text-lg font-semibold text-primary mt-1">
                      Rs {gem.price.toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => { setEditingGem(gem); setIsModalOpen(true); }}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setGemToDelete(gem); setDeleteDialogOpen(true); }}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredGems.length === 0 && (
        <Card className="p-12 text-center">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No gems found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "Try adjusting your search"
              : "Get started by adding your first gem"}
          </p>
        </Card>
      )}

      {/* Modals */}
      <GemFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingGem(null); }}
        onSubmit={editingGem ? handleEditGem : handleAddGem}
        initialData={editingGem || undefined}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => { setDeleteDialogOpen(false); setGemToDelete(null); }}
        onConfirm={handleDeleteGem}
        title="Delete Gem"
        description={`Are you sure you want to delete ${gemToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
}

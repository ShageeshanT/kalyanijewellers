import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, MapPin, Phone, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import BranchFormModal from "@/components/admin/BranchFormModal";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import { apiClient, Branch } from '@/lib/api';
import axiosInstance from "@/lib/axios";

export default function BranchManagement() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);

  const [branchName, setBranchName] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [operatingHours, setOperatingHours] = useState("");  


  const branchData = {
    branchName: branchName,
    branchCode: branchCode,
    branchAddress: address,    
    branchTelephone: phoneNumber, 
    branchHours: operatingHours  
  };  

  // Load branches from API
  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    setLoading(true);
    try {
      // Debug: Check if token exists
      /*const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      console.log('Token value:', token ? token.substring(0, 20) + '...' : 'No token');*/
      
      const response = await axiosInstance.get("/api/branches/allBranches");
      setBranches(response.data);
      localStorage.setItem('numberOfBranches', response.data.length);
    } catch (err: any) {
      console.error("Failed to load branches:", err);
      console.error("Error response:", err.response?.data);
      toast.error(err.response?.data?.message || err.message || "Failed to load branches");
    } finally {
      setLoading(false);
    }
  };


  const filteredBranches = branches.filter(branch =>
    branch.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.branchAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

const handleAddBranch = async (branchData: Omit<Branch, "branchId">) => {
  try {
    const response = await axiosInstance.post(
      "/api/branches/addBranch",
      branchData
    );

    toast.success("Branch added successfully!");
    setBranches(prev => [...prev, response.data]);
    setIsModalOpen(false);
  } catch (err: any) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to add branch");
  }
};

  const handleEditBranch = async (branchData: Omit<Branch, "branchId">) => {
    if (editingBranch) {
      try {
        const updatedBranch = await apiClient.updateBranch(editingBranch.branchCode, branchData);
        setBranches(branches.map(b =>
          b.branchId === editingBranch.branchId ? updatedBranch : b
        ));
        toast.success("Branch updated successfully");
        setEditingBranch(null);
        setIsModalOpen(false);
      } catch (error: any) {
        console.error('Failed to update branch:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update branch';
        toast.error(`Error: ${errorMessage}`);
      }
    }
  };

  const handleDeleteBranch = async () => {
    if (!branchToDelete) return;

    try {
      // Call DELETE endpoint
      await axiosInstance.delete(
        `/api/branches/deleteBranch/${branchToDelete.branchCode}`
      );

      // Update local state to remove the deleted branch
      setBranches(prev => prev.filter(b => b.branchId !== branchToDelete.branchId));
      toast.success("Branch deleted successfully");

      // Close delete dialog
      setDeleteDialogOpen(false);
      setBranchToDelete(null);
    } catch (error: any) {
      console.error("Failed to delete branch:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication required. Please log in again.");
      } else {
        const errorMessage = error.response?.data?.message || error.message || "Failed to delete branch";
        toast.error(`Error: ${errorMessage}`);
      }
    }
  };
  const handleRefresh = () => {
    loadBranches();
  };
  const openEditModal = (branch: Branch) => {
    setEditingBranch(branch);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (branch: Branch) => {
    console.log('Opening delete dialog for branch:', branch);
    setBranchToDelete(branch);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Branch Management</h1>
          <p className="text-muted-foreground mt-1">Manage all New Kalyani Jewellers boutique locations</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="lg"
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => { setEditingBranch(null); setIsModalOpen(true); }} size="lg" variant="hero">
            <Plus className="mr-2 h-5 w-5" />
            Add New Branch
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <Input
          placeholder="Search branches by name or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-muted-foreground">Loading branches...</div>
        </div>
      )}

      {/* Branch Cards */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBranches.map((branch) => (
            <Card key={branch.branchId} className="p-6 card-shadow hover:elegant-shadow transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                    {branch.branchName}
                  </h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {branch.branchCode}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditModal(branch)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(branch)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-foreground">{branch.branchAddress}</p>
                    <p className="text-sm text-muted-foreground">
                      Code: {branch.branchCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <p className="text-sm text-foreground">{branch.branchTelephone}</p>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{branch.branchHours}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredBranches.length === 0 && (
        <Card className="p-12 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No branches found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Try adjusting your search" : "Get started by adding your first branch"}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsModalOpen(true)} variant="hero">
              <Plus className="mr-2 h-4 w-4" />
              Add First Branch
            </Button>
          )}
        </Card>
      )}

      {/* Modals */}
      <BranchFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingBranch(null); }}
        onSubmit={editingBranch ? handleEditBranch : handleAddBranch}
        initialData={editingBranch || undefined}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => { 
          console.log('Delete dialog closed');
          setDeleteDialogOpen(false); 
          setBranchToDelete(null); 
        }}
        onConfirm={() => {
          console.log('Delete confirmed for branch:', branchToDelete);
          handleDeleteBranch();
        }}
        title="Delete Branch"
        description={`Are you sure you want to delete ${branchToDelete?.branchName}? This action cannot be undone.`}
      />
    </div>
  );
}

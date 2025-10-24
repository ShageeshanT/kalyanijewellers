import { useState, useEffect } from "react";
import { Star, CheckCircle, XCircle, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import { CustomerReview } from '@/lib/api';
import axiosInstance from '@/lib/axios';

// Using the backend CustomerReview interface from reviewService

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<CustomerReview | null>(null);

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        console.log('Fetching reviews from backend...');
        console.log('Current token:', localStorage.getItem('token'));
        console.log('Current userId:', localStorage.getItem('userId'));
        
        // Check if token exists
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found in localStorage');
          toast.error('Please log in to access reviews');
          setReviews([]);
          return;
        }
        
        const response = await axiosInstance.get('/api/reviews/adminQueue');
        localStorage.setItem("numberOfReviews", response.data.length);
        console.log('Reviews response:', response.data); 
        console.log('Response status:', response.status);
        setReviews(response.data);
      } catch (error: any) {
        console.error('Error fetching reviews:', error);
        console.error('Error response:', error.response);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        console.error('Error headers:', error.response?.headers);
        toast.error(`Failed to load reviews: ${error.response?.data?.message || error.message}`);
        setReviews([]); // Set empty array instead of hardcoded data
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (reviewId: number, newStatus: "APPROVED" | "REJECTED") => {
    try {
      let response;
      if (newStatus === "APPROVED") {
        response = await axiosInstance.put(`/api/reviews/${reviewId}/approve`, {});
      } else {
        response = await axiosInstance.put(`/api/reviews/${reviewId}/reject`, {});
      }
      
      const updatedReview = response.data;
      setReviews(reviews.map(r => r.id === reviewId ? updatedReview : r));
      toast.success(`Review ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      console.error('Error updating review status:', error);
      toast.error('Failed to update review status');
    }
  };

  const handleDeleteReview = async () => {
    if (reviewToDelete) {
      try {
        await axiosInstance.put(`/api/reviews/${reviewToDelete.id}`);
        setReviews(reviews.filter(r => r.id !== reviewToDelete.id));
        toast.success("Review deleted successfully");
        setDeleteDialogOpen(false);
        setReviewToDelete(null);
      } catch (error) {
        console.error('Error deleting review:', error);
        toast.error('Failed to delete review');
      }
    }
  };

  const statusCounts = {
    all: reviews.length,
    pending: reviews.filter(r => r.status === "PENDING").length,
    approved: reviews.filter(r => r.status === "APPROVED").length,
    rejected: reviews.filter(r => r.status === "REJECTED").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Customer Review Management</h1>
        <p className="text-muted-foreground mt-1">Moderate and manage product reviews</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { value: "all", label: `All (${statusCounts.all})` },
          { value: "PENDING", label: `Pending (${statusCounts.pending})` },
          { value: "APPROVED", label: `Approved (${statusCounts.approved})` },
          { value: "REJECTED", label: `Rejected (${statusCounts.rejected})` },
        ].map(status => (
          <Button
            key={status.value}
            variant={statusFilter === status.value ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status.value)}
          >
            {status.label}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const fetchReviews = async () => {
              try {
                setLoading(true);
                console.log('Refreshing reviews from backend...');
                const response = await axiosInstance.get('/api/reviews/adminQueue');
                console.log('Refresh response:', response.data);
                setReviews(response.data);
              } catch (error: any) {
                console.error('Error fetching reviews:', error);
                console.error('Error details:', error.response?.data);
                toast.error('Failed to load reviews');
                setReviews([]);
              } finally {
                setLoading(false);
              }
            };
            fetchReviews();
          }}
          className="ml-auto"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Input
        placeholder="Search by customer name or review content..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded ml-auto"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="flex gap-2 pt-2">
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="p-6 card-shadow hover:elegant-shadow transition-all">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                    <p className="text-foreground leading-relaxed mb-3">"{review.comment}"</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    review.status === "APPROVED" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                    review.status === "REJECTED" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}>
                    {review.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="font-semibold">{review.authorName}</span>
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  {review.moderatedBy && (
                    <span>Moderated by: {review.moderatedBy}</span>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  {review.status === "PENDING" && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(review.id, "APPROVED")}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(review.id, "REJECTED")}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline" onClick={() => { setReviewToDelete(review); setDeleteDialogOpen(true); }}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          
          {filteredReviews.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No reviews found matching your criteria.</p>
            </div>
          )}
        </div>
      )}

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => { setDeleteDialogOpen(false); setReviewToDelete(null); }}
        onConfirm={handleDeleteReview}
        title="Delete Review"
        description={`Are you sure you want to delete this review? This action cannot be undone.`}
      />
    </div>
  );
}

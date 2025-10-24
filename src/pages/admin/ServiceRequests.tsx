import { useState, useEffect } from "react";
import { Eye, Clock, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import RequestDetailsModal from "@/components/admin/RequestDetailsModal";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import axiosInstance from "@/lib/axios";

// Backend data interfaces
interface ServiceTicket {
  serviceId: number;
  branchId?: number;
  assignedUserId?: number;
  type: "CLEANING" | "REPAIR" | "RESIZE" | "OTHER";
  status: "NEW" | "IN_PROGRESS" | "DONE" | "CANCELLED";
  priority?: "HIGH" | "MEDIUM" | "LOW";
  customerFname: string;
  customerLname: string;
  email: string;
  contactNumber: string;
  note?: string;
  preferredDate?: string;
  ticketDate: string;
}

interface CustomDesign {
  designId: number;
  assignedUserId?: number;
  customerFname: string;
  customerLname: string;
  email: string;
  contactNumber: string;
  budget?: number;
  image: string;
  ticketDate: string;
  status: "NEW" | "REVIEWED" | "IN_PROGRESS" | "QUOTED" | "CLOSED";
  preferredMetalId?: number;
}

// Unified interface for display
interface ServiceRequest {
  id: string;
  type: "Service Ticket" | "Custom Design";
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  subject: string;
  description: string;
  submittedDate: string;
  customerNotes?: string;
  originalData: ServiceTicket | CustomDesign;
}

export default function ServiceRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<ServiceRequest | null>(null);

  // Helper functions to convert backend data to display format
  const convertServiceTicketToRequest = (ticket: ServiceTicket): ServiceRequest => ({
    id: `ST-${ticket.serviceId}`,
    type: "Service Ticket",
    customerName: `${ticket.customerFname} ${ticket.customerLname}`,
    customerEmail: ticket.email,
    customerPhone: ticket.contactNumber,
    subject: `${ticket.type} Service Request`,
    description: ticket.note || "No description provided",
    submittedDate: ticket.ticketDate ? ticket.ticketDate.split('T')[0] : new Date().toISOString().split('T')[0],
    customerNotes: ticket.note,
    originalData: ticket
  });

  const convertCustomDesignToRequest = (design: CustomDesign): ServiceRequest => {
    const imageUrl = design.image.startsWith('data:')
      ? design.image
      : `data:image/png;base64,${design.image}`; // <-- add this

    return {
      id: `CD-${design.designId}`,
      type: "Custom Design",
      customerName: `${design.customerFname} ${design.customerLname}`,
      customerEmail: design.email,
      customerPhone: design.contactNumber,
      subject: "Custom Design Request",
      description: `Budget: ${design.budget ? `:LKR ${design.budget}` : 'Not specified'}${design.preferredMetalId ? ` | Metal ID: ${design.preferredMetalId}` : ''}`,
      submittedDate: design.ticketDate ? design.ticketDate.split('T')[0] : new Date().toISOString().split('T')[0],
      customerNotes: `Budget: ${design.budget ? `LKR ${design.budget}` : 'Not specified'}${design.preferredMetalId ? ` | Preferred Metal ID: ${design.preferredMetalId}` : ''}`,
      originalData: { ...design, image: imageUrl } // replace with URL version
    };
  };

  // Fetch data from backend
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        console.log('Fetching requests from backend...');
        
        // Check authentication first
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (!token || !userId) {
          console.error('No authentication token found');
          toast.error('Please log in to access service requests');
          setRequests([]);
          return;
        }
        
        console.log('Authentication check passed. Token:', token.substring(0, 20) + '...');
        console.log('User ID:', userId);
        
        // Fetch both service tickets and custom designs
        const [serviceTicketsResponse, customDesignsResponse] = await Promise.all([
          axiosInstance.get('/api/serviceticket/tickets'),
          axiosInstance.get('/api/customdesign/designs')
        ]);

        console.log('Service tickets response:', serviceTicketsResponse.data);
        console.log('Custom designs response:', customDesignsResponse.data);
        localStorage.setItem("numberOfRequests", serviceTicketsResponse.data.length+customDesignsResponse.data.length);

        const serviceTickets = serviceTicketsResponse.data as ServiceTicket[];
        const customDesigns = customDesignsResponse.data as CustomDesign[];

        console.log('Parsed service tickets:', serviceTickets);
        console.log('Parsed custom designs:', customDesigns);

        // Convert to unified format
        const serviceRequests = serviceTickets.map(convertServiceTicketToRequest);
        const customRequests = customDesigns.map(convertCustomDesignToRequest);
        
        const allRequests = [...serviceRequests, ...customRequests];
        setRequests(allRequests);
        
        console.log('Successfully fetched requests:', allRequests.length);
        console.log('Service tickets:', serviceTickets.length);
        console.log('Custom designs:', customDesigns.length);
      } catch (error: any) {
        console.error('Error fetching requests:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // Check if it's a network error or response error
        if (error.response) {
          // Server responded with error status
          console.error('Error status:', error.response.status);
          console.error('Error data:', error.response.data);
          console.error('Error headers:', error.response.headers);
          
          if (error.response.status === 401) {
            toast.error('Authentication failed. Please log in again.');
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            window.location.href = '/auth/login';
          } else if (error.response.status === 403) {
            toast.error('Access denied. You do not have permission to view service requests.');
          } else {
            toast.error(`Failed to load requests: ${error.response.data?.message || error.message}`);
          }
        } else if (error.request) {
          // Request was made but no response received
          console.error('No response received:', error.request);
          toast.error('Network error. Please check your connection and try again.');
        } else {
          // Something else happened
          console.error('Request setup error:', error.message);
          toast.error(`Error: ${error.message}`);
        }
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = activeTab === "all" || 
                       (activeTab === "service" && request.type === "Service Ticket") ||
                       (activeTab === "custom" && request.type === "Custom Design");
    return matchesSearch && matchesType;
  });



  const openDetailsModal = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setDetailsModalOpen(true);
  };

  const handleDeleteRequest = async () => {
    if (!requestToDelete) return;

    try {
      // Check authentication first
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        toast.error('Authentication required. Please log in again.');
        return;
      }

      if (requestToDelete.type === "Service Ticket") {
        const ticket = requestToDelete.originalData as ServiceTicket;
        await axiosInstance.delete(`/api/serviceticket/${ticket.serviceId}`);
      } else if (requestToDelete.type === "Custom Design") {
        const design = requestToDelete.originalData as CustomDesign;
        await axiosInstance.delete(`/api/customdesign/${design.designId}`);
      }

      // Remove from local state
      setRequests(requests.filter(r => r.id !== requestToDelete.id));
      toast.success(`${requestToDelete.type} deleted successfully`);
      setDeleteDialogOpen(false);
      setRequestToDelete(null);
    } catch (error: any) {
      console.error('Error deleting request:', error);
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/auth/login';
      } else {
        toast.error(`Failed to delete ${requestToDelete.type.toLowerCase()}`);
      }
    }
  };

  const typeCounts = {
    all: requests.length,
    service: requests.filter(r => r.type === "Service Ticket").length,
    custom: requests.filter(r => r.type === "Custom Design").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Customer Requests & Service Tickets</h1>
        <p className="text-muted-foreground mt-1">Manage customer inquiries and custom design requests</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Requests ({typeCounts.all})</TabsTrigger>
          <TabsTrigger value="service">Service Tickets ({typeCounts.service})</TabsTrigger>
          <TabsTrigger value="custom">Custom Design ({typeCounts.custom})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const fetchRequests = async () => {
              try {
                setLoading(true);
                
                // Check authentication first
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');
                
                if (!token || !userId) {
                  toast.error('Please log in to access service requests');
                  return;
                }
                
                const [serviceTicketsResponse, customDesignsResponse] = await Promise.all([
                  axiosInstance.get('/api/serviceticket/tickets'),
                  axiosInstance.get('/api/customdesign/designs')
                ]);

                const serviceTickets = serviceTicketsResponse.data as ServiceTicket[];
                const customDesigns = customDesignsResponse.data as CustomDesign[];

                const serviceRequests = serviceTickets.map(convertServiceTicketToRequest);
                const customRequests = customDesigns.map(convertCustomDesignToRequest);
                
                const allRequests = [...serviceRequests, ...customRequests];
                setRequests(allRequests);
                
                toast.success('Requests refreshed successfully');
              } catch (error: any) {
                console.error('Error refreshing requests:', error);
                if (error.response?.status === 401) {
                  toast.error('Authentication failed. Please log in again.');
                  localStorage.removeItem('token');
                  localStorage.removeItem('userId');
                  window.location.href = '/auth/login';
                } else {
                  toast.error('Failed to refresh requests');
                }
              } finally {
                setLoading(false);
              }
            };
            fetchRequests();
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by customer name, email, or request ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      {/* Request Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
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
          filteredRequests.map((request) => (
          <Card key={request.id} className="p-6 card-shadow hover:elegant-shadow transition-all">
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono text-muted-foreground">{request.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.type === "Custom Design"
                          ? "bg-teal/20 text-teal"
                          : "bg-sky-blue/20 text-navy"
                      }`}>
                        {request.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-semibold text-foreground mb-1">
                      {request.subject}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {request.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Customer:</span>
                    <span>{request.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{request.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{request.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(request.submittedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex lg:flex-col gap-2">
                <Button variant="outline" size="sm" onClick={() => openDetailsModal(request)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => { setRequestToDelete(request); setDeleteDialogOpen(true); }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
          ))
        )}
      </div>

      {!loading && filteredRequests.length === 0 && (
        <Card className="p-12 text-center">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No requests found</h3>
          <p className="text-muted-foreground">
            {searchTerm || activeTab !== "all" ? "Try adjusting your filters" : "No customer requests at the moment"}
          </p>
        </Card>
      )}

      {/* Request Details Modal */}
      <RequestDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => { setDetailsModalOpen(false); setSelectedRequest(null); }}
        request={selectedRequest}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => { setDeleteDialogOpen(false); setRequestToDelete(null); }}
        onConfirm={handleDeleteRequest}
        title="Delete Request"
        description={`Are you sure you want to delete this ${requestToDelete?.type.toLowerCase()}? This action cannot be undone.`}
      />
    </div>
  );
}

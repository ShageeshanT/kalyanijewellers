import { useState, useEffect } from "react";
import { Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axiosInstance from "@/lib/axios";

interface Metal {
  metalId: number;
  metalType: string;
  metalPurity: string;
}

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
  originalData: any;
}

interface RequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ServiceRequest | null;
}

export default function RequestDetailsModal({ isOpen, onClose, request }: RequestDetailsModalProps) {
  const [metals, setMetals] = useState<Metal[]>([]);

  // Fetch metals from backend
  useEffect(() => {
    const fetchMetals = async () => {
      try {
        const response = await axiosInstance.get('/api/metals');
        setMetals(response.data);
      } catch (error) {
        console.error('Error fetching metals:', error);
      }
    };

    if (isOpen) {
      fetchMetals();
    }
  }, [isOpen]);

  if (!request) return null;

  // Get metal name for custom design requests
  const getMetalName = (metalId: number | undefined) => {
    if (!metalId) return 'Not specified';
    const metal = metals.find(m => m.metalId === metalId);
    return metal ? `${metal.metalType} - ${metal.metalPurity}` : 'Unknown metal';
  };

  // Get images for custom design requests
  const getCustomDesignImages = () => {
    if (request.type !== "Custom Design") return [];
    const design = request.originalData as any;
    return design.image ? [design.image] : [];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-display">Request Details</DialogTitle>
            <span className="text-sm font-mono text-muted-foreground">{request.id}</span>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Customer Information */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-lg">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{request.customerName || 'N/A'}</p>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-sm">{request.customerEmail || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{request.customerPhone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium">{request.submittedDate ? new Date(request.submittedDate).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                request.type === "Custom Design"
                  ? "bg-teal/20 text-teal"
                  : "bg-sky-blue/20 text-navy"
              }`}>
                {request.type}
              </span>
            </div>

            <div>
              <h3 className="font-display text-2xl font-semibold mb-2">{request.subject || `${request.type} Request`}</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{request.description}</p>
            </div>

            {/* Preferred Metal for Custom Design */}
            {request.type === "Custom Design" && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Preferred Metal Type</h4>
                <p className="text-muted-foreground">
                  {getMetalName((request.originalData as any).preferredMetalId)}
                </p>
              </div>
            )}
          </div>

          {/* Customer Notes */}
          {request.customerNotes && (
            <div className="border-t pt-6 space-y-4">
              <h3 className="font-semibold text-lg">Customer Notes</h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-muted-foreground whitespace-pre-wrap">{request.customerNotes}</p>
              </div>
            </div>
          )}

          {/* Design Images for Custom Design */}
          {request.type === "Custom Design" && getCustomDesignImages().length > 0 && (
            <div className="border-t pt-6 space-y-4">
              <h3 className="font-semibold text-lg">Design Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getCustomDesignImages().map((imageUrl, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={imageUrl} 
                      alt={`Design ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

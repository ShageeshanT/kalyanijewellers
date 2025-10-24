import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CustomerReviewRequest } from '@/lib/api';
import axiosInstance from '@/lib/axios';

interface ReviewSubmissionProps {
  onSuccess?: () => void;
  className?: string;
}

export default function ReviewSubmission({ onSuccess, className = "" }: ReviewSubmissionProps) {
  const [formData, setFormData] = useState<CustomerReviewRequest>({
    authorName: '',
    rating: 5,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation matching backend requirements
    const trimmedAuthorName = formData.authorName.trim();
    const trimmedComment = formData.comment.trim();
    
    if (!trimmedAuthorName) {
      toast.error('Please enter your name');
      return;
    }
    
    if (trimmedAuthorName.length > 80) {
      toast.error('Name must be 80 characters or less');
      return;
    }
    
    if (!trimmedComment) {
      toast.error('Please write your review');
      return;
    }
    
    if (formData.rating < 1 || formData.rating > 5) {
      toast.error('Please select a valid rating (1-5 stars)');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare data matching backend CustomerReviewRequest exactly
      const reviewData: CustomerReviewRequest = {
        authorName: trimmedAuthorName,
        rating: formData.rating,
        comment: trimmedComment,  
      };
      
      await axiosInstance.post('/api/reviews/addReview', reviewData);
      toast.success('Review submitted successfully! It will be reviewed by our team before being published.');
      
      // Reset form
      setFormData({
        authorName: '',
        rating: 5,
        comment: ''
      });
      
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-6 w-6 ${
              i < rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={interactive ? () => handleRatingChange(i + 1) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className={`p-6 card-shadow ${className}`}>
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-display font-semibold text-foreground mb-2">
            Share Your Experience
          </h3>
          <p className="text-muted-foreground">
            Help other customers by sharing your experience with our Jewellery
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="authorName" className="block text-sm font-medium text-foreground mb-2">
              Your Name *
            </label>
            <Input
              id="authorName"
              type="text"
              placeholder="Enter your name"
              value={formData.authorName}
              onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
              maxLength={80}
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              {formData.authorName.length}/80 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Rating *
            </label>
            {renderStars(formData.rating, true)}
            <p className="text-sm text-muted-foreground mt-1">
              Click on the stars to rate your experience
            </p>
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-foreground mb-2">
              Your Review *
            </label>
            <Textarea
              id="comment"
              placeholder="Tell us about your experience with our Jewellery..."
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              {formData.comment.length} characters
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Review
              </>
            )}
          </Button>
        </form>

        <div className="text-xs text-muted-foreground">
          <p>* Required fields. Your review will be moderated before being published.</p>
        </div>
      </div>
    </Card>
  );
}

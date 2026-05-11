import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Send, User, Calendar } from 'lucide-react';
import { createProductReview } from '../api/products.api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

interface ProductReviewsProps {
  productId: string;
  reviews: any[];
  onReviewAdded: () => void;
}

const ProductReviews = ({ productId, reviews, onReviewAdded }: ProductReviewsProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to leave a review');
      return;
    }

    setIsSubmitting(true);
    try {
      await createProductReview(productId, { rating, comment });
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      onReviewAdded();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-20">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
          <MessageSquare size={24} className="text-primary" />
        </div>
        <h2 className="text-3xl font-bold uppercase tracking-tighter">System Feedback</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Review Form */}
        <div>
          {isAuthenticated ? (
            <div className="glass-card p-8 sticky top-28">
              <h3 className="text-xl font-bold mb-6">Authorize Data Entry</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Calibration Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-2 rounded-lg transition-all ${
                          rating >= star ? 'text-yellow-500 scale-110' : 'text-white/10 hover:text-white/30'
                        }`}
                      >
                        <Star fill={rating >= star ? 'currentColor' : 'none'} size={24} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Feedback Transmission</label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe your experience with this artifact..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-primary/50 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-4 font-bold uppercase tracking-widest flex items-center justify-center gap-2 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  {isSubmitting ? 'Transmitting...' : (
                    <>
                      <Send size={18} /> UPLOAD REVIEW
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="glass-card p-12 text-center border-dashed border-2 border-white/10">
              <User className="mx-auto mb-4 text-white/10" size={48} />
              <p className="text-white/40 mb-6">Authentication required to submit feedback.</p>
              <button className="btn-secondary px-8 py-3 text-xs font-bold uppercase tracking-widest">
                ESTABLISH ANCHOR
              </button>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 border-white/5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                      <User size={18} className="text-white/40" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{review.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-white/20 font-mono">
                        <Calendar size={10} /> {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={12}
                        className={idx < review.rating ? 'text-yellow-500' : 'text-white/10'}
                        fill={idx < review.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-white/60 leading-relaxed italic">
                  "{review.comment}"
                </p>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 text-white/20">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-10" />
              <p className="font-mono text-xs uppercase tracking-widest">No feedback detected for this artifact</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;

import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useWishlistStore } from '../store/wishlistStore.js';

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full"
    />
  </div>
);

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-white/5 animate-pulse rounded-xl ${className}`} />
);

export const Checkmark = () => (
  <motion.svg
    width="80"
    height="80"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-primary"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
  >
    <motion.polyline points="20 6 9 17 4 12" />
  </motion.svg>
);

export const WishlistButton = ({ productId, className }: { productId: string, className?: string }) => {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isLiked = isInWishlist(productId);
  const [showParticles, setShowParticles] = useState(false);

  const handleClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!isLiked) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 1000);
    }
    
    await toggleItem(productId);
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.8 }}
        onClick={handleClick}
        className={`p-2 rounded-full backdrop-blur-md transition-colors ${
          isLiked ? 'bg-magenta/20 text-magenta' : 'bg-white/5 text-white/40'
        }`}
      >
        <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
      </motion.button>

      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, 1, 0],
                x: (Math.random() - 0.5) * 60,
                y: (Math.random() - 0.5) * 60,
                opacity: 0
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute left-1/2 top-1/2 w-1.5 h-1.5 bg-secondary rounded-full"
            />
          ))}
        </div>
      )}
    </div>
  );
};

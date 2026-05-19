import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';

export const NeuralCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      style={{
        translateX: x,
        translateY: y,
      }}
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-primary/50 pointer-events-none z-[9999] flex items-center justify-center mix-blend-difference"
    >
      <div className="w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_#00ffff]" />
    </motion.div>
  );
};

export const GridDistortion = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-background" />
    </div>
  );
};

export const ScanlineEffect = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9998] opacity-[0.02] overflow-hidden">
      <div className="w-full h-[2px] bg-white animate-scanline" />
    </div>
  );
};

export const LoadingSpinner = ({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) => {
  const sizes = {
    small: 'w-5 h-5 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(0,245,255,0.3)]`} />
    </div>
  );
};

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-white/5 animate-pulse rounded-xl ${className}`} />
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

export const Checkmark = () => (
  <motion.svg
    className="w-12 h-12 text-primary"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
    initial={{ strokeDasharray: 100, strokeDashoffset: 100 }}
    animate={{ strokeDashoffset: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </motion.svg>
);

export const Confetti = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-primary' : 'bg-secondary'}`}
          initial={{ 
            top: '50%', 
            left: '50%',
            opacity: 1,
            scale: 1
          }}
          animate={{ 
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: 0,
            scale: 0
          }}
          transition={{ 
            duration: Math.random() * 2 + 1,
            ease: "easeOut",
            delay: Math.random() * 0.5
          }}
        />
      ))}
    </div>
  );
};

const UIPolish = () => {
  return (
    <>
      <NeuralCursor />
      <GridDistortion />
      <ScanlineEffect />
    </>
  );
};

export default UIPolish;

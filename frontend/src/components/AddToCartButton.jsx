import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AddToCartButton = ({ onClick }) => {
  const [ripples, setRipples] = useState([]);
  const [isFlying, setIsFlying] = useState(false);

  const addToCart = async (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    // Create ripple effect
    const newRipple = { id: Date.now(), x, y, size };
    setRipples((prev) => [...prev, newRipple]);

    // Trigger API call
    try {
      await fetch('http://localhost:5001/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: 'KALEIDO-ARTIFACT-01' }), // Mock ID for now
      });
      console.log('Saved to MongoDB');
    } catch (err) {
      console.error('Failed to save to cart', err);
    }

    // Trigger flying orb animation
    setIsFlying(true);
    setTimeout(() => setIsFlying(false), 1200);

    if (onClick) onClick();
    
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1000);
  };

  return (
    <div className="relative">
      <button className="btn-primary relative overflow-hidden" onClick={addToCart}>
        <span className="relative z-10">Add to Cart</span>
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                position: 'absolute',
                top: ripple.y,
                left: ripple.x,
                width: ripple.size,
                height: ripple.size,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                boxShadow: '0 0 20px 10px rgba(0, 236, 251, 0.5)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />
          ))}
        </AnimatePresence>
      </button>

      {/* Flying Orb Animation */}
      <AnimatePresence>
        {isFlying && (
          <motion.div
            initial={{ 
              position: 'fixed',
              top: '50%',
              left: '50%',
              x: '-50%',
              y: '-50%',
              scale: 1,
              opacity: 1
            }}
            animate={{ 
              top: '90%', 
              left: '95%',
              scale: 0.2,
              opacity: 0,
            }}
            transition={{ 
              duration: 1, 
              ease: [0.16, 1, 0.3, 1] 
            }}
            className="w-10 h-10 rounded-full bg-primary z-[100] pointer-events-none"
            style={{
              boxShadow: '0 0 40px 20px rgba(245, 169, 127, 0.8)',
              background: 'radial-gradient(circle, #f5a97f 0%, #ffcbb1 100%)',
              filter: 'blur(1px)'
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddToCartButton;

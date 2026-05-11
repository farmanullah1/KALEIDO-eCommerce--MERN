import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const VolumetricRipple = ({ active }: { active: boolean }) => {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-primary rounded-full pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
};

export const CartOrbFly = ({ startPos, onComplete }: { startPos: { x: number, y: number }, onComplete: () => void }) => {
  return (
    <motion.div
      initial={{ 
        x: startPos.x, 
        y: startPos.y, 
        scale: 1,
        opacity: 1,
        boxShadow: "0 0 20px #00F5FF"
      }}
      animate={{ 
        x: window.innerWidth - 100, 
        y: 40, // Target cart icon approximate position
        scale: 0.2,
        opacity: 0,
      }}
      transition={{ 
        duration: 0.8, 
        ease: [0.6, 0.01, -0.05, 0.95] 
      }}
      onAnimationComplete={onComplete}
      className="fixed top-0 left-0 w-8 h-8 bg-primary rounded-full z-[100] pointer-events-none blur-[2px]"
    />
  );
};

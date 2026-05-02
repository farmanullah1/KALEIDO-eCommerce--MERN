import React from 'react';
import { motion } from 'framer-motion';
import { Hexagon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AnchorCrystal = () => {
  const { user, isGuest, logout } = useAuth();
  
  const crystalColor = isGuest ? '#303541' : (user?.crystalHexCode || '#f5a97f');
  const tier = isGuest ? 'GHOST' : user?.anchorCrystalTier?.toUpperCase();

  return (
    <div className="flex flex-col items-end gap-1">
      <motion.div 
        whileHover={{ scale: 1.1, rotate: 30 }}
        onClick={() => !isGuest && logout()}
        className="w-12 h-12 glass-panel flex items-center justify-center anisotropic-border cursor-pointer relative"
        style={{ '--tertiary': crystalColor }}
      >
        <Hexagon 
          className="w-7 h-7" 
          style={{ color: crystalColor, filter: `drop-shadow(0 0 10px ${crystalColor}44)` }} 
        />
        {!isGuest && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-bg"
            style={{ backgroundColor: crystalColor }}
          />
        )}
      </motion.div>
      <span className="text-[9px] font-bold tracking-[0.3em] text-on-surface/40">{tier}</span>
    </div>
  );
};

export default AnchorCrystal;

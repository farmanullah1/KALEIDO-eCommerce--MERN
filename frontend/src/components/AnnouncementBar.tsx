import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Zap, AlertCircle, Globe } from 'lucide-react';

const messages = [
  "DIMENSIONAL SHIFT: 48H REMAINING UNTIL NEXT ARTIFACT DROP",
  "NEURAL LINK OPTIMIZED: 14MS LATENCY REACHED",
  "COLLECTIVE ALERT: NEW VENDOR ARCHIVE DISCOVERED IN SECTOR 7",
  "PROTOCOL UPDATE: SECURE QUANTUM PAYMENTS NOW ACTIVE",
];

const AnnouncementBar = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-8 bg-primary text-background overflow-hidden relative flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-cyan to-primary opacity-50 animate-pulse" />
      
      <div className="relative z-10 flex items-center gap-4">
        <Zap size={10} className="animate-bounce" />
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-[10px] font-mono font-black uppercase tracking-[0.3em]"
          >
            {messages[index]}
          </motion.p>
        </AnimatePresence>
        <Zap size={10} className="animate-bounce" />
      </div>

      <div className="absolute right-4 hidden md:flex items-center gap-2 opacity-60">
        <Globe size={10} />
        <span className="text-[8px] font-mono font-bold uppercase tracking-widest">Global Node</span>
      </div>
    </div>
  );
};

export default AnnouncementBar;

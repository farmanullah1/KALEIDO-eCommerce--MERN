import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';

const logs = [
  "ARTIFACT #8291 MANIFESTED IN SECTOR 4",
  "NEURAL LINK OPTIMIZED: 14MS LATENCY",
  "NEW USER ANCHOR DETECTED IN QUANTUM REGION",
  "ORDER TRANSMISSION SUCCESSFUL [ID: 9283-AX]",
  "VOID SYNC COMPLETED: 100% COHERENCE",
  "PRICE DISTORTION DETECTED: FLASH SALE ACTIVE",
  "VENDOR ARCHIVE #12 ACCESSED BY MODERATOR",
];

const SystemLogTicker = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % logs.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full h-8 bg-black/80 backdrop-blur-md border-t border-white/5 z-[90] flex items-center px-6 overflow-hidden">
      <div className="flex items-center gap-3 shrink-0 mr-6">
        <Terminal size={12} className="text-primary animate-pulse" />
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">System Log:</span>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="text-[10px] font-mono text-primary/80 uppercase tracking-widest whitespace-nowrap"
        >
          {logs[index]}
        </motion.p>
      </AnimatePresence>

      <div className="ml-auto hidden md:flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[8px] font-mono text-white/20 uppercase">Core Coherence: 99.9%</span>
        </div>
        <span className="text-[8px] font-mono text-white/20 uppercase">Nodes Active: 1,482</span>
      </div>
    </div>
  );
};

export default SystemLogTicker;

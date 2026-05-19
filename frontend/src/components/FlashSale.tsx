import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, ChevronRight } from 'lucide-react';

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden group cursor-pointer"
    >
      <div className="flex flex-col md:flex-row items-center gap-6 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-magenta/20 rounded-xl flex items-center justify-center border border-magenta/30 shadow-[0_0_15px_rgba(255,0,255,0.2)]">
            <Zap className="text-magenta animate-pulse" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tighter italic">Artifact Drop</h3>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Temporal Distortion Detected</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div className="bg-white/5 border border-white/10 rounded-lg w-12 py-2 text-center font-mono text-xl font-bold text-magenta">
              {formatTime(timeLeft.hours)}
            </div>
            <span className="text-[8px] font-mono text-white/20 uppercase mt-1">HR</span>
          </div>
          <span className="text-xl font-bold text-white/10">:</span>
          <div className="flex flex-col items-center">
            <div className="bg-white/5 border border-white/10 rounded-lg w-12 py-2 text-center font-mono text-xl font-bold text-magenta">
              {formatTime(timeLeft.minutes)}
            </div>
            <span className="text-[8px] font-mono text-white/20 uppercase mt-1">MIN</span>
          </div>
          <span className="text-xl font-bold text-white/10">:</span>
          <div className="flex flex-col items-center">
            <div className="bg-white/5 border border-white/10 rounded-lg w-12 py-2 text-center font-mono text-xl font-bold text-magenta">
              {formatTime(timeLeft.seconds)}
            </div>
            <span className="text-[8px] font-mono text-white/20 uppercase mt-1">SEC</span>
          </div>
        </div>

        <div className="md:ml-auto flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-primary">UP TO 60% OFF</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Select Neural Links</p>
          </div>
          <button className="bg-white text-black p-3 rounded-xl hover:bg-magenta hover:text-white transition-all group-hover:translate-x-2">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-1 w-full bg-white/5 relative">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-magenta to-primary"
          initial={{ width: '100%' }}
          animate={{ width: '65%' }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};

export default FlashSale;

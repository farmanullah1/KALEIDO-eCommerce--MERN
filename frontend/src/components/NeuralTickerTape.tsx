import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Radio } from 'lucide-react';

export const NeuralTickerTape = () => {
  const tickerItems = [
    'QUANTUM NODE v9.4 ACTIVE AT PORTS [882.112]',
    'SECTOR 4 TRANSACTIONS BROADCASTED ON LEDGER SECURE',
    'USER_092 MANIFESTED NEURAL CALIBRATOR v1',
    'TEMPORAL COUPLING INTERNET DOCK STABILIZED // 12.8 Gb/s',
    'HYPER-LANE FREIGHT PATH STABLE IN SECTOR 9',
    'WELCOME TO KALEIDO BAZAAR // MERCHANTS VERIFIED //',
    'TOTAL ARTIFACTS SYNCED: 198,339 // DOCK VOLTAGE: OPTIMAL',
  ];

  return (
    <div className="fixed top-0 left-0 w-full h-8 bg-black/90 border-b border-primary/20 backdrop-blur-md z-[60] flex items-center overflow-hidden font-mono text-[9px] tracking-widest text-primary/80 uppercase">
      {/* Ticker status lead indicator */}
      <div className="flex items-center gap-1.5 px-4 bg-primary/10 border-r border-primary/20 h-full text-primary font-bold z-10 select-none">
        <Radio size={10} className="animate-pulse" />
        <span>LIVE VECTOR</span>
      </div>

      {/* Infinite scrolling marquee */}
      <div className="flex-1 relative flex items-center overflow-hidden h-full whitespace-nowrap">
        <motion.div
          animate={{ x: ['100%', '-100%'] }}
          transition={{
            ease: 'linear',
            duration: 35,
            repeat: Infinity,
          }}
          className="flex items-center gap-24 font-mono font-semibold"
        >
          {tickerItems.map((item, idx) => (
            <span key={idx} className="flex items-center gap-2">
              <Zap size={10} className="text-secondary animate-pulse" />
              <span>{item}</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Ticker system status badge */}
      <div className="hidden sm:flex items-center gap-1 px-4 bg-secondary/10 border-l border-primary/20 h-full text-secondary font-bold z-10 select-none">
        <ShieldCheck size={10} />
        <span>SECURED LINK</span>
      </div>
    </div>
  );
};

export default NeuralTickerTape;

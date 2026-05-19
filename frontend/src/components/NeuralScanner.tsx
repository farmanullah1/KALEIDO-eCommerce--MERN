import { motion } from 'framer-motion';
import { Shield, Zap, Target, Cpu, Activity } from 'lucide-react';

const NeuralScanner = ({ product }: { product: any }) => {
  const specs = [
    { label: 'Energy Flux', value: (product.price / 10).toFixed(1) + ' tHz', icon: Zap, color: 'text-cyan' },
    { label: 'Neural Bond', value: '98.4%', icon: Activity, color: 'text-primary' },
    { label: 'Void Index', value: '0.002', icon: Target, color: 'text-magenta' },
    { label: 'Core Version', value: 'V.8.2', icon: Cpu, color: 'text-green-400' },
  ];

  return (
    <div className="glass-card p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-magenta/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Scanner Beam */}
      <motion.div 
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 right-0 h-[1px] bg-primary/40 shadow-[0_0_15px_rgba(0,245,255,0.8)] z-10 pointer-events-none"
      />

      <div className="relative z-20">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="text-primary" size={18} />
          <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/60">Neural Telemetry</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {specs.map((spec, i) => (
            <motion.div 
              key={spec.label}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-3 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <spec.icon size={12} className={spec.color} />
                <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{spec.label}</span>
              </div>
              <p className="text-xs font-black text-white/80 font-mono">{spec.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex gap-1">
            {[...Array(12)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ height: [4, 12, 4], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                className="w-1 bg-primary rounded-full"
              />
            ))}
          </div>
          <span className="text-[8px] font-mono text-primary uppercase animate-pulse">Scanning Bio-Sync...</span>
        </div>
      </div>
    </div>
  );
};

export default NeuralScanner;

import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

interface HolographicToastProps {
  t: any;
  data: {
    type?: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING';
    message: string;
  };
}

const HolographicToast = ({ t, data }: HolographicToastProps) => {
  const getIcon = () => {
    switch (data.type) {
      case 'SUCCESS': return <CheckCircle className="text-primary" />;
      case 'ERROR': return <XCircle className="text-red-500" />;
      case 'WARNING': return <AlertTriangle className="text-yellow-500" />;
      default: return <Info className="text-cyan" />;
    }
  };

  const getBorderColor = () => {
    switch (data.type) {
      case 'SUCCESS': return 'border-primary';
      case 'ERROR': return 'border-red-500';
      case 'WARNING': return 'border-yellow-500';
      default: return 'border-cyan';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      className={`glass-card p-5 max-w-sm w-full flex items-start gap-4 border-l-4 ${getBorderColor()} relative overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.5)]`}
    >
      {/* Holographic scanning effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      
      <div className={`p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0`}>
        {getIcon()}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Neural Feed</p>
          <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
        </div>
        <p className="text-sm font-medium text-white/90 leading-tight">{data.message}</p>
      </div>

      <button 
        onClick={() => (t as any).dismiss()}
        className="absolute top-2 right-2 text-white/20 hover:text-white transition-colors"
      >
        <span className="text-[10px]">✕</span>
      </button>
    </motion.div>
  );
};

export default HolographicToast;

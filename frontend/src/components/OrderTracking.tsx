import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Truck, Package, Box, ShieldCheck } from 'lucide-react';

interface TrackingStepProps {
  status: string;
  title: string;
  desc: string;
  time: string;
  isCompleted: boolean;
  isCurrent: boolean;
  icon: any;
  index: number;
}

const TrackingStep = ({ title, desc, time, isCompleted, isCurrent, icon: Icon, index }: TrackingStepProps) => (
  <div className="relative flex gap-8 pb-12 last:pb-0">
    {/* Line */}
    <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-white/5 overflow-hidden">
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: isCompleted ? '100%' : '0%' }}
        transition={{ duration: 1, delay: index * 0.2 }}
        className="w-full bg-primary shadow-[0_0_10px_rgba(0,245,255,0.5)]"
      />
    </div>

    {/* Node */}
    <div className="relative z-10">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, delay: index * 0.2 }}
        className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${
          isCompleted ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(0,245,255,0.3)]' : 
          isCurrent ? 'bg-white/5 border-white/20 animate-pulse' : 'bg-white/5 border-white/5'
        }`}
      >
        <Icon size={20} className={isCompleted ? 'text-primary' : 'text-white/20'} />
      </motion.div>
      {isCurrent && (
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-primary/20 rounded-xl -z-10"
        />
      )}
    </div>

    {/* Content */}
    <div className="flex-1 pt-1">
      <div className="flex justify-between items-start mb-1">
        <h4 className={`text-sm font-black uppercase tracking-widest ${isCompleted ? 'text-white' : 'text-white/40'}`}>
          {title}
        </h4>
        <span className="text-[10px] font-mono text-white/20">{time}</span>
      </div>
      <p className="text-xs text-white/40 font-light leading-relaxed">{desc}</p>
    </div>
  </div>
);

const OrderTracking = ({ status }: { status: string }) => {
  const steps = [
    { key: 'pending', title: 'Manifestation Request', desc: 'Order received and being verified on the KALEIDO ledger.', icon: Clock },
    { key: 'processing', title: 'Neural Sorting', desc: 'Artifact is being retrieved from the dimensional vaults.', icon: Package },
    { key: 'shipped', title: 'Sub-space Transit', desc: 'Package has entered the hyper-lane for rapid delivery.', icon: Truck },
    { key: 'delivered', title: 'Dimensional Arrival', desc: 'Artifact successfully materialized at the target coordinates.', icon: Box },
  ];

  const getStatusIndex = (s: string) => {
    const map: any = { pending: 0, processing: 1, shipped: 2, delivered: 3 };
    return map[s] ?? 0;
  };

  const currentIndex = getStatusIndex(status);

  return (
    <div className="glass-card p-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <ShieldCheck size={120} />
      </div>
      
      <div className="flex items-center gap-4 mb-12">
        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
          <Activity className="text-primary" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter">Transit Status</h3>
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Temporal Tracking: {status.toUpperCase()}</p>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {steps.map((step, i) => (
          <TrackingStep 
            key={step.key}
            {...step}
            index={i}
            isCompleted={i < currentIndex || status === 'delivered'}
            isCurrent={i === currentIndex && status !== 'delivered'}
            time={i <= currentIndex ? 'STABLE' : 'PENDING'}
          />
        ))}
      </div>
    </div>
  );
};

import { Activity } from 'lucide-react';
export default OrderTracking;

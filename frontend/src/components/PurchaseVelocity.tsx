import { motion } from 'framer-motion';
import { Eye, Flame, ShoppingBag } from 'lucide-react';

export const PurchaseVelocity = () => {
  const viewers = Math.floor(Math.random() * 20) + 5;
  const inCart = Math.floor(Math.random() * 8) + 2;

  return (
    <div className="flex flex-wrap gap-4 mt-6">
      <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full">
        <Eye size={12} className="text-primary animate-pulse" />
        <span className="text-[10px] font-mono uppercase text-white/60">
          <span className="text-primary font-bold">{viewers}</span> VIEWING ARTIFACT
        </span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1 bg-magenta/5 border border-magenta/10 rounded-full">
        <Flame size={12} className="text-magenta animate-bounce" />
        <span className="text-[10px] font-mono uppercase text-white/60">
          <span className="text-magenta font-bold">HOT</span> ARTIFACT
        </span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1 bg-cyan/5 border border-cyan/10 rounded-full">
        <ShoppingBag size={12} className="text-cyan" />
        <span className="text-[10px] font-mono uppercase text-white/60">
          <span className="text-cyan font-bold">{inCart}</span> IN BASKETS
        </span>
      </div>
    </div>
  );
};

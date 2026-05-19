import { motion } from 'framer-motion';

const ProductSkeleton = () => {
  return (
    <div className="glass-card overflow-hidden h-full flex flex-col border-white/5 animate-pulse">
      <div className="aspect-square bg-white/5 relative">
        <div className="absolute top-3 right-3 w-10 h-10 bg-white/10 rounded-full" />
      </div>
      <div className="p-5 flex-1 flex flex-col space-y-4">
        <div className="flex justify-between">
          <div className="h-6 bg-white/10 rounded w-2/3" />
          <div className="h-6 bg-white/10 rounded w-1/4" />
        </div>
        <div className="h-4 bg-white/10 rounded w-1/3" />
        <div className="space-y-2">
          <div className="h-3 bg-white/5 rounded w-full" />
          <div className="h-3 bg-white/5 rounded w-full" />
          <div className="h-3 bg-white/5 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;

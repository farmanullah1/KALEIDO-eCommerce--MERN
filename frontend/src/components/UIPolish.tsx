import { motion } from 'framer-motion';

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full"
    />
  </div>
);

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-white/5 animate-pulse rounded-xl ${className}`} />
);

export const Checkmark = () => (
  <motion.svg
    width="80"
    height="80"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-primary"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
  >
    <motion.polyline points="20 6 9 17 4 12" />
  </motion.svg>
);

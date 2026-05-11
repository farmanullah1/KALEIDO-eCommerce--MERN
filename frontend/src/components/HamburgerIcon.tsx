import { motion } from 'framer-motion';

const HamburgerIcon = ({ isOpen, onClick }: { isOpen: boolean, onClick: () => void }) => {
  const variant = isOpen ? "opened" : "closed";
  
  const top = {
    closed: { rotate: 0, translateY: 0 },
    opened: { rotate: 45, translateY: 6 },
  };
  const center = {
    closed: { opacity: 1 },
    opened: { opacity: 0 },
  };
  const bottom = {
    closed: { rotate: 0, translateY: 0 },
    opened: { rotate: -45, translateY: -6 },
  };

  return (
    <button 
      onClick={onClick} 
      className="flex flex-col gap-1.5 justify-center items-center w-10 h-10 group"
      aria-label="Toggle menu"
    >
      <motion.div
        variants={top}
        animate={variant}
        className="w-6 h-0.5 bg-white group-hover:bg-primary transition-colors"
      />
      <motion.div
        variants={center}
        animate={variant}
        className="w-6 h-0.5 bg-white group-hover:bg-primary transition-colors"
      />
      <motion.div
        variants={bottom}
        animate={variant}
        className="w-6 h-0.5 bg-white group-hover:bg-primary transition-colors"
      />
    </button>
  );
};

export default HamburgerIcon;

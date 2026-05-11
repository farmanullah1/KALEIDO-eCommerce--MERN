import { motion } from 'framer-motion';

const ConfettiPiece = ({ color }: { color: string }) => {
  const x = (Math.random() - 0.5) * 800;
  const y = (Math.random() - 0.5) * 800;
  const rotation = Math.random() * 360;

  return (
    <motion.div
      initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
      animate={{ x, y, scale: [0, 1, 0.5], rotate: rotation + 720 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="absolute w-2 h-2 rounded-sm"
      style={{ backgroundColor: color }}
    />
  );
};

export const Confetti = () => {
  const colors = ['#00F5FF', '#FF00F5', '#7000FF', '#00FF94'];
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible">
      {[...Array(50)].map((_, i) => (
        <ConfettiPiece key={i} color={colors[i % colors.length]} />
      ))}
    </div>
  );
};

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="text-[12rem] font-black text-white/5 leading-none mb-8 select-none">404</div>
        <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase">Dimension Mismatch</h1>
        <p className="text-white/40 max-w-md mx-auto mb-12 text-lg">
          The artifact you are seeking exists in a reality we cannot yet access. 
        </p>
        <Link to="/" className="btn-primary px-12 py-4 flex items-center justify-center gap-3 mx-auto w-fit">
          <Compass className="w-6 h-6" />
          RETURN TO ORIGIN
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  image: string;
  count: number;
  delay: number;
}

const CategoryCard = ({ name, image, count, delay }: CategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative aspect-[4/5] rounded-3xl overflow-hidden group cursor-pointer"
    >
      <img 
        src={image} 
        alt={name} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />
      
      <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <p className="text-[10px] font-mono text-primary uppercase tracking-[0.3em] mb-2">{count} Artifacts</p>
        <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">{name}</h3>
        
        <Link 
          to={`/search?category=${name.toLowerCase()}`}
          className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        >
          ENTER DIMENSION <ArrowRight size={14} className="text-primary" />
        </Link>
      </div>
      
      <div className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <ArrowRight size={20} className="-rotate-45" />
      </div>
    </motion.div>
  );
};

export default CategoryCard;

import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe, Cpu } from 'lucide-react';

const brands = [
  { name: 'KALEIDO LABS', icon: Globe },
  { name: 'NEURAL NODE', icon: Cpu },
  { name: 'VOID SYNC', icon: Zap },
  { name: 'ORIGIN CORE', icon: ShieldCheck },
];

const BrandSection = () => {
  return (
    <div className="py-20 border-y border-white/5 bg-white/[0.01]">
      <div className="container mx-auto px-6">
        <p className="text-[10px] font-mono text-center text-white/20 uppercase tracking-[0.5em] mb-12">Authorized Dimension Partners</p>
        <div className="flex flex-wrap justify-center gap-12 md:gap-24">
          {brands.map((brand, i) => (
            <motion.div 
              key={brand.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.4 }}
              whileHover={{ opacity: 1, scale: 1.05 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all cursor-default"
            >
              <brand.icon className="text-primary" size={24} />
              <span className="text-xl font-black tracking-tighter text-white">{brand.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandSection;

import { motion } from 'framer-motion';
import { useCompareStore } from '../store/compareStore';
import { ArrowLeft, ArrowRightLeft, Shield, Zap, Cpu, BarChart3, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { fadeUp, staggerContainer } from '../lib/animations';

const Compare = () => {
  const { items, removeItem, clear } = useCompareStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10">
          <ArrowRightLeft className="text-white/20" size={48} />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Matrix Empty</h1>
        <p className="text-white/40 max-w-md mb-8">No artifacts selected for cross-dimensional analysis. Return to the marketplace to populate the comparison matrix.</p>
        <button onClick={() => navigate('/products')} className="btn-primary px-12 py-4">Return to Marketplace</button>
      </div>
    );
  }

  const specs = [
    { label: 'DESIGNATION', key: 'name', icon: Zap },
    { label: 'VALUATION', key: 'price', prefix: '$', color: 'text-primary', icon: Shield },
    { label: 'CATALOGUE', key: 'category', icon: Cpu },
    { label: 'AVAILABILITY', key: 'stock', suffix: ' Units', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6 lg:px-12">
      <SEO title="Comparison Matrix" />
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-4 font-mono text-xs uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Revert To Origin
            </button>
            <h1 className="text-5xl font-black uppercase tracking-tighter">Comparison Matrix</h1>
            <p className="text-white/40 font-mono text-sm uppercase tracking-widest">Cross-dimensional Artifact Analysis</p>
          </div>
          <button 
            onClick={clear}
            className="text-xs font-bold text-red-500/60 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-2 px-6 py-3 bg-red-500/5 border border-red-500/10 rounded-xl"
          >
            <Trash2 size={14} /> Dissolve Matrix
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item._id}
              variants={fadeUp}
              custom={i}
              className="flex flex-col h-full"
            >
              {/* Product Header */}
              <div className="glass-card overflow-hidden mb-6 relative group">
                <div className="h-64 bg-black relative">
                  <img src={item.images[0]} alt="" className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <button 
                    onClick={() => removeItem(item._id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center text-white/40 hover:text-red-500 transition-all z-10"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold uppercase tracking-tighter mb-2">{item.name}</h3>
                  <p className="text-2xl font-black text-primary">${item.price}</p>
                </div>
              </div>

              {/* Specs Table */}
              <div className="space-y-4 flex-1">
                {specs.map((spec, si) => (
                  <div key={si} className="glass-card p-4 border-white/5 hover:bg-white/5 transition-colors">
                    <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-1 flex items-center gap-2">
                      <spec.icon size={10} /> {spec.label}
                    </p>
                    <p className={`font-bold ${spec.color || 'text-white'}`}>
                      {spec.prefix}{item[spec.key]}{spec.suffix}
                    </p>
                  </div>
                ))}
                
                {/* Tech Details */}
                <div className="glass-card p-4 border-white/5 flex-1">
                   <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-3">TECHNICAL ATTRIBUTES</p>
                   <div className="space-y-3">
                      {Object.entries(item.details || {}).map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center text-[10px] font-mono uppercase">
                          <span className="text-white/30">{key}</span>
                          <span className="text-white/60">{val}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <button 
                onClick={() => navigate(`/products/${item._id}`)}
                className="w-full mt-6 py-4 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-background transition-all"
              >
                Full Access Spec
              </button>
            </motion.div>
          ))}
          
          {items.length < 4 && (
            <motion.div
              variants={fadeUp}
              custom={items.length}
              onClick={() => navigate('/products')}
              className="glass-card border-dashed border-2 border-white/10 flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-primary/50 transition-all h-full"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ArrowRightLeft className="text-white/10 group-hover:text-primary transition-colors" size={32} />
              </div>
              <p className="text-xs font-bold text-white/20 uppercase tracking-widest group-hover:text-white transition-colors">Integrate Another Artifact</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Compare;

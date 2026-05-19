import { motion, AnimatePresence } from 'framer-motion';
import { useCompareStore } from '../store/compareStore';
import { X, ArrowRightLeft, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CompareBar = () => {
  const { items, removeItem, clear, isOpen, setIsOpen } = useCompareStore();
  const navigate = useNavigate();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[90]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="bg-background/90 backdrop-blur-2xl border-t border-white/10 p-6 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="container mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                    <ArrowRightLeft className="text-primary" size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-white">Comparison Matrix</h4>
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{items.length} / 4 Artifacts Selected</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={clear}
                    className="text-[10px] font-bold text-white/20 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-2"
                  >
                    <Trash2 size={12} /> Dissolve All
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <ChevronDown size={20} className="text-white/40" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center">
                {items.map((item) => (
                  <motion.div 
                    layout
                    key={item._id}
                    className="glass-card p-3 relative group"
                  >
                    <button 
                      onClick={() => removeItem(item._id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <X size={12} />
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 border border-white/5">
                        <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-white truncate uppercase">{item.name}</p>
                        <p className="text-[10px] font-mono text-primary">${item.price}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <div className="lg:col-start-5">
                  <button 
                    onClick={() => navigate('/compare')}
                    disabled={items.length < 2}
                    className="w-full py-4 bg-primary text-background font-black tracking-tighter uppercase rounded-xl hover:bg-secondary transition-all disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-2"
                  >
                    Analyze <ArrowRightLeft size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={() => setIsOpen(true)}
          className="mx-auto mb-8 bg-primary/20 backdrop-blur-xl border border-primary/30 px-6 py-3 rounded-full flex items-center gap-3 hover:bg-primary hover:text-background transition-all group"
        >
          <ArrowRightLeft size={16} className="group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-xs font-bold uppercase tracking-widest">Open Comparison Matrix ({items.length})</span>
          <ChevronUp size={16} />
        </motion.button>
      )}
    </div>
  );
};

export default CompareBar;

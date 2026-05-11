import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Check, X, Eye, Clock, AlertCircle, Filter, Search, 
  ExternalLink, ChevronRight, Package, User 
} from 'lucide-react';
import { getProducts, updateProductModeration } from '../../api/products.api';
import { LoadingSpinner } from '../../components/UIPolish';
import { fadeUp, staggerContainer } from '../../lib/animations';
import toast from 'react-hot-toast';

const ModerationQueue = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const fetchPendingProducts = async () => {
    try {
      const { data } = await getProducts({ moderationStatus: 'pending' });
      setProducts(data.data);
    } catch (error) {
      console.error('Failed to fetch pending products', error);
      toast.error('Failed to load moderation queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const handleModeration = async (id: string, status: 'active' | 'rejected') => {
    try {
      await updateProductModeration(id, status);
      toast.success(`Artifact ${status === 'active' ? 'approved' : 'rejected'}`);
      setProducts(products.filter(p => p._id !== id));
      if (selectedProduct?._id === id) setSelectedProduct(null);
    } catch (error) {
      toast.error('Moderation action failed');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6 lg:px-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 uppercase tracking-tighter">Moderation Queue</h1>
            <p className="text-white/40 font-mono text-sm uppercase tracking-widest">
              Review and authorize pending digital assets • {products.length} Items Pending
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search queue..." 
                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-12 pr-4 outline-none focus:border-primary/50 text-sm"
              />
            </div>
            <button className="glass-card px-4 py-2 flex items-center gap-2 text-sm">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* List Section */}
          <div className="lg:col-span-7 space-y-4">
            <AnimatePresence mode="popLayout">
              {products.length > 0 ? (
                products.map((product, i) => (
                  <motion.div
                    key={product._id}
                    layout
                    variants={fadeUp}
                    custom={i}
                    onClick={() => setSelectedProduct(product)}
                    className={`glass-card p-4 cursor-pointer transition-all border-l-4 ${
                      selectedProduct?._id === product._id ? 'bg-white/10 border-primary' : 'hover:bg-white/5 border-yellow-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/40 border border-white/10">
                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-lg">{product.name}</h4>
                          <span className="text-xs font-mono text-white/20">{new Date(product.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-white/40 font-mono">
                          <span className="flex items-center gap-1"><User size={12} /> {product.sellerId?.name || 'Unknown Seller'}</span>
                          <span className="flex items-center gap-1"><Package size={12} /> {product.category}</span>
                          <span className="text-primary">${product.price}</span>
                        </div>
                      </div>
                      <ChevronRight size={20} className={`text-white/20 ${selectedProduct?._id === product._id ? 'rotate-90 text-primary' : ''} transition-all`} />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="glass-card py-20 text-center">
                  <Shield className="mx-auto mb-4 text-green-500 opacity-20" size={64} />
                  <p className="text-white/40 text-lg uppercase tracking-widest font-mono">Queue Cleared</p>
                  <p className="text-white/20 text-sm">No artifacts awaiting moderation.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Details/Preview Section */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <AnimatePresence mode="wait">
                {selectedProduct ? (
                  <motion.div
                    key={selectedProduct._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="glass-card overflow-hidden"
                  >
                    <div className="h-64 bg-black relative">
                      <img src={selectedProduct.images[0]} alt="" className="w-full h-full object-contain" />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 rounded-full text-[10px] font-bold tracking-widest uppercase">
                          Pending
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <div className="mb-6">
                        <h2 className="text-3xl font-bold mb-2">{selectedProduct.name}</h2>
                        <div className="flex items-center gap-3 mb-4">
                           <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                              <User size={14} className="text-primary" />
                           </div>
                           <div>
                              <p className="text-xs text-white/40 font-mono">SUBMITTED BY</p>
                              <p className="text-sm font-bold">{selectedProduct.sellerId?.name || 'Authorized Vendor'}</p>
                           </div>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mb-6">
                          {selectedProduct.description || 'No description provided by the seller for this artifact.'}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <p className="text-[10px] text-white/20 font-mono mb-1">UNIT PRICE</p>
                            <p className="text-xl font-bold text-cyan">${selectedProduct.price}</p>
                          </div>
                          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <p className="text-[10px] text-white/20 font-mono mb-1">STOCK ALLOC</p>
                            <p className="text-xl font-bold text-magenta">{selectedProduct.stock}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button 
                          onClick={() => handleModeration(selectedProduct._id, 'rejected')}
                          className="flex-1 py-4 bg-red-500/10 border border-red-500/20 text-red-500 font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <X size={18} /> REJECT
                        </button>
                        <button 
                          onClick={() => handleModeration(selectedProduct._id, 'active')}
                          className="flex-1 py-4 bg-green-500/10 border border-green-500/20 text-green-500 font-bold rounded-xl hover:bg-green-500 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <Check size={18} /> APPROVE
                        </button>
                      </div>
                      
                      <button className="w-full mt-4 py-3 text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2">
                        <Eye size={14} /> View Full Artifact Specs
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="glass-card p-12 text-center border-dashed border-2 border-white/5">
                    <Clock className="mx-auto mb-4 text-white/10" size={48} />
                    <p className="text-white/20 text-sm font-mono uppercase">Select an item to preview details</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ModerationQueue;

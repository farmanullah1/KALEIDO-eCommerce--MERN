import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Link, useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { cart, isDrawerOpen, toggleDrawer, removeItem, updateQuantity } = useCartStore();
  const navigate = useNavigate();

  const totalItems = cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleDrawer(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[1000]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[450px] bg-background border-l border-white/5 shadow-2xl z-[1001] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-primary" />
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tighter">Collection Buffer</h2>
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{totalItems} ARTIFACTS SYNCED</p>
                </div>
              </div>
              <button 
                onClick={() => toggleDrawer(false)}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {cart?.items?.length > 0 ? (
                cart.items.map((item: any) => (
                  <motion.div 
                    layout
                    key={item._id}
                    className="flex gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/5">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm truncate pr-2">{item.product.name}</h4>
                        <button 
                          onClick={() => removeItem(item._id)}
                          className="text-white/20 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <p className="text-[10px] font-mono text-white/20 uppercase mb-3">{item.product.category}</p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 bg-white/5 rounded-lg px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="text-white/40 hover:text-white transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-mono w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="text-white/40 hover:text-white transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="font-mono text-sm font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/5">
                    <ShoppingBag size={32} className="text-white/10" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">BUFFER EMPTY</h3>
                  <p className="text-white/20 text-xs font-mono uppercase tracking-widest max-w-[200px]">No artifacts detected in your current session.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart?.items?.length > 0 && (
              <div className="p-6 bg-white/[0.02] border-t border-white/5 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/40 font-mono uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black uppercase tracking-tighter">Total Valuation</span>
                    <span className="text-2xl font-black text-primary font-mono">${cart.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => { toggleDrawer(false); navigate('/cart'); }}
                    className="py-4 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    View Buffer
                  </button>
                  <button 
                    onClick={() => { toggleDrawer(false); navigate('/checkout'); }}
                    className="btn-primary py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 group"
                  >
                    Authorize <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                
                <p className="text-[9px] text-center text-white/20 font-mono uppercase tracking-widest">
                  Secure transmission guaranteed by KALEIDO PROTOCOL
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

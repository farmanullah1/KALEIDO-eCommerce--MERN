import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../api/axios.js';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '../components/UIPolish.js';

const CartItem = ({ item, onUpdate, onRemove }: { item: any, onUpdate: any, onRemove: any }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="glass-card p-6 flex flex-col sm:flex-row items-center gap-6 mb-4"
    >
      <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
        <img src={item.product.images[0]} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-xl font-bold mb-1">{item.product.name}</h3>
        <p className="text-white/40 text-sm mb-2">{item.product.category}</p>
        <p className="text-primary font-mono font-bold">${item.price}</p>
      </div>

      <div className="flex items-center gap-4 bg-white/5 rounded-lg px-3 py-1">
        <button onClick={() => onUpdate(item._id, item.quantity - 1)} className="p-1 hover:text-primary transition-colors" aria-label="Decrease quantity">
          <Minus className="w-4 h-4" />
        </button>
        <span className="font-mono font-bold w-6 text-center">{item.quantity}</span>
        <button onClick={() => onUpdate(item._id, item.quantity + 1)} className="p-1 hover:text-primary transition-colors" aria-label="Increase quantity">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <button onClick={() => onRemove(item._id)} className="p-2 text-white/20 hover:text-red-500 transition-colors" aria-label="Remove item">
        <Trash2 className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

const Cart = () => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setCart(data.data);
    } catch (error) {
      console.error('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await api.put(`/cart/${itemId}`, { quantity });
      fetchCart();
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await api.delete(`/cart/${itemId}`);
      toast.success('Artifact removed from collection');
      fetchCart();
    } catch (error) {
      toast.error('Failed to remove artifact');
    }
  };

  const applyPromo = async () => {
    try {
      await api.post('/cart/promo', { code: promoCode });
      toast.success('Promo ritual successful');
      fetchCart();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid promo code');
    }
  };

  const subtotal = cart?.items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0) || 0;
  const discount = (subtotal * (cart?.discountPct || 0)) / 100;
  const shipping = subtotal > 50 ? 0 : 4.99;
  const total = subtotal - discount + shipping;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  if (!cart || cart.items.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8">
        <ShoppingBag className="w-10 h-10 text-white/20" />
      </div>
      <h2 className="text-4xl font-black mb-4">CART IS EMPTY</h2>
      <p className="text-white/40 mb-12 max-w-md">Your collection is currently manifesting. Explore the dimension to find artifacts.</p>
      <Link to="/" className="btn-primary px-12 py-4">Return to Dimension</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-black mb-12 tracking-tighter">YOUR COLLECTION</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Item List */}
          <div className="lg:col-span-2">
            <AnimatePresence>
              {cart.items.map((item: any) => (
                <CartItem 
                  key={item._id} 
                  item={item} 
                  onUpdate={updateQuantity} 
                  onRemove={removeItem} 
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6 pb-6 border-b border-white/5 uppercase tracking-tighter">Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span className="font-mono">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-secondary">
                    <span>Discount ({cart.discountPct}%)</span>
                    <span className="font-mono">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span className="font-mono">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary font-mono">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="flex gap-2 mb-8">
                <input 
                  type="text" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="PROMO CODE"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <button onClick={applyPromo} className="px-4 py-2 bg-white/10 rounded-lg text-sm font-bold hover:bg-white/20 transition-colors">APPLY</button>
              </div>

              <Link to="/checkout" className="btn-primary w-full py-4 flex items-center justify-center gap-3">
                CHECKOUT
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Secure Badge */}
            <div className="glass-card p-6 flex items-center gap-4 text-white/40">
              <ShieldCheck className="w-8 h-8 text-primary/50" />
              <p className="text-xs font-medium leading-relaxed">
                Transactions are encrypted and secured via KALEIDO Sentinel technology.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

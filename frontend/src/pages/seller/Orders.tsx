import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Search, Filter, ExternalLink, ChevronRight, 
  CheckCircle, Truck, Clock, AlertCircle, ShoppingBag, User
} from 'lucide-react';
import { getSellerOrders, updateSellerOrderStatus } from '../../api/orders.api';
import { LoadingSpinner } from '../../components/UIPolish';
import { fadeUp, staggerContainer } from '../../lib/animations';
import toast from 'react-hot-toast';

const SellerOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      const { data } = await getSellerOrders();
      setOrders(data.data);
    } catch (error) {
      console.error('Failed to fetch seller orders', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateSellerOrderStatus(id, status);
      toast.success(`Order marked as ${status}`);
      // Refresh local state
      setOrders(orders.map(order => 
        order._id === id ? { ...order, status } : order
      ));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'shipped': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'processing': return 'text-cyan bg-cyan/10 border-cyan/20';
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-white/40 bg-white/5 border-white/10';
    }
  };

  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-4xl font-bold mb-2 uppercase tracking-tighter">Marketplace Orders</h1>
            <p className="text-white/40 font-mono text-sm uppercase tracking-widest">
              Fulfillment Control Center • {orders.length} Total Orders
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search order ID or customer..." 
                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-12 pr-4 outline-none focus:border-primary/50 text-sm w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="glass-card px-4 py-2 flex items-center gap-2 text-sm">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, i) => (
                <motion.div
                  key={order._id}
                  layout
                  variants={fadeUp}
                  custom={i}
                  className="glass-card overflow-hidden group hover:border-primary/30 transition-all"
                >
                  <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                        <ShoppingBag className="text-primary" size={32} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-bold text-lg">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</h4>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-white/40 font-mono">
                          <span className="flex items-center gap-1"><User size={12} /> {order.user.name}</span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {new Date(order.createdAt).toLocaleString()}</span>
                          <span className="text-white/60">{order.items.length} Items for this shop</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-[10px] text-white/20 font-mono uppercase mb-1">Seller Subtotal</p>
                        <p className="text-2xl font-bold text-cyan">${order.sellerSubtotal.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-2">
                           <select 
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-primary/50"
                           >
                             <option value="pending">Pending</option>
                             <option value="processing">Processing</option>
                             <option value="shipped">Shipped</option>
                             <option value="delivered">Delivered</option>
                             <option value="cancelled">Cancelled</option>
                           </select>
                           <button className="p-2 glass-card text-white/20 hover:text-primary transition-colors">
                            <ExternalLink size={14} />
                           </button>
                         </div>
                         <button className="text-[10px] font-bold text-white/20 hover:text-white transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                           View Details <ChevronRight size={12} />
                         </button>
                      </div>
                    </div>
                  </div>

                  {/* Item Preview Row */}
                  <div className="bg-white/5 border-t border-white/5 p-4 overflow-x-auto">
                    <div className="flex gap-4">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 bg-black/20 p-2 rounded-lg border border-white/5 min-w-[200px]">
                          <img src={item.image} alt="" className="w-10 h-10 rounded object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{item.name}</p>
                            <p className="text-[10px] text-white/40 font-mono">${item.price} x {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="glass-card py-32 text-center border-dashed border-2 border-white/5">
                <ShoppingBag className="mx-auto mb-4 text-white/10" size={64} />
                <p className="text-white/40 text-lg uppercase tracking-widest font-mono">No Orders Found</p>
                <p className="text-white/20 text-sm">When customers purchase your artifacts, they will appear here.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default SellerOrders;

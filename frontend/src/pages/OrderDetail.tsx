import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, CheckCircle2, Clock, MapPin, Activity, Shield, Box, Anchor as AnchorIcon } from 'lucide-react';
import api from '../api/axios';
import { LoadingSpinner } from '../components/UIPolish';
import SEO from '../components/SEO';
import OrderTracking from '../components/OrderTracking';
import { fadeUp, staggerContainer } from '../lib/animations';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.data);
      } catch (error) {
        console.error('Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center">Order not found</div>;

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <SEO title={`Order #${id?.slice(-8)}`} />
      <div className="container mx-auto px-6 max-w-5xl">
        <Link to="/profile" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors mb-12 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-mono uppercase tracking-widest">Return to Profile</span>
        </Link>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12"
        >
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div variants={fadeUp} className="glass-card p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-cyan" />
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                  <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] mb-2">Signature Hash</p>
                  <h1 className="text-2xl font-black tracking-tighter uppercase font-mono text-primary">{order._id}</h1>
                </div>
                <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl">
                  <p className="text-[10px] font-mono text-primary/60 uppercase mb-1">Status</p>
                  <p className="text-sm font-bold uppercase tracking-widest">{order.status}</p>
                </div>
              </div>

              {/* Futuristic Progress Tracker */}
              <motion.div variants={fadeUp} className="mt-8">
                <OrderTracking status={order.status} />
              </motion.div>
            </motion.div>

            {/* Artifacts List */}
            <motion.div variants={fadeUp} className="glass-card p-8">
              <h3 className="text-xl font-bold mb-8 uppercase tracking-tighter flex items-center gap-3">
                <Box className="text-magenta" size={20} /> Encapsulated Artifacts
              </h3>
              <div className="space-y-6">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-6 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm mb-1">{item.product.name}</h4>
                      <p className="text-xs text-white/40 font-mono italic">Dimension: {item.product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-bold text-primary">${item.price}</p>
                      <p className="text-[10px] text-white/20 font-mono">QTY: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <motion.div variants={fadeUp} className="glass-card p-8 space-y-6">
              <h3 className="text-lg font-bold uppercase tracking-tighter flex items-center gap-2">
                <MapPin className="text-cyan" size={18} /> Destination
              </h3>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-sm leading-relaxed text-white/60 font-mono uppercase text-[11px]">
                  {order.shippingAddress}
                </p>
              </div>
              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/40 font-mono">Protocol</span>
                  <span className="text-white/80 uppercase">Standard Transmission</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/40 font-mono">Transit ID</span>
                  <span className="text-primary font-mono">KAL-{order._id.slice(-6).toUpperCase()}</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="glass-card p-8 space-y-6 bg-primary/5 border-primary/20">
              <h3 className="text-lg font-bold uppercase tracking-tighter">Value Exchange</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Subtotal</span>
                  <span className="font-mono">${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Transit Fee</span>
                  <span className="font-mono text-green-500">FREE</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="font-black uppercase tracking-widest text-sm">Total Value</span>
                  <span className="text-xl font-black text-primary font-mono">${order.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="pt-6">
                <div className="flex items-center gap-2 text-[10px] font-mono text-primary uppercase animate-pulse">
                  <Shield size={12} /> Transaction Secured
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetail;

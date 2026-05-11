import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore.js';
import { useWishlistStore } from '../store/wishlistStore.js';
import { User, Package, Heart, Settings, Shield, LogOut, Activity, MapPin, Clock, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import { LoadingSpinner } from '../components/UIPolish.js';
import { fadeUp, staggerContainer } from '../lib/animations.js';
import SEO from '../components/SEO.js';

const Profile = () => {
  const { user, logout } = useAuthStore();
  const { wishlist } = useWishlistStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data.data);
      } catch (error) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><LoadingSpinner /></div>;

  const stats = [
    { label: 'Artifacts Collected', value: orders.length, icon: Package, color: 'primary' },
    { label: 'Manifested Dreams', value: wishlist.length, icon: Heart, color: 'magenta' },
    { label: 'Neural Standing', value: user?.role === 'admin' ? 'Overlord' : user?.role === 'seller' ? 'Merchant' : 'Citizen', icon: Shield, color: 'cyan' },
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <SEO title="User Profile" />
      <div className="container mx-auto max-w-6xl px-6">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-4 gap-12"
        >
          {/* Sidebar */}
          <motion.div variants={fadeUp} className="lg:col-span-1 space-y-6">
            <div className="glass-card p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-magenta to-cyan" />
              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 mx-auto mb-6 flex items-center justify-center relative group">
                <User size={48} className="text-white/20" />
                <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Settings size={16} className="text-white" />
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-background" />
              </div>
              <h2 className="text-2xl font-black tracking-tighter uppercase">{user?.name}</h2>
              <p className="text-white/40 font-mono text-xs uppercase tracking-widest mt-1">{user?.email}</p>
              
              <div className="mt-8 pt-8 border-t border-white/5 space-y-2">
                <button className="btn-secondary w-full py-2 text-xs flex items-center justify-center gap-2">
                  <Settings size={14} /> EDIT PROFILE
                </button>
                <button onClick={logout} className="w-full py-2 text-xs font-bold text-red-500/50 hover:text-red-500 transition-colors flex items-center justify-center gap-2">
                  <LogOut size={14} /> TERMINATE SESSION
                </button>
              </div>
            </div>

            <div className="glass-card p-6">
              <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-4 text-center">Neural Link Stats</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/20">SYNC RATE</span>
                    <span className="text-primary">98.4%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '98.4%' }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-white/20">LATENCY</span>
                  <span className="text-cyan">14MS</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-white/20">UPTIME</span>
                  <span className="text-magenta">99.9%</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, i) => (
                <motion.div 
                  key={i}
                  variants={fadeUp}
                  className="glass-card p-6 flex items-center gap-4 relative group cursor-pointer"
                >
                  <div className={`p-3 rounded-xl bg-${stat.color}/10 text-${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Orders */}
            <motion.div variants={fadeUp} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-tighter uppercase italic">Mission History</h3>
                <Link to="/orders" className="text-xs font-mono text-primary hover:underline flex items-center gap-1">
                  VIEW ALL RECORDS <ChevronRight size={14} />
                </Link>
              </div>

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order._id} className="glass-card p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-white/20 transition-all">
                      <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                        <Activity className="text-primary/50 group-hover:text-primary animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-bold uppercase">Order #{order._id.substring(order._id.length - 8)}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                            order.status === 'delivered' ? 'border-green-500/50 text-green-500' : 'border-yellow-500/50 text-yellow-500'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-white/40 font-mono">
                          {order.items.length} Artifacts • ${order.total.toFixed(2)}
                        </p>
                      </div>
                      <Link to={`/orders/${order._id}`} className="btn-secondary px-6 py-2 text-[10px] font-bold">
                        VIEW DEBRIEF
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-12 text-center">
                  <Package size={48} className="mx-auto mb-4 text-white/10" />
                  <p className="text-white/40">No mission records found in this dimension.</p>
                </div>
              )}
            </motion.div>

            {/* Quick Settings */}
            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-8">
                <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Shield size={20} className="text-cyan" /> SECURITY ARCHIVE
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                    <div>
                      <p className="text-sm font-bold">Two-Factor Authentication</p>
                      <p className="text-[10px] text-white/40">Add a layer of neural protection</p>
                    </div>
                    <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-3 h-3 bg-white/20 rounded-full" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                    <div>
                      <p className="text-sm font-bold">Biometric Anchor</p>
                      <p className="text-[10px] text-white/40">Lock account to physical signature</p>
                    </div>
                    <div className="w-10 h-5 bg-primary/20 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-primary rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="glass-card p-8">
                <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Settings size={20} className="text-magenta" /> PREFERENCES
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                    <div>
                      <p className="text-sm font-bold">Neural Notifications</p>
                      <p className="text-[10px] text-white/40">Direct psychic alerts for orders</p>
                    </div>
                    <div className="w-10 h-5 bg-primary/20 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-primary rounded-full" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                    <div>
                      <p className="text-sm font-bold">Holographic UI</p>
                      <p className="text-[10px] text-white/40">Enable advanced volumetric effects</p>
                    </div>
                    <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white/20 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;

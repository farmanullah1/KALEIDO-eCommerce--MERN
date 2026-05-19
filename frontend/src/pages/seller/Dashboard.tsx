import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, Users, Box, DollarSign, Package, Clock, CheckCircle, AlertCircle 
} from 'lucide-react';
import { getSellerStats } from '../../api/seller.api';
import { useAuthStore } from '../../store/authStore';
import { LoadingSpinner } from '../../components/UIPolish';
import { fadeUp, staggerContainer } from '../../lib/animations';

const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
  <motion.div
    variants={fadeUp}
    custom={delay}
    className="glass-card p-6 relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 group-hover:opacity-20 transition-opacity bg-${color}`} />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-white/40 text-sm font-mono uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-${color}/10 text-${color}`}>
        <Icon size={24} />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2 text-xs font-mono">
      <TrendingUp size={14} className="text-green-500" />
      <span className="text-green-500">+12.5%</span>
      <span className="text-white/20">vs last month</span>
    </div>
  </motion.div>
);

const SellerDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getSellerStats();
        setStats(data.data);
      } catch (error) {
        console.error('Failed to fetch seller stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingSpinner size="large" />
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
            <h1 className="text-4xl font-bold mb-2">SELLER PORTAL</h1>
            <p className="text-white/40 font-mono text-sm uppercase tracking-widest">
              {user?.sellerInfo?.shopName || 'Marketplace'} Control Center • Welcome back, {user?.name}
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/seller/inventory" className="btn-secondary px-6 py-2 text-sm flex items-center gap-2">
              <Package size={18} /> Manage Inventory
            </Link>
            <Link to="/seller/add-product" className="btn-primary px-6 py-2 text-sm flex items-center gap-2">
              <Plus size={18} /> Add Product
            </Link>
          </div>
        </div>

        {!user?.sellerInfo?.isApproved && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-2xl mb-10 flex items-center gap-6"
          >
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-yellow-500 uppercase tracking-widest">Awaiting Authorization</h3>
              <p className="text-sm text-white/60">Your merchant credentials are currently under review by the KALEIDO Overlords. Some features may be restricted until approval.</p>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Lifetime Earnings" 
            value={`$${stats?.totalEarnings?.toLocaleString()}`} 
            icon={DollarSign} 
            color="primary"
            delay={0}
          />
          <StatCard 
            title="Active Products" 
            value={stats?.activeProducts} 
            icon={CheckCircle} 
            color="green-500"
            delay={1}
          />
          <StatCard 
            title="Pending Moderation" 
            value={stats?.pendingProducts} 
            icon={Clock} 
            color="yellow-500"
            delay={2}
          />
          <StatCard 
            title="Store Health" 
            value={stats?.storeHealth} 
            icon={TrendingUp} 
            color="cyan"
            delay={3}
          />
        </div>

        {/* Charts & Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sales Chart */}
          <motion.div 
            variants={fadeUp}
            custom={4}
            className="lg:col-span-2 glass-card p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Sales Performance</h3>
              <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-1 text-sm outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(255,255,255,0.4)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.4)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 15, 15, 0.95)', 
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)'
                    }}
                    itemStyle={{ color: 'var(--accent-cyan)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="var(--accent-cyan)" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Orders */}
          <motion.div 
            variants={fadeUp}
            custom={5}
            className="glass-card p-8"
          >
            <h3 className="text-xl font-bold mb-6">Recent Orders</h3>
            <div className="space-y-6">
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.map((order: any) => (
                  <div key={order._id} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Package size={18} className="text-white/60 group-hover:text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Order #{order._id.substring(order._id.length - 6)}</p>
                        <p className="text-xs text-white/40">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-sm">${order.total}</p>
                      <p className={`text-[10px] uppercase font-bold ${
                        order.status === 'delivered' ? 'text-green-500' : 'text-yellow-500'
                      }`}>{order.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto mb-4 text-white/20" size={40} />
                  <p className="text-white/40">No recent orders</p>
                </div>
              )}
            </div>
            <Link to="/seller/orders" className="w-full mt-8 py-3 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-primary transition-colors border-t border-white/5 flex items-center justify-center">
              View All Orders
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const Plus = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default SellerDashboard;

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Users, Box, DollarSign, Shield, Activity, ShieldCheck, UserPlus, FileText 
} from 'lucide-react';
import { getAdminStats } from '../../api/admin.api';
import { LoadingSpinner } from '../../components/UIPolish';
import { fadeUp, staggerContainer } from '../../lib/animations';

const AdminStatCard = ({ title, value, icon: Icon, color, delay }: any) => (
  <motion.div
    variants={fadeUp}
    custom={delay}
    className="glass-card p-6 border-white/5"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg bg-${color}/10 text-${color}`}>
        <Icon size={24} />
      </div>
      <div className="text-right">
        <p className="text-white/40 text-[10px] uppercase font-mono tracking-widest">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full bg-${color} w-2/3`} />
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getAdminStats();
        setStats(data.data);
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
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
            <h1 className="text-4xl font-bold mb-2">SYSTEM COMMAND</h1>
            <p className="text-white/40 font-mono text-sm uppercase tracking-widest">
              Global Platform Administration • Root Access
            </p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Link to="/admin/users" className="btn-secondary px-6 py-2 text-sm flex items-center gap-2">
              <Users size={18} /> User Management
            </Link>
            <Link to="/admin/categories" className="btn-secondary px-6 py-2 text-sm flex items-center gap-2">
              <Box size={18} /> Category Matrix
            </Link>
            <Link to="/admin/moderation" className="btn-primary px-6 py-2 text-sm flex items-center gap-2 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <ShieldCheck size={18} /> Moderation Queue
              {stats?.pendingProducts > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">
                  {stats.pendingProducts}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <AdminStatCard 
            title="Total Revenue" 
            value={`$${stats?.totalRevenue?.toLocaleString()}`} 
            icon={DollarSign} 
            color="primary"
            delay={0}
          />
          <AdminStatCard 
            title="Registered Users" 
            value={stats?.totalUsers} 
            icon={Users} 
            color="cyan"
            delay={1}
          />
          <AdminStatCard 
            title="Active Sellers" 
            value={stats?.totalSellers} 
            icon={UserPlus} 
            color="magenta"
            delay={2}
          />
          <AdminStatCard 
            title="Total Catalog" 
            value={stats?.totalProducts} 
            icon={Box} 
            color="green-500"
            delay={3}
          />
        </div>

        {/* Revenue Visualization */}
        <motion.div 
          variants={fadeUp}
          custom={4}
          className="glass-card p-8 mb-10"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Revenue Distribution</h3>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Activity size={14} className="text-primary" />
              <span>LIVE SYSTEM TRAFFIC</span>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.revenueData}>
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
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 15, 15, 0.95)', 
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                  {stats?.revenueData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--accent-cyan)' : 'var(--accent-magenta)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'User Permissions', icon: Shield, desc: 'Manage global access control and roles.' },
            { title: 'Marketplace Logs', icon: FileText, desc: 'Audit trail for all platform transactions.' },
            { title: 'System Security', icon: ShieldCheck, desc: 'Configure 2FA and encryption policies.' },
          ].map((action, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={5 + i}
              className="glass-card p-6 flex gap-4 hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <action.icon size={24} className="text-primary" />
              </div>
              <div>
                <h4 className="font-bold mb-1">{action.title}</h4>
                <p className="text-xs text-white/40 leading-relaxed">{action.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;

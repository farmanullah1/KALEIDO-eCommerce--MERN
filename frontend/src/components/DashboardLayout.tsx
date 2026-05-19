import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingBag, Settings, 
  Users, ShieldCheck, Grid, MessageSquare, Bell, 
  ChevronRight, LogOut, Menu, X 
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
  type: 'seller' | 'admin';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, type }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const sellerLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/seller/dashboard' },
    { name: 'Inventory', icon: Package, path: '/seller/inventory' },
    { name: 'Orders', icon: ShoppingBag, path: '/seller/orders' },
    { name: 'Settings', icon: Settings, path: '/seller/settings' },
  ];

  const adminLinks = [
    { name: 'Command Center', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'User Archive', icon: Users, path: '/admin/users' },
    { name: 'Moderation', icon: ShieldCheck, path: '/admin/moderation' },
    { name: 'Matrix Nodes', icon: Grid, path: '/admin/categories' },
    { name: 'Global Settings', icon: Settings, path: '/admin/settings' },
  ];

  const links = type === 'seller' ? sellerLinks : adminLinks;

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="fixed top-0 left-0 h-full bg-black/40 backdrop-blur-xl border-r border-white/5 z-50 flex flex-col pt-20 pb-10 transition-all duration-300"
      >
        <div className="flex-1 px-4 space-y-2 mt-8">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative overflow-hidden ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-bg"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                  />
                )}
                <link.icon size={20} className={`relative z-10 ${isActive ? 'text-primary' : 'group-hover:text-primary transition-colors'}`} />
                {isSidebarOpen && (
                  <span className="relative z-10 font-bold text-xs uppercase tracking-widest">{link.name}</span>
                )}
                {isActive && isSidebarOpen && (
                  <motion.div 
                    layoutId="active-pill"
                    className="relative z-10 ml-auto w-1 h-4 rounded-full bg-primary shadow-[0_0_10px_rgba(0,245,255,0.8)]"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="px-4 mt-auto space-y-2">
          <div className="h-px bg-white/5 mx-2 my-4" />
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center gap-4 px-4 py-3 text-white/40 hover:text-white rounded-xl transition-all hover:bg-white/5"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            {isSidebarOpen && <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Collapse Nexus</span>}
          </button>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-4 px-4 py-3 text-white/40 hover:text-red-500 rounded-xl transition-all group hover:bg-red-500/5"
          >
            <LogOut size={18} className="group-hover:text-red-500 transition-colors" />
            {isSidebarOpen && <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Disconnect</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-[80px]'}`}>
        {/* Dashboard Top Bar */}
        <header className="h-20 border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${type === 'admin' ? 'bg-magenta shadow-[0_0_10px_rgba(255,0,255,0.5)]' : 'bg-primary shadow-[0_0_10px_rgba(0,245,255,0.5)]'}`} />
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">{type} Access Active</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-white/40 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-black uppercase tracking-tighter">{user?.name}</p>
                <p className="text-[10px] text-white/40 font-mono">@{user?.role}_node</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-magenta p-[1px]">
                <div className="w-full h-full rounded-[11px] bg-background flex items-center justify-center overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user?._id}`} alt="" className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

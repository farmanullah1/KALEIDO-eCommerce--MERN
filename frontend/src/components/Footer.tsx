import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Globe, Cpu, Shield, Zap, MessageCircle, Share2, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-white/5 pt-20 pb-10 px-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="text-3xl font-black tracking-tighter uppercase">
              KALEIDO<span className="text-primary">.</span>
            </Link>
            <p className="text-white/30 text-sm leading-relaxed max-w-xs">
              A multi-dimensional marketplace bridging the gap between physical artifacts and digital consciousness. Verified on the KALEIDO ledger.
            </p>
            <div className="flex gap-4">
              {[MessageCircle, Share2, ExternalLink].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3, color: '#00F5FF' }}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 border border-white/5 transition-all"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary mb-8">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'Search', 'Trending', 'New Arrivals', 'Wishlist'].map((link) => (
                <li key={link}>
                  <Link to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-')}`} className="text-sm text-white/40 hover:text-white transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-magenta mb-8">Ecosystem</h4>
            <ul className="space-y-4">
              {['Seller Portal', 'Admin Node', 'Neural Network', 'API Docs', 'Sentinel'].map((link) => (
                <li key={link}>
                  <Link to={link.toLowerCase().startsWith('seller') ? '/seller/dashboard' : '#'} className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-2">
                    {link} {link === 'Sentinel' && <Shield size={12} className="text-primary" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Terminal Stats */}
          <div className="glass-card p-6 bg-white/[0.02]">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan mb-6">System Status</h4>
            <div className="space-y-3 font-mono text-[10px] uppercase">
              <div className="flex justify-between">
                <span className="text-white/20">Network</span>
                <span className="text-green-500">OPTIMAL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/20">Latency</span>
                <span className="text-white/60">14 MS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/20">Nodes</span>
                <span className="text-white/60">1,284 ACTIVE</span>
              </div>
              <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-primary">
                <Cpu size={12} className="animate-pulse" />
                <span>V.4.2.0.8-ALPHA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-[10px] font-mono text-white/20 uppercase tracking-widest">
            <span>© 2026 KALEIDO LABS</span>
            <span className="hidden md:inline">•</span>
            <a href="#" className="hover:text-white transition-colors">Protocol</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] font-mono text-white/20 uppercase tracking-widest">
            <Globe size={12} />
            <span>Multi-Dimension: CENTRAL NODE (0,0,0)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

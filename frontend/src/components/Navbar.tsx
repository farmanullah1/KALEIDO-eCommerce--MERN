import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, LogOut, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { useState, useEffect } from 'react';
import HamburgerIcon from './HamburgerIcon.js';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Dimension', path: '/' },
    { name: 'Artifacts', path: '/products' },
    { name: 'Origin', path: '/about' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled || isMenuOpen ? 'bg-background/80 backdrop-blur-lg border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsMenuOpen(false)}>
          <div className="w-10 h-10 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <span className="font-display font-black text-2xl tracking-tighter text-white">KALEIDO</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className="text-white/70 hover:text-primary transition-colors font-medium relative group">
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link to="/cart" className="relative group" onClick={() => setIsMenuOpen(false)}>
            <ShoppingCart className="w-6 h-6 text-white/70 group-hover:text-primary transition-colors" />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-secondary text-background text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background">0</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{user?.name}</span>
                </Link>
                <button onClick={handleLogout} className="text-white/40 hover:text-red-400 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-secondary py-2 px-6 text-sm">
                ANCHOR
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <HamburgerIcon isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-[73px] left-0 w-full h-[calc(100vh-73px)] bg-background/95 backdrop-blur-2xl z-40 md:hidden overflow-y-auto"
          >
            <div className="px-6 py-12 flex flex-col items-center gap-8 text-center">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link 
                    to={link.path} 
                    onClick={() => setIsMenuOpen(false)} 
                    className="text-4xl font-black tracking-tighter hover:text-primary transition-colors uppercase"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }}
                className="w-full h-px bg-white/10 my-4"
              />

              {isAuthenticated ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.4 }}
                  className="flex flex-col items-center gap-6"
                >
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold">{user?.name}</span>
                  </Link>
                  <button onClick={handleLogout} className="btn-secondary w-full px-12 py-4 flex items-center justify-center gap-2">
                    <LogOut className="w-5 h-5" /> DISCONNECT
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.4 }}
                  className="w-full"
                >
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="btn-primary w-full py-5 text-lg font-black tracking-widest block"
                  >
                    ESTABLISH ANCHOR
                  </Link>
                </motion.div>
              )}
            </div>
            
            {/* Decorative background elements */}
            <div className="absolute top-1/4 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

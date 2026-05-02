import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import PortalCarousel from './components/PortalCarousel';
import AddToCartButton from './components/AddToCartButton';
import AnchorCrystal from './components/common/AnchorCrystal';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { ShoppingCart, LayoutGrid, User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const ProtectedRoute = ({ children }) => {
  const { isGuest, isLoading } = useAuthContext();
  if (isLoading) return <div className="h-screen w-full flex items-center justify-center">LOADING ANCHOR...</div>;
  if (isGuest) return <Navigate to="/" replace />;
  return children;
};

const MainLayout = () => {
  const { user, isGuest } = useAuthContext();
  
  return (
    <div className="min-h-screen bg-bg text-on-surface flex flex-col font-body">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-tertiary/20 blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-start z-50">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-heading font-extrabold tracking-[0.2em] text-white">KALEIDO</h1>
          <p className="text-[10px] font-bold text-tertiary tracking-[0.5em] uppercase">Digital Dream Artifacts</p>
        </div>
        
        <div className="flex items-center gap-6">
          <motion.div whileHover={{ scale: 1.1 }} className="flex flex-col items-center gap-1 cursor-pointer">
            <LayoutGrid className="w-5 h-5 text-on-surface/60" />
            <span className="text-[8px] font-bold tracking-widest text-on-surface/30">NEXUS</span>
          </motion.div>
          
          <AnchorCrystal />
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col relative z-10 pt-32">
        <div className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4 flex flex-col gap-8">
            <motion.div 
              initial={{ x: -50, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }}
              className="flex flex-col gap-4"
            >
              <h2 className="text-6xl font-heading font-extrabold leading-none text-white">
                VOID <br /> <span className="text-tertiary">SHARDS</span>
              </h2>
              <p className="text-sm text-on-surface/60 max-w-xs leading-relaxed tracking-wide">
                Each artifact is a captured echo from the digital dusk. Anchored in the forge of bioluminescence.
              </p>
            </motion.div>

            <div className="flex flex-col gap-4">
              <AddToCartButton productId="artifact_001" />
              <button className="glass-panel py-4 px-8 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-white/5 transition-all">
                VIEW SPECIFICATIONS
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 h-[600px]">
            <PortalCarousel />
          </div>
        </div>
      </main>

      {/* Cart Navigation (Persistent) */}
      <div className="fixed bottom-12 right-12 z-50">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          className="w-16 h-16 glass-panel rounded-full flex items-center justify-center cursor-pointer anisotropic-border"
          style={{ '--tertiary': '#00ecfb' }}
          id="cart-orb"
        >
          <ShoppingCart className="w-6 h-6 text-tertiary" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center text-[10px] font-bold text-white">
            0
          </div>
        </motion.div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Root now points to Login as requested */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Main App Experience is now the Nexus */}
          <Route 
            path="/nexus" 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback redirects */}
          <Route path="/login" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

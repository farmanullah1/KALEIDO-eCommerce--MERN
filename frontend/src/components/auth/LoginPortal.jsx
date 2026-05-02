import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Text } from '@react-three/drei';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldAlert } from 'lucide-react';

const PortalFrame = ({ fillProgress }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <boxGeometry args={[4, 4, 4]} />
        <meshBasicMaterial wireframe color="#00ecfb" transparent opacity={0.3} />
      </mesh>
      
      {/* Lock Fill Visualization */}
      <mesh position={[0, -2 + fillProgress * 2, 0]}>
        <boxGeometry args={[3.8, fillProgress * 4, 3.8]} />
        <meshBasicMaterial color="#00ecfb" transparent opacity={0.15} />
      </mesh>
    </group>
  );
};

const LoginPortal = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const fillProgress = Math.min(password.length / 12, 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    
    try {
      await login(email, password);
      // Success is handled by AuthContext (color shift) and then redirect
      setTimeout(() => navigate('/nexus'), 1000);
    } catch (err) {
      setIsError(true);
      setErrorMessage(err.response?.data?.message || "Echoes mismatched.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#f5a97f" />
          <PortalFrame fillProgress={fillProgress} />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md glass-panel p-10 anisotropic-border"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-extrabold mb-2">THRESHOLD PORTAL</h2>
          <p className="text-xs text-on-surface/40 tracking-[0.2em]">ENTER YOUR ANCHOR ECHOES</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative group">
            <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/30 group-focus-within:text-tertiary transition-colors" />
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL ADDRESS"
              className="w-full bg-transparent border-b border-on-surface/10 py-3 pl-8 text-sm focus:outline-none focus:border-tertiary transition-all tracking-wider"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/30 group-focus-within:text-tertiary transition-colors" />
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="VAULT KEY"
              className="w-full bg-transparent border-b border-on-surface/10 py-3 pl-8 text-sm focus:outline-none focus:border-tertiary transition-all tracking-wider"
              required
            />
          </div>

          <AnimatePresence>
            {isError && (
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-2 text-accent text-[10px] font-bold tracking-widest uppercase bg-accent/10 p-3 rounded"
              >
                <ShieldAlert className="w-3 h-3" />
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary flex items-center justify-center gap-3 w-full"
          >
            {isLoading ? "UNLOCKING..." : "ANCHOR ME"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 text-center flex flex-col gap-2">
          <button 
            onClick={() => navigate('/forgot-password')}
            className="text-[10px] font-bold text-on-surface/30 hover:text-on-surface transition-colors tracking-widest"
          >
            FORGOT VAULT KEY?
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="text-[10px] font-bold text-tertiary hover:text-white transition-colors tracking-widest"
          >
            CLAIM NEW ANCHOR (SIGNUP)
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPortal;

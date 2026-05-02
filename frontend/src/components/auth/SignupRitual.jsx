import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, CheckCircle, ShieldAlert, Sparkles, Hexagon } from 'lucide-react';

const SignupRitual = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [crystalColor, setCrystalColor] = useState(null);

  const { signup, verifySignup } = useAuth();
  const navigate = useNavigate();

  const handleInitiate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = await signup(email, password);
      setCrystalColor(data.crystalHexCode);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Ritual failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await verifySignup(email, code);
      setStep(3);
      setTimeout(() => navigate('/nexus'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "The key does not fit this lock.");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = {
    1: (
      <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
        <h2 className="text-3xl font-heading font-extrabold mb-8 text-center">THRESHOLD PORTAL</h2>
        <form onSubmit={handleInitiate} className="flex flex-col gap-6">
          <div className="relative group">
            <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/30 group-focus-within:text-tertiary transition-colors" />
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR ECHO (EMAIL)"
              className="w-full bg-transparent border-b border-on-surface/10 py-3 pl-8 text-sm focus:outline-none focus:border-tertiary transition-all"
              required
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/30 group-focus-within:text-tertiary transition-colors" />
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="VAULT KEY (MIN 8 CHARS)"
              className="w-full bg-transparent border-b border-on-surface/10 py-3 pl-8 text-sm focus:outline-none focus:border-tertiary transition-all"
              required
            />
            {password.length >= 8 && (
              <CheckCircle className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
            )}
          </div>
          {error && <p className="text-accent text-[10px] font-bold tracking-widest">{error}</p>}
          <button type="submit" disabled={isLoading || password.length < 8} className="btn-primary w-full">
            {isLoading ? "INITIATING..." : "INITIATE RITUAL"}
          </button>
        </form>
      </motion.div>
    ),
    2: (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.1, opacity: 0 }}>
        <h2 className="text-2xl font-heading font-extrabold mb-4 text-center text-tertiary">SEAL THE ANCHOR</h2>
        <p className="text-[10px] text-center text-on-surface/50 mb-8 tracking-widest">
          A 6-DIGIT KEY HAS BEEN SENT TO YOUR ECHOES.
        </p>
        <form onSubmit={handleVerify} className="flex flex-col gap-8">
          <div className="flex justify-center gap-4">
            <input 
              type="text"
              maxLength="6"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-surface/10 border-2 border-on-surface/10 w-48 py-4 text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:border-tertiary rounded"
              placeholder="000000"
              required
            />
          </div>
          {error && <p className="text-accent text-[10px] font-bold text-center tracking-widest">{error}</p>}
          <button type="submit" disabled={isLoading || code.length < 6} className="btn-primary w-full">
            {isLoading ? "VERIFYING..." : "SEAL ANCHOR"}
          </button>
        </form>
      </motion.div>
    ),
    3: (
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-6 py-10">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <Hexagon className="w-24 h-24" style={{ color: crystalColor }} />
          <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-white" />
        </motion.div>
        <div className="text-center">
          <h2 className="text-3xl font-heading font-extrabold mb-2 text-white">ANCHOR SET</h2>
          <p className="text-sm text-on-surface/60 tracking-widest uppercase">Your journey now leaves echoes.</p>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-[10px] font-bold text-tertiary"
        >
          REDIRECTING TO NEXUS...
        </motion.div>
      </motion.div>
    )
  };

  return (
    <div className="glass-panel p-10 max-w-md w-full anisotropic-border relative overflow-hidden">
      {/* Background Pulse */}
      {step === 2 && (
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-tertiary/5 z-0 pointer-events-none"
        />
      )}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {steps[step]}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignupRitual;

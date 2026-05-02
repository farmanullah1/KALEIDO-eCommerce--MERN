import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, ShieldAlert } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../services/authAPI';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Mismatched keys.");
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await resetPassword(token, password);
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "This key has crumbled.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="glass-panel p-10 max-w-md w-full anisotropic-border"
    >
      <h2 className="text-3xl font-heading font-extrabold mb-8 text-center uppercase">RESEAL VAULT</h2>
      
      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative group">
            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/30 group-focus-within:text-tertiary transition-colors" />
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="NEW VAULT KEY"
              className="w-full bg-transparent border-b border-on-surface/10 py-3 pl-8 text-sm focus:outline-none focus:border-tertiary transition-all"
              required
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/30 group-focus-within:text-tertiary transition-colors" />
            <input 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="CONFIRM NEW KEY"
              className="w-full bg-transparent border-b border-on-surface/10 py-3 pl-8 text-sm focus:outline-none focus:border-tertiary transition-all"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-accent text-[10px] font-bold tracking-widest uppercase">
              <ShieldAlert className="w-3 h-3" /> {error}
            </div>
          )}

          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? "FORGING..." : "RESEAL VAULT"}
          </button>
        </form>
      ) : (
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-secondary" />
          </div>
          <p className="text-sm text-on-surface/80 leading-relaxed mb-4">
            Vault resealed. Log in with your new key.
          </p>
          <p className="text-[10px] font-bold text-tertiary animate-pulse tracking-widest">
            REDIRECTING TO PORTAL...
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ResetPassword;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../services/authAPI';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      // Still show success to prevent email enumeration
      setIsSubmitted(true);
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
      <button 
        onClick={() => navigate('/login')}
        className="flex items-center gap-2 text-[10px] font-bold text-on-surface/40 hover:text-tertiary transition-colors mb-6 uppercase tracking-widest"
      >
        <ArrowLeft className="w-3 h-3" /> BACK TO PORTAL
      </button>

      <h2 className="text-3xl font-heading font-extrabold mb-4">FORGED KEY</h2>
      
      {!isSubmitted ? (
        <>
          <p className="text-xs text-on-surface/60 mb-8 leading-relaxed tracking-wide">
            ENTER YOUR ANCHOR ECHO (EMAIL) TO RECEIVE A NEW VAULT KEY.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="relative group">
              <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/30 group-focus-within:text-tertiary transition-colors" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL ADDRESS"
                className="w-full bg-transparent border-b border-on-surface/10 py-3 pl-8 text-sm focus:outline-none focus:border-tertiary transition-all"
                required
              />
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2">
              {isLoading ? "FORGING..." : "REQUEST NEW KEY"}
              <Send className="w-4 h-4" />
            </button>
          </form>
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4"
        >
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-secondary" />
          </div>
          <p className="text-sm text-on-surface/80 leading-relaxed">
            If this anchor exists, a key has been sent to its echoes. Check your signal.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ForgotPassword;

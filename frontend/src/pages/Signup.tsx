import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { shakeX, scaleIn } from '../lib/animations';

const signupSchema = z.object({
  name: z.string().min(2, 'Identity tag must be at least 2 characters'),
  email: z.string().email('Essence identifier must be a valid email'),
  password: z.string().min(6, 'Access key must be at least 6 characters'),
  role: z.enum(['buyer', 'seller']),
  shopName: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.role === 'seller' && (!data.shopName || data.shopName.length < 3)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Shop designation is required for Merchants",
      path: ["shopName"],
    });
  }
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isShaking, setIsShaking] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema) as any,
    defaultValues: {
      role: 'buyer',
      name: '',
      email: '',
      password: '',
      shopName: ''
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (values: SignupFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        sellerInfo: values.role === 'seller' ? { shopName: values.shopName } : undefined
      };
      const { data } = await api.post('/auth/register', payload);
      setAuth(data.data, data.data.accessToken);
      toast.success('Threshold portal activated. Welcome, Traveler.');
      navigate('/');
    } catch (error: any) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      toast.error(error.response?.data?.message || 'Portal failed to stabilize. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial="hidden"
        animate={isShaking ? "shake" : "visible"}
        variants={{
          hidden: scaleIn.hidden,
          visible: scaleIn.visible,
          shake: shakeX.animate
        }}
        className="w-full max-w-md z-10"
      >
        <div className="glass-card p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-primary to-secondary animate-gradient-x" />
          
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 border border-secondary/30 mb-6"
            >
              <Sparkles className="w-8 h-8 text-secondary" />
            </motion.div>
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">THRESHOLD PORTAL</h1>
            <p className="text-white/50 font-medium">Initialize your journey into KALEIDO</p>
          </div>

          <div className="flex bg-white/5 p-1 rounded-xl mb-8 border border-white/10">
            <button
              type="button"
              onClick={() => setValue('role', 'buyer')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${selectedRole === 'buyer' ? 'bg-secondary text-background shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              Traveler
            </button>
            <button
              type="button"
              onClick={() => setValue('role', 'seller')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${selectedRole === 'seller' ? 'bg-primary text-background shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              Merchant
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-mono text-secondary uppercase tracking-widest ml-1">Identity Tag</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  {...register('name')}
                  type="text"
                  placeholder="The Traveler"
                  className={`w-full bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all`}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs ml-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-secondary uppercase tracking-widest ml-1">Essence Identifier</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="name@essence.com"
                  className={`w-full bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-secondary uppercase tracking-widest ml-1">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all`}
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs ml-1">{errors.password.message}</p>}
            </div>

            <AnimatePresence mode="wait">
              {selectedRole === 'seller' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  <label className="text-xs font-mono text-primary uppercase tracking-widest ml-1">Shop Designation</label>
                  <div className="relative">
                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <input
                      {...register('shopName')}
                      type="text"
                      placeholder="My Cyber Emporium"
                      className={`w-full bg-white/5 border ${errors.shopName ? 'border-red-500' : 'border-white/10'} rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                    />
                  </div>
                  {errors.shopName && <p className="text-red-500 text-xs ml-1">{errors.shopName.message}</p>}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full group flex items-center justify-center gap-3 bg-secondary text-background font-bold py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(255,0,245,0.3)] hover:shadow-[0_0_30px_rgba(255,0,245,0.5)]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  CROSS THE THRESHOLD
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-white/40 text-sm">
              Already anchored?{' '}
              <Link to="/login" className="text-primary hover:text-primary-dark font-bold transition-colors">
                Perform Ritual
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;

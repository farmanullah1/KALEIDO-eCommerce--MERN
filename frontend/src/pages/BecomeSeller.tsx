import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles, ShoppingBag, ArrowRight, Loader2, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { fadeUp, staggerContainer } from '../lib/animations';
import SEO from '../components/SEO';
import ImageUpload from '../components/ImageUpload';

const becomeSellerSchema = z.object({
  shopName: z.string().min(3, 'Shop designation must be at least 3 characters'),
  shopDescription: z.string().min(10, 'Operational protocol description must be at least 10 characters'),
  gstNumber: z.string().optional(),
  banner: z.string().optional().or(z.literal('')),
  shopLogo: z.string().optional().or(z.literal('')),
  socialLinks: z.object({
    website: z.string().optional().or(z.literal('')),
    instagram: z.string().optional().or(z.literal('')),
    twitter: z.string().optional().or(z.literal('')),
  }).optional(),
});

type BecomeSellerFormValues = z.infer<typeof becomeSellerSchema>;

const BecomeSeller = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BecomeSellerFormValues>({
    resolver: zodResolver(becomeSellerSchema),
    defaultValues: {
      shopLogo: '',
      banner: '',
      socialLinks: { website: '', instagram: '', twitter: '' }
    }
  });

  const onSubmit = async (values: BecomeSellerFormValues) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/upgrade', values);
      updateUser({ role: 'seller', sellerInfo: data.data.sellerInfo });
      toast.success('Merchant application received. Welcome to the bazaar.');
      navigate('/seller/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'The upgrade ritual failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 relative overflow-hidden">
      <SEO title="Become a Merchant" />
      
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary rounded-full blur-[150px]" />
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-2xl mx-auto z-10 relative"
      >
        <motion.div variants={fadeUp} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 border border-primary/30 mb-6 shadow-[0_0_30px_rgba(0,255,255,0.2)]">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase italic">Open Your Emporium</h1>
          <p className="text-white/50 font-medium max-w-lg mx-auto">
            Scale your digital presence and monetize your artifacts within the KALEIDO ecosystem.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="glass-card p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary animate-gradient-x" />
          
          <div className="flex items-start gap-4 p-4 bg-primary/5 border border-primary/20 rounded-xl mb-8">
            <Info className="text-primary flex-shrink-0 mt-0.5" size={18} />
            <p className="text-xs text-primary/80 font-mono leading-relaxed">
              Your merchant credentials will be reviewed by the Overlords. Once approved, you can start manifesting artifacts in the global catalog.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-mono text-primary uppercase tracking-widest ml-1">Shop Designation</label>
              <div className="relative">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  {...register('shopName')}
                  type="text"
                  placeholder="e.g. Neo-Tokyo Artifacts"
                  className={`w-full bg-white/5 border ${errors.shopName ? 'border-red-500' : 'border-white/10'} rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                />
              </div>
              {errors.shopName && <p className="text-red-500 text-xs ml-1">{errors.shopName.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-primary uppercase tracking-widest ml-1">Operational Protocol (Description)</label>
              <textarea
                {...register('shopDescription')}
                rows={4}
                placeholder="Describe the nature of your emporium and the artifacts you intend to manifest..."
                className={`w-full bg-white/5 border ${errors.shopDescription ? 'border-red-500' : 'border-white/10'} rounded-xl py-4 px-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none`}
              />
              {errors.shopDescription && <p className="text-red-500 text-xs ml-1">{errors.shopDescription.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-primary uppercase tracking-widest ml-1">GST/Tax Identifier (Optional)</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  {...register('gstNumber')}
                  type="text"
                  placeholder="e.g. 22AAAAA0000A1Z5"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-mono text-primary uppercase tracking-widest ml-1">Neural Channels (Social Links)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  {...register('socialLinks.website' as any)}
                  type="url"
                  placeholder="Website URL"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  {...register('socialLinks.instagram' as any)}
                  type="text"
                  placeholder="Instagram Handle"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  {...register('socialLinks.twitter' as any)}
                  type="text"
                  placeholder="Twitter Handle"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUpload 
                label="Emporium Sigil (Logo)"
                value={watch('shopLogo' as any)}
                onUpload={(url) => setValue('shopLogo' as any, url)}
                aspectRatio="aspect-square"
              />
              <ImageUpload 
                label="Bazaar Banner"
                value={watch('banner')}
                onUpload={(url) => setValue('banner', url)}
                aspectRatio="aspect-video"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full group flex items-center justify-center gap-3 py-5 text-lg font-black tracking-[0.2em] shadow-[0_0_30px_rgba(0,255,255,0.2)]"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  INITIALIZE MERCHANT STATUS
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BecomeSeller;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Store, Save, Image as ImageIcon, ShieldCheck, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import { fadeUp, scaleIn } from '../../lib/animations';

const settingsSchema = z.object({
  shopName: z.string().min(3, 'Establishment designation is too short'),
  shopDescription: z.string().min(10, 'Lore & Concept must be more descriptive'),
  returnPolicy: z.string().optional(),
  gstNumber: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const SellerSettings = () => {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    if (user?.sellerInfo) {
      reset({
        shopName: user.sellerInfo.shopName,
        shopDescription: user.sellerInfo.shopDescription || '',
        gstNumber: (user.sellerInfo as any).gstNumber || '',
        returnPolicy: (user.sellerInfo as any).returnPolicy || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (values: SettingsFormValues) => {
    setLoading(true);
    try {
      const { data } = await api.put('/seller/settings', values);
      updateUser({ sellerInfo: data.data.sellerInfo });
      setSuccess(true);
      toast.success('Neural core updated successfully');
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold mb-2 uppercase tracking-tighter">Nexus Settings</h1>
          <p className="text-white/40 font-mono text-sm uppercase tracking-widest flex items-center gap-2">
            <Store size={14} /> Configure your galactic establishment
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <motion.div variants={fadeUp} custom={1} className="glass-card p-8">
            <h3 className="text-xl font-bold mb-8 uppercase tracking-tighter flex items-center gap-2 text-primary">
              <ShieldCheck size={20} /> Core Identity
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-mono text-white/40 uppercase tracking-widest ml-1">Establishment Name</label>
                <input
                  {...register('shopName')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Enter shop name"
                />
                {errors.shopName && <p className="text-red-500 text-xs">{errors.shopName.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-white/40 uppercase tracking-widest ml-1">GST/VAT Identifier (Optional)</label>
                <input
                  {...register('gstNumber')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="GST-XXXX-XXXX"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-mono text-white/40 uppercase tracking-widest ml-1">Lore & Concept</label>
                <textarea
                  {...register('shopDescription')}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  placeholder="Tell your story..."
                />
                {errors.shopDescription && <p className="text-red-500 text-xs">{errors.shopDescription.message}</p>}
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={2} className="glass-card p-8">
            <h3 className="text-xl font-bold mb-8 uppercase tracking-tighter flex items-center gap-2 text-magenta">
              <ImageIcon size={20} /> Visual Branding
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Establishment Sigil (Logo)</p>
                <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer group">
                  <Upload className="text-white/20 group-hover:text-primary transition-colors" />
                  <span className="text-[10px] text-white/20 uppercase font-bold">Upload</span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Horizon Banner</p>
                <div className="w-full h-32 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:border-magenta/50 transition-colors cursor-pointer group">
                  <Upload className="text-white/20 group-hover:text-magenta transition-colors" />
                  <span className="text-[10px] text-white/20 uppercase font-bold">Upload</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={3} className="glass-card p-8">
            <h3 className="text-xl font-bold mb-8 uppercase tracking-tighter flex items-center gap-2">
              <Activity size={20} className="text-green-500" /> Operational Protocol
            </h3>
            
            <div className="space-y-2">
              <label className="text-xs font-mono text-white/40 uppercase tracking-widest ml-1">Return & Refund Policy</label>
              <textarea
                {...register('returnPolicy')}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all resize-none"
                placeholder="Detail your return policy..."
              />
            </div>
          </motion.div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-3 px-10 py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${
                success ? 'bg-green-500 text-white' : 'bg-primary text-background'
              } hover:scale-105 active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(0,245,255,0.2)]`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : success ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Synchronized
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Commit Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Activity = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

export default SellerSettings;

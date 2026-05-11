import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, CreditCard, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../api/axios.js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Checkmark } from '../components/UIPolish.js';
import { Confetti } from '../components/Confetti.js';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [order, setOrder] = useState<any>(null);
  const [typedId, setTypedId] = useState('');
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    zip: '',
    country: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    try {
      const shippingAddress = `${formData.address}, ${formData.city}, ${formData.zip}, ${formData.country}`;
      const { data } = await api.post('/orders', { shippingAddress });
      setOrder(data.data);
      toast.success('Order Anchored Successfully!');
      setStep(3);
    } catch (error) {
      toast.error('Failed to anchor order');
    }
  };

  useEffect(() => {
    if (step === 3 && order?._id) {
      let i = 0;
      const interval = setInterval(() => {
        setTypedId(order._id.slice(0, i));
        i++;
        if (i > order._id.length) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step, order]);

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-16 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 z-0" />
          <div className={`absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500`} style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }} />
          
          {[1, 2, 3].map((s) => (
            <div key={s} className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${step >= s ? 'bg-primary text-background' : 'bg-background border-2 border-white/10 text-white/40'}`}>
              {s === 3 && step === 3 ? <CheckCircle2 className="w-6 h-6" /> : s}
            </div>
          ))}
        </div>

        <div className="glass-card p-12">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                <Truck className="text-primary" /> SHIPPING PORTAL
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-mono text-white/40">ADDRESS</label>
                  <input name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Enter full address" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40">CITY</label>
                  <input name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:ring-1 focus:ring-primary" placeholder="City" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40">COUNTRY</label>
                  <input name="country" value={formData.country} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Country" />
                </div>
              </div>
              <button onClick={() => setStep(2)} className="btn-primary w-full mt-12 py-4 flex items-center justify-center gap-3">
                CONTINUE TO PAYMENT <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                <CreditCard className="text-primary" /> PAYMENT RITUAL
              </h2>
              
              {/* 3D Card Visual */}
              <div className="mb-12 flex justify-center perspective-1000">
                <motion.div 
                  className="relative w-full max-w-[350px] h-48 preserve-3d"
                  animate={{ rotateY: formData.cvv.length > 0 ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden glass-card !bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-6 flex flex-col justify-between border border-white/20">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-8 bg-white/10 rounded-md" /> {/* Chip */}
                      <Shield className="text-primary/50" />
                    </div>
                    <div>
                      <div className="text-xl font-mono tracking-[0.2em] mb-4">
                        {formData.cardNumber || 'XXXX XXXX XXXX XXXX'}
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
                        <div>Card Holder</div>
                        <div>Expires</div>
                      </div>
                      <div className="flex justify-between font-mono text-xs uppercase tracking-widest">
                        <div>The Traveler</div>
                        <div>{formData.expiry || 'MM/YY'}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Back */}
                  <div className="absolute inset-0 backface-hidden glass-card !bg-gradient-to-br from-secondary/20 via-background to-primary/20 p-6 flex flex-col justify-between border border-white/20 [transform:rotateY(180deg)]">
                    <div className="mt-4 h-10 w-full bg-black/40 -mx-6" />
                    <div className="flex justify-end items-center">
                      <div className="bg-white/10 px-4 py-2 rounded font-mono text-sm">
                        {formData.cvv || 'XXX'}
                      </div>
                    </div>
                    <div className="text-[8px] text-white/20 leading-tight">
                      This digital artifact represents a secure link between dimensions. Authorized use only.
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40">CARD NUMBER</label>
                  <input name="cardNumber" maxLength={19} value={formData.cardNumber} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:ring-1 focus:ring-primary" placeholder="XXXX XXXX XXXX XXXX" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-white/40">EXPIRY</label>
                    <input name="expiry" maxLength={5} value={formData.expiry} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:ring-1 focus:ring-primary" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-white/40">CVV</label>
                    <input name="cvv" maxLength={3} value={formData.cvv} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:ring-1 focus:ring-primary" placeholder="XXX" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-12">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-4">BACK</button>
                <button onClick={handlePlaceOrder} className="btn-primary flex-[2] py-4">PLACE ORDER</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 relative overflow-visible">
              <Confetti />
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10">
                <Checkmark />
              </div>
              <h2 className="text-5xl font-black mb-6 tracking-tighter uppercase">Order Anchored</h2>
              <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-xl inline-block min-w-[300px]">
                <p className="text-xs font-mono text-white/30 mb-2 uppercase">Signature Hash</p>
                <p className="text-primary font-mono text-lg">{typedId}<span className="animate-pulse">_</span></p>
              </div>
              <p className="text-white/40 max-w-md mx-auto mb-12 leading-relaxed">
                Your artifacts have been successfully locked to your signature. Redirecting to dimension shortly...
              </p>
              <button 
                onClick={() => navigate('/')}
                className="btn-primary px-12 py-4 mb-8"
              >
                RETURN TO DIMENSION
              </button>
              <br />
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10 text-sm font-mono text-primary animate-pulse">
                <Shield className="w-4 h-4" /> SECURE ORIGIN VERIFIED
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;

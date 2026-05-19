import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Scene } from '../components/PortalCarousel';
import api from '../api/axios';
import { ShoppingCart, Compass, Zap, Box, Plus, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { LoadingSpinner, Skeleton, WishlistButton } from '../components/UIPolish';
import { VolumetricRipple, CartOrbFly } from '../components/AddToCartEffects';
import TiltCard from '../components/TiltCard';
import { fadeUp, staggerContainer } from '../lib/animations';

import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { Send } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, allRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/products?limit=8')
        ]);
        setFeaturedProducts(featuredRes.data.data);
        setProducts(allRes.data.data.products);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 overflow-hidden">
      {/* <SEO title="Home" /> */}
      {/* Hero Section */}
      <section className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl md:text-8xl font-extrabold mb-6">
            <span className="text-gradient">KALEIDO</span> DIMENSION
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12">
            Experience commerce in the third dimension. Curated artifacts from the digital frontier.
          </p>
        </motion.div>
      </section>

      {/* 3D Portal / Live Bidding Arena Section */}
      <section className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Live Auction Terminal (eBay-style) */}
          <div className="lg:col-span-2 glass-card p-8 relative overflow-hidden flex flex-col justify-between border-primary/20 shadow-[0_0_35px_rgba(0,255,255,0.05)]">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-transparent to-magenta" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  Live Holographic Auction
                </span>
                <span className="text-white/40 font-mono text-xs uppercase">Block #827394</span>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8 items-center w-full">
                <div className="w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden relative group border border-white/5 bg-black/50">
                  {/* Holographic scanner effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 opacity-35 pointer-events-none z-20" />
                  <Scene products={featuredProducts.length > 0 ? featuredProducts.map((p: any) => ({ id: p._id, name: p.name, image: p.images[0] })) : [
                    { id: '1', name: 'Quantum Core', image: '' },
                    { id: '2', name: 'Neural Node', image: '' },
                    { id: '3', name: 'Optic Visor', image: '' }
                  ]} />
                </div>
                
                <div className="w-full md:w-1/2 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight mb-2 text-white uppercase italic">
                      Quantum Neural Interface <span className="text-primary font-mono text-sm not-italic font-normal">[PROTO-v9]</span>
                    </h3>
                    <p className="text-xs text-white/40 font-mono uppercase mb-4">Origin: Orion Nebula Synthetics</p>
                    <p className="text-sm text-white/60 mb-6 leading-relaxed">
                      Hyper-secure direct-mind transmission module. Synchronizes internal cortex matrix with global trading frequencies at zero latency.
                    </p>
                  </div>
                  
                  {/* Real-time Bid Controller */}
                  <AuctionBidController />
                </div>
              </div>
            </div>
            
            <div className="mt-8 border-t border-white/5 pt-6 flex items-center justify-between text-xs font-mono text-white/20 uppercase tracking-widest">
              <span>Verified Ledger Origin</span>
              <span>KALEIDO Protocol 1.9</span>
            </div>
          </div>
          
          {/* Flash Lightning Deals (AliExpress/Amazon style) */}
          <div className="glass-card p-8 border-magenta/20 flex flex-col justify-between relative overflow-hidden shadow-[0_0_35px_rgba(255,0,245,0.05)]">
            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-magenta/5 rounded-full filter blur-3xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-extrabold text-lg uppercase tracking-tight flex items-center gap-2">
                  <Zap className="w-5 h-5 text-magenta fill-magenta animate-pulse" /> Lightning Manifestations
                </h3>
                <span className="text-magenta font-mono text-xs font-bold uppercase">Flash Deals</span>
              </div>
              
              <FlashDealsTimer />
              
              <div className="space-y-6 mt-8">
                {/* Promo item 1 */}
                <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-3 rounded-xl hover:border-magenta/30 transition-colors">
                  <img 
                    src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=150" 
                    alt="Item" 
                    className="w-16 h-16 object-cover rounded-lg bg-white/5"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-white truncate uppercase tracking-tighter">Cyber-Optic visor</h4>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-mono text-primary font-bold text-sm">$49</span>
                      <span className="font-mono text-white/30 text-xs line-through">$120</span>
                    </div>
                    {/* Stock level bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] text-white/40 font-mono uppercase mb-1">
                        <span>78% Claimed</span>
                        <span>Only 4 left</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-magenta rounded-full w-[78%]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Promo item 2 */}
                <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-3 rounded-xl hover:border-magenta/30 transition-colors">
                  <img 
                    src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=150" 
                    alt="Item" 
                    className="w-16 h-16 object-cover rounded-lg bg-white/5"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-white truncate uppercase tracking-tighter">Data-Link Drive</h4>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-mono text-primary font-bold text-sm">$89</span>
                      <span className="font-mono text-white/30 text-xs line-through">$250</span>
                    </div>
                    {/* Stock level bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] text-white/40 font-mono uppercase mb-1">
                        <span>92% Claimed</span>
                        <span>Only 2 left</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-magenta rounded-full w-[92%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Link to="/search" className="btn-secondary w-full mt-6 py-2.5 text-xs font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2">
              Explore All Shifts <Compass className="w-4 h-4" />
            </Link>
          </div>
          
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-2">CURATED ARTIFACTS</h2>
            <div className="w-20 h-1 bg-primary rounded-full" />
          </div>
          <Link to="/search" className="text-white/60 hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm flex items-center gap-2">
            View All <Compass className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-[400px]" />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {products.map((product: any, index: number) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </motion.div>
        )}
      </section>

      {/* Trending Categories */}
      <section className="container mx-auto px-6 mt-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Trending Dimensions</h2>
          <p className="text-white/40 max-w-xl mx-auto">Explore curated sectors of the KALEIDO ecosystem.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <CategoryCard 
            name="Electronics" 
            image="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800" 
            count={124} 
            delay={0.1}
          />
          <CategoryCard 
            name="Fashion" 
            image="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800" 
            count={89} 
            delay={0.2}
          />
          <CategoryCard 
            name="Home Decor" 
            image="https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&q=80&w=800" 
            count={56} 
            delay={0.3}
          />
          <CategoryCard 
            name="Sports" 
            image="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800" 
            count={42} 
            delay={0.4}
          />
        </div>
      </section>

      {/* Feature Grid */}
      <section className="container mx-auto px-6 mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Compass, title: 'Spatial Browsing', desc: 'Navigate products in a 3D orbital space.' },
          { icon: Zap, title: 'Instant Anchoring', desc: 'One-click artifacts directly to your collection.' },
          { icon: Box, title: 'Digital Origin', desc: 'Every item is verified on the KALEIDO ledger.' },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="glass-card p-8 group hover:bg-white/5 transition-colors border-white/5"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-white/50 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-6 mt-32 mb-20">
        <div className="glass-card p-12 md:p-20 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-magenta/10 opacity-50" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Neural Subscription</h2>
            <p className="text-white/40 max-w-2xl mx-auto mb-10 text-lg font-light">
              Join the collective. Receive psychic transmissions about new artifact manifestations and dimensional shifts.
            </p>
            
            <form className="max-w-md mx-auto flex gap-4" onSubmit={(e) => { e.preventDefault(); toast.success('Frequency Synchronized'); }}>
              <input 
                type="email" 
                placeholder="NEURAL ADDRESS (EMAIL)" 
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 transition-colors font-mono uppercase tracking-widest text-xs"
                required
              />
              <button type="submit" className="btn-primary p-4 rounded-2xl group">
                <Send className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
            
            <p className="mt-8 text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
              By subscribing, you agree to the KALEIDO dimensional protocols.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const AuctionBidController = () => {
  const [currentBid, setCurrentBid] = useState(1340);
  const [userBid, setUserBid] = useState('');
  const [recentBids, setRecentBids] = useState([
    { bidder: 'Anon_Traveler_9', amount: 1300, time: '2 mins ago' },
    { bidder: 'Cyber_Merchant_Alpha', amount: 1340, time: '30s ago' },
  ]);

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    const bidAmount = parseInt(userBid);
    if (isNaN(bidAmount) || bidAmount <= currentBid) {
      toast.error('Bid must exceed current high-frequency bid!');
      return;
    }

    setCurrentBid(bidAmount);
    setRecentBids(prev => [
      { bidder: 'You (Traveler)', amount: bidAmount, time: 'Just now' },
      ...prev
    ]);
    setUserBid('');
    toast.success('Thought Vector Bid broadcasted to ledger!');
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center">
        <div>
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Current Ledger High Bid</span>
          <span className="text-3xl font-black text-primary font-mono">${currentBid.toLocaleString()}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Minimum Next Bid</span>
          <span className="text-sm font-bold text-white/80 font-mono">${(currentBid + 10).toLocaleString()}</span>
        </div>
      </div>

      {/* Input row */}
      <form onSubmit={handlePlaceBid} className="flex gap-2">
        <input 
          type="number" 
          value={userBid}
          onChange={(e) => setUserBid(e.target.value)}
          placeholder={`Enter bid ($${currentBid + 10} or more)`}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-white font-mono"
        />
        <button type="submit" className="btn-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
          Submit Bid
        </button>
      </form>

      {/* Recent activity scrollable */}
      <div className="space-y-2 max-h-[85px] overflow-y-auto pr-2 scrollbar-thin">
        {recentBids.map((bid, i) => (
          <div key={i} className="flex justify-between items-center text-xs font-mono py-1 border-b border-white/5 text-white/40">
            <span className={i === 0 ? 'text-primary' : ''}>○ {bid.bidder}</span>
            <span className={i === 0 ? 'text-primary font-bold' : ''}>${bid.amount} ({bid.time})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FlashDealsTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 42, seconds: 18, ms: 99 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let newMs = prev.ms - 1;
        let newSec = prev.seconds;
        let newMin = prev.minutes;
        let newHour = prev.hours;

        if (newMs < 0) {
          newMs = 99;
          newSec -= 1;
        }
        if (newSec < 0) {
          newSec = 59;
          newMin -= 1;
        }
        if (newMin < 0) {
          newMin = 59;
          newHour -= 1;
        }
        if (newHour < 0) {
          newHour = 23;
        }

        return { hours: newHour, minutes: newMin, seconds: newSec, ms: newMs };
      });
    }, 10);

    return () => clearInterval(timer);
  }, []);

  const format = (val: number) => val.toString().padStart(2, '0');

  return (
    <div className="flex gap-2 font-mono text-center select-none justify-center md:justify-start">
      <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl min-w-[50px]">
        <span className="text-xl font-black text-magenta">{format(timeLeft.hours)}</span>
        <span className="text-[8px] text-white/20 uppercase tracking-widest block mt-0.5">HRS</span>
      </div>
      <span className="text-xl font-bold text-white/30 self-center animate-pulse">:</span>
      <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl min-w-[50px]">
        <span className="text-xl font-black text-magenta">{format(timeLeft.minutes)}</span>
        <span className="text-[8px] text-white/20 uppercase tracking-widest block mt-0.5">MIN</span>
      </div>
      <span className="text-xl font-bold text-white/30 self-center animate-pulse">:</span>
      <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl min-w-[50px]">
        <span className="text-xl font-black text-magenta">{format(timeLeft.seconds)}</span>
        <span className="text-[8px] text-white/20 uppercase tracking-widest block mt-0.5">SEC</span>
      </div>
      <span className="text-xl font-bold text-white/30 self-center animate-pulse">:</span>
      <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl min-w-[50px]">
        <span className="text-xl font-black text-magenta/60">{format(timeLeft.ms)}</span>
        <span className="text-[8px] text-white/20 uppercase tracking-widest block mt-0.5">MS</span>
      </div>
    </div>
  );
};

export default Home;

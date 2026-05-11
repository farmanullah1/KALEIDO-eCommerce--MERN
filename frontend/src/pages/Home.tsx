import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO.js';
import { Scene } from '../components/PortalCarousel.js';
import api from '../api/axios.js';
import { ShoppingCart, Compass, Zap, Box, Plus, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { LoadingSpinner, Skeleton, WishlistButton } from '../components/UIPolish.js';
import { VolumetricRipple, CartOrbFly } from '../components/AddToCartEffects.js';
import TiltCard from '../components/TiltCard.js';
import { fadeUp, staggerContainer } from '../lib/animations.js';

import ProductCard from '../components/ProductCard.js';
import CategoryCard from '../components/CategoryCard.js';
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
      <SEO title="Home" />
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

      {/* 3D Portal Carousel */}
      <section className="relative h-[600px] w-full mb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10 pointer-events-none" />
        
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <Scene products={featuredProducts.map((p: any) => ({ id: p._id, name: p.name, image: p.images[0] }))} />
        )}
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

export default Home;

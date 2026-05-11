import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Scene } from '../components/PortalCarousel.js';
import api from '../api/axios.js';
import { ShoppingCart, Compass, Zap, Box, Plus, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { LoadingSpinner, Skeleton } from '../components/UIPolish.js';
import { VolumetricRipple, CartOrbFly } from '../components/AddToCartEffects.js';
import TiltCard from '../components/TiltCard.js';

const ProductCard = ({ product }: { product: any }) => {
  const [rippleActive, setRippleActive] = useState(false);
  const [flyOrb, setFlyOrb] = useState<{ x: number, y: number } | null>(null);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Trigger effects
    setRippleActive(true);
    setTimeout(() => setRippleActive(false), 600);
    
    setFlyOrb({ x: e.clientX, y: e.clientY });
    
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      <TiltCard className="glass-card group overflow-hidden">
        {flyOrb && <CartOrbFly startPos={flyOrb} onComplete={() => setFlyOrb(null)} />}
        
        <Link to={`/products/${product._id}`}>
          <div className="relative aspect-square overflow-hidden bg-white/5">
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <button 
                className="btn-primary w-full py-2 text-sm flex items-center justify-center gap-2 relative overflow-hidden"
                onClick={handleAddToCart}
                aria-label={`Add ${product.name} to cart`}
              >
                <VolumetricRipple active={rippleActive} />
                <Plus className="w-4 h-4" /> ADD TO CART
              </button>
            </div>
          </div>
        </Link>
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <Link to={`/products/${product._id}`}>
              <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            <span className="font-mono text-secondary font-bold">${product.price}</span>
          </div>
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm text-white/60">{product.rating.average}</span>
          </div>
          <p className="text-sm text-white/40 line-clamp-2 mb-4">
            {product.description}
          </p>
        </div>
      </TiltCard>
    </motion.div>
  );
};

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
          <button className="text-white/60 hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm flex items-center gap-2">
            View All <Compass className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-[400px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
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
    </div>
  );
};

export default Home;

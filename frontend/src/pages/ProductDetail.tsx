import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Star, Shield, Zap, RefreshCcw, Plus, Minus } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { LoadingSpinner, WishlistButton } from '../components/UIPolish';
import ProductReviews from '../components/ProductReviews';
import HologramPreview from '../components/HologramPreview';
import { Box as BoxIcon, Image as ImageIcon } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { PurchaseVelocity } from '../components/PurchaseVelocity';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [view3D, setView3D] = useState(false);
  const { addToCart } = useCartStore();
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.data);
      
      // Fetch similar products
      const similarRes = await api.get(`/products?category=${data.data.category}&limit=4`);
      setSimilarProducts(similarRes.data.data.products.filter((p: any) => p._id !== id));
    } catch (error) {
      toast.error('Failed to stabilize artifact data.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    await addToCart(product._id, quantity);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold mb-4">ARTIFACT NOT FOUND</h2>
      <Link to="/" className="btn-primary">Return to Dimension</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <SEO title={product?.name || 'Artifact Detail'} description={product?.description} />
      <div className="container mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors mb-12 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono uppercase tracking-widest text-sm">Back to Dimension</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Gallery Section */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onMouseMove={(e) => {
                const { currentTarget, clientX, clientY } = e;
                const { left, top, width, height } = currentTarget.getBoundingClientRect();
                const x = ((clientX - left) / width - 0.5) * 20;
                const y = ((clientY - top) / height - 0.5) * 20;
                const img = currentTarget.querySelector('img');
                if (img) img.style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = `scale(1) translate(0px, 0px)`;
              }}
              className="glass-card aspect-square overflow-hidden relative cursor-crosshair"
            >
              <AnimatePresence mode="wait">
                {view3D ? (
                  <motion.div
                    key="3d"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full bg-black"
                  >
                    <HologramPreview imageUrl={product.images[activeImage]} />
                  </motion.div>
                ) : (
                  <motion.img
                    key="2d"
                    src={product.images[activeImage]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full object-cover transition-transform duration-300 ease-out pointer-events-none"
                  />
                )}
              </AnimatePresence>
              
              {/* Product Badge */}
              <div className="absolute top-6 left-6 px-4 py-1 bg-primary text-background font-bold rounded-full text-xs tracking-tighter z-20">
                {product.category.toUpperCase()}
              </div>

              {/* View Toggle */}
              <button 
                onClick={() => setView3D(!view3D)}
                className="absolute bottom-6 right-6 p-3 glass-card rounded-xl text-primary hover:scale-110 transition-all z-20"
                title={view3D ? "Switch to 2D View" : "Switch to 3D Hologram"}
              >
                {view3D ? <ImageIcon size={20} /> : <BoxIcon size={20} />}
              </button>
            </motion.div>

            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`glass-card aspect-square overflow-hidden transition-all ${activeImage === i ? 'ring-2 ring-primary border-transparent' : 'opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 text-primary font-mono text-sm mb-4">
                <Star className="w-4 h-4 fill-primary" />
                <span>{product.rating.average}</span>
                <span className="text-white/30">•</span>
                <span>{product.rating.count} REVIEWS</span>
              </div>

              <h1 className="text-5xl font-black mb-4 tracking-tighter">{product.name}</h1>
              <p className="text-3xl font-mono text-secondary font-bold mb-8">${product.price}</p>
              
              <div className="prose prose-invert max-w-none mb-8">
                <p className="text-xl text-white/60 leading-relaxed">
                  {product.description}
                </p>
                <PurchaseVelocity />
              </div>

              {/* Technical Specs */}
              {product.details && (
                <div className="mb-12 space-y-4">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-primary/60">Technical Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {Object.entries(product.details).map(([key, value]) => value && (
                      <div key={key} className="glass-card p-4 border-white/5">
                        <p className="text-[10px] font-mono uppercase text-white/20 mb-1">{key}</p>
                        <p className="text-sm font-bold text-white/80">{value as string}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Holographic Calibration Matrix */}
              <HolographicCalibrator />

              {/* Action Controls */}
              <div className="flex flex-col sm:flex-row gap-6 mb-12">
                <div className="flex items-center glass-card px-4 py-2 gap-6 w-fit">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:text-primary transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="font-mono text-xl font-bold w-8 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:text-primary transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <button 
                  onClick={handleAddToCart}
                  className="btn-primary flex-1 py-4 text-lg font-bold flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  <ShoppingCart className="w-6 h-6" /> ADD TO DIMENSION
                </button>

                <WishlistButton productId={product._id} className="p-4 glass-card rounded-xl" />
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-8 border-y border-white/5">
                {[
                  { icon: Zap, text: 'Instant Sync' },
                  { icon: Shield, text: 'Verified Origin' },
                  { icon: RefreshCcw, text: '7-Day Return' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/50 text-sm font-medium">
                    <item.icon className="w-5 h-5 text-primary" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <ProductReviews 
          productId={product._id} 
          reviews={product.reviews || []} 
          onReviewAdded={fetchProduct} 
        />

        {/* Similar Artifacts */}
        {similarProducts.length > 0 && (
          <div className="mt-32">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-12">Linked Dimensions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarProducts.map((p: any, i: number) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const HolographicCalibrator = () => {
  const [frequency, setFrequency] = useState(432);
  const [voltage, setVoltage] = useState(80);
  const [rift, setRift] = useState(1.0);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Thought Vector Calibration synchronized to local mesh!');
    }, 1500);
  };

  return (
    <div className="glass-card p-6 border-primary/20 shadow-[0_0_20px_rgba(0,255,255,0.05)] mb-10">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary animate-pulse" /> Neural Calibrator Deck
        </h4>
        <span className="text-[9px] font-mono text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
          Module Active
        </span>
      </div>

      <div className="space-y-5">
        {/* Frequency Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-white/40 uppercase">Wave Frequency</span>
            <span className="text-primary font-bold">{frequency} Hz</span>
          </div>
          <input 
            type="range" 
            min="200" 
            max="800" 
            value={frequency} 
            onChange={(e) => setFrequency(parseInt(e.target.value))}
            className="w-full accent-primary bg-white/10 h-1 rounded-lg cursor-pointer"
          />
        </div>

        {/* Voltage Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-white/40 uppercase">Calibration Voltage</span>
            <span className="text-secondary font-bold">{voltage}%</span>
          </div>
          <input 
            type="range" 
            min="10" 
            max="150" 
            value={voltage} 
            onChange={(e) => setVoltage(parseInt(e.target.value))}
            className="w-full accent-secondary bg-white/10 h-1 rounded-lg cursor-pointer"
          />
        </div>

        {/* Rift Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-white/40 uppercase">Rift Ratio</span>
            <span className="text-magenta font-bold">1:{rift.toFixed(2)}</span>
          </div>
          <input 
            type="range" 
            min="0.1" 
            max="3.0" 
            step="0.05"
            value={rift} 
            onChange={(e) => setRift(parseFloat(e.target.value))}
            className="w-full accent-magenta bg-white/10 h-1 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Calibration status console */}
      <div className="mt-6 bg-black/50 border border-white/5 rounded-xl p-3 font-mono text-[9px] text-white/30 uppercase space-y-1.5">
        <div>○ STATUS: FREQUENCY SYNCED AT {frequency}HZ</div>
        <div>○ MATRIX VOLTAGE: {voltage > 120 ? 'OVERCHARGED' : 'OPTIMAL'} ({voltage}V)</div>
        <div>○ DOCK ALIGNMENT INDEX: 1:{rift.toFixed(2)}</div>
      </div>

      <button
        onClick={handleSync}
        disabled={isSyncing}
        className="w-full mt-6 btn-secondary py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 group relative overflow-hidden"
      >
        {isSyncing ? (
          <span className="flex items-center gap-2">
            <RefreshCcw className="w-3.5 h-3.5 animate-spin text-primary" /> Synchronizing Cortex Matrix...
          </span>
        ) : (
          <>
            <Zap className="w-3.5 h-3.5 text-primary group-hover:scale-125 transition-transform" /> Lock Thought Calibration
          </>
        )}
      </button>
    </div>
  );
};

export default ProductDetail;

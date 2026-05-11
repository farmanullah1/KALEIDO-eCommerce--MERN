import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Star, Shield, Zap, RefreshCcw, Plus, Minus } from 'lucide-react';
import api from '../api/axios.js';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '../components/UIPolish.js';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.data);
      } catch (error) {
        toast.error('Failed to stabilize artifact data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

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
    <div className="min-h-screen bg-background pt-32 pb-20">
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
              className="glass-card aspect-square overflow-hidden relative"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={product.images[activeImage]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {/* Product Badge */}
              <div className="absolute top-6 left-6 px-4 py-1 bg-primary text-background font-bold rounded-full text-xs tracking-tighter">
                {product.category.toUpperCase()}
              </div>
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
              
              <div className="prose prose-invert max-w-none mb-12">
                <p className="text-xl text-white/60 leading-relaxed">
                  {product.description}
                </p>
              </div>

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
                  onClick={() => toast.success('Artifact added to collection')}
                  className="btn-primary flex-1 py-4 flex items-center justify-center gap-3 text-lg"
                  aria-label="Add artifact to collection"
                >
                  <ShoppingCart className="w-6 h-6" />
                  ADD TO CART
                </button>
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
      </div>
    </div>
  );
};

export default ProductDetail;

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlistStore } from '../store/wishlistStore.js';
import ProductCard from '../components/ProductCard.js';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/UIPolish.js';

const Wishlist = () => {
  const { wishlist, isLoading, fetchWishlist } = useWishlistStore();

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">Saved Artifacts</h1>
            <p className="text-white/40 font-mono text-sm tracking-widest uppercase">
              {wishlist.length} Items Manifested
            </p>
          </div>
          <Heart className="w-12 h-12 text-magenta animate-pulse" />
        </div>

        {wishlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-20 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8">
              <Heart className="w-10 h-10 text-white/20" />
            </div>
            <h2 className="text-3xl font-bold mb-4 uppercase">Dimension is Empty</h2>
            <p className="text-white/40 max-w-md mb-12">
              You haven't synchronized any artifacts to your personal dimension yet.
            </p>
            <Link to="/search" className="btn-primary px-12 py-4">
              Explore Catalog
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {wishlist.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

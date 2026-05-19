import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { WishlistButton } from './UIPolish';
import { useCartStore } from '../store/cartStore';
import { VolumetricRipple, CartOrbFly } from './AddToCartEffects';
import TiltCard from './TiltCard';
import { fadeUp } from '../lib/animations';

interface ProductCardProps {
  product: any;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const [rippleActive, setRippleActive] = useState(false);
  const [flyOrb, setFlyOrb] = useState<{ x: number, y: number } | null>(null);

  const addToCart = useCartStore(state => state.addToCart);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Trigger effects
    setRippleActive(true);
    setTimeout(() => setRippleActive(false), 600);
    
    setFlyOrb({ x: e.clientX, y: e.clientY });
    
    await addToCart(product._id);
  };

  return (
    <motion.div 
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      className="relative h-full"
    >
      <TiltCard className="glass-card group overflow-hidden h-full flex flex-col">
        {flyOrb && <CartOrbFly startPos={flyOrb} onComplete={() => setFlyOrb(null)} />}
        
        <Link to={`/products/${product._id}`}>
          <div className="relative aspect-square overflow-hidden bg-white/5">
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute top-3 right-3 z-20">
              <WishlistButton productId={product._id} />
            </div>
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
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <Link to={`/products/${product._id}`}>
              <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
            <span className="font-mono text-secondary font-bold shrink-0 ml-2">${product.price}</span>
          </div>
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm text-white/60">{product.rating.average}</span>
          </div>
          <p className="text-sm text-white/40 line-clamp-2 mb-4 flex-1">
            {product.description}
          </p>
        </div>
      </TiltCard>
    </motion.div>
  );
};

export default ProductCard;

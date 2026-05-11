import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, Filter, SlidersHorizontal, Grid, List, X } from 'lucide-react';
import api from '../api/axios';
import { LoadingSpinner } from '../components/UIPolish';
import ProductCard from '../components/ProductCard'; // I'll extract ProductCard from Home.tsx first
import { fadeUp, staggerContainer } from '../lib/animations';

const categories = ['electronics', 'fashion', 'home-decor', 'beauty', 'sports'];

const Search = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products', {
        params: {
          search: searchTerm,
          category: selectedCategory,
          sort: sortBy
        }
      });
      setProducts(data.data.products);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="flex flex-col gap-8 mb-12">
          <div className="relative group">
            <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={24} />
            <input 
              type="text" 
              placeholder="Search the dimension..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-6 text-xl outline-none focus:border-primary/50 transition-all font-light tracking-wide"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <button 
                onClick={() => setSelectedCategory('')}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                  selectedCategory === '' 
                    ? 'bg-primary text-background border-primary' 
                    : 'bg-white/5 text-white/40 border-white/10 hover:border-white/30'
                }`}
              >
                All Artifacts
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                    selectedCategory === cat 
                      ? 'bg-primary text-background border-primary' 
                      : 'bg-white/5 text-white/40 border-white/10 hover:border-white/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest">
                <SlidersHorizontal size={14} /> Sort By:
                <select 
                  className="bg-transparent text-white outline-none cursor-pointer hover:text-primary transition-colors"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="-createdAt" className="bg-background">Newest</option>
                  <option value="price" className="bg-background">Price: Low to High</option>
                  <option value="-price" className="bg-background">Price: High to Low</option>
                  <option value="-rating.average" className="bg-background">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {products.length > 0 ? (
                products.map((product: any, i: number) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-32 text-center"
                >
                  <SearchIcon className="mx-auto mb-6 text-white/5" size={80} />
                  <h3 className="text-2xl font-bold mb-2">NO SIGNALS DETECTED</h3>
                  <p className="text-white/30 font-mono text-sm uppercase tracking-widest">Try adjusting your frequency parameters</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Search;

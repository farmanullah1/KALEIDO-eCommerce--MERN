import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Package, Plus, Search, Edit3, Trash2, ExternalLink, Filter, MoreVertical, 
  CheckCircle, Clock, AlertCircle 
} from 'lucide-react';
import { getSellerProducts, deleteProduct } from '../../api/products.api';
import { LoadingSpinner } from '../../components/UIPolish';
import { fadeUp, staggerContainer } from '../../lib/animations';
import toast from 'react-hot-toast';

const Inventory = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    try {
      const { data } = await getSellerProducts();
      setProducts(data.data);
    } catch (error) {
      console.error('Failed to fetch inventory', error);
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this artifact? This cannot be undone.')) {
      try {
        await deleteProduct(id);
        toast.success('Product removed successfully');
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase tracking-widest"><CheckCircle size={10} /> Active</span>;
      case 'pending':
        return <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-500 uppercase tracking-widest"><Clock size={10} /> Pending</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase tracking-widest"><AlertCircle size={10} /> Rejected</span>;
      default:
        return status;
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6 lg:px-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">INVENTORY</h1>
            <p className="text-white/40 font-mono text-sm uppercase tracking-widest">
              Manage your digital artifacts • {products.length} Items Total
            </p>
          </div>
          <Link to="/seller/add-product" className="btn-primary px-8 py-3 flex items-center gap-2 group relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-y-0 transition-transform duration-500" />
            <Plus size={20} /> CREATE NEW ARTIFACT
          </Link>
        </div>

        {/* Toolbar */}
        <div className="glass-card p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search artifacts by name or category..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none glass-card px-4 py-3 flex items-center justify-center gap-2 text-sm hover:bg-white/5 transition-colors">
              <Filter size={16} /> Filters
            </button>
            <button className="flex-1 md:flex-none glass-card px-4 py-3 flex items-center justify-center gap-2 text-sm hover:bg-white/5 transition-colors">
              Sort By: Newest
            </button>
          </div>
        </div>

        {/* Product Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5 font-mono text-[10px] uppercase tracking-widest text-white/40">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((product, i) => (
                  <motion.tr 
                    key={product._id}
                    variants={fadeUp}
                    custom={i}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                          <img src={product.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{product.name}</p>
                          <p className="text-[10px] font-mono text-white/20 group-hover:text-primary transition-colors">{product._id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(product.moderationStatus)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-white/60">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-sm">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${product.stock < 10 ? 'text-red-400' : 'text-white/80'}`}>
                          {product.stock}
                        </span>
                        <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${product.stock < 10 ? 'bg-red-400' : 'bg-primary'}`} 
                            style={{ width: `${Math.min(product.stock, 100)}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white">
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-white/40 hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-primary">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <Package size={48} className="mx-auto mb-4 text-white/10" />
              <p className="text-white/40">No artifacts found matching your search</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Inventory;

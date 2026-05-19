import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Tag, Plus, Trash2, Edit2, Save, X, Image as ImageIcon,
  Loader2, Search, ArrowUpRight, Grid
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '../../components/UIPolish';
import { fadeUp, staggerContainer, scaleIn } from '../../lib/animations';

const CategoryManagement = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/products/categories');
      setCategories(data.data);
    } catch (error) {
      toast.error('Failed to sync category lattice');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/admin/categories/${editingId}`, formData);
        toast.success('Matrix node updated');
      } else {
        await api.post('/admin/categories', formData);
        toast.success('New node integrated into matrix');
      }
      setFormData({ name: '', description: '', image: '' });
      setIsAdding(false);
      setEditingId(null);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat: any) => {
    setFormData({ name: cat.name, description: cat.description || '', image: cat.image || '' });
    setEditingId(cat._id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Dissolve this node from the matrix?')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success('Node dissolved');
      fetchCategories();
    } catch (error) {
      toast.error('Dissolution failed');
    }
  };

  if (loading && categories.length === 0) return <LoadingSpinner size="large" />;

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6 lg:px-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 uppercase tracking-tighter">Category Matrix</h1>
            <p className="text-white/40 font-mono text-sm uppercase tracking-widest flex items-center gap-2">
              <Grid size={14} /> Structure the KALEIDO universe
            </p>
          </div>

          <button
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              setFormData({ name: '', description: '', image: '' });
            }}
            className="btn-primary px-8 py-3 flex items-center gap-2"
          >
            <Plus size={20} /> Initialize New Node
          </button>
        </div>

        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 mb-10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-magenta" />
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase tracking-widest">
                {editingId ? 'Recalibrate Node' : 'Initialize Node'}
              </h3>
              <button onClick={() => setIsAdding(false)} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Node Designation</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="e.g. Cybernetics"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Visual Hash (Image URL)</label>
                  <input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="https://..."
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Operational Protocol (Description)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    rows={3}
                    placeholder="Describe this node's purpose..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-3 font-bold uppercase tracking-widest text-white/40 hover:text-white"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-10 py-3 flex items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  Commence Integration
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat._id}
              variants={fadeUp}
              custom={i}
              className="glass-card p-6 group hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all duration-500">
                  <Tag size={24} />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(cat)}
                    className="p-2 rounded-lg bg-white/5 text-white/20 hover:text-primary hover:bg-primary/10 transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(cat._id)}
                    className="p-2 rounded-lg bg-white/5 text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{cat.name}</h3>
              <p className="text-sm text-white/40 line-clamp-2 mb-4 font-mono uppercase text-[10px] tracking-wider">
                {cat.description || 'No operational protocol defined.'}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-[10px] font-mono text-white/20">NODE ID: {cat._id.substring(cat._id.length - 8)}</span>
                <ArrowUpRight size={14} className="text-white/20 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CategoryManagement;

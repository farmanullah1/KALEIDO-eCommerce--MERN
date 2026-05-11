import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, Upload, Plus, Minus, DollarSign, Tag, Info, 
  ChevronLeft, CheckCircle, Image as ImageIcon 
} from 'lucide-react';
import { createProduct } from '../../api/products.api';
import { LoadingSpinner } from '../../components/UIPolish';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Cyberwear',
    stock: '',
    images: [''],
    details: {
      material: '',
      weight: '',
      dimensions: ''
    }
  });

  const categories = [
    'Cyberwear', 'Neural Links', 'Holographics', 'Data Shards', 'Virtual Real Estate', 'Synthetics'
  ];

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Basic validation
      if (!formData.name || !formData.price || !formData.images[0]) {
        throw new Error('Please fill all required fields including at least one image URL');
      }

      const productToSubmit = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      };

      await createProduct(productToSubmit);
      toast.success('Artifact submitted for moderation!');
      navigate('/seller/inventory');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit artifact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 font-mono text-sm uppercase tracking-widest"
        >
          <ChevronLeft size={16} /> Back to Inventory
        </button>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Package size={32} className="text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-tighter">Forge New Artifact</h1>
            <p className="text-white/40 font-mono text-sm uppercase tracking-widest">Digital Asset Creation Protocol</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Information */}
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Info size={20} className="text-primary" /> General Specs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Artifact Name *</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="e.g. Neon Ghost Neural Link"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-primary/50 transition-all"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Description</label>
                <textarea 
                  name="description"
                  rows={4}
                  placeholder="Describe the properties and lore of this artifact..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-primary/50 transition-all resize-none"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Category *</label>
                <select 
                  name="category"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-primary/50 transition-all appearance-none"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Base Price (USD) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    type="number" 
                    name="price"
                    required
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 outline-none focus:border-primary/50 transition-all font-mono"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Inventory & Media */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Tag size={20} className="text-cyan" /> Supply Control
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Stock Allocation</label>
                  <input 
                    type="number" 
                    name="stock"
                    placeholder="Units available"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-primary/50 transition-all font-mono"
                    value={formData.stock}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="p-4 bg-cyan/5 border border-cyan/10 rounded-xl flex gap-3">
                  <CheckCircle size={18} className="text-cyan shrink-0 mt-1" />
                  <p className="text-[10px] text-cyan/80 leading-relaxed uppercase tracking-wider font-mono">
                    All new artifacts undergo system verification. Average moderation time is 2-4 hours.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ImageIcon size={20} className="text-magenta" /> Visual Assets
              </h3>
              <div className="space-y-4">
                {formData.images.map((img, i) => (
                  <div key={i} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Image URL..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-magenta/50 transition-all text-xs"
                      value={img}
                      onChange={(e) => handleImageChange(i, e.target.value)}
                    />
                    {formData.images.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeImageField(i)}
                        className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Minus size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={addImageField}
                  className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-white/40 hover:border-magenta/50 hover:text-magenta transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase"
                >
                  <Plus size={18} /> Add Another View
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Specs */}
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-6">Technical Attributes (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Material</label>
                <input 
                  type="text" 
                  name="details.material"
                  placeholder="Synthetic Leather"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-primary/50 transition-all text-sm"
                  value={formData.details.material}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Weight</label>
                <input 
                  type="text" 
                  name="details.weight"
                  placeholder="450g"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-primary/50 transition-all text-sm"
                  value={formData.details.weight}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Dimensions</label>
                <input 
                  type="text" 
                  name="details.dimensions"
                  placeholder="20x15x5 cm"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-primary/50 transition-all text-sm"
                  value={formData.details.dimensions}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button 
              type="button"
              onClick={() => navigate('/seller/inventory')}
              className="px-10 py-5 font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="btn-primary px-12 py-5 text-lg font-black tracking-tighter uppercase relative overflow-hidden group min-w-[200px]"
            >
              {loading ? <LoadingSpinner size="small" /> : (
                <>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  INITIALIZE FORGE
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddProduct;

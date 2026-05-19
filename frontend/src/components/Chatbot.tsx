import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Send, X, Bot, Sparkles, Terminal, 
  ShoppingCart, Zap, ChevronRight, HelpCircle, Package, RefreshCw 
} from 'lucide-react';
import { useCartStore } from '../store/cartStore.js';
import api from '../api/axios.js';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  actions?: { label: string; onClick: () => void; icon?: any }[];
  products?: any[];
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { cart, fetchCart, addToCart } = useCartStore();

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: 'Greetings, Traveler. I am A.I.D.A. (Artificial Intelligence Dimensional Assistant). Welcome to KALEIDO. How may I guide your consciousness today?',
        timestamp: new Date(),
        actions: [
          { label: 'Recommend Cybernetics', onClick: () => handleAction('recommend') },
          { label: 'Check Cart Status', onClick: () => handleAction('cart') },
          { label: 'How to Become a Seller', onClick: () => handleAction('seller') }
        ]
      }
    ]);

    // Fetch initial product set for real recommendations
    const getProducts = async () => {
      try {
        const { data } = await api.get('/products?limit=5');
        setAvailableProducts(data.data.products || []);
      } catch (err) {
        console.error('Chatbot product sync failed', err);
      }
    };
    getProducts();
    fetchCart();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleAction = (type: string) => {
    let responseText = '';
    let actions: any[] = [];
    let productsList: any[] = [];

    setIsTyping(true);

    setTimeout(() => {
      if (type === 'recommend') {
        if (availableProducts.length > 0) {
          responseText = 'Analyzing catalog lattices... Here are the top digital artifacts synced to the global marketplace:';
          productsList = availableProducts;
        } else {
          responseText = 'No artifacts currently manifested in the global catalog. Check back in a few cycles.';
        }
      } else if (type === 'cart') {
        if (cart && cart.items && cart.items.length > 0) {
          const itemsCount = cart.items.reduce((acc: number, it: any) => acc + it.quantity, 0);
          responseText = `Your current collection lattice has ${itemsCount} active artifact(s). Total synchronized value: $${cart.total.toLocaleString()}.`;
          actions = [
            { label: 'Proceed to Checkout', onClick: () => { window.location.href = '/checkout'; } }
          ];
        } else {
          responseText = 'Your local collection lattice is completely vacant. Shall we browse some cyberware?';
          actions = [
            { label: 'Browse Products', onClick: () => handleAction('recommend') }
          ];
        }
      } else if (type === 'seller') {
        responseText = 'Upgrading to Merchant status requires verified credentials. Head to the threshold ritual, fill out your Shop Designation, upload your banner/logo, and submit for admin authorization!';
        actions = [
          { label: 'Begin Upgrading', onClick: () => { window.location.href = '/become-seller'; } }
        ];
      }

      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: responseText,
          timestamp: new Date(),
          actions,
          products: productsList
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput('');
    
    // Append user message
    setMessages(prev => [
      ...prev,
      { id: Math.random().toString(), sender: 'user', text: userText, timestamp: new Date() }
    ]);

    setIsTyping(true);

    // Dynamic Sci-fi Mock response logic
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let reply = "Processing transmission... Query could not be successfully synchronized. Please try using one of the quick actions below.";
      let actions: any[] = [];
      let productsList: any[] = [];

      if (lower.includes('recommend') || lower.includes('show') || lower.includes('product') || lower.includes('buy')) {
        reply = "Initiating spatial catalog query. The following high-fidelity items match your neural signature:";
        productsList = availableProducts;
      } else if (lower.includes('cart') || lower.includes('basket') || lower.includes('price')) {
        if (cart && cart.items && cart.items.length > 0) {
          const itemsCount = cart.items.reduce((acc: number, it: any) => acc + it.quantity, 0);
          reply = `Lattice check complete. You have ${itemsCount} artifact(s) anchored in your cart. Current transaction value: $${cart.total.toLocaleString()}.`;
          actions = [{ label: 'Verify Collection (Cart)', onClick: () => { window.location.href = '/cart'; } }];
        } else {
          reply = "Your collection lattice is currently vacant. I recommend browsing trending synthetics and holographic gears.";
          actions = [{ label: 'Browse Products', onClick: () => handleAction('recommend') }];
        }
      } else if (lower.includes('seller') || lower.includes('merchant') || lower.includes('shop') || lower.includes('sell')) {
        reply = "Open your own digital emporium! Complete your Merchant upgrade form, upload visual assets, and once approved by the Overlords, you can immediately begin listing artifacts.";
        actions = [{ label: 'Initiate Upgrade', onClick: () => { window.location.href = '/become-seller'; } }];
      } else if (lower.includes('shipping') || lower.includes('delivery') || lower.includes('time')) {
        reply = "KALEIDO ships digital assets instantly via quantum-link channels. Physical and synthetic gears take approximately 2-4 standard cycles to manifest at your coordinate matrix.";
      } else if (lower.includes('admin') || lower.includes('root') || lower.includes('moderation')) {
        reply = "Administrative Overlords can monitor Platform Security, clear incoming product registries, approve merchant licenses, and recalibrate category tokens.";
        actions = [{ label: 'System Dashboard', onClick: () => { window.location.href = '/admin/dashboard'; } }];
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        reply = "Synchronized greetings, Traveler! I am standing by to assist with your marketplace interactions. How may I be of service?";
        actions = [
          { label: 'Recommend Cybernetics', onClick: () => handleAction('recommend') },
          { label: 'Check Cart Status', onClick: () => handleAction('cart') }
        ];
      }

      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: reply,
          timestamp: new Date(),
          actions,
          products: productsList
        }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleProductAdd = async (productId: string) => {
    await addToCart(productId, 1);
  };

  return (
    <>
      {/* Floating AIDA Activation Core */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center border transition-all duration-300 ${
            isOpen 
              ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
              : 'bg-primary/10 border-primary text-primary shadow-[0_0_25px_rgba(0,255,255,0.3)] hover:shadow-[0_0_40px_rgba(0,255,255,0.5)] animate-pulse-slow'
          }`}
        >
          {/* Holographic glowing scan line */}
          <div className="absolute inset-0 rounded-full border border-white/5 bg-gradient-to-t from-transparent via-white/5 to-transparent animate-pulse-slow" />
          {isOpen ? <X className="w-7 h-7" /> : <Bot className="w-8 h-8" />}
          
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
            </span>
          )}
        </motion.button>
      </div>

      {/* Holographic Chat Screen */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-24 right-6 w-[400px] h-[600px] rounded-2xl glass-card border border-white/10 z-50 overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          >
            {/* Futuristic Header */}
            <div className="p-5 bg-white/5 border-b border-white/10 flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-secondary to-primary animate-gradient-x" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center relative overflow-hidden group">
                  <Bot className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
                  <div className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base tracking-wide flex items-center gap-1.5 uppercase italic">
                    AIDA Core <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-mono text-primary uppercase tracking-widest">Neural Link Syncing</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 text-white/30 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-background/80 scrollbar-thin">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[85%] space-y-3">
                    <div 
                      className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-secondary text-background font-medium rounded-tr-none shadow-[0_0_15px_rgba(255,0,245,0.2)]'
                          : 'bg-white/5 border border-white/10 text-white/95 rounded-tl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>

                    {/* Nested Product Recommendations Grid */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="grid grid-cols-1 gap-3 pt-2">
                        {msg.products.map((prod) => (
                          <div 
                            key={prod._id}
                            className="bg-white/5 border border-white/10 rounded-xl p-3 flex gap-3 hover:border-primary/50 transition-colors"
                          >
                            <img 
                              src={prod.images?.[0] || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=300'} 
                              alt={prod.name} 
                              className="w-16 h-16 rounded-lg object-cover bg-white/5 border border-white/10"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-xs text-white truncate">{prod.name}</h4>
                              <p className="text-[10px] text-white/40 uppercase font-mono tracking-wider mt-0.5">{prod.category}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="font-mono text-xs text-primary font-bold">${prod.price}</span>
                                <button 
                                  onClick={() => handleProductAdd(prod._id)}
                                  className="px-2.5 py-1 rounded bg-primary text-background text-[10px] font-bold uppercase tracking-wider hover:scale-105 active:scale-95 transition-transform flex items-center gap-1"
                                >
                                  <Zap className="w-3 h-3" /> Add
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Clickable Quick Actions */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.actions.map((act, i) => (
                          <button
                            key={i}
                            onClick={act.onClick}
                            className="px-3 py-1.5 rounded-full border border-white/10 hover:border-primary/50 hover:bg-primary/10 text-white/60 hover:text-white transition-all text-xs font-mono flex items-center gap-1.5"
                          >
                            {act.label} <ChevronRight className="w-3 h-3 text-primary" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/10 flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Transmit thought vector..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-white"
              />
              <button
                type="submit"
                className="p-3 bg-primary text-background rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-[0_0_15px_rgba(0,255,255,0.3)]"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;

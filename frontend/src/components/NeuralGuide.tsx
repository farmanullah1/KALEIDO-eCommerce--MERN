import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Cpu, Sparkles, User, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const NeuralGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Neural connection established. I am the KALEIDO Guide. How can I assist your dimensional exploration today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let response = "I'm analyzing the collective database for that. In the meantime, have you checked our latest Neural Synapse artifacts?";
      
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('search') || lowerInput.includes('find')) {
        response = "I can help you locate artifacts. Are you looking for Electronics, Fashion, or something more... esoteric?";
      } else if (lowerInput.includes('order') || lowerInput.includes('track')) {
        response = "You can track your order manifestations in your Profile dashboard under 'Active Transmissions'.";
      } else if (lowerInput.includes('who are you')) {
        response = "I am a sub-process of the KALEIDO core, designed to assist users in navigating this multi-dimensional marketplace.";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-8 z-[100] w-16 h-16 rounded-full bg-primary text-background shadow-[0_0_30px_rgba(0,245,255,0.4)] flex items-center justify-center group"
      >
        <Brain className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-magenta rounded-full border-2 border-background animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-32 right-8 z-[101] w-[400px] h-[600px] glass-card flex flex-col overflow-hidden shadow-2xl border-primary/20"
          >
            {/* Header */}
            <div className="p-6 bg-primary text-background flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Cpu size={20} className="animate-spin-slow" />
                <div>
                  <h3 className="font-black uppercase tracking-tighter text-sm">Neural Guide v4.2</h3>
                  <p className="text-[8px] font-mono opacity-60 uppercase tracking-widest">Core Status: Optimal</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary/10 text-white border border-primary/20 rounded-tr-none' 
                      : 'bg-white/5 text-white/70 border border-white/5 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
                    {[0, 1, 2].map(d => (
                      <motion.div
                        key={d}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }}
                        className="w-1.5 h-1.5 bg-primary rounded-full"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide border-t border-white/5">
              {['Track Order', 'Find Fashion', 'Seller Help'].map(action => (
                <button
                  key={action}
                  onClick={() => setInput(action)}
                  className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[9px] font-mono text-white/40 hover:text-primary hover:border-primary/30 transition-all uppercase whitespace-nowrap"
                >
                  {action}
                </button>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 bg-white/[0.02] border-t border-white/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask the collective..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-xs outline-none focus:border-primary/50 transition-all"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:scale-110 transition-transform">
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NeuralGuide;

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Cpu, Shield, Zap, MessageCircle, Share2, ExternalLink, MessageSquare, Send, X, Terminal, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { useSocket } from '../hooks/useSocket.js';

const NeuralLink = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const { user, isAuthenticated } = useAuthStore();
  const socket = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (socket) {
      (socket as any).on('receive_message', (msg: any) => {
        setMessages(prev => [...prev, msg]);
      });
    }
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      sender: user?.name || 'Anonymous',
      text: message,
      timestamp: new Date().toLocaleTimeString(),
      isSelf: true
    };

    setMessages(prev => [...prev, newMsg]);
    
    if (socket) {
      (socket as any).emit('send_message', newMsg);
    }

    // Simulated AI Response for demo if no real backend chat logic
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'KALEIDO OS',
        text: `Neural connection received. Analyzing request: "${message}"... Connection stable.`,
        timestamp: new Date().toLocaleTimeString(),
        isSelf: false
      }]);
    }, 1000);

    setMessage('');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.8, y: 20, filter: 'blur(10px)' }}
            className="glass-card w-80 md:w-96 h-[500px] mb-4 flex flex-col overflow-hidden shadow-2xl border-primary/20"
          >
            {/* Header */}
            <div className="p-4 bg-primary/10 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Terminal size={16} className="text-primary animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-widest uppercase">Neural Link</h4>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                    <span className="text-[8px] font-mono text-white/40 uppercase">Encrypted Connection</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <User size={32} className="text-white/5 mb-4" />
                  <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest leading-relaxed">
                    Welcome to the global neural network. Your thoughts are transmitted securely across dimensions.
                  </p>
                </div>
              )}
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.isSelf ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={msg.id}
                  className={`flex ${msg.isSelf ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl p-3 ${
                    msg.isSelf 
                      ? 'bg-primary/20 border border-primary/20 text-white rounded-br-none' 
                      : 'bg-white/5 border border-white/10 text-white/80 rounded-bl-none'
                  }`}>
                    {!msg.isSelf && <p className="text-[8px] font-mono text-primary uppercase mb-1">{msg.sender}</p>}
                    <p className="text-xs leading-relaxed">{msg.text}</p>
                    <p className="text-[8px] text-white/20 mt-1 text-right">{msg.timestamp}</p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="TRANSMIT THOUGHT..."
                className="flex-1 bg-background border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono"
              />
              <button 
                onClick={handleSend}
                className="w-10 h-10 bg-primary/20 border border-primary/30 rounded-xl flex items-center justify-center hover:bg-primary/30 transition-colors"
              >
                <Send size={16} className="text-primary" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl relative group ${
          isOpen ? 'bg-secondary' : 'bg-primary'
        }`}
      >
        <div className="absolute inset-0 rounded-full bg-inherit animate-ping opacity-20" />
        <MessageSquare className={`text-background ${isOpen ? 'rotate-90' : 'rotate-0'} transition-transform duration-300`} />
        
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-magenta text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background text-white">
            1
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default NeuralLink;

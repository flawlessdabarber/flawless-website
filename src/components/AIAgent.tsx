import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Globe, Volume2, VolumeX, Phone, Mic } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAI } from '../lib/AIContext';

export default function AIAgent() {
  const { 
    isAIActive, setIsAIActive, messages, isListening, isSpeaking, setIsSpeaking, 
    language, setLanguage, sendMessage, startListening 
  } = useAI();
  
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    setInput('');
    await sendMessage(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isAIActive && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 sm:w-96 glass-dark rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px]"
          >
            <div className="p-4 bg-brand-green text-black flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                <span className="font-bold uppercase tracking-tighter">Flawless AI</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} className="hover:opacity-70" title="Switch Language">
                  <Globe size={18} />
                </button>
                <button onClick={() => setIsSpeaking(!isSpeaking)} className="hover:opacity-70" title="Toggle Voice">
                  {isSpeaking ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                <button onClick={() => setIsAIActive(false)} className="hover:opacity-70">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-xl text-sm",
                    m.role === 'user' ? "bg-brand-green text-black" : "bg-white/10 text-white"
                  )}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isListening && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-3 rounded-xl text-xs text-white/50 animate-pulse flex items-center gap-2">
                    <Mic size={12} /> Listening...
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type or speak..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-green"
              />
              <button 
                onClick={() => handleSend()}
                className="p-2 bg-brand-green text-black rounded-lg hover:bg-brand-green/80 transition-colors"
              >
                <Send size={18} />
              </button>
              <button 
                className={cn("p-2 rounded-lg transition-colors", isListening ? "bg-red-500 text-white" : "bg-white/10 text-white")}
                onClick={startListening}
                title="Start Voice Input"
              >
                <Mic size={18} />
              </button>
              <button 
                className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                onClick={() => handleSend("Transfer me to a live barber")}
                title="Transfer to Call"
              >
                <Phone size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

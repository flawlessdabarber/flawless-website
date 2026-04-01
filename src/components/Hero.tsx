import React from 'react';
import { motion } from 'motion/react';
import { Scissors, Zap, Star, ShieldCheck, Mic } from 'lucide-react';
import { useAI } from '../lib/AIContext';
import { cn } from '../lib/utils';

export default function Hero() {
  const { isAIActive, setIsAIActive, isListening } = useAI();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className={cn(
          "absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] transition-all duration-1000",
          isAIActive ? "bg-brand-green/30 animate-pulse" : "bg-brand-green/10"
        )} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-7xl md:text-9xl font-bold uppercase tracking-tighter leading-none mb-6">
            Flawless <br /> <span className="text-transparent border-text">Da Barber</span>
          </h1>
        </motion.div>

        {/* Interactive Orb Visualizer */}
        <div className="flex flex-col items-center gap-8 mb-12">
          <div 
            className="orb-container group cursor-pointer relative"
            onClick={() => setIsAIActive(!isAIActive)}
          >
            <motion.div 
              className={cn(
                "orb-inner transition-all duration-500",
                isAIActive ? "scale-110 shadow-[0_0_50px_rgba(0,255,0,0.2)]" : ""
              )}
              animate={isAIActive ? { 
                scale: [1.1, 1.15, 1.1],
                rotate: [0, 10, -10, 0]
              } : { 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: isAIActive ? 2 : 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="flex items-end h-32">
                {[...Array(12)].map((_, i) => {
                  const colors = isAIActive 
                    ? ['bg-brand-green', 'bg-white', 'bg-brand-green']
                    : ['bg-white', 'bg-brand-green', 'bg-gray-400'];
                  return (
                    <div 
                      key={i} 
                      className={cn(
                        "visualizer-bar transition-all duration-300",
                        colors[i % colors.length],
                        isAIActive ? "w-4 md:w-6 mx-1" : ""
                      )} 
                      style={{ 
                        animationDelay: `${i * 0.1}s`,
                        height: isAIActive ? `${60 + Math.random() * 40}%` : `${40 + Math.random() * 60}%`,
                        animationDuration: isAIActive ? '0.5s' : '1.5s'
                      }} 
                    />
                  );
                })}
              </div>
            </motion.div>

            {isListening && isAIActive && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-brand-green animate-pulse">
                <Mic size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Listening...</span>
              </div>
            )}
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-green animate-pulse"
          >
            Click to speak to AI
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {/* Buttons removed per request */}
        </motion.div>

        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/10 pt-12 w-full max-w-4xl">
          {[
            { icon: Scissors, label: "Precision Cuts" },
            { icon: Zap, label: "Mobile Service" },
            { icon: Star, label: "VIP Membership" },
            { icon: ShieldCheck, label: "Skin Therapy" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3 group">
              <item.icon className="text-brand-green group-hover:scale-110 transition-transform" />
              <span className="text-[10px] uppercase tracking-widest opacity-50">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .border-text {
          -webkit-text-stroke: 1px white;
        }
      `}</style>
    </section>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { Play, Mic2, ExternalLink } from 'lucide-react';
import { useAI } from '../lib/AIContext';

export default function Podcast() {
  const { setSelectedPodcast } = useAI();

  return (
    <section id="podcast" className="py-24 bg-brand-gray/10 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-center lg:text-left"
          >
            <span className="text-brand-green font-mono text-xs tracking-widest uppercase mb-4 block">The Culture Talk</span>
            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-8">Flawless <br /> Conversations</h2>
            <p className="text-white/60 mb-8 text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Dive into the minds of industry leaders, entrepreneurs, and cultural icons. We discuss everything from grooming trends to investment strategies and community growth.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => setSelectedPodcast('Latest Episode: Building a Grooming Empire')}
                className="flex items-center gap-3 px-8 py-4 bg-brand-green text-black font-bold uppercase tracking-widest rounded-sm"
              >
                <Play size={20} fill="currentColor" />
                Listen Now
              </button>
              <button 
                onClick={() => setSelectedPodcast('Guest Request')}
                className="flex items-center gap-3 px-8 py-4 border border-white/20 hover:bg-white/10 transition-all uppercase tracking-widest rounded-sm"
              >
                <Mic2 size={20} />
                Be A Guest
              </button>
            </div>
          </motion.div>

          <div className="relative">
            <div className="aspect-square glass rounded-3xl overflow-hidden relative group">
              <img 
                src="https://picsum.photos/seed/podcast/800/800" 
                alt="Podcast Studio" 
                className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-brand-green rounded-full flex items-center justify-center text-black shadow-[0_0_50px_rgba(0,255,0,0.3)]">
                  <Play size={40} fill="currentColor" />
                </div>
              </div>
            </div>
            
            {/* Floating Episode Card */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-10 -left-10 glass p-6 rounded-2xl max-w-xs shadow-2xl"
            >
              <p className="text-brand-green text-[10px] font-bold uppercase tracking-widest mb-2">Latest Episode</p>
              <h4 className="font-bold mb-2">Building a Grooming Empire with Flawless</h4>
              <p className="text-xs text-white/50 mb-4">Episode 42 • 45 mins</p>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-tighter cursor-pointer hover:text-brand-green">
                View Show Notes <ExternalLink size={12} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

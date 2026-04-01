import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAI } from '../lib/AIContext';

const hairstyles = [
  { id: 1, name: 'Precision Fade', image: 'https://picsum.photos/seed/cut1/600/600' },
  { id: 2, name: 'Textured Crop', image: 'https://picsum.photos/seed/cut2/600/600' },
  { id: 3, name: 'Classic Taper', image: 'https://picsum.photos/seed/cut3/600/600' },
  { id: 4, name: 'Modern Pompadour', image: 'https://picsum.photos/seed/cut4/600/600' },
  { id: 5, name: 'Buzz Cut Design', image: 'https://picsum.photos/seed/cut5/600/600' },
  { id: 6, name: 'Waves & Lineup', image: 'https://picsum.photos/seed/cut6/600/600' },
];

export default function BodyOfWork() {
  const { setSelectedWork } = useAI();
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 3;

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % (hairstyles.length - itemsToShow + 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + (hairstyles.length - itemsToShow + 1)) % (hairstyles.length - itemsToShow + 1));
  };

  const visibleStyles = hairstyles.slice(currentIndex, currentIndex + itemsToShow);

  return (
    <section id="body-of-work" className="py-24 bg-black overflow-hidden relative">
      <div className="container mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8">
          <div className="text-center md:text-left">
            <span className="text-brand-green font-mono text-xs tracking-widest uppercase mb-4 block">The Portfolio</span>
            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none">Body of <br /> Work</h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-white/40 text-sm max-w-xs text-center md:text-right hidden md:block">
              A showcase of precision, style, and the art of modern grooming. Every cut is a masterpiece.
            </p>
            <div className="flex gap-2">
              <button 
                onClick={prev}
                className="w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-brand-green hover:text-black transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={next}
                className="w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-brand-green hover:text-black transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {visibleStyles.map((style, i) => (
              <motion.div
                key={style.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setSelectedWork(style.name)}
              >
                <div className="relative aspect-square mb-6 max-w-[240px] mx-auto">
                  {/* The "Cut Out" Effect using a custom mask/clip-path */}
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="relative w-full h-full overflow-hidden"
                    style={{
                      // Simulating a head-like cut out shape
                      clipPath: 'polygon(50% 0%, 85% 15%, 100% 50%, 85% 85%, 50% 100%, 15% 85%, 0% 50%, 15% 15%)',
                    }}
                  >
                    <img 
                      src={style.image} 
                      alt={style.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                  
                  {/* Floating Label */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass px-6 py-2 rounded-full border-brand-green/30 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-green whitespace-nowrap">
                      {style.name}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Background Text */}
      <div className="absolute left-0 w-full overflow-hidden pointer-events-none opacity-[0.02] select-none">
        <p className="text-[20vw] font-black uppercase whitespace-nowrap leading-none">
          Precision • Style • Art • Grooming •
        </p>
      </div>
    </section>
  );
}

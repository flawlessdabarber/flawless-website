import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAI } from '../lib/AIContext';
import { cn } from '../lib/utils';

const portfolioItems = [
  { id: 1, name: 'Precision Fade', category: 'Hair Cuts', image: 'https://picsum.photos/seed/cut1/600/600' },
  { id: 2, name: 'Textured Crop', category: 'Hair Cuts', image: 'https://picsum.photos/seed/cut2/600/600' },
  { id: 3, name: 'Classic Taper', category: 'Hair Cuts', image: 'https://picsum.photos/seed/cut3/600/600' },
  { id: 4, name: 'Modern Pompadour', category: 'Hair Styles', image: 'https://picsum.photos/seed/cut4/600/600' },
  { id: 5, name: 'Buzz Cut Design', category: 'Urban Styles', image: 'https://picsum.photos/seed/cut5/600/600' },
  { id: 6, name: 'Waves & Lineup', category: 'Urban Styles', image: 'https://picsum.photos/seed/cut6/600/600' },
  { id: 7, name: 'Editorial Look', category: 'Sessions', image: 'https://picsum.photos/seed/cut7/600/600' },
  { id: 8, name: 'Runway Prep', category: 'Sessions', image: 'https://picsum.photos/seed/cut8/600/600' },
  { id: 9, name: 'Beard Trim & Line', category: 'Clean Ups', image: 'https://picsum.photos/seed/cut9/600/600' },
  { id: 10, name: 'Neck Taper', category: 'Clean Ups', image: 'https://picsum.photos/seed/cut10/600/600' },
  { id: 11, name: 'Braids & Fade', category: 'Hair Styles', image: 'https://picsum.photos/seed/cut11/600/600' },
];

const categories = ['All', 'Hair Cuts', 'Hair Styles', 'Urban Styles', 'Sessions', 'Clean Ups'];

export default function BodyOfWork() {
  const { setSelectedWork } = useAI();
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [leftClicks, setLeftClicks] = useState(0);
  const [rightClicks, setRightClicks] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filteredStyles = activeCategory === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  const next = () => {
    setRightClicks(c => c + 1);
    setCurrentIndex((prev) => (prev + 1) % filteredStyles.length);
    setSelectedId(null);
  };

  const prev = () => {
    setLeftClicks(c => c + 1);
    setCurrentIndex((prev) => (prev - 1 + filteredStyles.length) % filteredStyles.length);
    setSelectedId(null);
  };

  const currentStyle = filteredStyles[currentIndex];

  const getSlideIndex = (offset: number) => {
    return (currentIndex + offset + filteredStyles.length) % filteredStyles.length;
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentIndex(0);
  };

  return (
    <section id="body-of-work" className="py-24 bg-black overflow-hidden relative">
      <div className="container mx-auto px-6 mb-16">
        <div className="flex flex-col items-center md:items-start gap-8 mb-8">
          <div className="text-center md:text-left">
            <span className="text-brand-green font-mono text-xs tracking-widest uppercase mb-4 block">The Portfolio</span>
            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none">Body of <br /> Work</h2>
          </div>
        </div>

        {/* Filter */}
        <div className="flex justify-center mb-16">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 glass p-2 rounded-full">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={cn(
                  "px-4 md:px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                  activeCategory === category 
                    ? "border border-brand-green text-brand-green bg-brand-green/10" 
                    : "border border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredStyles.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center text-white/50 uppercase tracking-widest">
            No styles found in this category.
          </div>
        ) : (
          <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center py-12">
            <button 
              onClick={prev}
              className="absolute left-0 md:left-12 z-20 p-4 glass rounded-full hover:bg-white/10 transition-colors"
            >
              <motion.div
                key={leftClicks}
                initial={{ color: "#ffffff", scale: 1, filter: "drop-shadow(0 0 0px #00ff00)" }}
                animate={leftClicks > 0 ? { 
                  color: ["#ffffff", "#00ff00", "#ffffff", "#808080", "#00ff00", "#ffffff", "#ffffff"],
                  scale: [1, 1.6, 0.7, 1.4, 0.8, 1.2, 1],
                  x: [0, -8, 8, -4, 4, -2, 0],
                  y: [0, 4, -4, 2, -2, 1, 0],
                  skewX: [0, 30, -30, 15, -15, 5, 0],
                  opacity: [1, 0, 1, 0.2, 1, 0.5, 1],
                  filter: [
                    "drop-shadow(0 0 0px #00ff00)",
                    "drop-shadow(0 0 40px #00ff00)",
                    "drop-shadow(0 0 10px #ffffff)",
                    "drop-shadow(0 0 50px #00ff00)",
                    "drop-shadow(0 0 20px #808080)",
                    "drop-shadow(0 0 30px #00ff00)",
                    "drop-shadow(0 0 0px #00ff00)"
                  ]
                } : { color: "#ffffff" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <ChevronLeft size={32} />
              </motion.div>
            </button>

            <div className="flex items-center justify-center gap-4 md:gap-8 overflow-hidden w-full px-12 py-8">
              {[-1, 0, 1].map((offset) => {
                let index = (currentIndex + offset) % filteredStyles.length;
                if (index < 0) index += filteredStyles.length;
                const style = filteredStyles[index];
                const isCenter = offset === 0;

                if (!style) return null;

                return (
                  <button
                    key={`${style.id}-${offset}`}
                    onClick={() => {
                      if (isCenter) {
                        setSelectedId(style.id);
                        setSelectedWork(style.name);
                      } else if (offset === -1) {
                        prev();
                      } else {
                        next();
                      }
                    }}
                    className={cn(
                      "relative flex flex-col items-center transition-all duration-500",
                      isCenter ? "w-64 md:w-80 opacity-100 scale-110 z-10" : "w-40 md:w-56 opacity-30 scale-90 blur-[2px] hidden sm:flex",
                      isCenter && selectedId === style.id ? "ring-2 ring-brand-green ring-offset-4 ring-offset-black rounded-3xl" : ""
                    )}
                  >
                    <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-black group">
                      <img 
                        src={style.image} 
                        alt={style.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                      
                      {isCenter && (
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-center z-20">
                          <p className="text-[10px] uppercase tracking-widest text-brand-green font-bold mb-2">{style.category}</p>
                          <h3 className="text-xl md:text-2xl font-bold uppercase text-white">{style.name}</h3>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <button 
              onClick={next}
              className="absolute right-0 md:right-12 z-20 p-4 glass rounded-full hover:bg-white/10 transition-colors"
            >
              <motion.div
                key={rightClicks}
                initial={{ color: "#ffffff", scale: 1, filter: "drop-shadow(0 0 0px #00ff00)" }}
                animate={rightClicks > 0 ? { 
                  color: ["#ffffff", "#00ff00", "#ffffff", "#808080", "#00ff00", "#ffffff", "#ffffff"],
                  scale: [1, 1.6, 0.7, 1.4, 0.8, 1.2, 1],
                  x: [0, 8, -8, 4, -4, 2, 0],
                  y: [0, 4, -4, 2, -2, 1, 0],
                  skewX: [0, -30, 30, -15, 15, -5, 0],
                  opacity: [1, 0, 1, 0.2, 1, 0.5, 1],
                  filter: [
                    "drop-shadow(0 0 0px #00ff00)",
                    "drop-shadow(0 0 40px #00ff00)",
                    "drop-shadow(0 0 10px #ffffff)",
                    "drop-shadow(0 0 50px #00ff00)",
                    "drop-shadow(0 0 20px #808080)",
                    "drop-shadow(0 0 30px #00ff00)",
                    "drop-shadow(0 0 0px #00ff00)"
                  ]
                } : { color: "#ffffff" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <ChevronRight size={32} />
              </motion.div>
            </button>
          </div>
        )}
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

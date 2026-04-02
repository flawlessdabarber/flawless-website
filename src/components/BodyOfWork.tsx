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

  const filteredStyles = activeCategory === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredStyles.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredStyles.length) % filteredStyles.length);
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
        <div className="flex flex-col items-center gap-8 mb-8">
          <div className="text-center">
            <span className="text-brand-green font-mono text-xs tracking-widest uppercase mb-4 block">The Portfolio</span>
            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none">Body of <br /> Work</h2>
          </div>
        </div>

        {/* Controls (Arrows) */}
        <div className="flex justify-center gap-4 mb-8">
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

        {/* Filter */}
        <div className="flex justify-center">
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
      </div>

      <div className="container mx-auto px-6">
        {filteredStyles.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center text-white/50 uppercase tracking-widest">
            No styles found in this category.
          </div>
        ) : (
          <div className="relative h-[600px] flex items-center justify-center mb-12">
            
            {/* Previous Slide (Partial) */}
            {filteredStyles.length > 1 && (
              <div 
                className="absolute left-0 w-1/3 h-[400px] opacity-30 scale-75 -translate-x-1/2 cursor-pointer z-0 hidden md:block"
                onClick={prev}
              >
                <img src={filteredStyles[getSlideIndex(-1)].image} alt="Previous" className="w-full h-full object-cover rounded-3xl grayscale transition-all duration-700" referrerPolicy="no-referrer" />
              </div>
            )}

            {/* Current Slide */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${currentStyle.id}`}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full md:w-1/2 h-[500px] group cursor-pointer"
                onClick={() => setSelectedWork(currentStyle.name)}
              >
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="relative w-full h-full overflow-hidden rounded-3xl shadow-2xl shadow-black/50"
                >
                  <img 
                    src={currentStyle.image} 
                    alt={currentStyle.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Product Info Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-8 pt-32">
                    <p className="text-[10px] uppercase tracking-widest text-brand-green font-bold mb-1">{currentStyle.category}</p>
                    <h3 className="text-3xl font-bold uppercase text-white">{currentStyle.name}</h3>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Next Slide (Partial) */}
            {filteredStyles.length > 1 && (
              <div 
                className="absolute right-0 w-1/3 h-[400px] opacity-30 scale-75 translate-x-1/2 cursor-pointer z-0 hidden md:block"
                onClick={next}
              >
                <img src={filteredStyles[getSlideIndex(1)].image} alt="Next" className="w-full h-full object-cover rounded-3xl grayscale transition-all duration-700" referrerPolicy="no-referrer" />
              </div>
            )}
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

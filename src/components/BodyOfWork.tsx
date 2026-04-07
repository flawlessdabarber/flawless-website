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
  const [direction, setDirection] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filteredStyles = activeCategory === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + filteredStyles.length) % filteredStyles.length);
    setSelectedId(null);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
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
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 glass p-2 rounded-2xl">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={cn(
                  "px-4 md:px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
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
          <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-12">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="flex items-center justify-center gap-4 md:gap-8 overflow-hidden w-full px-4 md:px-12 py-8 cursor-grab active:cursor-grabbing min-h-[400px]"
            >
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                {[-1, 0, 1].map((offset) => {
                  let displayStyles = [...filteredStyles];
                  if (filteredStyles.length === 1) {
                    displayStyles = [
                      { ...filteredStyles[0], id: Number(filteredStyles[0].id) + 1000 },
                      filteredStyles[0],
                      { ...filteredStyles[0], id: Number(filteredStyles[0].id) + 2000 }
                    ];
                  } else if (filteredStyles.length === 2) {
                    displayStyles = [
                      filteredStyles[0],
                      filteredStyles[1],
                      { ...filteredStyles[0], id: Number(filteredStyles[0].id) + 1000 },
                      { ...filteredStyles[1], id: Number(filteredStyles[1].id) + 2000 }
                    ];
                  }

                  let index = (currentIndex + offset) % displayStyles.length;
                  if (index < 0) index += displayStyles.length;
                  const style = displayStyles[index];
                  const isCenter = offset === 0;

                  if (!style) return null;
                  
                  // Use original ID for selection
                  const originalId = style.id > 1000 ? (style.id > 2000 ? style.id - 2000 : style.id - 1000) : style.id;

                  return (
                    <motion.div
                      layout
                      key={style.id}
                      custom={direction}
                      initial={{ 
                        x: direction > 0 ? 100 : -100, 
                        opacity: 0,
                        scale: 0.8
                      }}
                      animate={{ 
                        x: 0, 
                        opacity: isCenter ? 1 : 0.3,
                        scale: isCenter ? 1 : 0.9,
                        filter: isCenter ? "blur(0px)" : "blur(2px)"
                      }}
                      exit={{ 
                        x: direction < 0 ? 100 : -100, 
                        opacity: 0,
                        scale: 0.8,
                        filter: "blur(4px)"
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      onClick={() => {
                        if (isCenter) {
                          setSelectedId(originalId);
                          setSelectedWork(style.name);
                        } else if (offset === -1) {
                          paginate(-1);
                        } else {
                          paginate(1);
                        }
                      }}
                      className={cn(
                        "relative flex flex-col items-center shrink-0 cursor-pointer",
                        isCenter ? "w-64 md:w-80 z-10" : "w-40 md:w-56 hidden sm:flex z-0",
                        isCenter && selectedId === originalId ? "ring-2 ring-brand-green ring-offset-4 ring-offset-black rounded-3xl" : ""
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
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Dashes Pagination */}
            <div className="flex justify-center gap-2 mt-4 flex-wrap">
              {filteredStyles.map((_, idx) => {
                const isActive = (currentIndex % filteredStyles.length) === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > (currentIndex % filteredStyles.length) ? 1 : -1);
                      setCurrentIndex(idx);
                    }}
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      isActive ? "w-8 bg-brand-green" : "w-4 bg-brand-green/20 hover:bg-brand-green/40"
                    )}
                  />
                );
              })}
            </div>
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

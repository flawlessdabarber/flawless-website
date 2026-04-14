import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Crown, Briefcase, TrendingUp, Baby } from 'lucide-react';
import { useAI } from '../lib/AIContext';
import { cn } from '../lib/utils';

type ServiceType = 'cut' | 'style' | 'urban';

export default function Membership() {
  const { setSelectedMembership } = useAI();
  const [routine, setRoutine] = useState(1);
  const [serviceType, setServiceType] = useState<ServiceType>('cut');
  const [tierIndex, setTierIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setTierIndex((prev) => (prev + newDirection + 4) % 4);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  const getPrice = (tierName: string) => {
    if (tierName === 'Kids') {
      const base = serviceType === 'cut' ? 50 : serviceType === 'style' ? 75 : 100;
      return base * routine;
    }
    if (tierName === 'Adults') {
      const base = serviceType === 'cut' ? 100 : serviceType === 'style' ? 125 : 150;
      return base * routine;
    }
    if (tierName === 'Corporate') {
      return 500 * routine;
    }
    if (tierName === 'Investment') {
      return 10000 * routine;
    }
    return 0;
  };

  const tiers = [
    {
      name: 'Kids',
      icon: Baby,
      features: [`${routine} ${serviceType}s per month`, 'Priority booking', 'Complimentary drink'],
      description: 'Premium grooming for the next generation.'
    },
    {
      name: 'Adults',
      icon: Crown,
      features: [`${routine} ${serviceType}s per month`, 'Hot towel shave', '10% off merchandise', 'VIP Lounge access'],
      description: 'The standard for the modern gentleman.'
    },
    {
      name: 'Corporate',
      icon: Briefcase,
      features: ['Team grooming (up to 5)', 'Mobile service included', 'Once per month', 'Brand placement'],
      description: 'Elevate your team\'s professional image.'
    },
    {
      name: 'Investment',
      icon: TrendingUp,
      features: [`${routine} Premium sessions per month`, 'Lifetime membership', 'Equity options', 'Personal concierge'],
      description: 'A legacy-building grooming experience.'
    }
  ];

  return (
    <section id="membership" className="py-24 bg-black relative">
      <div className="container mx-auto px-6 mb-12 relative z-10">
        <div className="text-center md:text-left mb-12">
          <span className="text-brand-green font-mono text-xs tracking-widest uppercase mb-4 block">Exclusive Membership</span>
          <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6">Lock In Your <br /> Routine</h2>
        </div>

        {/* Selectors */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 glass p-8 rounded-3xl border-white/5 max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-4">
            <span className="text-xl font-bold uppercase tracking-tighter text-white">Select Service</span>
            <div className="flex gap-2">
              {(['cut', 'style', 'urban'] as ServiceType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setServiceType(type)}
                  className={cn(
                    "px-6 py-3 rounded-xl border-2 transition-all uppercase text-[10px] font-bold tracking-widest",
                    serviceType === type ? "bg-brand-green text-black border-brand-green shadow-[0_0_20px_rgba(0,255,0,0.2)]" : "border-white/30 hover:border-white/60 text-white/80"
                  )}
                >
                  {type}s
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block w-px h-16 bg-white/10" />

          <div className="flex flex-col items-center gap-4">
            <span className="text-xl font-bold uppercase tracking-tighter text-white">Hair Routine</span>
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoutine(r)}
                  className={cn(
                    "w-12 h-12 rounded-xl border-2 transition-all flex items-center justify-center font-bold text-sm",
                    routine === r ? "bg-brand-green text-black border-brand-green shadow-[0_0_20px_rgba(0,255,0,0.2)]" : "border-white/30 hover:border-white/60 text-white/80"
                  )}
                >
                  {r}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center mb-16">
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
            className="flex items-center justify-center gap-4 md:gap-8 overflow-hidden w-full px-4 md:px-12 py-8 cursor-grab active:cursor-grabbing min-h-[500px]"
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              {[-1, 0, 1].map((offset) => {
                let index = (tierIndex + offset) % 4;
                if (index < 0) index += 4;
                const tier = tiers[index];
                const isCenter = offset === 0;
                const price = getPrice(tier.name);
                const isRestricted = serviceType === 'urban' && (tier.name === 'Corporate' || tier.name === 'Investment');

                return (
                  <motion.div
                    layout
                    key={tier.name}
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
                        if (!isRestricted) {
                          setSelectedMembership(`${tier.name} - ${routine}x ${serviceType}s`);
                        }
                      } else if (offset === -1) {
                        paginate(-1);
                      } else {
                        paginate(1);
                      }
                    }}
                    className={cn(
                      "relative flex flex-col text-left shrink-0",
                      isCenter ? "w-full max-w-sm z-10" : "w-64 hidden md:flex z-0",
                      isRestricted ? "cursor-not-allowed" : "cursor-pointer"
                    )}
                  >
                    <div className={cn(
                      "glass p-8 rounded-[40px] flex flex-col border-white/5 transition-all bg-gradient-to-b from-brand-green to-black backdrop-blur-xl shadow-2xl shadow-black/50 relative overflow-hidden group w-full h-full",
                      isRestricted ? "border-red-500/30 ring-2 ring-red-500/30 ring-offset-4 ring-offset-black" : (isCenter ? "border-white/10" : "hover:border-brand-green/30")
                    )}>
                      {isRestricted && (
                        <div className="absolute inset-0 bg-red-950/60 z-10 pointer-events-none" />
                      )}
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity text-black">
                        <tier.icon size={80} />
                      </div>
                      
                      <div className="w-12 h-12 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-6 relative z-10">
                        <tier.icon className="text-black" />
                      </div>
                      
                      <h3 className="text-2xl font-bold uppercase mb-2 text-white relative z-10">{tier.name}</h3>
                      <p className="text-white/40 text-xs mb-6 h-8 relative z-10">{tier.description}</p>
                      
                      <div className="flex items-baseline gap-1 mb-8 relative z-10">
                        <span className="text-4xl font-bold text-brand-green">${price >= 1000 ? `${price / 1000}k` : price}</span>
                        <span className="text-white/40 text-sm">/mo</span>
                      </div>
                      
                      <ul className="space-y-4 mb-8 flex-1 relative z-10">
                        {tier.features.map((feature, j) => (
                          <li key={j} className="flex items-start gap-3 text-sm text-white/70">
                            <Check className="text-black shrink-0" size={16} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <div 
                        className={cn(
                          "w-full py-4 transition-all text-2xl font-bold uppercase text-center relative z-20 cursor-pointer hover:scale-105",
                          isRestricted 
                            ? "text-red-500" 
                            : "text-white hover:text-brand-green"
                        )}
                      >
                        {isRestricted ? 'Not Available for Urban' : 'Select Plan'}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* 4 Dashes Pagination */}
          <div className="flex justify-center gap-2 mt-8">
            {tiers.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > tierIndex ? 1 : -1);
                  setTierIndex(idx);
                }}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  tierIndex === idx ? "w-8 bg-white" : "w-4 bg-white/20 hover:bg-white/40"
                )}
              />
            ))}
          </div>
        </div>

        {/* Bottom Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-brand-green/5 blur-[120px] rounded-full pointer-events-none" />
      </div>
    </section>
  );
}

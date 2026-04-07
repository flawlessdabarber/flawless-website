import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Crown, Briefcase, TrendingUp, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAI } from '../lib/AIContext';
import { cn } from '../lib/utils';

type ServiceType = 'cut' | 'style' | 'urban';

export default function Membership() {
  const { setSelectedMembership } = useAI();
  const [routine, setRoutine] = useState(1);
  const [serviceType, setServiceType] = useState<ServiceType>('cut');
  const [tierIndex, setTierIndex] = useState(0);
  const [leftClicks, setLeftClicks] = useState(0);
  const [rightClicks, setRightClicks] = useState(0);

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
      icon: User,
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
            <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Select Service</span>
            <div className="flex gap-2">
              {(['cut', 'style', 'urban'] as ServiceType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setServiceType(type)}
                  className={cn(
                    "px-6 py-3 rounded-xl border transition-all uppercase text-[10px] font-bold tracking-widest",
                    serviceType === type ? "bg-brand-green text-black border-brand-green shadow-[0_0_20px_rgba(0,255,0,0.2)]" : "border-white/10 hover:border-white/30 text-white/60"
                  )}
                >
                  {type}s
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block w-px h-16 bg-white/10" />

          <div className="flex flex-col items-center gap-4">
            <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Hair Routine</span>
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoutine(r)}
                  className={cn(
                    "w-12 h-12 rounded-xl border transition-all flex items-center justify-center font-bold text-sm",
                    routine === r ? "bg-brand-green text-black border-brand-green shadow-[0_0_20px_rgba(0,255,0,0.2)]" : "border-white/10 hover:border-white/30 text-white/60"
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
        <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center mb-16">
          <button 
            onClick={() => {
              setLeftClicks(c => c + 1);
              setTierIndex(prev => (prev === 0 ? 3 : prev - 1));
            }}
            className="absolute left-0 md:-left-4 z-20 p-2 glass rounded-full hover:bg-white/10 transition-colors"
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
              <ChevronLeft size={24} />
            </motion.div>
          </button>

          <div className="flex items-center justify-center gap-4 md:gap-8 overflow-hidden w-full px-12 py-8">
            {[-1, 0, 1].map((offset) => {
              let index = (tierIndex + offset) % 4;
              if (index < 0) index += 4;
              const tier = tiers[index];
              const isCenter = offset === 0;
              
              const price = getPrice(tier.name);
              const isRestricted = serviceType === 'urban' && (tier.name === 'Corporate' || tier.name === 'Investment');

              return (
                <button
                  key={`${tier.name}-${offset}`}
                  onClick={() => {
                    if (isCenter) {
                      if (!isRestricted) {
                        setSelectedMembership(`${tier.name} - ${routine}x ${serviceType}s`);
                      }
                    } else if (offset === -1) {
                      setLeftClicks(c => c + 1);
                      setTierIndex(prev => (prev === 0 ? 3 : prev - 1));
                    } else {
                      setRightClicks(c => c + 1);
                      setTierIndex(prev => (prev + 1) % 4);
                    }
                  }}
                  className={cn(
                    "relative flex flex-col transition-all duration-500 text-left",
                    isCenter ? "w-full max-w-sm opacity-100 scale-100 z-10" : "w-64 opacity-30 scale-90 blur-[2px] hidden md:flex",
                    isRestricted ? "cursor-not-allowed" : "cursor-pointer"
                  )}
                >
                  <div className={cn(
                    "glass p-8 rounded-3xl flex flex-col border-white/5 transition-all bg-brand-gray/10 backdrop-blur-xl shadow-2xl shadow-black/50 relative overflow-hidden group w-full h-full",
                    isRestricted ? "border-red-500/30" : "",
                    isCenter ? "border-brand-green bg-brand-green/5 ring-2 ring-brand-green ring-offset-4 ring-offset-black" : (!isRestricted && "hover:border-brand-green/30")
                  )}>
                    {isRestricted && (
                      <div className="absolute inset-0 bg-red-950/60 z-10 pointer-events-none" />
                    )}
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <tier.icon size={80} />
                    </div>
                    
                    <div className="w-12 h-12 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-6">
                      <tier.icon className="text-brand-green" />
                    </div>
                    
                    <h3 className="text-2xl font-bold uppercase mb-2">{tier.name}</h3>
                    <p className="text-white/40 text-xs mb-6 h-8">{tier.description}</p>
                    
                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-4xl font-bold text-brand-green">${price.toLocaleString()}</span>
                      <span className="text-white/40 text-sm">/mo</span>
                    </div>
                    
                    <ul className="space-y-4 mb-8 flex-1">
                      {tier.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-white/70">
                          <Check className="text-brand-green shrink-0" size={16} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div 
                      className={cn(
                        "w-full py-4 transition-all text-[10px] font-bold uppercase tracking-widest rounded-xl border text-center",
                        isRestricted 
                          ? "bg-red-500/10 text-red-500 border-red-500/30" 
                          : "bg-white/5 hover:bg-brand-green hover:text-black border-white/10"
                      )}
                    >
                      {isRestricted ? 'Not Available for Urban' : 'Select Plan'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => {
              setRightClicks(c => c + 1);
              setTierIndex(prev => (prev + 1) % 4);
            }}
            className="absolute right-0 md:-right-4 z-20 p-2 glass rounded-full hover:bg-white/10 transition-colors"
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
              <ChevronRight size={24} />
            </motion.div>
          </button>
        </div>

        {/* Bottom Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-brand-green/5 blur-[120px] rounded-full pointer-events-none" />
      </div>
    </section>
  );
}

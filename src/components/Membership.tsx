import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Crown, Briefcase, TrendingUp, User } from 'lucide-react';
import { useAI } from '../lib/AIContext';
import { cn } from '../lib/utils';

type ServiceType = 'cut' | 'style' | 'urban';

export default function Membership() {
  const { setSelectedMembership } = useAI();
  const [routine, setRoutine] = useState(1);
  const [serviceType, setServiceType] = useState<ServiceType>('cut');

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tiers.map((tier, i) => {
            const price = getPrice(tier.name);
            const isRestricted = serviceType === 'urban' && (tier.name === 'Corporate' || tier.name === 'Investment');
            
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className={cn(
                  "glass p-8 rounded-3xl flex flex-col border-white/5 transition-all bg-brand-gray/10 backdrop-blur-xl shadow-2xl shadow-black/50 relative overflow-hidden group",
                  isRestricted ? "border-red-500/30" : "hover:border-brand-green/30"
                )}
              >
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
                
                <button 
                  onClick={() => !isRestricted && setSelectedMembership(`${tier.name} - ${routine}x ${serviceType}s`)}
                  disabled={isRestricted}
                  className={cn(
                    "w-full py-4 transition-all text-[10px] font-bold uppercase tracking-widest rounded-xl border",
                    isRestricted 
                      ? "bg-red-500/10 text-red-500 border-red-500/30 cursor-not-allowed" 
                      : "bg-white/5 hover:bg-brand-green hover:text-black border-white/10"
                  )}
                >
                  {isRestricted ? 'Not Available for Urban' : 'Select Plan'}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-brand-green/5 blur-[120px] rounded-full pointer-events-none" />
      </div>
    </section>
  );
}

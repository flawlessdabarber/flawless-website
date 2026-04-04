import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CommunityBanner() {
  return (
    <a 
      href="#" 
      className="relative h-[150px] w-full overflow-hidden flex items-center justify-center group cursor-pointer block"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center grayscale opacity-30 group-hover:opacity-50 transition-opacity duration-700"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2000&auto=format&fit=crop")' 
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/80 to-black" />

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center text-white px-6 text-center">
        <h3 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <span>Join us on WhatsApp</span>
          <span className="text-brand-green flex items-center gap-4">
            F Life
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-brand-green text-black flex items-center justify-center shrink-0 animate-[bounce-x_1s_infinite]">
              <ArrowRight className="w-5 h-5 md:w-8 md:h-8" />
            </div>
          </span>
        </h3>
      </div>
    </a>
  );
}

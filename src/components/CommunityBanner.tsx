import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CommunityBanner() {
  return (
    <a 
      href="#" 
      className="relative h-[150px] w-full overflow-hidden flex items-center justify-center group cursor-pointer border-y border-white/10 block"
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
      <div className="relative z-20 flex flex-col md:flex-row items-center justify-center gap-4 text-white px-6 text-center">
        <h3 className="text-xl md:text-3xl font-bold uppercase tracking-widest">
          Come join our community on WhatsApp <span className="text-brand-green">F-Life</span>
        </h3>
        <div className="w-10 h-10 rounded-full bg-brand-green text-black flex items-center justify-center group-hover:scale-110 transition-transform">
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </a>
  );
}

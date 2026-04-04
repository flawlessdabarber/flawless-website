import React from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';

export default function FooterMap() {
  return (
    <div className="w-full mb-24">
      {/* Location Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="glass p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-md max-w-sm mx-auto md:mx-0"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green relative">
            <MapPin size={24} className="relative z-10" />
            <div className="absolute inset-0 bg-brand-green rounded-full animate-ping opacity-20" />
          </div>
          <div>
            <h3 className="text-xl font-bold uppercase tracking-widest text-white leading-none mb-1">Location</h3>
            <p className="text-brand-green font-mono text-xs uppercase tracking-widest">Times Square Area</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-white/90 font-mono text-sm uppercase tracking-wider">240 West 40th Street</p>
          <p className="text-white/90 font-mono text-sm uppercase tracking-wider">New York, NY 10018</p>
        </div>

        <a 
          href="https://maps.google.com/?q=240+West+40th+Street,+New+York,+NY+10018" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-6 w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-brand-green transition-colors flex items-center justify-center gap-2"
        >
          Get Directions
        </a>
      </motion.div>
    </div>
  );
}

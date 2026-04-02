import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Mic2, ExternalLink, MessageSquare } from 'lucide-react';
import { useAI } from '../lib/AIContext';

export default function Podcast() {
  const { setSelectedPodcast } = useAI();
  const [timeLeft, setTimeLeft] = useState('');
  const [nextDay, setNextDay] = useState<number | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nyString = now.toLocaleString("en-US", { timeZone: "America/New_York" });
      const nyDate = new Date(nyString);
      
      const currentDay = nyDate.getDay();
      const currentHour = nyDate.getHours();
      
      const showDays = [0, 2, 4]; // Sun, Tue, Thu
      let daysUntilNextShow = 7;
      let nextShowDay = 0;

      for (const day of showDays) {
        let diff = day - currentDay;
        if (diff < 0) diff += 7;
        
        // Show is at 6 PM (18:00). Assume it lasts 1 hour.
        // If it's today and past 7 PM (19:00), look for the next show.
        if (diff === 0 && currentHour >= 19) {
          diff = 7; 
        }
        
        if (diff < daysUntilNextShow) {
          daysUntilNextShow = diff;
          nextShowDay = day;
        }
      }

      const nextShowDate = new Date(nyDate);
      nextShowDate.setDate(nyDate.getDate() + daysUntilNextShow);
      nextShowDate.setHours(18, 0, 0, 0);

      const diffMs = nextShowDate.getTime() - nyDate.getTime();
      
      // If it's between 6 PM and 7 PM on a show day
      if (diffMs <= 0 && diffMs > -3600000) {
         setTimeLeft("LIVE NOW");
         setNextDay(currentDay);
         return;
      }

      const d = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const h = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diffMs / 1000 / 60) % 60);
      const s = Math.floor((diffMs / 1000) % 60);

      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
      setNextDay(nextShowDay);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="podcast" className="py-24 bg-brand-gray/10 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-center lg:text-left"
          >
            <span className="text-brand-green font-mono text-xs tracking-widest uppercase mb-4 block">YouTube Channel</span>
            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none mb-4">FDB <br /> Live</h2>
            
            <div className="font-bold uppercase tracking-widest text-sm mb-6">
              <span className="text-gray-400">Showtimes</span>{' '}
              <span className={nextDay === 0 ? "text-brand-green animate-pulse drop-shadow-[0_0_20px_rgba(0,255,0,0.8)] brightness-150" : "text-gray-600"}>Sun</span> <span className="text-gray-600">|</span>{' '}
              <span className={nextDay === 2 ? "text-brand-green animate-pulse drop-shadow-[0_0_20px_rgba(0,255,0,0.8)] brightness-150" : "text-gray-600"}>Tue</span> <span className="text-gray-600">|</span>{' '}
              <span className={nextDay === 4 ? "text-brand-green animate-pulse drop-shadow-[0_0_20px_rgba(0,255,0,0.8)] brightness-150" : "text-gray-600"}>Thurs</span> <span className="text-gray-600">|</span>{' '}
              <span className="text-white">Live 6pm EST.</span>
            </div>
            
            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Upcoming Show In</p>
              <p className="text-3xl font-mono font-bold text-brand-green">{timeLeft || "Loading..."}</p>
            </div>

            <p className="text-white/60 mb-8 text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Dive into the minds of industry leaders, entrepreneurs, and cultural icons. We discuss everything from grooming trends to investment strategies and community growth.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => setSelectedPodcast('Text Reminder Request')}
                className="flex items-center gap-3 px-8 py-4 bg-brand-green text-black font-bold uppercase tracking-widest rounded-sm"
              >
                <MessageSquare size={20} />
                Get Text Reminded
              </button>
              <button 
                onClick={() => setSelectedPodcast('Guest Request')}
                className="flex items-center gap-3 px-8 py-4 border border-white/20 hover:bg-white/10 transition-all uppercase tracking-widest rounded-sm"
              >
                <Mic2 size={20} />
                Become A Guest
              </button>
            </div>
          </motion.div>

          <div className="relative">
            <div className="aspect-square glass rounded-3xl overflow-hidden relative group">
              <img 
                src="https://picsum.photos/seed/podcast/800/800" 
                alt="Podcast Studio" 
                className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-brand-green rounded-full flex items-center justify-center text-black shadow-[0_0_50px_rgba(0,255,0,0.3)]">
                  <Play size={40} fill="currentColor" />
                </div>
              </div>
            </div>
            
            {/* Floating Episode Card */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-10 -left-10 glass p-6 rounded-2xl max-w-xs shadow-2xl"
            >
              <p className="text-brand-green text-[10px] font-bold uppercase tracking-widest mb-2">Latest Episode</p>
              <h4 className="font-bold mb-2">Building a Grooming Empire with Flawless</h4>
              <p className="text-xs text-white/50 mb-4">Episode 42 • 45 mins</p>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-tighter cursor-pointer hover:text-brand-green">
                View Show Notes <ExternalLink size={12} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

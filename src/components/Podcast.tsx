import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Mic2, ExternalLink, MessageSquare, Calendar, MapPin } from 'lucide-react';
import { useAI } from '../lib/AIContext';
import { cn } from '../lib/utils';

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
            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none mb-4">FDB Live</h2>
            
            <div className="font-bold uppercase tracking-widest text-sm mb-6">
              <span className={nextDay === 0 ? "text-brand-green animate-pulse drop-shadow-[0_0_20px_rgba(0,255,0,0.8)] brightness-150" : "text-gray-600"}>Sun</span> <span className="text-gray-600">|</span>{' '}
              <span className={nextDay === 2 ? "text-brand-green animate-pulse drop-shadow-[0_0_20px_rgba(0,255,0,0.8)] brightness-150" : "text-gray-600"}>Tue</span> <span className="text-gray-600">|</span>{' '}
              <span className={nextDay === 4 ? "text-brand-green animate-pulse drop-shadow-[0_0_20px_rgba(0,255,0,0.8)] brightness-150" : "text-gray-600"}>Thurs</span> <span className="text-gray-600">|</span>{' '}
              <span className="text-white">Live 6pm EST.</span>
            </div>
            
            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Upcoming Show In</p>
              <p className="text-3xl font-mono font-bold text-brand-green">{timeLeft || "Loading..."}</p>
            </div>

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

          <div className="flex justify-center lg:justify-end">
            <motion.div
              className="w-full max-w-[340px] relative perspective-[1000px] group"
            >
              {/* iPhone Style Ticket */}
              <motion.div
                whileHover={{ rotateY: -5, rotateX: 5, y: -10 }}
                className={cn(
                  "relative w-full aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl transition-all duration-500",
                  "bg-gradient-to-br from-brand-green to-emerald-600"
                )}
              >
                {/* Top Section */}
                <div className="p-8 flex flex-col items-center text-center h-full">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md p-4 mb-6 shadow-lg flex items-center justify-center text-black">
                    <Play size={32} fill="currentColor" className="ml-1" />
                  </div>
                  
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-black/60 mb-2 font-bold">
                    Latest Episode
                  </span>
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-black leading-none mb-2">
                    Building a Grooming Empire
                  </h3>

                  <div className="flex flex-col gap-4 w-full mt-auto mb-12">
                    <div className="flex items-center justify-center gap-2 text-black/80 font-bold text-sm">
                      <Calendar size={16} />
                      Episode 42
                    </div>
                    <div className="flex items-center justify-center gap-2 text-black/80 font-bold text-sm">
                      <MapPin size={16} />
                      Guest Speaker
                    </div>
                  </div>

                  {/* Perforated Line */}
                  <div className="absolute bottom-[25%] left-0 right-0 h-px border-t-2 border-dashed border-black/20" />
                  <div className="absolute bottom-[25%] -left-3 w-6 h-6 bg-[#0a0a0a] rounded-full" />
                  <div className="absolute bottom-[25%] -right-3 w-6 h-6 bg-[#0a0a0a] rounded-full" />

                  {/* Bottom Section */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">Guest's Name</p>
                    <p className="text-xl font-black text-black uppercase cursor-pointer hover:scale-105 transition-transform">Watch Now</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

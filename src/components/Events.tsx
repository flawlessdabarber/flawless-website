import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Ticket, Plus, Minus, Smartphone, Share2, ChevronRight, Users } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAI } from '../lib/AIContext';

const events = [
  {
    id: 'event-1',
    title: 'Grooming Workshop 2026',
    date: 'April 15, 2026 10:00:00',
    displayDate: 'April 15, 2026',
    time: '10:00 AM - 4:00 PM',
    location: 'Main Studio, NYC',
    type: 'Educational',
    price: 150,
    color: 'from-brand-green to-emerald-600',
    logo: 'https://picsum.photos/seed/barber1/200/200',
    attendees: 120,
    maxAttendees: 200
  },
  {
    id: 'event-2',
    title: 'Flawless Summer Bash',
    date: 'June 20, 2026 19:00:00',
    displayDate: 'June 20, 2026',
    time: '7:00 PM - 12:00 AM',
    location: 'Rooftop Lounge',
    type: 'Social',
    price: 85,
    color: 'from-brand-green to-teal-600',
    logo: 'https://picsum.photos/seed/barber2/200/200',
    attendees: 85,
    maxAttendees: 150
  }
];

function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-2 justify-center mt-4">
      {[
        { label: 'D', value: timeLeft.days },
        { label: 'H', value: timeLeft.hours },
        { label: 'M', value: timeLeft.minutes },
        { label: 'S', value: timeLeft.seconds }
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center glass px-2 py-1 rounded-lg min-w-[40px]">
          <span className="text-sm font-black text-black">{item.value}</span>
          <span className="text-[8px] font-bold text-black/40 uppercase">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

interface TicketCardProps {
  event: typeof events[0];
}

function TicketCard({ event }: TicketCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isOrdered, setIsOrdered] = useState(false);
  const { setSelectedEvent } = useAI();

  const total = quantity * event.price;
  const attendancePercent = (event.attendees / event.maxAttendees) * 100;

  const handleOrder = () => {
    setIsOrdered(true);
    setSelectedEvent(`${event.title} (${quantity} tickets)`);
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        layout
        className="w-full max-w-[340px] relative perspective-[1000px] group"
      >
        {/* iPhone Style Ticket */}
        <motion.div
          whileHover={{ rotateY: -5, rotateX: 5, y: -10 }}
          className={cn(
            "relative w-full aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl transition-all duration-500",
            "bg-gradient-to-br",
            event.color
          )}
        >
          {/* Top Section */}
          <div className="p-8 flex flex-col items-center text-center h-full">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md p-4 mb-6 shadow-lg">
              <img 
                src={event.logo} 
                alt="Logo" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-black/60 mb-2 font-bold">
              {event.type}
            </span>
            <h3 className="text-3xl font-black uppercase tracking-tighter text-black leading-none mb-2">
              {event.title}
            </h3>

            <Countdown targetDate={event.date} />

            <div className="flex flex-col gap-4 w-full mt-auto mb-12">
              <div className="flex items-center justify-center gap-2 text-black/80 font-bold text-sm">
                <Calendar size={16} />
                {event.displayDate}
              </div>
              <div className="flex items-center justify-center gap-2 text-black/80 font-bold text-sm">
                <MapPin size={16} />
                {event.location}
              </div>
            </div>

            {/* Perforated Line */}
            <div className="absolute bottom-[25%] left-0 right-0 h-px border-t-2 border-dashed border-black/20" />
            <div className="absolute bottom-[25%] -left-3 w-6 h-6 bg-brand-gray/20 rounded-full" />
            <div className="absolute bottom-[25%] -right-3 w-6 h-6 bg-brand-gray/20 rounded-full" />

            {/* Bottom Section */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">Entry Ticket</p>
              <p className="text-xl font-black text-black uppercase">{quantity} {quantity === 1 ? 'Person' : 'People'}</p>
            </div>
          </div>
        </motion.div>

        {/* Attendance Bar */}
        <div className="mt-6 w-full glass p-4 rounded-2xl border-white/10">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Users size={14} className="text-brand-green" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Attendance</span>
            </div>
            <span className="text-[10px] font-bold text-brand-green">{event.attendees}/{event.maxAttendees}</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${attendancePercent}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-brand-green"
            />
          </div>
        </div>

        {/* Controls Overlay */}
        <div className="mt-4 w-full glass p-6 rounded-3xl border-white/10 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-2">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-brand-green hover:text-black transition-all"
              >
                <Minus size={18} />
              </button>
              <span className="text-xl font-bold w-8 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-brand-green hover:text-black transition-all"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest opacity-50">Total Amount</p>
              <p className="text-2xl font-bold text-brand-green">${total}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isOrdered ? (
              <motion.button
                key="order"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleOrder}
                className="w-full py-4 bg-brand-green text-black font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2"
              >
                <Ticket size={20} />
                Get Tickets
              </motion.button>
            ) : (
              <motion.div
                key="wallet"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <button className="w-full py-3 bg-black text-white border border-white/20 rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                  <Smartphone size={18} className="text-brand-green" />
                  <span className="text-xs font-bold uppercase tracking-widest">Add to Apple Wallet</span>
                </button>
                <button className="w-full py-3 bg-black text-white border border-white/20 rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                  <Smartphone size={18} className="text-brand-green" />
                  <span className="text-xs font-bold uppercase tracking-widest">Add to Google Wallet</span>
                </button>
                <button 
                  onClick={() => setIsOrdered(false)}
                  className="w-full py-2 text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                >
                  Cancel Order
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default function Events() {
  return (
    <section id="events" className="py-24 bg-brand-gray/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-20 gap-8">
          <div className="text-center md:text-left">
            <span className="text-brand-green font-mono text-xs tracking-widest uppercase mb-4 block">Community</span>
            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none">Upcoming <br /> Events</h2>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-white/40 text-sm max-w-[200px] text-center md:text-right hidden md:block">
              Join our exclusive grooming workshops and social gatherings.
            </p>
            <button className="px-8 py-4 glass rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:border-brand-green transition-all">
              View All <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {events.map((event) => (
            <TicketCard key={event.id} event={event} />
          ))}
        </div>

      </div>
    </section>
  );
}

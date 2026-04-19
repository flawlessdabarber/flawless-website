import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scissors, Sparkles, MapPin, Store, Zap, Wind, Palette, Calendar as CalendarIcon, Clock, Check, Layers, ChevronLeft, ChevronRight, ShieldCheck, Baby, User, ChevronDown, ChevronUp } from 'lucide-react';
import { useBooking, Service, services } from '../lib/BookingContext';
import { useCart } from '../lib/CartContext';
import { cn } from '../lib/utils';

const serviceIcons: Record<string, any> = {
  hair: Scissors,
  skin: ShieldCheck,
  urban: Zap,
  cleanup: Wind,
  hairstyle: Palette,
  sessions: Layers
};

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const barbers = [
  { id: 'flawless', name: 'Flawless', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop&grayscale=true' },
  { id: 'marcus', name: 'Marcus', image: 'https://images.unsplash.com/photo-1583864697784-a0efc8379f70?q=80&w=800&auto=format&fit=crop&grayscale=true' },
  { id: 'david', name: 'David', image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=800&auto=format&fit=crop&grayscale=true' },
  { id: 'james', name: 'James', image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=800&auto=format&fit=crop&grayscale=true' },
  { id: 'michael', name: 'Michael', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop&grayscale=true' }
];

export default function Services() {
  const { state, toggleService, setLocationType, setClientType, setAgeGroup, setDate, setTime, setBarber, setAddress, setMonth, totalPrice, isOvertime, isSunday, isDayOffFee, otFee } = useBooking();
  const { addItem } = useCart();
  
  const [barberIndex, setBarberIndex] = React.useState(0);
  const [directionBarber, setDirectionBarber] = React.useState(0);

  const [serviceRow1Index, setServiceRow1Index] = React.useState(0);
  const [directionRow1, setDirectionRow1] = React.useState(0);

  const [serviceRow2Index, setServiceRow2Index] = React.useState(0);
  const [directionRow2, setDirectionRow2] = React.useState(0);

  const paginateBarber = (newDirection: number) => {
    setDirectionBarber(newDirection);
    setBarberIndex((prev) => (prev + newDirection + barbers.length) % barbers.length);
  };

  const paginateRow1 = (newDirection: number) => {
    setDirectionRow1(newDirection);
    setServiceRow1Index((prev) => (prev + newDirection + 4) % 4);
  };

  const paginateRow2 = (newDirection: number) => {
    setDirectionRow2(newDirection);
    setServiceRow2Index((prev) => (prev + newDirection + 4) % 4);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const [isSummaryVisible, setIsSummaryVisible] = React.useState(true);
  const [reserveError, setReserveError] = React.useState('');

  const handleReserve = () => {
    if (!state.date) {
      setReserveError('Please select a date.');
      return;
    }
    if (!state.time) {
      setReserveError('Please select a time.');
      return;
    }
    if (state.locationType === 'mobile' && !state.address) {
      setReserveError('Please enter your mobile service address.');
      return;
    }
    
    setReserveError('');
    
    const bookingId = `booking-${Date.now()}`;
    const serviceNames = state.selectedServices.map(s => s.title).join(', ');
    
    addItem({
      id: bookingId,
      name: `Reservation: ${serviceNames}`,
      price: totalPrice,
      category: 'Service',
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800',
      quantity: 1,
      size: `${state.date} @ ${state.time}`,
      color: state.locationType === 'in-store' ? 'In-Store' : 'Mobile'
    });
    
    // Hide the summary to show it's been processed
    setIsSummaryVisible(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const getReservedTimes = (dateStr: string, barberId?: string | null) => {
    const hash = dateStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + (barberId ? barberId.length * 10 : 0);
    const reserved = [];
    if (hash % 2 === 0) reserved.push('10:00 AM');
    if (hash % 3 === 0) reserved.push('2:00 PM');
    if (hash % 4 === 0) reserved.push('4:00 PM');
    if (hash % 5 === 0) reserved.push('7:00 PM');
    if (hash % 7 === 0) reserved.push('11:00 AM');
    if (hash % 6 === 0) reserved.push('1:00 PM');
    return reserved;
  };

  const parseTime = (timeStr: string) => {
    const [hourStr, minuteAmPm] = timeStr.split(':');
    const [minuteStr, ampm] = minuteAmPm.split(' ');
    let hour = parseInt(hourStr);
    if (ampm === 'PM' && hour !== 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    return { hour, minute: parseInt(minuteStr) };
  };

  const isPastTimeForDate = (timeStr: string, dateStr: string) => {
    if (dateStr < todayStr) return true;
    if (dateStr > todayStr) return false;
    
    const { hour, minute } = parseTime(timeStr);
    const nowHour = now.getHours();
    const nowMinute = now.getMinutes();
    
    if (hour < nowHour) return true;
    if (hour === nowHour && minute <= nowMinute) return true;
    return false;
  };

  const isPastTime = (timeStr: string) => {
    if (!state.date) return false;
    return isPastTimeForDate(timeStr, state.date);
  };

  // Generate days for selected month
  const getDaysInMonth = (month: number) => {
    const year = new Date().getFullYear();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const dates = getDaysInMonth(state.selectedMonth);

  const generateTimeSlots = () => {
    const slots = [];
    // 7 AM to 12 AM
    for (let h = 7; h <= 23; h++) {
      const hour = h > 12 ? h - 12 : h;
      const ampm = h >= 12 ? 'PM' : 'AM';
      slots.push(`${hour}:00 ${ampm}`);
    }
    slots.push('12:00 AM');
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const isOvertimeSlot = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    const isPM = time.includes('PM');
    const actualHour = isPM ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour);
    return [7, 8, 9, 22, 23, 0].includes(actualHour);
  };

  return (
    <section id="services" className="py-24 bg-brand-gray/20 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8">
          <div className="text-center md:text-left">
            <span className="text-brand-green font-mono text-xs tracking-widest uppercase mb-4 block">Our Expertise</span>
            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter">Book a <br /> Reservation</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full md:w-auto">
            <div className="grid grid-cols-2 md:flex md:flex-col gap-4 w-full md:w-auto">
              <button 
                onClick={() => setLocationType('in-store')}
                className={cn(
                  "glass px-4 md:px-6 py-4 rounded-xl flex items-center gap-2 md:gap-3 transition-all relative overflow-hidden w-full md:w-48",
                  state.locationType === 'in-store' ? "border-brand-green bg-brand-green/20 shadow-[0_0_20px_rgba(0,255,0,0.2)]" : "opacity-50 hover:opacity-100"
                )}
              >
                {state.locationType === 'in-store' && (
                  <motion.div 
                    layoutId="active-location-glow"
                    className="absolute inset-0 bg-brand-green/5 animate-pulse"
                  />
                )}
                <Store className={cn(state.locationType === 'in-store' ? "text-brand-green" : "text-white")} size={24} />
                <div className="text-left relative z-10">
                  <p className="text-[10px] uppercase tracking-widest opacity-50">Appointment</p>
                  <p className="text-sm font-bold">In-Store</p>
                </div>
              </button>
              <button 
                onClick={() => setLocationType('mobile')}
                className={cn(
                  "glass px-4 md:px-6 py-4 rounded-xl flex items-center gap-2 md:gap-3 transition-all relative overflow-hidden w-full md:w-48",
                  state.locationType === 'mobile' ? "border-brand-green bg-brand-green/20 shadow-[0_0_20px_rgba(0,255,0,0.2)]" : "opacity-50 hover:opacity-100"
                )}
              >
                {state.locationType === 'mobile' && (
                  <motion.div 
                    layoutId="active-location-glow"
                    className="absolute inset-0 bg-brand-green/5 animate-pulse"
                  />
                )}
                <MapPin className={cn(state.locationType === 'mobile' ? "text-brand-green" : "text-white")} size={24} />
                <div className="text-left relative z-10">
                  <p className="text-[10px] uppercase tracking-widest opacity-50">We Come To You</p>
                  <p className="text-sm font-bold">Mobile Visit</p>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-2 md:flex md:flex-col gap-4 w-full md:w-auto">
              <button 
                onClick={() => state.locationType !== 'mobile' && setClientType('member')}
                disabled={state.locationType === 'mobile'}
                className={cn(
                  "glass px-4 md:px-6 py-4 rounded-xl flex items-center gap-2 md:gap-3 transition-all relative overflow-hidden w-full md:w-48",
                  state.locationType === 'mobile' 
                    ? "opacity-40 bg-red-950/20 border-red-900/30 text-red-500/70 cursor-not-allowed" 
                    : state.clientType === 'member' 
                      ? "border-brand-green bg-brand-green/20 shadow-[0_0_20px_rgba(0,255,0,0.2)]" 
                      : "opacity-50 hover:opacity-100"
                )}
              >
                {state.clientType === 'member' && (
                  <motion.div 
                    layoutId="active-client-glow"
                    className="absolute inset-0 bg-brand-green/5 animate-pulse"
                  />
                )}
                <Zap className={cn(state.clientType === 'member' ? "text-brand-green" : "text-white")} size={24} />
                <div className="text-left relative z-10">
                  <p className="text-[10px] uppercase tracking-widest opacity-50">Client Type</p>
                  <p className="text-sm font-bold">Member</p>
                </div>
              </button>
              <button 
                onClick={() => setClientType('walk-in')}
                className={cn(
                  "glass px-4 md:px-6 py-4 rounded-xl flex items-center gap-2 md:gap-3 transition-all relative overflow-hidden w-full md:w-48",
                  state.clientType === 'walk-in' ? "border-brand-green bg-brand-green/20 shadow-[0_0_20px_rgba(0,255,0,0.2)]" : "opacity-50 hover:opacity-100"
                )}
              >
                {state.clientType === 'walk-in' && (
                  <motion.div 
                    layoutId="active-client-glow"
                    className="absolute inset-0 bg-brand-green/5 animate-pulse"
                  />
                )}
                <Zap className={cn(state.clientType === 'walk-in' ? "text-brand-green" : "text-white")} size={24} />
                <div className="text-left relative z-10">
                  <p className="text-[10px] uppercase tracking-widest opacity-50">Client Type</p>
                  <p className="text-sm font-bold">Walk-in</p>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-2 md:flex md:flex-col gap-4 w-full md:w-auto">
              <button 
                onClick={() => setAgeGroup('kids')}
                className={cn(
                  "glass px-4 md:px-6 py-4 rounded-xl flex items-center gap-2 md:gap-3 transition-all relative overflow-hidden w-full md:w-48",
                  state.ageGroup === 'kids' ? "border-brand-green bg-brand-green/20 shadow-[0_0_20px_rgba(0,255,0,0.2)]" : "opacity-50 hover:opacity-100"
                )}
              >
                {state.ageGroup === 'kids' && (
                  <motion.div 
                    layoutId="active-age-glow"
                    className="absolute inset-0 bg-brand-green/5 animate-pulse"
                  />
                )}
                <Baby className={cn(state.ageGroup === 'kids' ? "text-brand-green" : "text-white")} size={24} />
                <div className="text-left relative z-10">
                  <p className="text-[10px] uppercase tracking-widest opacity-50">Age Group</p>
                  <p className="text-sm font-bold">Kids</p>
                </div>
              </button>
              <button 
                onClick={() => setAgeGroup('adults')}
                className={cn(
                  "glass px-4 md:px-6 py-4 rounded-xl flex items-center gap-2 md:gap-3 transition-all relative overflow-hidden w-full md:w-48",
                  state.ageGroup === 'adults' ? "border-brand-green bg-brand-green/20 shadow-[0_0_20px_rgba(0,255,0,0.2)]" : "opacity-50 hover:opacity-100"
                )}
              >
                {state.ageGroup === 'adults' && (
                  <motion.div 
                    layoutId="active-age-glow"
                    className="absolute inset-0 bg-brand-green/5 animate-pulse"
                  />
                )}
                <User className={cn(state.ageGroup === 'adults' ? "text-brand-green" : "text-white")} size={24} />
                <div className="text-left relative z-10">
                  <p className="text-[10px] uppercase tracking-widest opacity-50">Age Group</p>
                  <p className="text-sm font-bold">Adults</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {state.locationType === 'mobile' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-12 overflow-hidden"
            >
              <div className="glass p-8 rounded-3xl">
                <label className="block text-[10px] uppercase tracking-widest opacity-50 mb-4">Mobile Service Address</label>
                <input 
                  type="text" 
                  value={state.address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full address for the mobile visit..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand-green transition-colors"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Services Row 1 */}
        <div className="flex items-center justify-center gap-2 -mb-2 mt-[72px] relative z-10 pointer-events-none">
          <Scissors className="text-brand-green" size={20} />
          <h3 className="text-xl font-bold uppercase tracking-tighter">Select Service</h3>
        </div>
        <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center mb-12">
          <motion.div 
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginateRow1(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginateRow1(-1);
              }
            }}
            className="flex items-center justify-center gap-4 md:gap-8 overflow-hidden w-full px-4 md:px-12 py-8 cursor-grab active:cursor-grabbing min-h-[400px]"
          >
            <AnimatePresence initial={false} custom={directionRow1} mode="popLayout">
              {[-1, 0, 1].map((offset) => {
                let index = (serviceRow1Index + offset) % 4;
                if (index < 0) index += 4;
                const service = services[index]; // 0, 1, 2, 3
                const isCenter = offset === 0;
                
                const Icon = serviceIcons[service.id];
                const isSelected = state.selectedServices.some(s => s.id === service.id);
                
                const exclusiveIds = ['hair', 'skin', 'urban', 'hairstyle'];
                const selectedExclusive = state.selectedServices.find(s => exclusiveIds.includes(s.id));
                const isRestricted = exclusiveIds.includes(service.id) && selectedExclusive && selectedExclusive.id !== service.id;

                return (
                  <motion.div
                    layout
                    key={service.id}
                    custom={directionRow1}
                    initial={{ 
                      x: directionRow1 > 0 ? 100 : -100, 
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
                      x: directionRow1 < 0 ? 100 : -100, 
                      opacity: 0,
                      scale: 0.8,
                      filter: "blur(4px)"
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    onClick={() => {
                      if (isCenter) {
                        if (isRestricted) return;
                        toggleService(service);
                        if (service.id === 'skin' && !state.selectedServices.some(s => s.id === 'skin')) {
                          setClientType('walk-in');
                        }
                      } else if (offset === -1) {
                        paginateRow1(-1);
                      } else {
                        paginateRow1(1);
                      }
                    }}
                    className={cn(
                      "relative flex flex-col text-left shrink-0",
                      isCenter ? "w-full max-w-sm z-10" : "w-64 hidden md:flex z-0",
                      isRestricted ? "cursor-not-allowed" : "cursor-pointer"
                    )}
                  >
                    <div className={cn(
                      "glass p-8 rounded-3xl transition-all relative overflow-hidden group w-full h-full",
                      isRestricted ? "border-red-500/30" : "",
                      isSelected && isCenter ? "border-brand-green bg-brand-green/5 ring-2 ring-brand-green ring-offset-4 ring-offset-black" : (!isRestricted && "hover:border-white/20")
                    )}>
                      {isRestricted && (
                        <div className="absolute inset-0 bg-red-950/60 z-10 pointer-events-none" />
                      )}
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Icon size={80} />
                      </div>
                      <div className="flex justify-between items-start mb-6">
                        <Icon className={cn(isSelected ? "text-brand-green" : "text-white/40")} size={32} />
                        {isSelected && <Check className="text-brand-green" size={20} />}
                      </div>
                      <h3 className="text-2xl font-bold uppercase mb-2">{service.title}</h3>
                      <p className="text-white/40 text-sm mb-6 line-clamp-2">{service.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xl font-bold text-brand-green">
                          {state.locationType === 'mobile' ? (
                            service.id === 'hair' ? `$${state.ageGroup === 'kids' ? 150 : 250}` :
                            service.id === 'hairstyle' ? `$${state.ageGroup === 'kids' ? 200 : 300}` :
                            service.id === 'urban' ? `$${state.ageGroup === 'kids' ? 325 : 450}` :
                            service.id === 'skin' ? '$1000' :
                            `$${service.price}`
                          ) : state.clientType === 'member' && ['hair', 'hairstyle', 'urban'].includes(service.id) ? (
                            '$0'
                          ) : service.id === 'hair' ? (
                            `$${state.ageGroup === 'kids' ? 50 : 100}`
                          ) : service.id === 'hairstyle' ? (
                            `$${state.ageGroup === 'kids' ? 75 : 125}`
                          ) : service.id === 'urban' ? (
                            `$${state.ageGroup === 'kids' ? 100 : 150}`
                          ) : service.id === 'skin' ? (
                            '$500'
                          ) : (
                            `$${service.price}`
                          )}
                        </span>
                        {isSelected && state.clientType === 'member' && ['hair', 'hairstyle', 'urban'].includes(service.id) && state.memberId && (
                          <span className="text-[10px] uppercase tracking-widest text-brand-green border border-brand-green/30 px-2 py-1 rounded-md">
                            ID: {state.memberId}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* 4 Dashes Pagination */}
          <div className="flex justify-center gap-2 mt-4">
            {[0, 1, 2, 3].map((idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirectionRow1(idx > serviceRow1Index ? 1 : -1);
                  setServiceRow1Index(idx);
                }}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  serviceRow1Index === idx ? "w-8 bg-brand-green" : "w-4 bg-brand-green/20 hover:bg-brand-green/40"
                )}
              />
            ))}
          </div>
        </div>

        {/* Services Row 2 */}
        <div className="flex items-center justify-center gap-2 -mb-2 mt-[72px] relative z-10 pointer-events-none">
          <Sparkles className="text-brand-green" size={20} />
          <h3 className="text-xl font-bold uppercase tracking-tighter">Select Extra</h3>
        </div>
        <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center mb-16">
          <motion.div 
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginateRow2(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginateRow2(-1);
              }
            }}
            className="flex items-center justify-center gap-4 md:gap-8 overflow-hidden w-full px-4 md:px-12 py-8 cursor-grab active:cursor-grabbing min-h-[400px]"
          >
            <AnimatePresence initial={false} custom={directionRow2} mode="popLayout">
              {[-1, 0, 1].map((offset) => {
                const row2Base = [services[4], services[5]];
                const row2Services = [
                  row2Base[0], 
                  row2Base[1], 
                  { ...row2Base[0], id: row2Base[0].id + '-copy' }, 
                  { ...row2Base[1], id: row2Base[1].id + '-copy' }
                ];
                
                let index = (serviceRow2Index + offset) % 4;
                if (index < 0) index += 4;
                const service = row2Services[index];
                const isCenter = offset === 0;
                
                const originalId = service.id.replace('-copy', '');
                const originalService = services.find(s => s.id === originalId)!;
                
                const Icon = serviceIcons[originalId];
                const isSelected = state.selectedServices.some(s => s.id === originalId);
                
                const exclusiveIds = ['hair', 'skin', 'urban', 'hairstyle'];
                const selectedExclusive = state.selectedServices.find(s => exclusiveIds.includes(s.id));
                const isRestricted = exclusiveIds.includes(originalId) && selectedExclusive && selectedExclusive.id !== originalId;

                return (
                  <motion.div
                    layout
                    key={service.id}
                    custom={directionRow2}
                    initial={{ 
                      x: directionRow2 > 0 ? 100 : -100, 
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
                      x: directionRow2 < 0 ? 100 : -100, 
                      opacity: 0,
                      scale: 0.8,
                      filter: "blur(4px)"
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    onClick={() => {
                      if (isCenter) {
                        if (isRestricted) return;
                        toggleService(originalService);
                        if (originalId === 'skin' && !state.selectedServices.some(s => s.id === 'skin')) {
                          setClientType('walk-in');
                        }
                      } else if (offset === -1) {
                        paginateRow2(-1);
                      } else {
                        paginateRow2(1);
                      }
                    }}
                    className={cn(
                      "relative flex flex-col text-left shrink-0",
                      isCenter ? "w-full max-w-sm z-10" : "w-64 hidden md:flex z-0",
                      isRestricted ? "cursor-not-allowed" : "cursor-pointer"
                    )}
                  >
                    <div className={cn(
                      "glass p-8 rounded-3xl transition-all relative overflow-hidden group w-full h-full",
                      isRestricted ? "border-red-500/30" : "",
                      isSelected && isCenter ? "border-brand-green bg-brand-green/5 ring-2 ring-brand-green ring-offset-4 ring-offset-black" : (!isRestricted && "hover:border-white/20")
                    )}>
                      {isRestricted && (
                        <div className="absolute inset-0 bg-red-950/60 z-10 pointer-events-none" />
                      )}
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Icon size={80} />
                      </div>
                      <div className="flex justify-between items-start mb-6">
                        <Icon className={cn(isSelected ? "text-brand-green" : "text-white/40")} size={32} />
                        {isSelected && <Check className="text-brand-green" size={20} />}
                      </div>
                      <h3 className="text-2xl font-bold uppercase mb-2">{originalService.title}</h3>
                      <p className="text-white/40 text-sm mb-6 line-clamp-2">{originalService.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xl font-bold text-brand-green">
                          {state.locationType === 'mobile' ? (
                            originalId === 'hair' ? `$${state.ageGroup === 'kids' ? 150 : 250}` :
                            originalId === 'hairstyle' ? `$${state.ageGroup === 'kids' ? 200 : 300}` :
                            originalId === 'urban' ? `$${state.ageGroup === 'kids' ? 325 : 450}` :
                            originalId === 'skin' ? '$1000' :
                            `$${originalService.price}`
                          ) : state.clientType === 'member' && ['hair', 'hairstyle', 'urban'].includes(originalId) ? (
                            '$0'
                          ) : originalId === 'hair' ? (
                            `$${state.ageGroup === 'kids' ? 50 : 100}`
                          ) : originalId === 'hairstyle' ? (
                            `$${state.ageGroup === 'kids' ? 75 : 125}`
                          ) : originalId === 'urban' ? (
                            `$${state.ageGroup === 'kids' ? 100 : 150}`
                          ) : originalId === 'skin' ? (
                            '$500'
                          ) : (
                            `$${originalService.price}`
                          )}
                        </span>
                        {isSelected && state.clientType === 'member' && ['hair', 'hairstyle', 'urban'].includes(originalId) && state.memberId && (
                          <span className="text-[10px] uppercase tracking-widest text-brand-green border border-brand-green/30 px-2 py-1 rounded-md">
                            ID: {state.memberId}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* 2 Dashes Pagination */}
          <div className="flex justify-center gap-2 mt-4">
            {[0, 1].map((idx) => {
              const isActive = (serviceRow2Index % 2) === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setDirectionRow2(idx > (serviceRow2Index % 2) ? 1 : -1);
                    setServiceRow2Index(idx);
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

        <div className="space-y-12 mb-24">
          {/* Month Selector */}
          <div>
            <div className="flex items-center justify-center gap-2 mb-6">
              <CalendarIcon className="text-brand-green" size={20} />
              <h3 className="text-xl font-bold uppercase tracking-tighter">Select Month</h3>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setMonth(Math.max(currentMonth, state.selectedMonth - 1))}
                disabled={state.selectedMonth <= currentMonth}
                className={cn("p-2 glass rounded-full transition-colors", state.selectedMonth <= currentMonth ? "opacity-30 cursor-not-allowed text-red-500" : "hover:bg-white/10")}
              >
                <ChevronLeft size={20} />
              </button>
              <div className={cn("flex-1 glass py-4 rounded-2xl text-center font-bold uppercase tracking-widest transition-colors", state.selectedMonth === currentMonth ? "text-brand-green border border-brand-green/30 shadow-[0_0_15px_rgba(0,255,0,0.1)]" : "")}>
                {months[state.selectedMonth]}
              </div>
              <button 
                onClick={() => setMonth(Math.min(11, state.selectedMonth + 1))}
                className="p-2 glass rounded-full hover:bg-white/10 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Date Selector */}
          <div>
            <div className="flex items-center justify-center gap-2 mb-6">
              <CalendarIcon className="text-brand-green" size={20} />
              <h3 className="text-xl font-bold uppercase tracking-tighter">Select Date</h3>
            </div>
            <div 
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className={cn(
                "flex gap-4 overflow-x-auto pb-4 no-scrollbar",
                isDragging ? "cursor-grabbing" : "cursor-grab"
              )}
            >
              {dates.map((date, i) => {
                const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                const isSelected = state.date === dateStr;
                const isSundayDate = date.getDay() === 0;
                const isPastDate = dateStr < todayStr;
                const isToday = dateStr === todayStr;
                
                const reservedTimes = getReservedTimes(dateStr, state.barber);
                const availableSlotsCount = timeSlots.filter(t => !isPastTimeForDate(t, dateStr) && !reservedTimes.includes(t)).length;
                const totalSlots = timeSlots.length;
                const availabilityPercentage = availableSlotsCount / totalSlots;
                
                let availabilityColor = "bg-brand-green";
                let availabilityText = "Available";
                if (availableSlotsCount === 0) {
                  availabilityColor = "bg-red-500";
                  availabilityText = "Full";
                } else if (availabilityPercentage < 0.3) {
                  availabilityColor = "bg-yellow-500";
                  availabilityText = "Limited";
                }
                
                return (
                  <motion.button
                    key={i}
                    onClick={() => !isPastDate && setDate(dateStr)}
                    disabled={isPastDate}
                    animate={isSelected ? {
                      boxShadow: ["0px 0px 10px rgba(155,155,155,0.3)", "0px 0px 30px rgba(155,155,155,0.8)", "0px 0px 10px rgba(155,155,155,0.3)"],
                      scale: [1, 1.05, 1],
                      opacity: [0.8, 1, 0.8]
                    } : {
                      boxShadow: "0px 0px 0px rgba(155,155,155,0)",
                      scale: 1,
                      opacity: 1
                    }}
                    transition={isSelected ? {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    } : {
                      duration: 0.3
                    }}
                    className={cn(
                      "flex-shrink-0 w-24 h-28 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all relative overflow-hidden border",
                      isSelected ? "glass border-white/40 bg-white/5" : "glass border-white/10",
                      !isPastDate && !isSelected && "hover:bg-white/10",
                      isPastDate && "opacity-40 bg-red-950/20 border-red-900/30 text-red-500/70 cursor-not-allowed",
                      isSundayDate && !isSelected && !isPastDate && "opacity-30 grayscale",
                      isToday && "border-2 border-brand-green"
                    )}
                  >
                    {isSundayDate && (
                      <span className="absolute top-1 right-1 text-[8px] uppercase tracking-tighter opacity-50">
                        SUN
                      </span>
                    )}
                    {isToday && (
                      <span className="absolute top-1 left-1 text-[8px] uppercase tracking-tighter font-bold text-brand-green">
                        TODAY
                      </span>
                    )}
                    <span className={cn("text-[10px] uppercase tracking-widest", isSelected ? "text-white opacity-100 font-bold" : "opacity-60")}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    {isToday ? (
                      <motion.span 
                        animate={{ 
                          opacity: [0.5, 1, 0.5],
                          textShadow: ["0px 0px 5px rgba(0,255,0,0.5)", "0px 0px 20px rgba(0,255,0,1)", "0px 0px 5px rgba(0,255,0,0.5)"],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="text-2xl font-bold text-brand-green"
                      >
                        {date.getDate()}
                      </motion.span>
                    ) : (
                      <span className={cn("text-2xl font-bold", isSelected ? "text-brand-green" : "")}>
                        {date.getDate()}
                      </span>
                    )}
                    <span className={cn("text-[10px] uppercase tracking-widest", isSelected ? "text-white opacity-100 font-bold" : "opacity-60")}>
                      {date.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    {!isPastDate && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className={cn("w-1.5 h-1.5 rounded-full", availabilityColor)} />
                        {isSelected && <span className="text-[8px] uppercase tracking-tighter opacity-70">{availabilityText}</span>}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Time Selector */}
          <div>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Clock className="text-brand-green" size={20} />
              <h3 className="text-xl font-bold uppercase tracking-tighter">Select Time</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {timeSlots.map((time, i) => {
                const isSelected = state.time === time;
                const overtime = isOvertimeSlot(time);
                const reservedTimes = state.date ? getReservedTimes(state.date, state.barber) : [];
                const past = isPastTime(time);
                const reserved = reservedTimes.includes(time);
                const disabled = past || reserved;

                const firstAvailableTime = state.date === todayStr ? timeSlots.find(t => !isPastTime(t) && !reservedTimes.includes(t)) : null;
                const isCurrentTimeComingUp = time === firstAvailableTime;

                return (
                  <button
                    key={i}
                    onClick={() => !disabled && setTime(time)}
                    disabled={disabled}
                    className={cn(
                      "py-4 rounded-xl font-bold text-sm transition-all relative overflow-hidden flex flex-col items-center justify-center border",
                      isSelected ? "bg-brand-green text-black border-brand-green" : "glass border-white/10",
                      !disabled && !isSelected && "hover:bg-white/10",
                      past && !reserved && "opacity-40 bg-red-950/20 border-red-900/30 text-red-500/70 cursor-not-allowed",
                      reserved && "border-red-900/50 cursor-not-allowed",
                      overtime && !isSelected && !disabled && "opacity-30 grayscale",
                      isCurrentTimeComingUp && !isSelected && "border-brand-green text-brand-green shadow-[0_0_15px_rgba(0,255,0,0.2)]"
                    )}
                  >
                    <span className={cn("relative z-10", reserved && "opacity-0")}>{time}</span>
                    
                    {reserved && (
                      <div className="absolute inset-0 bg-red-600/80 flex items-center justify-center z-20 backdrop-blur-sm">
                        <span className="text-white font-bold uppercase tracking-widest text-xs drop-shadow-md">Taken</span>
                      </div>
                    )}
                    
                    {overtime && !reserved && (
                      <span className="absolute top-1 right-1 text-[8px] uppercase tracking-tighter opacity-50 z-10">
                        OT
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-widest opacity-40 text-center">
              * Overtime slots (7-9 AM & 10 PM-12 AM) incur a 2x fee
            </p>
          </div>

          {/* Barber Selector */}
          <div className="mt-12">
            <div className="flex items-center justify-center gap-2 mb-6">
              <User className="text-brand-green" size={20} />
              <h3 className="text-xl font-bold uppercase tracking-tighter">Select Barber</h3>
            </div>
            
            <div className="relative w-full max-w-3xl mx-auto flex flex-col items-center justify-center">
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    paginateBarber(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginateBarber(-1);
                  }
                }}
                className="flex items-center justify-center gap-4 overflow-hidden w-full px-4 md:px-12 py-4 cursor-grab active:cursor-grabbing min-h-[300px]"
              >
                <AnimatePresence initial={false} custom={directionBarber} mode="popLayout">
                  {[-1, 0, 1].map((offset) => {
                    let index = (barberIndex + offset) % barbers.length;
                    if (index < 0) index += barbers.length;
                    const barber = barbers[index];
                    const isCenter = offset === 0;
                    const isSelected = state.barber === barber.id;

                    return (
                      <motion.div
                        layout
                        key={barber.id}
                        custom={directionBarber}
                        initial={{ 
                          x: directionBarber > 0 ? 100 : -100, 
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
                          x: directionBarber < 0 ? 100 : -100, 
                          opacity: 0,
                          scale: 0.8,
                          filter: "blur(4px)"
                        }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        onClick={() => {
                          if (isCenter) {
                            setBarber(barber.id);
                          } else if (offset === -1) {
                            paginateBarber(-1);
                          } else {
                            paginateBarber(1);
                          }
                        }}
                        className={cn(
                          "relative flex flex-col items-center gap-4 shrink-0 cursor-pointer",
                          isCenter ? "w-48 z-10" : "w-32 hidden sm:flex z-0",
                          isSelected && isCenter ? "ring-2 ring-brand-green ring-offset-4 ring-offset-black rounded-2xl" : ""
                        )}
                      >
                        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-black">
                          <img 
                            src={barber.image} 
                            alt={barber.name}
                            className="w-full h-full object-cover grayscale contrast-[1.2] brightness-90 mix-blend-screen"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 shadow-[inset_0_0_40px_20px_black] pointer-events-none" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                          
                          {isCenter && (
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-center z-20">
                              <h4 className="text-lg font-bold uppercase tracking-widest text-white mb-1">{barber.name}</h4>
                              <p className="text-[10px] uppercase tracking-widest text-brand-green">
                                {state.date ? new Date(state.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Select Date'}
                                {state.time ? ` @ ${state.time}` : ''}
                              </p>
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
                {barbers.map((_, idx) => {
                  const isActive = (barberIndex % barbers.length) === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setDirectionBarber(idx > (barberIndex % barbers.length) ? 1 : -1);
                        setBarberIndex(idx);
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
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-white/40 text-sm italic">Walk-ins are always welcome, but members get priority.</p>
        </div>
      </div>

      {/* Booking Summary Bar */}
      <AnimatePresence>
        {state.selectedServices.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-6 pointer-events-none"
          >
            <div className="container mx-auto flex justify-end md:justify-center">
              <AnimatePresence mode="wait">
                {isSummaryVisible ? (
                  <motion.div
                    key="full-summary"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="glass-dark p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 border-brand-green/30 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] pointer-events-auto relative w-full"
                  >
                    <button 
                      onClick={() => setIsSummaryVisible(false)}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-black border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors z-50 text-white"
                    >
                      <ChevronDown size={16} />
                    </button>
                    
                    <div className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Selected Services</p>
                        <p className="text-sm font-bold">
                          {state.selectedServices.map(s => s.title).join(', ')}
                        </p>
                      </div>
                      <div className="hidden md:block w-px h-8 bg-white/10" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Location</p>
                        <p className="text-sm font-bold uppercase">
                          {state.locationType === 'in-store' ? 'In-Store' : 'Mobile Visit'}
                        </p>
                      </div>
                      <div className="hidden md:block w-px h-8 bg-white/10" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Client Type</p>
                        <p className="text-sm font-bold uppercase">
                          {state.clientType === 'walk-in' ? 'Walk-in' : 'Member'}
                        </p>
                      </div>
                      <div className="hidden md:block w-px h-8 bg-white/10" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Appointment</p>
                        <p className="text-sm font-bold">
                          {state.date ? new Date(state.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Select Date'} 
                          {' @ '} 
                          {state.time || 'Select Time'}
                        </p>
                      </div>
                      <div className="hidden md:block w-px h-8 bg-white/10" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Barber</p>
                        <p className="text-sm font-bold uppercase">
                          {state.barber ? barbers.find(b => b.id === state.barber)?.name : 'Any'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end mt-4 md:mt-0">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">
                          Total Price 
                          {isOvertime && <span className="text-brand-green ml-2">(Overtime 2x)</span>}
                          {isSunday && state.clientType === 'walk-in' && <span className="text-brand-green ml-2">(Sunday Walk-in +1x)</span>}
                          {isDayOffFee && <span className="text-brand-green ml-2">(Day Off Fee +1x)</span>}
                        </p>
                        <p className="text-3xl font-bold text-brand-green">${totalPrice}</p>
                        {reserveError && <p className="text-red-500 text-xs mt-1 absolute -top-6 right-8">{reserveError}</p>}
                      </div>
                      <button 
                        onClick={handleReserve}
                        className="px-8 md:px-12 py-4 bg-brand-green text-black font-bold uppercase tracking-widest hover:bg-white transition-all rounded-xl shadow-lg shadow-brand-green/20 whitespace-nowrap"
                      >
                        Reserve Now
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    key="minimized-summary"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    onClick={() => setIsSummaryVisible(true)}
                    className="glass-dark px-6 py-4 rounded-full flex items-center gap-4 border-brand-green/30 shadow-2xl pointer-events-auto hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-widest">Booking Active</span>
                    </div>
                    <div className="w-px h-4 bg-white/20" />
                    <span className="text-brand-green font-bold">${totalPrice}</span>
                    <ChevronUp size={16} className="text-white/50 group-hover:text-white transition-colors ml-2" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

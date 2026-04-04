import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scissors, Sparkles, MapPin, Store, Zap, Wind, Palette, Calendar as CalendarIcon, Clock, Check, Layers, ChevronLeft, ChevronRight, ShieldCheck, Baby, User } from 'lucide-react';
import { useBooking, Service } from '../lib/BookingContext';
import { cn } from '../lib/utils';

const services: Service[] = [
  {
    id: 'hair',
    title: 'Hair Cuts',
    description: 'Precision fades, tapers, and classic cuts tailored to your head shape.',
    price: 45,
  },
  {
    id: 'skin',
    title: 'High Profile Clientele',
    description: 'Exclusive grooming services for high-profile clients requiring discretion and excellence.',
    price: 500,
  },
  {
    id: 'urban',
    title: 'Urban Style',
    description: 'Modern, edgy styles including hair designs and creative coloring.',
    price: 55,
  },
  {
    id: 'cleanup',
    title: 'Clean Up',
    description: 'Quick neck and sideburn trim to keep you looking sharp between cuts.',
    price: 25,
  },
  {
    id: 'hairstyle',
    title: 'Hair Style',
    description: 'Special occasion styling, pompadours, and expert product application.',
    price: 60,
  },
  {
    id: 'sessions',
    title: 'Sessions',
    description: 'Extended grooming sessions for complete transformations and relaxation.',
    price: 120,
  }
];

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

export default function Services() {
  const { state, toggleService, setLocationType, setClientType, setAgeGroup, setDate, setTime, setAddress, setMonth, totalPrice, isOvertime, isSunday, isDayOffFee, otFee } = useBooking();
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

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

  const getReservedTimes = (dateStr: string) => {
    const hash = dateStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const reserved = [];
    if (hash % 2 === 0) reserved.push('10:00 AM');
    if (hash % 3 === 0) reserved.push('2:00 PM');
    if (hash % 4 === 0) reserved.push('4:00 PM');
    if (hash % 5 === 0) reserved.push('7:00 PM');
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

  const isPastTime = (timeStr: string) => {
    if (!state.date) return false;
    if (state.date < todayStr) return true;
    if (state.date > todayStr) return false;
    
    const { hour, minute } = parseTime(timeStr);
    const nowHour = now.getHours();
    const nowMinute = now.getMinutes();
    
    if (hour < nowHour) return true;
    if (hour === nowHour && minute <= nowMinute) return true;
    return false;
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

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service, i) => {
            const Icon = serviceIcons[service.id];
            const isSelected = state.selectedServices.some(s => s.id === service.id);
            
            const exclusiveIds = ['hair', 'skin', 'urban', 'hairstyle'];
            const selectedExclusive = state.selectedServices.find(s => exclusiveIds.includes(s.id));
            const isRestricted = exclusiveIds.includes(service.id) && selectedExclusive && selectedExclusive.id !== service.id;

            return (
              <motion.div
                key={service.id}
                whileHover={isRestricted ? {} : { y: -5 }}
                onClick={() => {
                  if (isRestricted) return;
                  toggleService(service);
                  if (service.id === 'skin' && !state.selectedServices.some(s => s.id === 'skin')) {
                    setClientType('walk-in');
                  }
                }}
                className={cn(
                  "glass p-8 rounded-3xl transition-all relative overflow-hidden group",
                  isRestricted ? "border-red-500/30 cursor-not-allowed" : "cursor-pointer",
                  isSelected ? "border-brand-green bg-brand-green/5" : (!isRestricted && "hover:border-white/20")
                )}
              >
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
                <div className="flex items-center justify-between">
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
              </motion.div>
            );
          })}
        </div>

        <div className="space-y-12 mb-24">
          {/* Month Selector */}
          <div>
            <div className="flex items-center gap-2 mb-6">
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
              <div className="flex-1 glass py-4 rounded-2xl text-center font-bold uppercase tracking-widest">
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
            <div className="flex items-center gap-2 mb-6">
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
                return (
                  <button
                    key={i}
                    onClick={() => !isPastDate && setDate(dateStr)}
                    disabled={isPastDate}
                    className={cn(
                      "flex-shrink-0 w-24 h-28 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all relative overflow-hidden",
                      isSelected ? "bg-brand-green text-black" : "glass",
                      !isPastDate && !isSelected && "hover:bg-white/10",
                      isPastDate && "opacity-40 bg-red-950/20 border-red-900/30 text-red-500/70 cursor-not-allowed",
                      isSundayDate && !isSelected && !isPastDate && "opacity-30 grayscale"
                    )}
                  >
                    {isSundayDate && (
                      <span className="absolute top-1 right-1 text-[8px] uppercase tracking-tighter opacity-50">
                        SUN
                      </span>
                    )}
                    <span className="text-[10px] uppercase tracking-widest opacity-60">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="text-2xl font-bold">
                      {date.getDate()}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest opacity-60">
                      {date.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selector */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Clock className="text-brand-green" size={20} />
              <h3 className="text-xl font-bold uppercase tracking-tighter">Select Time</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {timeSlots.map((time, i) => {
                const isSelected = state.time === time;
                const overtime = isOvertimeSlot(time);
                const reservedTimes = state.date ? getReservedTimes(state.date) : [];
                const past = isPastTime(time);
                const reserved = reservedTimes.includes(time);
                const disabled = past || reserved;

                return (
                  <button
                    key={i}
                    onClick={() => !disabled && setTime(time)}
                    disabled={disabled}
                    className={cn(
                      "py-4 rounded-xl font-bold text-sm transition-all relative overflow-hidden flex flex-col items-center justify-center",
                      isSelected ? "bg-brand-green text-black" : "glass",
                      !disabled && !isSelected && "hover:bg-white/10",
                      past && !reserved && "opacity-40 bg-red-950/20 border-red-900/30 text-red-500/70 cursor-not-allowed",
                      reserved && "opacity-40 bg-white/5 border-white/10 text-white/40 cursor-not-allowed",
                      overtime && !isSelected && !disabled && "opacity-30 grayscale"
                    )}
                  >
                    {time}
                    {reserved && (
                      <span className="text-[8px] uppercase tracking-widest mt-1 text-white/50">Taken</span>
                    )}
                    {overtime && !reserved && (
                      <span className="absolute top-1 right-1 text-[8px] uppercase tracking-tighter opacity-50">
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
            className="fixed bottom-0 left-0 right-0 z-40 p-6"
          >
            <div className="container mx-auto">
              <div className="glass-dark p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 border-brand-green/30 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                <div className="flex flex-col md:flex-row items-center gap-8">
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
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">
                      Total Price 
                      {isOvertime && <span className="text-brand-green ml-2">(Overtime 2x)</span>}
                      {isSunday && state.clientType === 'walk-in' && <span className="text-brand-green ml-2">(Sunday Walk-in +1x)</span>}
                      {isDayOffFee && <span className="text-brand-green ml-2">(Day Off Fee +1x)</span>}
                    </p>
                    <p className="text-3xl font-bold text-brand-green">${totalPrice}</p>
                  </div>
                  <button className="px-12 py-4 bg-brand-green text-black font-bold uppercase tracking-widest hover:bg-white transition-all rounded-xl shadow-lg shadow-brand-green/20">
                    Reserve Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

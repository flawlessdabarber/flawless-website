import React, { createContext, useContext, useState, ReactNode } from 'react';

export type LocationType = 'in-store' | 'mobile';
export type ClientType = 'walk-in' | 'member';
export type AgeGroup = 'kids' | 'adults';

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
}

interface BookingState {
  selectedServices: Service[];
  locationType: LocationType;
  clientType: ClientType;
  ageGroup: AgeGroup;
  memberId: string | null;
  date: string | null;
  time: string | null;
  barber: string | null;
  address: string;
  selectedMonth: number; // 0-11
}

interface BookingContextType {
  state: BookingState;
  toggleService: (service: Service) => void;
  setLocationType: (type: LocationType) => void;
  setClientType: (type: ClientType) => void;
  setAgeGroup: (type: AgeGroup) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setBarber: (barber: string) => void;
  setAddress: (address: string) => void;
  setMonth: (month: number) => void;
  totalPrice: number;
  isOvertime: boolean;
  isSunday: boolean;
  isDayOffFee: boolean;
  otFee: number;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>({
    selectedServices: [],
    locationType: 'in-store',
    clientType: 'walk-in',
    ageGroup: 'adults',
    memberId: null,
    date: null,
    time: null,
    barber: null,
    address: '',
    selectedMonth: new Date().getMonth(),
  });

  const toggleService = (service: Service) => {
    setState(prev => {
      const isSelected = prev.selectedServices.find(s => s.id === service.id);
      if (isSelected) {
        return { ...prev, selectedServices: prev.selectedServices.filter(s => s.id !== service.id) };
      }
      
      const exclusiveIds = ['hair', 'skin', 'urban', 'hairstyle'];
      let newServices = [...prev.selectedServices];
      
      if (exclusiveIds.includes(service.id)) {
        newServices = newServices.filter(s => !exclusiveIds.includes(s.id));
      }
      
      return { ...prev, selectedServices: [...newServices, service] };
    });
  };

  const setLocationType = (locationType: LocationType) => {
    setState(prev => {
      if (locationType === 'mobile') {
        return { ...prev, locationType, clientType: 'walk-in', memberId: null };
      }
      return { ...prev, locationType };
    });
  };
  const setClientType = (clientType: ClientType) => {
    setState(prev => {
      const memberId = clientType === 'member' ? Math.random().toString(36).substring(2, 8).toUpperCase() : null;
      return { ...prev, clientType, memberId };
    });
  };
  const setAgeGroup = (ageGroup: AgeGroup) => setState(prev => ({ ...prev, ageGroup }));
  const setDate = (date: string) => setState(prev => ({ ...prev, date }));
  const setTime = (time: string) => setState(prev => ({ ...prev, time }));
  const setBarber = (barber: string) => setState(prev => ({ ...prev, barber }));
  const setAddress = (address: string) => setState(prev => ({ ...prev, address }));
  const setMonth = (selectedMonth: number) => setState(prev => ({ ...prev, selectedMonth }));

  const checkSunday = (dateStr: string | null) => {
    if (!dateStr) return false;
    const date = new Date(dateStr + 'T00:00:00'); // Use local time to avoid timezone shifts
    return date.getDay() === 0;
  };

  const checkDayOffFee = (time: string | null, isSunday: boolean) => {
    if (!time || !isSunday) return false;
    const hour = parseInt(time.split(':')[0]);
    const isPM = time.includes('PM');
    const actualHour = isPM ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour);
    
    // 9 AM to 9 PM
    return actualHour >= 9 && actualHour < 21;
  };

  const checkOvertime = (time: string | null) => {
    if (!time) return false;
    const hour = parseInt(time.split(':')[0]);
    const isPM = time.includes('PM');
    const actualHour = isPM ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour);
    
    return [7, 8, 9, 22, 23, 0].includes(actualHour);
  };

  const getOvertimeFee = (time: string | null, ageGroup: AgeGroup) => {
    if (!time) return 0;
    const hour = parseInt(time.split(':')[0]);
    const isPM = time.includes('PM');
    const actualHour = isPM ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour);
    
    if (actualHour === 22 || actualHour === 9) return ageGroup === 'adults' ? 50 : 25; // 10pm & 9am
    if (actualHour === 23 || actualHour === 8) return ageGroup === 'adults' ? 100 : 50; // 11pm & 8am
    if (actualHour === 0 || actualHour === 7) return ageGroup === 'adults' ? 200 : 100; // 12am & 7am
    return 0;
  };

  const isOvertime = checkOvertime(state.time);
  const otFee = getOvertimeFee(state.time, state.ageGroup);
  const isSunday = checkSunday(state.date);
  const isDayOffFee = checkDayOffFee(state.time, isSunday);
  
  const basePrice = state.selectedServices.reduce((sum, s) => {
    if (state.locationType === 'mobile') {
      if (s.id === 'hair') return sum + (state.ageGroup === 'kids' ? 150 : 250);
      if (s.id === 'hairstyle') return sum + (state.ageGroup === 'kids' ? 200 : 300);
      if (s.id === 'urban') return sum + (state.ageGroup === 'kids' ? 325 : 450);
      if (s.id === 'skin') return sum + 1000;
      return sum + s.price;
    }

    if (state.clientType === 'member' && ['hair', 'hairstyle', 'urban'].includes(s.id)) {
      return sum;
    }
    if (s.id === 'hair') return sum + (state.ageGroup === 'kids' ? 50 : 100);
    if (s.id === 'hairstyle') return sum + (state.ageGroup === 'kids' ? 75 : 125);
    if (s.id === 'urban') return sum + (state.ageGroup === 'kids' ? 100 : 150);
    if (s.id === 'skin') return sum + 500;
    return sum + s.price;
  }, 0);
  
  let calculatedPrice = basePrice + otFee;
  
  // Add another full price for walk-in clients on Sundays
  if (isSunday && state.clientType === 'walk-in') {
    calculatedPrice += basePrice;
  }

  // Day Off Fee: another full payment for Sunday 9am-9pm
  if (isDayOffFee) {
    calculatedPrice += basePrice;
  }

  const totalPrice = calculatedPrice;

  return (
    <BookingContext.Provider value={{ state, toggleService, setLocationType, setClientType, setAgeGroup, setDate, setTime, setBarber, setAddress, setMonth, totalPrice, isOvertime, isSunday, isDayOffFee, otFee }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

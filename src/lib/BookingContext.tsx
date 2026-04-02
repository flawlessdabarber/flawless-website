import React, { createContext, useContext, useState, ReactNode } from 'react';

export type LocationType = 'in-store' | 'mobile';
export type ClientType = 'walk-in' | 'member';

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
  date: string | null;
  time: string | null;
  address: string;
  selectedMonth: number; // 0-11
}

interface BookingContextType {
  state: BookingState;
  toggleService: (service: Service) => void;
  setLocationType: (type: LocationType) => void;
  setClientType: (type: ClientType) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setAddress: (address: string) => void;
  setMonth: (month: number) => void;
  totalPrice: number;
  isOvertime: boolean;
  isSunday: boolean;
  isDayOffFee: boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>({
    selectedServices: [],
    locationType: 'in-store',
    clientType: 'walk-in',
    date: null,
    time: null,
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

  const setLocationType = (locationType: LocationType) => setState(prev => ({ ...prev, locationType }));
  const setClientType = (clientType: ClientType) => setState(prev => ({ ...prev, clientType }));
  const setDate = (date: string) => setState(prev => ({ ...prev, date }));
  const setTime = (time: string) => setState(prev => ({ ...prev, time }));
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
    // Overtime: 7am to 9am, 10pm to 12am
    const hour = parseInt(time.split(':')[0]);
    const isPM = time.includes('PM');
    const actualHour = isPM ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour);
    
    return (actualHour >= 7 && actualHour < 9) || (actualHour >= 22 || actualHour === 0);
  };

  const isOvertime = checkOvertime(state.time);
  const isSunday = checkSunday(state.date);
  const isDayOffFee = checkDayOffFee(state.time, isSunday);
  
  const basePrice = state.selectedServices.reduce((sum, s) => {
    if (s.id === 'skin') {
      return sum + (state.locationType === 'mobile' ? 1000 : 500);
    }
    return sum + s.price;
  }, 0);
  
  let calculatedPrice = isOvertime ? basePrice * 2 : basePrice;
  
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
    <BookingContext.Provider value={{ state, toggleService, setLocationType, setClientType, setDate, setTime, setAddress, setMonth, totalPrice, isOvertime, isSunday, isDayOffFee }}>
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

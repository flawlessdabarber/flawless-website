import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../lib/CartContext';
import { useBooking } from '../lib/BookingContext';

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice: cartTotal } = useCart();
  const { state: bookingState, toggleService, totalPrice: bookingTotal } = useBooking();

  const finalTotal = cartTotal + bookingTotal;
  const hasItems = items.length > 0 || bookingState.selectedServices.length > 0;

  return (
    <div className="min-h-screen pt-32 pb-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12">
          <h2 className="text-5xl font-bold uppercase tracking-tighter">Your Bag</h2>
          <p className="text-white/40 uppercase tracking-widest text-[10px] mt-2">Premium grooming essentials</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {!hasItems ? (
              <div className="glass p-12 rounded-3xl text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="text-white/20" />
                </div>
                <p className="text-white/40 mb-8 uppercase tracking-widest text-sm">Your bag is empty</p>
                <Link to="/merchandise" className="inline-block px-8 py-4 bg-brand-green text-black font-bold uppercase tracking-widest rounded-sm hover:bg-white transition-all">
                  Shop Now
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {bookingState.selectedServices.map((service) => (
                    <motion.div 
                      key={`service-${service.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="glass p-6 rounded-3xl flex gap-6 items-center border border-brand-green/20"
                    >
                      <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-brand-green/10 flex items-center justify-center">
                        <span className="text-brand-green font-bold uppercase text-xs tracking-widest text-center px-2">Service</span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-brand-green font-bold mb-1">Appointment</p>
                            <h4 className="text-lg font-bold uppercase">{service.title}</h4>
                          </div>
                          <button 
                            onClick={() => toggleService(service)}
                            className="text-white/40 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-white/60 mb-4">
                          <span>{bookingState.locationType === 'mobile' ? 'Mobile Visit' : 'In-Store'}</span>
                          <span>{bookingState.ageGroup === 'kids' ? 'Kids' : 'Adults'}</span>
                        </div>
                        <div className="flex justify-end items-center">
                          <span className="font-bold text-lg text-brand-green">Included in Booking Total</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {items.map((item) => (
                    <motion.div 
                      key={`${item.id}-${item.size}-${item.color}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="glass p-6 rounded-3xl flex gap-6 items-center"
                    >
                      <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-brand-green font-bold mb-1">{item.category}</p>
                            <h4 className="text-lg font-bold uppercase">{item.name}</h4>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-white/40 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-white/60 mb-4">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/5">-</button>
                            <span className="font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/5">+</button>
                          </div>
                          <span className="font-bold text-lg">${item.price * item.quantity}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass p-8 rounded-3xl">
              <h4 className="text-xl font-bold uppercase mb-8">Summary</h4>
              <div className="space-y-4 mb-8">
                {cartTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40 uppercase tracking-widest">Products & Memberships</span>
                    <span className="font-bold">${cartTotal.toFixed(2)}</span>
                  </div>
                )}
                {bookingTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40 uppercase tracking-widest">Services Booking</span>
                    <span className="font-bold">${bookingTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-white/40 uppercase tracking-widest">Shipping</span>
                  <span className="font-bold">Calculated at checkout</span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="flex justify-between text-xl font-bold">
                  <span className="uppercase tracking-tighter">Total</span>
                  <span className="text-brand-green">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
              <button 
                disabled={!hasItems}
                className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-brand-green transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Checkout <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

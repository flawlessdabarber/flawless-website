import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12">
          <h2 className="text-5xl font-bold uppercase tracking-tighter">Your Bag</h2>
          <p className="text-white/40 uppercase tracking-widest text-[10px] mt-2">Premium grooming essentials</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {/* Empty State */}
            <div className="glass p-12 rounded-3xl text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="text-white/20" />
              </div>
              <p className="text-white/40 mb-8 uppercase tracking-widest text-sm">Your bag is empty</p>
              <Link to="/merchandise" className="inline-block px-8 py-4 bg-brand-green text-black font-bold uppercase tracking-widest rounded-sm hover:bg-white transition-all">
                Shop Now
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass p-8 rounded-3xl">
              <h4 className="text-xl font-bold uppercase mb-8">Summary</h4>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40 uppercase tracking-widest">Subtotal</span>
                  <span className="font-bold">$0.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40 uppercase tracking-widest">Shipping</span>
                  <span className="font-bold">Calculated at checkout</span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="flex justify-between text-xl font-bold">
                  <span className="uppercase tracking-tighter">Total</span>
                  <span>$0.00</span>
                </div>
              </div>
              <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-brand-green transition-all flex items-center justify-center gap-2">
                Checkout <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

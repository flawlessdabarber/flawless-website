import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth, logout } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCart } from '../lib/CartContext';

export default function Navbar() {
  const [user] = useAuthState(auth);
  const { items } = useCart();
  
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" style={{ height: '150px' }} />
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
            <ShoppingBag size={20} />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-brand-green text-black text-[8px] flex items-center justify-center rounded-full font-bold">
                {cartItemCount}
              </span>
            )}
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <User size={20} />
              </Link>
              <button onClick={logout} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="px-6 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-brand-green transition-colors rounded-sm">
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

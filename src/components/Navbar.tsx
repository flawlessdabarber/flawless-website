import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, User, LogOut, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth, logout } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Navbar() {
  const [user] = useAuthState(auth);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold uppercase tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center text-black text-xs">F</div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-widest font-bold">
          <Link to="/services" className="hover:text-brand-green transition-colors">Services</Link>
          <Link to="/membership" className="hover:text-brand-green transition-colors">Membership</Link>
          <Link to="/merchandise" className="hover:text-brand-green transition-colors">Shop</Link>
          <Link to="/podcast" className="hover:text-brand-green transition-colors">Podcast</Link>
          <Link to="/events" className="hover:text-brand-green transition-colors">Events</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
            <ShoppingBag size={20} />
            <span className="absolute top-0 right-0 w-4 h-4 bg-brand-green text-black text-[8px] flex items-center justify-center rounded-full font-bold">0</span>
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

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 hover:bg-white/10 rounded-full">
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-black border-b border-white/10 px-6 py-8 flex flex-col gap-6 text-[10px] uppercase tracking-widest font-bold"
        >
          <Link to="/services" onClick={() => setIsMenuOpen(false)}>Services</Link>
          <Link to="/membership" onClick={() => setIsMenuOpen(false)}>Membership</Link>
          <Link to="/merchandise" onClick={() => setIsMenuOpen(false)}>Shop</Link>
          <Link to="/podcast" onClick={() => setIsMenuOpen(false)}>Podcast</Link>
          <Link to="/events" onClick={() => setIsMenuOpen(false)}>Events</Link>
        </motion.div>
      )}
    </nav>
  );
}

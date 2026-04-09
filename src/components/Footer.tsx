import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import FooterMap from './FooterMap';
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-24 pb-12">
      <div className="container mx-auto px-6">
        <FooterMap />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-24">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <img src={logo} alt="Logo" style={{ height: '100px' }} />
            </Link>
            <p className="text-white/40 max-w-md mb-8 leading-relaxed">
              Redefining the modern grooming experience through precision, technology, and community. Join us in the pursuit of perfection.
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-brand-green transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-brand-green transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-brand-green transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-brand-green transition-colors"><Youtube size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-green mb-8">Navigation</h4>
            <ul className="space-y-4 text-sm uppercase tracking-widest font-bold">
              <li><Link to="/services" className="hover:text-brand-green transition-colors">Services</Link></li>
              <li><Link to="/membership" className="hover:text-brand-green transition-colors">Membership</Link></li>
              <li><Link to="/merchandise" className="hover:text-brand-green transition-colors">Shop</Link></li>
              <li><Link to="/podcast" className="hover:text-brand-green transition-colors">FDB Live</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-green mb-8">Legal</h4>
            <ul className="space-y-4 text-sm uppercase tracking-widest font-bold">
              <li><Link to="/legal" className="hover:text-brand-green transition-colors">Privacy Policy</Link></li>
              <li><Link to="/legal" className="hover:text-brand-green transition-colors">Terms of Service</Link></li>
              <li><Link to="/legal" className="hover:text-brand-green transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-green mb-8">Access</h4>
            <ul className="space-y-4 text-sm uppercase tracking-widest font-bold">
              <li><Link to="/admin" className="hover:text-brand-green transition-colors">Admin</Link></li>
              <li><Link to="/barber" className="hover:text-brand-green transition-colors">Barber</Link></li>
              <li><Link to="/member" className="hover:text-brand-green transition-colors">Member</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-12 text-[10px] uppercase tracking-widest text-white/30">
          <p>© 2026 Flawless Da Barber. All Rights Reserved.</p>
          <p>Designed for the Elite.</p>
        </div>
      </div>
    </footer>
  );
}

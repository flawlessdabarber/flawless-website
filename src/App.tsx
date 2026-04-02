/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CommunityBanner from './components/CommunityBanner';
import AIAgent from './components/AIAgent';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import Legal from './pages/Legal';

import { BookingProvider } from './lib/BookingContext';
import { AIProvider } from './lib/AIContext';
import { CartProvider } from './lib/CartContext';

export default function App() {
  return (
    <CartProvider>
      <BookingProvider>
        <AIProvider>
          <Router>
            <div className="min-h-screen bg-black text-white selection:bg-brand-green selection:text-black">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/services" element={<Home />} />
                <Route path="/membership" element={<Home />} />
                <Route path="/merchandise" element={<Home />} />
                <Route path="/podcast" element={<Home />} />
                <Route path="/events" element={<Home />} />
              </Routes>
              <CommunityBanner />
              <Footer />
              <AIAgent />
            </div>
          </Router>
        </AIProvider>
      </BookingProvider>
    </CartProvider>
  );
}

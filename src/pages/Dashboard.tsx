import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { UserProfile } from '../types';
import { motion } from 'motion/react';
import { Calendar, User, Settings, Package, Scissors, Users } from 'lucide-react';

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center">Profile not found.</div>;

  const renderAdmin = () => (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-2xl">
          <p className="text-brand-green text-[10px] uppercase tracking-widest mb-2">Total Revenue</p>
          <h4 className="text-3xl font-bold">$12,450</h4>
        </div>
        <div className="glass p-8 rounded-2xl">
          <p className="text-brand-green text-[10px] uppercase tracking-widest mb-2">Active Members</p>
          <h4 className="text-3xl font-bold">142</h4>
        </div>
        <div className="glass p-8 rounded-2xl">
          <p className="text-brand-green text-[10px] uppercase tracking-widest mb-2">Pending Bookings</p>
          <h4 className="text-3xl font-bold">8</h4>
        </div>
      </div>
      <div className="glass p-8 rounded-2xl">
        <h4 className="text-xl font-bold uppercase mb-6 flex items-center gap-2"><Users size={20} className="text-brand-green" /> User Management</h4>
        <div className="space-y-4">
          <p className="text-white/40 text-sm">Admin tools coming soon...</p>
        </div>
      </div>
    </div>
  );

  const renderBarber = () => (
    <div className="space-y-8">
      <div className="glass p-8 rounded-2xl">
        <h4 className="text-xl font-bold uppercase mb-6 flex items-center gap-2"><Calendar size={20} className="text-brand-green" /> Today's Schedule</h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
            <div>
              <p className="font-bold">John Smith</p>
              <p className="text-xs text-white/40">Skin Therapy • 2:00 PM</p>
            </div>
            <span className="px-3 py-1 bg-brand-green text-black text-[10px] font-bold rounded-full">Confirmed</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClient = () => (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-2xl border-brand-green/20">
          <p className="text-brand-green text-[10px] uppercase tracking-widest mb-2">Membership</p>
          <h4 className="text-2xl font-bold uppercase">{profile.membershipType}</h4>
          <button className="mt-4 text-xs font-bold uppercase tracking-widest hover:text-brand-green transition-colors">Upgrade Plan</button>
        </div>
        <div className="glass p-8 rounded-2xl">
          <p className="text-brand-green text-[10px] uppercase tracking-widest mb-2">Loyalty Points</p>
          <h4 className="text-2xl font-bold uppercase">450 pts</h4>
        </div>
      </div>
      <div className="glass p-8 rounded-2xl">
        <h4 className="text-xl font-bold uppercase mb-6 flex items-center gap-2"><Scissors size={20} className="text-brand-green" /> My Bookings</h4>
        <p className="text-white/40 text-sm">No upcoming appointments. Book one now!</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold uppercase tracking-tighter">Hello, {profile.displayName}</h2>
            <p className="text-brand-green text-[10px] uppercase tracking-widest font-bold mt-2">{profile.role} Dashboard</p>
          </div>
          <div className="flex gap-4">
            <button className="p-3 glass rounded-xl hover:bg-white/10 transition-colors"><Settings size={20} /></button>
            <button className="p-3 glass rounded-xl hover:bg-white/10 transition-colors"><Package size={20} /></button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {profile.role === 'admin' && renderAdmin()}
          {profile.role === 'barber' && renderBarber()}
          {profile.role === 'client' && renderClient()}
        </motion.div>
      </div>
    </div>
  );
}

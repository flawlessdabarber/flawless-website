import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  LayoutDashboard, DollarSign, TrendingDown, Package, Scissors, 
  Users, ShoppingBag, Calendar, Megaphone, TrendingUp, Settings, 
  Plus, Edit2, Trash2, Search, Bell, Menu, X, User, BookOpen, UserPlus
} from 'lucide-react';

const areaData = [
  { name: '1', central: 4000, north: 2400, downtown: 2400 },
  { name: '5', central: 3000, north: 1398, downtown: 2210 },
  { name: '9', central: 2000, north: 9800, downtown: 2290 },
  { name: '13', central: 2780, north: 3908, downtown: 2000 },
  { name: '17', central: 1890, north: 4800, downtown: 2181 },
  { name: '21', central: 2390, north: 3800, downtown: 2500 },
  { name: '25', central: 3490, north: 4300, downtown: 2100 },
  { name: '29', central: 4000, north: 2400, downtown: 2400 },
  { name: '31', central: 3000, north: 1398, downtown: 2210 },
];

const radarData = [
  { subject: 'Knowledge', A: 120, fullMark: 150 },
  { subject: 'Helpful', A: 98, fullMark: 150 },
  { subject: 'Effective', A: 86, fullMark: 150 },
  { subject: 'Score', A: 99, fullMark: 150 },
  { subject: 'Average', A: 85, fullMark: 150 },
  { subject: 'Punctual', A: 65, fullMark: 150 },
  { subject: 'Delivery', A: 85, fullMark: 150 },
  { subject: 'Quality', A: 130, fullMark: 150 },
];

const barData = [
  { name: 'Sun', value: 360 },
  { name: 'Mon', value: 410 },
  { name: 'Tue', value: 372 },
  { name: 'Wed', value: 290 },
  { name: 'Thu', value: 350 },
];

const lineData = [
  { name: '1', value: 2400 },
  { name: '5', value: 1398 },
  { name: '9', value: 9800 },
  { name: '13', value: 3908 },
  { name: '17', value: 4800 },
  { name: '21', value: 3800 },
  { name: '25', value: 4300 },
];

const bubbleData = [
  { name: 'First Branch', value: 444, color: '#00ff00' },
  { name: 'Second Branch', value: 1926, color: '#ffffff' },
  { name: 'Third Branch', value: 543, color: '#333333' },
];

const sections = [
  { id: 'profits', label: 'Profits', icon: DollarSign },
  { id: 'onboarding', label: 'Onboarding Barbers', icon: UserPlus },
  { id: 'expenses', label: 'Expenses', icon: TrendingDown },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'barbers', label: 'Barbers', icon: Scissors },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'sales', label: 'Sales', icon: TrendingUp },
  { id: 'services', label: 'Services', icon: Settings },
  { id: 'training', label: 'Training', icon: BookOpen },
];

export default function AdminDashboard() {
  const location = useLocation();
  const isBarber = location.pathname === '/barber';
  const [activeSection, setActiveSection] = useState(isBarber ? 'onboarding' : 'profits');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl border-l-4 border-brand-green">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Total Revenue</p>
          <h3 className="text-3xl font-bold text-white">$405,227.00</h3>
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-white">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Retail Sales</p>
          <h3 className="text-3xl font-bold text-white">$24,905.00</h3>
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-gray-500">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Cost of Revenue</p>
          <h3 className="text-3xl font-bold text-white">$32,859.00</h3>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold uppercase tracking-widest text-sm">Revenue by Region</h4>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-2"><div className="w-3 h-3 bg-brand-green rounded-full"></div> Central</span>
              <span className="flex items-center gap-2"><div className="w-3 h-3 bg-white rounded-full"></div> North</span>
              <span className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-500 rounded-full"></div> Downtown</span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorCentral" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ff00" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNorth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{fill: '#666'}} />
                <YAxis stroke="#666" tick={{fill: '#666'}} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                <Area type="monotone" dataKey="central" stroke="#00ff00" fillOpacity={1} fill="url(#colorCentral)" />
                <Area type="monotone" dataKey="north" stroke="#ffffff" fillOpacity={1} fill="url(#colorNorth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="glass p-6 rounded-2xl">
          <h4 className="font-bold uppercase tracking-widest text-sm mb-6">Key Performance</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#888', fontSize: 10}} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="Performance" dataKey="A" stroke="#00ff00" fill="#00ff00" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="glass p-6 rounded-2xl">
          <h4 className="font-bold uppercase tracking-widest text-sm mb-6">Weekly Activity</h4>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#666" tick={{fill: '#666', fontSize: 12}} axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{fill: '#222'}} contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                <Bar dataKey="value" fill="#00ff00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evaluations List */}
        <div className="glass p-6 rounded-2xl lg:col-span-2">
          <h4 className="font-bold uppercase tracking-widest text-sm mb-6">Evaluations</h4>
          <div className="space-y-4">
            {[
              { title: 'Appropriateness evaluation', desc: 'Three broad categories of key evaluation assess whether the program is appropriate.', score: '543', rating: '*****' },
              { title: 'Economic evaluation', desc: 'Has the intervention been cost-effective (compared to alternatives)?', score: '3,425', rating: '****' },
              { title: 'Outcome evaluation', desc: 'Did the program produce or contribute to the intended outcomes in the short, medium and long term?', score: '3,424', rating: '*****' },
              { title: 'Process evaluation', desc: 'How appropriate are the processes compared with quality standards?', score: '3,423', rating: '***' }
            ].map((evalItem, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                  <div>
                    <h5 className="font-bold text-sm">{evalItem.title}</h5>
                    <p className="text-xs text-white/50 mt-1 max-w-md">{evalItem.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-brand-green text-lg tracking-widest">{evalItem.rating}</div>
                  <div className="font-mono font-bold">{evalItem.score}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl flex justify-between items-center bg-gradient-to-r from-brand-green/20 to-transparent">
          <div>
            <p className="text-white/70 text-sm uppercase tracking-widest">Webstore Visitors</p>
            <h4 className="text-3xl font-bold mt-2">72,426</h4>
          </div>
          <div className="h-16 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <Line type="monotone" dataKey="value" stroke="#00ff00" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex justify-between items-center bg-gradient-to-r from-white/10 to-transparent">
          <div>
            <p className="text-white/70 text-sm uppercase tracking-widest">Webstore Sales</p>
            <h4 className="text-3xl font-bold mt-2">72,099</h4>
          </div>
          <div className="h-16 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <Line type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => (
    <div className="glass p-8 rounded-2xl min-h-[600px]">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold uppercase tracking-widest">{activeSection} Management</h3>
        <button className="flex items-center gap-2 bg-brand-green text-black px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors">
          <Plus size={16} /> Add New
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-widest">
              <th className="p-4 font-normal">ID</th>
              <th className="p-4 font-normal">Name</th>
              <th className="p-4 font-normal">Status</th>
              <th className="p-4 font-normal">Date</th>
              <th className="p-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((item) => (
              <tr key={item} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 font-mono text-sm">#{item}0492</td>
                <td className="p-4 font-bold">Sample {activeSection} Item {item}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-brand-green/20 text-brand-green text-[10px] uppercase tracking-widest rounded-full">Active</span>
                </td>
                <td className="p-4 text-sm text-white/70">Oct 24, 2026</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:text-brand-green transition-colors"><Edit2 size={16} /></button>
                    <button className="p-2 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-black border-r border-white/10 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} pt-24 lg:pt-0 flex flex-col`}>
        <div className="p-6">
          <h2 className="text-xl font-bold uppercase tracking-tighter flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center text-black text-xs">F</div>
            {isBarber ? 'Barber Panel' : 'Admin Panel'}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar">
          <button 
            onClick={() => setActiveSection('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors ${activeSection === 'dashboard' ? 'bg-brand-green text-black' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          
          <div className="pt-4 pb-2 px-4 text-[10px] text-white/40 uppercase tracking-widest">Modules</div>
          
          {sections
            .filter(section => {
              if (isBarber) {
                return !['profits', 'marketing', 'inventory', 'expenses', 'barbers', 'events'].includes(section.id);
              } else {
                return !['onboarding', 'training'].includes(section.id);
              }
            })
            .map((section) => {
            const Icon = section.icon;
            let label = section.label;
            if (isBarber) {
              if (section.id === 'sales') label = 'Schedule';
              if (section.id === 'members') label = 'Clientele';
              if (section.id === 'onboarding') label = 'Onboarding';
              if (section.id === 'services') label = 'Meetings';
              if (section.id === 'shop') label = 'Social Media';
            }
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors ${activeSection === section.id ? 'bg-brand-green text-black' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 w-full max-w-[100vw] lg:max-w-[calc(100vw-16rem)]">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 glass p-4 rounded-2xl">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-widest">{activeSection === 'dashboard' ? 'Analytics Dashboard 2026' : `${activeSection} Management`}</h1>
              <p className="text-xs text-white/50 uppercase tracking-widest mt-1">Last Update: Today • Modified by: Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-white/5 rounded-full px-4 py-2 border border-white/10">
              <Search size={16} className="text-white/50 mr-2" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-32 focus:w-48 transition-all" />
            </div>
            <button className="p-2 hover:bg-white/10 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-green rounded-full"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-white/10 border border-brand-green flex items-center justify-center overflow-hidden">
              <User size={20} className="text-brand-green" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === 'dashboard' ? renderDashboardContent() : renderSectionContent()}
        </motion.div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

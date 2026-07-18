import React from 'react';
import { Screen } from '../types';
import { LayoutDashboard, FileSpreadsheet, Calculator, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface LayoutProps {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
  children: React.ReactNode;
}

export function Layout({ currentScreen, setScreen, children }: LayoutProps) {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'cleaner', icon: FileSpreadsheet, label: 'Data Lab' },
    { id: 'calculator', icon: Calculator, label: 'Costing' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Nav */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
        <h1 className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">XELORA</h1>
      </div>

      {/* Sidebar */}
      <nav className="hidden md:flex w-20 lg:w-64 flex-col bg-slate-950 border-r border-slate-800 p-4 transition-all duration-300">
        <div className="mb-8 flex items-center justify-center lg:justify-start lg:px-2">
          <h1 className="hidden lg:block text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">XELORA</h1>
          <div className="lg:hidden w-10 h-10 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white">X</div>
        </div>
        
        <div className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={cn(
                "w-full flex items-center lg:justify-start justify-center p-3 rounded-xl transition-all duration-200 group relative",
                currentScreen === item.id 
                  ? "bg-slate-800 text-cyan-400" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              )}
            >
              {currentScreen === item.id && (
                 <motion.div layoutId="active-nav" className="absolute left-0 w-1 h-8 bg-cyan-400 rounded-r-full" />
              )}
              <item.icon className="w-6 h-6 lg:mr-3" />
              <span className="hidden lg:block font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto relative bg-slate-900/50">
        <motion.div
           key={currentScreen}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.3 }}
           className="h-full max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 flex justify-around p-2 z-50">
         {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg flex-1",
                currentScreen === item.id ? "text-cyan-400" : "text-slate-400"
              )}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
      </div>
    </div>
  );
}

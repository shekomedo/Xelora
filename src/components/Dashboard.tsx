import React from 'react';
import { BarChart, Activity, Zap, ShieldCheck } from 'lucide-react';
import { Screen } from '../types';

export function Dashboard({ setScreen }: { setScreen: (s: Screen) => void }) {
  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">System Status</h2>
        <p className="text-slate-400 font-mono text-sm">Welcome to Xelora Workspace. All systems operational.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Data Integrity', value: '99.9%', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Processing Power', value: 'Optimal', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Recent Analysis', value: '0 files', icon: BarChart, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'System Load', value: '12%', icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-100">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div 
          onClick={() => setScreen('cleaner')}
          className="group cursor-pointer bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500/50 rounded-2xl p-8 transition-all relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[50px] -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-50"></div>
          <h3 className="text-xl font-bold text-white mb-2">Data Lab</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-sm">Import Excel/Word files. Clean, sort, and analyze massive datasets instantly with zero errors.</p>
          <span className="inline-flex items-center text-cyan-400 text-sm font-medium">
            Initialize Engine &rarr;
          </span>
        </div>

        <div 
          onClick={() => setScreen('calculator')}
          className="group cursor-pointer bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-blue-500/50 rounded-2xl p-8 transition-all relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[50px] -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-50"></div>
          <h3 className="text-xl font-bold text-white mb-2">Costing Calculator</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-sm">Advanced financial engine to calculate product costs, labor, and profit margins dynamically.</p>
          <span className="inline-flex items-center text-blue-400 text-sm font-medium">
            Open Calculator &rarr;
          </span>
        </div>
      </div>
    </div>
  );
}

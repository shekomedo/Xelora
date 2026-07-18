import React, { useState } from 'react';
import { AppSettings } from '../types';
import { Globe, Palette, Calendar, DollarSign, Info } from 'lucide-react';

export function Settings() {
  const [settings, setSettings] = useState<AppSettings>({
    language: 'en',
    theme: 'dark',
    dateFormat: 'YYYY-MM-DD',
    currency: 'USD',
  });

  const updateSetting = (key: keyof AppSettings, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-8 pb-20 md:pb-0 max-w-3xl mx-auto">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Preferences</h2>
        <p className="text-slate-400 font-mono text-sm">Configure Xelora environment parameters.</p>
      </header>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-white font-medium">Language</h3>
                <p className="text-sm text-slate-400">Interface language</p>
              </div>
            </div>
            <select 
              value={settings.language} 
              onChange={(e) => updateSetting('language', e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg p-2.5 outline-none focus:border-cyan-500"
            >
              <option value="en">English</option>
              <option value="ar">العربية (Arabic)</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Palette className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="text-white font-medium">Theme</h3>
                <p className="text-sm text-slate-400">Visual appearance</p>
              </div>
            </div>
            <select 
              value={settings.theme} 
              onChange={(e) => updateSetting('theme', e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg p-2.5 outline-none focus:border-cyan-500"
            >
              <option value="dark">Dark Matrix</option>
              <option value="light">Light Void (Coming Soon)</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-white font-medium">Date Format</h3>
                <p className="text-sm text-slate-400">Default date standardization</p>
              </div>
            </div>
            <select 
              value={settings.dateFormat} 
              onChange={(e) => updateSetting('dateFormat', e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg p-2.5 outline-none focus:border-cyan-500"
            >
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-white font-medium">Currency</h3>
                <p className="text-sm text-slate-400">Cost calculator base currency</p>
              </div>
            </div>
            <select 
              value={settings.currency} 
              onChange={(e) => updateSetting('currency', e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg p-2.5 outline-none focus:border-cyan-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="EGP">EGP (E£)</option>
              <option value="SAR">SAR (ر.س)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
        <Info className="w-8 h-8 text-slate-500 mx-auto mb-4" />
        <h3 className="text-xl font-black text-white tracking-widest mb-2">XELORA</h3>
        <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
          Intelligent Data Engine & Costing Analytics. Built for precision, speed, and absolute reliability.
        </p>
        <div className="inline-block bg-slate-950 rounded-lg px-6 py-4 border border-slate-800">
           <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Designed & Developed by</p>
           <p className="text-sm font-bold text-cyan-400">Eng. Mohammed Tarek & Eng. Ahmed Nasser</p>
           <p className="text-xs text-slate-600 mt-2">All Rights Reserved © {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';
import { storage, AppSettings } from '@/lib/storage';
import { CURRENCIES, CurrencySymbol } from '@/lib/formatting';
import { Download, Trash2, Sun, Moon, Monitor, Info } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({ currency: 'GH₵', theme: 'system' });
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const currentSettings = storage.getSettings();
    setSettings(currentSettings);
    
    // Detect system theme
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setSystemTheme('dark');
    }
  }, []);

  const handleCurrencyChange = (newCurrency: CurrencySymbol) => {
    const newSettings = { ...settings, currency: newCurrency };
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    const newSettings = { ...settings, theme: newTheme };
    setSettings(newSettings);
    storage.saveSettings(newSettings);
    
    // Apply theme immediately
    applyTheme(newTheme);
  };

  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.classList.add('dark');
      } else {
        html.classList.add('light');
      }
    } else {
      html.classList.add(theme);
    }
  };

  const handleExportJSON = () => {
    const data = storage.exportDataAsJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teo-revenue-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const data = storage.exportDataAsCSV();
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teo-revenue-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    storage.clearAllRevenueData();
    setShowClearConfirm(false);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20 md:pb-0">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Header />
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Settings
        </h1>

        {/* Currency */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Currency
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(CURRENCIES).map((currency) => (
              <button
                key={currency}
                onClick={() => handleCurrencyChange(currency as CurrencySymbol)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  settings.currency === currency
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currency}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Appearance
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => handleThemeChange('light')}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                settings.theme === 'light'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">Light Mode</span>
            </button>
            
            <button
              onClick={() => handleThemeChange('dark')}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                settings.theme === 'dark'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">Dark Mode</span>
            </button>
            
            <button
              onClick={() => handleThemeChange('system')}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                settings.theme === 'system'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">System</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                ({systemTheme})
              </span>
            </button>
          </div>
        </div>

        {/* Data */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Data
          </h2>
          <div className="space-y-3">
            <button
              onClick={handleExportJSON}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">Export Data (JSON)</span>
            </button>
            
            <button
              onClick={handleExportCSV}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">Export Data (CSV)</span>
            </button>
            
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="font-medium text-red-600 dark:text-red-400">Clear All Data</span>
            </button>
          </div>
        </div>

        {/* About */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Info className="w-5 h-5" />
            About
          </h2>
          <div className="space-y-2">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">TEO</p>
              <p className="text-gray-600 dark:text-gray-400">Track. Calculate. Grow.</p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Version 1.0.0
            </p>
          </div>
        </div>

        {/* Clear Data Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Clear All Data?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete all revenue data? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearData}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                >
                  Clear Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
}
'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700 shadow-inner w-[72px] h-8 justify-center">
        <span className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse" />
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <div
      className="flex items-center bg-slate-100 dark:bg-slate-800/90 rounded-full p-1 border border-slate-200 dark:border-slate-700 shadow-inner"
      role="group"
      aria-label="Theme selection toggle"
    >
      {/* Light Mode Segment */}
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
          !isDark
            ? 'bg-white shadow-sm text-amber-500 scale-105'
            : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
        }`}
        title="Switch to Light Mode"
        aria-label="Switch to Light Mode"
      >
        <Sun className="w-3.5 h-3.5" />
      </button>

      {/* Dark Mode Segment */}
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
          isDark
            ? 'bg-slate-900 shadow-sm text-emerald-400 scale-105'
            : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
        }`}
        title="Switch to Dark Mode"
        aria-label="Switch to Dark Mode"
      >
        <Moon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

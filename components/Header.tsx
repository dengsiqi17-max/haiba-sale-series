import React from 'react';
import { LayoutDashboard, Globe2 } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Globe2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">
                Global Series Tracker
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Sales Distribution System
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
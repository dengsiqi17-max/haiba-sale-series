import React, { useState } from 'react';
import { PlusCircle, CheckCircle2, AlertCircle, Users } from 'lucide-react';
import { SaleRecord, COMMON_COUNTRIES } from '../types';

interface RecordSaleProps {
  products: string[];
  onAddSale: (series: string, country: string, customerName: string) => void;
}

export const RecordSale: React.FC<RecordSaleProps> = ({ products, onAddSale }) => {
  const [selectedSeries, setSelectedSeries] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [customCountry, setCustomCountry] = useState<string>('');
  const [isCustomCountry, setIsCustomCountry] = useState(false);
  const [customerName, setCustomerName] = useState('');
  
  const [notification, setNotification] = useState<{type: 'success' | 'error', msg: string} | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const countryToUse = isCustomCountry ? customCountry.trim() : selectedCountry;

    if (!selectedSeries || !countryToUse) {
      setNotification({ type: 'error', msg: 'Please select both a series and a country.' });
      return;
    }

    if (!customerName.trim()) {
       setNotification({ type: 'error', msg: 'Please enter the customer name/abbreviation.' });
       return;
    }

    onAddSale(selectedSeries, countryToUse, customerName.trim());
    
    setNotification({ type: 'success', msg: `Recorded: ${selectedSeries} sold to ${countryToUse} (${customerName})` });
    setSelectedSeries('');
    setSelectedCountry('');
    setCustomCountry('');
    setIsCustomCountry(false);
    setCustomerName('');

    // Clear success message after 3s
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Record New Sale</h2>
          <p className="text-slate-500 mt-1">Log a product series distribution to a specific market.</p>
        </div>

        {notification && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 text-sm font-medium animate-fade-in ${
            notification.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-100' 
              : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {notification.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Series Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Product Series</label>
            {products.length === 0 ? (
              <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-100">
                No product series available. Please go to "Manage Products" to import them first.
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedSeries}
                  onChange={(e) => setSelectedSeries(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                >
                  <option value="">Select a series...</option>
                  {products.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            )}
          </div>

          {/* Customer Name Input */}
           <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Customer Name / Abbreviation (客户简称)
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Users className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g., LLC Tech, Client A..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          {/* Country Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Destination Country</label>
            
            {!isCustomCountry ? (
              <div className="relative">
                 <select
                  value={selectedCountry}
                  onChange={(e) => {
                    if (e.target.value === 'OTHER') {
                      setIsCustomCountry(true);
                      setSelectedCountry('');
                    } else {
                      setSelectedCountry(e.target.value);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                >
                  <option value="">Select a country...</option>
                  {COMMON_COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="OTHER" className="font-semibold text-primary">+ Enter Manually...</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type country name..."
                  value={customCountry}
                  onChange={(e) => setCustomCountry(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsCustomCountry(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={products.length === 0}
            className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Record Sale</span>
          </button>
        </form>
      </div>
    </div>
  );
};
import React, { useState, useMemo } from 'react';
import { SaleRecord } from '../types';
import { Search, MapPin, Package, ArrowRight, History, Trash2, Calendar, Users } from 'lucide-react';

interface DataExplorerProps {
  sales: SaleRecord[];
  products: string[];
  onDeleteSale: (id: string) => void;
}

type ViewMode = 'BY_COUNTRY' | 'BY_SERIES' | 'HISTORY';

export const DataExplorer: React.FC<DataExplorerProps> = ({ sales, products, onDeleteSale }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('BY_COUNTRY');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [historySearch, setHistorySearch] = useState('');

  // Get unique countries from sales history
  const activeCountries = useMemo(() => {
    return Array.from(new Set(sales.map(s => s.country))).sort();
  }, [sales]);

  // Calculate results based on selection (Cross-reference logic)
  const results = useMemo(() => {
    if (!selectedItem) return [];

    if (viewMode === 'BY_COUNTRY') {
      // User selected a Country, show Series
      return sales
        .filter(s => s.country === selectedItem)
        .map(s => s.seriesName);
    } else if (viewMode === 'BY_SERIES') {
      // User selected a Series, show Countries
      return sales
        .filter(s => s.seriesName === selectedItem)
        .map(s => s.country);
    }
    return [];
  }, [viewMode, selectedItem, sales]);

  // Unique results for cross-reference view
  const uniqueResults = Array.from(new Set(results)).sort();

  // Filtered history list
  const filteredHistory = useMemo(() => {
    if (viewMode !== 'HISTORY') return [];
    const term = historySearch.toLowerCase();
    return sales.filter(s => 
      s.seriesName.toLowerCase().includes(term) || 
      s.country.toLowerCase().includes(term) ||
      s.customerName.toLowerCase().includes(term)
    );
  }, [viewMode, historySearch, sales]);

  const handleSwitchMode = (mode: ViewMode) => {
    setViewMode(mode);
    setSelectedItem('');
    setHistorySearch('');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Data Explorer</h2>
          <p className="text-slate-500 mt-1">
            {viewMode === 'HISTORY' ? 'Manage and view all sales records.' : 'Cross-reference your sales data instantly.'}
          </p>
        </div>
        
        {/* Mode Switcher */}
        <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex overflow-x-auto max-w-full scrollbar-hide">
          <button
            onClick={() => handleSwitchMode('BY_COUNTRY')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              viewMode === 'BY_COUNTRY' 
                ? 'bg-slate-100 text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <MapPin className="w-4 h-4" />
            By Country
          </button>
          <button
            onClick={() => handleSwitchMode('BY_SERIES')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              viewMode === 'BY_SERIES' 
                ? 'bg-slate-100 text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Package className="w-4 h-4" />
            By Series
          </button>
          <button
            onClick={() => handleSwitchMode('HISTORY')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              viewMode === 'HISTORY' 
                ? 'bg-slate-100 text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <History className="w-4 h-4" />
            All Records
          </button>
        </div>
      </div>

      {/* HISTORY VIEW */}
      {viewMode === 'HISTORY' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search records (series, country, customer)..." 
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="flex items-center text-sm text-slate-500">
              {filteredHistory.length} records found
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 w-1/5">Series Name</th>
                  <th className="px-6 py-3 w-1/5">Country</th>
                  <th className="px-6 py-3 w-1/5">Customer</th>
                  <th className="px-6 py-3 w-1/5">Date Recorded</th>
                  <th className="px-6 py-3 w-1/5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No records found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-3 font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-slate-400" />
                          {record.seriesName}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-slate-700">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          {record.country}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-slate-700">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-400" />
                          {record.customerName}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(record.timestamp)}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => onDeleteSale(record.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CROSS REFERENCE VIEWS */
        <div className="grid md:grid-cols-12 gap-6">
          {/* Selection Column */}
          <div className="md:col-span-4 space-y-4">
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Select {viewMode === 'BY_COUNTRY' ? 'Country' : 'Series'}
            </label>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
              <div className="p-3 border-b border-slate-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Filter list..." 
                    value={selectedItem ? '' : undefined} 
                    onChange={(e) => {
                      // Simple client-side filter if needed, but currently just a UI placeholder as list is static or derived
                    }}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border-transparent rounded-md focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="overflow-y-auto flex-1 p-2 space-y-1">
                {(viewMode === 'BY_COUNTRY' ? activeCountries : products).map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedItem(item)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between group ${
                      selectedItem === item
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{item}</span>
                    {selectedItem === item && <ArrowRight className="w-4 h-4" />}
                  </button>
                ))}
                
                {/* Empty State for list */}
                {((viewMode === 'BY_COUNTRY' && activeCountries.length === 0) || (viewMode === 'BY_SERIES' && products.length === 0)) && (
                  <div className="p-8 text-center text-slate-400 text-sm">
                    No data available yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="md:col-span-8 space-y-4">
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
              {viewMode === 'BY_COUNTRY' ? 'Sold Products' : 'Exported Markets'}
            </label>
            
            <div className="bg-slate-50 rounded-xl border border-slate-200 border-dashed h-[500px] p-6 overflow-y-auto">
              {!selectedItem ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <div className="w-16 h-16 bg-white rounded-full mb-4 flex items-center justify-center shadow-sm">
                    <Search className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="font-medium">Select a {viewMode === 'BY_COUNTRY' ? 'Country' : 'Series'} to view history</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900">
                      Results for <span className="text-primary">{selectedItem}</span>
                    </h3>
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600">
                      {uniqueResults.length} Found
                    </span>
                  </div>

                  {uniqueResults.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {uniqueResults.map((res) => (
                        <div key={res} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3 hover:border-primary/30 transition-colors">
                          <div className={`w-2 h-2 rounded-full ${viewMode === 'BY_COUNTRY' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                          <span className="font-medium text-slate-700">{res}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-slate-500">No sales recorded for this selection yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
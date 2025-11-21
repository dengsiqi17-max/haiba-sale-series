import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RecordSale } from './components/RecordSale';
import { DataExplorer } from './components/DataExplorer';
import { ProductManager } from './components/ProductManager';
import { AIInsights } from './components/AIInsights';
import { TabView, SaleRecord } from './types';
import { LayoutDashboard, FolderInput, Database, Sparkles } from 'lucide-react';

// Helper to load from localStorage
const loadStorage = <T,>(key: string, fallback: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
};

// Robust ID generator that works in all contexts
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>(TabView.RECORD);
  
  // State
  const [products, setProducts] = useState<string[]>(() => loadStorage('gst_products', []));
  
  // Initialize sales with data migration to ensure IDs and Customer Names exist
  const [sales, setSales] = useState<SaleRecord[]>(() => {
    const loaded = loadStorage<SaleRecord[]>('gst_sales', []);
    // Migration: Ensure all records have an ID and customerName
    return loaded.map(record => ({
      ...record,
      id: record.id || generateId(),
      customerName: record.customerName || 'Unknown'
    }));
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('gst_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('gst_sales', JSON.stringify(sales));
  }, [sales]);

  // Handlers
  const handleAddSale = (seriesName: string, country: string, customerName: string) => {
    const newSale: SaleRecord = {
      id: generateId(),
      seriesName,
      country,
      customerName,
      timestamp: Date.now(),
    };
    setSales(prev => [newSale, ...prev]);
  };

  const handleDeleteSale = (id: string) => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this record?')) {
      setSales(prev => prev.filter(record => record.id !== id));
    }
  };

  const handleImportProducts = (newProducts: string[]) => {
    setProducts(prev => {
      // Merge and deduplicate
      const unique = Array.from(new Set([...prev, ...newProducts])).sort();
      return unique;
    });
  };

  const handleClearProducts = () => {
    setProducts([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mobile-First Tab Navigation */}
        <div className="flex overflow-x-auto pb-4 mb-6 gap-2 md:justify-center scrollbar-hide">
          <button
            onClick={() => setActiveTab(TabView.RECORD)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === TabView.RECORD 
                ? 'bg-primary text-white shadow-md shadow-primary/25' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <FolderInput className="w-4 h-4" />
            Record Sale
          </button>
          <button
            onClick={() => setActiveTab(TabView.EXPLORE)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === TabView.EXPLORE 
                ? 'bg-primary text-white shadow-md shadow-primary/25' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Explore Data
          </button>
          <button
            onClick={() => setActiveTab(TabView.INSIGHTS)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === TabView.INSIGHTS 
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Insights
          </button>
          <button
            onClick={() => setActiveTab(TabView.MANAGE)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === TabView.MANAGE 
                ? 'bg-slate-800 text-white shadow-md shadow-slate-800/25' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Database className="w-4 h-4" />
            Manage Products
          </button>
        </div>

        {/* Content Area */}
        <div className="animate-fade-in">
          {activeTab === TabView.RECORD && (
            <RecordSale products={products} onAddSale={handleAddSale} />
          )}

          {activeTab === TabView.EXPLORE && (
            <DataExplorer 
              sales={sales} 
              products={products} 
              onDeleteSale={handleDeleteSale}
            />
          )}

          {activeTab === TabView.INSIGHTS && (
             <AIInsights sales={sales} products={products} />
          )}

          {activeTab === TabView.MANAGE && (
            <ProductManager 
              products={products} 
              onImport={handleImportProducts} 
              onClear={handleClearProducts}
            />
          )}
        </div>

      </main>
    </div>
  );
};

export default App;
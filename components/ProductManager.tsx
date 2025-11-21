import React, { useState } from 'react';
import { Upload, Save, Trash2 } from 'lucide-react';

interface ProductManagerProps {
  products: string[];
  onImport: (newProducts: string[]) => void;
  onClear: () => void;
}

export const ProductManager: React.FC<ProductManagerProps> = ({ products, onImport, onClear }) => {
  const [inputText, setInputText] = useState('');

  const handleImport = () => {
    if (!inputText.trim()) return;

    // Split by comma, newline, or pipe. Trim whitespace. Remove empty strings.
    const newSeries = inputText
      .split(/[\n,;|]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    onImport(newSeries);
    setInputText('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Import Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Upload className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Import Series</h2>
            </div>
            
            <p className="text-sm text-slate-500 mb-4">
              Paste your product series names here. Separated by commas, new lines, or pipes.
              <br/>
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-400">Example: HB851, HB900, XY-2020</span>
            </p>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-48 p-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-mono mb-4"
              placeholder="HB851&#10;HB852&#10;HB853..."
            />

            <button
              onClick={handleImport}
              disabled={!inputText.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Add to Database
            </button>
          </div>
        </div>

        {/* List Section */}
        <div className="space-y-6">
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-900">Current Products</h2>
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                  {products.length}
                </span>
              </div>
              {products.length > 0 && (
                <button 
                  onClick={() => {
                    if(confirm("Are you sure you want to delete all products? This cannot be undone.")) {
                        onClear();
                    }
                  }}
                  className="text-xs text-red-500 hover:text-red-700 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Clear All
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto max-h-[400px] pr-2">
              {products.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm text-center">
                  No products imported yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {products.map((p, idx) => (
                    <div key={`${p}-${idx}`} className="px-3 py-2 bg-slate-50 border border-slate-100 rounded text-sm text-slate-700 truncate">
                      {p}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
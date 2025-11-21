import React, { useState } from 'react';
import { Sparkles, Loader2, FileText } from 'lucide-react';
import { SaleRecord } from '../types';
import { generateSalesAnalysis } from '../services/geminiService';
import ReactMarkdown from 'react-markdown'; // Note: Since I can't install packages, I'll just render text safely.

interface AIInsightsProps {
  sales: SaleRecord[];
  products: string[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ sales, products }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    const result = await generateSalesAnalysis(sales, products);
    setAnalysis(result);
    setIsLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          AI Strategic Advisor
        </h2>
        <p className="text-slate-500 mt-2">
          Use Gemini AI to analyze your global footprint and identify market opportunities.
        </p>
      </div>

      {!analysis && !isLoading && (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-purple-500" />
          </div>
          <button
            onClick={handleGenerate}
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-8 rounded-full shadow-lg shadow-slate-900/20 transition-all active:scale-95"
          >
            Generate Market Report
          </button>
          <p className="text-xs text-slate-400 mt-4">
            Powered by Google Gemini 2.5 Flash
          </p>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
          <p className="text-slate-600 font-medium">Analyzing global sales data...</p>
          <p className="text-slate-400 text-sm mt-1">This may take a few seconds</p>
        </div>
      )}

      {analysis && !isLoading && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span className="font-semibold">Market Analysis Report</span>
            </div>
            <button 
              onClick={() => setAnalysis(null)}
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
            >
              Reset
            </button>
          </div>
          <div className="p-8 prose prose-slate max-w-none">
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
              {analysis}
            </div>
          </div>
          <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-xs text-slate-400 text-center">
            AI-generated insights should be verified against actual business metrics.
          </div>
        </div>
      )}
    </div>
  );
};
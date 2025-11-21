import { GoogleGenAI } from "@google/genai";
import { SaleRecord } from "../types";

const apiKey = process.env.API_KEY || '';

export const generateSalesAnalysis = async (sales: SaleRecord[], products: string[]): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure the environment to use AI insights.";
  }

  // Guard clause for empty data
  if (sales.length === 0) {
    return "No sales data available yet. Please record some sales to generate insights.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Prepare a summarized view of data for the model to save tokens
  const dataSummary = {
    totalProducts: products.length,
    totalSalesRecorded: sales.length,
    // Simplify recent sales to save context window
    recentSales: sales.slice(-10).map(s => `${s.seriesName} -> ${s.country} (${s.customerName})`),
    
    countryDistribution: sales.reduce((acc, curr) => {
      acc[curr.country] = (acc[curr.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),

    customerActivity: sales.reduce((acc, curr) => {
      acc[curr.customerName] = (acc[curr.customerName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  const prompt = `
    You are a senior business intelligence analyst. 
    Analyze the following JSON summary of product sales data.
    
    Data: ${JSON.stringify(dataSummary)}

    Please provide:
    1. A brief executive summary of the sales distribution.
    2. Identification of the top-performing market and top customers.
    3. A strategic recommendation for expansion or focus based on the limited data.
    
    Keep the tone professional, encouraging, and concise (under 200 words).
    Format as plain text with clear paragraphs.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return "An error occurred while communicating with the AI service. Please try again later.";
  }
};
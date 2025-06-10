
import React, { useState, useEffect } from 'react';
import StockSearch from './StockSearch';
import StockChart from './StockChart';
import PredictionSettings from './PredictionSettings';
import StockDetails from './StockDetails';
import TrendAnalysis from './TrendAnalysis';
import { getStockDetail } from '@/lib/stockData';
import { predictStockPrices, PredictionResult, predictIntradayPrices } from '@/lib/mockPredictionModel';
import { useToast } from "@/hooks/use-toast";

const Dashboard: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState<string>('RELIANCE');
  const [stockData, setStockData] = useState<any>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [intradayData, setIntradayData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const { toast } = useToast();
  
  useEffect(() => {
    if (selectedStock) {
      loadStockData(selectedStock);
    }
  }, [selectedStock]);
  
  const loadStockData = (symbol: string) => {
    setIsLoading(true);
    
    // In a real application, this would be an API call to our Flask/Django backend
    setTimeout(() => {
      const data = getStockDetail(symbol);
      setStockData(data);
      
      if (data) {
        // Generate default prediction (30 days)
        generatePrediction(30, 2025);
        
        // Generate intraday prediction
        const intradayPrediction = predictIntradayPrices(data.currentPrice, 5);
        setIntradayData(intradayPrediction);
      }
      
      setIsLoading(false);
    }, 800); // Simulating API delay
  };
  
  const generatePrediction = (days: number, targetYear: number) => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (stockData) {
        const result = predictStockPrices(stockData.historicalData, days);
        setPrediction(result);
        
        toast({
          title: "Prediction Generated",
          description: `${stockData.symbol} prediction for ${days} days has been generated.`,
        });
      }
      
      setIsLoading(false);
    }, 1200); // Simulating ML prediction delay
  };
  
  const handleSelectStock = (symbol: string) => {
    setSelectedStock(symbol);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <StockSearch
          onSelectStock={handleSelectStock}
          selectedStock={selectedStock}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse-light text-lg">Loading stock data and predictions...</div>
        </div>
      ) : stockData ? (
        <div>
          <StockDetails stock={stockData} />
          
          <div className="mb-6">
            <StockChart 
              historicalData={stockData.historicalData} 
              prediction={prediction || undefined}
              intradayData={intradayData || undefined}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <PredictionSettings onGeneratePrediction={generatePrediction} />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              {prediction && (
                <TrendAnalysis 
                  analysis={prediction.trendAnalysis} 
                  rmse={prediction.rmse}
                  confidence={prediction.confidence}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <h3 className="text-xl">Select a stock to see predictions</h3>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

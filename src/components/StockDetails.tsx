
import React from 'react';
import { StockData } from '@/lib/stockData';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

interface StockDetailsProps {
  stock: StockData;
}

const StockDetails: React.FC<StockDetailsProps> = ({ stock }) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    });
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000000) {
      return `${(marketCap / 1000000000000).toFixed(2)} T`;
    } else if (marketCap >= 1000000000) {
      return `${(marketCap / 1000000000).toFixed(2)} B`;
    } else if (marketCap >= 1000000) {
      return `${(marketCap / 1000000).toFixed(2)} M`;
    }
    return marketCap.toLocaleString();
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start mb-2">
        <div>
          <h2 className="text-2xl font-bold">{stock.name} ({stock.symbol})</h2>
          <p className="text-muted-foreground">{stock.sector}</p>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="text-3xl font-bold">{formatPrice(stock.currentPrice)}</div>
          <div className={`flex items-center ${stock.change >= 0 ? 'text-profit' : 'text-loss'}`}>
            {stock.change >= 0 ? (
              <ArrowUp className="mr-1 h-4 w-4" />
            ) : (
              <ArrowDown className="mr-1 h-4 w-4" />
            )}
            <span>{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Market Cap</p>
            <p className="text-lg font-medium">{formatMarketCap(stock.marketCap)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Day Range</p>
            <p className="text-lg font-medium">
              {formatPrice(stock.historicalData[stock.historicalData.length - 1].low)} - {formatPrice(stock.historicalData[stock.historicalData.length - 1].high)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">52 Week Range</p>
            <p className="text-lg font-medium">
              {formatPrice(Math.min(...stock.historicalData.map(d => d.low)))} - {formatPrice(Math.max(...stock.historicalData.map(d => d.high)))}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Volume</p>
            <p className="text-lg font-medium">{stock.historicalData[stock.historicalData.length - 1].volume.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StockDetails;

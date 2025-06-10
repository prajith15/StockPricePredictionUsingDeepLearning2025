
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { stockSymbols } from '@/lib/stockData';
import { Search } from "lucide-react";

interface StockSearchProps {
  onSelectStock: (symbol: string) => void;
  selectedStock?: string;
}

const StockSearch: React.FC<StockSearchProps> = ({ onSelectStock, selectedStock }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStocks, setFilteredStocks] = useState(stockSymbols);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      const filtered = stockSymbols.filter(stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStocks(filtered);
    } else {
      setFilteredStocks(stockSymbols);
    }
  }, [searchQuery]);

  const handleSelect = (symbol: string) => {
    onSelectStock(symbol);
    setIsDropdownOpen(false);
    
    // Find the stock name to display in the input
    const stock = stockSymbols.find(s => s.symbol === symbol);
    if (stock) {
      setSearchQuery(`${stock.symbol} - ${stock.name}`);
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for a stock..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          className="pr-10 bg-muted border-muted text-foreground"
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-0 top-0 h-full"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      {isDropdownOpen && filteredStocks.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-card border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredStocks.map((stock) => (
            <div
              key={stock.symbol}
              className={`p-3 cursor-pointer hover:bg-muted flex justify-between items-center ${
                selectedStock === stock.symbol ? 'bg-muted' : ''
              }`}
              onClick={() => handleSelect(stock.symbol)}
            >
              <div>
                <div className="font-medium">{stock.symbol}</div>
                <div className="text-sm text-muted-foreground">{stock.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockSearch;

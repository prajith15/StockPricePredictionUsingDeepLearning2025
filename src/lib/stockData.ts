
// Mock stock data and utilities to simulate our backend
// In a real application, this would be replaced with API calls to our Flask/Django backend

export interface StockData {
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  marketCap: number;
  historicalData: HistoricalDataPoint[];
}

export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Mock stock symbols for top Indian companies
export const stockSymbols = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd." },
  { symbol: "TCS", name: "Tata Consultancy Services Ltd." },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd." },
  { symbol: "INFY", name: "Infosys Ltd." },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever Ltd." },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd." },
  { symbol: "SBIN", name: "State Bank of India" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd." },
  { symbol: "ITC", name: "ITC Ltd." },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank Ltd." },
  { symbol: "WIPRO", name: "Wipro Ltd." },
  { symbol: "AXISBANK", name: "Axis Bank Ltd." },
  { symbol: "ASIANPAINT", name: "Asian Paints Ltd." },
  { symbol: "MARUTI", name: "Maruti Suzuki India Ltd." },
  { symbol: "HCLTECH", name: "HCL Technologies Ltd." }
];

// Helper function to generate random historical data
function generateHistoricalData(basePrice: number, daysBack: number = 300): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = [];
  const today = new Date();
  
  let price = basePrice;
  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Random daily volatility between -3% and +3%
    const dailyChange = price * (Math.random() * 0.06 - 0.03);
    
    // Add some trend over time (upward bias)
    const trendFactor = 1 + (Math.random() * 0.001);
    
    price += dailyChange;
    price *= trendFactor;
    
    const high = price * (1 + Math.random() * 0.02);
    const low = price * (1 - Math.random() * 0.02);
    const open = low + Math.random() * (high - low);
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000
    });
  }
  
  return data;
}

// Generate mock data for each stock
export function getStockData(): StockData[] {
  return stockSymbols.map(stock => {
    const basePrice = Math.random() * 2000 + 200; // Random base price between 200 and 2200
    const historicalData = generateHistoricalData(basePrice);
    const latestPrice = historicalData[historicalData.length - 1].close;
    const previousPrice = historicalData[historicalData.length - 2].close;
    const change = latestPrice - previousPrice;
    const changePercent = (change / previousPrice) * 100;
    
    return {
      symbol: stock.symbol,
      name: stock.name,
      sector: ['Technology', 'Banking', 'Oil & Gas', 'Consumer Goods', 'Telecom'][Math.floor(Math.random() * 5)],
      currentPrice: latestPrice,
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      marketCap: parseFloat((latestPrice * (Math.random() * 500000000 + 100000000)).toFixed(2)),
      historicalData
    };
  });
}

// Function to get detailed data for a specific stock
export function getStockDetail(symbol: string): StockData | undefined {
  const allStocks = getStockData();
  return allStocks.find(stock => stock.symbol === symbol);
}

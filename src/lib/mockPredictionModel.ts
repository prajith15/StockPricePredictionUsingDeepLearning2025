
import { HistoricalDataPoint } from "./stockData";

export interface PredictionResult {
  dates: string[];
  predictedPrices: number[];
  confidence: number;
  rmse: number;
  trendAnalysis: TrendAnalysis;
}

export interface TrendAnalysis {
  trend: 'bullish' | 'bearish' | 'neutral';
  strength: number; // 0-100
  support: number;
  resistance: number;
  summary: string;
}

// Mock function to generate future dates
function generateFutureDates(startDate: Date, days: number): string[] {
  const dates: string[] = [];
  
  for (let i = 1; i <= days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) {
      days++;
      continue;
    }
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

// Mock prediction function that would normally use LSTM or another ML model
export function predictStockPrices(
  historicalData: HistoricalDataPoint[],
  daysToPredict: number = 30
): PredictionResult {
  // In a real app, this would call the Python backend with the LSTM model
  
  // Get the last few prices to base our prediction on
  const lastPrice = historicalData[historicalData.length - 1].close;
  const recentPrices = historicalData.slice(-30).map(d => d.close);
  
  // Calculate a simple trend based on recent performance
  const firstRecent = recentPrices[0];
  const lastRecent = recentPrices[recentPrices.length - 1];
  const overallTrend = lastRecent > firstRecent;
  const trendStrength = Math.abs((lastRecent - firstRecent) / firstRecent) * 100;
  
  // Generate predictions with some randomness but following the trend
  const predictedPrices: number[] = [];
  let currentPrice = lastPrice;
  
  const volatility = calculateVolatility(historicalData);
  const trend = overallTrend ? 0.001 : -0.001; // Small daily trend
  
  for (let i = 0; i < daysToPredict; i++) {
    // Add some random walk with the trend direction
    const dailyChange = currentPrice * (Math.random() * volatility * 2 - volatility + trend);
    currentPrice += dailyChange;
    predictedPrices.push(parseFloat(currentPrice.toFixed(2)));
  }
  
  // Generate future dates starting from the last historical date
  const lastDate = new Date(historicalData[historicalData.length - 1].date);
  const futureDates = generateFutureDates(lastDate, daysToPredict);
  
  // Mock RMSE (would be calculated based on validation in a real model)
  const rmse = parseFloat((Math.random() * 20 + 10).toFixed(2));
  
  // Mock confidence level
  const confidence = parseFloat((Math.random() * 20 + 70).toFixed(2));
  
  // Generate trend analysis
  const trendType: 'bullish' | 'bearish' | 'neutral' = 
    trendStrength > 5 ? (overallTrend ? 'bullish' : 'bearish') : 'neutral';
  
  const minPrice = Math.min(...recentPrices);
  const maxPrice = Math.max(...recentPrices);
  const support = parseFloat((minPrice * 0.95).toFixed(2));
  const resistance = parseFloat((maxPrice * 1.05).toFixed(2));
  
  const trendSummaries = {
    bullish: `The model predicts an upward trend with a ${confidence}% confidence level. Strong buying momentum with potential resistance at ${resistance}.`,
    bearish: `The model predicts a downward trend with a ${confidence}% confidence level. Consider support levels at ${support}.`,
    neutral: `The model predicts sideways movement with a ${confidence}% confidence level. The stock is likely to consolidate between ${support} and ${resistance}.`
  };
  
  return {
    dates: futureDates,
    predictedPrices,
    confidence,
    rmse,
    trendAnalysis: {
      trend: trendType,
      strength: parseFloat(trendStrength.toFixed(2)),
      support,
      resistance,
      summary: trendSummaries[trendType]
    }
  };
}

// Helper function to calculate volatility from historical data
function calculateVolatility(data: HistoricalDataPoint[]): number {
  const returns: number[] = [];
  
  for (let i = 1; i < data.length; i++) {
    const dailyReturn = (data[i].close - data[i-1].close) / data[i-1].close;
    returns.push(dailyReturn);
  }
  
  // Calculate standard deviation of returns (volatility)
  const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
  const squaredDiffs = returns.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / returns.length;
  
  return Math.sqrt(variance);
}

// Function to generate intraday prediction data (5 sec to 5 min)
export function predictIntradayPrices(
  currentPrice: number,
  minutes: number = 5
): { time: string; price: number; }[] {
  const intradayData = [];
  const now = new Date();
  const volatility = 0.0005; // Lower volatility for intraday movements
  
  let price = currentPrice;
  const secondsToPredict = minutes * 60;
  
  for (let i = 5; i <= secondsToPredict; i += 5) {
    const change = price * (Math.random() * volatility * 2 - volatility);
    price += change;
    
    const time = new Date(now);
    time.setSeconds(now.getSeconds() + i);
    
    intradayData.push({
      time: time.toLocaleTimeString(),
      price: parseFloat(price.toFixed(2))
    });
  }
  
  return intradayData;
}

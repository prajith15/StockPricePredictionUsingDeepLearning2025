
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer, 
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoricalDataPoint } from '@/lib/stockData';
import { PredictionResult } from '@/lib/mockPredictionModel';

interface StockChartProps {
  historicalData: HistoricalDataPoint[];
  prediction?: PredictionResult;
  intradayData?: Array<{ time: string; price: number }>;
}

const StockChart: React.FC<StockChartProps> = ({ 
  historicalData, 
  prediction,
  intradayData
}) => {
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y' | 'All'>('3M');
  const [chartType, setChartType] = useState<'historical' | 'intraday'>('historical');
  
  // Function to filter data based on selected time range
  const getFilteredData = () => {
    const now = new Date();
    let daysToSubtract: number;
    
    switch (timeRange) {
      case '1M': 
        daysToSubtract = 30;
        break;
      case '3M': 
        daysToSubtract = 90;
        break;
      case '6M': 
        daysToSubtract = 180;
        break;
      case '1Y': 
        daysToSubtract = 365;
        break;
      default: 
        return historicalData;
    }
    
    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - daysToSubtract);
    
    return historicalData.filter(dataPoint => {
      const dataDate = new Date(dataPoint.date);
      return dataDate >= cutoffDate;
    });
  };

  const filteredData = getFilteredData();
  
  // Combine historical and prediction data for the chart
  const combinedChartData = prediction ? [
    ...filteredData.map(item => ({ 
      date: item.date, 
      actual: item.close, 
      predicted: null 
    })),
    ...prediction.dates.map((date, index) => ({ 
      date, 
      actual: null, 
      predicted: prediction.predictedPrices[index]
    }))
  ] : filteredData.map(item => ({ 
    date: item.date, 
    actual: item.close 
  }));

  // Format the tooltip to display price values
  const formatTooltip = (value: number) => {
    return value ? value.toFixed(2) : '';
  };

  // Function to format dates on the x-axis
  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Calculate min and max for y-axis
  const calcDomain = () => {
    const allPrices = [
      ...filteredData.map(d => d.close),
      ...(prediction ? prediction.predictedPrices : [])
    ];
    
    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);
    const buffer = (max - min) * 0.1;
    
    return [min - buffer, max + buffer];
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-md w-full h-96 stock-chart">
      <Tabs defaultValue="historical" onValueChange={(value) => setChartType(value as 'historical' | 'intraday')}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="historical">Historical & Prediction</TabsTrigger>
            {intradayData && <TabsTrigger value="intraday">Intraday (5 min)</TabsTrigger>}
          </TabsList>
          
          <div className="flex space-x-2">
            <button
              className={`px-2 py-1 text-xs rounded ${timeRange === '1M' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              onClick={() => setTimeRange('1M')}
            >
              1M
            </button>
            <button
              className={`px-2 py-1 text-xs rounded ${timeRange === '3M' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              onClick={() => setTimeRange('3M')}
            >
              3M
            </button>
            <button
              className={`px-2 py-1 text-xs rounded ${timeRange === '6M' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              onClick={() => setTimeRange('6M')}
            >
              6M
            </button>
            <button
              className={`px-2 py-1 text-xs rounded ${timeRange === '1Y' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              onClick={() => setTimeRange('1Y')}
            >
              1Y
            </button>
            <button
              className={`px-2 py-1 text-xs rounded ${timeRange === 'All' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              onClick={() => setTimeRange('All')}
            >
              All
            </button>
          </div>
        </div>
        
        <TabsContent value="historical" className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis}
                stroke="#666" 
              />
              <YAxis 
                domain={calcDomain()}
                tickFormatter={(tick) => tick.toFixed(0)}
                stroke="#666" 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#222', border: 'none', borderRadius: '4px' }}
                formatter={formatTooltip}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#1EAEDB" 
                strokeWidth={2}
                dot={false} 
                name="Historical"
              />
              {prediction && (
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false} 
                  name="Predicted"
                />
              )}
              
              {/* Add reference line for today */}
              {prediction && (
                <ReferenceLine 
                  x={filteredData[filteredData.length - 1].date} 
                  stroke="#666" 
                  strokeDasharray="3 3" 
                  label={{ value: "Today", position: "insideTopRight", fill: "#666" }} 
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
        
        {intradayData && (
          <TabsContent value="intraday" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={intradayData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1EAEDB" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1EAEDB" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                <XAxis 
                  dataKey="time"
                  stroke="#666" 
                  interval={Math.floor(intradayData.length / 5)}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tickFormatter={(tick) => tick.toFixed(2)}
                  stroke="#666" 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#222', border: 'none', borderRadius: '4px' }}
                  formatter={(value) => [`${parseFloat(value.toString()).toFixed(2)}`, 'Price']}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#1EAEDB" 
                  fillOpacity={1}
                  fill="url(#colorPrice)" 
                  name="Price"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default StockChart;

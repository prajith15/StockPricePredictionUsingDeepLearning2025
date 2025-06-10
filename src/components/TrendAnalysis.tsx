
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendAnalysis as TrendAnalysisType } from '@/lib/mockPredictionModel';
import { ArrowUp, ArrowDown, ArrowRight } from "lucide-react";

interface TrendAnalysisProps {
  analysis: TrendAnalysisType;
  rmse: number;
  confidence: number;
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ analysis, rmse, confidence }) => {
  const getTrendIcon = () => {
    switch (analysis.trend) {
      case 'bullish':
        return <ArrowUp className="h-5 w-5 text-profit" />;
      case 'bearish':
        return <ArrowDown className="h-5 w-5 text-loss" />;
      default:
        return <ArrowRight className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (analysis.trend) {
      case 'bullish':
        return 'text-profit';
      case 'bearish':
        return 'text-loss';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>AI Trend Analysis</span>
          <div className="flex items-center">
            {getTrendIcon()}
            <span className={`ml-1 capitalize ${getTrendColor()}`}>
              {analysis.trend}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="mb-1 text-sm font-medium">Trend Strength</p>
            <div className="flex items-center">
              <Progress value={analysis.strength} className="mr-2 h-2" />
              <span className="text-sm">{analysis.strength}%</span>
            </div>
          </div>

          <div>
            <p className="mb-1 text-sm font-medium">Model Confidence</p>
            <div className="flex items-center">
              <Progress value={confidence} className="mr-2 h-2" />
              <span className="text-sm">{confidence}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Support Level</p>
              <p className="font-medium">{analysis.support.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resistance Level</p>
              <p className="font-medium">{analysis.resistance.toFixed(2)}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Model RMSE</p>
            <p className="font-medium">{rmse}</p>
          </div>
          
          <div className="mt-2 p-3 bg-muted rounded-md">
            <p className="text-sm">{analysis.summary}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendAnalysis;

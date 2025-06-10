
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PredictionSettingsProps {
  onGeneratePrediction: (days: number, year: number) => void;
}

const PredictionSettings: React.FC<PredictionSettingsProps> = ({ onGeneratePrediction }) => {
  const [predictionDays, setPredictionDays] = useState<number>(30);
  const [predictionYear, setPredictionYear] = useState<number>(2025);
  const currentYear = new Date().getFullYear();
  
  const years = Array.from({ length: 6 }, (_, i) => currentYear + i);

  const handleGeneratePrediction = () => {
    onGeneratePrediction(predictionDays, predictionYear);
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-medium mb-4">Prediction Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="predictionDays">Prediction Duration</Label>
          <Select 
            value={predictionDays.toString()} 
            onValueChange={(value) => setPredictionDays(parseInt(value))}
          >
            <SelectTrigger id="predictionDays">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">1 Week</SelectItem>
              <SelectItem value="30">1 Month</SelectItem>
              <SelectItem value="90">3 Months</SelectItem>
              <SelectItem value="180">6 Months</SelectItem>
              <SelectItem value="365">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="predictionYear">Target Year</Label>
          <Select 
            value={predictionYear.toString()} 
            onValueChange={(value) => setPredictionYear(parseInt(value))}
          >
            <SelectTrigger id="predictionYear">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button 
        className="w-full mt-4"
        onClick={handleGeneratePrediction}
      >
        Generate Prediction
      </Button>
    </div>
  );
};

export default PredictionSettings;

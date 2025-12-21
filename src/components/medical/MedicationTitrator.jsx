import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, Play, Pause } from 'lucide-react';

export default function MedicationTitrator({ drug, concentration, currentRate, onRateChange, patientWeight = 70 }) {
  const [isRunning, setIsRunning] = useState(true);
  const [rate, setRate] = useState(currentRate || 0);

  // List of vasopressors and inotropes that should use mcg/kg/min
  const vasopressorInotropeList = [
    'norepinephrine', 'levophed', 'epinephrine', 'adrenaline', 'dopamine', 
    'dobutamine', 'phenylephrine', 'neosynephrine', 'vasopressin', 'milrinone'
  ];
  
  const isVasopressorInotrope = vasopressorInotropeList.some(name => 
    drug.toLowerCase().includes(name)
  );

  const adjustRate = (delta) => {
    const newRate = Math.max(0, Math.min(isVasopressorInotrope ? 50 : 20, rate + delta));
    setRate(newRate);
    onRateChange(newRate);
  };

  const handleSliderChange = (value) => {
    setRate(value[0]);
    onRateChange(value[0]);
  };

  const toggleRunning = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      onRateChange(rate);
    } else {
      onRateChange(0);
    }
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-bold text-indigo-900">{drug}</div>
          <div className="text-xs text-indigo-600">{concentration}</div>
        </div>
        <Badge variant={isRunning ? "default" : "outline"} className={isRunning ? "bg-green-600" : ""}>
          {isRunning ? "Running" : "Stopped"}
        </Badge>
      </div>

      <div className="space-y-4">
        {/* Quick adjust buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => adjustRate(-1)}
            className="flex-1"
          >
            <ChevronDown className="w-4 h-4 mr-1" />
            -1
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => adjustRate(-0.1)}
            className="flex-1"
          >
            -0.1
          </Button>
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-indigo-700">
              {rate.toFixed(2)}
            </div>
            <div className="text-xs text-indigo-600">
              {isVasopressorInotrope ? 'mcg/kg/min' : 'ml/hr'}
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => adjustRate(0.1)}
            className="flex-1"
          >
            +0.1
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => adjustRate(1)}
            className="flex-1"
          >
            <ChevronUp className="w-4 h-4 mr-1" />
            +1
          </Button>
        </div>

        {/* Slider for fine control */}
        <div className="space-y-2">
          <Label className="text-xs">Titrate Rate</Label>
          <Slider
            value={[rate]}
            onValueChange={handleSliderChange}
            min={0}
            max={isVasopressorInotrope ? 50 : 20}
            step={isVasopressorInotrope ? 0.01 : 0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>0</span>
            <span>{isVasopressorInotrope ? '50 mcg/kg/min' : '20 ml/hr'}</span>
          </div>
        </div>

        {/* Start/Stop */}
        <Button
          onClick={toggleRunning}
          className={`w-full ${isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Stop Infusion
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Infusion
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
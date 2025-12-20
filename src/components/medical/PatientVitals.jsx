import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, Heart, Wind, Droplet, Thermometer, Brain, TrendingUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AdvancedStatsDialog from './AdvancedStatsDialog';

export default function PatientVitals({ vitals: initialVitals, scenario }) {
  const [vitals, setVitals] = useState(initialVitals);
  const [advancedStatsOpen, setAdvancedStatsOpen] = useState(false);

  // Update vitals when initialVitals change
  useEffect(() => {
    setVitals(initialVitals);
  }, [initialVitals]);

  // Dynamic vitals - subtle changes every second
  useEffect(() => {
    const interval = setInterval(() => {
      setVitals(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          heart_rate: Math.max(0, prev.heart_rate + Math.floor(Math.random() * 5 - 2)),
          blood_pressure_systolic: Math.max(0, prev.blood_pressure_systolic + Math.floor(Math.random() * 4 - 2)),
          blood_pressure_diastolic: Math.max(0, prev.blood_pressure_diastolic + Math.floor(Math.random() * 3 - 1)),
          spo2: Math.max(0, Math.min(100, prev.spo2 + Math.floor(Math.random() * 3 - 1))),
          respiratory_rate: Math.max(0, prev.respiratory_rate + Math.floor(Math.random() * 3 - 1)),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const getStatusColor = (vital, value) => {
    switch (vital) {
      case 'heart_rate':
        if (value < 60) return 'bg-blue-500';
        if (value > 100) return 'bg-red-500';
        return 'bg-green-500';
      case 'spo2':
        if (value < 90) return 'bg-red-500';
        if (value < 95) return 'bg-yellow-500';
        return 'bg-green-500';
      case 'respiratory_rate':
        if (value < 12 || value > 20) return 'bg-yellow-500';
        return 'bg-green-500';
      default:
        return 'bg-green-500';
    }
  };

  const vitalDisplays = [
    {
      label: 'Heart Rate',
      value: vitals?.heart_rate || '--',
      unit: 'bpm',
      icon: Heart,
      color: getStatusColor('heart_rate', vitals?.heart_rate)
    },
    {
      label: 'Blood Pressure',
      value: vitals?.blood_pressure_systolic && vitals?.blood_pressure_diastolic
        ? `${vitals.blood_pressure_systolic}/${vitals.blood_pressure_diastolic}`
        : '--/--',
      unit: 'mmHg',
      icon: Activity,
      color: 'bg-purple-500'
    },
    {
      label: 'SpO₂',
      value: vitals?.spo2 || '--',
      unit: '%',
      icon: Droplet,
      color: getStatusColor('spo2', vitals?.spo2)
    },
    {
      label: 'Resp Rate',
      value: vitals?.respiratory_rate || '--',
      unit: '/min',
      icon: Wind,
      color: getStatusColor('respiratory_rate', vitals?.respiratory_rate)
    },
    {
      label: 'Temperature',
      value: vitals?.temperature || '--',
      unit: '°C',
      icon: Thermometer,
      color: 'bg-orange-500'
    }
  ];

  return (
    <>
      <Card className="shadow-lg">
      <CardHeader className="pb-3 bg-gradient-to-r from-red-50 to-pink-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-600" />
              Patient Vitals
            </CardTitle>
            {vitals?.consciousness && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Brain className="w-3 h-3" />
                {vitals.consciousness}
              </Badge>
            )}
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setAdvancedStatsOpen(true)}
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Advanced Stats
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {vitalDisplays.map((vital, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border-2 border-slate-200 p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded ${vital.color} bg-opacity-20`}>
                  <vital.icon className={`w-4 h-4 ${vital.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="text-xs font-medium text-slate-600 leading-tight">
                  {vital.label}
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <div className="text-2xl font-bold text-slate-800">
                  {vital.value}
                </div>
                <div className="text-xs text-slate-500">
                  {vital.unit}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

      <AdvancedStatsDialog 
        open={advancedStatsOpen}
        onClose={() => setAdvancedStatsOpen(false)}
        vitals={vitals}
        scenario={scenario}
      />
    </>
  );
}
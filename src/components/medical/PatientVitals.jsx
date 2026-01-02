import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, Heart, Wind, Droplet, Thermometer, Brain, TrendingUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdvancedStatsDialog from './AdvancedStatsDialog';
import EKGMonitor from './EKGMonitor';

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

  // Calculate advanced hemodynamic metrics
  const calculateMAP = () => {
    if (!vitals?.blood_pressure_systolic || !vitals?.blood_pressure_diastolic) return null;
    return Math.round((2 * vitals.blood_pressure_diastolic + vitals.blood_pressure_systolic) / 3);
  };

  const getCVP = () => {
    const equipment = scenario?.equipment || [];
    const swanGanz = equipment.find(eq => eq.type === 'swan_ganz');
    if (swanGanz?.settings?.cvp) return parseInt(swanGanz.settings.cvp);
    // Estimate based on clinical status (placeholder logic)
    if (vitals?.blood_pressure_systolic < 90) return Math.floor(2 + Math.random() * 3); // Low BP = low CVP
    return Math.floor(6 + Math.random() * 6); // Normal range 6-12
  };

  const getCardiacOutput = () => {
    const equipment = scenario?.equipment || [];
    const swanGanz = equipment.find(eq => eq.type === 'swan_ganz');
    const picco = equipment.find(eq => eq.type === 'picco');
    const lidco = equipment.find(eq => eq.type === 'lidco');
    
    if (swanGanz?.settings?.cardiac_output) return parseFloat(swanGanz.settings.cardiac_output);
    if (picco?.settings?.calibration === 'Calibrated') return (4.5 + Math.random() * 2).toFixed(1);
    if (lidco?.settings?.enabled === 'true') return (4.0 + Math.random() * 2.5).toFixed(1);
    
    // Estimate: CO ≈ HR × SV, typical SV ≈ 70ml, CO ≈ 4-8 L/min
    if (vitals?.heart_rate) {
      const estimatedSV = 60 + Math.random() * 20;
      return ((vitals.heart_rate * estimatedSV) / 1000).toFixed(1);
    }
    return null;
  };

  const getStrokeVolume = () => {
    const equipment = scenario?.equipment || [];
    const swanGanz = equipment.find(eq => eq.type === 'swan_ganz');
    const picco = equipment.find(eq => eq.type === 'picco');
    
    if (swanGanz?.settings?.stroke_volume) return parseInt(swanGanz.settings.stroke_volume);
    if (picco?.settings?.calibration === 'Calibrated') return Math.floor(60 + Math.random() * 30);
    
    // Calculate from CO if available
    const co = getCardiacOutput();
    if (co && vitals?.heart_rate) {
      return Math.floor((parseFloat(co) * 1000) / vitals.heart_rate);
    }
    
    return Math.floor(60 + Math.random() * 30); // Normal 60-100 ml
  };

  const MAP = calculateMAP();
  const CVP = getCVP();
  const CO = getCardiacOutput();
  const SV = getStrokeVolume();

  const vitalDisplays = [
    {
      label: 'Heart Rate',
      value: vitals?.heart_rate ? Math.round(vitals.heart_rate) : '--',
      unit: 'bpm',
      icon: Heart,
      color: getStatusColor('heart_rate', vitals?.heart_rate)
    },
    {
      label: 'Blood Pressure',
      value: vitals?.blood_pressure_systolic && vitals?.blood_pressure_diastolic
        ? `${Math.round(vitals.blood_pressure_systolic)}/${Math.round(vitals.blood_pressure_diastolic)}`
        : '--/--',
      unit: 'mmHg',
      icon: Activity,
      color: 'bg-purple-500'
    },
    {
      label: 'SpO₂',
      value: vitals?.spo2 ? Math.round(vitals.spo2) : '--',
      unit: '%',
      icon: Droplet,
      color: getStatusColor('spo2', vitals?.spo2)
    },
    {
      label: 'Resp Rate',
      value: vitals?.respiratory_rate ? Math.round(vitals.respiratory_rate) : '--',
      unit: '/min',
      icon: Wind,
      color: getStatusColor('respiratory_rate', vitals?.respiratory_rate)
    },
    {
      label: 'Temperature',
      value: vitals?.temperature ? Math.round(vitals.temperature) : '--',
      unit: '°C',
      icon: Thermometer,
      color: 'bg-orange-500'
    }
  ];

  const advancedMetrics = [
    {
      label: 'MAP',
      value: MAP || '--',
      unit: 'mmHg',
      tooltip: 'Mean Arterial Pressure',
      normal: '70-100',
      calculated: true
    },
    {
      label: 'CVP',
      value: CVP || '--',
      unit: 'mmHg',
      tooltip: 'Central Venous Pressure',
      normal: '2-8',
      equipment: 'Swan-Ganz'
    },
    {
      label: 'CO',
      value: CO || '--',
      unit: 'L/min',
      tooltip: 'Cardiac Output',
      normal: '4-8',
      equipment: 'Swan-Ganz/PiCCO/LiDCO'
    },
    {
      label: 'SV',
      value: SV || '--',
      unit: 'ml',
      tooltip: 'Stroke Volume',
      normal: '60-100',
      equipment: 'Swan-Ganz/PiCCO'
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
        <Tabs defaultValue="vitals" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
            <TabsTrigger value="hemodynamics">Hemodynamics</TabsTrigger>
            <TabsTrigger value="ekg">EKG Monitor</TabsTrigger>
          </TabsList>
          <TabsContent value="vitals">
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
          </TabsContent>
          <TabsContent value="hemodynamics">
            <div className="space-y-3">
              <div className="text-sm text-slate-600 mb-3">
                Advanced hemodynamic parameters calculated from vitals and monitoring equipment
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {advancedMetrics.map((metric, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200 p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-semibold text-blue-900" title={metric.tooltip}>
                        {metric.label}
                      </div>
                      {metric.calculated && (
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                          Calc
                        </Badge>
                      )}
                      {metric.equipment && !metric.calculated && (
                        <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 border-purple-300">
                          Eq
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <div className="text-2xl font-bold text-blue-900">
                        {metric.value}
                      </div>
                      <div className="text-xs text-blue-600">
                        {metric.unit}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">
                      Normal: {metric.normal}
                    </div>
                    {metric.equipment && (
                      <div className="text-xs text-purple-600 mt-1 italic">
                        {metric.equipment}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                <div className="text-xs text-yellow-800">
                  <strong>Note:</strong> CVP, CO, and SV values are estimated. For accurate measurements, use Swan-Ganz catheter, PiCCO, or LiDCO monitoring equipment.
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="ekg">
            <EKGMonitor vitals={vitals} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>

      <AdvancedStatsDialog 
        open={advancedStatsOpen}
        onClose={() => setAdvancedStatsOpen(false)}
        vitals={vitals}
        scenario={scenario}
        equipment={scenario?.equipment || []}
        patientHistory={scenario?.patient_history}
      />
    </>
  );
}
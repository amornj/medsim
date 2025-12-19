import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Wind, Droplets, Zap, Brain, AlertCircle, Plus } from 'lucide-react';

const PRESET_SCENARIOS = [
  {
    id: 'cardiac_arrest',
    name: 'Cardiac Arrest',
    icon: Heart,
    color: 'bg-red-100 border-red-300 text-red-700',
    description: 'Sudden cardiac arrest requiring immediate resuscitation',
    vitals: {
      heart_rate: 0,
      blood_pressure_systolic: 0,
      blood_pressure_diastolic: 0,
      respiratory_rate: 0,
      spo2: 0,
      temperature: 36.5,
      consciousness: 'Unresponsive'
    },
    equipment: [
      { type: 'defibrillator', settings: { mode: 'AED', energy: '200J' } },
      { type: 'cardiac_monitor', settings: { mode: '5-lead ECG' } },
      { type: 'iv_pump', settings: { drug: 'Epinephrine', rate: '1mg/3min' } },
      { type: 'ventilator', settings: { mode: 'BVM', rate: 10 } }
    ],
    notes: 'Begin CPR immediately. Attach defibrillator. Consider reversible causes (Hs and Ts).'
  },
  {
    id: 'respiratory_failure',
    name: 'Acute Respiratory Failure',
    icon: Wind,
    color: 'bg-blue-100 border-blue-300 text-blue-700',
    description: 'Severe hypoxemia requiring mechanical ventilation',
    vitals: {
      heart_rate: 125,
      blood_pressure_systolic: 145,
      blood_pressure_diastolic: 92,
      respiratory_rate: 32,
      spo2: 78,
      temperature: 38.2,
      consciousness: 'Confused'
    },
    equipment: [
      { type: 'ventilator', settings: { mode: 'AC', PEEP: 10, FiO2: 100 } },
      { type: 'cardiac_monitor', settings: { mode: '5-lead ECG' } },
      { type: 'pulse_ox', settings: { continuous: true } },
      { type: 'arterial_line', settings: { transduced: true } },
      { type: 'syringe_pump', settings: { drug: 'Propofol', rate: '50mcg/kg/min' } }
    ],
    notes: 'Intubation required. High PEEP strategy. Consider prone positioning if ARDS.'
  },
  {
    id: 'septic_shock',
    name: 'Septic Shock',
    icon: Droplets,
    color: 'bg-purple-100 border-purple-300 text-purple-700',
    description: 'Distributive shock with multi-organ failure',
    vitals: {
      heart_rate: 135,
      blood_pressure_systolic: 75,
      blood_pressure_diastolic: 45,
      respiratory_rate: 28,
      spo2: 88,
      temperature: 39.8,
      consciousness: 'Lethargic'
    },
    equipment: [
      { type: 'cardiac_monitor', settings: { mode: '5-lead ECG' } },
      { type: 'arterial_line', settings: { continuous BP' } },
      { type: 'iv_pump', settings: { fluid: 'Lactated Ringers', rate: '500ml/hr' } },
      { type: 'syringe_pump', settings: { drug: 'Norepinephrine', rate: '0.1mcg/kg/min' } },
      { type: 'pulse_ox', settings: { continuous: true } },
      { type: 'temp_monitor', settings: { continuous: true } }
    ],
    notes: 'Aggressive fluid resuscitation. Early antibiotics. Vasopressors for MAP >65mmHg.'
  },
  {
    id: 'trauma',
    name: 'Major Trauma',
    icon: AlertCircle,
    color: 'bg-orange-100 border-orange-300 text-orange-700',
    description: 'Polytrauma with hemorrhagic shock',
    vitals: {
      heart_rate: 145,
      blood_pressure_systolic: 85,
      blood_pressure_diastolic: 50,
      respiratory_rate: 30,
      spo2: 90,
      temperature: 35.2,
      consciousness: 'Altered'
    },
    equipment: [
      { type: 'cardiac_monitor', settings: { mode: '5-lead ECG' } },
      { type: 'iv_pump', settings: { fluid: 'Blood Products', rate: 'rapid' } },
      { type: 'arterial_line', settings: { continuous monitoring' } },
      { type: 'ventilator', settings: { mode: 'CMV' } },
      { type: 'temp_monitor', settings: { active warming' } }
    ],
    notes: 'ATLS protocol. Massive transfusion protocol. Damage control surgery.'
  },
  {
    id: 'stroke',
    name: 'Acute Ischemic Stroke',
    icon: Brain,
    color: 'bg-indigo-100 border-indigo-300 text-indigo-700',
    description: 'Large vessel occlusion requiring intervention',
    vitals: {
      heart_rate: 88,
      blood_pressure_systolic: 185,
      blood_pressure_diastolic: 105,
      respiratory_rate: 16,
      spo2: 97,
      temperature: 37.1,
      consciousness: 'Alert, Aphasic'
    },
    equipment: [
      { type: 'cardiac_monitor', settings: { telemetry' } },
      { type: 'pulse_ox', settings: { continuous' } },
      { type: 'arterial_line', settings: { BP control' } },
      { type: 'iv_pump', settings: { medications' } }
    ],
    notes: 'NIHSS assessment. CT/CTA protocol. Consider tPA or thrombectomy. Blood pressure management.'
  },
  {
    id: 'anaphylaxis',
    name: 'Anaphylactic Shock',
    icon: Zap,
    color: 'bg-pink-100 border-pink-300 text-pink-700',
    description: 'Severe allergic reaction with cardiovascular collapse',
    vitals: {
      heart_rate: 145,
      blood_pressure_systolic: 70,
      blood_pressure_diastolic: 40,
      respiratory_rate: 35,
      spo2: 85,
      temperature: 37.3,
      consciousness: 'Anxious'
    },
    equipment: [
      { type: 'cardiac_monitor', settings: { continuous' } },
      { type: 'pulse_ox', settings: { continuous' } },
      { type: 'iv_pump', settings: { fluid: 'Normal Saline', rate: 'wide open' } },
      { type: 'syringe_pump', settings: { drug: 'Epinephrine', ready: true } },
      { type: 'ventilator', settings: { standby' } }
    ],
    notes: 'IM Epinephrine 0.3-0.5mg immediately. Aggressive IV fluids. H1/H2 blockers. Steroids.'
  }
];

export default function ScenarioSelector({ onSelectScenario, onCreateCustom }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Select Emergency Scenario</h2>
        <Button
          onClick={onCreateCustom}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Custom Scenario
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRESET_SCENARIOS.map((scenario) => (
          <Card
            key={scenario.id}
            className="hover:shadow-lg transition-all cursor-pointer group border-2"
            onClick={() => onSelectScenario(scenario)}
          >
            <CardHeader className={`pb-3 ${scenario.color} border-b`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <scenario.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">
                      {scenario.name}
                    </CardTitle>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-slate-600 mb-3">
                {scenario.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                <Badge variant="secondary" className="text-xs">
                  {scenario.equipment.length} Equipment
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  HR: {scenario.vitals.heart_rate}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  SpO₂: {scenario.vitals.spo2}%
                </Badge>
              </div>
              <Button
                className="w-full group-hover:bg-slate-800 transition-colors"
                size="sm"
              >
                Load Scenario
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export { PRESET_SCENARIOS };
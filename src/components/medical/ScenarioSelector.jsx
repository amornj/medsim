import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Wind, Droplets, Zap, Brain, AlertCircle, Plus, Sparkles, Activity } from 'lucide-react';
import AIScenarioGenerator from './AIScenarioGenerator';

const PRESET_SCENARIOS = [
  // EASY - Stable monitoring
  {
    id: 'post_op_stable',
    name: 'Post-Operative Monitoring',
    icon: Heart,
    color: 'bg-green-100 border-green-300 text-green-700',
    description: 'Stable post-surgical patient requiring routine monitoring',
    difficulty: 1,
    difficultyLabel: 'Easy',
    vitals: {
      heart_rate: 78,
      blood_pressure_systolic: 118,
      blood_pressure_diastolic: 75,
      respiratory_rate: 14,
      spo2: 98,
      temperature: 36.8,
      consciousness: 'Alert'
    },
    equipment: [],
    notes: 'Routine post-op vitals monitoring. Watch for bleeding or infection signs.',
    patient_history: {
      past_medical: ['Hypertension', 'Hyperlipidemia'],
      current_medications: ['Lisinopril 10mg daily', 'Atorvastatin 20mg daily'],
      allergies: [],
      social_history: {
        smoking: 'Never smoker',
        alcohol: 'Occasional social drinker',
        drugs: 'Denies',
        occupation: 'Office manager'
      }
    }
    },
  {
    id: 'controlled_hypertension',
    name: 'Controlled Hypertension',
    icon: Activity,
    color: 'bg-green-100 border-green-300 text-green-700',
    description: 'Stable hypertension requiring medication titration',
    difficulty: 1,
    difficultyLabel: 'Easy',
    vitals: {
      heart_rate: 88,
      blood_pressure_systolic: 158,
      blood_pressure_diastolic: 95,
      respiratory_rate: 16,
      spo2: 97,
      temperature: 37.0,
      consciousness: 'Alert'
    },
    equipment: [],
    notes: 'Gradually titrate antihypertensives. Monitor for end-organ damage.'
  },
  
  // MODERATE - Some intervention needed
  {
    id: 'copd_exacerbation',
    name: 'COPD Exacerbation',
    icon: Wind,
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    description: 'Acute COPD flare requiring BiPAP and bronchodilators',
    difficulty: 2,
    difficultyLabel: 'Moderate',
    vitals: {
      heart_rate: 102,
      blood_pressure_systolic: 142,
      blood_pressure_diastolic: 88,
      respiratory_rate: 28,
      spo2: 87,
      temperature: 37.8,
      consciousness: 'Alert'
    },
    equipment: [],
    notes: 'NIV support. Bronchodilators. Monitor for respiratory fatigue.',
    patient_history: {
      past_medical: ['COPD (GOLD Stage 3)', 'Coronary artery disease', 'Type 2 Diabetes'],
      current_medications: ['Albuterol MDI', 'Tiotropium', 'Metformin 1000mg BID'],
      allergies: ['Penicillin - rash'],
      social_history: {
        smoking: '40 pack-year history, quit 2 years ago',
        alcohol: 'Denies',
        drugs: 'Denies',
        occupation: 'Retired factory worker'
      }
    }
    },
  {
    id: 'pneumonia',
    name: 'Community-Acquired Pneumonia',
    icon: Wind,
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    description: 'Moderate pneumonia requiring oxygen and antibiotics',
    difficulty: 2,
    difficultyLabel: 'Moderate',
    vitals: {
      heart_rate: 108,
      blood_pressure_systolic: 112,
      blood_pressure_diastolic: 68,
      respiratory_rate: 24,
      spo2: 89,
      temperature: 38.9,
      consciousness: 'Alert'
    },
    equipment: [],
    notes: 'Supplemental oxygen. Broad-spectrum antibiotics. Fluid resuscitation.'
  },
  
  // SERIOUS - Life-threatening if untreated
  {
    id: 'cardiac_arrest',
    name: 'Cardiac Arrest',
    icon: Heart,
    color: 'bg-orange-100 border-orange-300 text-orange-700',
    description: 'Sudden cardiac arrest requiring immediate resuscitation',
    difficulty: 4,
    difficultyLabel: 'Severe',
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
    color: 'bg-orange-100 border-orange-300 text-orange-700',
    description: 'Severe hypoxemia requiring mechanical ventilation',
    difficulty: 4,
    difficultyLabel: 'Severe',
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
    color: 'bg-red-100 border-red-300 text-red-700',
    description: 'Distributive shock with multi-organ failure',
    difficulty: 5,
    difficultyLabel: 'Critical',
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
      { type: 'arterial_line', settings: { monitoring: 'continuous BP' } },
      { type: 'iv_pump', settings: { fluid: 'Lactated Ringers', rate: '500ml/hr' } },
      { type: 'syringe_pump', settings: { drug: 'Norepinephrine', rate: '0.1mcg/kg/min' } },
      { type: 'pulse_ox', settings: { continuous: true } },
      { type: 'temp_monitor', settings: { continuous: true } }
    ],
    notes: 'Aggressive fluid resuscitation. Early antibiotics. Vasopressors for MAP >65mmHg.',
    patient_history: {
      past_medical: ['Type 2 Diabetes (poorly controlled)', 'Chronic kidney disease stage 3', 'Obesity'],
      current_medications: ['Insulin glargine', 'Metformin', 'Lisinopril'],
      allergies: ['Sulfa drugs - Stevens-Johnson syndrome'],
      social_history: {
        smoking: 'Never smoker',
        alcohol: 'Social drinker',
        drugs: 'Denies',
        occupation: 'Accountant'
      }
    }
    },
  {
    id: 'trauma',
    name: 'Major Trauma',
    icon: AlertCircle,
    color: 'bg-red-100 border-red-300 text-red-700',
    description: 'Polytrauma with hemorrhagic shock',
    difficulty: 5,
    difficultyLabel: 'Critical',
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
      { type: 'arterial_line', settings: { monitoring: 'continuous' } },
      { type: 'ventilator', settings: { mode: 'CMV' } },
      { type: 'temp_monitor', settings: { warming: 'active' } }
    ],
    notes: 'ATLS protocol. Massive transfusion protocol. Damage control surgery.'
  },
  {
    id: 'stroke',
    name: 'Acute Ischemic Stroke',
    icon: Brain,
    color: 'bg-orange-100 border-orange-300 text-orange-700',
    description: 'Large vessel occlusion requiring intervention',
    difficulty: 3,
    difficultyLabel: 'Serious',
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
      { type: 'cardiac_monitor', settings: { mode: 'telemetry' } },
      { type: 'pulse_ox', settings: { monitoring: 'continuous' } },
      { type: 'arterial_line', settings: { purpose: 'BP control' } },
      { type: 'iv_pump', settings: { infusion: 'medications' } }
    ],
    notes: 'NIHSS assessment. CT/CTA protocol. Consider tPA or thrombectomy. Blood pressure management.'
  },
  {
    id: 'anaphylaxis',
    name: 'Anaphylactic Shock',
    icon: Zap,
    color: 'bg-orange-100 border-orange-300 text-orange-700',
    description: 'Severe allergic reaction with cardiovascular collapse',
    difficulty: 4,
    difficultyLabel: 'Severe',
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
      { type: 'cardiac_monitor', settings: { monitoring: 'continuous' } },
      { type: 'pulse_ox', settings: { monitoring: 'continuous' } },
      { type: 'iv_pump', settings: { fluid: 'Normal Saline', rate: 'wide open' } },
      { type: 'syringe_pump', settings: { drug: 'Epinephrine', ready: true } },
      { type: 'ventilator', settings: { status: 'standby' } }
    ],
    notes: 'IM Epinephrine 0.3-0.5mg immediately. Aggressive IV fluids. H1/H2 blockers. Steroids.'
  },
  {
    id: 'pulmonary_embolism',
    name: 'Massive Pulmonary Embolism',
    icon: Wind,
    color: 'bg-red-100 border-red-300 text-red-700',
    description: 'Large PE causing RV failure and hemodynamic instability',
    difficulty: 5,
    difficultyLabel: 'Critical',
    vitals: {
      heart_rate: 135,
      blood_pressure_systolic: 80,
      blood_pressure_diastolic: 50,
      respiratory_rate: 32,
      spo2: 82,
      temperature: 36.8,
      consciousness: 'Anxious'
    },
    equipment: [],
    notes: 'Consider thrombolytics or ECMO. Anticoagulation. Urgent CT angiography.'
  },
  {
    id: 'burns',
    name: 'Major Burn Injury',
    icon: AlertCircle,
    color: 'bg-orange-100 border-orange-300 text-orange-700',
    description: '40% TBSA burns with inhalation injury',
    difficulty: 4,
    difficultyLabel: 'Severe',
    vitals: {
      heart_rate: 125,
      blood_pressure_systolic: 95,
      blood_pressure_diastolic: 60,
      respiratory_rate: 26,
      spo2: 91,
      temperature: 38.5,
      consciousness: 'Alert'
    },
    equipment: [],
    notes: 'Parkland formula for fluid resuscitation. Airway protection. Escharotomy if needed.'
  },
  {
    id: 'hypothermia',
    name: 'Severe Hypothermia',
    icon: Droplets,
    color: 'bg-orange-100 border-orange-300 text-orange-700',
    description: 'Core temperature 28°C with cardiac instability',
    difficulty: 4,
    difficultyLabel: 'Severe',
    vitals: {
      heart_rate: 45,
      blood_pressure_systolic: 75,
      blood_pressure_diastolic: 45,
      respiratory_rate: 8,
      spo2: 88,
      temperature: 28.0,
      consciousness: 'Stuporous'
    },
    equipment: [],
    notes: 'Gentle rewarming. ECMO for severe cases. Handle gently - arrhythmia risk.'
  },
  {
    id: 'diabetic_dka',
    name: 'Diabetic Ketoacidosis',
    icon: Droplets,
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    description: 'Severe DKA with cerebral edema risk',
    difficulty: 3,
    difficultyLabel: 'Serious',
    vitals: {
      heart_rate: 115,
      blood_pressure_systolic: 90,
      blood_pressure_diastolic: 55,
      respiratory_rate: 28,
      spo2: 96,
      temperature: 37.2,
      consciousness: 'Confused'
    },
    equipment: [],
    notes: 'Insulin drip. Aggressive fluids. Potassium replacement. Monitor for cerebral edema.'
  },
  {
    id: 'tension_pneumothorax',
    name: 'Tension Pneumothorax',
    icon: Wind,
    color: 'bg-red-100 border-red-300 text-red-700',
    description: 'Life-threatening air trapping with mediastinal shift',
    difficulty: 5,
    difficultyLabel: 'Critical',
    vitals: {
      heart_rate: 145,
      blood_pressure_systolic: 70,
      blood_pressure_diastolic: 40,
      respiratory_rate: 35,
      spo2: 80,
      temperature: 36.9,
      consciousness: 'Agitated'
    },
    equipment: [],
    notes: 'Immediate needle decompression. Chest tube placement. Do not delay for imaging.'
  },
  
  // MORE CRITICAL SCENARIOS
  {
    id: 'cardiogenic_shock',
    name: 'Cardiogenic Shock',
    icon: Heart,
    color: 'bg-red-100 border-red-300 text-red-700',
    description: 'Acute MI with pump failure, requires mechanical support',
    difficulty: 5,
    difficultyLabel: 'Critical',
    vitals: {
      heart_rate: 118,
      blood_pressure_systolic: 72,
      blood_pressure_diastolic: 45,
      respiratory_rate: 26,
      spo2: 86,
      temperature: 36.4,
      consciousness: 'Lethargic'
    },
    equipment: [],
    notes: 'Consider Impella, IABP, or VA-ECMO. Emergent cath lab. Inotropes/pressors.'
  },
  {
    id: 'ards_severe',
    name: 'Severe ARDS',
    icon: Wind,
    color: 'bg-red-100 border-red-300 text-red-700',
    description: 'Refractory hypoxemia despite maximal ventilator support',
    difficulty: 5,
    difficultyLabel: 'Critical',
    vitals: {
      heart_rate: 132,
      blood_pressure_systolic: 98,
      blood_pressure_diastolic: 62,
      respiratory_rate: 35,
      spo2: 72,
      temperature: 38.8,
      consciousness: 'Sedated'
    },
    equipment: [],
    notes: 'VV-ECMO candidacy. Prone positioning. Neuromuscular blockade. Lung protective ventilation.'
  },
  {
    id: 'gi_bleed',
    name: 'Massive GI Hemorrhage',
    icon: Droplets,
    color: 'bg-red-100 border-red-300 text-red-700',
    description: 'Exsanguinating GI bleed with hypovolemic shock',
    difficulty: 5,
    difficultyLabel: 'Critical',
    vitals: {
      heart_rate: 155,
      blood_pressure_systolic: 68,
      blood_pressure_diastolic: 38,
      respiratory_rate: 28,
      spo2: 88,
      temperature: 35.8,
      consciousness: 'Confused'
    },
    equipment: [],
    notes: 'Massive transfusion protocol. Urgent endoscopy. Vasopressors. Octreotide if variceal.'
  },
  {
    id: 'multi_organ_failure',
    name: 'Multi-Organ Dysfunction Syndrome',
    icon: AlertCircle,
    color: 'bg-red-100 border-red-300 text-red-700',
    description: 'Simultaneous failure of heart, lungs, kidneys, and liver',
    difficulty: 6,
    difficultyLabel: 'Life-Threatening',
    vitals: {
      heart_rate: 142,
      blood_pressure_systolic: 65,
      blood_pressure_diastolic: 38,
      respiratory_rate: 38,
      spo2: 75,
      temperature: 40.2,
      consciousness: 'Unresponsive'
    },
    equipment: [],
    notes: 'Maximal support. VA-ECMO + CRRT. Multiple vasopressors. Poor prognosis without rapid reversal.'
  }
];

export default function ScenarioSelector({ onSelectScenario, onCreateCustom }) {
  const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false);

  // Sort scenarios by difficulty
  const sortedScenarios = [...PRESET_SCENARIOS].sort((a, b) => (a.difficulty || 0) - (b.difficulty || 0));

  // Add randomization to scenarios for dynamic gameplay
  const randomizeScenario = (scenario) => {
    return {
      ...scenario,
      vitals: {
        ...scenario.vitals,
        heart_rate: scenario.vitals.heart_rate + Math.floor(Math.random() * 20 - 10),
        blood_pressure_systolic: scenario.vitals.blood_pressure_systolic + Math.floor(Math.random() * 20 - 10),
        blood_pressure_diastolic: scenario.vitals.blood_pressure_diastolic + Math.floor(Math.random() * 10 - 5),
        respiratory_rate: Math.max(0, scenario.vitals.respiratory_rate + Math.floor(Math.random() * 6 - 3)),
        spo2: Math.max(0, Math.min(100, scenario.vitals.spo2 + Math.floor(Math.random() * 6 - 3))),
        temperature: parseFloat((scenario.vitals.temperature + (Math.random() * 0.8 - 0.4)).toFixed(1))
      }
    };
  };
  
  const getDifficultyColor = (difficulty) => {
    if (difficulty === 1) return 'bg-green-500';
    if (difficulty === 2) return 'bg-yellow-500';
    if (difficulty === 3) return 'bg-orange-500';
    if (difficulty === 4) return 'bg-red-500';
    if (difficulty === 5) return 'bg-red-600';
    if (difficulty === 6) return 'bg-red-800';
    return 'bg-slate-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-bold text-slate-800">Select Emergency Scenario</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setAiGeneratorOpen(true)}
            variant="default"
            size="sm"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <Sparkles className="w-4 h-4" />
            AI Generate
          </Button>
          <Button
            onClick={onCreateCustom}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Manual Setup
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedScenarios.map((scenario) => (
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
                    {scenario.difficultyLabel && (
                      <Badge className={`${getDifficultyColor(scenario.difficulty)} text-white mt-1`}>
                        {scenario.difficultyLabel}
                      </Badge>
                    )}
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
                onClick={() => onSelectScenario(randomizeScenario(scenario))}
              >
                Load Scenario
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <AIScenarioGenerator
        open={aiGeneratorOpen}
        onClose={() => setAiGeneratorOpen(false)}
        onScenarioGenerated={(scenario) => {
          setAiGeneratorOpen(false);
          onSelectScenario(scenario);
        }}
      />
    </div>
  );
}

export { PRESET_SCENARIOS };
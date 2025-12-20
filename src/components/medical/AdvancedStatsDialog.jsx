import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Activity, Droplets, Heart, Brain, Wind } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

export default function AdvancedStatsDialog({ open, onClose, vitals, scenario }) {
  // Generate advanced medical data based on scenario
  const getAdvancedData = () => {
    if (!scenario) return null;

    const baseData = {
      'Hemodynamics': [
        { label: 'Mean Arterial Pressure', value: `${Math.round((vitals?.blood_pressure_systolic + 2 * vitals?.blood_pressure_diastolic) / 3)} mmHg`, normal: '70-100 mmHg' },
        { label: 'Cardiac Output', value: '4.2 L/min', normal: '4-8 L/min' },
        { label: 'SVR (Systemic Vascular Resistance)', value: '1200 dyn·s/cm⁵', normal: '800-1200' },
        { label: 'Central Venous Pressure', value: '8 mmHg', normal: '2-8 mmHg' }
      ],
      'Respiratory': [
        { label: 'PaO₂', value: `${Math.round(vitals?.spo2 * 0.8)} mmHg`, normal: '80-100 mmHg' },
        { label: 'PaCO₂', value: '42 mmHg', normal: '35-45 mmHg' },
        { label: 'pH', value: '7.38', normal: '7.35-7.45' },
        { label: 'A-a Gradient', value: '15 mmHg', normal: '<20 mmHg' }
      ],
      'Metabolic': [
        { label: 'Lactate', value: '2.1 mmol/L', normal: '<2 mmol/L' },
        { label: 'Base Excess', value: '-2 mEq/L', normal: '-2 to +2' },
        { label: 'Anion Gap', value: '14 mEq/L', normal: '8-16 mEq/L' },
        { label: 'Glucose', value: '145 mg/dL', normal: '70-110 mg/dL' }
      ],
      'Renal': [
        { label: 'Creatinine', value: '1.2 mg/dL', normal: '0.6-1.2 mg/dL' },
        { label: 'BUN', value: '18 mg/dL', normal: '7-20 mg/dL' },
        { label: 'Urine Output', value: '45 mL/hr', normal: '>30 mL/hr' },
        { label: 'GFR', value: '85 mL/min', normal: '>60 mL/min' }
      ]
    };

    // Add scenario-specific data
    if (scenario.id === 'septic_shock') {
      baseData['Infection Markers'] = [
        { label: 'Procalcitonin', value: '8.5 ng/mL', normal: '<0.5 ng/mL', critical: true },
        { label: 'WBC Count', value: '18,000/μL', normal: '4,000-11,000/μL', critical: true },
        { label: 'CRP', value: '185 mg/L', normal: '<10 mg/L', critical: true },
        { label: 'Blood Cultures', value: 'Pending (2/4 bottles)', normal: 'Negative' }
      ];
    } else if (scenario.id === 'cardiac_arrest') {
      baseData['Cardiac'] = [
        { label: 'Troponin I', value: '12.5 ng/mL', normal: '<0.04 ng/mL', critical: true },
        { label: 'BNP', value: '850 pg/mL', normal: '<100 pg/mL', critical: true },
        { label: 'ECG Rhythm', value: 'Asystole → ROSC', normal: 'Normal Sinus', critical: true },
        { label: 'Downtime', value: '8 minutes', normal: 'N/A', critical: true }
      ];
    } else if (scenario.id === 'respiratory_failure') {
      baseData['Respiratory']['PaO₂/FiO₂ Ratio'] = { label: 'P/F Ratio', value: '120', normal: '>300', critical: true };
      baseData['Respiratory']['PEEP'] = { label: 'PEEP', value: '12 cmH₂O', normal: '5-10 cmH₂O' };
    } else if (scenario.ai_generated) {
      // For AI-generated scenarios, add custom data
      baseData['Scenario-Specific'] = [
        { label: 'Custom Finding 1', value: 'Present', normal: 'Absent' },
        { label: 'Custom Finding 2', value: 'Elevated', normal: 'Normal' },
        { label: 'Custom Finding 3', value: 'Positive', normal: 'Negative' }
      ];
    }

    return baseData;
  };

  const advancedData = getAdvancedData();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Activity className="w-6 h-6 text-blue-600" />
            Advanced Medical Statistics
          </DialogTitle>
        </DialogHeader>

        {advancedData && (
          <div className="space-y-4 py-4">
            {Object.entries(advancedData).map(([category, metrics]) => (
              <Card key={category} className="p-4">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  {category === 'Hemodynamics' && <Heart className="w-5 h-5 text-red-500" />}
                  {category === 'Respiratory' && <Wind className="w-5 h-5 text-blue-500" />}
                  {category === 'Metabolic' && <Droplets className="w-5 h-5 text-green-500" />}
                  {category === 'Renal' && <Droplets className="w-5 h-5 text-yellow-500" />}
                  {category === 'Cardiac' && <Heart className="w-5 h-5 text-pink-500" />}
                  {category === 'Infection Markers' && <AlertCircle className="w-5 h-5 text-orange-500" />}
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {metrics.map((metric, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${
                      metric.critical ? 'bg-red-50 border-red-200' : 'bg-slate-50'
                    }`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-semibold text-slate-700 break-words">
                          {metric.label}
                        </span>
                        {metric.critical && (
                          <Badge variant="destructive" className="text-xs ml-2">Critical</Badge>
                        )}
                      </div>
                      <div className="text-xl font-bold text-slate-900">{metric.value}</div>
                      <div className="text-xs text-slate-500 mt-1">Normal: {metric.normal}</div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}

            {/* Clinical Interpretation */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Clinical Interpretation
              </h3>
              <div className="text-sm text-slate-700 space-y-2">
                <p className="break-words">
                  <strong>Primary Assessment:</strong> {scenario?.description || 'Critical medical emergency requiring immediate intervention'}
                </p>
                {scenario?.notes && (
                  <p className="break-words">
                    <strong>Management Plan:</strong> {scenario.notes}
                  </p>
                )}
                <p className="break-words">
                  <strong>Severity:</strong> Based on current vitals and lab values, patient requires intensive monitoring and aggressive intervention.
                </p>
              </div>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function DrugRadarChart({ drug }) {
  // Calculate scores based on drug properties
  const calculateScores = (drug) => {
    // Nicheness: how specialized/specific the drug is (0-10)
    const nicheness = drug.category === 'Vasopressors' ? 8 : 
                     drug.category === 'Sedatives' ? 6 : 
                     drug.category === 'Analgesics' ? 5 : 
                     drug.category === 'Paralytics' ? 9 : 
                     drug.category === 'Cardiac' ? 7 : 6;

    // Usefulness: broad applicability (0-10)
    const usefulness = drug.category === 'Vasopressors' ? 9 : 
                      drug.category === 'Sedatives' ? 8 : 
                      drug.category === 'Analgesics' ? 9 : 7;

    // Effectiveness: how effective the drug typically is (0-10)
    const effectiveness = drug.name === 'Epinephrine' ? 9 :
                         drug.name === 'Norepinephrine' ? 9 :
                         drug.name === 'Propofol' ? 8 :
                         drug.name === 'Fentanyl' ? 9 : 7;

    // Potency: strength/concentration (0-10)
    const potencyValue = parseFloat(drug.concentration) || 0;
    const potency = Math.min(10, Math.round((potencyValue / 100) * 10)) || 5;

    // Time: speed of onset (0-10, 10 = fastest)
    const time = drug.category === 'Vasopressors' ? 9 : 
                drug.category === 'Paralytics' ? 8 : 
                drug.name === 'Fentanyl' ? 9 : 6;

    return { nicheness, usefulness, effectiveness, potency, time };
  };

  const scores = calculateScores(drug);

  const data = [
    { subject: 'Nicheness', value: scores.nicheness, fullMark: 10 },
    { subject: 'Usefulness', value: scores.usefulness, fullMark: 10 },
    { subject: 'Effectiveness', value: scores.effectiveness, fullMark: 10 },
    { subject: 'Potency', value: scores.potency, fullMark: 10 },
    { subject: 'Time', value: scores.time, fullMark: 10 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#cbd5e1" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#475569', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 10]} 
            tick={{ fill: '#94a3b8', fontSize: 10 }}
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
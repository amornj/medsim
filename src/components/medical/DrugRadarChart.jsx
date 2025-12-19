import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function DrugRadarChart({ drug }) {
  // Calculate scores based on drug properties
  const calculateScores = (drug) => {
    // Nicheness: how rarely used/specialized the drug is (0-10, higher = more niche/rare)
    const nicheness = drug.name.includes('Clozapine') ? 10 :
                     drug.name.includes('Vecuronium') ? 9 :
                     drug.name.includes('Cisatracurium') ? 9 :
                     drug.name.includes('Remifentanil') ? 9 :
                     drug.name.includes('Milrinone') ? 8 :
                     drug.name.includes('Vasopressin') ? 8 :
                     drug.name.includes('Phenylephrine') ? 7 :
                     drug.name.includes('Dexmedetomidine') ? 7 :
                     drug.name.includes('Norepinephrine') ? 6 :
                     drug.name.includes('Ketamine') ? 6 :
                     drug.name.includes('Propofol') ? 4 :
                     drug.name.includes('Midazolam') ? 4 :
                     drug.name.includes('Fentanyl') ? 4 :
                     drug.name.includes('Morphine') ? 3 :
                     drug.name.includes('Epinephrine') ? 5 : 5;

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

    // Time: speed of onset (0-10, 10 = fastest onset)
    const time = drug.name.includes('Adenosine') ? 10 :
                drug.name.includes('Succinylcholine') ? 10 :
                drug.name.includes('Epinephrine') ? 9 :
                drug.name.includes('Norepinephrine') ? 9 :
                drug.name.includes('Propofol') ? 9 :
                drug.name.includes('Ketamine') ? 9 :
                drug.name.includes('Rocuronium') ? 8 :
                drug.name.includes('Fentanyl') ? 8 :
                drug.name.includes('Naloxone') ? 8 :
                drug.name.includes('Esmolol') ? 8 :
                drug.name.includes('Midazolam') ? 7 :
                drug.name.includes('Morphine') ? 6 :
                drug.name.includes('Vecuronium') ? 6 :
                drug.name.includes('Vancomycin') ? 2 :
                drug.name.includes('Warfarin') ? 1 : 5;

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
import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

export default function MachineryRadarChart({ equipment }) {
  // Calculate scores for each machinery type
  const getMachineryScores = (equipmentId) => {
    const scores = {
      // Cardiovascular Support
      'ecmo': { nicheness: 6, usefulness: 8, effectiveness: 7, potency: 8, time: 4 },
      'va_ecmo': { nicheness: 7, usefulness: 9, effectiveness: 8, potency: 9, time: 5 },
      'vv_ecmo': { nicheness: 6, usefulness: 8, effectiveness: 7, potency: 7, time: 5 },
      'vav_ecmo': { nicheness: 8, usefulness: 8, effectiveness: 8, potency: 8, time: 4 },
      'lava_ecmo': { nicheness: 9, usefulness: 8, effectiveness: 8, potency: 9, time: 3 },
      'ecpella': { nicheness: 9, usefulness: 9, effectiveness: 9, potency: 10, time: 3 },
      'iabp': { nicheness: 4, usefulness: 7, effectiveness: 5, potency: 4, time: 8 },
      'impella_cp': { nicheness: 6, usefulness: 8, effectiveness: 7, potency: 7, time: 6 },
      'impella_5': { nicheness: 7, usefulness: 9, effectiveness: 8, potency: 8, time: 5 },
      'impella_rp': { nicheness: 8, usefulness: 7, effectiveness: 7, potency: 7, time: 6 },
      'tandem_heart': { nicheness: 7, usefulness: 8, effectiveness: 8, potency: 8, time: 5 },
      'heartmate_3': { nicheness: 9, usefulness: 9, effectiveness: 9, potency: 9, time: 2 },
      'centrimag': { nicheness: 7, usefulness: 8, effectiveness: 8, potency: 8, time: 5 },
      
      // Respiratory
      'ventilator': { nicheness: 3, usefulness: 9, effectiveness: 8, potency: 7, time: 7 },
      'hfov': { nicheness: 7, usefulness: 7, effectiveness: 7, potency: 7, time: 5 },
      'bipap': { nicheness: 4, usefulness: 8, effectiveness: 7, potency: 5, time: 8 },
      'cpap': { nicheness: 3, usefulness: 8, effectiveness: 7, potency: 4, time: 9 },
      'hfnc': { nicheness: 4, usefulness: 9, effectiveness: 7, potency: 5, time: 9 },
      'jet_ventilator': { nicheness: 8, usefulness: 6, effectiveness: 7, potency: 6, time: 6 },
      
      // Renal
      'crrt': { nicheness: 6, usefulness: 9, effectiveness: 8, potency: 7, time: 3 },
      'cvvh': { nicheness: 6, usefulness: 8, effectiveness: 7, potency: 7, time: 3 },
      'cvvhd': { nicheness: 6, usefulness: 8, effectiveness: 7, potency: 7, time: 3 },
      'cvvhdf': { nicheness: 7, usefulness: 8, effectiveness: 8, potency: 8, time: 3 },
      'dialysis': { nicheness: 4, usefulness: 9, effectiveness: 8, potency: 8, time: 7 },
      'sled': { nicheness: 6, usefulness: 8, effectiveness: 7, potency: 7, time: 5 },
      'plasmapheresis': { nicheness: 8, usefulness: 7, effectiveness: 7, potency: 7, time: 4 },
      
      // Neuro
      'eeg_monitor': { nicheness: 5, usefulness: 8, effectiveness: 7, potency: 6, time: 8 },
      'icp_monitor': { nicheness: 6, usefulness: 9, effectiveness: 8, potency: 7, time: 7 },
      'brain_o2_monitor': { nicheness: 7, usefulness: 8, effectiveness: 7, potency: 7, time: 7 },
      'tcd': { nicheness: 6, usefulness: 7, effectiveness: 7, potency: 6, time: 8 },
      
      // Hemodynamic
      'swan_ganz': { nicheness: 6, usefulness: 8, effectiveness: 7, potency: 6, time: 6 },
      'picco': { nicheness: 7, usefulness: 8, effectiveness: 8, potency: 7, time: 7 },
      'lidco': { nicheness: 7, usefulness: 8, effectiveness: 7, potency: 7, time: 7 },
      'arterial_line': { nicheness: 4, usefulness: 9, effectiveness: 8, potency: 6, time: 8 },
      
      // Imaging
      'ct_scanner': { nicheness: 4, usefulness: 10, effectiveness: 9, potency: 8, time: 8 },
      'coronary_cta': { nicheness: 6, usefulness: 9, effectiveness: 8, potency: 7, time: 8 },
      'mri_scanner': { nicheness: 5, usefulness: 10, effectiveness: 9, potency: 8, time: 5 },
      'pet_ct': { nicheness: 7, usefulness: 9, effectiveness: 8, potency: 8, time: 5 },
      'fluoroscopy': { nicheness: 5, usefulness: 9, effectiveness: 8, potency: 7, time: 7 },
      'c_arm': { nicheness: 6, usefulness: 8, effectiveness: 8, potency: 7, time: 7 },
      
      // ICU/Emergency
      'iv_pump': { nicheness: 2, usefulness: 10, effectiveness: 9, potency: 6, time: 9 },
      'syringe_pump': { nicheness: 3, usefulness: 10, effectiveness: 9, potency: 7, time: 9 },
      'defibrillator': { nicheness: 5, usefulness: 10, effectiveness: 9, potency: 9, time: 9 },
      'aed': { nicheness: 3, usefulness: 10, effectiveness: 9, potency: 9, time: 10 },
      'lucas': { nicheness: 6, usefulness: 9, effectiveness: 8, potency: 8, time: 8 },
      'cardiac_monitor': { nicheness: 2, usefulness: 10, effectiveness: 9, potency: 6, time: 10 },
      
      // Anesthesia
      'anesthesia_workstation': { nicheness: 4, usefulness: 10, effectiveness: 9, potency: 8, time: 7 },
      'tee_machine': { nicheness: 7, usefulness: 9, effectiveness: 8, potency: 7, time: 7 },
      'ultrasound': { nicheness: 3, usefulness: 10, effectiveness: 8, potency: 6, time: 9 },
      'bronchoscope': { nicheness: 5, usefulness: 9, effectiveness: 8, potency: 7, time: 7 },
      'endoscope': { nicheness: 5, usefulness: 9, effectiveness: 8, potency: 7, time: 7 },
      
      // Oncology
      'linac': { nicheness: 8, usefulness: 9, effectiveness: 8, potency: 9, time: 2 },
      'gamma_knife': { nicheness: 9, usefulness: 8, effectiveness: 9, potency: 9, time: 3 },
      'apheresis': { nicheness: 8, usefulness: 7, effectiveness: 7, potency: 7, time: 5 },
      
      // Ortho/Surgical
      'da_vinci': { nicheness: 7, usefulness: 9, effectiveness: 8, potency: 8, time: 6 },
      'ortho_navigation': { nicheness: 6, usefulness: 8, effectiveness: 8, potency: 7, time: 7 },
      'electrocautery': { nicheness: 2, usefulness: 10, effectiveness: 9, potency: 7, time: 9 },
      
      // Monitoring
      'pulse_ox': { nicheness: 1, usefulness: 10, effectiveness: 9, potency: 5, time: 10 },
      'temp_monitor': { nicheness: 1, usefulness: 9, effectiveness: 8, potency: 4, time: 10 }
    };

    return scores[equipmentId] || { nicheness: 5, usefulness: 5, effectiveness: 5, potency: 5, time: 5 };
  };

  const scores = getMachineryScores(equipment.type);

  const chartData = [
    { subject: 'Nicheness', value: scores.nicheness, fullMark: 10 },
    { subject: 'Usefulness', value: scores.usefulness, fullMark: 10 },
    { subject: 'Effectiveness', value: scores.effectiveness, fullMark: 10 },
    { subject: 'Potency', value: scores.potency, fullMark: 10 },
    { subject: 'Time', value: scores.time, fullMark: 10 }
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <Radar
            name={equipment.type}
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
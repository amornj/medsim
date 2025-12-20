import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle, Heart, Droplets, Wind, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HumanAnatomyViewer({ vitals, scenario }) {
  const [showAbnormalities, setShowAbnormalities] = useState(true);
  const [view, setView] = useState('circulation'); // circulation, organs, both

  const abnormalities = [
    { 
      id: 'heart', 
      name: 'Cardiac Arrest', 
      location: 'Heart', 
      severity: 'critical',
      position: { top: '35%', left: '48%' },
      active: vitals?.heart_rate < 40
    },
    { 
      id: 'lungs', 
      name: 'Respiratory Failure', 
      location: 'Bilateral Lungs', 
      severity: 'severe',
      position: { top: '30%', left: '48%' },
      active: vitals?.spo2 < 85
    },
    { 
      id: 'brain', 
      name: 'Cerebral Hypoxia', 
      location: 'Brain', 
      severity: 'critical',
      position: { top: '10%', left: '48%' },
      active: vitals?.spo2 < 70
    },
    { 
      id: 'kidney', 
      name: 'Renal Hypoperfusion', 
      location: 'Kidneys', 
      severity: 'moderate',
      position: { top: '45%', left: '48%' },
      active: vitals?.blood_pressure_systolic < 80
    }
  ];

  const circulationPaths = [
    // Superior vena cava to right atrium
    { from: { top: '15%', left: '48%' }, to: { top: '33%', left: '48%' }, color: 'blue', label: 'SVC' },
    // Right atrium to right ventricle
    { from: { top: '33%', left: '48%' }, to: { top: '38%', left: '48%' }, color: 'blue', label: 'RA→RV' },
    // Right ventricle to pulmonary artery
    { from: { top: '38%', left: '48%' }, to: { top: '28%', left: '43%' }, color: 'blue', label: 'PA' },
    // Pulmonary veins to left atrium
    { from: { top: '28%', left: '53%' }, to: { top: '33%', left: '48%' }, color: 'red', label: 'PV' },
    // Left atrium to left ventricle
    { from: { top: '33%', left: '48%' }, to: { top: '38%', left: '48%' }, color: 'red', label: 'LA→LV' },
    // Left ventricle to aorta
    { from: { top: '38%', left: '48%' }, to: { top: '15%', left: '48%' }, color: 'red', label: 'Aorta' },
  ];

  return (
    <Card className="p-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Human Anatomy</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch 
              checked={showAbnormalities} 
              onCheckedChange={setShowAbnormalities}
              id="abnormalities"
            />
            <Label htmlFor="abnormalities" className="text-sm">
              Show Abnormalities
            </Label>
          </div>
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant={view === 'circulation' ? 'default' : 'outline'}
              onClick={() => setView('circulation')}
            >
              <Droplets className="w-3 h-3 mr-1" />
              Circulation
            </Button>
            <Button 
              size="sm" 
              variant={view === 'organs' ? 'default' : 'outline'}
              onClick={() => setView('organs')}
            >
              <Activity className="w-3 h-3 mr-1" />
              Organs
            </Button>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[600px] bg-slate-900 rounded-xl overflow-hidden">
        {/* Human body outline */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 600">
          {/* Head */}
          <ellipse cx="150" cy="50" rx="35" ry="45" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
          
          {/* Torso */}
          <rect x="120" y="95" width="60" height="120" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
          
          {/* Arms */}
          <rect x="85" y="100" width="25" height="100" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
          <rect x="190" y="100" width="25" height="100" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
          
          {/* Legs */}
          <rect x="130" y="215" width="20" height="130" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
          <rect x="150" y="215" width="20" height="130" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2"/>

          {view === 'circulation' && (
            <>
              {/* Heart */}
              <path d="M 145 120 L 155 120 L 160 130 L 150 140 L 140 130 Z" 
                    fill="#ef4444" stroke="#dc2626" strokeWidth="2"/>
              
              {/* Circulation lines */}
              {/* Aorta */}
              <line x1="150" y1="120" x2="150" y2="80" stroke="#ef4444" strokeWidth="3"/>
              <text x="155" y="100" fill="#ef4444" fontSize="10">Aorta</text>
              
              {/* SVC */}
              <line x1="150" y1="80" x2="150" y2="120" stroke="#3b82f6" strokeWidth="3"/>
              <text x="155" y="90" fill="#3b82f6" fontSize="10">SVC</text>
              
              {/* IVC */}
              <line x1="150" y1="140" x2="150" y2="180" stroke="#3b82f6" strokeWidth="3"/>
              <text x="155" y="160" fill="#3b82f6" fontSize="10">IVC</text>
              
              {/* Pulmonary circulation */}
              <line x1="140" y1="120" x2="120" y2="110" stroke="#3b82f6" strokeWidth="2"/>
              <line x1="120" y1="110" x2="140" y2="100" stroke="#ef4444" strokeWidth="2"/>
              <text x="110" y="105" fill="#8b5cf6" fontSize="8">Lungs</text>
              
              <line x1="160" y1="120" x2="180" y2="110" stroke="#3b82f6" strokeWidth="2"/>
              <line x1="180" y1="110" x2="160" y2="100" stroke="#ef4444" strokeWidth="2"/>
              
              {/* Peripheral circulation */}
              <line x1="150" y1="180" x2="140" y2="230" stroke="#ef4444" strokeWidth="2"/>
              <line x1="140" y1="230" x2="140" y2="280" stroke="#3b82f6" strokeWidth="2"/>
              <text x="110" y="255" fill="#10b981" fontSize="8">Legs</text>
              
              <line x1="150" y1="180" x2="160" y2="230" stroke="#ef4444" strokeWidth="2"/>
              <line x1="160" y1="230" x2="160" y2="280" stroke="#3b82f6" strokeWidth="2"/>
              
              {/* Arms */}
              <line x1="140" y1="120" x2="95" y2="140" stroke="#ef4444" strokeWidth="2"/>
              <line x1="95" y1="140" x2="95" y2="190" stroke="#3b82f6" strokeWidth="2"/>
              <text x="70" y="165" fill="#10b981" fontSize="8">Arm</text>
              
              <line x1="160" y1="120" x2="205" y2="140" stroke="#ef4444" strokeWidth="2"/>
              <line x1="205" y1="140" x2="205" y2="190" stroke="#3b82f6" strokeWidth="2"/>
            </>
          )}

          {view === 'organs' && (
            <>
              {/* Brain */}
              <ellipse cx="150" cy="40" rx="30" ry="25" fill="#ec4899" fillOpacity="0.6" 
                       stroke="#db2777" strokeWidth="2"/>
              <text x="135" y="45" fill="white" fontSize="10">Brain</text>
              
              {/* Lungs */}
              <ellipse cx="135" cy="120" rx="18" ry="30" fill="#60a5fa" fillOpacity="0.6" 
                       stroke="#3b82f6" strokeWidth="2"/>
              <ellipse cx="165" cy="120" rx="18" ry="30" fill="#60a5fa" fillOpacity="0.6" 
                       stroke="#3b82f6" strokeWidth="2"/>
              <text x="125" y="125" fill="white" fontSize="9">Lungs</text>
              
              {/* Heart */}
              <path d="M 145 140 L 155 140 L 160 150 L 150 165 L 140 150 Z" 
                    fill="#ef4444" fillOpacity="0.8" stroke="#dc2626" strokeWidth="2"/>
              <text x="143" y="153" fill="white" fontSize="8">❤</text>
              
              {/* Liver */}
              <ellipse cx="155" cy="180" rx="25" ry="20" fill="#a855f7" fillOpacity="0.6" 
                       stroke="#9333ea" strokeWidth="2"/>
              <text x="140" y="185" fill="white" fontSize="9">Liver</text>
              
              {/* Kidneys */}
              <ellipse cx="130" cy="195" rx="12" ry="18" fill="#f59e0b" fillOpacity="0.6" 
                       stroke="#d97706" strokeWidth="2"/>
              <ellipse cx="170" cy="195" rx="12" ry="18" fill="#f59e0b" fillOpacity="0.6" 
                       stroke="#d97706" strokeWidth="2"/>
              <text x="115" y="200" fill="white" fontSize="8">K</text>
              <text x="175" y="200" fill="white" fontSize="8">K</text>
            </>
          )}
        </svg>

        {/* Abnormality markers */}
        {showAbnormalities && abnormalities.filter(a => a.active).map((abnormality) => (
          <motion.div
            key={abnormality.id}
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute"
            style={abnormality.position}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              <AlertCircle className={`w-8 h-8 ${
                abnormality.severity === 'critical' ? 'text-red-500' :
                abnormality.severity === 'severe' ? 'text-orange-500' :
                'text-yellow-500'
              }`} />
              <div className="absolute left-10 top-0 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {abnormality.name}
                <div className="text-xs opacity-75">{abnormality.location}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-red-500"></div>
          <span className="text-slate-600">Arterial (Oxygenated)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-blue-500"></div>
          <span className="text-slate-600">Venous (Deoxygenated)</span>
        </div>
      </div>
    </Card>
  );
}
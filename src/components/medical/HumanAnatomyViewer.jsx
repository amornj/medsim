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
  const [zoom, setZoom] = useState(1);

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
          <div className="flex gap-2">
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
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}>-</Button>
              <span className="px-2 py-1 text-xs">{Math.round(zoom * 100)}%</span>
              <Button size="sm" variant="outline" onClick={() => setZoom(Math.min(2, zoom + 0.25))}>+</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[800px] bg-slate-900 rounded-xl overflow-hidden">
        {/* Human body outline */}
        <svg 
          className="absolute inset-0 w-full h-full transition-transform duration-300" 
          viewBox="0 0 300 600"
          style={{ transform: `scale(${zoom})` }}
        >
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
              {/* Animated Heart */}
              <motion.g
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 60 / (vitals?.heart_rate || 75),
                  ease: "easeInOut" 
                }}
              >
                <path d="M 145 120 L 155 120 L 160 130 L 150 140 L 140 130 Z" 
                      fill="#ef4444" stroke="#dc2626" strokeWidth="2"/>
              </motion.g>
              
              {/* Detailed Circulation */}
              {/* Brain - Carotid arteries */}
              <line x1="145" y1="90" x2="140" y2="50" stroke="#ef4444" strokeWidth="2"/>
              <line x1="155" y1="90" x2="160" y2="50" stroke="#ef4444" strokeWidth="2"/>
              <text x="130" y="70" fill="#ef4444" fontSize="7">Carotid</text>
              
              {/* Jugular veins */}
              <line x1="142" y1="50" x2="142" y2="90" stroke="#3b82f6" strokeWidth="2"/>
              <line x1="158" y1="50" x2="158" y2="90" stroke="#3b82f6" strokeWidth="2"/>
              <text x="163" y="70" fill="#3b82f6" fontSize="7">Jugular</text>
              
              {/* Subclavian */}
              <line x1="140" y1="95" x2="120" y2="100" stroke="#ef4444" strokeWidth="2"/>
              <line x1="160" y1="95" x2="180" y2="100" stroke="#ef4444" strokeWidth="2"/>
              <text x="105" y="98" fill="#ef4444" fontSize="6">Subclavian</text>
              
              {/* Axillary */}
              <line x1="120" y1="100" x2="105" y2="115" stroke="#ef4444" strokeWidth="2"/>
              <line x1="180" y1="100" x2="195" y2="115" stroke="#ef4444" strokeWidth="2"/>
              
              {/* Brachial */}
              <line x1="105" y1="115" x2="95" y2="150" stroke="#ef4444" strokeWidth="1.5"/>
              <line x1="195" y1="115" x2="205" y2="150" stroke="#ef4444" strokeWidth="1.5"/>
              
              {/* Radial/Ulnar */}
              <line x1="95" y1="150" x2="90" y2="190" stroke="#ef4444" strokeWidth="1"/>
              <line x1="95" y1="150" x2="100" y2="190" stroke="#ef4444" strokeWidth="1"/>
              <line x1="205" y1="150" x2="200" y2="190" stroke="#ef4444" strokeWidth="1"/>
              <line x1="205" y1="150" x2="210" y2="190" stroke="#ef4444" strokeWidth="1"/>
              
              {/* Aortic arch */}
              <path d="M 150 125 Q 145 115 140 110 T 130 105" 
                    stroke="#ef4444" strokeWidth="3" fill="none"/>
              <text x="125" y="108" fill="#ef4444" fontSize="7">Arch</text>
              
              {/* Descending aorta */}
              <line x1="150" y1="125" x2="150" y2="185" stroke="#ef4444" strokeWidth="3"/>
              <text x="155" y="155" fill="#ef4444" fontSize="8">Aorta</text>
              
              {/* Renal arteries */}
              <line x1="150" y1="165" x2="130" y2="165" stroke="#ef4444" strokeWidth="1.5"/>
              <line x1="150" y1="168" x2="170" y2="168" stroke="#ef4444" strokeWidth="1.5"/>
              <text x="115" y="168" fill="#ef4444" fontSize="6">Renal</text>
              
              {/* Superior mesenteric */}
              <line x1="150" y1="170" x2="140" y2="178" stroke="#ef4444" strokeWidth="1.5"/>
              <text x="125" y="178" fill="#ef4444" fontSize="6">Mesenteric</text>
              
              {/* Common iliac */}
              <path d="M 150 185 L 140 195 L 135 220" stroke="#ef4444" strokeWidth="2.5" fill="none"/>
              <path d="M 150 185 L 160 195 L 165 220" stroke="#ef4444" strokeWidth="2.5" fill="none"/>
              <text x="125" y="200" fill="#ef4444" fontSize="7">Iliac</text>
              
              {/* Femoral arteries */}
              <line x1="135" y1="220" x2="135" y2="280" stroke="#ef4444" strokeWidth="2"/>
              <line x1="165" y1="220" x2="165" y2="280" stroke="#ef4444" strokeWidth="2"/>
              <text x="120" y="250" fill="#ef4444" fontSize="7">Femoral</text>
              
              {/* Tibial arteries */}
              <line x1="135" y1="280" x2="133" y2="330" stroke="#ef4444" strokeWidth="1.5"/>
              <line x1="135" y1="280" x2="137" y2="330" stroke="#ef4444" strokeWidth="1.5"/>
              <line x1="165" y1="280" x2="163" y2="330" stroke="#ef4444" strokeWidth="1.5"/>
              <line x1="165" y1="280" x2="167" y2="330" stroke="#ef4444" strokeWidth="1.5"/>
              
              {/* SVC */}
              <line x1="148" y1="90" x2="148" y2="120" stroke="#3b82f6" strokeWidth="3"/>
              <text x="135" y="105" fill="#3b82f6" fontSize="7">SVC</text>
              
              {/* IVC */}
              <line x1="152" y1="145" x2="152" y2="185" stroke="#3b82f6" strokeWidth="3"/>
              <text x="157" y="165" fill="#3b82f6" fontSize="7">IVC</text>
              
              {/* Pulmonary arteries - animated */}
              <motion.line 
                x1="145" y1="125" x2="125" y2="115" 
                stroke="#3b82f6" strokeWidth="2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <motion.line 
                x1="155" y1="125" x2="175" y2="115" 
                stroke="#3b82f6" strokeWidth="2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <text x="110" y="113" fill="#3b82f6" fontSize="6">Pulm A</text>
              
              {/* Pulmonary veins */}
              <line x1="125" y1="108" x2="145" y2="120" stroke="#ef4444" strokeWidth="2"/>
              <line x1="175" y1="108" x2="155" y2="120" stroke="#ef4444" strokeWidth="2"/>
              <text x="177" y="113" fill="#ef4444" fontSize="6">Pulm V</text>
              
              {/* Venous return from legs */}
              <line x1="137" y1="280" x2="145" y2="195" stroke="#3b82f6" strokeWidth="2"/>
              <line x1="163" y1="280" x2="155" y2="195" stroke="#3b82f6" strokeWidth="2"/>
              <text x="168" y="250" fill="#3b82f6" fontSize="7">Femoral V</text>
            </>
          )}

          {view === 'organs' && (
            <>
              {/* Animated Brain */}
              <motion.g
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <ellipse cx="150" cy="40" rx="30" ry="25" fill="#ec4899" fillOpacity="0.6" 
                         stroke="#db2777" strokeWidth="2"/>
                {/* Brain details */}
                <path d="M 140 35 Q 145 30 150 35 T 160 35" stroke="#db2777" strokeWidth="1" fill="none"/>
                <path d="M 140 42 Q 145 38 150 42 T 160 42" stroke="#db2777" strokeWidth="1" fill="none"/>
                <text x="135" y="45" fill="white" fontSize="9">Brain</text>
              </motion.g>
              
              {/* Animated Lungs - breathing */}
              <motion.g
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 60 / (vitals?.respiratory_rate || 16),
                }}
              >
                <ellipse cx="135" cy="120" rx="18" ry="30" fill="#60a5fa" fillOpacity="0.6" 
                         stroke="#3b82f6" strokeWidth="2"/>
                {/* Lung lobes */}
                <path d="M 135 105 L 135 135" stroke="#3b82f6" strokeWidth="1"/>
                <path d="M 130 115 L 140 115" stroke="#3b82f6" strokeWidth="1"/>
                
                <ellipse cx="165" cy="120" rx="18" ry="30" fill="#60a5fa" fillOpacity="0.6" 
                         stroke="#3b82f6" strokeWidth="2"/>
                <path d="M 165 105 L 165 135" stroke="#3b82f6" strokeWidth="1"/>
                <path d="M 160 115 L 170 115" stroke="#3b82f6" strokeWidth="1"/>
                <text x="125" y="125" fill="white" fontSize="9">Lungs</text>
              </motion.g>
              
              {/* Animated Heart - beating */}
              <motion.g
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 60 / (vitals?.heart_rate || 75),
                }}
              >
                <path d="M 145 140 L 155 140 L 160 150 L 150 165 L 140 150 Z" 
                      fill="#ef4444" fillOpacity="0.8" stroke="#dc2626" strokeWidth="2"/>
                {/* Heart chambers */}
                <line x1="150" y1="140" x2="150" y2="165" stroke="#dc2626" strokeWidth="1"/>
                <line x1="145" y1="152" x2="155" y2="152" stroke="#dc2626" strokeWidth="1"/>
                <text x="143" y="153" fill="white" fontSize="8">❤</text>
              </motion.g>
              
              {/* Liver with details */}
              <ellipse cx="155" cy="180" rx="25" ry="20" fill="#a855f7" fillOpacity="0.6" 
                       stroke="#9333ea" strokeWidth="2"/>
              <path d="M 140 175 Q 155 170 170 175" stroke="#9333ea" strokeWidth="1" fill="none"/>
              <text x="140" y="185" fill="white" fontSize="9">Liver</text>
              
              {/* Stomach */}
              <ellipse cx="140" cy="175" rx="12" ry="15" fill="#10b981" fillOpacity="0.5" 
                       stroke="#059669" strokeWidth="2"/>
              <text x="132" y="178" fill="white" fontSize="7">S</text>
              
              {/* Kidneys with details */}
              <motion.g
                animate={{ opacity: [0.6, 0.8, 0.6] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <ellipse cx="130" cy="195" rx="12" ry="18" fill="#f59e0b" fillOpacity="0.6" 
                         stroke="#d97706" strokeWidth="2"/>
                <path d="M 125 195 Q 130 190 135 195" stroke="#d97706" strokeWidth="1" fill="none"/>
                
                <ellipse cx="170" cy="195" rx="12" ry="18" fill="#f59e0b" fillOpacity="0.6" 
                         stroke="#d97706" strokeWidth="2"/>
                <path d="M 165 195 Q 170 190 175 195" stroke="#d97706" strokeWidth="1" fill="none"/>
                <text x="115" y="200" fill="white" fontSize="8">K</text>
                <text x="175" y="200" fill="white" fontSize="8">K</text>
              </motion.g>
              
              {/* Intestines */}
              <path d="M 140 205 Q 145 215 150 210 T 160 215 T 150 220" 
                    stroke="#84cc16" strokeWidth="2" fill="none" opacity="0.7"/>
              <text x="142" y="218" fill="#84cc16" fontSize="7">GI</text>
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
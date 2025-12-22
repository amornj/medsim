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
  const [view, setView] = useState('organs'); // circulation, organs, skeleton, nervous
  const [zoom, setZoom] = useState(1);
  const [hoveredOrgan, setHoveredOrgan] = useState(null);

  const abnormalities = [
    { 
      id: 'heart', 
      name: 'Cardiac Dysfunction', 
      location: 'Heart', 
      severity: 'critical',
      position: { top: '32%', left: '50%' },
      active: vitals?.heart_rate < 40 || vitals?.heart_rate > 150
    },
    { 
      id: 'lungs', 
      name: 'Respiratory Failure', 
      location: 'Bilateral Lungs', 
      severity: 'severe',
      position: { top: '28%', left: '50%' },
      active: vitals?.spo2 < 85
    },
    { 
      id: 'brain', 
      name: 'Cerebral Hypoxia', 
      location: 'Brain', 
      severity: 'critical',
      position: { top: '8%', left: '50%' },
      active: vitals?.spo2 < 70
    },
    { 
      id: 'kidney', 
      name: 'Renal Hypoperfusion', 
      location: 'Kidneys', 
      severity: 'moderate',
      position: { top: '42%', left: '50%' },
      active: vitals?.blood_pressure_systolic < 80
    },
    { 
      id: 'liver', 
      name: 'Hepatic Congestion', 
      location: 'Liver', 
      severity: 'moderate',
      position: { top: '38%', left: '52%' },
      active: vitals?.blood_pressure_systolic < 70
    }
  ];

  const organs = [
    { id: 'brain', name: 'Brain', info: 'Controls all body functions', healthy: vitals?.spo2 > 90 },
    { id: 'heart', name: 'Heart', info: `HR: ${vitals?.heart_rate || '--'} bpm`, healthy: vitals?.heart_rate >= 60 && vitals?.heart_rate <= 100 },
    { id: 'lungs', name: 'Lungs', info: `RR: ${vitals?.respiratory_rate || '--'}/min, SpO₂: ${vitals?.spo2 || '--'}%`, healthy: vitals?.spo2 > 95 },
    { id: 'liver', name: 'Liver', info: 'Detoxification & metabolism', healthy: vitals?.blood_pressure_systolic > 90 },
    { id: 'stomach', name: 'Stomach', info: 'Digestive organ', healthy: true },
    { id: 'kidneys', name: 'Kidneys', info: 'Filtration & waste removal', healthy: vitals?.blood_pressure_systolic > 90 },
    { id: 'intestines', name: 'Intestines', info: 'Nutrient absorption', healthy: true },
    { id: 'spleen', name: 'Spleen', info: 'Immune function', healthy: true },
    { id: 'pancreas', name: 'Pancreas', info: 'Hormone & enzyme production', healthy: true }
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
          <div className="flex gap-2 flex-wrap">
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant={view === 'organs' ? 'default' : 'outline'}
                onClick={() => setView('organs')}
              >
                <Activity className="w-3 h-3 mr-1" />
                Organs
              </Button>
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
                variant={view === 'skeleton' ? 'default' : 'outline'}
                onClick={() => setView('skeleton')}
              >
                <Activity className="w-3 h-3 mr-1" />
                Skeleton
              </Button>
              <Button 
                size="sm" 
                variant={view === 'nervous' ? 'default' : 'outline'}
                onClick={() => setView('nervous')}
              >
                <Activity className="w-3 h-3 mr-1" />
                Nervous
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

      <div className="relative w-full h-[800px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden">
        {/* Human body outline */}
        <svg 
          className="absolute inset-0 w-full h-full transition-transform duration-300" 
          viewBox="0 0 300 600"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Improved body outline with better proportions */}
          {/* Head */}
          <ellipse cx="150" cy="45" rx="32" ry="38" fill="#1e293b" stroke="#475569" strokeWidth="2.5"/>
          <ellipse cx="150" cy="42" rx="28" ry="32" fill="#0f172a" stroke="#475569" strokeWidth="1.5"/>
          
          {/* Neck */}
          <rect x="140" y="80" width="20" height="18" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
          
          {/* Shoulders */}
          <ellipse cx="150" cy="105" rx="45" ry="12" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
          
          {/* Torso - ribcage area */}
          <path d="M 115 105 L 115 170 Q 115 180 120 185 L 150 190 L 180 185 Q 185 180 185 170 L 185 105 Z" 
                fill="#1e293b" stroke="#475569" strokeWidth="2.5"/>
          
          {/* Pelvis */}
          <ellipse cx="150" cy="200" rx="35" ry="18" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
          
          {/* Arms - upper */}
          <rect x="82" y="105" width="22" height="65" rx="11" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
          <rect x="196" y="105" width="22" height="65" rx="11" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
          
          {/* Arms - forearms */}
          <rect x="80" y="170" width="20" height="70" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
          <rect x="200" y="170" width="20" height="70" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
          
          {/* Hands */}
          <ellipse cx="90" cy="245" rx="8" ry="12" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
          <ellipse cx="210" cy="245" rx="8" ry="12" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
          
          {/* Legs - thighs */}
          <rect x="128" y="215" width="22" height="85" rx="11" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
          <rect x="150" y="215" width="22" height="85" rx="11" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
          
          {/* Legs - calves */}
          <rect x="130" y="300" width="18" height="80" rx="9" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
          <rect x="152" y="300" width="18" height="80" rx="9" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
          
          {/* Feet */}
          <ellipse cx="139" cy="385" rx="10" ry="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
          <ellipse cx="161" cy="385" rx="10" ry="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>

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

          {view === 'skeleton' && (
            <>
              {/* Skull */}
              <ellipse cx="150" cy="40" rx="30" ry="35" fill="none" stroke="#e2e8f0" strokeWidth="2.5"/>
              <circle cx="142" cy="35" r="4" fill="#e2e8f0"/>
              <circle cx="158" cy="35" r="4" fill="#e2e8f0"/>
              
              {/* Spine */}
              <line x1="150" y1="75" x2="150" y2="210" stroke="#e2e8f0" strokeWidth="3"/>
              {Array.from({length: 24}).map((_, i) => (
                <circle key={i} cx="150" cy={80 + i * 5.5} r="2.5" fill="#cbd5e1" stroke="#e2e8f0" strokeWidth="1"/>
              ))}
              
              {/* Ribs */}
              {Array.from({length: 10}).map((_, i) => (
                <g key={i}>
                  <path d={`M 150 ${115 + i * 6.5} Q ${125 - i} ${120 + i * 6.5} ${128} ${125 + i * 6.5}`} 
                        stroke="#e2e8f0" strokeWidth="1.5" fill="none"/>
                  <path d={`M 150 ${115 + i * 6.5} Q ${175 + i} ${120 + i * 6.5} ${172} ${125 + i * 6.5}`} 
                        stroke="#e2e8f0" strokeWidth="1.5" fill="none"/>
                </g>
              ))}
              
              {/* Clavicles */}
              <line x1="150" y1="100" x2="105" y2="110" stroke="#e2e8f0" strokeWidth="2.5"/>
              <line x1="150" y1="100" x2="195" y2="110" stroke="#e2e8f0" strokeWidth="2.5"/>
              
              {/* Scapula */}
              <path d="M 105 110 L 100 130 L 110 140 L 115 120 Z" stroke="#e2e8f0" strokeWidth="2" fill="none"/>
              <path d="M 195 110 L 200 130 L 190 140 L 185 120 Z" stroke="#e2e8f0" strokeWidth="2" fill="none"/>
              
              {/* Humerus */}
              <line x1="105" y1="115" x2="90" y2="175" stroke="#e2e8f0" strokeWidth="2.5"/>
              <line x1="195" y1="115" x2="210" y2="175" stroke="#e2e8f0" strokeWidth="2.5"/>
              
              {/* Radius & Ulna */}
              <line x1="90" y1="175" x2="88" y2="240" stroke="#e2e8f0" strokeWidth="2"/>
              <line x1="90" y1="175" x2="92" y2="240" stroke="#e2e8f0" strokeWidth="1.5"/>
              <line x1="210" y1="175" x2="208" y2="240" stroke="#e2e8f0" strokeWidth="2"/>
              <line x1="210" y1="175" x2="212" y2="240" stroke="#e2e8f0" strokeWidth="1.5"/>
              
              {/* Pelvis */}
              <ellipse cx="150" cy="200" rx="38" ry="20" fill="none" stroke="#e2e8f0" strokeWidth="2.5"/>
              <circle cx="135" cy="205" r="8" fill="none" stroke="#e2e8f0" strokeWidth="2"/>
              <circle cx="165" cy="205" r="8" fill="none" stroke="#e2e8f0" strokeWidth="2"/>
              
              {/* Femur */}
              <line x1="135" y1="213" x2="139" y2="300" stroke="#e2e8f0" strokeWidth="3"/>
              <line x1="165" y1="213" x2="161" y2="300" stroke="#e2e8f0" strokeWidth="3"/>
              <circle cx="135" cy="213" r="5" fill="#cbd5e1" stroke="#e2e8f0" strokeWidth="1.5"/>
              <circle cx="165" cy="213" r="5" fill="#cbd5e1" stroke="#e2e8f0" strokeWidth="1.5"/>
              
              {/* Knee joints */}
              <circle cx="139" cy="300" r="6" fill="#cbd5e1" stroke="#e2e8f0" strokeWidth="2"/>
              <circle cx="161" cy="300" r="6" fill="#cbd5e1" stroke="#e2e8f0" strokeWidth="2"/>
              
              {/* Tibia & Fibula */}
              <line x1="139" y1="306" x2="139" y2="380" stroke="#e2e8f0" strokeWidth="2.5"/>
              <line x1="136" y1="306" x2="136" y2="380" stroke="#e2e8f0" strokeWidth="1.5"/>
              <line x1="161" y1="306" x2="161" y2="380" stroke="#e2e8f0" strokeWidth="2.5"/>
              <line x1="164" y1="306" x2="164" y2="380" stroke="#e2e8f0" strokeWidth="1.5"/>
              
              <text x="135" y="420" fill="#e2e8f0" fontSize="12" fontWeight="bold">Skeletal System</text>
            </>
          )}

          {view === 'nervous' && (
            <>
              {/* Brain - detailed */}
              <motion.g
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <ellipse cx="150" cy="38" rx="28" ry="32" fill="#fbbf24" fillOpacity="0.3" 
                         stroke="#f59e0b" strokeWidth="2.5"/>
                {/* Brain hemispheres */}
                <line x1="150" y1="10" x2="150" y2="66" stroke="#f59e0b" strokeWidth="2"/>
                <path d="M 128 20 Q 135 15 142 20 Q 145 25 148 20" stroke="#f59e0b" strokeWidth="1.5" fill="none"/>
                <path d="M 152 20 Q 155 25 158 20 Q 165 15 172 20" stroke="#f59e0b" strokeWidth="1.5" fill="none"/>
                <path d="M 130 35 Q 138 30 146 35" stroke="#f59e0b" strokeWidth="1.5" fill="none"/>
                <path d="M 154 35 Q 162 30 170 35" stroke="#f59e0b" strokeWidth="1.5" fill="none"/>
                <text x="135" y="42" fill="#f59e0b" fontSize="9" fontWeight="bold">Cerebrum</text>
              </motion.g>
              
              {/* Brainstem & Spinal Cord */}
              <motion.line 
                x1="150" y1="70" x2="150" y2="210" 
                stroke="#f59e0b" strokeWidth="4"
                animate={{ opacity: [0.6, 0.9, 0.6] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
              <text x="155" y="140" fill="#f59e0b" fontSize="8">Spinal Cord</text>
              
              {/* Cervical nerves */}
              {Array.from({length: 8}).map((_, i) => (
                <g key={`cervical-${i}`}>
                  <line x1="150" y1={80 + i * 5} x2="125" y2={85 + i * 5} 
                        stroke="#fbbf24" strokeWidth="1" opacity="0.8"/>
                  <line x1="150" y1={80 + i * 5} x2="175" y2={85 + i * 5} 
                        stroke="#fbbf24" strokeWidth="1" opacity="0.8"/>
                </g>
              ))}
              
              {/* Brachial plexus */}
              <path d="M 150 110 Q 130 115 105 125" stroke="#fbbf24" strokeWidth="2" fill="none"/>
              <path d="M 150 110 Q 170 115 195 125" stroke="#fbbf24" strokeWidth="2" fill="none"/>
              
              {/* Median, ulnar, radial nerves */}
              <line x1="105" y1="125" x2="90" y2="240" stroke="#fbbf24" strokeWidth="1.5"/>
              <line x1="195" y1="125" x2="210" y2="240" stroke="#fbbf24" strokeWidth="1.5"/>
              
              {/* Thoracic nerves */}
              {Array.from({length: 12}).map((_, i) => (
                <g key={`thoracic-${i}`}>
                  <line x1="150" y1={120 + i * 5} x2="125" y2={123 + i * 5} 
                        stroke="#fbbf24" strokeWidth="0.8" opacity="0.7"/>
                  <line x1="150" y1={120 + i * 5} x2="175" y2={123 + i * 5} 
                        stroke="#fbbf24" strokeWidth="0.8" opacity="0.7"/>
                </g>
              ))}
              
              {/* Lumbar & Sacral plexus */}
              <path d="M 150 185 Q 140 195 135 215" stroke="#fbbf24" strokeWidth="2" fill="none"/>
              <path d="M 150 185 Q 160 195 165 215" stroke="#fbbf24" strokeWidth="2" fill="none"/>
              
              {/* Sciatic nerve */}
              <line x1="135" y1="215" x2="139" y2="305" stroke="#fbbf24" strokeWidth="2"/>
              <line x1="165" y1="215" x2="161" y2="305" stroke="#fbbf24" strokeWidth="2"/>
              
              {/* Tibial & Peroneal nerves */}
              <line x1="139" y1="305" x2="137" y2="380" stroke="#fbbf24" strokeWidth="1.5"/>
              <line x1="139" y1="305" x2="141" y2="380" stroke="#fbbf24" strokeWidth="1.5"/>
              <line x1="161" y1="305" x2="159" y2="380" stroke="#fbbf24" strokeWidth="1.5"/>
              <line x1="161" y1="305" x2="163" y2="380" stroke="#fbbf24" strokeWidth="1.5"/>
              
              {/* Peripheral nerve endings - animated pulses */}
              {[90, 210].map((x, idx) => (
                <motion.circle
                  key={`hand-${idx}`}
                  cx={x}
                  cy="245"
                  r="4"
                  fill="#fbbf24"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2, delay: idx * 0.3 }}
                />
              ))}
              
              {[139, 161].map((x, idx) => (
                <motion.circle
                  key={`foot-${idx}`}
                  cx={x}
                  cy="385"
                  r="4"
                  fill="#fbbf24"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2, delay: idx * 0.3 + 0.15 }}
                />
              ))}
              
              <text x="130" y="420" fill="#f59e0b" fontSize="12" fontWeight="bold">Nervous System</text>
            </>
          )}

          {view === 'organs' && (
            <>
              {/* Animated Brain with more detail */}
              <motion.g
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 3 }}
                onMouseEnter={() => setHoveredOrgan('brain')}
                onMouseLeave={() => setHoveredOrgan(null)}
              >
                <ellipse cx="150" cy="38" rx="28" ry="32" fill="#ec4899" fillOpacity="0.7" 
                         stroke="#db2777" strokeWidth="2.5"/>
                {/* Brain gyri */}
                <path d="M 130 25 Q 135 20 140 25 Q 145 30 150 25 Q 155 30 160 25 Q 165 20 170 25" 
                      stroke="#db2777" strokeWidth="1.5" fill="none"/>
                <path d="M 130 35 Q 138 30 146 35 Q 150 38 154 35 Q 162 30 170 35" 
                      stroke="#db2777" strokeWidth="1.5" fill="none"/>
                <path d="M 135 45 Q 142 42 150 45 Q 158 42 165 45" 
                      stroke="#db2777" strokeWidth="1.5" fill="none"/>
                {/* Cerebellum */}
                <ellipse cx="150" cy="58" rx="18" ry="10" fill="#ec4899" fillOpacity="0.5" 
                         stroke="#db2777" strokeWidth="1.5"/>
                <text x="135" y="42" fill="white" fontSize="9" fontWeight="bold">Brain</text>
              </motion.g>
              
              {/* Trachea */}
              <rect x="145" y="75" width="10" height="30" rx="2" fill="#3b82f6" fillOpacity="0.4" 
                    stroke="#3b82f6" strokeWidth="1.5"/>
              {Array.from({length: 5}).map((_, i) => (
                <line key={i} x1="145" y1={78 + i * 5} x2="155" y2={78 + i * 5} 
                      stroke="#3b82f6" strokeWidth="0.5"/>
              ))}
              
              {/* Bronchi */}
              <path d="M 150 105 L 135 115" stroke="#3b82f6" strokeWidth="2" fill="none"/>
              <path d="M 150 105 L 165 115" stroke="#3b82f6" strokeWidth="2" fill="none"/>
              
              {/* Animated Lungs - breathing with more detail */}
              <motion.g
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 60 / (vitals?.respiratory_rate || 16),
                }}
                onMouseEnter={() => setHoveredOrgan('lungs')}
                onMouseLeave={() => setHoveredOrgan(null)}
              >
                {/* Left Lung */}
                <ellipse cx="132" cy="130" rx="20" ry="38" fill="#60a5fa" fillOpacity="0.7" 
                         stroke="#3b82f6" strokeWidth="2.5"/>
                {/* Lung lobes - left has 2 */}
                <path d="M 132 105 L 132 155" stroke="#3b82f6" strokeWidth="1.5"/>
                <path d="M 120 125 L 144 125" stroke="#3b82f6" strokeWidth="1"/>
                
                {/* Right Lung */}
                <ellipse cx="168" cy="130" rx="20" ry="38" fill="#60a5fa" fillOpacity="0.7" 
                         stroke="#3b82f6" strokeWidth="2.5"/>
                {/* Lung lobes - right has 3 */}
                <path d="M 168 105 L 168 155" stroke="#3b82f6" strokeWidth="1.5"/>
                <path d="M 156 118 L 180 118" stroke="#3b82f6" strokeWidth="1"/>
                <path d="M 156 142 L 180 142" stroke="#3b82f6" strokeWidth="1"/>
                
                {/* Bronchioles */}
                <path d="M 135 118 Q 130 122 128 128" stroke="#3b82f6" strokeWidth="1" fill="none"/>
                <path d="M 135 122 Q 130 128 126 134" stroke="#3b82f6" strokeWidth="1" fill="none"/>
                <path d="M 165 118 Q 170 122 172 128" stroke="#3b82f6" strokeWidth="1" fill="none"/>
                <path d="M 165 122 Q 170 128 174 134" stroke="#3b82f6" strokeWidth="1" fill="none"/>
                
                <text x="118" y="135" fill="white" fontSize="9" fontWeight="bold">Lungs</text>
              </motion.g>
              
              {/* Animated Heart - beating with chambers */}
              <motion.g
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 60 / (vitals?.heart_rate || 75),
                }}
                onMouseEnter={() => setHoveredOrgan('heart')}
                onMouseLeave={() => setHoveredOrgan(null)}
              >
                {/* Heart shape */}
                <path d="M 150 168 L 140 158 L 140 150 Q 140 144 145 144 Q 150 144 150 148 Q 150 144 155 144 Q 160 144 160 150 L 160 158 Z" 
                      fill="#ef4444" fillOpacity="0.85" stroke="#dc2626" strokeWidth="2.5"/>
                
                {/* Atria */}
                <ellipse cx="145" cy="148" rx="5" ry="4" fill="#ef4444" fillOpacity="0.5" stroke="#dc2626" strokeWidth="1"/>
                <ellipse cx="155" cy="148" rx="5" ry="4" fill="#ef4444" fillOpacity="0.5" stroke="#dc2626" strokeWidth="1"/>
                
                {/* Septum */}
                <line x1="150" y1="146" x2="150" y2="168" stroke="#dc2626" strokeWidth="1.5"/>
                
                {/* Valves */}
                <line x1="145" y1="153" x2="155" y2="153" stroke="#dc2626" strokeWidth="1"/>
                <line x1="142" y1="158" x2="148" y2="158" stroke="#dc2626" strokeWidth="1"/>
                <line x1="152" y1="158" x2="158" y2="158" stroke="#dc2626" strokeWidth="1"/>
                
                {/* Coronary arteries */}
                <path d="M 145 146 Q 140 148 138 152" stroke="#ff6b6b" strokeWidth="1" fill="none"/>
                <path d="M 155 146 Q 160 148 162 152" stroke="#ff6b6b" strokeWidth="1" fill="none"/>
                
                <text x="142" y="160" fill="white" fontSize="8" fontWeight="bold">❤</text>
              </motion.g>
              
              {/* Liver with lobes */}
              <g onMouseEnter={() => setHoveredOrgan('liver')} onMouseLeave={() => setHoveredOrgan(null)}>
                <path d="M 130 170 Q 135 168 155 168 Q 175 168 180 172 L 178 188 Q 175 192 165 192 L 140 192 Q 132 192 130 188 Z" 
                      fill="#a855f7" fillOpacity="0.7" stroke="#9333ea" strokeWidth="2.5"/>
                {/* Liver segments */}
                <line x1="155" y1="168" x2="155" y2="192" stroke="#9333ea" strokeWidth="1"/>
                <line x1="142" y1="172" x2="142" y2="190" stroke="#9333ea" strokeWidth="1"/>
                <line x1="168" y1="172" x2="168" y2="190" stroke="#9333ea" strokeWidth="1"/>
                <text x="145" y="183" fill="white" fontSize="9" fontWeight="bold">Liver</text>
              </g>
              
              {/* Gallbladder */}
              <ellipse cx="165" cy="188" rx="4" ry="6" fill="#84cc16" fillOpacity="0.6" 
                       stroke="#65a30d" strokeWidth="1.5"/>
              
              {/* Stomach with layers */}
              <g onMouseEnter={() => setHoveredOrgan('stomach')} onMouseLeave={() => setHoveredOrgan(null)}>
                <path d="M 125 173 Q 122 178 122 183 Q 122 188 125 192 L 138 192 Q 141 188 141 183 Q 141 178 138 173 Z" 
                      fill="#10b981" fillOpacity="0.6" stroke="#059669" strokeWidth="2"/>
                <path d="M 125 180 Q 133 178 141 180" stroke="#059669" strokeWidth="1" fill="none"/>
                <text x="125" y="185" fill="white" fontSize="8" fontWeight="bold">S</text>
              </g>
              
              {/* Spleen */}
              <ellipse cx="118" cy="183" rx="8" ry="12" fill="#ef4444" fillOpacity="0.5" 
                       stroke="#dc2626" strokeWidth="1.5"/>
              
              {/* Pancreas */}
              <ellipse cx="145" cy="188" rx="18" ry="5" fill="#fbbf24" fillOpacity="0.6" 
                       stroke="#f59e0b" strokeWidth="1.5"/>
              
              {/* Kidneys with ureters */}
              <motion.g
                animate={{ opacity: [0.6, 0.9, 0.6] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <g onMouseEnter={() => setHoveredOrgan('kidneys')} onMouseLeave={() => setHoveredOrgan(null)}>
                  {/* Left kidney */}
                  <path d="M 122 198 Q 118 198 118 204 Q 118 210 122 212 Q 126 212 128 210 Q 130 206 128 202 Q 126 198 122 198" 
                        fill="#f59e0b" fillOpacity="0.7" stroke="#d97706" strokeWidth="2"/>
                  <ellipse cx="125" cy="205" rx="3" ry="4" fill="#d97706" fillOpacity="0.5"/>
                  <path d="M 125 209 L 132 220" stroke="#d97706" strokeWidth="1.5"/>
                  
                  {/* Right kidney */}
                  <path d="M 178 198 Q 182 198 182 204 Q 182 210 178 212 Q 174 212 172 210 Q 170 206 172 202 Q 174 198 178 198" 
                        fill="#f59e0b" fillOpacity="0.7" stroke="#d97706" strokeWidth="2"/>
                  <ellipse cx="175" cy="205" rx="3" ry="4" fill="#d97706" fillOpacity="0.5"/>
                  <path d="M 175 209 L 168 220" stroke="#d97706" strokeWidth="1.5"/>
                  
                  <text x="110" y="208" fill="white" fontSize="8" fontWeight="bold">K</text>
                  <text x="185" y="208" fill="white" fontSize="8" fontWeight="bold">K</text>
                </g>
              </motion.g>
              
              {/* Bladder */}
              <ellipse cx="150" cy="225" rx="12" ry="8" fill="#3b82f6" fillOpacity="0.5" 
                       stroke="#2563eb" strokeWidth="1.5"/>
              <line x1="132" y1="220" x2="144" y2="222" stroke="#d97706" strokeWidth="1.5"/>
              <line x1="168" y1="220" x2="156" y2="222" stroke="#d97706" strokeWidth="1.5"/>
              
              {/* Intestines - small & large */}
              <g onMouseEnter={() => setHoveredOrgan('intestines')} onMouseLeave={() => setHoveredOrgan(null)}>
                {/* Large intestine frame */}
                <path d="M 135 195 L 135 210 Q 135 215 140 215 L 160 215 Q 165 215 165 210 L 165 195" 
                      stroke="#84cc16" strokeWidth="2.5" fill="none" opacity="0.8"/>
                {/* Small intestines - coiled */}
                <path d="M 142 200 Q 145 202 148 200 Q 151 198 154 200 Q 157 202 158 200" 
                      stroke="#65a30d" strokeWidth="2" fill="none" opacity="0.7"/>
                <path d="M 143 205 Q 147 207 150 205 Q 153 203 156 205" 
                      stroke="#65a30d" strokeWidth="2" fill="none" opacity="0.7"/>
                <path d="M 144 210 Q 148 212 152 210 Q 155 208 157 210" 
                      stroke="#65a30d" strokeWidth="2" fill="none" opacity="0.7"/>
                <text x="142" y="208" fill="#84cc16" fontSize="7" fontWeight="bold">GI</text>
              </g>
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

      {/* Legend & Hovered Organ Info */}
      <div className="mt-4 flex gap-4 text-xs flex-wrap items-center">
        {view === 'circulation' && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-red-500"></div>
              <span className="text-slate-600">Arterial (Oxygenated)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-blue-500"></div>
              <span className="text-slate-600">Venous (Deoxygenated)</span>
            </div>
          </>
        )}
        {view === 'skeleton' && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-slate-300"></div>
            <span className="text-slate-600">206 bones in adult human body</span>
          </div>
        )}
        {view === 'nervous' && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-yellow-500"></div>
            <span className="text-slate-600">Central & Peripheral Nervous System</span>
          </div>
        )}
        {hoveredOrgan && (
          <Badge className="ml-auto bg-blue-600 text-white">
            {organs.find(o => o.id === hoveredOrgan)?.name}: {organs.find(o => o.id === hoveredOrgan)?.info}
          </Badge>
        )}
      </div>
    </Card>
  );
}
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, Heart, Droplets, Zap, Wind, Thermometer, Syringe, Radio, Stethoscope, Brain, Waves, ScanLine, Cpu, Repeat, Pill, ChevronDown, ChevronRight } from 'lucide-react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const EQUIPMENT_CATEGORIES = {
  cardiovascular: {
    name: '❤️ Cardiovascular Support',
    color: 'bg-red-100 border-red-300',
    equipment: [
      { id: 'ecmo', name: 'ECMO (Extracorporeal Membrane Oxygenation)', icon: Heart, color: 'bg-pink-100 text-pink-700 border-pink-300', description: 'Temporary heart/lung support' },
      { id: 'va_ecmo', name: 'VA-ECMO', icon: Heart, color: 'bg-red-100 text-red-700 border-red-300', description: 'Cardiac + respiratory failure' },
      { id: 'vv_ecmo', name: 'VV-ECMO', icon: Wind, color: 'bg-blue-100 text-blue-700 border-blue-300', description: 'Isolated respiratory failure' },
      { id: 'vav_ecmo', name: 'V-AV ECMO', icon: Heart, color: 'bg-purple-100 text-purple-700 border-purple-300', description: 'Differential hypoxia' },
      { id: 'lava_ecmo', name: 'LAVA-ECMO', icon: Heart, color: 'bg-rose-100 text-rose-700 border-rose-300', description: 'LV unloading + oxygenation' },
      { id: 'ecpella', name: 'ECPELLA (VA-ECMO + Impella)', icon: Heart, color: 'bg-pink-200 text-pink-800 border-pink-400', description: 'Cardiogenic shock with LV distension' },
      { id: 'iabp', name: 'IABP (Intra-aortic Balloon Pump)', icon: Activity, color: 'bg-orange-100 text-orange-700 border-orange-300', description: 'Coronary perfusion support' },
      { id: 'impella_cp', name: 'Impella CP', icon: Heart, color: 'bg-red-100 text-red-700 border-red-300', description: 'Acute LV support' },
      { id: 'impella_5', name: 'Impella 5.0 / 5.5', icon: Heart, color: 'bg-red-200 text-red-800 border-red-400', description: 'Advanced LV unloading' },
      { id: 'impella_rp', name: 'Impella RP', icon: Wind, color: 'bg-sky-100 text-sky-700 border-sky-300', description: 'RV failure' },
      { id: 'tandem_heart', name: 'TandemHeart', icon: Heart, color: 'bg-pink-100 text-pink-700 border-pink-300', description: 'LV bypass' },
      { id: 'heartmate_3', name: 'HeartMate 3 (LVAD)', icon: Heart, color: 'bg-rose-200 text-rose-800 border-rose-400', description: 'End-stage heart failure' },
      { id: 'centrimag', name: 'CentriMag', icon: Repeat, color: 'bg-indigo-100 text-indigo-700 border-indigo-300', description: 'Temporary biventricular support' }
    ]
  },
  respiratory: {
    name: '🫁 Respiratory / Airway',
    color: 'bg-blue-100 border-blue-300',
    equipment: [
      { id: 'ventilator', name: 'Mechanical Ventilator', icon: Wind, color: 'bg-blue-100 text-blue-700 border-blue-300', description: 'Respiratory support' },
      { id: 'hfov', name: 'HFOV (High-Frequency Oscillatory Ventilation)', icon: Waves, color: 'bg-sky-100 text-sky-700 border-sky-300', description: 'Severe ARDS' },
      { id: 'bipap', name: 'BiPAP', icon: Wind, color: 'bg-cyan-100 text-cyan-700 border-cyan-300', description: 'Hypercapnic failure' },
      { id: 'cpap', name: 'CPAP', icon: Wind, color: 'bg-blue-100 text-blue-700 border-blue-300', description: 'OSA / mild respiratory failure' },
      { id: 'hfnc', name: 'High-Flow Nasal Cannula (HFNC)', icon: Wind, color: 'bg-teal-100 text-teal-700 border-teal-300', description: 'Hypoxemic respiratory failure' },
      { id: 'jet_ventilator', name: 'Jet Ventilator', icon: Zap, color: 'bg-indigo-100 text-indigo-700 border-indigo-300', description: 'Airway surgery' }
    ]
  },
  renal: {
    name: '🩸 Renal / Blood Purification',
    color: 'bg-cyan-100 border-cyan-300',
    equipment: [
      { id: 'crrt', name: 'CRRT (Continuous Renal Replacement Therapy)', icon: Droplets, color: 'bg-cyan-100 text-cyan-700 border-cyan-300', description: 'AKI in ICU' },
      { id: 'cvvh', name: 'CVVH', icon: Droplets, color: 'bg-teal-100 text-teal-700 border-teal-300', description: 'Volume + solute removal' },
      { id: 'cvvhd', name: 'CVVHD', icon: Droplets, color: 'bg-cyan-200 text-cyan-800 border-cyan-400', description: 'Solute clearance' },
      { id: 'cvvhdf', name: 'CVVHDF', icon: Droplets, color: 'bg-sky-100 text-sky-700 border-sky-300', description: 'Combined clearance' },
      { id: 'dialysis', name: 'Intermittent Hemodialysis (IHD)', icon: Droplets, color: 'bg-blue-100 text-blue-700 border-blue-300', description: 'ESRD' },
      { id: 'sled', name: 'SLED', icon: Droplets, color: 'bg-indigo-100 text-indigo-700 border-indigo-300', description: 'Hybrid dialysis' },
      { id: 'plasmapheresis', name: 'Plasmapheresis', icon: Droplets, color: 'bg-purple-100 text-purple-700 border-purple-300', description: 'Autoimmune/toxic removal' }
    ]
  },
  neuro: {
    name: '🧠 Neuro / Monitoring',
    color: 'bg-purple-100 border-purple-300',
    equipment: [
      { id: 'eeg_monitor', name: 'EEG Monitor', icon: Brain, color: 'bg-purple-100 text-purple-700 border-purple-300', description: 'Seizure detection' },
      { id: 'icp_monitor', name: 'ICP Monitor', icon: Brain, color: 'bg-indigo-100 text-indigo-700 border-indigo-300', description: 'Intracranial pressure' },
      { id: 'brain_o2_monitor', name: 'Brain Oxygen Monitor (PbtO₂)', icon: Brain, color: 'bg-violet-100 text-violet-700 border-violet-300', description: 'Cerebral hypoxia' },
      { id: 'tcd', name: 'Transcranial Doppler', icon: Waves, color: 'bg-purple-100 text-purple-700 border-purple-300', description: 'Cerebral blood flow' }
    ]
  },
  hemodynamic: {
    name: '🫀 Hemodynamic Monitoring',
    color: 'bg-rose-100 border-rose-300',
    equipment: [
      { id: 'swan_ganz', name: 'Swan-Ganz Catheter', icon: Activity, color: 'bg-rose-100 text-rose-700 border-rose-300', description: 'Pulmonary pressures' },
      { id: 'picco', name: 'PiCCO', icon: Activity, color: 'bg-pink-100 text-pink-700 border-pink-300', description: 'Advanced hemodynamics' },
      { id: 'lidco', name: 'LiDCO', icon: Activity, color: 'bg-red-100 text-red-700 border-red-300', description: 'Cardiac output monitoring' },
      { id: 'arterial_line', name: 'Arterial Line', icon: Activity, color: 'bg-orange-100 text-orange-700 border-orange-300', description: 'Beat-to-beat BP' }
    ]
  },
  imaging: {
    name: '🩻 Imaging Machinery',
    color: 'bg-slate-100 border-slate-300',
    equipment: [
      { id: 'ct_scanner', name: 'CT Scanner', icon: ScanLine, color: 'bg-slate-100 text-slate-700 border-slate-300', description: 'Cross-sectional imaging' },
      { id: 'coronary_cta', name: 'Coronary CTA', icon: Heart, color: 'bg-gray-100 text-gray-700 border-gray-300', description: 'Non-invasive CAD assessment' },
      { id: 'mri_scanner', name: 'MRI Scanner', icon: ScanLine, color: 'bg-zinc-100 text-zinc-700 border-zinc-300', description: 'Soft tissue imaging' },
      { id: 'pet_ct', name: 'PET-CT', icon: ScanLine, color: 'bg-stone-100 text-stone-700 border-stone-300', description: 'Metabolic imaging' },
      { id: 'fluoroscopy', name: 'Fluoroscopy', icon: ScanLine, color: 'bg-neutral-100 text-neutral-700 border-neutral-300', description: 'Real-time imaging' },
      { id: 'c_arm', name: 'C-Arm', icon: ScanLine, color: 'bg-slate-200 text-slate-800 border-slate-400', description: 'Mobile fluoroscopy' }
    ]
  },
  icu_emergency: {
    name: '🧪 ICU / Emergency Support',
    color: 'bg-amber-100 border-amber-300',
    equipment: [
      { id: 'iv_pump', name: 'Infusion Pump', icon: Droplets, color: 'bg-purple-100 text-purple-700 border-purple-300', description: 'Precise drug delivery' },
      { id: 'syringe_pump', name: 'Syringe Pump', icon: Syringe, color: 'bg-indigo-100 text-indigo-700 border-indigo-300', description: 'Micro-dose infusion' },
      { id: 'defibrillator', name: 'Defibrillator', icon: Zap, color: 'bg-orange-100 text-orange-700 border-orange-300', description: 'Arrhythmia termination' },
      { id: 'aed', name: 'Automated External Defibrillator (AED)', icon: Zap, color: 'bg-yellow-100 text-yellow-700 border-yellow-300', description: 'Public cardiac arrest' },
      { id: 'lucas', name: 'Mechanical CPR Device (LUCAS)', icon: Heart, color: 'bg-red-100 text-red-700 border-red-300', description: 'High-quality CPR' },
      { id: 'cardiac_monitor', name: 'Cardiac Monitor', icon: Activity, color: 'bg-red-100 text-red-700 border-red-300', description: 'Continuous monitoring' }
    ]
  },
  anesthesia: {
    name: '🧠 Anesthesia / Procedural',
    color: 'bg-emerald-100 border-emerald-300',
    equipment: [
      { id: 'anesthesia_workstation', name: 'Anesthesia Workstation', icon: Wind, color: 'bg-emerald-100 text-emerald-700 border-emerald-300', description: 'General anesthesia delivery' },
      { id: 'tee_machine', name: 'TEE Machine', icon: Heart, color: 'bg-teal-100 text-teal-700 border-teal-300', description: 'Intra-cardiac imaging' },
      { id: 'ultrasound', name: 'Ultrasound Machine', icon: ScanLine, color: 'bg-cyan-100 text-cyan-700 border-cyan-300', description: 'Bedside diagnostics' },
      { id: 'bronchoscope', name: 'Bronchoscope', icon: Wind, color: 'bg-sky-100 text-sky-700 border-sky-300', description: 'Airway inspection' },
      { id: 'endoscope', name: 'Endoscope', icon: Activity, color: 'bg-blue-100 text-blue-700 border-blue-300', description: 'GI visualization' }
    ]
  },
  oncology: {
    name: '🧬 Oncology / Advanced Therapy',
    color: 'bg-violet-100 border-violet-300',
    equipment: [
      { id: 'linac', name: 'Linear Accelerator (LINAC)', icon: Zap, color: 'bg-violet-100 text-violet-700 border-violet-300', description: 'Radiation therapy' },
      { id: 'gamma_knife', name: 'Gamma Knife', icon: Brain, color: 'bg-purple-100 text-purple-700 border-purple-300', description: 'Stereotactic radiosurgery' },
      { id: 'apheresis', name: 'Apheresis Machine', icon: Droplets, color: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300', description: 'CAR-T prep' }
    ]
  },
  ortho_surgical: {
    name: '🦴 Ortho / Surgical',
    color: 'bg-lime-100 border-lime-300',
    equipment: [
      { id: 'da_vinci', name: 'Robotic Surgery System (da Vinci)', icon: Cpu, color: 'bg-lime-100 text-lime-700 border-lime-300', description: 'Minimally invasive surgery' },
      { id: 'ortho_navigation', name: 'Orthopedic Navigation System', icon: ScanLine, color: 'bg-green-100 text-green-700 border-green-300', description: 'Joint replacement' },
      { id: 'electrocautery', name: 'Electrocautery Unit', icon: Zap, color: 'bg-yellow-100 text-yellow-700 border-yellow-300', description: 'Tissue cutting/coagulation' }
    ]
  },
  monitoring: {
    name: '📊 Basic Monitoring',
    color: 'bg-green-100 border-green-300',
    equipment: [
      { id: 'pulse_ox', name: 'Pulse Oximeter', icon: Radio, color: 'bg-green-100 text-green-700 border-green-300', description: 'SpO2 monitoring' },
      { id: 'temp_monitor', name: 'Temperature Monitor', icon: Thermometer, color: 'bg-yellow-100 text-yellow-700 border-yellow-300', description: 'Temperature monitoring' }
    ]
  }
};

export default function EquipmentPalette() {
  const [expandedCategories, setExpandedCategories] = useState(Object.keys(EQUIPMENT_CATEGORIES));
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCategory = (categoryKey) => {
    setExpandedCategories(prev => 
      prev.includes(categoryKey) 
        ? prev.filter(k => k !== categoryKey)
        : [...prev, categoryKey]
    );
  };

  // Flatten equipment for search
  const allEquipment = Object.entries(EQUIPMENT_CATEGORIES).flatMap(([catKey, category]) =>
    category.equipment.map(eq => ({ ...eq, categoryKey, categoryName: category.name }))
  );

  const filteredEquipment = searchQuery.trim()
    ? allEquipment.filter(eq => 
        eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eq.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  let dragIndex = 0;

  return (
    <Card className="h-full shadow-lg flex flex-col">
      <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-slate-600" />
          Equipment Palette
        </CardTitle>
        <Input
          placeholder="Search equipment..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-2"
        />
      </CardHeader>
      <CardContent className="p-4 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <Droppable droppableId="palette" isDropDisabled={true}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-3"
              >
                {filteredEquipment ? (
                  // Search results
                  filteredEquipment.map((equipment) => {
                    const currentIndex = dragIndex++;
                    return (
                      <Draggable
                        key={`${equipment.id}-${currentIndex}`}
                        draggableId={`palette-${equipment.id}-${currentIndex}`}
                        index={currentIndex}
                      >
                        {(provided, snapshot) => (
                          <>
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 rounded-lg border-2 ${equipment.color} transition-all cursor-move hover:shadow-md ${
                                snapshot.isDragging ? 'shadow-xl scale-105 rotate-2' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <equipment.icon className="w-5 h-5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-sm truncate">
                                    {equipment.name}
                                  </div>
                                  <div className="text-xs opacity-75">
                                    {equipment.description}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {snapshot.isDragging && (
                              <div className={`p-3 rounded-lg border-2 ${equipment.color} opacity-50`}>
                                <div className="flex items-center gap-3">
                                  <equipment.icon className="w-5 h-5" />
                                  <div className="flex-1">
                                    <div className="font-semibold text-sm">
                                      {equipment.name}
                                    </div>
                                    <div className="text-xs opacity-75">
                                      {equipment.description}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </Draggable>
                    );
                  })
                ) : (
                  // Categorized view
                  Object.entries(EQUIPMENT_CATEGORIES).map(([categoryKey, category]) => {
                    const isExpanded = expandedCategories.includes(categoryKey);
                    return (
                      <div key={categoryKey} className="space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCategory(categoryKey)}
                          className={`w-full justify-start font-bold ${category.color} hover:opacity-80`}
                        >
                          {isExpanded ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                          {category.name}
                        </Button>
                        {isExpanded && (
                          <div className="space-y-2 ml-2">
                            {category.equipment.map((equipment) => {
                              const currentIndex = dragIndex++;
                              return (
                                <Draggable
                                  key={`${equipment.id}-${currentIndex}`}
                                  draggableId={`palette-${equipment.id}-${currentIndex}`}
                                  index={currentIndex}
                                >
                                  {(provided, snapshot) => (
                                    <>
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`p-3 rounded-lg border-2 ${equipment.color} transition-all cursor-move hover:shadow-md ${
                                          snapshot.isDragging ? 'shadow-xl scale-105 rotate-2' : ''
                                        }`}
                                      >
                                        <div className="flex items-center gap-3">
                                          <equipment.icon className="w-5 h-5 flex-shrink-0" />
                                          <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-sm truncate">
                                              {equipment.name}
                                            </div>
                                            <div className="text-xs opacity-75">
                                              {equipment.description}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {snapshot.isDragging && (
                                        <div className={`p-3 rounded-lg border-2 ${equipment.color} opacity-50`}>
                                          <div className="flex items-center gap-3">
                                            <equipment.icon className="w-5 h-5" />
                                            <div className="flex-1">
                                              <div className="font-semibold text-sm">
                                                {equipment.name}
                                              </div>
                                              <div className="text-xs opacity-75">
                                                {equipment.description}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </Draggable>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export { EQUIPMENT_CATEGORIES };
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, Heart, Droplets, Zap, Wind, Thermometer, Syringe, Radio, Stethoscope, Brain, AudioWaveform, ScanLine, Cpu, Repeat, Pill, ChevronDown, ChevronRight, Gauge, Eye, Scissors, Bone, Microscope, Siren, Truck, Users, Airplay, Monitor, Database } from 'lucide-react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const EQUIPMENT_CATEGORIES = {
  cardiovascular: {
    name: '❤️ Cardiovascular Support',
    color: 'bg-red-100 border-red-300',
    equipment: [
      { id: 'ecmo', name: 'ECMO (Extracorporeal Membrane Oxygenation)', icon: Heart, color: 'bg-pink-100 text-pink-700 border-pink-300', description: 'Flow 3-7 L/min, membrane oxygenator' },
      { id: 'va_ecmo', name: 'VA-ECMO', icon: Heart, color: 'bg-red-100 text-red-700 border-red-300', description: 'Cardiogenic shock, retrograde flow' },
      { id: 'vv_ecmo', name: 'VV-ECMO', icon: Wind, color: 'bg-blue-100 text-blue-700 border-blue-300', description: 'Severe ARDS, venous-venous' },
      { id: 'vav_ecmo', name: 'V-AV ECMO', icon: Heart, color: 'bg-purple-100 text-purple-700 border-purple-300', description: 'Differential hypoxia (Harlequin)' },
      { id: 'lava_ecmo', name: 'LAVA-ECMO', icon: Heart, color: 'bg-rose-100 text-rose-700 border-rose-300', description: 'Transseptal LA/LV vent + ECMO' },
      { id: 'ecpella', name: 'ECPELLA (VA-ECMO + Impella)', icon: Heart, color: 'bg-pink-200 text-pink-800 border-pink-400', description: 'Combined flow 5-9 L/min' },
      { id: 'cpb', name: 'Cardiopulmonary Bypass', icon: Heart, color: 'bg-red-200 text-red-800 border-red-400', description: 'Full heart-lung bypass, BP stabilization' },
      { id: 'iabp', name: 'IABP', icon: Activity, color: 'bg-orange-100 text-orange-700 border-orange-300', description: '~0.5 L/min coronary assist' },
      { id: 'impella_cp', name: 'Impella CP', icon: Heart, color: 'bg-red-100 text-red-700 border-red-300', description: 'Percutaneous, 3.5-4 L/min' },
      { id: 'impella_5', name: 'Impella 5.0 / 5.5', icon: Heart, color: 'bg-red-200 text-red-800 border-red-400', description: 'Axillary access, 5-5.5 L/min' },
      { id: 'impella_rp', name: 'Impella RP', icon: Wind, color: 'bg-sky-100 text-sky-700 border-sky-300', description: 'RV support, ~4 L/min' },
      { id: 'tandem_heart', name: 'TandemHeart', icon: Heart, color: 'bg-pink-100 text-pink-700 border-pink-300', description: 'Transseptal LA bypass, ~5 L/min' },
      { id: 'heartmate_3', name: 'HeartMate 3 (LVAD)', icon: Heart, color: 'bg-rose-200 text-rose-800 border-rose-400', description: 'Implantable continuous flow' },
      { id: 'centrimag', name: 'CentriMag', icon: Repeat, color: 'bg-indigo-100 text-indigo-700 border-indigo-300', description: 'External BiVAD, up to 10 L/min' }
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
      { id: 'swan_ganz', name: 'Swan-Ganz Catheter', icon: Heart, color: 'bg-rose-100 text-rose-700 border-rose-300', description: 'Pulmonary pressures' },
      { id: 'picco', name: 'PiCCO', icon: Gauge, color: 'bg-pink-100 text-pink-700 border-pink-300', description: 'Advanced hemodynamics' },
      { id: 'lidco', name: 'LiDCO', icon: Gauge, color: 'bg-red-100 text-red-700 border-red-300', description: 'Cardiac output monitoring' },
      { id: 'arterial_line', name: 'Arterial Line', icon: Activity, color: 'bg-orange-100 text-orange-700 border-orange-300', description: 'Beat-to-beat BP' }
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
      { id: 'pacemaker', name: 'External Pacemaker', icon: Activity, color: 'bg-indigo-100 text-indigo-700 border-indigo-300', description: 'Controls heart rate' },
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
      { id: 'temp_monitor', name: 'Temperature Monitor', icon: Thermometer, color: 'bg-yellow-100 text-yellow-700 border-yellow-300', description: 'Temperature monitoring' },
      { id: 'capnography', name: 'Capnography', icon: Waves, color: 'bg-teal-100 text-teal-700 border-teal-300', description: 'End-tidal CO2 monitoring' },
      { id: 'bis_monitor', name: 'BIS Monitor', icon: Brain, color: 'bg-purple-100 text-purple-700 border-purple-300', description: 'Depth of anesthesia' },
      { id: 'nirs', name: 'NIRS (Cerebral Oximetry)', icon: Brain, color: 'bg-pink-100 text-pink-700 border-pink-300', description: 'Brain tissue oxygenation' },
      { id: 'bladder_scanner', name: 'Bladder Scanner', icon: Monitor, color: 'bg-cyan-100 text-cyan-700 border-cyan-300', description: 'Non-invasive urine volume' }
    ]
  },
  temperature_management: {
    name: '🌡️ Temperature Management',
    color: 'bg-orange-100 border-orange-300',
    equipment: [
      { id: 'warming_blanket', name: 'Warming Blanket (Bair Hugger)', icon: Thermometer, color: 'bg-red-100 text-red-700 border-red-300', description: 'Active warming for hypothermia' },
      { id: 'cooling_blanket', name: 'Cooling Blanket', icon: Thermometer, color: 'bg-blue-100 text-blue-700 border-blue-300', description: 'Active cooling for hyperthermia' },
      { id: 'arctic_sun', name: 'Arctic Sun (Intravascular Cooling)', icon: Thermometer, color: 'bg-cyan-100 text-cyan-700 border-cyan-300', description: 'Targeted temperature management' }
    ]
  },
  imaging: {
    name: '📷 Imaging & Diagnostics',
    color: 'bg-indigo-100 border-indigo-300',
    equipment: [
      { id: 'portable_xray', name: 'Portable X-Ray', icon: ScanLine, color: 'bg-slate-100 text-slate-700 border-slate-300', description: 'Bedside radiography' },
      { id: 'ct_scanner', name: 'CT Scanner', icon: ScanLine, color: 'bg-blue-100 text-blue-700 border-blue-300', description: 'Cross-sectional imaging' },
      { id: 'mri_scanner', name: 'MRI Scanner', icon: ScanLine, color: 'bg-purple-100 text-purple-700 border-purple-300', description: 'Magnetic resonance imaging' },
      { id: 'fluoroscopy', name: 'Fluoroscopy Machine', icon: Airplay, color: 'bg-cyan-100 text-cyan-700 border-cyan-300', description: 'Real-time X-ray imaging' },
      { id: 'echo_machine', name: 'Echocardiography Machine', icon: Heart, color: 'bg-red-100 text-red-700 border-red-300', description: 'Cardiac ultrasound' },
      { id: 'vascular_ultrasound', name: 'Vascular Ultrasound', icon: Activity, color: 'bg-teal-100 text-teal-700 border-teal-300', description: 'DVT detection, vascular access' }
    ]
  },
  laboratory: {
    name: '🔬 Laboratory & Point of Care',
    color: 'bg-fuchsia-100 border-fuchsia-300',
    equipment: [
      { id: 'blood_gas_analyzer', name: 'Blood Gas Analyzer', icon: Droplets, color: 'bg-red-100 text-red-700 border-red-300', description: 'ABG, VBG analysis' },
      { id: 'glucometer', name: 'Glucometer', icon: Gauge, color: 'bg-yellow-100 text-yellow-700 border-yellow-300', description: 'Point-of-care glucose' },
      { id: 'coagulation_analyzer', name: 'Coagulation Analyzer', icon: Droplets, color: 'bg-purple-100 text-purple-700 border-purple-300', description: 'INR, PT, PTT' },
      { id: 'lactate_meter', name: 'Lactate Meter', icon: Database, color: 'bg-orange-100 text-orange-700 border-orange-300', description: 'Tissue perfusion marker' },
      { id: 'troponin_assay', name: 'Troponin Rapid Assay', icon: Heart, color: 'bg-pink-100 text-pink-700 border-pink-300', description: 'Cardiac biomarker' }
    ]
  },
  trauma_transport: {
    name: '🚑 Trauma & Transport',
    color: 'bg-red-100 border-red-300',
    equipment: [
      { id: 'c_collar', name: 'Cervical Collar', icon: Bone, color: 'bg-amber-100 text-amber-700 border-amber-300', description: 'Spinal immobilization' },
      { id: 'backboard', name: 'Backboard', icon: Bone, color: 'bg-slate-100 text-slate-700 border-slate-300', description: 'Full spinal precautions' },
      { id: 'pelvic_binder', name: 'Pelvic Binder', icon: Bone, color: 'bg-orange-100 text-orange-700 border-orange-300', description: 'Pelvic fracture stabilization' },
      { id: 'tourniquet', name: 'Tourniquet', icon: Activity, color: 'bg-red-100 text-red-700 border-red-300', description: 'Hemorrhage control' },
      { id: 'traction_splint', name: 'Traction Splint', icon: Bone, color: 'bg-yellow-100 text-yellow-700 border-yellow-300', description: 'Femur fracture' },
      { id: 'chest_seal', name: 'Chest Seal', icon: Wind, color: 'bg-blue-100 text-blue-700 border-blue-300', description: 'Open pneumothorax' },
      { id: 'fast_exam', name: 'FAST Ultrasound', icon: ScanLine, color: 'bg-cyan-100 text-cyan-700 border-cyan-300', description: 'Trauma ultrasound' }
    ]
  },
  airway: {
    name: '🫁 Airway Management',
    color: 'bg-sky-100 border-sky-300',
    equipment: [
      { id: 'laryngoscope', name: 'Laryngoscope', icon: Eye, color: 'bg-blue-100 text-blue-700 border-blue-300', description: 'Direct laryngoscopy' },
      { id: 'video_laryngoscope', name: 'Video Laryngoscope (GlideScope)', icon: Monitor, color: 'bg-cyan-100 text-cyan-700 border-cyan-300', description: 'Difficult airway management' },
      { id: 'bougie', name: 'Bougie (Gum Elastic)', icon: Syringe, color: 'bg-yellow-100 text-yellow-700 border-yellow-300', description: 'Intubation aid' },
      { id: 'lma', name: 'Laryngeal Mask Airway (LMA)', icon: Wind, color: 'bg-teal-100 text-teal-700 border-teal-300', description: 'Supraglottic airway' },
      { id: 'king_airway', name: 'King Airway', icon: Wind, color: 'bg-green-100 text-green-700 border-green-300', description: 'Emergency airway' },
      { id: 'ambu_bag', name: 'Ambu Bag (BVM)', icon: Wind, color: 'bg-lime-100 text-lime-700 border-lime-300', description: 'Manual ventilation' },
      { id: 'suction_unit', name: 'Suction Unit', icon: Droplets, color: 'bg-indigo-100 text-indigo-700 border-indigo-300', description: 'Airway clearance' }
    ]
  },
  vascular_access: {
    name: '💉 Vascular Access',
    color: 'bg-rose-100 border-rose-300',
    equipment: [
      { id: 'iv_catheter', name: 'Peripheral IV Catheter', icon: Syringe, color: 'bg-blue-100 text-blue-700 border-blue-300', description: 'Standard venous access' },
      { id: 'central_line_kit', name: 'Central Line Kit', icon: Syringe, color: 'bg-red-100 text-red-700 border-red-300', description: 'IJ, subclavian, femoral' },
      { id: 'io_drill', name: 'Intraosseous Drill (EZ-IO)', icon: Bone, color: 'bg-orange-100 text-orange-700 border-orange-300', description: 'Emergency vascular access' },
      { id: 'picc_line', name: 'PICC Line Kit', icon: Syringe, color: 'bg-purple-100 text-purple-700 border-purple-300', description: 'Peripherally inserted central' },
      { id: 'ultrasound_vascular', name: 'Ultrasound-Guided Access', icon: ScanLine, color: 'bg-cyan-100 text-cyan-700 border-cyan-300', description: 'Enhanced line placement' }
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
    category.equipment.map(eq => ({ 
      ...eq, 
      categoryKey: catKey, 
      categoryName: category.name,
      category: category.name 
    }))
  );

  const filteredEquipment = searchQuery.trim()
    ? allEquipment.filter(eq => 
        eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eq.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

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
                  filteredEquipment.map((equipment, index) => {
                    return (
                      <Draggable
                        key={`search-${equipment.id}-${index}`}
                        draggableId={`palette-${equipment.id}-${index}`}
                        index={index}
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
                  (() => {
                    let globalIndex = 0;
                    return Object.entries(EQUIPMENT_CATEGORIES).map(([categoryKey, category]) => {
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
                              {category.equipment.map((equipment, localIndex) => {
                                const currentIndex = globalIndex++;
                                return (
                                  <Draggable
                                    key={`${categoryKey}-${equipment.id}-${localIndex}`}
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
                    });
                  })()
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
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Activity, Heart, Droplets, Zap, Wind, Thermometer, Syringe, Radio, X, Settings, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const EQUIPMENT_ICONS = {
  ventilator: Wind,
  cardiac_monitor: Activity,
  defibrillator: Zap,
  iv_pump: Droplets,
  syringe_pump: Syringe,
  ecmo: Heart,
  va_ecmo: Heart,
  vv_ecmo: Heart,
  vav_ecmo: Heart,
  lava_ecmo: Heart,
  ecpella: Heart,
  cpb: Heart,
  iabp: Activity,
  impella_cp: Heart,
  impella_5: Heart,
  impella_rp: Heart,
  tandem_heart: Heart,
  heartmate_3: Heart,
  centrimag: Heart,
  dialysis: Droplets,
  crrt: Droplets,
  pulse_ox: Radio,
  temp_monitor: Thermometer,
  arterial_line: Activity,
  lucas: Heart,
  aed: Zap,
  pacemaker: Activity,
  warming_blanket: Thermometer,
  cooling_blanket: Thermometer,
  arctic_sun: Thermometer,
  hfnc: Wind,
  bipap: Wind,
  cpap: Wind,
  hfov: Wind,
  jet_ventilator: Wind,
  cvvh: Droplets,
  cvvhd: Droplets,
  cvvhdf: Droplets,
  sled: Droplets,
  plasmapheresis: Droplets,
  eeg_monitor: Activity,
  icp_monitor: Activity,
  brain_o2_monitor: Activity,
  tcd: Activity,
  swan_ganz: Activity,
  picco: Activity,
  lidco: Activity,
  anesthesia_workstation: Wind,
  tee_machine: Activity,
  ultrasound: Radio,
  bronchoscope: Wind,
  endoscope: Activity,
  linac: Radio,
  gamma_knife: Radio,
  apheresis: Droplets,
  da_vinci: Activity,
  ortho_navigation: Radio,
  electrocautery: Zap,
  fast_exam: Radio
};

const EQUIPMENT_COLORS = {
  ventilator: 'bg-blue-100 text-blue-700 border-blue-300',
  cardiac_monitor: 'bg-red-100 text-red-700 border-red-300',
  defibrillator: 'bg-orange-100 text-orange-700 border-orange-300',
  iv_pump: 'bg-purple-100 text-purple-700 border-purple-300',
  syringe_pump: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  ecmo: 'bg-pink-100 text-pink-700 border-pink-300',
  va_ecmo: 'bg-red-100 text-red-700 border-red-300',
  vv_ecmo: 'bg-blue-100 text-blue-700 border-blue-300',
  vav_ecmo: 'bg-purple-100 text-purple-700 border-purple-300',
  lava_ecmo: 'bg-rose-100 text-rose-700 border-rose-300',
  ecpella: 'bg-pink-200 text-pink-800 border-pink-400',
  cpb: 'bg-red-200 text-red-800 border-red-400',
  iabp: 'bg-orange-100 text-orange-700 border-orange-300',
  impella_cp: 'bg-red-100 text-red-700 border-red-300',
  impella_5: 'bg-red-200 text-red-800 border-red-400',
  impella_rp: 'bg-sky-100 text-sky-700 border-sky-300',
  tandem_heart: 'bg-pink-100 text-pink-700 border-pink-300',
  heartmate_3: 'bg-rose-200 text-rose-800 border-rose-400',
  centrimag: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  dialysis: 'bg-cyan-100 text-cyan-700 border-cyan-300',
  crrt: 'bg-cyan-100 text-cyan-700 border-cyan-300',
  pulse_ox: 'bg-green-100 text-green-700 border-green-300',
  temp_monitor: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  arterial_line: 'bg-rose-100 text-rose-700 border-rose-300',
  lucas: 'bg-red-100 text-red-700 border-red-300',
  aed: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  pacemaker: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  warming_blanket: 'bg-red-100 text-red-700 border-red-300',
  cooling_blanket: 'bg-blue-100 text-blue-700 border-blue-300',
  arctic_sun: 'bg-cyan-100 text-cyan-700 border-cyan-300',
  hfnc: 'bg-teal-100 text-teal-700 border-teal-300',
  bipap: 'bg-cyan-100 text-cyan-700 border-cyan-300',
  cpap: 'bg-blue-100 text-blue-700 border-blue-300',
  hfov: 'bg-sky-100 text-sky-700 border-sky-300',
  jet_ventilator: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  cvvh: 'bg-teal-100 text-teal-700 border-teal-300',
  cvvhd: 'bg-cyan-100 text-cyan-700 border-cyan-300',
  cvvhdf: 'bg-blue-100 text-blue-700 border-blue-300',
  sled: 'bg-sky-100 text-sky-700 border-sky-300',
  plasmapheresis: 'bg-purple-100 text-purple-700 border-purple-300',
  eeg_monitor: 'bg-violet-100 text-violet-700 border-violet-300',
  icp_monitor: 'bg-purple-100 text-purple-700 border-purple-300',
  brain_o2_monitor: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  tcd: 'bg-blue-100 text-blue-700 border-blue-300',
  swan_ganz: 'bg-pink-100 text-pink-700 border-pink-300',
  picco: 'bg-rose-100 text-rose-700 border-rose-300',
  lidco: 'bg-red-100 text-red-700 border-red-300',
  anesthesia_workstation: 'bg-slate-100 text-slate-700 border-slate-300',
  tee_machine: 'bg-blue-100 text-blue-700 border-blue-300',
  ultrasound: 'bg-cyan-100 text-cyan-700 border-cyan-300',
  bronchoscope: 'bg-teal-100 text-teal-700 border-teal-300',
  endoscope: 'bg-green-100 text-green-700 border-green-300',
  linac: 'bg-orange-100 text-orange-700 border-orange-300',
  gamma_knife: 'bg-red-100 text-red-700 border-red-300',
  apheresis: 'bg-purple-100 text-purple-700 border-purple-300',
  da_vinci: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  ortho_navigation: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  electrocautery: 'bg-orange-100 text-orange-700 border-orange-300',
  fast_exam: 'bg-blue-100 text-blue-700 border-blue-300'
};

const EQUIPMENT_NAMES = {
  ventilator: 'Mechanical Ventilator',
  cardiac_monitor: 'Cardiac Monitor',
  defibrillator: 'Defibrillator',
  iv_pump: 'IV Infusion Pump',
  syringe_pump: 'Syringe Pump',
  ecmo: 'ECMO',
  va_ecmo: 'VA-ECMO',
  vv_ecmo: 'VV-ECMO',
  vav_ecmo: 'V-AV ECMO',
  lava_ecmo: 'LAVA-ECMO',
  ecpella: 'ECPELLA',
  cpb: 'Cardiopulmonary Bypass',
  iabp: 'IABP',
  impella_cp: 'Impella CP',
  impella_5: 'Impella 5.0',
  impella_rp: 'Impella RP',
  tandem_heart: 'TandemHeart',
  heartmate_3: 'HeartMate 3',
  centrimag: 'CentriMag',
  dialysis: 'Dialysis',
  crrt: 'CRRT',
  pulse_ox: 'Pulse Oximeter',
  temp_monitor: 'Temperature Monitor',
  arterial_line: 'Arterial Line',
  lucas: 'LUCAS CPR Device',
  aed: 'AED',
  pacemaker: 'External Pacemaker',
  warming_blanket: 'Warming Blanket',
  cooling_blanket: 'Cooling Blanket',
  arctic_sun: 'Arctic Sun',
  hfnc: 'HFNC',
  bipap: 'BiPAP',
  cpap: 'CPAP',
  hfov: 'High-Frequency Oscillatory Ventilator',
  jet_ventilator: 'Jet Ventilator',
  cvvh: 'CVVH',
  cvvhd: 'CVVHD',
  cvvhdf: 'CVVHDF',
  sled: 'SLED',
  plasmapheresis: 'Plasmapheresis',
  eeg_monitor: 'EEG Monitor',
  icp_monitor: 'ICP Monitor',
  brain_o2_monitor: 'Brain O₂ Monitor',
  tcd: 'Transcranial Doppler',
  swan_ganz: 'Swan-Ganz Catheter',
  picco: 'PiCCO',
  lidco: 'LiDCO',
  anesthesia_workstation: 'Anesthesia Workstation',
  tee_machine: 'TEE Machine',
  ultrasound: 'Ultrasound',
  bronchoscope: 'Bronchoscope',
  endoscope: 'Endoscope',
  linac: 'Linear Accelerator',
  gamma_knife: 'Gamma Knife',
  apheresis: 'Apheresis Machine',
  da_vinci: 'Da Vinci Surgical System',
  ortho_navigation: 'Ortho Navigation System',
  electrocautery: 'Electrocautery',
  fast_exam: 'FAST Exam Ultrasound'
};

const EQUIPMENT_COSTS = {
  ventilator: 5000, cardiac_monitor: 1000, defibrillator: 3000, iv_pump: 2000, syringe_pump: 2500,
  ecmo: 50000, va_ecmo: 60000, vv_ecmo: 55000, vav_ecmo: 70000, lava_ecmo: 80000, ecpella: 90000,
  cpb: 40000, iabp: 20000, impella_cp: 45000, impella_5: 55000, impella_rp: 40000, tandem_heart: 50000,
  heartmate_3: 100000, centrimag: 60000, dialysis: 8000, crrt: 12000, pulse_ox: 500, temp_monitor: 500,
  arterial_line: 3000, lucas: 15000, aed: 4000, pacemaker: 8000, warming_blanket: 1500, cooling_blanket: 1500,
  arctic_sun: 20000, hfnc: 4000, bipap: 6000, cpap: 5000, hfov: 12000, jet_ventilator: 15000,
  cvvh: 10000, cvvhd: 10000, cvvhdf: 11000, sled: 9000, plasmapheresis: 18000, eeg_monitor: 7000,
  icp_monitor: 8000, brain_o2_monitor: 9000, tcd: 6000, swan_ganz: 5000, picco: 7000, lidco: 6500,
  anesthesia_workstation: 10000, tee_machine: 15000, ultrasound: 8000, bronchoscope: 6000,
  endoscope: 7000, linac: 80000, gamma_knife: 100000, apheresis: 20000, da_vinci: 150000,
  ortho_navigation: 50000, electrocautery: 4000
};

export default function PatientWorkspace({ equipment, onRemoveEquipment, onConfigureEquipment }) {
  return (
    <Card className="shadow-lg bg-gradient-to-br from-slate-50 to-slate-100">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Patient Workspace</h3>
          <Badge variant="outline" className="text-xs">
            {equipment.length} Device{equipment.length !== 1 ? 's' : ''} Active
          </Badge>
        </div>
        
        <Droppable droppableId="workspace">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[500px] bg-white rounded-xl border-3 border-dashed p-6 transition-all ${
                snapshot.isDraggingOver
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-slate-300'
              }`}
            >
              {equipment.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                  <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center">
                    <Activity className="w-16 h-16 text-slate-300" />
                  </div>
                  <p className="text-lg font-medium">Drag equipment here</p>
                  <p className="text-sm">Build your life support setup</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {equipment.map((item, index) => {
                    const Icon = EQUIPMENT_ICONS[item.type] || Activity;
                    const colorClass = EQUIPMENT_COLORS[item.type] || 'bg-slate-100 text-slate-700 border-slate-300';
                    const name = EQUIPMENT_NAMES[item.type] || item.type;
                    
                    const cost = EQUIPMENT_COSTS[item.type] || 0;

                    return (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 rounded-lg border-2 ${colorClass} transition-all ${
                              snapshot.isDragging ? 'shadow-2xl scale-105' : 'shadow-md'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                <div className="font-semibold text-sm">
                                  {name}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 -mt-1 -mr-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemoveEquipment(item.id, cost);
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="mb-3">
                              <Badge variant="outline" className="text-xs flex items-center gap-1 w-fit">
                                <DollarSign className="w-3 h-3" />
                                {cost.toLocaleString()}
                              </Badge>
                            </div>
                            
                            {item.settings && Object.keys(item.settings).length > 0 && (
                              <div className="space-y-1 mb-3">
                                {Object.entries(item.settings)
                                  .filter(([key, value]) => {
                                    // Skip nested objects and non-relevant fields
                                    if (typeof value === 'object' && value !== null) return false;
                                    // Skip timestamp and shock_delivered from other equipment
                                    if (key === 'timestamp' || key === 'shock_delivered') return false;
                                    return true;
                                  })
                                  .slice(0, 3)
                                  .map(([key, value]) => (
                                    <div key={key} className="text-xs flex justify-between">
                                      <span className="opacity-75 capitalize">
                                        {key.replace(/_/g, ' ')}:
                                      </span>
                                      <span className="font-medium">{String(value)}</span>
                                    </div>
                                  ))}
                              </div>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => onConfigureEquipment(item)}
                            >
                              <Settings className="w-3 h-3 mr-1" />
                              Configure
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );
}
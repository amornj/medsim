import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, RotateCcw, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import ScenarioSelector, { PRESET_SCENARIOS } from '../components/medical/ScenarioSelector';
import PatientVitals from '../components/medical/PatientVitals';
import EquipmentPalette from '../components/medical/EquipmentPalette';
import PatientWorkspace from '../components/medical/PatientWorkspace';
import EquipmentConfigDialog from '../components/medical/EquipmentConfigDialog';
import HumanAnatomyViewer from '../components/medical/HumanAnatomyViewer';
import SurgeryMenu from '../components/medical/SurgeryMenu';
import DeathImminentWarning from '../components/medical/DeathImminentWarning';

export default function MedicalScenario() {
  const [showScenarioSelector, setShowScenarioSelector] = useState(true);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [vitals, setVitals] = useState(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [surgeryMenuOpen, setSurgeryMenuOpen] = useState(false);
  const [showAnatomy, setShowAnatomy] = useState(false);
  const [patientDead, setPatientDead] = useState(false);
  
  const queryClient = useQueryClient();

  // Dynamic equipment effects on vitals
  useEffect(() => {
    if (!vitals || patientDead) return;

    const interval = setInterval(() => {
      setVitals(prev => {
        if (!prev) return prev;
        
        let newVitals = { ...prev };
        
        // VENTILATOR: Direct impact on oxygenation and respiratory rate
        const ventilator = equipment.find(eq => eq.type === 'ventilator');
        if (ventilator?.settings) {
          // Respiratory rate control
          if (ventilator.settings.respiratory_rate) {
            newVitals.respiratory_rate = parseInt(ventilator.settings.respiratory_rate);
          }
          
          // FiO2 affects SpO2
          const fio2 = parseInt(ventilator.settings.fio2) || 21;
          if (fio2 >= 80) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 1.5);
          } else if (fio2 >= 60) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 1);
          } else if (fio2 >= 40) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 0.5);
          }
          
          // PEEP affects oxygenation (higher PEEP = better recruitment)
          const peep = parseInt(ventilator.settings.peep) || 5;
          if (peep >= 12) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 0.8);
          } else if (peep >= 8) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 0.3);
          }
          
          // Tidal volume too high can cause barotrauma (decrease SpO2)
          const tidalVolume = parseInt(ventilator.settings.tidal_volume) || 500;
          if (tidalVolume > 600) {
            newVitals.spo2 = Math.max(0, prev.spo2 - 0.2);
          }
        }
        
        // VASOPRESSOR INFUSIONS: Affect blood pressure
        const norepinephrine = equipment.find(eq => 
          eq.type === 'syringe_pump' && 
          (eq.settings?.drug?.toLowerCase().includes('norepinephrine') || 
           eq.settings?.drug?.toLowerCase().includes('levophed'))
        );
        if (norepinephrine?.settings?.rate) {
          const rate = parseFloat(norepinephrine.settings.rate);
          // Norepinephrine increases BP
          newVitals.blood_pressure_systolic = Math.min(180, prev.blood_pressure_systolic + rate * 0.3);
          newVitals.blood_pressure_diastolic = Math.min(110, prev.blood_pressure_diastolic + rate * 0.2);
          newVitals.heart_rate = Math.max(40, prev.heart_rate - rate * 0.5); // Reflex bradycardia
        }
        
        // Epinephrine affects HR and BP
        const epinephrine = equipment.find(eq => 
          eq.type === 'syringe_pump' && 
          eq.settings?.drug?.toLowerCase().includes('epinephrine')
        );
        if (epinephrine?.settings?.rate) {
          const rate = parseFloat(epinephrine.settings.rate);
          newVitals.blood_pressure_systolic = Math.min(200, prev.blood_pressure_systolic + rate * 0.5);
          newVitals.heart_rate = Math.min(180, prev.heart_rate + rate * 2);
        }
        
        // Vasopressin
        const vasopressin = equipment.find(eq => 
          eq.type === 'syringe_pump' && 
          eq.settings?.drug?.toLowerCase().includes('vasopressin')
        );
        if (vasopressin?.settings?.rate) {
          const rate = parseFloat(vasopressin.settings.rate);
          newVitals.blood_pressure_systolic = Math.min(180, prev.blood_pressure_systolic + rate * 0.4);
        }
        
        // Sedatives (Propofol) - decrease BP and HR
        const propofol = equipment.find(eq => 
          eq.type === 'syringe_pump' && 
          eq.settings?.drug?.toLowerCase().includes('propofol')
        );
        if (propofol?.settings?.rate) {
          const rate = parseFloat(propofol.settings.rate);
          newVitals.blood_pressure_systolic = Math.max(50, prev.blood_pressure_systolic - rate * 0.2);
          newVitals.heart_rate = Math.max(40, prev.heart_rate - rate * 0.3);
        }
        
        // ECMO effects - powerful support
        const ecmo = equipment.find(eq => 
          eq.type === 'ecmo' || eq.type === 'va_ecmo' || eq.type === 'vv_ecmo'
        );
        if (ecmo?.settings?.flow_rate) {
          const flow = parseFloat(ecmo.settings.flow_rate);
          // VV-ECMO: respiratory support only
          if (ecmo.type === 'vv_ecmo' || ecmo.type === 'ecmo') {
            newVitals.spo2 = Math.min(100, prev.spo2 + flow * 0.3);
          }
          // VA-ECMO: cardiac + respiratory support
          if (ecmo.type === 'va_ecmo') {
            newVitals.spo2 = Math.min(100, prev.spo2 + flow * 0.4);
            newVitals.blood_pressure_systolic = Math.min(120, prev.blood_pressure_systolic + flow * 0.5);
            newVitals.blood_pressure_diastolic = Math.min(80, prev.blood_pressure_diastolic + flow * 0.3);
          }
        }
        
        // IABP - improves cardiac output
        const iabp = equipment.find(eq => eq.type === 'iabp');
        if (iabp?.settings?.enabled) {
          newVitals.blood_pressure_diastolic = Math.min(90, prev.blood_pressure_diastolic + 0.5);
          newVitals.spo2 = Math.min(100, prev.spo2 + 0.2);
        }
        
        // Mechanical CPR - Generates artificial circulation
        const lucas = equipment.find(eq => eq.type === 'lucas');
        if (lucas?.settings?.enabled !== false) {
          if (prev.heart_rate === 0) {
            // Creates artificial perfusion pressure during cardiac arrest
            newVitals.blood_pressure_systolic = Math.min(80, prev.blood_pressure_systolic + 2);
            newVitals.blood_pressure_diastolic = Math.min(50, prev.blood_pressure_diastolic + 1);
            newVitals.spo2 = Math.min(75, prev.spo2 + 0.5);
          }
        }
        
        // DEFIBRILLATOR - Successful shock can restart heart
        const defibrillator = equipment.find(eq => eq.type === 'defibrillator' || eq.type === 'aed');
        if (defibrillator?.settings?.shock_delivered && prev.heart_rate === 0) {
          const shockTimestamp = new Date(defibrillator.settings.timestamp).getTime();
          const now = Date.now();
          const timeSinceShock = now - shockTimestamp;
          
          // Gradual recovery after successful defibrillation (30 seconds)
          if (timeSinceShock < 30000) {
            const progress = timeSinceShock / 30000;
            newVitals.heart_rate = Math.floor(progress * 85);
            newVitals.blood_pressure_systolic = Math.floor(50 + progress * 60);
            newVitals.blood_pressure_diastolic = Math.floor(30 + progress * 40);
          }
        }
        
        // PACEMAKER - Overrides heart rate when active
        const pacemaker = equipment.find(eq => eq.type === 'pacemaker');
        if (pacemaker?.settings?.enabled && pacemaker.settings?.pacing_rate) {
          const pacingRate = parseInt(pacemaker.settings.pacing_rate);
          // Pacemaker sets the heart rate directly
          newVitals.heart_rate = pacingRate;
          // Stable pacing improves perfusion
          if (prev.blood_pressure_systolic < 90) {
            newVitals.blood_pressure_systolic = Math.min(100, prev.blood_pressure_systolic + 0.5);
          }
        }
        
        // Temperature management
        const tempMonitor = equipment.find(eq => eq.type === 'temp_monitor');
        if (tempMonitor?.settings?.target_temp) {
          const target = parseFloat(tempMonitor.settings.target_temp);
          if (prev.temperature < target) {
            newVitals.temperature = Math.min(target, prev.temperature + 0.05);
          } else if (prev.temperature > target) {
            newVitals.temperature = Math.max(target, prev.temperature - 0.05);
          }
        }
        
        // IV FLUID RESUSCITATION - Rate-dependent effects
        const ivPump = equipment.find(eq => 
          eq.type === 'iv_pump' && 
          eq.settings?.rate &&
          !eq.settings?.drug // Fluid only, not medications
        );
        if (ivPump?.settings?.rate) {
          const rate = parseFloat(ivPump.settings.rate);
          
          // Fluid resuscitation effects based on rate
          if (rate > 500) { // Massive fluid resuscitation (>500 ml/hr)
            newVitals.blood_pressure_systolic = Math.min(140, prev.blood_pressure_systolic + 1.2);
            newVitals.blood_pressure_diastolic = Math.min(90, prev.blood_pressure_diastolic + 0.8);
            newVitals.spo2 = Math.min(98, prev.spo2 + 0.3); // Improved perfusion
          } else if (rate > 300) { // Rapid resuscitation (300-500 ml/hr)
            newVitals.blood_pressure_systolic = Math.min(130, prev.blood_pressure_systolic + 0.6);
            newVitals.blood_pressure_diastolic = Math.min(85, prev.blood_pressure_diastolic + 0.4);
            newVitals.spo2 = Math.min(96, prev.spo2 + 0.2);
          } else if (rate > 150) { // Maintenance fluids (150-300 ml/hr)
            newVitals.blood_pressure_systolic = Math.min(120, prev.blood_pressure_systolic + 0.3);
            newVitals.spo2 = Math.min(95, prev.spo2 + 0.1);
          }
          
          // Fluid overload effects (too much too fast)
          if (rate > 1000) {
            // Pulmonary edema risk - decreases oxygenation
            newVitals.spo2 = Math.max(85, prev.spo2 - 0.5);
            newVitals.respiratory_rate = Math.min(35, prev.respiratory_rate + 0.2);
          }
        }
        
        return newVitals;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [equipment, vitals, patientDead]);

  const saveScenarioMutation = useMutation({
    mutationFn: (scenarioData) => base44.entities.Scenario.create(scenarioData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
      toast.success('Scenario saved successfully');
    },
    onError: () => {
      toast.error('Failed to save scenario');
    }
  });

  const handleSelectScenario = (scenario) => {
    setCurrentScenario(scenario);
    setVitals(scenario.vitals);
    
    // Don't auto-load equipment - make it DIY gameplay!
    setEquipment([]);
    setShowScenarioSelector(false);
    toast.success(`Scenario loaded: ${scenario.name}`, {
      description: 'Configure life support equipment yourself!'
    });
  };

  const handleCreateCustom = () => {
    setCurrentScenario({
      id: 'custom',
      name: 'Custom Scenario',
      description: 'Build your own medical scenario',
      vitals: {
        heart_rate: 80,
        blood_pressure_systolic: 120,
        blood_pressure_diastolic: 80,
        respiratory_rate: 16,
        spo2: 98,
        temperature: 37.0,
        consciousness: 'Alert'
      }
    });
    setVitals({
      heart_rate: 80,
      blood_pressure_systolic: 120,
      blood_pressure_diastolic: 80,
      respiratory_rate: 16,
      spo2: 98,
      temperature: 37.0,
      consciousness: 'Alert'
    });
    setEquipment([]);
    setShowScenarioSelector(false);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === 'palette' && destination.droppableId === 'workspace') {
      const equipmentType = result.draggableId.replace('palette-', '').split('-')[0];
      
      const newEquipment = {
        id: `${equipmentType}-${Date.now()}`,
        type: equipmentType,
        settings: {}
      };
      
      setEquipment([...equipment, newEquipment]);
      toast.success('Equipment added');
    } else if (source.droppableId === 'workspace' && destination.droppableId === 'workspace') {
      const items = Array.from(equipment);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setEquipment(items);
    }
  };

  const handleRemoveEquipment = (id) => {
    setEquipment(equipment.filter(eq => eq.id !== id));
    toast.info('Equipment removed');
  };

  const handleConfigureEquipment = (item) => {
    setSelectedEquipment(item);
    setConfigDialogOpen(true);
  };

  const handleSaveConfig = (equipmentId, settings, vitalChanges) => {
    setEquipment(equipment.map(eq => 
      eq.id === equipmentId ? { ...eq, settings } : eq
    ));
    
    // Apply vital changes if provided (e.g., from defibrillation)
    if (vitalChanges) {
      setVitals(prev => ({
        ...prev,
        ...vitalChanges
      }));
      toast.success('Vitals updated after intervention');
    } else {
      toast.success('Configuration saved');
    }
  };

  const handleSaveScenario = async () => {
    const scenarioData = {
      name: currentScenario.name,
      description: currentScenario.description,
      condition: currentScenario.id === 'custom' ? 'custom' : currentScenario.id,
      patient_vitals: vitals,
      equipment: equipment.map(eq => ({
        type: eq.type,
        settings: eq.settings
      })),
      notes: currentScenario.notes || ''
    };

    saveScenarioMutation.mutate(scenarioData);
  };

  const handleReset = () => {
    setShowScenarioSelector(true);
    setCurrentScenario(null);
    setEquipment([]);
    setVitals(null);
  };

  if (showScenarioSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Medical Life Support Simulator
            </h1>
            <p className="text-slate-600">
              Configure critical care equipment for various medical emergencies
            </p>
          </div>
          <ScenarioSelector
            onSelectScenario={handleSelectScenario}
            onCreateCustom={handleCreateCustom}
          />
        </div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 p-4 md:p-6">
        <div className="max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-1">
                {currentScenario?.name}
              </h1>
              <p className="text-slate-600">{currentScenario?.description}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setSurgeryMenuOpen(true)}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Surgery
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                New Scenario
              </Button>
              <Button
                onClick={handleSaveScenario}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                disabled={saveScenarioMutation.isPending}
              >
                <Save className="w-4 h-4" />
                Save Scenario
              </Button>
            </div>
          </div>

          {/* Death Warning */}
          <DeathImminentWarning 
            vitals={vitals} 
            onDeath={(reason) => {
              setPatientDead(true);
              toast.error(`Patient has died: ${reason.replace(/_/g, ' ').toUpperCase()}`, {
                duration: 10000,
                description: 'Scenario failed. Reset to try again.'
              });
            }}
          />

          {/* Vitals */}
          <div className="mb-6">
            <PatientVitals vitals={vitals} scenario={currentScenario} />
          </div>

          {/* Clinical Notes */}
          {currentScenario?.notes && (
            <Card className="mb-6 p-4 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-1">Clinical Notes</h3>
                  <p className="text-sm text-amber-800">{currentScenario.notes}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Anatomy Toggle */}
          <div className="mb-4 flex items-center gap-2">
            <Button
              variant={showAnatomy ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowAnatomy(!showAnatomy)}
            >
              {showAnatomy ? 'Hide' : 'Show'} Anatomy Viewer
            </Button>
          </div>

          {/* Anatomy Viewer */}
          {showAnatomy && (
            <div className="mb-6">
              <HumanAnatomyViewer vitals={vitals} scenario={currentScenario} />
            </div>
          )}

          {/* Main Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Equipment Palette */}
            <div className="lg:col-span-1">
              <EquipmentPalette />
            </div>

            {/* Patient Workspace */}
            <div className="lg:col-span-3">
              <PatientWorkspace
                equipment={equipment}
                onRemoveEquipment={handleRemoveEquipment}
                onConfigureEquipment={handleConfigureEquipment}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Dialog */}
      <EquipmentConfigDialog
        equipment={selectedEquipment}
        open={configDialogOpen}
        onClose={() => setConfigDialogOpen(false)}
        onSave={handleSaveConfig}
      />

      {/* Surgery Menu */}
      <SurgeryMenu
        open={surgeryMenuOpen}
        onClose={() => setSurgeryMenuOpen(false)}
        onPerformSurgery={(procedureId, success) => {
          if (success) {
            // Improve vitals after successful surgery
            setVitals(prev => ({
              ...prev,
              heart_rate: Math.min(100, prev.heart_rate + 10),
              blood_pressure_systolic: Math.min(120, prev.blood_pressure_systolic + 15),
              spo2: Math.min(100, prev.spo2 + 5)
            }));
          }
        }}
      />
    </DragDropContext>
  );
}
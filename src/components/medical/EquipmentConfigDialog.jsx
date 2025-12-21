import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from 'lucide-react';
import DrugDatabase from './DrugDatabase';
import ECMOBuilder from './ECMOBuilder';
import DefibrillationGame from './DefibrillationGame';
import MachineryRadarChart from './MachineryRadarChart';
import MedicationTitrator from './MedicationTitrator';

const EQUIPMENT_CONFIG_FIELDS = {
  ventilator: [
    { name: 'mode', label: 'Ventilation Mode', type: 'select', options: ['AC', 'SIMV', 'PSV', 'CPAP', 'BiPAP'] },
    { name: 'tidal_volume', label: 'Tidal Volume (ml)', type: 'number' },
    { name: 'respiratory_rate', label: 'Respiratory Rate (/min)', type: 'number' },
    { name: 'peep', label: 'PEEP (cmH2O)', type: 'number' },
    { name: 'fio2', label: 'FiO2 (%)', type: 'number' }
  ],
  cardiac_monitor: [
    { name: 'lead_config', label: 'Lead Configuration', type: 'select', options: ['3-lead', '5-lead', '12-lead'] },
    { name: 'alarm_hr_low', label: 'HR Alarm Low (bpm)', type: 'number' },
    { name: 'alarm_hr_high', label: 'HR Alarm High (bpm)', type: 'number' }
  ],
  defibrillator: [
    { name: 'mode', label: 'Mode', type: 'select', options: ['Manual', 'AED', 'Synchronized'] },
    { name: 'energy', label: 'Energy (Joules)', type: 'select', options: ['100', '150', '200', '300', '360'] },
    { name: 'pacing_rate', label: 'Pacing Rate (if applicable)', type: 'number' }
  ],
  iv_pump: [
    { name: 'medication', label: 'Medication/Fluid', type: 'text' },
    { name: 'rate', label: 'Infusion Rate (ml/hr)', type: 'number' },
    { name: 'vtbi', label: 'Volume to be Infused (ml)', type: 'number' }
  ],
  syringe_pump: [
    { name: 'drug', label: 'Drug Name', type: 'text' },
    { name: 'concentration', label: 'Concentration (mcg/ml)', type: 'number' },
    { name: 'rate', label: 'Rate (ml/hr or mcg/kg/min)', type: 'text' }
  ],
  ecmo: [
    { name: 'mode', label: 'ECMO Mode', type: 'select', options: ['VV-ECMO', 'VA-ECMO'] },
    { name: 'flow_rate', label: 'Flow Rate (L/min)', type: 'number' },
    { name: 'sweep_gas', label: 'Sweep Gas (L/min)', type: 'number' }
  ],
  dialysis: [
    { name: 'modality', label: 'Dialysis Modality', type: 'select', options: ['HD', 'CRRT', 'SLED'] },
    { name: 'blood_flow', label: 'Blood Flow (ml/min)', type: 'number' },
    { name: 'dialysate_flow', label: 'Dialysate Flow (ml/hr)', type: 'number' }
  ],
  pulse_ox: [
    { name: 'site', label: 'Probe Site', type: 'select', options: ['Finger', 'Toe', 'Ear', 'Forehead'] },
    { name: 'alarm_low', label: 'SpO2 Alarm Low (%)', type: 'number' }
  ],
  temp_monitor: [
    { name: 'site', label: 'Measurement Site', type: 'select', options: ['Core', 'Esophageal', 'Rectal', 'Bladder', 'Skin'] },
    { name: 'target_temp', label: 'Target Temperature (°C)', type: 'number' }
  ],
  arterial_line: [
    { name: 'site', label: 'Insertion Site', type: 'select', options: ['Radial', 'Femoral', 'Brachial'] },
    { name: 'transducer_level', label: 'Transducer Level', type: 'select', options: ['Phlebostatic axis', 'Right atrium'] }
  ],
  pacemaker: [
    { name: 'enabled', label: 'Pacing Enabled', type: 'select', options: ['true', 'false'] },
    { name: 'pacing_mode', label: 'Pacing Mode', type: 'select', options: ['DDD', 'VVI', 'AAI', 'VOO'] },
    { name: 'pacing_rate', label: 'Pacing Rate (bpm)', type: 'number' },
    { name: 'output', label: 'Output (mA)', type: 'number' },
    { name: 'sensitivity', label: 'Sensitivity (mV)', type: 'number' }
  ],
  lucas: [],
  aed: [],
  warming_blanket: [
    { name: 'enabled', label: 'Warming Active', type: 'select', options: ['true', 'false'] },
    { name: 'temperature', label: 'Blanket Temperature (°C)', type: 'number' },
    { name: 'target_temp', label: 'Target Patient Temp (°C)', type: 'number' }
  ],
  cooling_blanket: [
    { name: 'enabled', label: 'Cooling Active', type: 'select', options: ['true', 'false'] },
    { name: 'temperature', label: 'Blanket Temperature (°C)', type: 'number' },
    { name: 'target_temp', label: 'Target Patient Temp (°C)', type: 'number' }
  ],
  arctic_sun: [
    { name: 'enabled', label: 'System Active', type: 'select', options: ['true', 'false'] },
    { name: 'target_temp', label: 'Target Temperature (°C)', type: 'number' },
    { name: 'cooling_rate', label: 'Cooling Rate (°C/hr)', type: 'number' }
  ],
  cpb: [
    { name: 'flow_rate', label: 'Flow Rate (L/min)', type: 'number' },
    { name: 'mode', label: 'Mode', type: 'select', options: ['Full Bypass', 'Partial Bypass'] },
    { name: 'temperature', label: 'Blood Temperature (°C)', type: 'number' }
  ],
  swan_ganz: [
    { name: 'enabled', label: 'Monitoring Active', type: 'select', options: ['true', 'false'] },
    { name: 'wedge_pressure', label: 'Measure PCWP', type: 'select', options: ['true', 'false'] },
    { name: 'cardiac_output', label: 'CO Monitoring', type: 'select', options: ['Continuous', 'Intermittent'] }
  ],
  picco: [
    { name: 'enabled', label: 'System Active', type: 'select', options: ['true', 'false'] },
    { name: 'calibration', label: 'Calibration Status', type: 'select', options: ['Calibrated', 'Needs Calibration'] },
    { name: 'monitoring_mode', label: 'Monitoring', type: 'select', options: ['Full Hemodynamics', 'Basic'] }
  ],
  lidco: [
    { name: 'enabled', label: 'System Active', type: 'select', options: ['true', 'false'] },
    { name: 'sensor_type', label: 'Sensor Type', type: 'select', options: ['LiDCOplus', 'LiDCOrapid'] },
    { name: 'calibration', label: 'Calibration', type: 'select', options: ['Required', 'Not Required'] }
  ]
};

export default function EquipmentConfigDialog({ equipment, open, onClose, onSave }) {
  const [settings, setSettings] = useState(equipment?.settings || {});
  const [drugDialogOpen, setDrugDialogOpen] = useState(false);
  const [ecmoBuilderOpen, setEcmoBuilderOpen] = useState(false);
  const [defibrillationGameOpen, setDefibrillationGameOpen] = useState(false);
  const [cprGameOpen, setCprGameOpen] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const fields = equipment ? EQUIPMENT_CONFIG_FIELDS[equipment.type] || [] : [];
  
  const handleCprSuccess = () => {
    const updatedSettings = {
      ...settings,
      enabled: 'true',
      rate: 100,
      depth: 5
    };
    
    onSave(equipment.id, updatedSettings, null);
    setCprGameOpen(false);
  };

  const handleDrugSelect = (drug) => {
    setSettings({
      ...settings,
      medication: drug.name || settings.medication,
      drug: drug.name || settings.drug,
      concentration: drug.concentration,
      rate: drug.dosage
    });
  };

  const handleEcmoSave = (ecmoConfig) => {
    setSettings(ecmoConfig);
  };

  const handleSave = () => {
    onSave(equipment.id, settings, null);
    onClose();
  };

  const handleDefibrillationSuccess = () => {
    const updatedSettings = {
      ...settings,
      shock_delivered: true,
      energy: settings.energy || '200',
      timestamp: new Date().toISOString()
    };
    
    // Return vitals to normal after successful defibrillation
    const vitalChanges = {
      heart_rate: 85,
      blood_pressure_systolic: 110,
      blood_pressure_diastolic: 70,
      spo2: 95,
      consciousness: 'Responsive'
    };
    
    onSave(equipment.id, updatedSettings, vitalChanges);
    setDefibrillationGameOpen(false);
  };

  // Special handling for ECMO
  if (equipment?.type === 'ecmo' && ecmoBuilderOpen) {
    return (
      <>
        <ECMOBuilder
          open={ecmoBuilderOpen}
          onClose={() => setEcmoBuilderOpen(false)}
          onSave={handleEcmoSave}
          initialConfig={settings}
        />
      </>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Configure Equipment</DialogTitle>
                <DialogDescription>
                  Set parameters for {equipment?.type?.replace(/_/g, ' ')}
                </DialogDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChart(!showChart)}
              >
                {showChart ? 'Hide' : 'Show'} Chart
              </Button>
            </div>
          </DialogHeader>

          {showChart && equipment && (
            <div className="mb-4 bg-slate-50 p-3 rounded-lg border">
              <MachineryRadarChart equipment={equipment} />
            </div>
          )}
          
          {equipment?.type === 'ecmo' ? (
            <div className="py-8 text-center">
              <p className="text-slate-600 mb-4">ECMO requires detailed circuit configuration</p>
              <Button
                onClick={() => {
                  setEcmoBuilderOpen(true);
                  onClose();
                }}
                className="bg-pink-600 hover:bg-pink-700"
              >
                Open ECMO Builder
              </Button>
            </div>
          ) : equipment?.type === 'defibrillator' ? (
            <div className="space-y-4 py-4">
              {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  {field.type === 'select' ? (
                    <Select
                      value={settings[field.name] || ''}
                      onValueChange={(value) => setSettings({ ...settings, [field.name]: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={field.name}
                      type={field.type}
                      value={settings[field.name] || ''}
                      onChange={(e) => setSettings({ ...settings, [field.name]: e.target.value })}
                      placeholder={field.label}
                    />
                  )}
                </div>
              ))}
              <div className="pt-4 border-t space-y-3">
               <Button
                 onClick={() => setDefibrillationGameOpen(true)}
                 className="w-full bg-orange-600 hover:bg-orange-700"
               >
                 ⚡ Deliver Shock (Interactive)
               </Button>
              </div>
            </div>
          ) : equipment?.type === 'lucas' || equipment?.type === 'aed' ? (
            <div className="py-8 text-center space-y-4">
              <p className="text-slate-600 mb-4">
                {equipment.type === 'lucas' 
                  ? 'Perform CPR using the interactive minigame' 
                  : 'AED mode - perform CPR between shocks'}
              </p>
              <Button
                onClick={() => setCprGameOpen(true)}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                💓 Start CPR Minigame
              </Button>
            </div>
          ) : (equipment?.type === 'syringe_pump' || equipment?.type === 'iv_pump') && settings.drug ? (
            <div className="space-y-4 py-4">
              <MedicationTitrator
                drug={settings.drug || settings.medication || 'Unknown Drug'}
                concentration={settings.concentration || 'N/A'}
                currentRate={parseFloat(settings.rate) || 0}
                onRateChange={(newRate) => setSettings({ ...settings, rate: newRate.toString() })}
              />

              <div className="pt-4 border-t space-y-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDrugDialogOpen(true)}
                  className="w-full"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Change Drug
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    {(field.name === 'medication' || field.name === 'drug') && 
                     (equipment?.type === 'iv_pump' || equipment?.type === 'syringe_pump') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDrugDialogOpen(true)}
                        className="h-7"
                      >
                        <Search className="w-3 h-3 mr-1" />
                        Search
                      </Button>
                    )}
                  </div>
                  {field.type === 'select' ? (
                    <Select
                      value={settings[field.name] || ''}
                      onValueChange={(value) => setSettings({ ...settings, [field.name]: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={field.name}
                      type={field.type}
                      value={settings[field.name] || ''}
                      onChange={(e) => setSettings({ ...settings, [field.name]: e.target.value })}
                      placeholder={field.label}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DrugDatabase
        open={drugDialogOpen}
        onClose={() => setDrugDialogOpen(false)}
        onSelectDrug={handleDrugSelect}
        pumpType={equipment?.type}
      />

      <DefibrillationGame
        open={defibrillationGameOpen}
        onClose={() => setDefibrillationGameOpen(false)}
        onSuccess={handleDefibrillationSuccess}
        mode="defibrillation"
      />
      
      <DefibrillationGame
        open={cprGameOpen}
        onClose={() => setCprGameOpen(false)}
        onSuccess={handleCprSuccess}
        mode="cpr"
      />
    </>
  );
}
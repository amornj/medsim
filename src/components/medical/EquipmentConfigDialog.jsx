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
  ]
};

export default function EquipmentConfigDialog({ equipment, open, onClose, onSave }) {
  const [settings, setSettings] = useState(equipment?.settings || {});

  const fields = equipment ? EQUIPMENT_CONFIG_FIELDS[equipment.type] || [] : [];

  const handleSave = () => {
    onSave(equipment.id, settings);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Equipment</DialogTitle>
          <DialogDescription>
            Set parameters for {equipment?.type?.replace(/_/g, ' ')}
          </DialogDescription>
        </DialogHeader>
        
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
        </div>

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
  );
}
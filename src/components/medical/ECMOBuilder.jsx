import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Heart, Droplets, Wind, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ECMOBuilder({ open, onClose, onSave, initialConfig }) {
  const [config, setConfig] = useState(initialConfig || {
    mode: 'VV-ECMO',
    cannulation: {
      drainage: 'femoral_vein',
      return: 'internal_jugular',
      size_drainage: '25Fr',
      size_return: '21Fr'
    },
    circuit: {
      pump_type: 'centrifugal',
      oxygenator: 'PLS',
      heat_exchanger: true,
      hemofilter: false
    },
    flows: {
      blood_flow: 4.0,
      sweep_gas: 4.0,
      fio2: 100
    },
    anticoagulation: {
      type: 'heparin',
      target_act: '180-220',
      monitoring: 'ACT + anti-Xa'
    },
    alarms: {
      pressure_high: 400,
      pressure_low: -50,
      flow_low: 2.0
    }
  });

  const [warnings, setWarnings] = useState([]);

  const validateConfig = () => {
    const newWarnings = [];
    
    if (config.mode === 'VV-ECMO' && config.flows.blood_flow > 6.0) {
      newWarnings.push('High blood flow for VV-ECMO may cause recirculation');
    }
    
    if (config.mode === 'VA-ECMO' && config.flows.blood_flow < 3.0) {
      newWarnings.push('Low blood flow for VA-ECMO - may not provide adequate systemic perfusion');
    }
    
    if (config.flows.sweep_gas < config.flows.blood_flow * 0.8) {
      newWarnings.push('Low sweep gas flow may result in inadequate CO2 removal');
    }
    
    if (config.cannulation.drainage === config.cannulation.return) {
      newWarnings.push('Drainage and return sites should be different');
    }
    
    setWarnings(newWarnings);
    return newWarnings.length === 0;
  };

  const handleSave = () => {
    if (validateConfig()) {
      onSave(config);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Heart className="w-6 h-6 text-pink-600" />
            ECMO Circuit Builder
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="mode" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="mode">Mode</TabsTrigger>
            <TabsTrigger value="cannulation">Cannulation</TabsTrigger>
            <TabsTrigger value="circuit">Circuit</TabsTrigger>
            <TabsTrigger value="flows">Flows</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
          </TabsList>

          {/* Mode Selection */}
          <TabsContent value="mode" className="space-y-4">
            <Card className="p-4">
              <Label className="text-base font-semibold mb-3 block">ECMO Configuration Mode</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant={config.mode === 'VV-ECMO' ? 'default' : 'outline'}
                  className="h-auto py-4 flex flex-col items-start"
                  onClick={() => setConfig({ ...config, mode: 'VV-ECMO' })}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Wind className="w-5 h-5" />
                    <span className="font-bold">VV-ECMO</span>
                  </div>
                  <span className="text-xs text-left opacity-80">
                    Veno-Venous: Respiratory support only. Blood drained from vein, oxygenated, returned to vein. Heart must be functioning.
                  </span>
                  <Badge className="mt-2" variant="secondary">Respiratory Failure</Badge>
                </Button>
                
                <Button
                  variant={config.mode === 'VA-ECMO' ? 'default' : 'outline'}
                  className="h-auto py-4 flex flex-col items-start"
                  onClick={() => setConfig({ ...config, mode: 'VA-ECMO' })}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5" />
                    <span className="font-bold">VA-ECMO</span>
                  </div>
                  <span className="text-xs text-left opacity-80">
                    Veno-Arterial: Cardiac + respiratory support. Blood drained from vein, oxygenated, returned to artery. Bypasses heart and lungs.
                  </span>
                  <Badge className="mt-2" variant="secondary">Cardiogenic Shock</Badge>
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Cannulation */}
          <TabsContent value="cannulation" className="space-y-4">
            <Card className="p-4">
              <Label className="text-base font-semibold mb-3 block">Cannula Configuration</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Drainage Site</Label>
                  <Select
                    value={config.cannulation.drainage}
                    onValueChange={(value) => setConfig({
                      ...config,
                      cannulation: { ...config.cannulation, drainage: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="femoral_vein">Femoral Vein</SelectItem>
                      <SelectItem value="internal_jugular">Internal Jugular</SelectItem>
                      <SelectItem value="right_atrium">Right Atrium (central)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Drainage Cannula Size</Label>
                  <Select
                    value={config.cannulation.size_drainage}
                    onValueChange={(value) => setConfig({
                      ...config,
                      cannulation: { ...config.cannulation, size_drainage: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="21Fr">21 Fr</SelectItem>
                      <SelectItem value="23Fr">23 Fr</SelectItem>
                      <SelectItem value="25Fr">25 Fr</SelectItem>
                      <SelectItem value="27Fr">27 Fr</SelectItem>
                      <SelectItem value="29Fr">29 Fr</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Return Site</Label>
                  <Select
                    value={config.cannulation.return}
                    onValueChange={(value) => setConfig({
                      ...config,
                      cannulation: { ...config.cannulation, return: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {config.mode === 'VV-ECMO' ? (
                        <>
                          <SelectItem value="internal_jugular">Internal Jugular</SelectItem>
                          <SelectItem value="femoral_vein">Femoral Vein</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="femoral_artery">Femoral Artery</SelectItem>
                          <SelectItem value="axillary_artery">Axillary Artery</SelectItem>
                          <SelectItem value="ascending_aorta">Ascending Aorta (central)</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Return Cannula Size</Label>
                  <Select
                    value={config.cannulation.size_return}
                    onValueChange={(value) => setConfig({
                      ...config,
                      cannulation: { ...config.cannulation, size_return: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15Fr">15 Fr</SelectItem>
                      <SelectItem value="17Fr">17 Fr</SelectItem>
                      <SelectItem value="19Fr">19 Fr</SelectItem>
                      <SelectItem value="21Fr">21 Fr</SelectItem>
                      <SelectItem value="23Fr">23 Fr</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Circuit Components */}
          <TabsContent value="circuit" className="space-y-4">
            <Card className="p-4">
              <Label className="text-base font-semibold mb-3 block">Circuit Components</Label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Pump Type</Label>
                  <Select
                    value={config.circuit.pump_type}
                    onValueChange={(value) => setConfig({
                      ...config,
                      circuit: { ...config.circuit, pump_type: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="centrifugal">Centrifugal (Modern, less hemolysis)</SelectItem>
                      <SelectItem value="roller">Roller Pump (Traditional)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Oxygenator Type</Label>
                  <Select
                    value={config.circuit.oxygenator}
                    onValueChange={(value) => setConfig({
                      ...config,
                      circuit: { ...config.circuit, oxygenator: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PLS">Polymethylpentene (PLS) - Most common</SelectItem>
                      <SelectItem value="silicone">Silicone Membrane</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Heat Exchanger</Label>
                    <Button
                      size="sm"
                      variant={config.circuit.heat_exchanger ? 'default' : 'outline'}
                      onClick={() => setConfig({
                        ...config,
                        circuit: { ...config.circuit, heat_exchanger: !config.circuit.heat_exchanger }
                      })}
                    >
                      {config.circuit.heat_exchanger ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-600">
                    Maintains patient normothermia or induces therapeutic hypothermia
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Inline Hemofilter (CRRT)</Label>
                    <Button
                      size="sm"
                      variant={config.circuit.hemofilter ? 'default' : 'outline'}
                      onClick={() => setConfig({
                        ...config,
                        circuit: { ...config.circuit, hemofilter: !config.circuit.hemofilter }
                      })}
                    >
                      {config.circuit.hemofilter ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-600">
                    For simultaneous renal replacement therapy
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Flows */}
          <TabsContent value="flows" className="space-y-4">
            <Card className="p-4">
              <Label className="text-base font-semibold mb-3 block">Flow Parameters</Label>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Blood Flow Rate</Label>
                    <Badge variant="outline">{config.flows.blood_flow} L/min</Badge>
                  </div>
                  <Slider
                    value={[config.flows.blood_flow]}
                    onValueChange={([value]) => setConfig({
                      ...config,
                      flows: { ...config.flows, blood_flow: value }
                    })}
                    min={1}
                    max={7}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-600">
                    Target: {config.mode === 'VV-ECMO' ? '60-80% of cardiac output' : '2.5-4.5 L/min/m²'}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Sweep Gas Flow</Label>
                    <Badge variant="outline">{config.flows.sweep_gas} L/min</Badge>
                  </div>
                  <Slider
                    value={[config.flows.sweep_gas]}
                    onValueChange={([value]) => setConfig({
                      ...config,
                      flows: { ...config.flows, sweep_gas: value }
                    })}
                    min={0}
                    max={10}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-600">
                    Controls CO2 removal. Typically 0.8-1.0 times blood flow
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>FiO2 (Sweep Gas)</Label>
                    <Badge variant="outline">{config.flows.fio2}%</Badge>
                  </div>
                  <Slider
                    value={[config.flows.fio2]}
                    onValueChange={([value]) => setConfig({
                      ...config,
                      flows: { ...config.flows, fio2: value }
                    })}
                    min={21}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-600">
                    Controls oxygenation. Start at 100%, wean as tolerated
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Safety & Anticoagulation */}
          <TabsContent value="safety" className="space-y-4">
            <Card className="p-4">
              <Label className="text-base font-semibold mb-3 block">Anticoagulation Protocol</Label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Anticoagulation Type</Label>
                  <Select
                    value={config.anticoagulation.type}
                    onValueChange={(value) => setConfig({
                      ...config,
                      anticoagulation: { ...config.anticoagulation, type: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="heparin">Unfractionated Heparin (UFH)</SelectItem>
                      <SelectItem value="bivalirudin">Bivalirudin (HIT alternative)</SelectItem>
                      <SelectItem value="none">None (for contraindications)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.anticoagulation.type === 'heparin' && (
                  <div className="space-y-2">
                    <Label>Target ACT Range (seconds)</Label>
                    <Select
                      value={config.anticoagulation.target_act}
                      onValueChange={(value) => setConfig({
                        ...config,
                        anticoagulation: { ...config.anticoagulation, target_act: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="160-180">160-180 (Low risk)</SelectItem>
                        <SelectItem value="180-220">180-220 (Standard)</SelectItem>
                        <SelectItem value="220-250">220-250 (High thrombotic risk)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </Card>

            {warnings.length > 0 && (
              <Card className="p-4 bg-amber-50 border-amber-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <Label className="text-amber-900">Configuration Warnings</Label>
                    {warnings.map((warning, idx) => (
                      <p key={idx} className="text-sm text-amber-800">• {warning}</p>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-pink-600 hover:bg-pink-700">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Build ECMO Circuit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
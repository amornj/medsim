import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AIScenarioGenerator({ open, onClose, onScenarioGenerated }) {
  const [complexity, setComplexity] = useState('moderate');
  const [specialty, setSpecialty] = useState('general_icu');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const prompt = `You are a critical care medicine expert. Generate a realistic medical emergency scenario for training purposes.

Complexity Level: ${complexity}
Specialty Focus: ${specialty}
${customPrompt ? `Additional Requirements: ${customPrompt}` : ''}

Create a detailed scenario with:
1. A descriptive name and clinical description
2. Initial patient vital signs (heart_rate, blood_pressure_systolic, blood_pressure_diastolic, respiratory_rate, spo2, temperature, consciousness level)
3. Appropriate life support equipment needed (choose from: ventilator, cardiac_monitor, defibrillator, iv_pump, syringe_pump, ecmo, dialysis, pulse_ox, temp_monitor, arterial_line)
4. For each equipment, include specific settings/parameters that would be appropriate
5. Clinical management notes

The vitals should be realistic for the condition. Make it challenging but realistic.
Equipment settings should be medically appropriate and detailed.

Return ONLY valid JSON matching this exact structure:
{
  "name": "scenario name",
  "description": "clinical description",
  "condition": "custom",
  "patient_vitals": {
    "heart_rate": number,
    "blood_pressure_systolic": number,
    "blood_pressure_diastolic": number,
    "respiratory_rate": number,
    "spo2": number,
    "temperature": number,
    "consciousness": "string (Alert/Confused/Lethargic/Obtunded/Unresponsive)"
  },
  "equipment": [
    {
      "type": "equipment_type",
      "settings": {
        "key": "value"
      }
    }
  ],
  "notes": "detailed clinical management notes"
}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            condition: { type: "string" },
            patient_vitals: {
              type: "object",
              properties: {
                heart_rate: { type: "number" },
                blood_pressure_systolic: { type: "number" },
                blood_pressure_diastolic: { type: "number" },
                respiratory_rate: { type: "number" },
                spo2: { type: "number" },
                temperature: { type: "number" },
                consciousness: { type: "string" }
              }
            },
            equipment: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  settings: { type: "object" }
                }
              }
            },
            notes: { type: "string" }
          }
        }
      });

      // Add randomization to vitals for dynamic gameplay
      const scenario = {
        ...result,
        id: 'ai_generated',
        patient_vitals: {
          ...result.patient_vitals,
          heart_rate: result.patient_vitals.heart_rate + (Math.random() * 20 - 10),
          spo2: Math.max(0, Math.min(100, result.patient_vitals.spo2 + (Math.random() * 6 - 3))),
          temperature: result.patient_vitals.temperature + (Math.random() * 0.6 - 0.3)
        }
      };

      toast.success('AI Scenario Generated!');
      onScenarioGenerated(scenario);
      onClose();
    } catch (error) {
      toast.error('Failed to generate scenario');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Scenario Generator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Complexity Level</Label>
            <Select value={complexity} onValueChange={setComplexity}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Simple - Single system involvement</SelectItem>
                <SelectItem value="moderate">Moderate - Multiple systems affected</SelectItem>
                <SelectItem value="complex">Complex - Multi-organ failure, unstable</SelectItem>
                <SelectItem value="extreme">Extreme - Near-death, requires immediate intervention</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Specialty Focus</Label>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general_icu">General ICU</SelectItem>
                <SelectItem value="cardiac">Cardiac ICU</SelectItem>
                <SelectItem value="neuro">Neuro ICU</SelectItem>
                <SelectItem value="trauma">Trauma/Surgical ICU</SelectItem>
                <SelectItem value="medical">Medical ICU</SelectItem>
                <SelectItem value="pediatric">Pediatric ICU</SelectItem>
                <SelectItem value="emergency">Emergency Department</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Custom Requirements (Optional)</Label>
            <Textarea
              placeholder="E.g., 'Include a rare complication', 'Patient with multiple comorbidities', 'Post-surgical complications'..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="h-24"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isGenerating}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Scenario
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
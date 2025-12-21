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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, FileText, Loader2, Copy, Save } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export default function AIScribe({ open, onClose, onUpdateHistory, currentHistory }) {
  const [conversation, setConversation] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState(null);

  const simulateRecording = () => {
    setIsRecording(true);
    
    // Simulate recording for 3 seconds, then populate with example
    setTimeout(() => {
      setConversation(
        "Doctor: Good morning, how are you feeling today?\n" +
        "Patient: Not great, I've been having chest pain for the past 2 hours.\n" +
        "Doctor: Can you describe the pain? Is it sharp, dull, or pressure-like?\n" +
        "Patient: It feels like pressure, like someone is sitting on my chest.\n" +
        "Doctor: Does it radiate anywhere? To your arm, jaw, or back?\n" +
        "Patient: Yes, down my left arm and a bit to my jaw.\n" +
        "Doctor: Have you had any shortness of breath, nausea, or sweating?\n" +
        "Patient: Yes, I'm feeling short of breath and I've been sweating a lot.\n" +
        "Doctor: Any history of heart problems?\n" +
        "Patient: My father had a heart attack at age 55. I have high blood pressure."
      );
      setIsRecording(false);
      toast.success('Recording complete - conversation captured');
    }, 3000);
  };

  const processConversation = async () => {
    if (!conversation.trim()) {
      toast.error('Please record or enter a conversation first');
      return;
    }

    setIsProcessing(true);

    try {
      const prompt = `You are a medical scribe AI. Based on the following doctor-patient conversation, generate a comprehensive medical documentation in JSON format.

Conversation:
${conversation}

Generate the following structured data:
1. Chief Complaint
2. History of Present Illness (HPI)
3. Review of Systems (ROS)
4. SOAP Note (Subjective, Objective, Assessment, Plan)
5. Updated patient history fields (past medical history, medications, allergies if mentioned)
6. Critical findings and immediate actions needed

Return ONLY valid JSON with this structure:
{
  "chief_complaint": "string",
  "hpi": "detailed string",
  "ros": {
    "cardiovascular": "string",
    "respiratory": "string",
    "gastrointestinal": "string",
    "neurological": "string",
    "other": "string"
  },
  "soap": {
    "subjective": "string",
    "objective": "string - vital signs and physical exam",
    "assessment": "string - diagnosis/differential",
    "plan": "string - treatment plan"
  },
  "updated_history": {
    "past_medical": ["array of conditions mentioned"],
    "current_medications": ["array of medications mentioned"],
    "allergies": ["array of allergies mentioned"],
    "family_history": "string if mentioned"
  },
  "critical_findings": ["array of urgent issues"],
  "recommended_vitals_changes": {
    "heart_rate": number or null,
    "blood_pressure_systolic": number or null,
    "blood_pressure_diastolic": number or null,
    "respiratory_rate": number or null,
    "spo2": number or null,
    "temperature": number or null
  }
}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            chief_complaint: { type: "string" },
            hpi: { type: "string" },
            ros: { type: "object" },
            soap: { type: "object" },
            updated_history: { type: "object" },
            critical_findings: { type: "array" },
            recommended_vitals_changes: { type: "object" }
          }
        }
      });

      setGeneratedNotes(result);
      toast.success('Medical notes generated successfully');
    } catch (error) {
      toast.error('Failed to generate notes: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const saveToEHR = () => {
    if (!generatedNotes) return;

    const updatedHistory = {
      ...currentHistory,
      past_medical: [
        ...(currentHistory?.past_medical || []),
        ...(generatedNotes.updated_history?.past_medical || [])
      ],
      current_medications: [
        ...(currentHistory?.current_medications || []),
        ...(generatedNotes.updated_history?.current_medications || [])
      ],
      allergies: [
        ...(currentHistory?.allergies || []),
        ...(generatedNotes.updated_history?.allergies || [])
      ],
      chief_complaint: generatedNotes.chief_complaint,
      soap_note: generatedNotes.soap
    };

    onUpdateHistory(updatedHistory);
    toast.success('Patient record updated with AI-generated notes');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            AI Medical Scribe
          </DialogTitle>
          <DialogDescription>
            Record or simulate doctor-patient conversation to generate clinical documentation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Conversation Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Doctor-Patient Conversation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button
                  onClick={simulateRecording}
                  disabled={isRecording || isProcessing}
                  className="flex items-center gap-2"
                  variant={isRecording ? "destructive" : "default"}
                >
                  {isRecording ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Recording...
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      Simulate Recording
                    </>
                  )}
                </Button>
                <Button
                  onClick={processConversation}
                  disabled={!conversation.trim() || isProcessing}
                  className="flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Generate Notes
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                value={conversation}
                onChange={(e) => setConversation(e.target.value)}
                placeholder="Enter doctor-patient conversation here, or click 'Simulate Recording' for an example..."
                className="h-48 font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Generated Notes */}
          {generatedNotes && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Generated Clinical Documentation</CardTitle>
                  <Button size="sm" onClick={saveToEHR} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save to EHR
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="soap">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="soap">SOAP Note</TabsTrigger>
                    <TabsTrigger value="hpi">HPI & ROS</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="critical">Critical</TabsTrigger>
                  </TabsList>

                  <TabsContent value="soap" className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">Chief Complaint</h4>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(generatedNotes.chief_complaint)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm bg-slate-50 p-3 rounded">{generatedNotes.chief_complaint}</p>
                    </div>
                    
                    {Object.entries(generatedNotes.soap).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm capitalize">{key}</h4>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(value)}>
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-sm bg-slate-50 p-3 rounded whitespace-pre-wrap">{value}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="hpi" className="space-y-3">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">History of Present Illness</h4>
                      <p className="text-sm bg-slate-50 p-3 rounded whitespace-pre-wrap">{generatedNotes.hpi}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Review of Systems</h4>
                      {Object.entries(generatedNotes.ros).map(([system, finding]) => (
                        <div key={system} className="text-sm">
                          <span className="font-medium capitalize">{system}:</span> {finding}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="space-y-3">
                    {generatedNotes.updated_history.past_medical?.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Past Medical History</h4>
                        <ul className="list-disc list-inside text-sm bg-slate-50 p-3 rounded">
                          {generatedNotes.updated_history.past_medical.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {generatedNotes.updated_history.current_medications?.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Medications</h4>
                        <ul className="list-disc list-inside text-sm bg-slate-50 p-3 rounded">
                          {generatedNotes.updated_history.current_medications.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {generatedNotes.updated_history.family_history && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Family History</h4>
                        <p className="text-sm bg-slate-50 p-3 rounded">{generatedNotes.updated_history.family_history}</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="critical" className="space-y-3">
                    {generatedNotes.critical_findings?.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-red-600">Critical Findings</h4>
                        <ul className="space-y-2">
                          {generatedNotes.critical_findings.map((finding, idx) => (
                            <li key={idx} className="text-sm bg-red-50 border border-red-200 p-3 rounded">
                              ⚠️ {finding}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {generatedNotes.recommended_vitals_changes && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Recommended Vital Adjustments</h4>
                        <div className="text-sm bg-slate-50 p-3 rounded space-y-1">
                          {Object.entries(generatedNotes.recommended_vitals_changes)
                            .filter(([_, value]) => value !== null)
                            .map(([key, value]) => (
                              <div key={key}>
                                <span className="font-medium">{key.replace(/_/g, ' ')}:</span> {value}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
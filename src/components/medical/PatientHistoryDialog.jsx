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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, AlertTriangle, Pill, History, User } from 'lucide-react';

export default function PatientHistoryDialog({ open, onClose, history, onSave }) {
  const [patientHistory, setPatientHistory] = useState(history || {
    past_medical: [],
    current_medications: [],
    allergies: [],
    social_history: {
      smoking: '',
      alcohol: '',
      drugs: '',
      occupation: ''
    }
  });

  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newAllergy, setNewAllergy] = useState('');

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      setPatientHistory({
        ...patientHistory,
        past_medical: [...patientHistory.past_medical, newCondition.trim()]
      });
      setNewCondition('');
    }
  };

  const handleRemoveCondition = (index) => {
    setPatientHistory({
      ...patientHistory,
      past_medical: patientHistory.past_medical.filter((_, i) => i !== index)
    });
  };

  const handleAddMedication = () => {
    if (newMedication.trim()) {
      setPatientHistory({
        ...patientHistory,
        current_medications: [...patientHistory.current_medications, newMedication.trim()]
      });
      setNewMedication('');
    }
  };

  const handleRemoveMedication = (index) => {
    setPatientHistory({
      ...patientHistory,
      current_medications: patientHistory.current_medications.filter((_, i) => i !== index)
    });
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setPatientHistory({
        ...patientHistory,
        allergies: [...patientHistory.allergies, newAllergy.trim()]
      });
      setNewAllergy('');
    }
  };

  const handleRemoveAllergy = (index) => {
    setPatientHistory({
      ...patientHistory,
      allergies: patientHistory.allergies.filter((_, i) => i !== index)
    });
  };

  const handleSocialHistoryChange = (field, value) => {
    setPatientHistory({
      ...patientHistory,
      social_history: {
        ...patientHistory.social_history,
        [field]: value
      }
    });
  };

  const handleSave = () => {
    onSave(patientHistory);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Patient History & Background
          </DialogTitle>
          <DialogDescription>
            Complete patient medical history influences treatment responses and complications
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="medical" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="medical">
              <History className="w-4 h-4 mr-2" />
              Medical
            </TabsTrigger>
            <TabsTrigger value="medications">
              <Pill className="w-4 h-4 mr-2" />
              Medications
            </TabsTrigger>
            <TabsTrigger value="allergies">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Allergies
            </TabsTrigger>
            <TabsTrigger value="social">
              <User className="w-4 h-4 mr-2" />
              Social
            </TabsTrigger>
          </TabsList>

          <TabsContent value="medical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Past Medical History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add condition (e.g., Hypertension, COPD)"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCondition()}
                  />
                  <Button onClick={handleAddCondition} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {patientHistory.past_medical.map((condition, index) => (
                    <Badge key={index} variant="secondary" className="pl-3 pr-1">
                      {condition}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-2"
                        onClick={() => handleRemoveCondition(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Current Medications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add medication (e.g., Aspirin 81mg daily)"
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddMedication()}
                  />
                  <Button onClick={handleAddMedication} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {patientHistory.current_medications.map((med, index) => (
                    <Badge key={index} variant="secondary" className="pl-3 pr-1 bg-blue-100 text-blue-800">
                      {med}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-2"
                        onClick={() => handleRemoveMedication(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="allergies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Allergies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add allergy (e.g., Penicillin - anaphylaxis)"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAllergy()}
                  />
                  <Button onClick={handleAddAllergy} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {patientHistory.allergies.map((allergy, index) => (
                    <Badge key={index} variant="secondary" className="pl-3 pr-1 bg-red-100 text-red-800">
                      {allergy}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-2"
                        onClick={() => handleRemoveAllergy(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                {patientHistory.allergies.length === 0 && (
                  <p className="text-sm text-slate-500 italic">No known drug allergies (NKDA)</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Social History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smoking">Smoking History</Label>
                  <Input
                    id="smoking"
                    placeholder="e.g., 20 pack-year history, quit 5 years ago"
                    value={patientHistory.social_history.smoking}
                    onChange={(e) => handleSocialHistoryChange('smoking', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alcohol">Alcohol Use</Label>
                  <Input
                    id="alcohol"
                    placeholder="e.g., Social drinker, 2-3 drinks/week"
                    value={patientHistory.social_history.alcohol}
                    onChange={(e) => handleSocialHistoryChange('alcohol', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="drugs">Recreational Drug Use</Label>
                  <Input
                    id="drugs"
                    placeholder="e.g., Denies"
                    value={patientHistory.social_history.drugs}
                    onChange={(e) => handleSocialHistoryChange('drugs', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    placeholder="e.g., Construction worker, Teacher"
                    value={patientHistory.social_history.occupation}
                    onChange={(e) => handleSocialHistoryChange('occupation', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Patient History
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
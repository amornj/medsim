import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserCheck, Heart, Brain, Activity, Droplets, FlaskConical, Eye, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const DOCTOR_TYPES = [
  {
    id: 'cardiologist', name: 'Cardiologist', specialization: 'Heart', icon: Heart,
    perk: 'Improved outcomes on heart-related scenarios. +15% cardiac outcome bonus.',
    effect: { cardiacOutcomeBonus: 0.15, surgerySuccessBonus: 0.05 }
  },
  {
    id: 'dermatologist', name: 'Dermatologist', specialization: 'Skin', icon: UserCheck,
    perk: 'Reduced risk of skin-related complications from procedures.',
    effect: { skinComplicationReduction: 0.10 }
  },
  {
    id: 'orthopedic', name: 'Orthopedic Surgeon', specialization: 'Bone', icon: Activity,
    perk: 'Increased success rate for musculoskeletal trauma and orthopedic procedures.',
    effect: { orthoSurgerySuccessBonus: 0.10 }
  },
  {
    id: 'neurologist', name: 'Neurologist', specialization: 'Brain', icon: Brain,
    perk: 'Improved outcomes for neurological scenarios. +15% neuro outcome bonus.',
    effect: { neuroOutcomeBonus: 0.15, surgerySuccessBonus: 0.05 }
  },
  {
    id: 'pediatrician', name: 'Pediatrician', specialization: 'Child', icon: UserCheck,
    perk: 'Patient history will be child-appropriate (no smoking/alcohol). +15% pediatric bonus.',
    effect: { pediatricComplicationReduction: 0.15, historyFilter: ['no_smoking', 'no_alcohol', 'young_age'] }
  },
  {
    id: 'ophthalmologist', name: 'Ophthalmologist', specialization: 'Eyes', icon: Eye,
    perk: 'Improved diagnostic accuracy for vision-related symptoms.',
    effect: { visionDiagnosticBonus: 0.10 }
  },
  {
    id: 'nephrologist', name: 'Nephrologist', specialization: 'Kidney', icon: Droplets,
    perk: 'Improved management of renal issues and dialysis.',
    effect: { renalOutcomeBonus: 0.15 }
  },
  {
    id: 'surgeon', name: 'Surgeon', specialization: 'Surgery', icon: Scissors,
    perk: 'Lower chance of failing surgeries. -15% surgery failure rate.',
    effect: { surgeryFailureReduction: 0.15, complicationReduction: 0.05 }
  },
  {
    id: 'oncologist', name: 'Oncologist', specialization: 'Cancer', icon: FlaskConical,
    perk: 'Better management of cancer-related complications.',
    effect: { oncologyManagementBonus: 0.10 }
  },
  {
    id: 'psychiatrist', name: 'Psychiatrist', specialization: 'Mind', icon: Brain,
    perk: 'Improved management of psychiatric crises.',
    effect: { psychManagementBonus: 0.10 }
  },
  {
    id: 'hepatologist', name: 'Hepatologist', specialization: 'Liver', icon: Droplets,
    perk: 'Better outcomes for liver diseases. +15% liver outcome bonus.',
    effect: { liverOutcomeBonus: 0.15 }
  },
  {
    id: 'pulmonologist', name: 'Pulmonologist', specialization: 'Lungs', icon: Activity,
    perk: 'Better outcomes for respiratory conditions. +15% respiratory bonus.',
    effect: { lungOutcomeBonus: 0.15 }
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function DoctorSelector({ onSelectDoctors, onBack, gameMode }) {
  const [selectedDoctors, setSelectedDoctors] = useState([]);

  const maxSelections = gameMode.id === 'specialist' ? 3 : gameMode.id === 'sandbox' ? Infinity : 1;

  const handleDoctorToggle = (doctor) => {
    setSelectedDoctors(prev => {
      if (prev.find(d => d.id === doctor.id)) {
        return prev.filter(d => d.id !== doctor.id);
      } else {
        if (prev.length < maxSelections) {
          return [...prev, doctor];
        } else {
          if (maxSelections === 1) {
            toast.error(`You can only select 1 doctor in ${gameMode.name} mode.`);
          } else {
            toast.error(`You can only select up to ${maxSelections} doctors.`);
          }
          return prev;
        }
      }
    });
  };

  const handleConfirm = () => {
    if (selectedDoctors.length === 0) {
      toast.error('Please select at least one doctor.');
      return;
    }
    onSelectDoctors(selectedDoctors);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Select Your Doctor(s)</h1>
          <p className="text-slate-600">Choose your medical expertise for this scenario.</p>
          {maxSelections === Infinity ? (
            <p className="text-sm text-slate-500">Sandbox mode: Select any number of doctors.</p>
          ) : maxSelections === 1 ? (
            <p className="text-sm text-slate-500">{gameMode.name} mode: Select 1 doctor.</p>
          ) : (
            <p className="text-sm text-slate-500">{gameMode.name} mode: Select up to {maxSelections} doctors.</p>
          )}
        </motion.div>

        <ScrollArea className="h-[500px] mb-6 pr-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate="show"
          >
            {DOCTOR_TYPES.map((doctor) => {
              const Icon = doctor.icon;
              const isSelected = selectedDoctors.some(d => d.id === doctor.id);
              return (
                <motion.div
                  key={doctor.id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`hover:shadow-xl transition-shadow cursor-pointer border-2 h-full ${isSelected ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50' : 'border-slate-200'}`}
                    onClick={() => handleDoctorToggle(doctor)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shadow-sm">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg leading-tight">{doctor.name}</CardTitle>
                            <Badge variant="outline" className="mt-1 text-blue-600 border-blue-200 bg-blue-50">
                              {doctor.specialization}
                            </Badge>
                          </div>
                        </div>
                        {isSelected && <UserCheck className="w-5 h-5 text-blue-600" />}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600">{doctor.perk}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </ScrollArea>

        <motion.div 
          className="text-center flex justify-center gap-4 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button variant="outline" onClick={onBack}>
            Back to Game Mode
          </Button>
          <Button onClick={handleConfirm}>
            Confirm Doctor(s) ({selectedDoctors.length}{maxSelections !== Infinity ? `/${maxSelections}` : ''})
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
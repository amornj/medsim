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
    id: 'interventional_cardiologist', name: 'Interventional Cardiologist', specialization: 'Heart', icon: Heart,
    perk: 'Catheter-based procedures. +20% acute coronary intervention success, 15% lower complications.',
    effect: { coronaryInterventionBonus: 0.20, complicationReduction: 0.15 }
  },
  {
    id: 'electrophysiologist', name: 'Electrophysiologist', specialization: 'Heart', icon: Activity,
    perk: 'Arrhythmia treatment. 25% lower arrhythmia recurrence, +20% device optimization.',
    effect: { arrhythmiaControl: 0.25, deviceOptimization: 0.20 }
  },
  {
    id: 'heart_failure_cardiologist', name: 'Heart Failure Cardiologist', specialization: 'Heart', icon: Heart,
    perk: 'Advanced HF management. +15% survival in heart failure, 20% lower readmission.',
    effect: { hfSurvivalBonus: 0.15, readmissionReduction: 0.20 }
  },
  {
    id: 'imaging_cardiologist', name: 'Imaging Cardiologist', specialization: 'Heart', icon: Eye,
    perk: 'Cardiac imaging expert. +30% diagnostic accuracy, 20% lower misdiagnosis risk.',
    effect: { diagnosticAccuracy: 0.30, misdiagnosisReduction: 0.20 }
  },
  {
    id: 'preventive_cardiologist', name: 'Preventive Cardiologist', specialization: 'Heart', icon: Heart,
    perk: 'Risk reduction focus. 25% reduction in future cardiac events, +20% long-term stability.',
    effect: { eventReduction: 0.25, longTermStability: 0.20 }
  },
  {
    id: 'adult_congenital_cardiologist', name: 'Adult Congenital Cardiologist', specialization: 'Heart', icon: Heart,
    perk: 'Congenital heart disease. +20% long-term survival, 15% lower complication rate.',
    effect: { congenitalSurvivalBonus: 0.20, complicationReduction: 0.15 }
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
    id: 'trauma_orthopedist', name: 'Trauma Orthopedist', specialization: 'Bone', icon: Activity,
    perk: 'Fractures & injuries. 20% faster bone union, +15% limb salvage rate.',
    effect: { boneUnionSpeed: 0.20, limbSalvage: 0.15 }
  },
  {
    id: 'spine_surgeon', name: 'Spine Surgeon', specialization: 'Spine', icon: Activity,
    perk: 'Spine surgery. 20% lower nerve injury risk, +15% pain resolution.',
    effect: { nerveInjuryReduction: 0.20, painResolution: 0.15 }
  },
  {
    id: 'sports_medicine_orthopedist', name: 'Sports Medicine Orthopedist', specialization: 'Sports', icon: Activity,
    perk: 'Athletic injuries. 30% faster return to sport, 15% reinjury reduction.',
    effect: { recoverySpeed: 0.30, reinjuryReduction: 0.15 }
  },
  {
    id: 'joint_replacement', name: 'Joint Replacement Specialist', specialization: 'Joints', icon: Activity,
    perk: 'Hip/knee arthroplasty. 25% implant longevity, 20% faster mobility recovery.',
    effect: { implantLongevity: 0.25, mobilityRecovery: 0.20 }
  },
  {
    id: 'hand_surgeon', name: 'Hand Surgeon', specialization: 'Hand', icon: Activity,
    perk: 'Hand & wrist surgery. +25% fine motor recovery, 15% lower stiffness rate.',
    effect: { fineMotorRecovery: 0.25, stiffnessReduction: 0.15 }
  },
  {
    id: 'pediatric_orthopedist', name: 'Pediatric Orthopedist', specialization: 'Bone', icon: UserCheck,
    perk: 'Childrens bone disorders. 20% growth preservation, 15% deformity correction.',
    effect: { growthPreservation: 0.20, deformityCorrection: 0.15 }
  },
  {
    id: 'neurologist', name: 'Neurologist', specialization: 'Brain', icon: Brain,
    perk: 'Improved outcomes for neurological scenarios. +15% neuro outcome bonus.',
    effect: { neuroOutcomeBonus: 0.15, surgerySuccessBonus: 0.05 }
  },
  {
    id: 'stroke_neurologist', name: 'Stroke Neurologist', specialization: 'Brain', icon: Brain,
    perk: 'Acute stroke care. +25% good neurological outcome, 20% faster reperfusion decisions.',
    effect: { strokeOutcomeBonus: 0.25, reperfusionSpeed: 0.20 }
  },
  {
    id: 'epileptologist', name: 'Epileptologist', specialization: 'Brain', icon: Brain,
    perk: 'Seizure disorders. 30% seizure reduction, 15% lower medication failure.',
    effect: { seizureReduction: 0.30, medicationFailureReduction: 0.15 }
  },
  {
    id: 'neurocritical_care', name: 'Neurocritical Care Specialist', specialization: 'Brain', icon: Brain,
    perk: 'ICU neuro patients. +20% ICU survival, 15% lower secondary brain injury.',
    effect: { neuroIcuSurvival: 0.20, brainInjuryReduction: 0.15 }
  },
  {
    id: 'movement_disorder', name: 'Movement Disorder Specialist', specialization: 'Brain', icon: Brain,
    perk: 'Parkinsons, tremor. 25% symptom control, +15% functional mobility.',
    effect: { symptomControl: 0.25, mobilityImprovement: 0.15 }
  },
  {
    id: 'ms_specialist', name: 'MS Specialist', specialization: 'Brain', icon: Brain,
    perk: 'Multiple sclerosis. 20% slower disease progression, +15% relapse prevention.',
    effect: { progressionSlowing: 0.20, relapsePrevention: 0.15 }
  },
  {
    id: 'dementia_specialist', name: 'Dementia Specialist', specialization: 'Brain', icon: Brain,
    perk: 'Cognitive disorders. 15% slower cognitive decline, +10% quality-of-life preservation.',
    effect: { cognitiveDeclineSlowing: 0.15, qualityOfLife: 0.10 }
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
    id: 'general_surgeon', name: 'General Surgeon', specialization: 'Surgery', icon: Scissors,
    perk: 'Abdominal & soft-tissue surgery. 15% lower failure, +10% faster recovery.',
    effect: { surgeryFailureReduction: 0.15, recoverySpeed: 0.10 }
  },
  {
    id: 'trauma_surgeon', name: 'Trauma Surgeon', specialization: 'Trauma', icon: Scissors,
    perk: 'Emergency life-saving surgery. +25% survival in trauma, 20% faster hemorrhage control.',
    effect: { traumaSurvivalBonus: 0.25, hemorrhageControl: 0.20 }
  },
  {
    id: 'vascular_surgeon', name: 'Vascular Surgeon', specialization: 'Vascular', icon: Activity,
    perk: 'Arteries & veins surgery. 20% lower ischemic complications, +15% graft patency.',
    effect: { ischemicReduction: 0.20, graftPatency: 0.15 }
  },
  {
    id: 'colorectal_surgeon', name: 'Colorectal Surgeon', specialization: 'Bowel', icon: Scissors,
    perk: 'Colon & rectal surgery. 15% lower leak risk, +10% bowel function recovery.',
    effect: { leakReduction: 0.15, bowelRecovery: 0.10 }
  },
  {
    id: 'hepatobiliary_surgeon', name: 'Hepatobiliary Surgeon', specialization: 'Liver', icon: Droplets,
    perk: 'Liver, pancreas, biliary surgery. 20% lower liver failure, +15% resection success.',
    effect: { liverFailureReduction: 0.20, resectionSuccess: 0.15 }
  },
  {
    id: 'cardiothoracic_surgeon', name: 'Cardiothoracic Surgeon', specialization: 'Heart/Lung', icon: Heart,
    perk: 'Heart, lung, aorta surgery. 25% lower mortality, +20% high-risk operation success, 15% lower ICU complications.',
    effect: { cardiacSurgeryMortalityReduction: 0.25, highRiskSuccess: 0.20, icuComplicationReduction: 0.15 }
  },
  {
    id: 'minimally_invasive_surgeon', name: 'Minimally Invasive Surgeon', specialization: 'Laparoscopy', icon: Scissors,
    perk: 'Laparoscopic/robotic surgery. 30% faster recovery, 20% lower postoperative pain.',
    effect: { recoverySpeed: 0.30, painReduction: 0.20 }
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
  },
  {
    id: 'interventional_pulmonologist', name: 'Interventional Pulmonologist', specialization: 'Lungs', icon: Activity,
    perk: 'Bronchoscopy, airway procedures. 25% diagnostic yield increase, 15% lower airway complications.',
    effect: { diagnosticYield: 0.25, airwayComplicationReduction: 0.15 }
  },
  {
    id: 'critical_care_pulmonologist', name: 'Critical Care Pulmonologist', specialization: 'Lungs', icon: Activity,
    perk: 'ICU respiratory failure. +20% ventilator survival, 15% faster weaning success.',
    effect: { ventilatorSurvival: 0.20, weaningSuccess: 0.15 }
  },
  {
    id: 'sleep_medicine', name: 'Sleep Medicine Specialist', specialization: 'Sleep', icon: Activity,
    perk: 'Sleep apnea. 30% symptom improvement, 20% adherence boost.',
    effect: { symptomImprovement: 0.30, adherenceBoost: 0.20 }
  },
  {
    id: 'pulmonary_hypertension', name: 'Pulmonary Hypertension Specialist', specialization: 'Lungs', icon: Heart,
    perk: 'PAH management. 20% functional class improvement, 15% survival increase.',
    effect: { functionalImprovement: 0.20, survivalIncrease: 0.15 }
  },
  {
    id: 'ild_specialist', name: 'ILD Specialist', specialization: 'Lungs', icon: Activity,
    perk: 'Interstitial lung disease. 15% slower fibrosis progression, +10% oxygen independence.',
    effect: { fibrosisSlowing: 0.15, oxygenIndependence: 0.10 }
  },
  {
    id: 'lung_transplant', name: 'Lung Transplant Specialist', specialization: 'Lungs', icon: Activity,
    perk: 'Lung transplantation. 20% graft survival increase, 15% rejection reduction.',
    effect: { graftSurvival: 0.20, rejectionReduction: 0.15 }
  },
  {
    id: 'medical_dermatologist', name: 'Medical Dermatologist', specialization: 'Skin', icon: UserCheck,
    perk: '30% diagnostic accuracy boost in skin conditions.',
    effect: { dermatologyDiagnostic: 0.30 }
  },
  {
    id: 'cosmetic_dermatologist', name: 'Cosmetic Dermatologist', specialization: 'Skin', icon: UserCheck,
    perk: '+25% cosmetic outcome quality.',
    effect: { cosmeticOutcome: 0.25 }
  },
  {
    id: 'surgical_dermatologist', name: 'Surgical Dermatologist', specialization: 'Skin', icon: Scissors,
    perk: '20% lower procedural complications in dermatologic surgery.',
    effect: { dermatologySurgeryComplication: 0.20 }
  },
  {
    id: 'mohs_surgeon', name: 'Mohs Surgeon', specialization: 'Skin', icon: Scissors,
    perk: '35% cancer clearance precision.',
    effect: { cancerClearance: 0.35 }
  },
  {
    id: 'dermatopathologist', name: 'Dermatopathologist', specialization: 'Skin', icon: Eye,
    perk: '40% histologic diagnostic accuracy.',
    effect: { histologicAccuracy: 0.40 }
  },
  {
    id: 'pediatric_dermatologist', name: 'Pediatric Dermatologist', specialization: 'Skin', icon: UserCheck,
    perk: '20% treatment tolerability in children.',
    effect: { pediatricTolerability: 0.20 }
  },
  {
    id: 'retina_specialist', name: 'Retina Specialist', specialization: 'Eyes', icon: Eye,
    perk: '25% vision preservation in retinal conditions.',
    effect: { visionPreservation: 0.25 }
  },
  {
    id: 'glaucoma_specialist', name: 'Glaucoma Specialist', specialization: 'Eyes', icon: Eye,
    perk: '20% IOP control improvement.',
    effect: { iopControl: 0.20 }
  },
  {
    id: 'cornea_surgeon', name: 'Cornea Surgeon', specialization: 'Eyes', icon: Eye,
    perk: '30% graft clarity success in corneal transplants.',
    effect: { graftClarity: 0.30 }
  },
  {
    id: 'neuro_ophthalmologist', name: 'Neuro-Ophthalmologist', specialization: 'Eyes', icon: Eye,
    perk: '25% neurologic-vision diagnostic accuracy.',
    effect: { neuroVisionDiagnostic: 0.25 }
  },
  {
    id: 'pediatric_ophthalmologist', name: 'Pediatric Ophthalmologist', specialization: 'Eyes', icon: Eye,
    perk: '20% amblyopia correction success.',
    effect: { amblyopiaCorrection: 0.20 }
  },
  {
    id: 'oculoplastic_surgeon', name: 'Oculoplastic Surgeon', specialization: 'Eyes', icon: Scissors,
    perk: '25% functional-cosmetic balance in eye surgery.',
    effect: { oculoplasticBalance: 0.25 }
  },
  {
    id: 'addiction_psychiatrist', name: 'Addiction Psychiatrist', specialization: 'Mind', icon: Brain,
    perk: '30% relapse reduction in substance use disorders.',
    effect: { relapseReduction: 0.30 }
  },
  {
    id: 'forensic_psychiatrist', name: 'Forensic Psychiatrist', specialization: 'Mind', icon: Brain,
    perk: '25% assessment reliability in legal cases.',
    effect: { assessmentReliability: 0.25 }
  },
  {
    id: 'consultation_liaison', name: 'Consultation-Liaison Psychiatrist', specialization: 'Mind', icon: Brain,
    perk: '20% delirium resolution in medical patients.',
    effect: { deliriumResolution: 0.20 }
  },
  {
    id: 'child_psychiatrist', name: 'Child Psychiatrist', specialization: 'Mind', icon: Brain,
    perk: '25% symptom stabilization in pediatric mental health.',
    effect: { pediatricStabilization: 0.25 }
  },
  {
    id: 'geriatric_psychiatrist', name: 'Geriatric Psychiatrist', specialization: 'Mind', icon: Brain,
    perk: '20% behavioral symptom reduction in elderly.',
    effect: { geriatricBehavioralReduction: 0.20 }
  },
  {
    id: 'neuropsychiatrist', name: 'Neuropsychiatrist', specialization: 'Mind', icon: Brain,
    perk: '30% brain-behavior correlation accuracy.',
    effect: { brainBehaviorAccuracy: 0.30 }
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
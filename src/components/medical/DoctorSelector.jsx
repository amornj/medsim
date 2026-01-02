import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserCheck, Heart, Brain, Activity, Droplets, FlaskConical, Eye, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const DOCTOR_CATEGORIES = [
  {
    id: 'cardiologist',
    name: 'Cardiologist',
    specialization: 'Heart',
    icon: Heart,
    color: 'bg-red-100 text-red-700 border-red-300',
    perk: 'Improved outcomes on heart-related scenarios. +15% cardiac outcome bonus.',
    effect: { cardiacOutcomeBonus: 0.15, surgerySuccessBonus: 0.05 },
    derivatives: [
      {
        id: 'interventional_cardiologist', name: 'Interventional Cardiologist',
        perk: 'Catheter-based procedures. +20% acute coronary intervention success, 15% lower complications.',
        effect: { coronaryInterventionBonus: 0.20, complicationReduction: 0.15 }
      },
      {
        id: 'electrophysiologist', name: 'Electrophysiologist',
        perk: 'Arrhythmia treatment. 25% lower arrhythmia recurrence, +20% device optimization.',
        effect: { arrhythmiaControl: 0.25, deviceOptimization: 0.20 }
      },
      {
        id: 'heart_failure_cardiologist', name: 'Heart Failure Cardiologist',
        perk: 'Advanced HF management. +15% survival in heart failure, 20% lower readmission.',
        effect: { hfSurvivalBonus: 0.15, readmissionReduction: 0.20 }
      },
      {
        id: 'imaging_cardiologist', name: 'Imaging Cardiologist',
        perk: 'Cardiac imaging expert. +30% diagnostic accuracy, 20% lower misdiagnosis risk.',
        effect: { diagnosticAccuracy: 0.30, misdiagnosisReduction: 0.20 }
      },
      {
        id: 'preventive_cardiologist', name: 'Preventive Cardiologist',
        perk: 'Risk reduction focus. 25% reduction in future cardiac events, +20% long-term stability.',
        effect: { eventReduction: 0.25, longTermStability: 0.20 }
      },
      {
        id: 'adult_congenital_cardiologist', name: 'Adult Congenital Cardiologist',
        perk: 'Congenital heart disease. +20% long-term survival, 15% lower complication rate.',
        effect: { congenitalSurvivalBonus: 0.20, complicationReduction: 0.15 }
      }
    ]
  },
  {
    id: 'surgeon',
    name: 'Surgeon',
    specialization: 'Surgery',
    icon: Scissors,
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    perk: 'Lower chance of failing surgeries. -15% surgery failure rate.',
    effect: { surgeryFailureReduction: 0.15, complicationReduction: 0.05 },
    derivatives: [
      {
        id: 'general_surgeon', name: 'General Surgeon',
        perk: 'Abdominal & soft-tissue surgery. 15% lower failure, +10% faster recovery.',
        effect: { surgeryFailureReduction: 0.15, recoverySpeed: 0.10 }
      },
      {
        id: 'trauma_surgeon', name: 'Trauma Surgeon',
        perk: 'Emergency life-saving surgery. +25% survival in trauma, 20% faster hemorrhage control.',
        effect: { traumaSurvivalBonus: 0.25, hemorrhageControl: 0.20 }
      },
      {
        id: 'vascular_surgeon', name: 'Vascular Surgeon',
        perk: 'Arteries & veins surgery. 20% lower ischemic complications, +15% graft patency.',
        effect: { ischemicReduction: 0.20, graftPatency: 0.15 }
      },
      {
        id: 'colorectal_surgeon', name: 'Colorectal Surgeon',
        perk: 'Colon & rectal surgery. 15% lower leak risk, +10% bowel function recovery.',
        effect: { leakReduction: 0.15, bowelRecovery: 0.10 }
      },
      {
        id: 'hepatobiliary_surgeon', name: 'Hepatobiliary Surgeon',
        perk: 'Liver, pancreas, biliary surgery. 20% lower liver failure, +15% resection success.',
        effect: { liverFailureReduction: 0.20, resectionSuccess: 0.15 }
      },
      {
        id: 'cardiothoracic_surgeon', name: 'Cardiothoracic Surgeon',
        perk: 'Heart, lung, aorta surgery. 25% lower mortality, +20% high-risk operation success.',
        effect: { cardiacSurgeryMortalityReduction: 0.25, highRiskSuccess: 0.20, icuComplicationReduction: 0.15 }
      },
      {
        id: 'minimally_invasive_surgeon', name: 'Minimally Invasive Surgeon',
        perk: 'Laparoscopic/robotic surgery. 30% faster recovery, 20% lower postoperative pain.',
        effect: { recoverySpeed: 0.30, painReduction: 0.20 }
      }
    ]
  },
  {
    id: 'neurologist',
    name: 'Neurologist',
    specialization: 'Brain',
    icon: Brain,
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    perk: 'Improved outcomes for neurological scenarios. +15% neuro outcome bonus.',
    effect: { neuroOutcomeBonus: 0.15, surgerySuccessBonus: 0.05 },
    derivatives: [
      {
        id: 'stroke_neurologist', name: 'Stroke Neurologist',
        perk: 'Acute stroke care. +25% good neurological outcome, 20% faster reperfusion decisions.',
        effect: { strokeOutcomeBonus: 0.25, reperfusionSpeed: 0.20 }
      },
      {
        id: 'epileptologist', name: 'Epileptologist',
        perk: 'Seizure disorders. 30% seizure reduction, 15% lower medication failure.',
        effect: { seizureReduction: 0.30, medicationFailureReduction: 0.15 }
      },
      {
        id: 'neurocritical_care', name: 'Neurocritical Care Specialist',
        perk: 'ICU neuro patients. +20% ICU survival, 15% lower secondary brain injury.',
        effect: { neuroIcuSurvival: 0.20, brainInjuryReduction: 0.15 }
      },
      {
        id: 'movement_disorder', name: 'Movement Disorder Specialist',
        perk: 'Parkinsons, tremor. 25% symptom control, +15% functional mobility.',
        effect: { symptomControl: 0.25, mobilityImprovement: 0.15 }
      },
      {
        id: 'ms_specialist', name: 'MS Specialist',
        perk: 'Multiple sclerosis. 20% slower disease progression, +15% relapse prevention.',
        effect: { progressionSlowing: 0.20, relapsePrevention: 0.15 }
      },
      {
        id: 'dementia_specialist', name: 'Dementia Specialist',
        perk: 'Cognitive disorders. 15% slower cognitive decline, +10% quality-of-life preservation.',
        effect: { cognitiveDeclineSlowing: 0.15, qualityOfLife: 0.10 }
      }
    ]
  },
  {
    id: 'orthopedic',
    name: 'Orthopedic Surgeon',
    specialization: 'Bone',
    icon: Activity,
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    perk: 'Increased success rate for musculoskeletal trauma and orthopedic procedures.',
    effect: { orthoSurgerySuccessBonus: 0.10 },
    derivatives: [
      {
        id: 'trauma_orthopedist', name: 'Trauma Orthopedist',
        perk: 'Fractures & injuries. 20% faster bone union, +15% limb salvage rate.',
        effect: { boneUnionSpeed: 0.20, limbSalvage: 0.15 }
      },
      {
        id: 'spine_surgeon', name: 'Spine Surgeon',
        perk: 'Spine surgery. 20% lower nerve injury risk, +15% pain resolution.',
        effect: { nerveInjuryReduction: 0.20, painResolution: 0.15 }
      },
      {
        id: 'sports_medicine_orthopedist', name: 'Sports Medicine Orthopedist',
        perk: 'Athletic injuries. 30% faster return to sport, 15% reinjury reduction.',
        effect: { recoverySpeed: 0.30, reinjuryReduction: 0.15 }
      },
      {
        id: 'joint_replacement', name: 'Joint Replacement Specialist',
        perk: 'Hip/knee arthroplasty. 25% implant longevity, 20% faster mobility recovery.',
        effect: { implantLongevity: 0.25, mobilityRecovery: 0.20 }
      },
      {
        id: 'hand_surgeon', name: 'Hand Surgeon',
        perk: 'Hand & wrist surgery. +25% fine motor recovery, 15% lower stiffness rate.',
        effect: { fineMotorRecovery: 0.25, stiffnessReduction: 0.15 }
      },
      {
        id: 'pediatric_orthopedist', name: 'Pediatric Orthopedist',
        perk: 'Childrens bone disorders. 20% growth preservation, 15% deformity correction.',
        effect: { growthPreservation: 0.20, deformityCorrection: 0.15 }
      }
    ]
  },
  {
    id: 'pulmonologist',
    name: 'Pulmonologist',
    specialization: 'Lungs',
    icon: Activity,
    color: 'bg-cyan-100 text-cyan-700 border-cyan-300',
    perk: 'Better outcomes for respiratory conditions. +15% respiratory bonus.',
    effect: { lungOutcomeBonus: 0.15 },
    derivatives: [
      {
        id: 'interventional_pulmonologist', name: 'Interventional Pulmonologist',
        perk: 'Bronchoscopy, airway procedures. 25% diagnostic yield increase, 15% lower airway complications.',
        effect: { diagnosticYield: 0.25, airwayComplicationReduction: 0.15 }
      },
      {
        id: 'critical_care_pulmonologist', name: 'Critical Care Pulmonologist',
        perk: 'ICU respiratory failure. +20% ventilator survival, 15% faster weaning success.',
        effect: { ventilatorSurvival: 0.20, weaningSuccess: 0.15 }
      },
      {
        id: 'sleep_medicine', name: 'Sleep Medicine Specialist',
        perk: 'Sleep apnea. 30% symptom improvement, 20% adherence boost.',
        effect: { symptomImprovement: 0.30, adherenceBoost: 0.20 }
      },
      {
        id: 'pulmonary_hypertension', name: 'Pulmonary Hypertension Specialist',
        perk: 'PAH management. 20% functional class improvement, 15% survival increase.',
        effect: { functionalImprovement: 0.20, survivalIncrease: 0.15 }
      },
      {
        id: 'ild_specialist', name: 'ILD Specialist',
        perk: 'Interstitial lung disease. 15% slower fibrosis progression, +10% oxygen independence.',
        effect: { fibrosisSlowing: 0.15, oxygenIndependence: 0.10 }
      },
      {
        id: 'lung_transplant', name: 'Lung Transplant Specialist',
        perk: 'Lung transplantation. 20% graft survival increase, 15% rejection reduction.',
        effect: { graftSurvival: 0.20, rejectionReduction: 0.15 }
      }
    ]
  },
  {
    id: 'dermatologist',
    name: 'Dermatologist',
    specialization: 'Skin',
    icon: UserCheck,
    color: 'bg-pink-100 text-pink-700 border-pink-300',
    perk: 'Reduced risk of skin-related complications from procedures.',
    effect: { skinComplicationReduction: 0.10 },
    derivatives: [
      {
        id: 'medical_dermatologist', name: 'Medical Dermatologist',
        perk: '30% diagnostic accuracy boost in skin conditions.',
        effect: { dermatologyDiagnostic: 0.30 }
      },
      {
        id: 'cosmetic_dermatologist', name: 'Cosmetic Dermatologist',
        perk: '+25% cosmetic outcome quality.',
        effect: { cosmeticOutcome: 0.25 }
      },
      {
        id: 'surgical_dermatologist', name: 'Surgical Dermatologist',
        perk: '20% lower procedural complications in dermatologic surgery.',
        effect: { dermatologySurgeryComplication: 0.20 }
      },
      {
        id: 'mohs_surgeon', name: 'Mohs Surgeon',
        perk: '35% cancer clearance precision.',
        effect: { cancerClearance: 0.35 }
      },
      {
        id: 'dermatopathologist', name: 'Dermatopathologist',
        perk: '40% histologic diagnostic accuracy.',
        effect: { histologicAccuracy: 0.40 }
      },
      {
        id: 'pediatric_dermatologist', name: 'Pediatric Dermatologist',
        perk: '20% treatment tolerability in children.',
        effect: { pediatricTolerability: 0.20 }
      }
    ]
  },
  {
    id: 'ophthalmologist',
    name: 'Ophthalmologist',
    specialization: 'Eyes',
    icon: Eye,
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    perk: 'Improved diagnostic accuracy for vision-related symptoms.',
    effect: { visionDiagnosticBonus: 0.10 },
    derivatives: [
      {
        id: 'retina_specialist', name: 'Retina Specialist',
        perk: '25% vision preservation in retinal conditions.',
        effect: { visionPreservation: 0.25 }
      },
      {
        id: 'glaucoma_specialist', name: 'Glaucoma Specialist',
        perk: '20% IOP control improvement.',
        effect: { iopControl: 0.20 }
      },
      {
        id: 'cornea_surgeon', name: 'Cornea Surgeon',
        perk: '30% graft clarity success in corneal transplants.',
        effect: { graftClarity: 0.30 }
      },
      {
        id: 'neuro_ophthalmologist', name: 'Neuro-Ophthalmologist',
        perk: '25% neurologic-vision diagnostic accuracy.',
        effect: { neuroVisionDiagnostic: 0.25 }
      },
      {
        id: 'pediatric_ophthalmologist', name: 'Pediatric Ophthalmologist',
        perk: '20% amblyopia correction success.',
        effect: { amblyopiaCorrection: 0.20 }
      },
      {
        id: 'oculoplastic_surgeon', name: 'Oculoplastic Surgeon',
        perk: '25% functional-cosmetic balance in eye surgery.',
        effect: { oculoplasticBalance: 0.25 }
      }
    ]
  },
  {
    id: 'psychiatrist',
    name: 'Psychiatrist',
    specialization: 'Mind',
    icon: Brain,
    color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    perk: 'Improved management of psychiatric crises.',
    effect: { psychManagementBonus: 0.10 },
    derivatives: [
      {
        id: 'addiction_psychiatrist', name: 'Addiction Psychiatrist',
        perk: '30% relapse reduction in substance use disorders.',
        effect: { relapseReduction: 0.30 }
      },
      {
        id: 'forensic_psychiatrist', name: 'Forensic Psychiatrist',
        perk: '25% assessment reliability in legal cases.',
        effect: { assessmentReliability: 0.25 }
      },
      {
        id: 'consultation_liaison', name: 'Consultation-Liaison Psychiatrist',
        perk: '20% delirium resolution in medical patients.',
        effect: { deliriumResolution: 0.20 }
      },
      {
        id: 'child_psychiatrist', name: 'Child Psychiatrist',
        perk: '25% symptom stabilization in pediatric mental health.',
        effect: { pediatricStabilization: 0.25 }
      },
      {
        id: 'geriatric_psychiatrist', name: 'Geriatric Psychiatrist',
        perk: '20% behavioral symptom reduction in elderly.',
        effect: { geriatricBehavioralReduction: 0.20 }
      },
      {
        id: 'neuropsychiatrist', name: 'Neuropsychiatrist',
        perk: '30% brain-behavior correlation accuracy.',
        effect: { brainBehaviorAccuracy: 0.30 }
      }
    ]
  },
  {
    id: 'pediatrician',
    name: 'Pediatrician',
    specialization: 'Child',
    icon: UserCheck,
    color: 'bg-green-100 text-green-700 border-green-300',
    perk: 'Patient history will be child-appropriate (no smoking/alcohol). +15% pediatric bonus.',
    effect: { pediatricComplicationReduction: 0.15, historyFilter: ['no_smoking', 'no_alcohol', 'young_age'] },
    derivatives: []
  },
  {
    id: 'nephrologist',
    name: 'Nephrologist',
    specialization: 'Kidney',
    icon: Droplets,
    color: 'bg-teal-100 text-teal-700 border-teal-300',
    perk: 'Improved management of renal issues and dialysis.',
    effect: { renalOutcomeBonus: 0.15 },
    derivatives: []
  },
  {
    id: 'oncologist',
    name: 'Oncologist',
    specialization: 'Cancer',
    icon: FlaskConical,
    color: 'bg-violet-100 text-violet-700 border-violet-300',
    perk: 'Better management of cancer-related complications.',
    effect: { oncologyManagementBonus: 0.10 },
    derivatives: []
  },
  {
    id: 'hepatologist',
    name: 'Hepatologist',
    specialization: 'Liver',
    icon: Droplets,
    color: 'bg-amber-100 text-amber-700 border-amber-300',
    perk: 'Better outcomes for liver diseases. +15% liver outcome bonus.',
    effect: { liverOutcomeBonus: 0.15 },
    derivatives: []
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

// Add random variation to doctor effects for each game session
const randomizeDoctorEffect = (doctor) => {
  const randomVariation = () => 0.85 + Math.random() * 0.3; // 85% to 115%
  
  const randomizedEffect = {};
  Object.keys(doctor.effect).forEach(key => {
    if (typeof doctor.effect[key] === 'number') {
      randomizedEffect[key] = parseFloat((doctor.effect[key] * randomVariation()).toFixed(3));
    } else {
      randomizedEffect[key] = doctor.effect[key];
    }
  });
  
  return {
    ...doctor,
    effect: randomizedEffect,
    originalEffect: doctor.effect
  };
};

export default function DoctorSelector({ onSelectDoctors, onBack, gameMode }) {
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleDoctorToggle = (doctor, parentCategory) => {
    const randomizedDoctor = randomizeDoctorEffect(doctor);
    const randomizedParent = randomizeDoctorEffect({ effect: parentCategory.effect });
    
    const fullDoctor = {
      ...randomizedDoctor,
      parentId: parentCategory.id,
      parentName: parentCategory.name,
      parentEffect: randomizedParent.effect,
      parentPerk: parentCategory.perk,
      icon: parentCategory.icon,
      specialization: parentCategory.specialization
    };

    setSelectedDoctors(prev => {
      if (prev.find(d => d.id === doctor.id)) {
        return prev.filter(d => d.id !== doctor.id);
      } else {
        // Specialist mode: max 2 categories, 3 derivatives per category
        if (gameMode.id === 'specialist') {
          const categoriesUsed = [...new Set(prev.map(d => d.parentId))];
          const currentCategoryCount = prev.filter(d => d.parentId === parentCategory.id).length;
          
          if (!categoriesUsed.includes(parentCategory.id) && categoriesUsed.length >= 2) {
            toast.error('Specialist mode: Maximum 2 categories allowed');
            return prev;
          }
          
          if (currentCategoryCount >= 3) {
            toast.error('Specialist mode: Maximum 3 derivatives per category');
            return prev;
          }
          
          return [...prev, fullDoctor];
        }
        
        // Sandbox: unlimited
        if (gameMode.id === 'sandbox') {
          return [...prev, fullDoctor];
        }
        
        // Other modes: 1 doctor only
        if (prev.length >= 1) {
          toast.error(`You can only select 1 doctor in ${gameMode.name} mode.`);
          return prev;
        }
        
        return [...prev, fullDoctor];
      }
    });
  };

  const handleSelectAll = () => {
    if (!selectedCategory || !selectedCategory.derivatives.length) return;
    
    const allDerivatives = selectedCategory.derivatives.map(der => ({
      ...der,
      parentId: selectedCategory.id,
      parentName: selectedCategory.name,
      parentEffect: selectedCategory.effect,
      parentPerk: selectedCategory.perk,
      icon: selectedCategory.icon,
      specialization: selectedCategory.specialization
    }));

    if (gameMode.id === 'specialist') {
      const currentCategoryCount = selectedDoctors.filter(d => d.parentId === selectedCategory.id).length;
      const limit = 3 - currentCategoryCount;
      const toAdd = allDerivatives.slice(0, limit).filter(der => !selectedDoctors.find(d => d.id === der.id));
      setSelectedDoctors(prev => [...prev, ...toAdd]);
    } else {
      const toAdd = allDerivatives.filter(der => !selectedDoctors.find(d => d.id === der.id));
      setSelectedDoctors(prev => [...prev, ...toAdd]);
    }
  };

  const handleDeselectAll = () => {
    if (!selectedCategory) return;
    setSelectedDoctors(prev => prev.filter(d => d.parentId !== selectedCategory.id));
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
          {gameMode.id === 'sandbox' ? (
            <p className="text-sm text-slate-500">Sandbox mode: Select any number of doctors.</p>
          ) : gameMode.id === 'specialist' ? (
            <p className="text-sm text-slate-500">Specialist mode: Select up to 2 categories, 3 derivatives per category.</p>
          ) : (
            <p className="text-sm text-slate-500">{gameMode.name} mode: Select 1 doctor.</p>
          )}
        </motion.div>

        {!selectedCategory ? (
          <ScrollArea className="h-[500px] mb-6 pr-4">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={{ show: { transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              animate="show"
            >
              {DOCTOR_CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    variants={cardVariants}
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`hover:shadow-xl transition-shadow cursor-pointer border-2 h-full ${category.color}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center shadow-sm">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg leading-tight">{category.name}</CardTitle>
                            <Badge variant="outline" className="mt-1">
                              {category.specialization}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2">{category.perk}</p>
                        <Badge className="bg-white/70">
                          {category.derivatives.length} Specializations
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </ScrollArea>
        ) : (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{selectedCategory.name} Specializations</h2>
                <p className="text-sm text-slate-600 mt-1">Parent Perk: {selectedCategory.perk}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                  Deselect All
                </Button>
                <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                  ← Back to Categories
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[450px] mb-6 pr-4">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                initial="hidden"
                animate="show"
              >
                {selectedCategory.derivatives.map((doctor) => {
                  const Icon = selectedCategory.icon;
                  const isSelected = selectedDoctors.some(d => d.id === doctor.id);
                  return (
                    <motion.div
                      key={doctor.id}
                      variants={cardVariants}
                      whileHover={{ scale: 1.02, y: -3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`hover:shadow-lg transition-shadow cursor-pointer border-2 ${isSelected ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50' : selectedCategory.color}`}
                        onClick={() => handleDoctorToggle(doctor, selectedCategory)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center shadow-sm">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <CardTitle className="text-base leading-tight">{doctor.name}</CardTitle>
                              </div>
                            </div>
                            {isSelected && <UserCheck className="w-5 h-5 text-blue-600" />}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="text-xs text-slate-500 font-semibold">Parent Buff:</div>
                            <p className="text-xs text-slate-600 bg-white/50 rounded p-2">{selectedCategory.perk}</p>
                            <div className="text-xs text-blue-700 font-semibold">+ Specialization Buff:</div>
                            <p className="text-sm text-slate-700">{doctor.perk}</p>
                            <div className="text-xs text-purple-600 italic mt-2">
                              ✨ Effects randomized each session (85-115%)
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </ScrollArea>
          </div>
        )}

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
            Confirm Doctor(s) ({selectedDoctors.length})
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Wind, Droplets, Zap, Brain, AlertCircle, Plus, Sparkles, Activity, Thermometer } from 'lucide-react';
import AIScenarioGenerator from './AIScenarioGenerator';

const PRESET_SCENARIOS = [
  // ========================================
  // VERY EASY (1-5)
  // ========================================
  {
    id: 'routine_wound_check',
    name: 'Routine Wound Check',
    icon: Heart,
    color: 'bg-green-100 border-green-300 text-green-700',
    description: 'Clean superficial wound, no infection',
    difficulty: 1,
    difficultyLabel: 'Very Easy',
    vitals: { heart_rate: 72, blood_pressure_systolic: 120, blood_pressure_diastolic: 78, respiratory_rate: 14, spo2: 99, temperature: 36.8, consciousness: 'Alert' },
    equipment: [],
    notes: 'Monitor wound healing. No signs of infection.'
  },
  {
    id: 'mild_viral_uri',
    name: 'Mild Viral URI',
    icon: Wind,
    color: 'bg-green-100 border-green-300 text-green-700',
    description: 'Runny nose, low-grade fever',
    difficulty: 1,
    difficultyLabel: 'Very Easy',
    vitals: { heart_rate: 78, blood_pressure_systolic: 118, blood_pressure_diastolic: 76, respiratory_rate: 16, spo2: 99, temperature: 37.5, consciousness: 'Alert' },
    equipment: [],
    notes: 'Supportive care. Rest, fluids, symptom management.'
  },
  {
    id: 'simple_abrasion',
    name: 'Simple Abrasion',
    icon: Heart,
    color: 'bg-green-100 border-green-300 text-green-700',
    description: 'Minor skin scrape, no bleeding',
    difficulty: 1,
    difficultyLabel: 'Very Easy',
    vitals: { heart_rate: 70, blood_pressure_systolic: 118, blood_pressure_diastolic: 75, respiratory_rate: 14, spo2: 99, temperature: 36.7, consciousness: 'Alert' },
    equipment: [],
    notes: 'Clean and dress wound. Tetanus status check.'
  },
  {
    id: 'insect_bite_reaction',
    name: 'Insect Bite Reaction',
    icon: Heart,
    color: 'bg-green-100 border-green-300 text-green-700',
    description: 'Local itching and redness',
    difficulty: 1,
    difficultyLabel: 'Very Easy',
    vitals: { heart_rate: 74, blood_pressure_systolic: 122, blood_pressure_diastolic: 78, respiratory_rate: 14, spo2: 99, temperature: 36.9, consciousness: 'Alert' },
    equipment: [],
    notes: 'Topical antihistamine. Monitor for systemic reaction.'
  },
  {
    id: 'mild_food_poisoning',
    name: 'Mild Food Poisoning',
    icon: Droplets,
    color: 'bg-green-100 border-green-300 text-green-700',
    description: 'Nausea without dehydration',
    difficulty: 1,
    difficultyLabel: 'Very Easy',
    vitals: { heart_rate: 82, blood_pressure_systolic: 115, blood_pressure_diastolic: 72, respiratory_rate: 16, spo2: 98, temperature: 37.2, consciousness: 'Alert' },
    equipment: [],
    notes: 'Oral rehydration. Antiemetics as needed.'
  },

  // ========================================
  // EASY (6-15)
  // ========================================
  {
    id: 'uncomplicated_uti',
    name: 'Uncomplicated UTI',
    icon: Droplets,
    color: 'bg-blue-100 border-blue-300 text-blue-700',
    description: 'Dysuria without systemic signs',
    difficulty: 1,
    difficultyLabel: 'Easy',
    vitals: { heart_rate: 88, blood_pressure_systolic: 120, blood_pressure_diastolic: 78, respiratory_rate: 16, spo2: 98, temperature: 37.0, consciousness: 'Alert' },
    equipment: [],
    notes: 'Urinalysis. Oral antibiotics. Increase fluid intake.'
  },
  {
    id: 'mild_cellulitis',
    name: 'Mild Cellulitis',
    icon: Heart,
    color: 'bg-blue-100 border-blue-300 text-blue-700',
    description: 'Localized skin infection',
    difficulty: 1,
    difficultyLabel: 'Easy',
    vitals: { heart_rate: 90, blood_pressure_systolic: 125, blood_pressure_diastolic: 80, respiratory_rate: 16, spo2: 98, temperature: 37.8, consciousness: 'Alert' },
    equipment: [],
    notes: 'Oral antibiotics. Mark borders. Monitor for spread.'
  },
  {
    id: 'simple_laceration',
    name: 'Simple Laceration',
    icon: Heart,
    color: 'bg-blue-100 border-blue-300 text-blue-700',
    description: 'Shallow cut requiring sutures',
    difficulty: 1,
    difficultyLabel: 'Easy',
    vitals: { heart_rate: 85, blood_pressure_systolic: 122, blood_pressure_diastolic: 78, respiratory_rate: 14, spo2: 99, temperature: 36.8, consciousness: 'Alert' },
    equipment: [],
    notes: 'Local anesthesia. Irrigation. Primary closure.'
  },
  {
    id: 'viral_gastroenteritis',
    name: 'Viral Gastroenteritis',
    icon: Droplets,
    color: 'bg-blue-100 border-blue-300 text-blue-700',
    description: 'Vomiting and diarrhea, stable',
    difficulty: 1,
    difficultyLabel: 'Easy',
    vitals: { heart_rate: 92, blood_pressure_systolic: 118, blood_pressure_diastolic: 75, respiratory_rate: 16, spo2: 98, temperature: 37.5, consciousness: 'Alert' },
    equipment: [],
    notes: 'Oral rehydration. Antiemetics. Monitor hydration status.'
  },
  {
    id: 'mild_concussion',
    name: 'Mild Concussion',
    icon: Brain,
    color: 'bg-blue-100 border-blue-300 text-blue-700',
    description: 'Head injury without LOC',
    difficulty: 1,
    difficultyLabel: 'Easy',
    vitals: { heart_rate: 80, blood_pressure_systolic: 125, blood_pressure_diastolic: 82, respiratory_rate: 14, spo2: 99, temperature: 36.9, consciousness: 'Alert' },
    equipment: [],
    notes: 'Neurological monitoring. Return precautions. Rest.'
  },
  {
    id: 'otitis_media',
    name: 'Otitis Media',
    icon: Heart,
    color: 'bg-blue-100 border-blue-300 text-blue-700',
    description: 'Ear pain with mild fever',
    difficulty: 1,
    difficultyLabel: 'Easy',
    vitals: { heart_rate: 88, blood_pressure_systolic: 120, blood_pressure_diastolic: 78, respiratory_rate: 16, spo2: 98, temperature: 37.8, consciousness: 'Alert' },
    equipment: [],
    notes: 'Antibiotics. Pain control. Follow-up in 2 days.'
  },
  {
    id: 'tonsillitis',
    name: 'Tonsillitis',
    icon: Wind,
    color: 'bg-blue-100 border-blue-300 text-blue-700',
    description: 'Sore throat, swallowing pain',
    difficulty: 1,
    difficultyLabel: 'Easy',
    vitals: { heart_rate: 90, blood_pressure_systolic: 122, blood_pressure_diastolic: 80, respiratory_rate: 16, spo2: 98, temperature: 38.0, consciousness: 'Alert' },
    equipment: [],
    notes: 'Throat culture. Antibiotics if bacterial. Symptomatic relief.'
  },
  {
    id: 'mild_asthma_exacerbation',
    name: 'Mild Asthma Exacerbation',
    icon: Wind,
    color: 'bg-blue-100 border-blue-300 text-blue-700',
    description: 'Wheezing responsive to inhaler',
    difficulty: 1,
    difficultyLabel: 'Easy',
    vitals: { heart_rate: 94, blood_pressure_systolic: 125, blood_pressure_diastolic: 82, respiratory_rate: 20, spo2: 96, temperature: 36.8, consciousness: 'Alert' },
    equipment: [],
    notes: 'Bronchodilators. Steroids. Peak flow monitoring.'
  },
  {
    id: 'ankle_sprain',
    name: 'Ankle Sprain',
    icon: Heart,
    color: 'bg-blue-100 border-blue-300 text-blue-700',
    description: 'Soft tissue injury, swelling',
    difficulty: 1,
    difficultyLabel: 'Easy',
    vitals: { heart_rate: 84, blood_pressure_systolic: 120, blood_pressure_diastolic: 78, respiratory_rate: 14, spo2: 99, temperature: 36.7, consciousness: 'Alert' },
    equipment: [],
    notes: 'RICE protocol. X-ray to rule out fracture. NSAIDs.'
  },
  {
    id: 'minor_burn_1st_degree',
    name: 'Minor Burn (1st degree)',
    icon: AlertCircle,
    color: 'bg-blue-100 border-blue-300 text-blue-700',
    description: 'Superficial burn, pain only',
    difficulty: 1,
    difficultyLabel: 'Easy',
    vitals: { heart_rate: 88, blood_pressure_systolic: 122, blood_pressure_diastolic: 78, respiratory_rate: 14, spo2: 99, temperature: 36.8, consciousness: 'Alert' },
    equipment: [],
    notes: 'Cool water. Topical analgesia. Monitor for infection.'
  },

  // ========================================
  // MODERATE (16-24)
  // ========================================
  {
    id: 'community_acquired_pneumonia',
    name: 'Community-Acquired Pneumonia',
    icon: Wind,
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    description: 'Fever, cough, focal crackles',
    difficulty: 2,
    difficultyLabel: 'Moderate',
    vitals: { heart_rate: 102, blood_pressure_systolic: 115, blood_pressure_diastolic: 72, respiratory_rate: 24, spo2: 94, temperature: 38.5, consciousness: 'Alert' },
    equipment: [],
    notes: 'Chest X-ray. Antibiotics. Supplemental oxygen if needed.'
  },
  {
    id: 'moderate_copd_exacerbation',
    name: 'Moderate COPD Exacerbation',
    icon: Wind,
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    description: 'Dyspnea requiring nebulizers',
    difficulty: 2,
    difficultyLabel: 'Moderate',
    vitals: { heart_rate: 104, blood_pressure_systolic: 130, blood_pressure_diastolic: 82, respiratory_rate: 26, spo2: 90, temperature: 37.5, consciousness: 'Alert' },
    equipment: [],
    notes: 'Bronchodilators. Steroids. Antibiotics. Consider BiPAP.'
  },
  {
    id: 'appendicitis',
    name: 'Appendicitis',
    icon: AlertCircle,
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    description: 'RLQ pain with fever',
    difficulty: 2,
    difficultyLabel: 'Moderate',
    vitals: { heart_rate: 100, blood_pressure_systolic: 122, blood_pressure_diastolic: 78, respiratory_rate: 18, spo2: 97, temperature: 38.2, consciousness: 'Alert' },
    equipment: [],
    notes: 'NPO. IV antibiotics. Surgical consult. CT abdomen.'
  },
  {
    id: 'pyelonephritis',
    name: 'Pyelonephritis',
    icon: Droplets,
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    description: 'UTI with flank pain & fever',
    difficulty: 2,
    difficultyLabel: 'Moderate',
    vitals: { heart_rate: 105, blood_pressure_systolic: 118, blood_pressure_diastolic: 75, respiratory_rate: 18, spo2: 96, temperature: 38.8, consciousness: 'Alert' },
    equipment: [],
    notes: 'Blood cultures. IV antibiotics. Fluids. Imaging if no response.'
  },
  {
    id: 'moderate_dehydration',
    name: 'Moderate Dehydration',
    icon: Droplets,
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    description: 'Tachycardia, dry mucosa',
    difficulty: 2,
    difficultyLabel: 'Moderate',
    vitals: { heart_rate: 108, blood_pressure_systolic: 105, blood_pressure_diastolic: 68, respiratory_rate: 18, spo2: 97, temperature: 37.0, consciousness: 'Alert' },
    equipment: [],
    notes: 'IV fluid resuscitation. Monitor electrolytes and urine output.'
  },
  {
    id: 'open_fracture_stable',
    name: 'Open Fracture (Stable)',
    icon: AlertCircle,
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    description: 'Bone exposure, controlled bleeding',
    difficulty: 2,
    difficultyLabel: 'Moderate',
    vitals: { heart_rate: 98, blood_pressure_systolic: 120, blood_pressure_diastolic: 78, respiratory_rate: 16, spo2: 98, temperature: 36.8, consciousness: 'Alert' },
    equipment: [],
    notes: 'Tetanus. Antibiotics. Orthopedic consult. Wound care.'
  },
  {
    id: 'diabetic_foot_infection',
    name: 'Diabetic Foot Infection',
    icon: Heart,
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    description: 'Ulcer with local infection',
    difficulty: 2,
    difficultyLabel: 'Moderate',
    vitals: { heart_rate: 96, blood_pressure_systolic: 128, blood_pressure_diastolic: 82, respiratory_rate: 16, spo2: 97, temperature: 37.8, consciousness: 'Alert' },
    equipment: [],
    notes: 'Wound culture. Antibiotics. Glucose control. Vascular assessment.'
  },
  {
    id: 'influenza_with_hypoxia',
    name: 'Influenza with Hypoxia',
    icon: Wind,
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    description: 'Viral illness with O₂ need',
    difficulty: 2,
    difficultyLabel: 'Moderate',
    vitals: { heart_rate: 110, blood_pressure_systolic: 118, blood_pressure_diastolic: 75, respiratory_rate: 24, spo2: 92, temperature: 38.5, consciousness: 'Alert' },
    equipment: [],
    notes: 'Antiviral therapy. Supplemental oxygen. Monitor for ARDS.'
  },
  {
    id: 'acute_cholecystitis',
    name: 'Acute Cholecystitis',
    icon: AlertCircle,
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    description: 'RUQ pain, fever',
    difficulty: 2,
    difficultyLabel: 'Moderate',
    vitals: { heart_rate: 102, blood_pressure_systolic: 125, blood_pressure_diastolic: 80, respiratory_rate: 18, spo2: 97, temperature: 38.3, consciousness: 'Alert' },
    equipment: [],
    notes: 'NPO. IV antibiotics. Ultrasound. Surgical consult.'
  },

  // ========================================
  // SERIOUS (25-32)
  // ========================================
  {
    id: 'severe_cellulitis',
    name: 'Severe Cellulitis',
    icon: AlertCircle,
    color: 'bg-orange-100 border-orange-300 text-orange-700',
    description: 'Rapidly spreading infection',
    difficulty: 3,
    difficultyLabel: 'Serious',
    vitals: { heart_rate: 112, blood_pressure_systolic: 110, blood_pressure_diastolic: 70, respiratory_rate: 20, spo2: 95, temperature: 38.8, consciousness: 'Alert' },
    equipment: [],
    notes: 'IV antibiotics. Monitor for necrotizing fasciitis. Serial exams.'
  },
  {
    id: 'unstable_angina',
    name: 'Unstable Angina',
    icon: Heart,
    color: 'bg-orange-100 border-orange-300 text-orange-700',
    description: 'Chest pain, ischemic risk',
    difficulty: 3,
    difficultyLabel: 'Serious',
    vitals: { heart_rate: 95, blood_pressure_systolic: 165, blood_pressure_diastolic: 95, respiratory_rate: 20, spo2: 96, temperature: 37.0, consciousness: 'Alert' },
    equipment: [],
    notes: 'ECG. Aspirin. Nitrates. Cardiology consult. Cath lab standby.'
  },
  {
    id: 'gi_bleeding_stable',
    name: 'GI Bleeding (Stable)',
    icon: Droplets,
    color: 'bg-orange-100 border-orange-300 text-orange-700',
    description: 'Melena with anemia',
    difficulty: 3,
    difficultyLabel: 'Serious',
    vitals: { heart_rate: 108, blood_pressure_systolic: 105, blood_pressure_diastolic: 68, respiratory_rate: 18, spo2: 96, temperature: 36.8, consciousness: 'Alert' },
    equipment: [],
    notes: 'Type and cross. IV access. PPI. GI consult for endoscopy.'
  },
  {
    id: 'sepsis_early',
    name: 'Sepsis (Early)',
    icon: Droplets,
    color: 'bg-orange-100 border-orange-300 text-orange-700',
    description: 'Infection with organ stress',
    difficulty: 3,
    difficultyLabel: 'Serious',
    vitals: { heart_rate: 115, blood_pressure_systolic: 95, blood_pressure_diastolic: 60, respiratory_rate: 24, spo2: 94, temperature: 38.5, consciousness: 'Alert' },
    equipment: [],
    notes: 'Cultures. Early antibiotics. Fluid resuscitation. Lactate monitoring.'
  },
  {
    id: 'head_injury_with_loc',
    name: 'Head Injury with LOC',
    icon: Brain,
    color: 'bg-orange-100 border-orange-300 text-orange-700',
    description: 'Transient loss of consciousness',
    difficulty: 3,
    difficultyLabel: 'Serious',
    vitals: { heart_rate: 92, blood_pressure_systolic: 135, blood_pressure_diastolic: 85, respiratory_rate: 16, spo2: 97, temperature: 36.8, consciousness: 'Alert' },
    equipment: [],
    notes: 'CT head. Neuro checks. Monitor for ICP changes. Neurosurgery aware.'
  },
  {
    id: 'bacterial_meningitis_early',
    name: 'Bacterial Meningitis (Early)',
    icon: Brain,
    color: 'bg-orange-100 border-orange-300 text-orange-700',
    description: 'Fever, neck stiffness',
    difficulty: 3,
    difficultyLabel: 'Serious',
    vitals: { heart_rate: 110, blood_pressure_systolic: 115, blood_pressure_diastolic: 72, respiratory_rate: 20, spo2: 95, temperature: 39.2, consciousness: 'Alert' },
    equipment: [],
    notes: 'Blood cultures. Empiric antibiotics STAT. Lumbar puncture. CT first if focal signs.'
  },
  {
    id: 'acute_pancreatitis',
    name: 'Acute Pancreatitis',
    icon: AlertCircle,
    color: 'bg-orange-100 border-orange-300 text-orange-700',
    description: 'Severe epigastric pain',
    difficulty: 3,
    difficultyLabel: 'Serious',
    vitals: { heart_rate: 108, blood_pressure_systolic: 110, blood_pressure_diastolic: 70, respiratory_rate: 22, spo2: 96, temperature: 37.8, consciousness: 'Alert' },
    equipment: [],
    notes: 'NPO. Aggressive fluids. Pain control. Monitor for complications.'
  },
  {
    id: 'pulmonary_embolism_stable',
    name: 'Pulmonary Embolism (Stable)',
    icon: Wind,
    color: 'bg-orange-100 border-orange-300 text-orange-700',
    description: 'Acute dyspnea, tachycardia',
    difficulty: 3,
    difficultyLabel: 'Serious',
    vitals: { heart_rate: 118, blood_pressure_systolic: 115, blood_pressure_diastolic: 72, respiratory_rate: 26, spo2: 93, temperature: 37.0, consciousness: 'Alert' },
    equipment: [],
    notes: 'CTA chest. Anticoagulation. Consider thrombolytics if unstable.'
  },

  // ========================================
  // SEVERE (33-40)
  // ========================================
  {
    id: 'necrotizing_pneumonia',
    name: 'Necrotizing Pneumonia',
    icon: Wind,
    color: 'bg-red-100 border-red-300 text-red-700',
    description: 'Cavitary lung infection',
    difficulty: 4,
    difficultyLabel: 'Severe',
    vitals: { heart_rate: 125, blood_pressure_systolic: 100, blood_pressure_diastolic: 65, respiratory_rate: 30, spo2: 90, temperature: 39.5, consciousness: 'Alert' },
    equipment: [],
    notes: 'Broad-spectrum antibiotics. Surgical consult. ICU admission.'
  },
  {
    id: 'septic_shock_early',
    name: 'Septic Shock (Early)',
    icon: Droplets,
    color: 'bg-red-100 border-red-300 text-red-700',
    description: 'Hypotension requiring fluids',
    difficulty: 4,
    difficultyLabel: 'Severe',
    vitals: { heart_rate: 130, blood_pressure_systolic: 85, blood_pressure_diastolic: 55, respiratory_rate: 26, spo2: 92, temperature: 39.0, consciousness: 'Lethargic' },
    equipment: [],
    notes: 'Aggressive resuscitation. Early antibiotics. Vasopressors. ICU.'
  },
  {
    id: 'polytrauma_stable',
    name: 'Polytrauma (Stable)',
    icon: AlertCircle,
    color: 'bg-red-100 border-red-300 text-red-700',
    description: 'Multiple injuries, monitored',
    difficulty: 4,
    difficultyLabel: 'Severe',
    vitals: { heart_rate: 120, blood_pressure_systolic: 105, blood_pressure_diastolic: 68, respiratory_rate: 24, spo2: 95, temperature: 36.2, consciousness: 'Alert' },
    equipment: [],
    notes: 'ATLS protocol. Trauma series. Multiple consultations. Blood products.'
  },
  {
    id: 'severe_asthma_attack',
    name: 'Severe Asthma Attack',
    icon: Wind,
    color: 'bg-red-100 border-red-300 text-red-700',
    description: 'Poor response to bronchodilators',
    difficulty: 4,
    difficultyLabel: 'Severe',
    vitals: { heart_rate: 128, blood_pressure_systolic: 125, blood_pressure_diastolic: 80, respiratory_rate: 32, spo2: 89, temperature: 36.8, consciousness: 'Anxious' },
    equipment: [],
    notes: 'Continuous nebs. IV steroids. Magnesium. Consider intubation.'
  },
  {
    id: 'acute_stroke',
    name: 'Acute Stroke',
    icon: Brain,
    color: 'bg-red-100 border-red-300 text-red-700',
    description: 'Focal neuro deficit',
    difficulty: 4,
    difficultyLabel: 'Severe',
    vitals: { heart_rate: 96, blood_pressure_systolic: 180, blood_pressure_diastolic: 100, respiratory_rate: 18, spo2: 97, temperature: 37.0, consciousness: 'Alert' },
    equipment: [],
    notes: 'Stat CT. Stroke team. tPA window. Thrombectomy candidate assessment.'
  },
  {
    id: 'dka_moderate',
    name: 'DKA (Moderate)',
    icon: Droplets,
    color: 'bg-red-100 border-red-300 text-red-700',
    description: 'Metabolic acidosis, dehydration',
    difficulty: 4,
    difficultyLabel: 'Severe',
    vitals: { heart_rate: 118, blood_pressure_systolic: 95, blood_pressure_diastolic: 60, respiratory_rate: 28, spo2: 96, temperature: 37.0, consciousness: 'Confused' },
    equipment: [],
    notes: 'Insulin drip. Aggressive fluids. Potassium replacement. Monitor cerebral edema.'
  },
  {
    id: 'severe_covid19_pneumonia',
    name: 'Severe COVID-19 Pneumonia',
    icon: Wind,
    color: 'bg-red-100 border-red-300 text-red-700',
    description: 'High O₂ requirement',
    difficulty: 4,
    difficultyLabel: 'Severe',
    vitals: { heart_rate: 122, blood_pressure_systolic: 110, blood_pressure_diastolic: 70, respiratory_rate: 30, spo2: 88, temperature: 38.5, consciousness: 'Alert' },
    equipment: [],
    notes: 'High-flow oxygen. Steroids. Anticoagulation. Prone positioning. ICU.'
  },
  {
    id: 'liver_failure_with_infection',
    name: 'Liver Failure with Infection',
    icon: AlertCircle,
    color: 'bg-red-100 border-red-300 text-red-700',
    description: 'Jaundice, encephalopathy',
    difficulty: 4,
    difficultyLabel: 'Severe',
    vitals: { heart_rate: 115, blood_pressure_systolic: 95, blood_pressure_diastolic: 60, respiratory_rate: 20, spo2: 94, temperature: 38.2, consciousness: 'Confused' },
    equipment: [],
    notes: 'Antibiotics. Coagulopathy management. Transplant evaluation. Lactulose.'
  },

  // ========================================
  // CRITICAL (41-48)
  // ========================================
  {
    id: 'septic_shock_refractory',
    name: 'Septic Shock (Refractory)',
    icon: Droplets,
    color: 'bg-red-200 border-red-400 text-red-800',
    description: 'Vasopressor-dependent',
    difficulty: 5,
    difficultyLabel: 'Critical',
    vitals: { heart_rate: 135, blood_pressure_systolic: 75, blood_pressure_diastolic: 45, respiratory_rate: 28, spo2: 90, temperature: 39.5, consciousness: 'Lethargic' },
    equipment: [],
    notes: 'Multiple vasopressors. Source control. CRRT. Consider ECMO.'
  },
  {
    id: 'massive_gi_bleed',
    name: 'Massive GI Bleed',
    icon: Droplets,
    color: 'bg-red-200 border-red-400 text-red-800',
    description: 'Hemodynamic instability',
    difficulty: 5,
    difficultyLabel: 'Critical',
    vitals: { heart_rate: 140, blood_pressure_systolic: 75, blood_pressure_diastolic: 48, respiratory_rate: 26, spo2: 92, temperature: 35.8, consciousness: 'Confused' },
    equipment: [],
    notes: 'Massive transfusion protocol. Emergent endoscopy. ICU. Vasopressors.'
  },
  {
    id: 'ards',
    name: 'ARDS',
    icon: Wind,
    color: 'bg-red-200 border-red-400 text-red-800',
    description: 'Diffuse lung failure',
    difficulty: 5,
    difficultyLabel: 'Critical',
    vitals: { heart_rate: 132, blood_pressure_systolic: 98, blood_pressure_diastolic: 62, respiratory_rate: 35, spo2: 85, temperature: 38.2, consciousness: 'Sedated' },
    equipment: [],
    notes: 'Lung protective ventilation. Prone positioning. ECMO consideration.'
  },
  {
    id: 'intracranial_hemorrhage',
    name: 'Intracranial Hemorrhage',
    icon: Brain,
    color: 'bg-red-200 border-red-400 text-red-800',
    description: 'Rapid neurologic decline',
    difficulty: 5,
    difficultyLabel: 'Critical',
    vitals: { heart_rate: 100, blood_pressure_systolic: 195, blood_pressure_diastolic: 110, respiratory_rate: 20, spo2: 96, temperature: 37.0, consciousness: 'Stuporous' },
    equipment: [],
    notes: 'Stat CT. Neurosurgery STAT. BP control. ICP monitoring. Reverse coagulopathy.'
  },
  {
    id: 'ruptured_appendicitis',
    name: 'Ruptured Appendicitis',
    icon: AlertCircle,
    color: 'bg-red-200 border-red-400 text-red-800',
    description: 'Peritonitis & sepsis',
    difficulty: 5,
    difficultyLabel: 'Critical',
    vitals: { heart_rate: 128, blood_pressure_systolic: 88, blood_pressure_diastolic: 55, respiratory_rate: 24, spo2: 93, temperature: 39.2, consciousness: 'Lethargic' },
    equipment: [],
    notes: 'Emergent surgery. Broad antibiotics. Resuscitation. Sepsis bundle.'
  },
  {
    id: 'severe_trauma_with_hemorrhage',
    name: 'Severe Trauma with Hemorrhage',
    icon: AlertCircle,
    color: 'bg-red-200 border-red-400 text-red-800',
    description: 'Active bleeding',
    difficulty: 5,
    difficultyLabel: 'Critical',
    vitals: { heart_rate: 145, blood_pressure_systolic: 78, blood_pressure_diastolic: 48, respiratory_rate: 28, spo2: 91, temperature: 35.5, consciousness: 'Confused' },
    equipment: [],
    notes: 'Massive transfusion. Trauma surgery. Damage control. TXA administration.'
  },
  {
    id: 'fulminant_hepatitis',
    name: 'Fulminant Hepatitis',
    icon: AlertCircle,
    color: 'bg-red-200 border-red-400 text-red-800',
    description: 'Acute liver failure',
    difficulty: 5,
    difficultyLabel: 'Critical',
    vitals: { heart_rate: 120, blood_pressure_systolic: 90, blood_pressure_diastolic: 58, respiratory_rate: 22, spo2: 95, temperature: 37.8, consciousness: 'Confused' },
    equipment: [],
    notes: 'ICU. Transplant evaluation. Cerebral edema monitoring. Coagulopathy management.'
  },
  {
    id: 'tension_pneumothorax',
    name: 'Tension Pneumothorax',
    icon: Wind,
    color: 'bg-red-200 border-red-400 text-red-800',
    description: 'Hypoxia, hypotension',
    difficulty: 5,
    difficultyLabel: 'Critical',
    vitals: { heart_rate: 140, blood_pressure_systolic: 70, blood_pressure_diastolic: 42, respiratory_rate: 35, spo2: 82, temperature: 36.8, consciousness: 'Agitated' },
    equipment: [],
    notes: 'Immediate needle decompression. Chest tube. Do not delay for imaging.'
  },

  // ========================================
  // LIFE-THREATENING (49-60)
  // ========================================
  {
    id: 'massive_pulmonary_embolism',
    name: 'Massive Pulmonary Embolism',
    icon: Wind,
    color: 'bg-red-900 border-red-950 text-red-50',
    description: 'Obstructive shock',
    difficulty: 6,
    difficultyLabel: 'Life-Threatening',
    vitals: { heart_rate: 150, blood_pressure_systolic: 72, blood_pressure_diastolic: 45, respiratory_rate: 32, spo2: 84, temperature: 36.5, consciousness: 'Lethargic' },
    equipment: [],
    notes: 'Thrombolytics. ECMO consideration. Pulmonary embolectomy. ICU.'
  },
  {
    id: 'cardiac_tamponade',
    name: 'Cardiac Tamponade',
    icon: Heart,
    color: 'bg-red-900 border-red-950 text-red-50',
    description: 'Obstructed cardiac filling',
    difficulty: 6,
    difficultyLabel: 'Life-Threatening',
    vitals: { heart_rate: 135, blood_pressure_systolic: 75, blood_pressure_diastolic: 50, respiratory_rate: 28, spo2: 90, temperature: 36.8, consciousness: 'Anxious' },
    equipment: [],
    notes: 'Emergent pericardiocentesis. Echo confirmation. Cardiac surgery standby.'
  },
  {
    id: 'septic_shock_with_mods',
    name: 'Septic Shock with MODS',
    icon: Droplets,
    color: 'bg-red-900 border-red-950 text-red-50',
    description: 'Multiorgan failure',
    difficulty: 6,
    difficultyLabel: 'Life-Threatening',
    vitals: { heart_rate: 148, blood_pressure_systolic: 68, blood_pressure_diastolic: 40, respiratory_rate: 35, spo2: 88, temperature: 40.0, consciousness: 'Unresponsive' },
    equipment: [],
    notes: 'Maximal support. Multiple vasopressors. CRRT. ECMO consideration. Palliative discussion.'
  },
  {
    id: 'ruptured_aaa',
    name: 'Ruptured AAA',
    icon: Heart,
    color: 'bg-red-900 border-red-950 text-red-50',
    description: 'Sudden hemorrhagic shock',
    difficulty: 6,
    difficultyLabel: 'Life-Threatening',
    vitals: { heart_rate: 160, blood_pressure_systolic: 65, blood_pressure_diastolic: 38, respiratory_rate: 30, spo2: 90, temperature: 35.2, consciousness: 'Confused' },
    equipment: [],
    notes: 'Emergent vascular surgery. Permissive hypotension. Massive transfusion. OR immediately.'
  },
  {
    id: 'status_asthmaticus',
    name: 'Status Asthmaticus',
    icon: Wind,
    color: 'bg-red-900 border-red-950 text-red-50',
    description: 'Imminent respiratory failure',
    difficulty: 6,
    difficultyLabel: 'Life-Threatening',
    vitals: { heart_rate: 145, blood_pressure_systolic: 110, blood_pressure_diastolic: 72, respiratory_rate: 38, spo2: 80, temperature: 37.0, consciousness: 'Exhausted' },
    equipment: [],
    notes: 'Intubation likely. Ketamine. Aggressive bronchodilators. Avoid high pressures.'
  },
  {
    id: 'ventricular_tachycardia',
    name: 'Ventricular Tachycardia',
    icon: Zap,
    color: 'bg-red-900 border-red-950 text-red-50',
    description: 'Unstable arrhythmia',
    difficulty: 6,
    difficultyLabel: 'Life-Threatening',
    vitals: { heart_rate: 180, blood_pressure_systolic: 75, blood_pressure_diastolic: 48, respiratory_rate: 26, spo2: 92, temperature: 36.8, consciousness: 'Altered' },
    equipment: [],
    notes: 'Immediate cardioversion. Amiodarone. Correct electrolytes. Cardiology.'
  },
  {
    id: 'massive_stroke_with_herniation',
    name: 'Massive Stroke with Herniation',
    icon: Brain,
    color: 'bg-red-900 border-red-950 text-red-50',
    description: 'Brainstem compression',
    difficulty: 6,
    difficultyLabel: 'Life-Threatening',
    vitals: { heart_rate: 110, blood_pressure_systolic: 200, blood_pressure_diastolic: 115, respiratory_rate: 10, spo2: 95, temperature: 37.5, consciousness: 'Unresponsive' },
    equipment: [],
    notes: 'Neurosurgery STAT. Decompressive craniotomy. Hyperosmolar therapy. Ventilation.'
  },
  {
    id: 'toxic_shock_syndrome',
    name: 'Toxic Shock Syndrome',
    icon: Droplets,
    color: 'bg-red-900 border-red-950 text-red-50',
    description: 'Rapid systemic collapse',
    difficulty: 6,
    difficultyLabel: 'Life-Threatening',
    vitals: { heart_rate: 150, blood_pressure_systolic: 70, blood_pressure_diastolic: 42, respiratory_rate: 30, spo2: 89, temperature: 40.5, consciousness: 'Confused' },
    equipment: [],
    notes: 'Source removal. Clindamycin. IVIG. Aggressive resuscitation. Multi-organ support.'
  },
  {
    id: 'necrotizing_fasciitis',
    name: 'Necrotizing Fasciitis',
    icon: AlertCircle,
    color: 'bg-red-900 border-red-950 text-red-50',
    description: 'Rapid tissue destruction',
    difficulty: 6,
    difficultyLabel: 'Life-Threatening',
    vitals: { heart_rate: 138, blood_pressure_systolic: 82, blood_pressure_diastolic: 52, respiratory_rate: 26, spo2: 93, temperature: 39.5, consciousness: 'Lethargic' },
    equipment: [],
    notes: 'Emergent surgical debridement. Broad antibiotics. Clindamycin. ICU. Hyperbaric O2.'
  },
  {
    id: 'eclampsia',
    name: 'Eclampsia',
    icon: Brain,
    color: 'bg-red-900 border-red-950 text-red-50',
    description: 'Seizure with hypertension',
    difficulty: 6,
    difficultyLabel: 'Life-Threatening',
    vitals: { heart_rate: 130, blood_pressure_systolic: 185, blood_pressure_diastolic: 110, respiratory_rate: 24, spo2: 94, temperature: 37.5, consciousness: 'Post-ictal' },
    equipment: [],
    notes: 'Magnesium sulfate. BP control. Emergent delivery. Fetal monitoring. Seizure precautions.'
  },
  {
    id: 'ards_plus_septic_shock',
    name: 'ARDS + Septic Shock',
    icon: Wind,
    color: 'bg-red-900 border-red-950 text-red-50',
    description: 'Severe hypoxia + shock',
    difficulty: 6,
    difficultyLabel: 'Life-Threatening',
    vitals: { heart_rate: 148, blood_pressure_systolic: 68, blood_pressure_diastolic: 42, respiratory_rate: 38, spo2: 78, temperature: 39.8, consciousness: 'Sedated' },
    equipment: [],
    notes: 'VV-ECMO. Multiple vasopressors. Prone positioning. Lung protective ventilation. CRRT.'
  },
  {
    id: 'cardiac_arrest_vfvt',
    name: 'Cardiac Arrest (VF/VT)',
    icon: Heart,
    color: 'bg-red-900 border-red-950 text-red-50',
    description: 'No effective circulation',
    difficulty: 6,
    difficultyLabel: 'Life-Threatening',
    vitals: { heart_rate: 0, blood_pressure_systolic: 0, blood_pressure_diastolic: 0, respiratory_rate: 0, spo2: 0, temperature: 36.5, consciousness: 'Unresponsive' },
    equipment: [],
    notes: 'Immediate CPR. Defibrillation. ACLS protocol. Epinephrine. Reversible causes. ECMO consideration.'
  }
];

export default function ScenarioSelector({ onSelectScenario, onCreateCustom }) {
  const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false);

  // Sort scenarios by difficulty
  const sortedScenarios = [...PRESET_SCENARIOS].sort((a, b) => (a.difficulty || 0) - (b.difficulty || 0));

  // Add randomization to scenarios for dynamic gameplay
  const randomizeScenario = (scenario) => {
    return {
      ...scenario,
      vitals: {
        ...scenario.vitals,
        heart_rate: scenario.vitals.heart_rate + Math.floor(Math.random() * 20 - 10),
        blood_pressure_systolic: scenario.vitals.blood_pressure_systolic + Math.floor(Math.random() * 20 - 10),
        blood_pressure_diastolic: scenario.vitals.blood_pressure_diastolic + Math.floor(Math.random() * 10 - 5),
        respiratory_rate: Math.max(0, scenario.vitals.respiratory_rate + Math.floor(Math.random() * 6 - 3)),
        spo2: Math.max(0, Math.min(100, scenario.vitals.spo2 + Math.floor(Math.random() * 6 - 3))),
        temperature: parseFloat((scenario.vitals.temperature + (Math.random() * 0.8 - 0.4)).toFixed(1))
      }
    };
  };
  
  const getDifficultyColor = (difficulty) => {
    if (difficulty === 1) return 'bg-green-500';
    if (difficulty === 2) return 'bg-yellow-500';
    if (difficulty === 3) return 'bg-orange-500';
    if (difficulty === 4) return 'bg-red-500';
    if (difficulty === 5) return 'bg-red-600';
    if (difficulty === 6) return 'bg-red-800';
    return 'bg-slate-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-bold text-slate-800">Select Emergency Scenario</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setAiGeneratorOpen(true)}
            variant="default"
            size="sm"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <Sparkles className="w-4 h-4" />
            AI Generate
          </Button>
          <Button
            onClick={onCreateCustom}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Manual Setup
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedScenarios.map((scenario) => (
          <Card
            key={scenario.id}
            className="hover:shadow-lg transition-all cursor-pointer group border-2"
            onClick={() => onSelectScenario(scenario)}
          >
            <CardHeader className={`pb-3 ${scenario.color} border-b`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <scenario.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">
                      {scenario.name}
                    </CardTitle>
                    {scenario.difficultyLabel && (
                      <Badge className={`${getDifficultyColor(scenario.difficulty)} text-white mt-1`}>
                        {scenario.difficultyLabel}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-slate-600 mb-3">
                {scenario.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                <Badge variant="secondary" className="text-xs">
                  {scenario.equipment.length} Equipment
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  HR: {scenario.vitals.heart_rate}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  SpO₂: {scenario.vitals.spo2}%
                </Badge>
              </div>
              <Button
                className="w-full group-hover:bg-slate-800 transition-colors"
                size="sm"
                onClick={() => onSelectScenario(randomizeScenario(scenario))}
              >
                Load Scenario
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <AIScenarioGenerator
        open={aiGeneratorOpen}
        onClose={() => setAiGeneratorOpen(false)}
        onScenarioGenerated={(scenario) => {
          setAiGeneratorOpen(false);
          onSelectScenario(scenario);
        }}
      />
    </div>
  );
}

export { PRESET_SCENARIOS };
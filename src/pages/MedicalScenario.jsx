import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, RotateCcw, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import ScenarioSelector, { PRESET_SCENARIOS } from '../components/medical/ScenarioSelector';
import PatientVitals from '../components/medical/PatientVitals';
import EquipmentPalette from '../components/medical/EquipmentPalette';
import PatientWorkspace from '../components/medical/PatientWorkspace';
import EquipmentConfigDialog from '../components/medical/EquipmentConfigDialog';
import HumanAnatomyViewer from '../components/medical/HumanAnatomyViewer';
import SurgeryMenu from '../components/medical/SurgeryMenu';
import DeathImminentWarning from '../components/medical/DeathImminentWarning';
import PatientHistoryDialog from '../components/medical/PatientHistoryDialog';
import { generateRandomPatientHistory } from '../components/medical/PatientHistoryGenerator';
import PerformanceTracker from '../components/medical/PerformanceTracker';
import PerformanceHistory from '../components/medical/PerformanceHistory';

import TitleScreen from '../components/medical/TitleScreen';
import GameModeSelector from '../components/medical/GameModeSelector';
import FundsDisplay from '../components/medical/FundsDisplay';

// Equipment costs
const EQUIPMENT_COSTS = {
  ventilator: 5000, cardiac_monitor: 1000, defibrillator: 3000, iv_pump: 2000, syringe_pump: 2500,
  ecmo: 50000, va_ecmo: 60000, vv_ecmo: 55000, vav_ecmo: 70000, lava_ecmo: 80000, ecpella: 90000,
  cpb: 40000, iabp: 20000, impella_cp: 45000, impella_5: 55000, impella_rp: 40000, tandem_heart: 50000,
  heartmate_3: 100000, centrimag: 60000, dialysis: 8000, crrt: 12000, pulse_ox: 500, temp_monitor: 500,
  arterial_line: 3000, lucas: 15000, aed: 4000, pacemaker: 8000, warming_blanket: 1500, cooling_blanket: 1500,
  arctic_sun: 20000, hfnc: 4000, bipap: 6000, cpap: 5000, hfov: 12000, jet_ventilator: 15000,
  cvvh: 10000, cvvhd: 10000, cvvhdf: 11000, sled: 9000, plasmapheresis: 18000, eeg_monitor: 7000,
  icp_monitor: 8000, brain_o2_monitor: 9000, tcd: 6000, swan_ganz: 5000, picco: 7000, lidco: 6500,
  ct_scanner: 25000, coronary_cta: 30000, mri_scanner: 35000, pet_ct: 40000, fluoroscopy: 20000,
  c_arm: 18000, anesthesia_workstation: 10000, tee_machine: 15000, ultrasound: 8000, bronchoscope: 6000,
  endoscope: 7000, linac: 80000, gamma_knife: 100000, apheresis: 20000, da_vinci: 150000,
  ortho_navigation: 50000, electrocautery: 4000
};

export default function MedicalScenario() {
  const [gameState, setGameState] = useState('title'); // 'title', 'mode_select', 'scenario_select', 'playing'
  const [gameMode, setGameMode] = useState(null);
  const [funds, setFunds] = useState(0);
  const [showScenarioSelector, setShowScenarioSelector] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [vitals, setVitals] = useState(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [surgeryMenuOpen, setSurgeryMenuOpen] = useState(false);
  const [showAnatomy, setShowAnatomy] = useState(false);
  const [patientDead, setPatientDead] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [patientHistory, setPatientHistory] = useState(null);
  const [scenarioStartTime, setScenarioStartTime] = useState(null);
  const [interventionHistory, setInterventionHistory] = useState([]);
  const [initialVitals, setInitialVitals] = useState(null);
  const [performanceHistoryOpen, setPerformanceHistoryOpen] = useState(false);
  
  const queryClient = useQueryClient();

  // Natural vitals drift - disease progression and patient response
  useEffect(() => {
    if (!vitals || patientDead) return;

    const interval = setInterval(() => {
      setVitals(prev => {
        if (!prev) return prev;
        
        let newVitals = { ...prev };
        const condition = currentScenario?.condition || 'custom';
        
        // Base drift factors
        const randomFactor = () => (Math.random() - 0.5) * 0.3;
        
        // Condition-specific deterioration patterns
        switch(condition) {
          case 'cardiac_arrest':
            // Without intervention, stays critical
            if (prev.heart_rate === 0) {
              newVitals.spo2 = Math.max(0, prev.spo2 - 0.5);
              newVitals.blood_pressure_systolic = Math.max(0, prev.blood_pressure_systolic - 0.3);
            }
            break;
            
          case 'respiratory_failure':
            // Hypoxia worsens without support
            newVitals.spo2 = Math.max(70, prev.spo2 - 0.2 + randomFactor());
            newVitals.respiratory_rate = Math.min(40, prev.respiratory_rate + 0.1);
            if (prev.spo2 < 85) {
              newVitals.heart_rate = Math.min(150, prev.heart_rate + 0.3);
            }
            break;
            
          case 'septic_shock':
            // Progressive hypotension and tachycardia
            newVitals.blood_pressure_systolic = Math.max(60, prev.blood_pressure_systolic - 0.15);
            newVitals.heart_rate = Math.min(160, prev.heart_rate + 0.2);
            newVitals.temperature = Math.min(41, prev.temperature + 0.02);
            newVitals.spo2 = Math.max(80, prev.spo2 - 0.1);
            break;
            
          case 'trauma':
            // Hemorrhagic shock progression
            if (prev.blood_pressure_systolic < 90) {
              newVitals.heart_rate = Math.min(170, prev.heart_rate + 0.4);
              newVitals.blood_pressure_systolic = Math.max(50, prev.blood_pressure_systolic - 0.2);
              newVitals.spo2 = Math.max(85, prev.spo2 - 0.15);
            }
            break;
            
          case 'stroke':
            // Neurological deterioration with ICP
            if (prev.blood_pressure_systolic > 180) {
              newVitals.heart_rate = Math.max(50, prev.heart_rate - 0.1); // Cushing's reflex
            }
            break;
            
          case 'anaphylaxis':
            // Rapid deterioration if untreated
            newVitals.blood_pressure_systolic = Math.max(55, prev.blood_pressure_systolic - 0.3);
            newVitals.heart_rate = Math.min(180, prev.heart_rate + 0.5);
            newVitals.spo2 = Math.max(75, prev.spo2 - 0.25);
            newVitals.respiratory_rate = Math.min(40, prev.respiratory_rate + 0.3);
            break;
            
          default:
            // General metabolic drift - subtle changes
            newVitals.heart_rate = Math.max(40, Math.min(140, prev.heart_rate + randomFactor() * 2));
            newVitals.respiratory_rate = Math.max(8, Math.min(30, prev.respiratory_rate + randomFactor()));
            newVitals.spo2 = Math.max(88, Math.min(100, prev.spo2 + randomFactor() * 0.5));
            newVitals.temperature = Math.max(35, Math.min(39, prev.temperature + randomFactor() * 0.1));
        }
        
        // Universal metabolic effects
        // Low SpO2 causes compensatory tachycardia
        if (prev.spo2 < 90) {
          newVitals.heart_rate = Math.min(160, prev.heart_rate + 0.2);
        }
        
        // Severe hypotension causes compensatory tachycardia
        if (prev.blood_pressure_systolic < 80) {
          newVitals.heart_rate = Math.min(170, prev.heart_rate + 0.3);
        }
        
        // Fever increases metabolic demand
        if (prev.temperature > 38.5) {
          newVitals.heart_rate = Math.min(150, prev.heart_rate + 0.15);
          newVitals.respiratory_rate = Math.min(35, prev.respiratory_rate + 0.1);
        }
        
        // Hypothermia slows metabolism
        if (prev.temperature < 35) {
          newVitals.heart_rate = Math.max(40, prev.heart_rate - 0.2);
          newVitals.respiratory_rate = Math.max(6, prev.respiratory_rate - 0.1);
        }
        
        // Patient history influences
        if (patientHistory) {
          // COPD/Asthma - baseline lower SpO2
          if (patientHistory.past_medical.some(c => c.toLowerCase().includes('copd') || c.toLowerCase().includes('asthma'))) {
            newVitals.spo2 = Math.max(88, newVitals.spo2 - 0.05);
          }
          
          // CHF - fluid retention worsens oxygenation
          if (patientHistory.past_medical.some(c => c.toLowerCase().includes('chf') || c.toLowerCase().includes('heart failure'))) {
            newVitals.spo2 = Math.max(85, newVitals.spo2 - 0.08);
            newVitals.respiratory_rate = Math.min(35, newVitals.respiratory_rate + 0.05);
          }
          
          // Chronic hypertension - higher baseline BP
          if (patientHistory.past_medical.some(c => c.toLowerCase().includes('hypertension'))) {
            if (newVitals.blood_pressure_systolic < 140) {
              newVitals.blood_pressure_systolic = Math.min(160, newVitals.blood_pressure_systolic + 0.1);
            }
          }
          
          // Diabetes - slower wound healing, infection risk
          if (patientHistory.past_medical.some(c => c.toLowerCase().includes('diabetes'))) {
            if (condition === 'trauma' || condition === 'septic_shock') {
              newVitals.temperature = Math.min(40, newVitals.temperature + 0.01);
            }
          }
          
          // Smoking history - impaired oxygenation
          if (patientHistory.social_history?.smoking && patientHistory.social_history.smoking.toLowerCase().includes('pack')) {
            newVitals.spo2 = Math.max(90, newVitals.spo2 - 0.03);
          }
          
          // Alcohol use - affects liver metabolism and coagulation
          if (patientHistory.social_history?.alcohol && patientHistory.social_history.alcohol.toLowerCase().includes('heavy')) {
            if (condition === 'trauma') {
              newVitals.blood_pressure_systolic = Math.max(60, newVitals.blood_pressure_systolic - 0.05);
            }
          }
        }
        
        return newVitals;
      });
    }, 3000); // Every 3 seconds for natural drift

    return () => clearInterval(interval);
  }, [vitals, patientDead, currentScenario, patientHistory]);

  // Dynamic equipment effects on vitals
  useEffect(() => {
    if (!vitals || patientDead) return;

    const interval = setInterval(() => {
      setVitals(prev => {
        if (!prev) return prev;
        
        let newVitals = { ...prev };
        
        // VENTILATOR: Direct impact on oxygenation and respiratory rate
        const ventilator = equipment.find(eq => eq.type === 'ventilator');
        if (ventilator?.settings) {
          // Respiratory rate control
          if (ventilator.settings.respiratory_rate) {
            newVitals.respiratory_rate = parseInt(ventilator.settings.respiratory_rate);
          }

          // FiO2 affects SpO2
          const fio2 = parseInt(ventilator.settings.fio2) || 21;
          if (fio2 >= 80) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 1.5);
          } else if (fio2 >= 60) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 1);
          } else if (fio2 >= 40) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 0.5);
          }

          // PEEP affects oxygenation (higher PEEP = better recruitment)
          const peep = parseInt(ventilator.settings.peep) || 5;
          if (peep >= 12) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 0.8);
          } else if (peep >= 8) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 0.3);
          }

          // Tidal volume too high can cause barotrauma (decrease SpO2)
          const tidalVolume = parseInt(ventilator.settings.tidal_volume) || 500;
          if (tidalVolume > 600) {
            newVitals.spo2 = Math.max(0, prev.spo2 - 0.2);
          }
        }

        // BIPAP: Non-invasive ventilation for hypercapnic respiratory failure
        const bipap = equipment.find(eq => eq.type === 'bipap');
        if (bipap?.settings) {
          const ipap = parseInt(bipap.settings.ipap) || 10;
          const epap = parseInt(bipap.settings.epap) || 5;
          const fio2 = parseInt(bipap.settings.fio2) || 21;

          // Higher pressure support improves oxygenation
          const pressureSupport = ipap - epap;
          if (pressureSupport >= 10) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 0.8);
          } else if (pressureSupport >= 6) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 0.5);
          } else {
            newVitals.spo2 = Math.min(100, prev.spo2 + 0.3);
          }

          // FiO2 support
          if (fio2 >= 60) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 0.6);
          } else if (fio2 >= 40) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 0.3);
          }

          // Reduces work of breathing
          if (prev.respiratory_rate > 25) {
            newVitals.respiratory_rate = Math.max(12, prev.respiratory_rate - 0.2);
          }
        }

        // CPAP: Continuous positive airway pressure
        const cpap = equipment.find(eq => eq.type === 'cpap');
        if (cpap?.settings) {
          const pressure = parseInt(cpap.settings.pressure) || 5;
          const fio2 = parseInt(cpap.settings.fio2) || 21;

          // CPAP improves oxygenation through alveolar recruitment
          if (pressure >= 10) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 0.5);
          } else if (pressure >= 5) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 0.3);
          }

          // FiO2 support
          if (fio2 >= 40) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 0.4);
          }
        }

        // HFNC: High-Flow Nasal Cannula - heated humidified oxygen
        const hfnc = equipment.find(eq => eq.type === 'hfnc');
        if (hfnc?.settings) {
          const flowRate = parseInt(hfnc.settings.flow_rate) || 30;
          const fio2 = parseInt(hfnc.settings.fio2) || 21;

          // High flow rates provide PEEP-like effect
          if (flowRate >= 50) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 0.7);
          } else if (flowRate >= 40) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 0.5);
          } else if (flowRate >= 30) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 0.3);
          }

          // FiO2 support
          if (fio2 >= 80) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 0.8);
          } else if (fio2 >= 60) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 0.6);
          } else if (fio2 >= 40) {
            newVitals.spo2 = Math.min(100, prev.spo2 + 0.4);
          }

          // Reduces respiratory distress
          if (prev.respiratory_rate > 22) {
            newVitals.respiratory_rate = Math.max(14, prev.respiratory_rate - 0.15);
          }
        }
        
        // VASOPRESSOR INFUSIONS: Check both pumps
        equipment.forEach(eq => {
          if ((eq.type === 'syringe_pump' || eq.type === 'iv_pump') && eq.settings?.drug && eq.settings?.rate) {
            const drugName = eq.settings.drug.toLowerCase();
            const rate = parseFloat(eq.settings.rate) || 0;

            if (rate === 0) return; // Skip if not running

            // Check for drug allergies with game mode severity
            if (patientHistory?.allergies?.some(allergy => {
              const allergenBase = allergy.toLowerCase().split(' ')[0];
              return drugName.includes(allergenBase);
            })) {
              let severity = 1;
              if (gameMode?.allergies === 'complications') severity = 2;
              if (gameMode?.allergies === 'deadly') severity = 3;

              // Allergic reaction based on severity
              newVitals.blood_pressure_systolic = Math.max(60, prev.blood_pressure_systolic - rate * 0.4 * severity);
              newVitals.heart_rate = Math.min(180, prev.heart_rate + rate * 1.5 * severity);
              newVitals.spo2 = Math.max(gameMode?.id === 'specialist' ? 70 : 80, prev.spo2 - rate * 0.2 * severity);
              return;
            }
            
            // Norepinephrine
            if (drugName.includes('norepinephrine') || drugName.includes('levophed')) {
              newVitals.blood_pressure_systolic = Math.min(180, prev.blood_pressure_systolic + rate * 0.3);
              newVitals.blood_pressure_diastolic = Math.min(110, prev.blood_pressure_diastolic + rate * 0.2);
              newVitals.heart_rate = Math.max(40, prev.heart_rate - rate * 0.5);
            }
            
            // Epinephrine
            if (drugName.includes('epinephrine') || drugName.includes('adrenaline')) {
              newVitals.blood_pressure_systolic = Math.min(200, prev.blood_pressure_systolic + rate * 0.5);
              newVitals.heart_rate = Math.min(180, prev.heart_rate + rate * 2);
            }
            
            // Vasopressin
            if (drugName.includes('vasopressin')) {
              newVitals.blood_pressure_systolic = Math.min(180, prev.blood_pressure_systolic + rate * 0.4);
            }
            
            // Propofol
            if (drugName.includes('propofol')) {
              newVitals.blood_pressure_systolic = Math.max(50, prev.blood_pressure_systolic - rate * 0.2);
              newVitals.heart_rate = Math.max(40, prev.heart_rate - rate * 0.3);
            }
            
            // Phenylephrine
            if (drugName.includes('phenylephrine') || drugName.includes('neosynephrine')) {
              newVitals.blood_pressure_systolic = Math.min(170, prev.blood_pressure_systolic + rate * 0.4);
              newVitals.heart_rate = Math.max(45, prev.heart_rate - rate * 0.4);
            }

            // Dopamine
            if (drugName.includes('dopamine')) {
              newVitals.blood_pressure_systolic = Math.min(160, prev.blood_pressure_systolic + rate * 0.35);
              newVitals.heart_rate = Math.min(150, prev.heart_rate + rate * 1.5);
            }

            // Dobutamine
            if (drugName.includes('dobutamine')) {
              newVitals.heart_rate = Math.min(140, prev.heart_rate + rate * 1.8);
              newVitals.blood_pressure_systolic = Math.min(140, prev.blood_pressure_systolic + rate * 0.2);
            }

            // Beta Blockers - Rate and BP reduction
            if (drugName.includes('metoprolol') || drugName.includes('lopressor') || 
                drugName.includes('propranolol') || drugName.includes('inderal') ||
                drugName.includes('esmolol') || drugName.includes('atenolol') ||
                drugName.includes('carvedilol')) {
              newVitals.heart_rate = Math.max(50, prev.heart_rate - rate * 0.8);
              newVitals.blood_pressure_systolic = Math.max(85, prev.blood_pressure_systolic - rate * 0.3);
            }

            // Calcium Channel Blockers
            if (drugName.includes('diltiazem') || drugName.includes('cardizem') ||
                drugName.includes('verapamil')) {
              newVitals.heart_rate = Math.max(55, prev.heart_rate - rate * 0.6);
              newVitals.blood_pressure_systolic = Math.max(90, prev.blood_pressure_systolic - rate * 0.25);
            }

            // Fentanyl
            if (drugName.includes('fentanyl')) {
              newVitals.respiratory_rate = Math.max(6, prev.respiratory_rate - rate * 0.3);
              newVitals.heart_rate = Math.max(50, prev.heart_rate - rate * 0.2);
            }

            // Midazolam
            if (drugName.includes('midazolam') || drugName.includes('versed')) {
              newVitals.respiratory_rate = Math.max(8, prev.respiratory_rate - rate * 0.2);
              newVitals.blood_pressure_systolic = Math.max(60, prev.blood_pressure_systolic - rate * 0.15);
            }

            // Antibiotics - slight temperature reduction
            if (drugName.includes('vancomycin') || drugName.includes('zosyn') ||
                drugName.includes('meropenem') || drugName.includes('ceftriaxone') ||
                drugName.includes('cefepime') || drugName.includes('azithromycin')) {
              if (prev.temperature > 38) {
                newVitals.temperature = Math.max(37.5, prev.temperature - 0.02);
              }
            }
            }
            });
        
        // CARDIOPULMONARY BYPASS - Blood pressure regulation only
        const cpb = equipment.find(eq => eq.type === 'cpb');
        if (cpb?.settings?.flow_rate) {
          const flow = parseFloat(cpb.settings.flow_rate);
          // Only stabilizes blood pressure
          newVitals.blood_pressure_systolic = Math.min(130, prev.blood_pressure_systolic + flow * 0.8);
          newVitals.blood_pressure_diastolic = Math.min(90, prev.blood_pressure_diastolic + flow * 0.5);
        }
        
        // ECMO effects - powerful support
        const ecmo = equipment.find(eq => 
          eq.type === 'ecmo' || eq.type === 'va_ecmo' || eq.type === 'vv_ecmo'
        );
        if (ecmo?.settings?.flow_rate) {
          const flow = parseFloat(ecmo.settings.flow_rate);
          // VV-ECMO: respiratory support only
          if (ecmo.type === 'vv_ecmo' || ecmo.type === 'ecmo') {
            newVitals.spo2 = Math.min(100, prev.spo2 + flow * 0.3);
          }
          // VA-ECMO: cardiac + respiratory support
          if (ecmo.type === 'va_ecmo') {
            newVitals.spo2 = Math.min(100, prev.spo2 + flow * 0.4);
            newVitals.blood_pressure_systolic = Math.min(120, prev.blood_pressure_systolic + flow * 0.5);
            newVitals.blood_pressure_diastolic = Math.min(80, prev.blood_pressure_diastolic + flow * 0.3);
          }
        }
        
        // IABP - improves cardiac output
        const iabp = equipment.find(eq => eq.type === 'iabp');
        if (iabp?.settings?.enabled) {
          newVitals.blood_pressure_diastolic = Math.min(90, prev.blood_pressure_diastolic + 0.5);
          newVitals.spo2 = Math.min(100, prev.spo2 + 0.2);
        }
        
        // Mechanical CPR - Generates artificial circulation
        const lucas = equipment.find(eq => eq.type === 'lucas');
        if (lucas?.settings?.enabled !== false) {
          if (prev.heart_rate === 0) {
            // Creates artificial perfusion pressure during cardiac arrest
            newVitals.blood_pressure_systolic = Math.min(80, prev.blood_pressure_systolic + 2);
            newVitals.blood_pressure_diastolic = Math.min(50, prev.blood_pressure_diastolic + 1);
            newVitals.spo2 = Math.min(75, prev.spo2 + 0.5);
          }
        }
        
        // DEFIBRILLATOR - Successful shock can restart heart
        const defibrillator = equipment.find(eq => eq.type === 'defibrillator' || eq.type === 'aed');
        if (defibrillator?.settings?.shock_delivered && prev.heart_rate === 0) {
          const shockTimestamp = new Date(defibrillator.settings.timestamp).getTime();
          const now = Date.now();
          const timeSinceShock = now - shockTimestamp;
          
          // Gradual recovery after successful defibrillation (30 seconds)
          if (timeSinceShock < 30000) {
            const progress = timeSinceShock / 30000;
            newVitals.heart_rate = Math.floor(progress * 85);
            newVitals.blood_pressure_systolic = Math.floor(50 + progress * 60);
            newVitals.blood_pressure_diastolic = Math.floor(30 + progress * 40);
          }
        }
        
        // PACEMAKER - Overrides heart rate when active
        const pacemaker = equipment.find(eq => eq.type === 'pacemaker');
        if (pacemaker?.settings?.enabled && pacemaker.settings?.pacing_rate) {
          const pacingRate = parseInt(pacemaker.settings.pacing_rate);
          // Pacemaker sets the heart rate directly
          newVitals.heart_rate = pacingRate;
          // Stable pacing improves perfusion
          if (prev.blood_pressure_systolic < 90) {
            newVitals.blood_pressure_systolic = Math.min(100, prev.blood_pressure_systolic + 0.5);
          }
        }
        
        // Temperature management
        const tempMonitor = equipment.find(eq => eq.type === 'temp_monitor');
        if (tempMonitor?.settings?.target_temp) {
          const target = parseFloat(tempMonitor.settings.target_temp);
          if (prev.temperature < target) {
            newVitals.temperature = Math.min(target, prev.temperature + 0.05);
          } else if (prev.temperature > target) {
            newVitals.temperature = Math.max(target, prev.temperature - 0.05);
          }
        }
        
        // WARMING BLANKET - For hypothermia
        const warmingBlanket = equipment.find(eq => eq.type === 'warming_blanket');
        if (warmingBlanket?.settings?.enabled === 'true') {
          const targetTemp = parseFloat(warmingBlanket.settings.target_temp) || 37;
          if (prev.temperature < targetTemp) {
            newVitals.temperature = Math.min(targetTemp, prev.temperature + 0.15);
          }
        }
        
        // COOLING BLANKET - For hyperthermia
        const coolingBlanket = equipment.find(eq => eq.type === 'cooling_blanket');
        if (coolingBlanket?.settings?.enabled === 'true') {
          const targetTemp = parseFloat(coolingBlanket.settings.target_temp) || 37;
          if (prev.temperature > targetTemp) {
            newVitals.temperature = Math.max(targetTemp, prev.temperature - 0.12);
          }
        }
        
        // ARCTIC SUN - Advanced targeted temperature management
        const arcticSun = equipment.find(eq => eq.type === 'arctic_sun');
        if (arcticSun?.settings?.enabled === 'true') {
          const targetTemp = parseFloat(arcticSun.settings.target_temp) || 33;
          const coolingRate = parseFloat(arcticSun.settings.cooling_rate) || 1;
          const ratePerInterval = (coolingRate / 1800) * 2; // Convert °C/hr to per 2 seconds
          
          if (prev.temperature > targetTemp) {
            newVitals.temperature = Math.max(targetTemp, prev.temperature - ratePerInterval);
          } else if (prev.temperature < targetTemp) {
            newVitals.temperature = Math.min(targetTemp, prev.temperature + ratePerInterval);
          }
        }
        
        // IV FLUID RESUSCITATION - Rate-dependent effects
        const ivPump = equipment.find(eq => 
          eq.type === 'iv_pump' && 
          eq.settings?.rate &&
          !eq.settings?.drug // Fluid only, not medications
        );
        if (ivPump?.settings?.rate) {
          const rate = parseFloat(ivPump.settings.rate);

          // Fluid resuscitation effects based on rate
          if (rate > 500) { // Massive fluid resuscitation (>500 ml/hr)
            newVitals.blood_pressure_systolic = Math.min(140, prev.blood_pressure_systolic + 1.2);
            newVitals.blood_pressure_diastolic = Math.min(90, prev.blood_pressure_diastolic + 0.8);
            newVitals.spo2 = Math.min(98, prev.spo2 + 0.3); // Improved perfusion
          } else if (rate > 300) { // Rapid resuscitation (300-500 ml/hr)
            newVitals.blood_pressure_systolic = Math.min(130, prev.blood_pressure_systolic + 0.6);
            newVitals.blood_pressure_diastolic = Math.min(85, prev.blood_pressure_diastolic + 0.4);
            newVitals.spo2 = Math.min(96, prev.spo2 + 0.2);
          } else if (rate > 150) { // Maintenance fluids (150-300 ml/hr)
            newVitals.blood_pressure_systolic = Math.min(120, prev.blood_pressure_systolic + 0.3);
            newVitals.spo2 = Math.min(95, prev.spo2 + 0.1);
          }

          // Fluid overload effects (too much too fast)
          if (rate > 1000) {
            // Pulmonary edema risk - decreases oxygenation
            newVitals.spo2 = Math.max(85, prev.spo2 - 0.5);
            newVitals.respiratory_rate = Math.min(35, prev.respiratory_rate + 0.2);
          }
        }

        // SWAN-GANZ - Provides detailed cardiac data, helps guide treatment
        const swanGanz = equipment.find(eq => eq.type === 'swan_ganz');
        if (swanGanz?.settings?.enabled === 'true') {
          // Swan-Ganz allows more precise fluid and pressor management
          // Slight improvement in hemodynamic stability through better monitoring
          if (prev.blood_pressure_systolic < 90) {
            newVitals.blood_pressure_systolic = Math.min(95, prev.blood_pressure_systolic + 0.2);
          }
        }

        // PiCCO - Advanced hemodynamic monitoring improves treatment
        const picco = equipment.find(eq => eq.type === 'picco');
        if (picco?.settings?.enabled === 'true' && picco.settings?.calibration === 'Calibrated') {
          // Better fluid and pressor titration with PiCCO data
          if (prev.blood_pressure_systolic < 90) {
            newVitals.blood_pressure_systolic = Math.min(100, prev.blood_pressure_systolic + 0.3);
          }
          // Helps optimize cardiac output
          if (prev.spo2 < 92) {
            newVitals.spo2 = Math.min(94, prev.spo2 + 0.2);
          }
        }

        // LiDCO - Cardiac output monitoring optimizes resuscitation
        const lidco = equipment.find(eq => eq.type === 'lidco');
        if (lidco?.settings?.enabled === 'true') {
          // Improved fluid responsiveness assessment
          if (prev.blood_pressure_systolic < 90) {
            newVitals.blood_pressure_systolic = Math.min(95, prev.blood_pressure_systolic + 0.25);
          }
        }
        
        return newVitals;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [equipment, vitals, patientDead, patientHistory]);

  const saveScenarioMutation = useMutation({
    mutationFn: (scenarioData) => base44.entities.Scenario.create(scenarioData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
      toast.success('Scenario saved successfully');
    },
    onError: () => {
      toast.error('Failed to save scenario');
    }
  });

  const handleSelectScenario = (scenario) => {
    setCurrentScenario(scenario);
    setVitals(scenario.vitals);
    setInitialVitals({ ...scenario.vitals });
    
    // Handle patient history based on game mode
    let history = scenario.patient_history;
    if (!history) {
      if (gameMode.allergies === 'none' || gameMode.allergies === 'disabled') {
        history = { ...generateRandomPatientHistory(), allergies: [] };
      } else if (gameMode.allergies === 'fixed') {
        history = generateRandomPatientHistory();
      } else if (gameMode.allergies === 'random') {
        history = generateRandomPatientHistory();
        if (Math.random() > 0.5) history.allergies = [];
      } else {
        history = generateRandomPatientHistory();
      }
    }
    setPatientHistory(history);
    
    setEquipment([]);
    setInterventionHistory([]);
    setScenarioStartTime(Date.now());
    setPatientDead(false);
    setGameState('playing');
    toast.success(`Scenario loaded: ${scenario.name}`, {
      description: `Budget: ${funds === Infinity ? '∞' : '$' + funds.toLocaleString()}`
    });
  };

  const handleCreateCustom = () => {
    setCurrentScenario({
      id: 'custom',
      name: 'Custom Scenario',
      description: 'Build your own medical scenario',
      vitals: {
        heart_rate: 80,
        blood_pressure_systolic: 120,
        blood_pressure_diastolic: 80,
        respiratory_rate: 16,
        spo2: 98,
        temperature: 37.0,
        consciousness: 'Alert'
      }
    });
    setVitals({
      heart_rate: 80,
      blood_pressure_systolic: 120,
      blood_pressure_diastolic: 80,
      respiratory_rate: 16,
      spo2: 98,
      temperature: 37.0,
      consciousness: 'Alert'
    });
    setEquipment([]);
    setShowScenarioSelector(false);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === 'palette' && destination.droppableId === 'workspace') {
      const equipmentType = result.draggableId.replace('palette-', '').split('-')[0];
      const cost = EQUIPMENT_COSTS[equipmentType] || 0;
      
      // Check funds
      if (funds !== Infinity && funds < cost) {
        toast.error(`Insufficient funds! Need $${cost.toLocaleString()}, have $${funds.toLocaleString()}`);
        return;
      }
      
      // Check procedure failure (specialist mode)
      if (gameMode?.id === 'specialist' && Math.random() < 0.15) {
        toast.error('Equipment malfunction! Try again.', {
          description: 'Funds deducted but equipment failed'
        });
        if (funds !== Infinity) setFunds(funds - cost);
        return;
      }
      
      const newEquipment = {
        id: `${equipmentType}-${Date.now()}`,
        type: equipmentType,
        settings: {}
      };
      
      setEquipment([...equipment, newEquipment]);
      setInterventionHistory([...interventionHistory, {
        timestamp: Date.now(),
        type: equipmentType,
        action: 'added'
      }]);
      
      if (funds !== Infinity) setFunds(funds - cost);
      toast.success(`Equipment added (-$${cost.toLocaleString()})`, {
        description: `Remaining: ${funds === Infinity ? '∞' : '$' + (funds - cost).toLocaleString()}`
      });
    } else if (source.droppableId === 'workspace' && destination.droppableId === 'workspace') {
      const items = Array.from(equipment);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setEquipment(items);
    }
  };

  const handleRemoveEquipment = (id, cost) => {
    setEquipment(equipment.filter(eq => eq.id !== id));
    if (funds !== Infinity && cost) {
      setFunds(funds + cost);
      toast.success(`Equipment removed (+$${cost.toLocaleString()})`, {
        description: `Refunded. Total: $${(funds + cost).toLocaleString()}`
      });
    } else {
      toast.info('Equipment removed');
    }
  };

  const handleConfigureEquipment = (item) => {
    setSelectedEquipment(item);
    setConfigDialogOpen(true);
  };

  const handleSaveConfig = (equipmentId, settings, vitalChanges) => {
    setEquipment(equipment.map(eq => 
      eq.id === equipmentId ? { ...eq, settings } : eq
    ));
    
    // Apply vital changes if provided (e.g., from defibrillation)
    if (vitalChanges) {
      setVitals(prev => ({
        ...prev,
        ...vitalChanges
      }));
      toast.success('Vitals updated after intervention');
    } else {
      toast.success('Configuration saved');
    }
  };

  const handleSaveScenario = async () => {
    const scenarioData = {
      name: currentScenario.name,
      description: currentScenario.description,
      condition: currentScenario.id === 'custom' ? 'custom' : currentScenario.id,
      patient_vitals: vitals,
      equipment: equipment.map(eq => ({
        type: eq.type,
        settings: eq.settings
      })),
      notes: currentScenario.notes || ''
    };

    saveScenarioMutation.mutate(scenarioData);
  };

  const handleReset = () => {
    setGameState('mode_select');
    setCurrentScenario(null);
    setEquipment([]);
    setVitals(null);
    setScenarioStartTime(null);
    setInterventionHistory([]);
    setInitialVitals(null);
  };
  
  const savePerformance = async (outcome) => {
    if (!currentScenario || !scenarioStartTime) return;
    
    const endTime = Date.now();
    const duration = (endTime - scenarioStartTime) / 1000;
    
    // Calculate time to first intervention
    const timeToFirst = interventionHistory.length > 0 
      ? (interventionHistory[0].timestamp - scenarioStartTime) / 1000 
      : duration;
    
    // Find critical interventions
    const criticalTypes = ['defibrillator', 'lucas', 'aed', 'ecmo', 'cpb'];
    const criticalIntervention = interventionHistory.find(i => criticalTypes.includes(i.type));
    const timeToCritical = criticalIntervention 
      ? (criticalIntervention.timestamp - scenarioStartTime) / 1000
      : null;
    
    // Calculate scores
    const speedScore = timeToFirst < 30 ? 25 : timeToFirst < 60 ? 20 : timeToFirst < 120 ? 15 : 10;
    const bestPracticesScore = Math.min(35, equipment.length * 5);
    const resourceScore = Math.max(0, 20 - Math.abs(equipment.length - 5) * 2);
    
    let outcomeScore = 0;
    if (outcome === 'patient_survived') outcomeScore = 20;
    else if (outcome === 'patient_died') outcomeScore = 5;
    
    const totalScore = speedScore + bestPracticesScore + resourceScore + outcomeScore;
    
    // Generate feedback
    const feedback = [];
    if (timeToFirst > 120) feedback.push('Response time was slow - try to act faster');
    if (equipment.length === 0) feedback.push('No equipment used - patient needs interventions');
    if (equipment.length > 10) feedback.push('Too many interventions - focus on essential equipment');
    if (outcome === 'patient_survived') feedback.push('Excellent work - patient survived!');
    if (vitals.spo2 > initialVitals.spo2) feedback.push('Successfully improved oxygenation');
    
    // Check achievements
    const achievements = [];
    if (timeToFirst < 30) achievements.push('Speed Demon');
    if (outcome === 'patient_survived' && equipment.length <= 5) achievements.push('Minimalist Hero');
    if (totalScore >= 90) achievements.push('Perfect Score');
    if (outcome === 'patient_survived' && currentScenario.difficulty >= 5) achievements.push('Critical Save');
    
    try {
      await base44.entities.ScenarioPerformance.create({
        scenario_name: currentScenario.name,
        scenario_condition: currentScenario.condition || currentScenario.id,
        difficulty: currentScenario.difficulty || 1,
        outcome,
        total_score: totalScore,
        time_to_first_intervention: timeToFirst,
        time_to_critical_intervention: timeToCritical,
        total_duration: duration,
        interventions_count: equipment.length,
        correct_interventions: equipment.length,
        inappropriate_interventions: 0,
        vitals_improvement: 0,
        best_practices_score: bestPracticesScore,
        resource_efficiency_score: resourceScore,
        speed_score: speedScore,
        final_vitals: vitals,
        feedback,
        achievements
      });
      
      toast.success(`Performance saved! Score: ${totalScore.toFixed(0)}/100`, {
        description: achievements.length > 0 ? `Achievements: ${achievements.join(', ')}` : undefined
      });
    } catch (error) {
      toast.error('Failed to save performance');
    }
  };

  // Title Screen
  if (gameState === 'title') {
    return <TitleScreen onPlay={() => setGameState('mode_select')} />;
  }

  // Game Mode Selection
  if (gameState === 'mode_select') {
    return (
      <GameModeSelector
        onSelectMode={(mode) => {
          setGameMode(mode);
          setFunds(mode.funds);
          setGameState('scenario_select');
        }}
        onBack={() => setGameState('title')}
      />
    );
  }

  // Scenario Selection
  if (gameState === 'scenario_select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <FundsDisplay funds={funds} gameMode={gameMode} />
          </div>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Select Emergency Scenario
            </h1>
            <p className="text-slate-600">
              Mode: {gameMode.name} • Difficulty: {gameMode.difficulty}
            </p>
          </div>
          <ScenarioSelector
            onSelectScenario={handleSelectScenario}
            onCreateCustom={handleCreateCustom}
          />
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => setGameState('mode_select')}>
              Change Game Mode
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 p-4 md:p-6">
        <div className="max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="mb-6">
            <FundsDisplay funds={funds} gameMode={gameMode} />
          </div>

          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-1">
                {currentScenario?.name}
              </h1>
              <p className="text-slate-600">{currentScenario?.description}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => setPerformanceHistoryOpen(true)}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Performance History
              </Button>
              <Button
                variant="outline"
                onClick={() => setHistoryDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Patient History
              </Button>
              <Button
                variant="outline"
                onClick={() => setSurgeryMenuOpen(true)}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Surgery
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  savePerformance('scenario_abandoned');
                  handleReset();
                }}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                End & New
              </Button>
              <Button
                onClick={() => {
                  savePerformance('patient_survived');
                  toast.success('Scenario completed successfully!');
                }}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4" />
                Complete Scenario
              </Button>
            </div>
          </div>

          {/* Death Warning */}
          <DeathImminentWarning 
            vitals={vitals} 
            onDeath={(reason) => {
              setPatientDead(true);
              savePerformance('patient_died');
              toast.error(`Patient has died: ${reason.replace(/_/g, ' ').toUpperCase()}`, {
                duration: 10000,
                description: 'Scenario failed. Performance saved.'
              });
            }}
          />

          {/* Vitals and Performance Tracker */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2">
              <PatientVitals 
                vitals={vitals} 
                scenario={{
                  ...currentScenario,
                  equipment,
                  patient_history: patientHistory
                }} 
              />
            </div>
            <div>
              <PerformanceTracker
                scenario={currentScenario}
                equipment={equipment}
                vitals={vitals}
                initialVitals={initialVitals}
                startTime={scenarioStartTime}
                interventions={interventionHistory}
              />
            </div>
          </div>

          {/* Clinical Notes */}
          {currentScenario?.notes && (
            <Card className="mb-6 p-4 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-1">Clinical Notes</h3>
                  <p className="text-sm text-amber-800">{currentScenario.notes}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Anatomy Toggle */}
          <div className="mb-4 flex items-center gap-2">
            <Button
              variant={showAnatomy ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowAnatomy(!showAnatomy)}
            >
              {showAnatomy ? 'Hide' : 'Show'} Anatomy Viewer
            </Button>
          </div>

          {/* Anatomy Viewer */}
          {showAnatomy && (
            <div className="mb-6">
              <HumanAnatomyViewer vitals={vitals} scenario={currentScenario} />
            </div>
          )}

          {/* Main Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Equipment Palette */}
            <div className="lg:col-span-1">
              <EquipmentPalette />
            </div>

            {/* Patient Workspace */}
            <div className="lg:col-span-3">
              <PatientWorkspace
                equipment={equipment}
                onRemoveEquipment={handleRemoveEquipment}
                onConfigureEquipment={handleConfigureEquipment}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Dialog */}
      <EquipmentConfigDialog
        equipment={selectedEquipment}
        open={configDialogOpen}
        onClose={() => setConfigDialogOpen(false)}
        onSave={handleSaveConfig}
      />

      {/* Patient History Dialog */}
      <PatientHistoryDialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        history={patientHistory}
        onSave={(history) => {
          setPatientHistory(history);
          toast.success('Patient history updated');
        }}
      />

      {/* Surgery Menu */}
      <SurgeryMenu
        open={surgeryMenuOpen}
        onClose={() => setSurgeryMenuOpen(false)}
        onPerformSurgery={(procedureId, success) => {
          if (success) {
            setInterventionHistory([...interventionHistory, {
              timestamp: Date.now(),
              type: `surgery_${procedureId}`,
              action: 'performed'
            }]);
            // Improve vitals after successful surgery
            setVitals(prev => ({
              ...prev,
              heart_rate: Math.min(100, prev.heart_rate + 10),
              blood_pressure_systolic: Math.min(120, prev.blood_pressure_systolic + 15),
              spo2: Math.min(100, prev.spo2 + 5)
            }));
          }
        }}
      />

      {/* Performance History */}
      <PerformanceHistory
        open={performanceHistoryOpen}
        onClose={() => setPerformanceHistoryOpen(false)}
      />
    </DragDropContext>
  );
}
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Pill, BarChart3 } from 'lucide-react';
import DrugRadarChart from './DrugRadarChart';

const DRUG_CATEGORIES = {
  vasopressors: {
    name: 'Vasopressors & Pressors',
    color: 'bg-red-100 text-red-700 border-red-300',
    drugs: [
      { name: 'Norepinephrine (Levophed)', concentration: '16mcg/ml', dosage: '0.05-3mcg/kg/min', description: 'First-line vasopressor for septic shock. Increases SVR and MAP through alpha-1 agonism.' },
      { name: 'Epinephrine (Adrenaline)', concentration: '4mcg/ml', dosage: '0.05-0.5mcg/kg/min', description: 'Potent mixed alpha/beta agonist. Used in anaphylaxis, cardiac arrest, refractory shock.' },
      { name: 'Vasopressin (Pitressin)', concentration: '1unit/ml', dosage: '0.01-0.04units/min', description: 'Non-catecholamine vasopressor. Often added as adjunct in catecholamine-resistant shock.' },
      { name: 'Phenylephrine', concentration: '100mcg/ml', dosage: '0.5-5mcg/kg/min', description: 'Pure alpha-1 agonist. Used when tachycardia needs to be avoided.' },
      { name: 'Dopamine (Intropin)', concentration: '3200mcg/ml', dosage: '2-20mcg/kg/min', description: 'Dose-dependent effects. Low doses (renal), mid (cardiac), high (vasopressor).' }
    ]
  },
  sedatives: {
    name: 'Sedatives & Anxiolytics',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    drugs: [
      { name: 'Propofol (Milk of amnesia)', concentration: '10mg/ml', dosage: '5-80mcg/kg/min', description: 'Short-acting sedative-hypnotic. Rapid onset/offset. Causes hypotension and hypertriglyceridemia.' },
      { name: 'Midazolam (Versed)', concentration: '1mg/ml', dosage: '1-5mg/hr', description: 'Benzodiazepine sedative. Good for seizure activity. Prolonged effects with continuous infusion.' },
      { name: 'Dexmedetomidine (Precedex)', concentration: '4mcg/ml', dosage: '0.2-1.5mcg/kg/hr', description: 'Alpha-2 agonist. Provides sedation without respiratory depression. Reduces delirium.' },
      { name: 'Ketamine (Special K)', concentration: '10mg/ml', dosage: '0.5-2mg/kg/hr', description: 'NMDA antagonist. Maintains hemodynamics and respiratory drive. Bronchodilator properties.' },
      { name: 'Diazepam (Valium)', concentration: '5mg/ml', dosage: '0.1-0.3mg/kg IV', description: 'Long-acting benzodiazepine for anxiety, seizures, alcohol withdrawal.' },
      { name: 'Lorazepam (Ativan)', concentration: '2mg/ml', dosage: '0.05-0.1mg/kg IV', description: 'Intermediate benzodiazepine. Status epilepticus, anxiety, alcohol withdrawal.' }
    ]
  },
  analgesics: {
    name: 'Analgesics & Opioids',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    drugs: [
      { name: 'Fentanyl (Duragesic)', concentration: '10mcg/ml', dosage: '0.5-5mcg/kg/hr', description: 'Synthetic opioid. 100x more potent than morphine. Short-acting when given as bolus.' },
      { name: 'Morphine (Morph)', concentration: '1mg/ml', dosage: '2-10mg/hr', description: 'Gold standard opioid analgesic. Causes histamine release. Active metabolites accumulate in renal failure.' },
      { name: 'Hydromorphone (Dilaudid)', concentration: '1mg/ml', dosage: '0.5-3mg/hr', description: '7x more potent than morphine. Less histamine release. Better in renal impairment.' },
      { name: 'Remifentanil', concentration: '50mcg/ml', dosage: '0.05-0.2mcg/kg/min', description: 'Ultra-short-acting opioid. Metabolized by plasma esterases. Context-sensitive half-life of 3 minutes.' },
      { name: 'Oxycodone (Oxy)', concentration: 'PO', dosage: '5-30mg q4-6h', description: 'Oral opioid for moderate-severe pain. Less nausea than morphine.' },
      { name: 'Codeine', concentration: 'PO', dosage: '30-60mg q4-6h', description: 'Mild-moderate pain and cough suppression. Metabolized to morphine.' },
      { name: 'Tramadol (Ultram)', concentration: 'PO', dosage: '50-100mg q4-6h', description: 'Weak opioid with SNRI properties. Lower abuse potential.' },
      { name: 'Naloxone (Narcan)', concentration: '0.4mg/ml', dosage: '0.04-2mg IV', description: 'Opioid antagonist for overdose reversal. Short duration requires monitoring.' },
      { name: 'Ketorolac (Toradol)', concentration: '30mg/ml', dosage: '15-30mg IV q6h', description: 'NSAID for severe pain. Max 5 days due to GI/renal risks.' }
    ]
  },
  paralytics: {
    name: 'Paralytics & Neuromuscular Blockers',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    drugs: [
      { name: 'Cisatracurium', concentration: '2mg/ml', dosage: '1-3mcg/kg/min', description: 'Non-depolarizing neuromuscular blocker. Hofmann elimination. Safe in renal/hepatic failure.' },
      { name: 'Rocuronium (Zemuron)', concentration: '10mg/ml', dosage: '8-12mcg/kg/min', description: 'Intermediate-acting paralytic. Rapid onset. Reversible with sugammadex.' },
      { name: 'Vecuronium (Norcuron)', concentration: '1mg/ml', dosage: '0.8-1.2mcg/kg/min', description: 'Non-depolarizing blocker. Minimal cardiovascular effects. Hepatic metabolism.' },
      { name: 'Succinylcholine (Sux)', concentration: '20mg/ml', dosage: '1-1.5mg/kg IV', description: 'Depolarizing blocker for RSI. Fast onset/offset. Contraindicated in hyperkalemia.' },
      { name: 'Neostigmine (Prostigmin)', concentration: '1mg/ml', dosage: '0.03-0.07mg/kg IV', description: 'Acetylcholinesterase inhibitor. Reverses non-depolarizing paralytics.' }
    ]
  },
  inotropes: {
    name: 'Inotropes & Cardiac Drugs',
    color: 'bg-green-100 text-green-700 border-green-300',
    drugs: [
      { name: 'Dobutamine (Dobutrex)', concentration: '2000mcg/ml', dosage: '2-20mcg/kg/min', description: 'Beta-1 selective agonist. Increases cardiac contractility. May cause tachycardia and hypotension.' },
      { name: 'Milrinone', concentration: '200mcg/ml', dosage: '0.25-0.75mcg/kg/min', description: 'Phosphodiesterase-3 inhibitor. Inodilator (positive inotropy + vasodilation). Long half-life.' },
      { name: 'Epinephrine (Adrenaline)', concentration: '4mcg/ml', dosage: '0.05-0.5mcg/kg/min', description: 'Mixed alpha/beta effects. Powerful inotrope at all doses.' },
      { name: 'Digoxin (Lanoxin)', concentration: '0.25mg/ml', dosage: '0.125-0.25mg/day PO', description: 'Positive inotrope for heart failure. Narrow therapeutic index. Check levels.' },
      { name: 'Nitroglycerin (GTN)', concentration: '100mcg/ml', dosage: '5-200mcg/min', description: 'Venodilator for angina, heart failure, hypertension. Headaches common.' },
      { name: 'Isosorbide dinitrate (ISDN)', concentration: 'PO', dosage: '10-40mg TID', description: 'Long-acting nitrate for angina prevention. Requires nitrate-free period.' }
    ]
  },
  antiarrhythmics: {
    name: 'Antiarrhythmics & Beta Blockers',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    drugs: [
      { name: 'Amiodarone', concentration: '1.5mg/ml', dosage: '0.5-1mg/min', description: 'Class III antiarrhythmic. For VT/VF and atrial arrhythmias. Multiple drug interactions.' },
      { name: 'Lidocaine', concentration: '4mg/ml', dosage: '1-4mg/min', description: 'Class IB antiarrhythmic. Suppresses ventricular arrhythmias. Reduced dose in hepatic dysfunction.' },
      { name: 'Esmolol', concentration: '10mg/ml', dosage: '50-300mcg/kg/min', description: 'Ultra-short-acting beta-blocker. Rapid rate control. Half-life of 9 minutes.' },
      { name: 'Metoprolol (Lopressor)', concentration: '1mg/ml', dosage: '2.5-5mg IV q2-5min', description: 'Beta-1 selective blocker. Rate control, ACS, hypertension.' },
      { name: 'Propranolol (Inderal)', concentration: '1mg/ml', dosage: '1-3mg IV slowly', description: 'Non-selective beta blocker. Tremor, HTN, thyroid storm, esophageal varices.' },
      { name: 'Atenolol (Tenormin)', concentration: 'PO', dosage: '25-100mg PO daily', description: 'Beta-1 selective blocker. Long-acting. HTN, angina, post-MI.' },
      { name: 'Carvedilol (Coreg)', concentration: 'PO', dosage: '3.125-25mg PO BID', description: 'Alpha and beta blocker. Heart failure, HTN. Fewer side effects.' },
      { name: 'Diltiazem (Cardizem)', concentration: '5mg/ml', dosage: '5-15mg/hr', description: 'Calcium channel blocker. Rate control for atrial fibrillation/flutter.' },
      { name: 'Adenosine', concentration: '3mg/ml', dosage: '6mg rapid IV push', description: 'Terminates SVT. Extremely short half-life (<10 seconds). Flush rapidly.' },
      { name: 'Verapamil', concentration: '2.5mg/ml', dosage: '5-10mg IV over 2min', description: 'Calcium channel blocker. SVT termination, rate control. Negative inotrope.' }
    ]
  },
  antibiotics: {
    name: 'Antibiotics & Antimicrobials',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    drugs: [
      { name: 'Vancomycin (Vanc)', concentration: '5mg/ml', dosage: '15-20mg/kg q8-12h', description: 'Glycopeptide antibiotic. MRSA coverage. Requires therapeutic monitoring. Nephrotoxic.' },
      { name: 'Piperacillin-Tazobactam (Zosyn)', concentration: 'varies', dosage: '3.375-4.5g q6h', description: 'Extended-spectrum penicillin. Broad gram-negative coverage including Pseudomonas.' },
      { name: 'Meropenem', concentration: 'varies', dosage: '1-2g q8h', description: 'Carbapenem antibiotic. Reserved for MDR organisms. Very broad spectrum.' },
      { name: 'Ceftriaxone (Rocephin)', concentration: 'varies', dosage: '1-2g q24h', description: 'Third-gen cephalosporin. Pneumonia, meningitis, sepsis. Once daily dosing.' },
      { name: 'Cefepime', concentration: 'varies', dosage: '1-2g q8-12h', description: 'Fourth-gen cephalosporin. Pseudomonas coverage. Febrile neutropenia.' },
      { name: 'Azithromycin (Z-pack)', concentration: 'varies', dosage: '500mg IV/PO q24h', description: 'Macrolide for atypical pneumonia. QT prolongation risk.' },
      { name: 'Levofloxacin (Levaquin)', concentration: 'varies', dosage: '750mg IV/PO q24h', description: 'Fluoroquinolone. Broad spectrum. Tendon rupture, QT prolongation risks.' },
      { name: 'Ciprofloxacin (Cipro)', concentration: '2mg/ml', dosage: '400mg IV q8-12h', description: 'Fluoroquinolone. UTI, respiratory, GI infections. Good bioavailability.' },
      { name: 'Amoxicillin-Clavulanate (Augmentin)', concentration: 'PO', dosage: '875mg PO q12h', description: 'Broad-spectrum penicillin. Sinusitis, pneumonia, UTI. Well tolerated.' },
      { name: 'Metronidazole (Flagyl)', concentration: '5mg/ml', dosage: '500mg IV q8h', description: 'Anaerobic coverage. C. diff, aspiration pneumonia, intra-abdominal infections.' },
      { name: 'Linezolid (Zyvox)', concentration: '2mg/ml', dosage: '600mg IV/PO q12h', description: 'For VRE and MRSA. Serotonin syndrome risk. Thrombocytopenia with prolonged use.' },
      { name: 'Doxycycline (Doxy)', concentration: 'PO', dosage: '100mg PO q12h', description: 'Tetracycline. Atypicals, tick-borne diseases, acne. Photosensitivity.' },
      { name: 'Clindamycin', concentration: '150mg/ml', dosage: '600-900mg IV q8h', description: 'Anaerobe coverage. Skin infections, aspiration. C. diff risk.' },
      { name: 'Gentamicin', concentration: '10mg/ml', dosage: '5-7mg/kg IV q24h', description: 'Aminoglycoside. Gram-negative coverage. Nephrotoxic, ototoxic. Monitor levels.' },
      { name: 'Acyclovir', concentration: '50mg/ml', dosage: '5-10mg/kg IV q8h', description: 'Antiviral for HSV, VZV encephalitis. Requires hydration to prevent crystalluria.' }
    ]
  },
  fluids: {
    name: 'IV Fluids & Electrolytes',
    color: 'bg-cyan-100 text-cyan-700 border-cyan-300',
    drugs: [
      { name: 'Normal Saline 0.9%', concentration: 'isotonic', dosage: 'variable', description: 'Isotonic crystalloid. Risk of hyperchloremic acidosis with large volumes.' },
      { name: 'Lactated Ringers', concentration: 'isotonic', dosage: 'variable', description: 'Balanced crystalloid. Preferred in trauma and surgery. Contains lactate buffer.' },
      { name: 'Albumin 5%', concentration: 'colloid', dosage: 'variable', description: 'Colloid solution. Volume expander. Maintains oncotic pressure. Expensive.' },
      { name: 'Plasmalyte', concentration: 'isotonic', dosage: 'variable', description: 'Balanced crystalloid. More physiologic electrolyte composition. Acetate/gluconate buffers.' },
      { name: 'Calcium Gluconate', concentration: '100mg/ml', dosage: '1-2g IV slowly', description: 'For hypocalcemia, hyperkalemia, calcium channel blocker overdose.' },
      { name: 'Magnesium Sulfate (MgSO₄)', concentration: '500mg/ml', dosage: '1-2g IV', description: 'Eclampsia, torsades, hypomagnesemia, asthma exacerbation.' },
      { name: 'Sodium Bicarbonate (Bicarb)', concentration: '1mEq/ml', dosage: 'varies', description: 'Severe metabolic acidosis, hyperkalemia, TCA overdose. Can worsen intracellular acidosis.' },
      { name: 'Dextrose 50%', concentration: '0.5g/ml', dosage: '25-50ml IV', description: 'Severe hypoglycemia. Follow with D5 or D10 infusion.' }
    ]
  },
  anticoagulants: {
    name: 'Anticoagulants & Hemostatics',
    color: 'bg-rose-100 text-rose-700 border-rose-300',
    drugs: [
      { name: 'Heparin (UFH)', concentration: '1000units/ml', dosage: '80units/kg bolus, 18units/kg/hr', description: 'Unfractionated heparin. VTE, ACS. Monitor aPTT. Reversible with protamine.' },
      { name: 'Enoxaparin (Lovenox)', concentration: '100mg/ml', dosage: '1mg/kg SC q12h', description: 'Low molecular weight heparin. More predictable than UFH. Renal dosing required.' },
      { name: 'Warfarin (Coumadin)', concentration: 'PO', dosage: 'variable', description: 'Vitamin K antagonist. Monitor INR. Many drug/food interactions.' },
      { name: 'Apixaban (Eliquis)', concentration: 'PO', dosage: '5mg PO BID', description: 'Direct factor Xa inhibitor. No monitoring required. For AFib, VTE.' },
      { name: 'Clopidogrel (Plavix)', concentration: 'PO', dosage: '75mg PO daily', description: 'P2Y12 inhibitor. Antiplatelet after stent, ACS. Loading dose 300-600mg.' },
      { name: 'Aspirin (ASA)', concentration: '81-325mg', dosage: '81-325mg PO daily', description: 'Antiplatelet. ACS, stroke prevention, post-stent. Irreversible platelet inhibition.' },
      { name: 'Tranexamic Acid (TXA)', concentration: '100mg/ml', dosage: '1g IV over 10min', description: 'Antifibrinolytic. Massive hemorrhage, trauma. Give within 3 hours.' },
      { name: 'Protamine', concentration: '10mg/ml', dosage: '1mg per 100units heparin', description: 'Reverses heparin. Give slowly to avoid hypotension.' }
    ]
  },
  emergency: {
    name: 'Emergency & Resuscitation',
    color: 'bg-red-200 text-red-800 border-red-400',
    drugs: [
      { name: 'Epinephrine 1:10,000', concentration: '0.1mg/ml', dosage: '1mg IV q3-5min', description: 'Cardiac arrest. First-line for VF/pVT, PEA, asystole. Peripheral or central.' },
      { name: 'Atropine', concentration: '0.1mg/ml', dosage: '0.5-1mg IV q3-5min', description: 'Bradycardia, organophosphate poisoning. Max 3mg in cardiac arrest.' },
      { name: 'Dextrose 50%', concentration: '0.5g/ml', dosage: '25-50ml IV', description: 'Severe hypoglycemia <40mg/dL. Check glucose before sedation/arrest.' },
      { name: 'Naloxone (Narcan)', concentration: '0.4mg/ml', dosage: '0.04-2mg IV/IM/IN', description: 'Opioid overdose. Repeat q2-3min. May precipitate withdrawal.' },
      { name: 'Flumazenil', concentration: '0.1mg/ml', dosage: '0.2mg IV over 30sec', description: 'Benzodiazepine reversal. Risk of seizures. Use with caution.' },
      { name: 'Mannitol (Osmitrol)', concentration: '20%', dosage: '0.5-1g/kg IV', description: 'Increased ICP, cerebral edema. Osmotic diuretic. Monitor serum osmolality.' },
      { name: 'Activated Charcoal', concentration: 'PO', dosage: '50-100g PO', description: 'Poisoning/overdose within 1 hour. Not for caustics, hydrocarbons, alcohols.' },
      { name: 'Desmopressin (DDAVP)', concentration: '4mcg/ml', dosage: '0.3mcg/kg IV', description: 'Diabetes insipidus, uremic bleeding, hemophilia A/vWD. Releases vWF.' }
    ]
  },
  respiratory: {
    name: 'Respiratory Medications',
    color: 'bg-sky-100 text-sky-700 border-sky-300',
    drugs: [
      { name: 'Albuterol (Ventolin)', concentration: 'nebulized', dosage: '2.5-5mg q4-6h', description: 'Beta-2 agonist bronchodilator. Asthma, COPD exacerbation. Can cause tachycardia.' },
      { name: 'Ipratropium (Atrovent)', concentration: 'nebulized', dosage: '0.5mg q6h', description: 'Anticholinergic bronchodilator. Often combined with albuterol for COPD.' },
      { name: 'Budesonide (Pulmicort)', concentration: 'inhaled', dosage: '0.5-2mg BID', description: 'Inhaled corticosteroid. Maintenance asthma/COPD therapy. Not for acute.' },
      { name: 'Methylprednisolone', concentration: '125mg vial', dosage: '125mg IV q6h', description: 'Steroid for asthma, COPD exacerbation, anaphylaxis, spinal cord injury.' },
      { name: 'Dexamethasone (Dex)', concentration: '4mg/ml', dosage: '0.15mg/kg IV', description: 'Potent steroid. Croup, cerebral edema, COVID ARDS. Less mineralocorticoid effect.' }
    ]
  },
  gi: {
    name: 'Gastrointestinal Medications',
    color: 'bg-amber-100 text-amber-700 border-amber-300',
    drugs: [
      { name: 'Pantoprazole (Protonix)', concentration: '40mg vial', dosage: '40mg IV q12-24h', description: 'PPI for stress ulcer prophylaxis, GERD, GI bleed. Can give 8mg/hr infusion.' },
      { name: 'Omeprazole (Prilosec)', concentration: 'PO', dosage: '20-40mg PO daily', description: 'PPI for GERD, PUD. Take 30 minutes before meal.' },
      { name: 'Famotidine (Pepcid)', concentration: '10mg/ml', dosage: '20mg IV q12h', description: 'H2 blocker for stress ulcer prophylaxis. Less effective than PPIs.' },
      { name: 'Ondansetron (Zofran)', concentration: '2mg/ml', dosage: '4-8mg IV q8h', description: 'Antiemetic. Blocks 5-HT3 receptors. QT prolongation risk.' },
      { name: 'Metoclopramide (Reglan)', concentration: '5mg/ml', dosage: '10mg IV q6h', description: 'Prokinetic antiemetic. Extrapyramidal side effects. Contraindicated in bowel obstruction.' },
      { name: 'Promethazine (Phenergan)', concentration: '25mg/ml', dosage: '12.5-25mg IV q4-6h', description: 'Antihistamine antiemetic. Sedating. Avoid extravasation (tissue necrosis).' },
      { name: 'Prochlorperazine (Compazine)', concentration: '5mg/ml', dosage: '5-10mg IV q6h', description: 'Dopamine antagonist. Nausea, vertigo. Extrapyramidal effects.' },
      { name: 'Octreotide', concentration: '100mcg/ml', dosage: '25-50mcg/hr infusion', description: 'Somatostatin analog. Variceal bleeding, carcinoid syndrome, acromegaly.' }
    ]
  },
  neuro: {
    name: 'Neurological Medications',
    color: 'bg-violet-100 text-violet-700 border-violet-300',
    drugs: [
      { name: 'Levetiracetam (Keppra)', concentration: '100mg/ml', dosage: '500-1500mg IV q12h', description: 'Antiepileptic. First-line for seizures. Minimal drug interactions. Renal dosing.' },
      { name: 'Phenytoin (Dilantin)', concentration: '50mg/ml', dosage: '15-20mg/kg IV load', description: 'Status epilepticus. Give slowly (<50mg/min). Causes hypotension, arrhythmias.' },
      { name: 'Valproate (Depakote)', concentration: '100mg/ml', dosage: '20-40mg/kg IV load', description: 'Broad-spectrum antiepileptic. Hepatotoxic. Teratogenic.' },
      { name: 'Labetalol', concentration: '5mg/ml', dosage: '20mg IV, then 40-80mg q10min', description: 'Alpha/beta blocker for hypertensive emergency, eclampsia. Max 300mg total.' },
      { name: 'Nicardipine', concentration: '0.1mg/ml', dosage: '5-15mg/hr', description: 'Calcium channel blocker. Titratable for BP control. Preferred in stroke, neuro ICU.' }
    ]
  },
  metabolic: {
    name: 'Metabolic & Endocrine',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    drugs: [
      { name: 'Insulin Regular (Humulin R)', concentration: '100units/ml', dosage: '0.1units/kg/hr', description: 'Short-acting insulin. DKA, HHS, hyperkalemia. IV only regular insulin.' },
      { name: 'Insulin Glargine (Lantus)', concentration: '100units/ml', dosage: '0.2units/kg SC daily', description: 'Long-acting basal insulin. Never give IV. Adjust daily.' },
      { name: 'Insulin Lispro (Humalog)', concentration: '100units/ml', dosage: '0.1-0.2units/kg SC', description: 'Rapid-acting insulin. Peaks 30-90 min. For prandial coverage.' },
      { name: 'Insulin Aspart (NovoLog)', concentration: '100units/ml', dosage: '0.1-0.2units/kg SC', description: 'Rapid-acting insulin analog. Similar to lispro. 15 min onset.' },
      { name: 'Hydrocortisone', concentration: '100mg vial', dosage: '50mg IV q6h', description: 'Stress dose steroids. Adrenal insufficiency, septic shock, anaphylaxis.' },
      { name: 'Prednisone', concentration: 'PO', dosage: '40-60mg PO daily', description: 'Oral corticosteroid. Asthma, COPD, autoimmune. Taper to avoid adrenal crisis.' },
      { name: 'Levothyroxine (Synthroid)', concentration: '100mcg vial', dosage: '1.6mcg/kg PO daily', description: 'Hypothyroidism. Myxedema coma: 200-500mcg IV load.' },
      { name: 'Glucagon', concentration: '1mg vial', dosage: '1mg IM/SC/IV', description: 'Severe hypoglycemia when IV access unavailable. Beta-blocker overdose.' },
      { name: 'Octreotide', concentration: '100mcg/ml', dosage: '50-100mcg SC TID', description: 'Somatostatin analog. Variceal bleeding, acromegaly, carcinoid crisis.' },
      { name: 'Canagliflozin (Invokana)', concentration: 'PO', dosage: '100-300mg PO daily', description: 'SGLT2 inhibitor. DM, HF benefit. DKA risk, UTI, genital infections.' },
      { name: 'Dapagliflozin (Farxiga)', concentration: 'PO', dosage: '5-10mg PO daily', description: 'SGLT2 inhibitor. DM, HF, CKD. Cardiovascular benefits.' },
      { name: 'Liraglutide (Victoza)', concentration: '6mg/ml', dosage: '0.6-1.8mg SC daily', description: 'GLP-1 agonist. DM, obesity. CV benefit. Medullary thyroid cancer risk.' },
      { name: 'Tirzepatide (Mounjaro)', concentration: '2.5mg/0.5ml', dosage: '5-15mg SC weekly', description: 'Dual GIP/GLP-1 agonist. Superior A1c and weight loss.' }
    ]
  },
  pain_management: {
    name: 'Advanced Pain Management',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    drugs: [
      { name: 'Bupivacaine', concentration: '5mg/ml', dosage: 'local infiltration', description: 'Long-acting local anesthetic. Epidural, spinal, nerve blocks. Cardiotoxic.' },
      { name: 'Lidocaine 1-2%', concentration: '10-20mg/ml', dosage: 'local infiltration', description: 'Local anesthetic. Rapid onset, intermediate duration. Max 4.5mg/kg.' },
      { name: 'Ropivacaine', concentration: '2mg/ml', dosage: 'epidural/nerve block', description: 'Long-acting amide anesthetic. Less cardiotoxic than bupivacaine.' },
      { name: 'Ketamine (Sub-dissociative)', concentration: '10mg/ml', dosage: '0.1-0.3mg/kg IV', description: 'Low-dose analgesic. Severe pain, opioid-sparing. Preserves airway.' },
      { name: 'Gabapentin (Neurontin)', concentration: 'PO', dosage: '300-900mg PO TID', description: 'Neuropathic pain. Adjunct for chronic pain. Dizziness, sedation.' },
      { name: 'Pregabalin (Lyrica)', concentration: 'PO', dosage: '75-150mg PO BID', description: 'Neuropathic pain, fibromyalgia. More potent than gabapentin.' },
      { name: 'Acetaminophen (Tylenol)', concentration: '10mg/ml', dosage: '1g IV/PO q6h', description: 'Non-opioid analgesic/antipyretic. Max 4g/day. Hepatotoxic in overdose.' },
      { name: 'Ibuprofen (Motrin)', concentration: 'PO', dosage: '400-800mg PO q6h', description: 'NSAID for pain and inflammation. GI bleed and renal risks. Max 3200mg/day.' }
    ]
  },
  toxicology: {
    name: 'Toxicology & Antidotes',
    color: 'bg-pink-100 text-pink-700 border-pink-300',
    drugs: [
      { name: 'N-Acetylcysteine (NAC)', concentration: '200mg/ml', dosage: '150mg/kg load, then protocol', description: 'Acetaminophen overdose. Prevents hepatotoxicity. Give within 8 hours optimal.' },
      { name: 'Fomepizole (Antizol)', concentration: '1g/ml', dosage: '15mg/kg IV load', description: 'Ethylene glycol/methanol poisoning. Alcohol dehydrogenase inhibitor.' },
      { name: 'Pralidoxime (2-PAM)', concentration: '50mg/ml', dosage: '1-2g IV over 30min', description: 'Organophosphate poisoning. Reactivates acetylcholinesterase. Give with atropine.' },
      { name: 'Calcium EDTA', concentration: 'varies', dosage: '1g/m² IV q24h', description: 'Lead poisoning. Chelation therapy. Monitor calcium levels.' },
      { name: 'Deferoxamine (Desferal)', concentration: '500mg vial', dosage: '15mg/kg/hr IV', description: 'Iron overdose. Chelates free iron. Turns urine pink/red (ferrioxamine).' },
      { name: 'Methylene Blue', concentration: '10mg/ml', dosage: '1-2mg/kg IV over 5min', description: 'Methemoglobinemia. Turns skin/urine blue. Contraindicated in G6PD deficiency.' },
      { name: 'Hydroxocobalamin (Cyanokit)', concentration: '2.5g vial', dosage: '5g IV over 15min', description: 'Cyanide poisoning. Binds cyanide. Turns skin/urine red.' },
      { name: 'Dimercaprol (BAL)', concentration: '100mg/ml', dosage: '3-5mg/kg IM q4h', description: 'Heavy metal poisoning (arsenic, mercury, lead). IM only. Painful injection.' },
      { name: 'Physostigmine', concentration: '1mg/ml', dosage: '0.5-2mg IV slowly', description: 'Anticholinergic toxidrome reversal. Risk of seizures/bradycardia.' }
    ]
  },
  psychiatric: {
    name: 'Psychiatric Medications',
    color: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',
    drugs: [
      { name: 'Haloperidol (Haldol)', concentration: '5mg/ml', dosage: '2-10mg IM/IV', description: 'Typical antipsychotic. Acute agitation, delirium. Extrapyramidal symptoms, QT prolongation.' },
      { name: 'Olanzapine (Zyprexa)', concentration: '10mg IM', dosage: '5-10mg IM', description: 'Atypical antipsychotic. Agitation, psychosis. Less EPS than haloperidol.' },
      { name: 'Quetiapine (Seroquel)', concentration: 'PO', dosage: '25-800mg PO daily', description: 'Atypical antipsychotic. Psychosis, bipolar. Sedating. Metabolic syndrome risk.' },
      { name: 'Risperidone (Risperdal)', concentration: 'PO/IM', dosage: '1-6mg PO daily', description: 'Atypical antipsychotic. Schizophrenia, bipolar. Prolactin elevation.' },
      { name: 'Lithium Carbonate', concentration: 'PO', dosage: '300-600mg PO TID', description: 'Mood stabilizer. Bipolar disorder. Narrow therapeutic index. Monitor levels.' },
      { name: 'Sertraline (Zoloft)', concentration: 'PO', dosage: '50-200mg PO daily', description: 'SSRI antidepressant. Depression, anxiety. Serotonin syndrome risk.' },
      { name: 'Escitalopram (Lexapro)', concentration: 'PO', dosage: '10-20mg PO daily', description: 'SSRI antidepressant. Well-tolerated. Fewer drug interactions.' },
      { name: 'Venlafaxine (Effexor)', concentration: 'PO', dosage: '75-225mg PO daily', description: 'SNRI antidepressant. Depression, anxiety. Hypertension at high doses.' }
    ]
  },
  immunosuppressants: {
    name: 'Immunosuppressants',
    color: 'bg-lime-100 text-lime-700 border-lime-300',
    drugs: [
      { name: 'Tacrolimus (Prograf)', concentration: 'PO/IV', dosage: '0.1-0.2mg/kg/day', description: 'Calcineurin inhibitor. Organ transplant. Nephrotoxic. Monitor levels.' },
      { name: 'Cyclosporine (Neoral)', concentration: 'PO/IV', dosage: '2-5mg/kg/day', description: 'Calcineurin inhibitor. Transplant rejection. Nephrotoxic, hypertension.' },
      { name: 'Mycophenolate (CellCept)', concentration: 'PO/IV', dosage: '1-2g PO BID', description: 'Purine synthesis inhibitor. Transplant, lupus nephritis. GI side effects.' },
      { name: 'Azathioprine (Imuran)', concentration: 'PO', dosage: '1-3mg/kg/day', description: 'Purine analog. Autoimmune diseases. Check TPMT enzyme. Bone marrow suppression.' },
      { name: 'Rituximab (Rituxan)', concentration: 'IV infusion', dosage: '375mg/m² IV weekly', description: 'Anti-CD20 antibody. Lymphoma, autoimmune. Infusion reactions.' },
      { name: 'Infliximab (Remicade)', concentration: 'IV infusion', dosage: '3-10mg/kg IV', description: 'TNF-alpha inhibitor. Crohn\'s, RA, psoriasis. Infection risk, infusion reactions.' }
    ]
  },
  antivirals_antifungals: {
    name: 'Antivirals & Antifungals',
    color: 'bg-teal-100 text-teal-700 border-teal-300',
    drugs: [
      { name: 'Ganciclovir (Cytovene)', concentration: '10mg/ml', dosage: '5mg/kg IV q12h', description: 'CMV retinitis, colitis. Bone marrow suppression. Monitor CBC.' },
      { name: 'Valganciclovir (Valcyte)', concentration: 'PO', dosage: '900mg PO BID', description: 'Oral CMV treatment. Prodrug of ganciclovir. Better bioavailability.' },
      { name: 'Foscarnet (Foscavir)', concentration: '24mg/ml', dosage: '60mg/kg IV q8h', description: 'Resistant CMV/HSV. Nephrotoxic. Electrolyte wasting. Monitor Ca, Mg, K.' },
      { name: 'Ribavirin (Virazole)', concentration: 'varies', dosage: 'inhaled/PO/IV', description: 'RSV in infants, Hep C combo therapy. Teratogenic. Hemolytic anemia.' },
      { name: 'Entecavir (Baraclude)', concentration: 'PO', dosage: '0.5-1mg PO daily', description: 'Hepatitis B. Potent viral suppression. Monitor LFTs, viral load.' },
      { name: 'Dolutegravir (Tivicay)', concentration: 'PO', dosage: '50mg PO daily', description: 'HIV integrase inhibitor. High barrier to resistance. Well-tolerated.' },
      { name: 'Amphotericin B (AmBisome)', concentration: '5mg/ml', dosage: '3-5mg/kg IV daily', description: 'Systemic fungal infections. Nephrotoxic, infusion reactions. Premedicate.' },
      { name: 'Voriconazole (Vfend)', concentration: '10mg/ml', dosage: '6mg/kg load, then 4mg/kg IV q12h', description: 'Aspergillosis. Visual disturbances. Monitor levels. Drug interactions.' },
      { name: 'Posaconazole (Noxafil)', concentration: 'PO', dosage: '300mg PO BID', description: 'Fungal prophylaxis in neutropenia. Good Mucor coverage.' },
      { name: 'Caspofungin (Cancidas)', concentration: '5mg/ml', dosage: '70mg load, then 50mg IV daily', description: 'Echinocandin. Invasive candidiasis. Well-tolerated. Limited resistance.' },
      { name: 'Micafungin (Mycamine)', concentration: '5mg/ml', dosage: '100-150mg IV daily', description: 'Echinocandin. Candidemia, esophageal candidiasis. Minimal drug interactions.' },
      { name: 'Flucytosine (Ancobon)', concentration: 'PO', dosage: '25mg/kg PO q6h', description: 'Cryptococcal meningitis with amphotericin. Bone marrow suppression.' }
    ]
  },
  hematology_immune: {
    name: 'Hematology & Colony Stimulating',
    color: 'bg-red-100 text-red-700 border-red-300',
    drugs: [
      { name: 'Epoetin Alfa (Epogen)', concentration: '10,000units/ml', dosage: '50-100units/kg SC 3x/week', description: 'Anemia of CKD, chemo. Recombinant EPO. Hypertension, thrombosis risk.' },
      { name: 'Darbepoetin (Aranesp)', concentration: 'varies', dosage: '0.45mcg/kg SC weekly', description: 'Long-acting EPO. Anemia of CKD. Less frequent dosing than epoetin.' },
      { name: 'Filgrastim (Neupogen)', concentration: '300mcg/ml', dosage: '5mcg/kg SC daily', description: 'Neutropenia. G-CSF. Chemo, BMT. Bone pain common.' },
      { name: 'Pegfilgrastim (Neulasta)', concentration: '6mg/0.6ml', dosage: '6mg SC once per cycle', description: 'Long-acting G-CSF. Single dose per chemo cycle. Bone pain.' },
      { name: 'Romiplostim (Nplate)', concentration: 'varies', dosage: '1-10mcg/kg SC weekly', description: 'ITP. Thrombopoietin receptor agonist. Titrate to platelet count.' },
      { name: 'Eltrombopag (Promacta)', concentration: 'PO', dosage: '25-75mg PO daily', description: 'ITP, severe aplastic anemia. Oral TPO agonist. Hepatotoxicity.' },
      { name: 'Iron Sucrose (Venofer)', concentration: '20mg/ml', dosage: '200mg IV over 2-5min', description: 'Iron deficiency anemia. Less anaphylaxis than iron dextran.' },
      { name: 'Ferric Carboxymaltose (Injectafer)', concentration: '50mg/ml', dosage: '750mg IV over 15min', description: 'Iron deficiency. High-dose infusion. Hypophosphatemia risk.' }
    ]
  }
};

export default function DrugDatabase({ open, onClose, onSelectDrug, pumpType }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [showChart, setShowChart] = useState(false);

  const handleSelectDrug = (drug, category) => {
    onSelectDrug({
      name: drug.name,
      concentration: drug.concentration,
      dosage: drug.dosage,
      category: category
    });
    onClose();
  };

  const filteredCategories = selectedCategory 
    ? { [selectedCategory]: DRUG_CATEGORIES[selectedCategory] }
    : DRUG_CATEGORIES;

  const searchResults = searchQuery.trim() 
    ? Object.entries(DRUG_CATEGORIES).flatMap(([catKey, category]) =>
        category.drugs
          .filter(drug => 
            drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            drug.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(drug => ({ ...drug, category: catKey, categoryName: category.name }))
      )
    : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5" />
              Drug Database - {pumpType === 'syringe_pump' ? 'Syringe Pump' : 'IV Infusion'}
            </DialogTitle>
            {selectedDrug && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChart(!showChart)}
                className="flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                {showChart ? 'Hide' : 'Show'} Chart
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search medications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Search Results */}
          {searchResults && searchResults.length > 0 ? (
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {searchResults.map((drug, idx) => (
                  <div
                    key={idx}
                    className={`p-4 border-2 rounded-lg hover:shadow-md transition-all cursor-pointer ${
                      selectedDrug?.name === drug.name ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedDrug(drug)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-slate-800">{drug.name}</h4>
                        <Badge className={`text-xs mt-1 ${DRUG_CATEGORIES[drug.category].color}`}>
                          {drug.categoryName}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectDrug(drug, drug.category);
                        }}
                      >
                        USE
                      </Button>
                    </div>
                    {selectedDrug?.name === drug.name && showChart && (
                      <div className="mb-3 bg-white p-3 rounded-lg border">
                        <DrugRadarChart drug={selectedDrug} />
                      </div>
                    )}
                    <p className="text-sm text-slate-600 mb-2">{drug.description}</p>
                    <div className="flex gap-4 text-xs text-slate-500">
                      <span>Concentration: {drug.concentration}</span>
                      <span>Dosage: {drug.dosage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : searchResults && searchResults.length === 0 ? (
            <div className="text-center py-8 text-slate-400">No medications found</div>
          ) : (
            <>
              {/* Categories */}
              {!selectedCategory && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(DRUG_CATEGORIES).map(([key, category]) => (
                    <Button
                      key={key}
                      variant="outline"
                      className={`h-auto py-4 flex flex-col items-center gap-2 ${category.color}`}
                      onClick={() => setSelectedCategory(key)}
                    >
                      <Pill className="w-5 h-5" />
                      <span className="font-semibold text-sm">{category.name}</span>
                      <span className="text-xs opacity-75">{category.drugs.length} drugs</span>
                    </Button>
                  ))}
                </div>
              )}

              {/* Drug List */}
              {selectedCategory && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">{DRUG_CATEGORIES[selectedCategory].name}</h3>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)}>
                      ← Back to Categories
                    </Button>
                  </div>
                  <ScrollArea className="h-[450px]">
                    <div className="space-y-2">
                      {DRUG_CATEGORIES[selectedCategory].drugs.map((drug, idx) => (
                        <div
                          key={idx}
                          className={`p-4 border-2 rounded-lg hover:shadow-md transition-all cursor-pointer ${
                            selectedDrug?.name === drug.name ? 'border-blue-500 bg-blue-50' : ''
                          }`}
                          onClick={() => setSelectedDrug({ ...drug, category: selectedCategory })}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-bold text-slate-800">{drug.name}</h4>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectDrug(drug, selectedCategory);
                              }}
                            >
                              USE
                            </Button>
                          </div>
                          {selectedDrug?.name === drug.name && showChart && (
                            <div className="mb-3 bg-white p-3 rounded-lg border">
                              <DrugRadarChart drug={selectedDrug} />
                            </div>
                          )}
                          <p className="text-sm text-slate-600 mb-2 break-words">{drug.description}</p>
                          <div className="flex gap-4 text-xs text-slate-500">
                            <span>Concentration: {drug.concentration}</span>
                            <span>Dosage: {drug.dosage}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { DRUG_CATEGORIES };
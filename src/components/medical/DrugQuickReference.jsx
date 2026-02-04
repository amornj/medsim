import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, StarOff, Pin, PinOff, Heart, Wind, Brain,
  Zap, Droplets, Shield, AlertTriangle, Pill, Info, X
} from 'lucide-react';

// Drug database
const DRUGS = [
  // Cardiovascular
  {
    id: 'epinephrine',
    name: 'Epinephrine',
    brandNames: ['Adrenaline', 'EpiPen'],
    category: 'cardiovascular',
    class: 'Catecholamine',
    mechanism: 'Alpha and beta adrenergic agonist',
    indications: ['Cardiac arrest', 'Anaphylaxis', 'Severe bradycardia', 'Hypotension'],
    dose: {
      cardiac_arrest: '1mg IV/IO q3-5min',
      anaphylaxis: '0.3-0.5mg IM',
      infusion: '2-10 mcg/min'
    },
    sideEffects: ['Tachycardia', 'Hypertension', 'Arrhythmias', 'Anxiety'],
    contraindications: ['Ventricular fibrillation (relative)'],
    color: 'red'
  },
  {
    id: 'norepinephrine',
    name: 'Norepinephrine',
    brandNames: ['Levophed'],
    category: 'cardiovascular',
    class: 'Catecholamine',
    mechanism: 'Alpha-1 > Beta-1 adrenergic agonist',
    indications: ['Septic shock', 'Cardiogenic shock', 'Severe hypotension'],
    dose: {
      infusion: '0.1-30 mcg/min',
      start: '8-12 mcg/min, titrate to MAP >65'
    },
    sideEffects: ['Bradycardia', 'Peripheral ischemia', 'Arrhythmias'],
    contraindications: ['Peripheral or mesenteric ischemia'],
    color: 'red'
  },
  {
    id: 'dopamine',
    name: 'Dopamine',
    brandNames: ['Intropin'],
    category: 'cardiovascular',
    class: 'Catecholamine',
    mechanism: 'Dose-dependent D1, beta-1, alpha-1 agonist',
    indications: ['Cardiogenic shock', 'Bradycardia', 'Hypotension'],
    dose: {
      low: '2-5 mcg/kg/min (renal)',
      medium: '5-10 mcg/kg/min (cardiac)',
      high: '>10 mcg/kg/min (vasopressor)'
    },
    sideEffects: ['Tachycardia', 'Arrhythmias', 'Nausea', 'Tissue necrosis'],
    contraindications: ['Pheochromocytoma', 'Ventricular fibrillation'],
    color: 'red'
  },
  {
    id: 'dobutamine',
    name: 'Dobutamine',
    brandNames: ['Dobutrex'],
    category: 'cardiovascular',
    class: 'Catecholamine',
    mechanism: 'Beta-1 > Beta-2 adrenergic agonist',
    indications: ['Cardiogenic shock', 'Heart failure', 'Stress testing'],
    dose: {
      infusion: '2.5-20 mcg/kg/min',
      start: '2.5 mcg/kg/min, titrate'
    },
    sideEffects: ['Tachycardia', 'Hypotension', 'Arrhythmias'],
    contraindications: ['IHSS', 'Severe hypertension'],
    color: 'red'
  },
  {
    id: 'amiodarone',
    name: 'Amiodarone',
    brandNames: ['Cordarone', 'Pacerone'],
    category: 'cardiovascular',
    class: 'Class III Antiarrhythmic',
    mechanism: 'Blocks K+, Na+, Ca++ channels; beta-blockade',
    indications: ['VF/pVT', 'Atrial fibrillation', 'Ventricular tachycardia'],
    dose: {
      cardiac_arrest: '300mg IV push, then 150mg',
      stable_vt: '150mg over 10min, then 1mg/min'
    },
    sideEffects: ['Hypotension', 'Bradycardia', 'Pulmonary toxicity', 'Thyroid dysfunction'],
    contraindications: ['Cardiogenic shock', 'AV block', 'QT prolongation'],
    color: 'red'
  },
  {
    id: 'atropine',
    name: 'Atropine',
    brandNames: ['AtroPen'],
    category: 'cardiovascular',
    class: 'Anticholinergic',
    mechanism: 'Muscarinic receptor antagonist',
    indications: ['Symptomatic bradycardia', 'Organophosphate poisoning', 'RSI pretreatment'],
    dose: {
      bradycardia: '0.5mg IV q3-5min (max 3mg)',
      organophosphate: '2-4mg IV, may repeat'
    },
    sideEffects: ['Tachycardia', 'Dry mouth', 'Urinary retention', 'Mydriasis'],
    contraindications: ['Glaucoma', 'Myasthenia gravis'],
    color: 'red'
  },

  // Respiratory
  {
    id: 'albuterol',
    name: 'Albuterol',
    brandNames: ['Ventolin', 'ProAir', 'Proventil'],
    category: 'respiratory',
    class: 'Beta-2 Agonist',
    mechanism: 'Selective beta-2 adrenergic agonist',
    indications: ['Asthma', 'COPD', 'Bronchospasm', 'Hyperkalemia'],
    dose: {
      nebulizer: '2.5-5mg q20min x3',
      mdi: '4-8 puffs q20min x3'
    },
    sideEffects: ['Tachycardia', 'Tremor', 'Hypokalemia', 'Anxiety'],
    contraindications: ['Hypersensitivity'],
    color: 'blue'
  },
  {
    id: 'ipratropium',
    name: 'Ipratropium',
    brandNames: ['Atrovent'],
    category: 'respiratory',
    class: 'Anticholinergic',
    mechanism: 'Muscarinic antagonist',
    indications: ['COPD', 'Asthma (adjunct)', 'Bronchospasm'],
    dose: {
      nebulizer: '0.5mg q6h',
      mdi: '2 puffs QID'
    },
    sideEffects: ['Dry mouth', 'Cough', 'Headache'],
    contraindications: ['Hypersensitivity to atropine'],
    color: 'blue'
  },

  // Sedation/Analgesia
  {
    id: 'propofol',
    name: 'Propofol',
    brandNames: ['Diprivan'],
    category: 'sedation',
    class: 'General Anesthetic',
    mechanism: 'GABA-A receptor modulation',
    indications: ['RSI', 'Sedation', 'Status epilepticus'],
    dose: {
      induction: '1.5-2.5 mg/kg IV',
      sedation: '25-75 mcg/kg/min'
    },
    sideEffects: ['Hypotension', 'Respiratory depression', 'Injection pain', 'PRIS'],
    contraindications: ['Egg/soy allergy (relative)', 'Hemodynamic instability'],
    color: 'purple'
  },
  {
    id: 'fentanyl',
    name: 'Fentanyl',
    brandNames: ['Sublimaze', 'Duragesic'],
    category: 'sedation',
    class: 'Opioid',
    mechanism: 'Mu-opioid receptor agonist',
    indications: ['Pain', 'RSI', 'Procedural sedation'],
    dose: {
      analgesia: '25-100 mcg IV q1-2h',
      rsi: '1-3 mcg/kg IV',
      infusion: '25-100 mcg/hr'
    },
    sideEffects: ['Respiratory depression', 'Bradycardia', 'Chest wall rigidity'],
    contraindications: ['Respiratory depression', 'MAOIs'],
    color: 'purple'
  },
  {
    id: 'midazolam',
    name: 'Midazolam',
    brandNames: ['Versed'],
    category: 'sedation',
    class: 'Benzodiazepine',
    mechanism: 'GABA-A receptor modulation',
    indications: ['RSI', 'Procedural sedation', 'Seizures', 'Anxiolysis'],
    dose: {
      sedation: '1-2.5mg IV titrated',
      rsi: '0.1-0.3 mg/kg IV',
      seizure: '0.2 mg/kg IM/IN'
    },
    sideEffects: ['Respiratory depression', 'Hypotension', 'Amnesia'],
    contraindications: ['Severe respiratory depression', 'Acute narrow-angle glaucoma'],
    color: 'purple'
  },
  {
    id: 'ketamine',
    name: 'Ketamine',
    brandNames: ['Ketalar'],
    category: 'sedation',
    class: 'Dissociative Anesthetic',
    mechanism: 'NMDA receptor antagonist',
    indications: ['RSI', 'Procedural sedation', 'Analgesia', 'Status asthmaticus'],
    dose: {
      induction: '1-2 mg/kg IV',
      sedation: '0.5-1 mg/kg IV',
      analgesia: '0.1-0.3 mg/kg IV'
    },
    sideEffects: ['Emergence reactions', 'Hypersalivation', 'Hypertension', 'ICP increase'],
    contraindications: ['Severe hypertension', 'Pre-eclampsia', 'Psychosis'],
    color: 'purple'
  },

  // Neuromuscular Blockers
  {
    id: 'succinylcholine',
    name: 'Succinylcholine',
    brandNames: ['Anectine', 'Quelicin'],
    category: 'neuromuscular',
    class: 'Depolarizing NMB',
    mechanism: 'Depolarizing neuromuscular blockade',
    indications: ['RSI'],
    dose: {
      rsi: '1-1.5 mg/kg IV'
    },
    sideEffects: ['Fasciculations', 'Hyperkalemia', 'Malignant hyperthermia', 'Bradycardia'],
    contraindications: ['Burns >24h', 'Crush injury', 'Hyperkalemia', 'Neuromuscular disease'],
    color: 'yellow'
  },
  {
    id: 'rocuronium',
    name: 'Rocuronium',
    brandNames: ['Zemuron'],
    category: 'neuromuscular',
    class: 'Non-depolarizing NMB',
    mechanism: 'Competitive acetylcholine receptor antagonist',
    indications: ['RSI', 'Paralysis for ventilation'],
    dose: {
      rsi: '1-1.2 mg/kg IV',
      maintenance: '0.1-0.2 mg/kg IV'
    },
    sideEffects: ['Prolonged paralysis', 'Tachycardia'],
    contraindications: ['Hypersensitivity'],
    color: 'yellow'
  },

  // Emergency
  {
    id: 'naloxone',
    name: 'Naloxone',
    brandNames: ['Narcan'],
    category: 'emergency',
    class: 'Opioid Antagonist',
    mechanism: 'Competitive opioid receptor antagonist',
    indications: ['Opioid overdose', 'Opioid-induced respiratory depression'],
    dose: {
      overdose: '0.4-2mg IV/IM/IN q2-3min',
      infusion: '0.25-0.5 mg/hr (2/3 reversal dose per hour)'
    },
    sideEffects: ['Withdrawal', 'Hypertension', 'Pulmonary edema'],
    contraindications: ['Hypersensitivity'],
    color: 'orange'
  },
  {
    id: 'flumazenil',
    name: 'Flumazenil',
    brandNames: ['Romazicon'],
    category: 'emergency',
    class: 'Benzodiazepine Antagonist',
    mechanism: 'Competitive GABA-A antagonist',
    indications: ['Benzodiazepine overdose', 'Reversal of sedation'],
    dose: {
      reversal: '0.2mg IV, then 0.1mg q1min (max 1mg)'
    },
    sideEffects: ['Seizures', 'Arrhythmias', 'Re-sedation'],
    contraindications: ['Chronic benzo use', 'Seizure history', 'TCA overdose'],
    color: 'orange'
  },
  {
    id: 'dextrose',
    name: 'Dextrose 50%',
    brandNames: ['D50'],
    category: 'emergency',
    class: 'Glucose',
    mechanism: 'Provides glucose for cellular metabolism',
    indications: ['Hypoglycemia', 'Altered mental status'],
    dose: {
      adult: '25-50g (50-100mL D50) IV',
      pediatric: '0.5-1 g/kg IV'
    },
    sideEffects: ['Hyperglycemia', 'Tissue necrosis (extravasation)'],
    contraindications: ['Hyperglycemia'],
    color: 'orange'
  },
  {
    id: 'calcium_chloride',
    name: 'Calcium Chloride',
    brandNames: ['CaCl2'],
    category: 'emergency',
    class: 'Electrolyte',
    mechanism: 'Provides calcium ions',
    indications: ['Hyperkalemia', 'Hypocalcemia', 'Ca-channel blocker OD', 'Beta-blocker OD'],
    dose: {
      adult: '500-1000mg (5-10mL 10%) IV slow push',
      hyperkalemia: '1g IV over 2-5min'
    },
    sideEffects: ['Bradycardia', 'Hypotension', 'Tissue necrosis'],
    contraindications: ['Digoxin toxicity (relative)', 'Hypercalcemia'],
    color: 'orange'
  },
  {
    id: 'sodium_bicarb',
    name: 'Sodium Bicarbonate',
    brandNames: ['NaHCO3'],
    category: 'emergency',
    class: 'Alkalinizing Agent',
    mechanism: 'Buffers hydrogen ions',
    indications: ['Severe acidosis', 'Hyperkalemia', 'TCA overdose', 'Aspirin overdose'],
    dose: {
      acidosis: '1 mEq/kg IV',
      tca_od: '1-2 mEq/kg IV bolus'
    },
    sideEffects: ['Alkalosis', 'Hypernatremia', 'Hypokalemia'],
    contraindications: ['Alkalosis', 'Hypocalcemia'],
    color: 'orange'
  }
];

// Category definitions
const CATEGORIES = {
  cardiovascular: { label: 'Cardiovascular', icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
  respiratory: { label: 'Respiratory', icon: Wind, color: 'text-blue-600', bg: 'bg-blue-50' },
  sedation: { label: 'Sedation/Analgesia', icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50' },
  neuromuscular: { label: 'Neuromuscular', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  emergency: { label: 'Emergency', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' }
};

// Get favorites from localStorage
function getFavorites() {
  const stored = localStorage.getItem('medsim_drug_favorites');
  return stored ? JSON.parse(stored) : [];
}

// Toggle favorite
function toggleFavorite(drugId) {
  const favorites = getFavorites();
  const index = favorites.indexOf(drugId);
  if (index === -1) {
    favorites.push(drugId);
  } else {
    favorites.splice(index, 1);
  }
  localStorage.setItem('medsim_drug_favorites', JSON.stringify(favorites));
  return favorites;
}

// Get pinned drugs from localStorage
function getPinnedDrugs() {
  const stored = localStorage.getItem('medsim_drug_pinned');
  return stored ? JSON.parse(stored) : [];
}

// Toggle pinned
function togglePinned(drugId) {
  const pinned = getPinnedDrugs();
  const index = pinned.indexOf(drugId);
  if (index === -1) {
    if (pinned.length >= 3) {
      pinned.shift(); // Remove oldest if max reached
    }
    pinned.push(drugId);
  } else {
    pinned.splice(index, 1);
  }
  localStorage.setItem('medsim_drug_pinned', JSON.stringify(pinned));
  return pinned;
}

// Drug Card Component
function DrugCard({ drug, isFavorite, isPinned, onToggleFavorite, onTogglePin, compact = false }) {
  const [expanded, setExpanded] = useState(false);
  const category = CATEGORIES[drug.category];

  if (compact) {
    return (
      <Card className={`${category.bg} border cursor-pointer hover:shadow-md transition-shadow`}>
        <CardContent className="pt-3 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pill className={`w-4 h-4 ${category.color}`} />
              <span className="font-medium text-sm">{drug.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onTogglePin(drug.id)}
            >
              {isPinned ? (
                <PinOff className="w-3 h-3 text-blue-500" />
              ) : (
                <Pin className="w-3 h-3" />
              )}
            </Button>
          </div>
          <p className="text-xs text-slate-600 mt-1">{drug.class}</p>
          <div className="mt-2 text-xs">
            <p className="font-medium">Quick Dose:</p>
            <p className="text-slate-600">{Object.values(drug.dose)[0]}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div layout>
      <Card className={`${category.bg} border overflow-hidden`}>
        <CardContent className="pt-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <category.icon className={`w-5 h-5 ${category.color}`} />
              <div>
                <h3 className="font-bold">{drug.name}</h3>
                <p className="text-xs text-slate-500">{drug.brandNames.join(', ')}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onToggleFavorite(drug.id)}
              >
                {isFavorite ? (
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ) : (
                  <StarOff className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onTogglePin(drug.id)}
              >
                {isPinned ? (
                  <PinOff className="w-4 h-4 text-blue-500" />
                ) : (
                  <Pin className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <Badge variant="outline" className="mt-2 text-xs">
            {drug.class}
          </Badge>

          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-600 mb-1">Mechanism:</p>
            <p className="text-xs text-slate-700">{drug.mechanism}</p>
          </div>

          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-600 mb-1">Indications:</p>
            <div className="flex flex-wrap gap-1">
              {drug.indications.map((ind, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {ind}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-600 mb-1">Dosing:</p>
            <div className="space-y-1">
              {Object.entries(drug.dose).map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-slate-500 capitalize">{key.replace(/_/g, ' ')}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3 text-xs"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show Less' : 'Show More'}
          </Button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs font-semibold text-slate-600 mb-1">Side Effects:</p>
                  <p className="text-xs text-slate-700">{drug.sideEffects.join(', ')}</p>
                </div>

                <div className="mt-3">
                  <p className="text-xs font-semibold text-red-600 mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Contraindications:
                  </p>
                  <p className="text-xs text-red-700">{drug.contraindications.join(', ')}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Main Component
export default function DrugQuickReference({ open, onClose }) {
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [pinned, setPinned] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    if (open) {
      setFavorites(getFavorites());
      setPinned(getPinnedDrugs());
    }
  }, [open]);

  const handleToggleFavorite = (drugId) => {
    setFavorites(toggleFavorite(drugId));
  };

  const handleTogglePin = (drugId) => {
    setPinned(togglePinned(drugId));
  };

  const filteredDrugs = DRUGS.filter(drug => {
    const matchesSearch = search === '' ||
      drug.name.toLowerCase().includes(search.toLowerCase()) ||
      drug.brandNames.some(b => b.toLowerCase().includes(search.toLowerCase())) ||
      drug.indications.some(i => i.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = activeCategory === 'all' ||
      activeCategory === 'favorites' && favorites.includes(drug.id) ||
      drug.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-500" />
            Drug Quick Reference
          </DialogTitle>
          <DialogDescription>
            Flashcard-style drug information for quick reference
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search drugs, indications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid grid-cols-7 h-auto">
            <TabsTrigger value="all" className="text-xs py-1.5">All</TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs py-1.5">
              <Star className="w-3 h-3 mr-1" />
              Fav
            </TabsTrigger>
            {Object.entries(CATEGORIES).slice(0, 5).map(([key, cat]) => (
              <TabsTrigger key={key} value={key} className="text-xs py-1.5">
                {cat.label.split('/')[0]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Drug Cards */}
        <ScrollArea className="h-[400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-4">
            {filteredDrugs.map(drug => (
              <DrugCard
                key={drug.id}
                drug={drug}
                isFavorite={favorites.includes(drug.id)}
                isPinned={pinned.includes(drug.id)}
                onToggleFavorite={handleToggleFavorite}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
          {filteredDrugs.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Pill className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No drugs found matching your search</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Pinned drugs HUD component for gameplay
export function PinnedDrugsHUD({ onClose }) {
  const [pinned, setPinned] = useState([]);

  useEffect(() => {
    setPinned(getPinnedDrugs());
  }, []);

  const pinnedDrugs = DRUGS.filter(d => pinned.includes(d.id));

  if (pinnedDrugs.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed right-4 top-20 z-40 w-64 space-y-2"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
          <Pin className="w-3 h-3" />
          Pinned Drugs
        </span>
        <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={onClose}>
          <X className="w-3 h-3" />
        </Button>
      </div>
      {pinnedDrugs.map(drug => (
        <DrugCard
          key={drug.id}
          drug={drug}
          isFavorite={false}
          isPinned={true}
          onToggleFavorite={() => {}}
          onTogglePin={() => setPinned(togglePinned(drug.id))}
          compact
        />
      ))}
    </motion.div>
  );
}

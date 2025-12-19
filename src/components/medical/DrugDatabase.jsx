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
import { Search, Pill } from 'lucide-react';

const DRUG_CATEGORIES = {
  vasopressors: {
    name: 'Vasopressors',
    color: 'bg-red-100 text-red-700 border-red-300',
    drugs: [
      { name: 'Norepinephrine', concentration: '16mcg/ml', dosage: '0.05-3mcg/kg/min', description: 'First-line vasopressor for septic shock. Increases SVR and MAP through alpha-1 agonism.' },
      { name: 'Epinephrine', concentration: '4mcg/ml', dosage: '0.05-0.5mcg/kg/min', description: 'Potent mixed alpha/beta agonist. Used in anaphylaxis, cardiac arrest, refractory shock.' },
      { name: 'Vasopressin', concentration: '1unit/ml', dosage: '0.01-0.04units/min', description: 'Non-catecholamine vasopressor. Often added as adjunct in catecholamine-resistant shock.' },
      { name: 'Phenylephrine', concentration: '100mcg/ml', dosage: '0.5-5mcg/kg/min', description: 'Pure alpha-1 agonist. Used when tachycardia needs to be avoided.' },
      { name: 'Dopamine', concentration: '3200mcg/ml', dosage: '2-20mcg/kg/min', description: 'Dose-dependent effects. Low doses (renal), mid (cardiac), high (vasopressor).' }
    ]
  },
  sedatives: {
    name: 'Sedatives',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    drugs: [
      { name: 'Propofol', concentration: '10mg/ml', dosage: '5-80mcg/kg/min', description: 'Short-acting sedative-hypnotic. Rapid onset/offset. Causes hypotension and hypertriglyceridemia.' },
      { name: 'Midazolam', concentration: '1mg/ml', dosage: '1-5mg/hr', description: 'Benzodiazepine sedative. Good for seizure activity. Prolonged effects with continuous infusion.' },
      { name: 'Dexmedetomidine', concentration: '4mcg/ml', dosage: '0.2-1.5mcg/kg/hr', description: 'Alpha-2 agonist. Provides sedation without respiratory depression. Reduces delirium.' },
      { name: 'Ketamine', concentration: '10mg/ml', dosage: '0.5-2mg/kg/hr', description: 'NMDA antagonist. Maintains hemodynamics and respiratory drive. Bronchodilator properties.' }
    ]
  },
  analgesics: {
    name: 'Analgesics',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    drugs: [
      { name: 'Fentanyl', concentration: '10mcg/ml', dosage: '0.5-5mcg/kg/hr', description: 'Synthetic opioid. 100x more potent than morphine. Short-acting when given as bolus.' },
      { name: 'Morphine', concentration: '1mg/ml', dosage: '2-10mg/hr', description: 'Gold standard opioid analgesic. Causes histamine release. Active metabolites accumulate in renal failure.' },
      { name: 'Hydromorphone', concentration: '1mg/ml', dosage: '0.5-3mg/hr', description: '7x more potent than morphine. Less histamine release. Better in renal impairment.' },
      { name: 'Remifentanil', concentration: '50mcg/ml', dosage: '0.05-0.2mcg/kg/min', description: 'Ultra-short-acting opioid. Metabolized by plasma esterases. Context-sensitive half-life of 3 minutes.' }
    ]
  },
  paralytics: {
    name: 'Paralytics',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    drugs: [
      { name: 'Cisatracurium', concentration: '2mg/ml', dosage: '1-3mcg/kg/min', description: 'Non-depolarizing neuromuscular blocker. Hofmann elimination. Safe in renal/hepatic failure.' },
      { name: 'Rocuronium', concentration: '10mg/ml', dosage: '8-12mcg/kg/min', description: 'Intermediate-acting paralytic. Rapid onset. Reversible with sugammadex.' },
      { name: 'Vecuronium', concentration: '1mg/ml', dosage: '0.8-1.2mcg/kg/min', description: 'Non-depolarizing blocker. Minimal cardiovascular effects. Hepatic metabolism.' }
    ]
  },
  inotropes: {
    name: 'Inotropes',
    color: 'bg-green-100 text-green-700 border-green-300',
    drugs: [
      { name: 'Dobutamine', concentration: '2000mcg/ml', dosage: '2-20mcg/kg/min', description: 'Beta-1 selective agonist. Increases cardiac contractility. May cause tachycardia and hypotension.' },
      { name: 'Milrinone', concentration: '200mcg/ml', dosage: '0.25-0.75mcg/kg/min', description: 'Phosphodiesterase-3 inhibitor. Inodilator (positive inotropy + vasodilation). Long half-life.' },
      { name: 'Epinephrine', concentration: '4mcg/ml', dosage: '0.05-0.5mcg/kg/min', description: 'Mixed alpha/beta effects. Powerful inotrope at all doses.' }
    ]
  },
  antiarrhythmics: {
    name: 'Antiarrhythmics',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    drugs: [
      { name: 'Amiodarone', concentration: '1.5mg/ml', dosage: '0.5-1mg/min', description: 'Class III antiarrhythmic. For VT/VF and atrial arrhythmias. Multiple drug interactions.' },
      { name: 'Lidocaine', concentration: '4mg/ml', dosage: '1-4mg/min', description: 'Class IB antiarrhythmic. Suppresses ventricular arrhythmias. Reduced dose in hepatic dysfunction.' },
      { name: 'Esmolol', concentration: '10mg/ml', dosage: '50-300mcg/kg/min', description: 'Ultra-short-acting beta-blocker. Rapid rate control. Half-life of 9 minutes.' }
    ]
  },
  antibiotics: {
    name: 'Antibiotics',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    drugs: [
      { name: 'Vancomycin', concentration: 'varies', dosage: '15-20mg/kg q8-12h', description: 'Glycopeptide antibiotic. MRSA coverage. Requires therapeutic monitoring. Nephrotoxic.' },
      { name: 'Piperacillin-Tazobactam', concentration: 'varies', dosage: '3.375-4.5g q6h', description: 'Extended-spectrum penicillin. Broad gram-negative coverage including Pseudomonas.' },
      { name: 'Meropenem', concentration: 'varies', dosage: '1-2g q8h', description: 'Carbapenem antibiotic. Reserved for MDR organisms. Very broad spectrum.' }
    ]
  },
  fluids: {
    name: 'IV Fluids',
    color: 'bg-cyan-100 text-cyan-700 border-cyan-300',
    drugs: [
      { name: 'Normal Saline 0.9%', concentration: 'isotonic', dosage: 'variable', description: 'Isotonic crystalloid. Risk of hyperchloremic acidosis with large volumes.' },
      { name: 'Lactated Ringers', concentration: 'isotonic', dosage: 'variable', description: 'Balanced crystalloid. Preferred in trauma and surgery. Contains lactate buffer.' },
      { name: 'Albumin 5%', concentration: 'colloid', dosage: 'variable', description: 'Colloid solution. Volume expander. Maintains oncotic pressure. Expensive.' },
      { name: 'Plasmalyte', concentration: 'isotonic', dosage: 'variable', description: 'Balanced crystalloid. More physiologic electrolyte composition. Acetate/gluconate buffers.' }
    ]
  }
};

export default function DrugDatabase({ open, onClose, onSelectDrug, pumpType }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrug, setSelectedDrug] = useState(null);

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
          <DialogTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5" />
            Drug Database - {pumpType === 'syringe_pump' ? 'Syringe Pump' : 'IV Infusion'}
          </DialogTitle>
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
                    className="p-4 border-2 rounded-lg hover:shadow-md transition-all cursor-pointer"
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
                          <p className="text-sm text-slate-600 mb-2">{drug.description}</p>
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
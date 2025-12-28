import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scissors, Heart, Activity, Zap, Droplets, Brain, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import SurgicalMinigame from './SurgicalMinigame';

const SURGICAL_PROCEDURES = [
  {
    id: 'thoracotomy',
    name: 'Emergency Thoracotomy',
    icon: Scissors,
    color: 'bg-red-100 text-red-700 border-red-300',
    duration: '15-20 min',
    difficulty: 'Expert',
    description: 'Open chest to access heart and great vessels',
    indications: ['Cardiac arrest', 'Massive hemothorax', 'Cardiac tamponade']
  },
  {
    id: 'tracheostomy',
    name: 'Surgical Tracheostomy',
    icon: Activity,
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    duration: '10-15 min',
    difficulty: 'Advanced',
    description: 'Create airway through anterior neck',
    indications: ['Prolonged ventilation', 'Upper airway obstruction']
  },
  {
    id: 'pericardiocentesis',
    name: 'Pericardiocentesis',
    icon: Heart,
    color: 'bg-pink-100 text-pink-700 border-pink-300',
    duration: '5-10 min',
    difficulty: 'Advanced',
    description: 'Drain fluid from pericardial sac',
    indications: ['Cardiac tamponade', 'Pericardial effusion']
  },
  {
    id: 'chest_tube',
    name: 'Chest Tube Insertion',
    icon: Droplets,
    color: 'bg-cyan-100 text-cyan-700 border-cyan-300',
    duration: '5-10 min',
    difficulty: 'Intermediate',
    description: 'Drain air or fluid from pleural space',
    indications: ['Pneumothorax', 'Hemothorax', 'Pleural effusion']
  },
  {
    id: 'burr_hole',
    name: 'Burr Hole Craniostomy',
    icon: Brain,
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    duration: '20-30 min',
    difficulty: 'Expert',
    description: 'Drill hole in skull to relieve pressure',
    indications: ['Epidural hematoma', 'Subdural hematoma', 'Elevated ICP']
  },
  {
    id: 'cricothyrotomy',
    name: 'Emergency Cricothyrotomy',
    icon: Zap,
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    duration: '2-3 min',
    difficulty: 'Advanced',
    description: 'Emergency surgical airway through cricothyroid membrane',
    indications: ['Cannot intubate, cannot ventilate', 'Severe facial trauma']
  },
  {
    id: 'laparotomy',
    name: 'Emergency Laparotomy',
    icon: Scissors,
    color: 'bg-red-200 text-red-800 border-red-400',
    duration: '30-60 min',
    difficulty: 'Expert',
    description: 'Open abdominal exploration for trauma or bleeding',
    indications: ['Abdominal trauma', 'Peritonitis', 'Uncontrolled hemorrhage']
  },
  {
    id: 'fasciotomy',
    name: 'Fasciotomy',
    icon: Scissors,
    color: 'bg-orange-200 text-orange-800 border-orange-400',
    duration: '15-25 min',
    difficulty: 'Advanced',
    description: 'Release compartment pressure in extremities',
    indications: ['Compartment syndrome', 'Crush injury', 'Vascular injury']
  },
  {
    id: 'ventriculostomy',
    name: 'External Ventricular Drain (EVD)',
    icon: Brain,
    color: 'bg-violet-100 text-violet-700 border-violet-300',
    duration: '10-15 min',
    difficulty: 'Expert',
    description: 'Drain CSF and monitor ICP',
    indications: ['Hydrocephalus', 'ICP monitoring', 'Intraventricular hemorrhage']
  },
  {
    id: 'escharotomy',
    name: 'Escharotomy',
    icon: Zap,
    color: 'bg-amber-100 text-amber-700 border-amber-300',
    duration: '10-20 min',
    difficulty: 'Advanced',
    description: 'Incise burned tissue to restore circulation/ventilation',
    indications: ['Circumferential burns', 'Compartment syndrome from burns']
  },
  {
    id: 'craniotomy',
    name: 'Emergency Craniotomy',
    icon: Brain,
    color: 'bg-red-200 text-red-800 border-red-400',
    duration: '60-90 min',
    difficulty: 'Expert',
    description: 'Remove skull section for mass effect or hematoma evacuation',
    indications: ['Brain aneurysm', 'Large hematoma', 'Mass effect']
  },
  {
    id: 'lung_repair',
    name: 'Lung Parenchyma Repair',
    icon: Activity,
    color: 'bg-red-100 text-red-700 border-red-300',
    duration: '45-90 min',
    difficulty: 'Expert',
    description: 'Surgical repair of lung puncture or laceration',
    indications: ['Lung puncture', 'Penetrating chest trauma', 'Persistent air leak']
  }
];

export default function SurgeryMenu({ open, onClose, onPerformSurgery }) {
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [minigameOpen, setMinigameOpen] = useState(false);
  const [selectedOrgan, setSelectedOrgan] = useState(null);

  const handlePerformSurgery = (procedure) => {
    toast.success(`Starting ${procedure.name}...`, {
      description: `Expected duration: ${procedure.duration}`
    });
    
    // Simulate surgery outcome
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      if (success) {
        toast.success('Surgery completed successfully');
        onPerformSurgery?.(procedure.id, true);
      } else {
        toast.error('Complications during surgery');
        onPerformSurgery?.(procedure.id, false);
      }
      onClose();
    }, 2000);
  };

  const handleMinigame = (procedure) => {
    const organKey = procedure.id.includes('craniotomy') || procedure.id.includes('burr_hole') || procedure.id.includes('ventriculostomy') ? 'brain' :
                     procedure.id.includes('thoracotomy') || procedure.id.includes('pericardiocentesis') ? 'heart' :
                     procedure.id.includes('lung') ? 'lungs_left' :
                     procedure.id.includes('laparotomy') ? 'liver' : 'heart';
    
    setSelectedOrgan(organKey);
    setMinigameOpen(true);
  };

  const handleMinigameComplete = () => {
    setMinigameOpen(false);
  };

  return (
    <>
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Scissors className="w-6 h-6 text-red-600" />
            Emergency Surgical Procedures
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {SURGICAL_PROCEDURES.map((procedure, idx) => {
            const Icon = procedure.icon;
            return (
              <motion.div
                key={procedure.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card 
                  className={`p-4 border-2 ${procedure.color} cursor-pointer transition-all hover:shadow-lg ${
                    selectedProcedure?.id === procedure.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedProcedure(procedure)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${procedure.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{procedure.name}</h4>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {procedure.duration}
                          </Badge>
                          <Badge 
                            className={`text-xs ${
                              procedure.difficulty === 'Expert' ? 'bg-red-100 text-red-700' :
                              procedure.difficulty === 'Advanced' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {procedure.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-3 break-words">
                    {procedure.description}
                  </p>

                  <div className="mb-3">
                    <div className="text-xs font-semibold text-slate-700 mb-1">
                      Indications:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {procedure.indications.map((indication, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {indication}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePerformSurgery(procedure);
                      }}
                    >
                      Perform Procedure
                    </Button>
                    {['craniotomy', 'burr_hole', 'ventriculostomy', 'thoracotomy', 'pericardiocentesis', 'lung_repair', 'laparotomy'].some(o => procedure.id.includes(o)) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMinigame(procedure);
                        }}
                        title="Play Interactive Surgery"
                      >
                        <Gamepad2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>

    {minigameOpen && (
      <SurgicalMinigame
        open={minigameOpen}
        onClose={handleMinigameComplete}
        targetOrgan={selectedOrgan}
      />
    )}
    </>
  );
}
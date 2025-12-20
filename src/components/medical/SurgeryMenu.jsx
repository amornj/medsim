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
import { Scissors, Heart, Activity, Zap, Droplets, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

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
  }
];

export default function SurgeryMenu({ open, onClose, onPerformSurgery }) {
  const [selectedProcedure, setSelectedProcedure] = useState(null);

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

  return (
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

                  <Button
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePerformSurgery(procedure);
                    }}
                  >
                    Perform Procedure
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
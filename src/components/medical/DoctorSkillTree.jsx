import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Lock, Check, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const SKILL_TREES = {
  // Universal skills available to all doctors
  universal: [
    { id: 'speed_boost_1', name: 'Quick Response I', cost: 1, description: '+10% faster intervention times', bonus: { speedBonus: 0.10 } },
    { id: 'speed_boost_2', name: 'Quick Response II', cost: 2, description: '+20% faster intervention times', bonus: { speedBonus: 0.20 }, requires: 'speed_boost_1' },
    { id: 'efficiency_1', name: 'Resource Efficient I', cost: 1, description: '-10% equipment cost', bonus: { costReduction: 0.10 } },
    { id: 'efficiency_2', name: 'Resource Efficient II', cost: 2, description: '-20% equipment cost', bonus: { costReduction: 0.20 }, requires: 'efficiency_1' },
    { id: 'vitals_mastery', name: 'Vitals Mastery', cost: 2, description: '+15% vital sign improvement rate', bonus: { vitalImprovementBonus: 0.15 } },
    { id: 'complication_reduction', name: 'Complication Prevention', cost: 3, description: '-25% chance of complications', bonus: { complicationReduction: 0.25 } },
  ],
  // Category-specific skill trees
  cardiologist: [
    { id: 'cardiac_expert', name: 'Cardiac Mastery', cost: 2, description: '+25% cardiac outcome bonus', bonus: { cardiacOutcomeBonus: 0.25 } },
    { id: 'arrhythmia_control', name: 'Arrhythmia Control', cost: 2, description: '+30% arrhythmia management', bonus: { arrhythmiaControl: 0.30 } },
    { id: 'heart_failure_specialist', name: 'HF Specialist', cost: 3, description: '+35% heart failure survival', bonus: { hfSurvivalBonus: 0.35 } },
  ],
  surgeon: [
    { id: 'surgical_precision', name: 'Surgical Precision', cost: 2, description: '-25% surgery failure rate', bonus: { surgeryFailureReduction: 0.25 } },
    { id: 'bleeding_control', name: 'Bleeding Control', cost: 2, description: '+30% hemorrhage control speed', bonus: { hemorrhageControl: 0.30 } },
    { id: 'master_surgeon', name: 'Master Surgeon', cost: 3, description: '-40% surgery complications', bonus: { complicationReduction: 0.40 } },
  ],
  neurologist: [
    { id: 'neuro_expertise', name: 'Neuro Expertise', cost: 2, description: '+25% neuro outcome bonus', bonus: { neuroOutcomeBonus: 0.25 } },
    { id: 'stroke_master', name: 'Stroke Master', cost: 2, description: '+35% stroke survival', bonus: { strokeOutcomeBonus: 0.35 } },
    { id: 'brain_injury_expert', name: 'Brain Injury Expert', cost: 3, description: '-30% secondary brain injury', bonus: { brainInjuryReduction: 0.30 } },
  ],
  pulmonologist: [
    { id: 'respiratory_expert', name: 'Respiratory Expert', cost: 2, description: '+25% lung outcome bonus', bonus: { lungOutcomeBonus: 0.25 } },
    { id: 'ventilator_master', name: 'Ventilator Master', cost: 2, description: '+30% ventilator weaning success', bonus: { ventilatorSurvival: 0.30 } },
    { id: 'ards_specialist', name: 'ARDS Specialist', cost: 3, description: '+35% ARDS survival', bonus: { ardsSurvival: 0.35 } },
  ],
};

export default function DoctorSkillTree({ open, onClose, selectedDoctor }) {
  const queryClient = useQueryClient();
  const [selectedSkill, setSelectedSkill] = useState(null);

  const { data: progression, isLoading } = useQuery({
    queryKey: ['doctorProgression', selectedDoctor?.id],
    queryFn: async () => {
      if (!selectedDoctor) return null;
      const results = await base44.entities.DoctorProgression.filter({ doctor_id: selectedDoctor.id });
      if (results.length > 0) return results[0];
      
      // Create initial progression
      return await base44.entities.DoctorProgression.create({
        doctor_id: selectedDoctor.id,
        doctor_name: selectedDoctor.name,
        experience_points: 0,
        level: 1,
        skill_points: 0,
        unlocked_skills: [],
        scenarios_completed: 0,
        total_score: 0
      });
    },
    enabled: !!selectedDoctor
  });

  const unlockSkillMutation = useMutation({
    mutationFn: async ({ skillId, cost }) => {
      if (!progression) return;
      
      const newSkillPoints = progression.skill_points - cost;
      const newUnlockedSkills = [...(progression.unlocked_skills || []), skillId];
      
      return await base44.entities.DoctorProgression.update(progression.id, {
        skill_points: newSkillPoints,
        unlocked_skills: newUnlockedSkills
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['doctorProgression']);
      toast.success('Skill unlocked!');
    }
  });

  if (!selectedDoctor) return null;

  const xpToNextLevel = progression ? progression.level * 100 : 100;
  const xpProgress = progression ? (progression.experience_points % 100) : 0;

  const categorySkills = SKILL_TREES[selectedDoctor.parentId] || [];
  const universalSkills = SKILL_TREES.universal;

  const canUnlock = (skill) => {
    if (!progression) return false;
    if (progression.skill_points < skill.cost) return false;
    if (progression.unlocked_skills?.includes(skill.id)) return false;
    if (skill.requires && !progression.unlocked_skills?.includes(skill.requires)) return false;
    return true;
  };

  const isUnlocked = (skillId) => {
    return progression?.unlocked_skills?.includes(skillId);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            {selectedDoctor.name} - Skill Tree
          </DialogTitle>
        </DialogHeader>

        {/* Progression Stats */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-slate-600">Level</div>
              <div className="text-2xl font-bold text-blue-600">{progression?.level || 1}</div>
            </div>
            <div>
              <div className="text-xs text-slate-600">Experience</div>
              <div className="text-lg font-bold">{progression?.experience_points || 0} XP</div>
              <Progress value={(xpProgress / xpToNextLevel) * 100} className="h-1 mt-1" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Skill Points</div>
              <div className="text-2xl font-bold text-purple-600">{progression?.skill_points || 0}</div>
            </div>
            <div>
              <div className="text-xs text-slate-600">Scenarios</div>
              <div className="text-lg font-bold">{progression?.scenarios_completed || 0}</div>
            </div>
          </div>
        </Card>

        {/* Universal Skills */}
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Universal Skills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {universalSkills.map((skill) => (
              <Card
                key={skill.id}
                className={`p-4 cursor-pointer transition-all ${
                  isUnlocked(skill.id) ? 'bg-green-50 border-green-300' :
                  canUnlock(skill) ? 'border-blue-300 hover:shadow-lg' :
                  'bg-slate-100 opacity-60'
                }`}
                onClick={() => setSelectedSkill(skill)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isUnlocked(skill.id) ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : canUnlock(skill) ? (
                      <Star className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}
                    <h4 className="font-bold text-sm">{skill.name}</h4>
                  </div>
                  <Badge variant={isUnlocked(skill.id) ? "default" : "secondary"}>
                    {skill.cost} SP
                  </Badge>
                </div>
                <p className="text-xs text-slate-600">{skill.description}</p>
                {!isUnlocked(skill.id) && canUnlock(skill) && (
                  <Button
                    size="sm"
                    className="w-full mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      unlockSkillMutation.mutate({ skillId: skill.id, cost: skill.cost });
                    }}
                  >
                    Unlock
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Category-Specific Skills */}
        {categorySkills.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-500" />
              Specialty Skills
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categorySkills.map((skill) => (
                <Card
                  key={skill.id}
                  className={`p-4 cursor-pointer transition-all ${
                    isUnlocked(skill.id) ? 'bg-purple-50 border-purple-300' :
                    canUnlock(skill) ? 'border-purple-300 hover:shadow-lg' :
                    'bg-slate-100 opacity-60'
                  }`}
                  onClick={() => setSelectedSkill(skill)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {isUnlocked(skill.id) ? (
                        <Check className="w-5 h-5 text-purple-600" />
                      ) : canUnlock(skill) ? (
                        <Star className="w-5 h-5 text-purple-500" />
                      ) : (
                        <Lock className="w-5 h-5 text-slate-400" />
                      )}
                      <h4 className="font-bold text-sm">{skill.name}</h4>
                    </div>
                    <Badge variant={isUnlocked(skill.id) ? "default" : "secondary"}>
                      {skill.cost} SP
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600">{skill.description}</p>
                  {skill.requires && (
                    <p className="text-xs text-slate-500 mt-1">
                      Requires: {universalSkills.find(s => s.id === skill.requires)?.name || 
                                categorySkills.find(s => s.id === skill.requires)?.name}
                    </p>
                  )}
                  {!isUnlocked(skill.id) && canUnlock(skill) && (
                    <Button
                      size="sm"
                      className="w-full mt-2 bg-purple-600 hover:bg-purple-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        unlockSkillMutation.mutate({ skillId: skill.id, cost: skill.cost });
                      }}
                    >
                      Unlock
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
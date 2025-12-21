import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, Target, Zap, TrendingUp, AlertCircle } from 'lucide-react';

// Best practices by scenario type
const BEST_PRACTICES = {
  cardiac_arrest: ['defibrillator', 'lucas', 'aed', 'cardiac_monitor', 'iv_pump', 'syringe_pump'],
  respiratory_failure: ['ventilator', 'pulse_ox', 'cardiac_monitor'],
  septic_shock: ['iv_pump', 'syringe_pump', 'cardiac_monitor', 'arterial_line'],
  trauma: ['iv_pump', 'cardiac_monitor', 'arterial_line'],
  stroke: ['cardiac_monitor', 'arterial_line'],
  anaphylaxis: ['syringe_pump', 'iv_pump', 'cardiac_monitor'],
  cardiogenic_shock: ['iabp', 'impella_cp', 'syringe_pump', 'cardiac_monitor'],
  pulmonary_embolism: ['syringe_pump', 'cardiac_monitor', 'pulse_ox'],
  ards_severe: ['ventilator', 'ecmo', 'vv_ecmo', 'pulse_ox'],
  multi_organ_failure: ['ecmo', 'crrt', 'ventilator', 'syringe_pump']
};

export default function PerformanceTracker({ 
  scenario, 
  equipment, 
  vitals, 
  initialVitals,
  startTime,
  interventions = []
}) {
  const [liveScore, setLiveScore] = useState(0);
  const [metrics, setMetrics] = useState({
    speedScore: 0,
    bestPracticesScore: 0,
    resourceScore: 0,
    outcomeScore: 0
  });

  useEffect(() => {
    if (!scenario || !startTime) return;

    const calculateScores = () => {
      const currentTime = Date.now();
      const elapsedSeconds = (currentTime - startTime) / 1000;
      
      // Speed Score (0-25 points)
      let speedScore = 25;
      const timeToFirst = interventions.length > 0 ? interventions[0].timestamp - startTime : elapsedSeconds * 1000;
      const minutesToFirst = (timeToFirst / 1000) / 60;
      
      if (minutesToFirst > 5) speedScore = 5;
      else if (minutesToFirst > 3) speedScore = 15;
      else if (minutesToFirst > 1) speedScore = 20;
      
      // Best Practices Score (0-35 points)
      const recommendedEquipment = BEST_PRACTICES[scenario.id] || [];
      const usedEquipmentTypes = equipment.map(eq => eq.type);
      const correctInterventions = usedEquipmentTypes.filter(type => 
        recommendedEquipment.includes(type)
      ).length;
      const incorrectInterventions = usedEquipmentTypes.filter(type => 
        !recommendedEquipment.includes(type)
      ).length;
      
      const bestPracticesScore = Math.max(0, 
        Math.min(35, (correctInterventions * 10) - (incorrectInterventions * 5))
      );
      
      // Resource Efficiency Score (0-20 points)
      const idealEquipmentCount = recommendedEquipment.length;
      const actualCount = equipment.length;
      const difference = Math.abs(idealEquipmentCount - actualCount);
      const resourceScore = Math.max(0, 20 - (difference * 3));
      
      // Outcome Score (0-20 points) - based on vitals improvement
      let outcomeScore = 10; // baseline
      if (vitals && initialVitals) {
        let improvements = 0;
        let deteriorations = 0;
        
        // Check vital improvements
        if (vitals.heart_rate > 0 && initialVitals.heart_rate === 0) improvements += 2;
        if (vitals.spo2 > initialVitals.spo2 + 5) improvements++;
        if (vitals.blood_pressure_systolic > initialVitals.blood_pressure_systolic + 10) improvements++;
        if (vitals.heart_rate > 40 && vitals.heart_rate < 100 && 
            (initialVitals.heart_rate < 40 || initialVitals.heart_rate > 100)) improvements++;
        
        // Check deteriorations
        if (vitals.spo2 < initialVitals.spo2 - 5) deteriorations++;
        if (vitals.blood_pressure_systolic < initialVitals.blood_pressure_systolic - 10) deteriorations++;
        
        outcomeScore = Math.max(0, Math.min(20, 10 + (improvements * 3) - (deteriorations * 4)));
      }
      
      const totalScore = speedScore + bestPracticesScore + resourceScore + outcomeScore;
      
      setMetrics({
        speedScore,
        bestPracticesScore,
        resourceScore,
        outcomeScore
      });
      setLiveScore(totalScore);
    };

    const interval = setInterval(calculateScores, 2000);
    calculateScores(); // Initial calculation
    
    return () => clearInterval(interval);
  }, [scenario, equipment, vitals, initialVitals, startTime, interventions]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 65) return 'B-';
    if (score >= 60) return 'C+';
    if (score >= 55) return 'C';
    if (score >= 50) return 'C-';
    return 'F';
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5 text-yellow-600" />
          Live Performance Score
          <Badge className={`ml-auto text-lg font-bold ${getScoreColor(liveScore)}`}>
            {liveScore.toFixed(0)}/100 ({getScoreGrade(liveScore)})
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-600" />
              Response Speed
            </span>
            <span className="font-semibold">{metrics.speedScore.toFixed(0)}/25</span>
          </div>
          <Progress value={(metrics.speedScore / 25) * 100} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              Best Practices
            </span>
            <span className="font-semibold">{metrics.bestPracticesScore.toFixed(0)}/35</span>
          </div>
          <Progress value={(metrics.bestPracticesScore / 35) * 100} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-600" />
              Resource Efficiency
            </span>
            <span className="font-semibold">{metrics.resourceScore.toFixed(0)}/20</span>
          </div>
          <Progress value={(metrics.resourceScore / 20) * 100} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              Patient Outcome
            </span>
            <span className="font-semibold">{metrics.outcomeScore.toFixed(0)}/20</span>
          </div>
          <Progress value={(metrics.outcomeScore / 20) * 100} className="h-2" />
        </div>

        {equipment.length === 0 && (
          <div className="flex items-start gap-2 p-2 bg-yellow-100 rounded-lg mt-3">
            <AlertCircle className="w-4 h-4 text-yellow-700 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-yellow-800">
              Start adding equipment to begin scoring! Speed matters!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
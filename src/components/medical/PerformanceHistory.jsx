import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Clock, Target, TrendingUp, Award, Skull, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function PerformanceHistory({ open, onClose }) {
  const { data: performances = [], isLoading } = useQuery({
    queryKey: ['scenario-performances'],
    queryFn: () => base44.entities.ScenarioPerformance.list('-created_date', 50),
    enabled: open
  });

  const getOutcomeIcon = (outcome) => {
    switch (outcome) {
      case 'patient_survived':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'patient_died':
        return <Skull className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 1) return 'bg-green-500';
    if (difficulty <= 2) return 'bg-yellow-500';
    if (difficulty <= 3) return 'bg-orange-500';
    if (difficulty <= 4) return 'bg-red-500';
    if (difficulty <= 5) return 'bg-red-600';
    return 'bg-red-800';
  };

  // Calculate stats
  const stats = performances.reduce((acc, perf) => ({
    totalScenarios: acc.totalScenarios + 1,
    survived: acc.survived + (perf.outcome === 'patient_survived' ? 1 : 0),
    averageScore: acc.averageScore + perf.total_score,
    bestScore: Math.max(acc.bestScore, perf.total_score)
  }), { totalScenarios: 0, survived: 0, averageScore: 0, bestScore: 0 });

  if (stats.totalScenarios > 0) {
    stats.averageScore = stats.averageScore / stats.totalScenarios;
    stats.survivalRate = (stats.survived / stats.totalScenarios) * 100;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Trophy className="w-6 h-6 text-yellow-600" />
            Performance History
          </DialogTitle>
        </DialogHeader>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4">
          <Card className="p-3">
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalScenarios}
            </div>
            <div className="text-xs text-slate-600">Total Scenarios</div>
          </Card>
          <Card className="p-3">
            <div className="text-2xl font-bold text-green-600">
              {stats.survivalRate?.toFixed(0) || 0}%
            </div>
            <div className="text-xs text-slate-600">Survival Rate</div>
          </Card>
          <Card className="p-3">
            <div className="text-2xl font-bold text-purple-600">
              {stats.averageScore?.toFixed(0) || 0}
            </div>
            <div className="text-xs text-slate-600">Avg Score</div>
          </Card>
          <Card className="p-3">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.bestScore || 0}
            </div>
            <div className="text-xs text-slate-600">Best Score</div>
          </Card>
        </div>

        {/* Performance List */}
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center text-slate-500 py-8">Loading...</div>
            ) : performances.length === 0 ? (
              <div className="text-center text-slate-500 py-8">
                No scenarios completed yet. Start playing to build your history!
              </div>
            ) : (
              performances.map((perf) => (
                <Card key={perf.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      {getOutcomeIcon(perf.outcome)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 truncate">
                          {perf.scenario_name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge className={getDifficultyColor(perf.difficulty || 1)}>
                            Difficulty {perf.difficulty || 1}
                          </Badge>
                          {perf.outcome === 'patient_survived' && (
                            <Badge className="bg-green-100 text-green-800">Survived</Badge>
                          )}
                          {perf.outcome === 'patient_died' && (
                            <Badge className="bg-red-100 text-red-800">Died</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge className={`text-lg font-bold border-2 ${getScoreColor(perf.total_score)}`}>
                      {perf.total_score.toFixed(0)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3 h-3" />
                      {Math.floor((perf.total_duration || 0) / 60)}m {Math.floor((perf.total_duration || 0) % 60)}s
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <Target className="w-3 h-3" />
                      {perf.correct_interventions || 0} correct
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <TrendingUp className="w-3 h-3" />
                      {perf.speed_score?.toFixed(0) || 0} speed
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <Award className="w-3 h-3" />
                      {perf.best_practices_score?.toFixed(0) || 0} practice
                    </div>
                  </div>

                  {perf.achievements && perf.achievements.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {perf.achievements.map((achievement, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          🏆 {achievement}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {perf.feedback && perf.feedback.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {perf.feedback.slice(0, 2).map((feedback, idx) => (
                        <p key={idx} className="text-xs text-slate-600 italic">
                          • {feedback}
                        </p>
                      ))}
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
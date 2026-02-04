import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Zap, Target, Heart, Brain, Clock, DollarSign,
  Flame, Star, Crown, Medal, Award, Shield, Sparkles,
  TrendingUp, Activity, Stethoscope, Syringe, Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

// Achievement definitions
export const ACHIEVEMENTS = {
  // Speed category
  speed_first_responder: {
    id: 'speed_first_responder',
    name: 'First Responder',
    description: 'Start treatment within 30 seconds',
    icon: Clock,
    category: 'speed',
    tier: 'bronze',
    requirement: { type: 'time_to_first', value: 30 },
    xpReward: 50,
    fundsReward: 1000
  },
  speed_demon: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Start treatment within 15 seconds',
    icon: Zap,
    category: 'speed',
    tier: 'silver',
    requirement: { type: 'time_to_first', value: 15 },
    xpReward: 100,
    fundsReward: 2500
  },
  lightning_hands: {
    id: 'lightning_hands',
    name: 'Lightning Hands',
    description: 'Start treatment within 5 seconds',
    icon: Sparkles,
    category: 'speed',
    tier: 'gold',
    requirement: { type: 'time_to_first', value: 5 },
    xpReward: 200,
    fundsReward: 5000
  },

  // Efficiency category
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Complete scenario with ≤3 equipment pieces',
    icon: Target,
    category: 'efficiency',
    tier: 'bronze',
    requirement: { type: 'max_equipment', value: 3 },
    xpReward: 75,
    fundsReward: 1500
  },
  minimalist_hero: {
    id: 'minimalist_hero',
    name: 'Minimalist Hero',
    description: 'Complete scenario with ≤2 equipment pieces',
    icon: Award,
    category: 'efficiency',
    tier: 'silver',
    requirement: { type: 'max_equipment', value: 2 },
    xpReward: 150,
    fundsReward: 3500
  },
  one_shot_wonder: {
    id: 'one_shot_wonder',
    name: 'One Shot Wonder',
    description: 'Complete scenario with exactly 1 equipment piece',
    icon: Crown,
    category: 'efficiency',
    tier: 'gold',
    requirement: { type: 'exact_equipment', value: 1 },
    xpReward: 300,
    fundsReward: 7500
  },

  // Score category
  good_score: {
    id: 'good_score',
    name: 'Competent Clinician',
    description: 'Achieve a score of 70+',
    icon: Medal,
    category: 'score',
    tier: 'bronze',
    requirement: { type: 'min_score', value: 70 },
    xpReward: 50,
    fundsReward: 1000
  },
  great_score: {
    id: 'great_score',
    name: 'Skilled Physician',
    description: 'Achieve a score of 85+',
    icon: Star,
    category: 'score',
    tier: 'silver',
    requirement: { type: 'min_score', value: 85 },
    xpReward: 100,
    fundsReward: 2500
  },
  perfect_score: {
    id: 'perfect_score',
    name: 'Medical Virtuoso',
    description: 'Achieve a score of 95+',
    icon: Trophy,
    category: 'score',
    tier: 'gold',
    requirement: { type: 'min_score', value: 95 },
    xpReward: 200,
    fundsReward: 5000
  },
  flawless: {
    id: 'flawless',
    name: 'Flawless',
    description: 'Achieve a perfect 100 score',
    icon: Crown,
    category: 'score',
    tier: 'legendary',
    requirement: { type: 'min_score', value: 100 },
    xpReward: 500,
    fundsReward: 15000
  },

  // Difficulty category
  survivor: {
    id: 'survivor',
    name: 'Survivor',
    description: 'Complete a difficulty 3+ scenario',
    icon: Shield,
    category: 'difficulty',
    tier: 'bronze',
    requirement: { type: 'min_difficulty', value: 3 },
    xpReward: 75,
    fundsReward: 1500
  },
  critical_save: {
    id: 'critical_save',
    name: 'Critical Save',
    description: 'Complete a difficulty 5 scenario',
    icon: Heart,
    category: 'difficulty',
    tier: 'silver',
    requirement: { type: 'min_difficulty', value: 5 },
    xpReward: 150,
    fundsReward: 3500
  },
  impossible_save: {
    id: 'impossible_save',
    name: 'Impossible Save',
    description: 'Complete difficulty 5 with 90+ score',
    icon: Crown,
    category: 'difficulty',
    tier: 'gold',
    requirement: { type: 'difficulty_score', difficulty: 5, score: 90 },
    xpReward: 400,
    fundsReward: 10000
  },

  // Streak category
  warmed_up: {
    id: 'warmed_up',
    name: 'Warmed Up',
    description: 'Win 3 scenarios in a row',
    icon: Flame,
    category: 'streak',
    tier: 'bronze',
    requirement: { type: 'win_streak', value: 3 },
    xpReward: 75,
    fundsReward: 2000
  },
  on_fire: {
    id: 'on_fire',
    name: 'On Fire',
    description: 'Win 5 scenarios in a row',
    icon: Flame,
    category: 'streak',
    tier: 'silver',
    requirement: { type: 'win_streak', value: 5 },
    xpReward: 150,
    fundsReward: 5000
  },
  unstoppable: {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Win 10 scenarios in a row',
    icon: Zap,
    category: 'streak',
    tier: 'gold',
    requirement: { type: 'win_streak', value: 10 },
    xpReward: 300,
    fundsReward: 12000
  },
  legend: {
    id: 'legend',
    name: 'Legend',
    description: 'Win 25 scenarios in a row',
    icon: Crown,
    category: 'streak',
    tier: 'legendary',
    requirement: { type: 'win_streak', value: 25 },
    xpReward: 750,
    fundsReward: 50000
  },

  // Specialty category
  cardiac_expert: {
    id: 'cardiac_expert',
    name: 'Cardiac Expert',
    description: 'Complete 10 cardiac scenarios',
    icon: Heart,
    category: 'specialty',
    tier: 'silver',
    requirement: { type: 'condition_count', condition: 'cardiac', value: 10 },
    xpReward: 150,
    fundsReward: 3000
  },
  trauma_expert: {
    id: 'trauma_expert',
    name: 'Trauma Expert',
    description: 'Complete 10 trauma scenarios',
    icon: Activity,
    category: 'specialty',
    tier: 'silver',
    requirement: { type: 'condition_count', condition: 'trauma', value: 10 },
    xpReward: 150,
    fundsReward: 3000
  },
  respiratory_expert: {
    id: 'respiratory_expert',
    name: 'Respiratory Expert',
    description: 'Complete 10 respiratory scenarios',
    icon: Activity,
    category: 'specialty',
    tier: 'silver',
    requirement: { type: 'condition_count', condition: 'respiratory', value: 10 },
    xpReward: 150,
    fundsReward: 3000
  },
  neuro_expert: {
    id: 'neuro_expert',
    name: 'Neuro Expert',
    description: 'Complete 10 neurological scenarios',
    icon: Brain,
    category: 'specialty',
    tier: 'silver',
    requirement: { type: 'condition_count', condition: 'neuro', value: 10 },
    xpReward: 150,
    fundsReward: 3000
  },

  // Milestones category
  first_save: {
    id: 'first_save',
    name: 'First Save',
    description: 'Complete your first scenario',
    icon: Stethoscope,
    category: 'milestones',
    tier: 'bronze',
    requirement: { type: 'total_scenarios', value: 1 },
    xpReward: 50,
    fundsReward: 500
  },
  seasoned: {
    id: 'seasoned',
    name: 'Seasoned',
    description: 'Complete 10 scenarios',
    icon: Medal,
    category: 'milestones',
    tier: 'bronze',
    requirement: { type: 'total_scenarios', value: 10 },
    xpReward: 100,
    fundsReward: 2000
  },
  veteran: {
    id: 'veteran',
    name: 'Veteran',
    description: 'Complete 50 scenarios',
    icon: Star,
    category: 'milestones',
    tier: 'silver',
    requirement: { type: 'total_scenarios', value: 50 },
    xpReward: 250,
    fundsReward: 7500
  },
  master: {
    id: 'master',
    name: 'Master',
    description: 'Complete 100 scenarios',
    icon: Trophy,
    category: 'milestones',
    tier: 'gold',
    requirement: { type: 'total_scenarios', value: 100 },
    xpReward: 500,
    fundsReward: 20000
  },
  grandmaster: {
    id: 'grandmaster',
    name: 'Grandmaster',
    description: 'Complete 500 scenarios',
    icon: Crown,
    category: 'milestones',
    tier: 'legendary',
    requirement: { type: 'total_scenarios', value: 500 },
    xpReward: 1000,
    fundsReward: 100000
  },

  // Budget category
  frugal: {
    id: 'frugal',
    name: 'Frugal',
    description: 'Complete scenario spending <$10,000',
    icon: DollarSign,
    category: 'budget',
    tier: 'bronze',
    requirement: { type: 'max_spending', value: 10000 },
    xpReward: 75,
    fundsReward: 2000
  },
  budget_hero: {
    id: 'budget_hero',
    name: 'Budget Hero',
    description: 'Complete scenario spending <$5,000',
    icon: DollarSign,
    category: 'budget',
    tier: 'silver',
    requirement: { type: 'max_spending', value: 5000 },
    xpReward: 150,
    fundsReward: 5000
  },
  penny_pincher: {
    id: 'penny_pincher',
    name: 'Penny Pincher',
    description: 'Complete scenario spending <$1,000',
    icon: DollarSign,
    category: 'budget',
    tier: 'gold',
    requirement: { type: 'max_spending', value: 1000 },
    xpReward: 300,
    fundsReward: 10000
  }
};

// Tier styling
const TIER_STYLES = {
  bronze: {
    bg: 'bg-gradient-to-br from-amber-100 to-amber-200',
    border: 'border-amber-400',
    text: 'text-amber-800',
    badge: 'bg-amber-500 text-white',
    icon: 'text-amber-600'
  },
  silver: {
    bg: 'bg-gradient-to-br from-slate-100 to-slate-200',
    border: 'border-slate-400',
    text: 'text-slate-800',
    badge: 'bg-slate-500 text-white',
    icon: 'text-slate-500'
  },
  gold: {
    bg: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
    border: 'border-yellow-500',
    text: 'text-yellow-800',
    badge: 'bg-yellow-500 text-black',
    icon: 'text-yellow-600'
  },
  legendary: {
    bg: 'bg-gradient-to-br from-purple-100 to-pink-200',
    border: 'border-purple-500',
    text: 'text-purple-800',
    badge: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
    icon: 'text-purple-600'
  }
};

const CATEGORY_LABELS = {
  speed: { label: 'Speed', icon: Clock },
  efficiency: { label: 'Efficiency', icon: Target },
  score: { label: 'Score', icon: Trophy },
  difficulty: { label: 'Difficulty', icon: Shield },
  streak: { label: 'Streak', icon: Flame },
  specialty: { label: 'Specialty', icon: Stethoscope },
  milestones: { label: 'Milestones', icon: Star },
  budget: { label: 'Budget', icon: DollarSign }
};

// Get achievements from localStorage
export function getUnlockedAchievements() {
  const stored = localStorage.getItem('medsim_achievements');
  return stored ? JSON.parse(stored) : [];
}

// Save achievement to localStorage
export function unlockAchievement(achievementId) {
  const unlocked = getUnlockedAchievements();
  if (!unlocked.includes(achievementId)) {
    unlocked.push(achievementId);
    localStorage.setItem('medsim_achievements', JSON.stringify(unlocked));
    return true;
  }
  return false;
}

// Get player stats from localStorage
export function getPlayerStats() {
  const stored = localStorage.getItem('medsim_player_stats');
  return stored ? JSON.parse(stored) : {
    totalScenarios: 0,
    totalWins: 0,
    currentStreak: 0,
    bestStreak: 0,
    conditionCounts: {},
    totalSpending: 0
  };
}

// Update player stats
export function updatePlayerStats(updates) {
  const stats = getPlayerStats();
  const newStats = { ...stats, ...updates };
  localStorage.setItem('medsim_player_stats', JSON.stringify(newStats));
  return newStats;
}

// Check if achievement should be unlocked
export function checkAchievements(performanceData) {
  const {
    timeToFirst,
    equipmentCount,
    score,
    difficulty,
    outcome,
    condition,
    spending
  } = performanceData;

  const unlockedNow = [];
  const stats = getPlayerStats();

  // Update stats
  const newStats = {
    totalScenarios: stats.totalScenarios + 1,
    totalWins: outcome === 'patient_survived' ? stats.totalWins + 1 : stats.totalWins,
    currentStreak: outcome === 'patient_survived' ? stats.currentStreak + 1 : 0,
    bestStreak: outcome === 'patient_survived'
      ? Math.max(stats.bestStreak, stats.currentStreak + 1)
      : stats.bestStreak,
    conditionCounts: {
      ...stats.conditionCounts,
      [condition]: (stats.conditionCounts[condition] || 0) + 1
    },
    totalSpending: stats.totalSpending + (spending || 0)
  };
  updatePlayerStats(newStats);

  // Only check achievements if patient survived
  if (outcome !== 'patient_survived') return [];

  Object.values(ACHIEVEMENTS).forEach(achievement => {
    const { requirement } = achievement;
    let earned = false;

    switch (requirement.type) {
      case 'time_to_first':
        earned = timeToFirst <= requirement.value;
        break;
      case 'max_equipment':
        earned = equipmentCount <= requirement.value;
        break;
      case 'exact_equipment':
        earned = equipmentCount === requirement.value;
        break;
      case 'min_score':
        earned = score >= requirement.value;
        break;
      case 'min_difficulty':
        earned = difficulty >= requirement.value;
        break;
      case 'difficulty_score':
        earned = difficulty >= requirement.difficulty && score >= requirement.score;
        break;
      case 'win_streak':
        earned = newStats.currentStreak >= requirement.value;
        break;
      case 'condition_count':
        const conditionKey = Object.keys(newStats.conditionCounts).find(c =>
          c.toLowerCase().includes(requirement.condition)
        );
        earned = conditionKey && newStats.conditionCounts[conditionKey] >= requirement.value;
        break;
      case 'total_scenarios':
        earned = newStats.totalScenarios >= requirement.value;
        break;
      case 'max_spending':
        earned = spending <= requirement.value;
        break;
    }

    if (earned && unlockAchievement(achievement.id)) {
      unlockedNow.push(achievement);
    }
  });

  return unlockedNow;
}

// Show achievement notification
export function showAchievementUnlock(achievement) {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });

  toast.success(
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-full ${TIER_STYLES[achievement.tier].bg}`}>
        <achievement.icon className={`w-5 h-5 ${TIER_STYLES[achievement.tier].icon}`} />
      </div>
      <div>
        <p className="font-bold">{achievement.name}</p>
        <p className="text-xs text-muted-foreground">{achievement.description}</p>
        <p className="text-xs text-green-600 mt-1">
          +{achievement.xpReward} XP • +${achievement.fundsReward.toLocaleString()}
        </p>
      </div>
    </div>,
    { duration: 5000 }
  );
}

// Achievement Card Component
function AchievementCard({ achievement, unlocked }) {
  const Icon = achievement.icon;
  const tierStyle = TIER_STYLES[achievement.tier];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative rounded-lg border-2 p-3 transition-all ${
        unlocked
          ? `${tierStyle.bg} ${tierStyle.border}`
          : 'bg-slate-100 border-slate-200 opacity-60'
      }`}
    >
      {unlocked && (
        <div className="absolute -top-1 -right-1">
          <Badge className={tierStyle.badge + ' text-xs capitalize'}>
            {achievement.tier}
          </Badge>
        </div>
      )}
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${unlocked ? 'bg-white/50' : 'bg-slate-200'}`}>
          <Icon className={`w-5 h-5 ${unlocked ? tierStyle.icon : 'text-slate-400'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm ${unlocked ? tierStyle.text : 'text-slate-500'}`}>
            {achievement.name}
          </p>
          <p className={`text-xs ${unlocked ? 'text-slate-600' : 'text-slate-400'}`}>
            {achievement.description}
          </p>
          {unlocked && (
            <p className="text-xs text-green-600 mt-1">
              +{achievement.xpReward} XP • +${achievement.fundsReward.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Main Achievements Dialog
export default function AchievementsSystem({ open, onClose }) {
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (open) {
      setUnlockedIds(getUnlockedAchievements());
      setStats(getPlayerStats());
    }
  }, [open]);

  const achievementsByCategory = Object.values(ACHIEVEMENTS).reduce((acc, achievement) => {
    if (!acc[achievement.category]) acc[achievement.category] = [];
    acc[achievement.category].push(achievement);
    return acc;
  }, {});

  const totalAchievements = Object.keys(ACHIEVEMENTS).length;
  const unlockedCount = unlockedIds.length;
  const progressPercent = (unlockedCount / totalAchievements) * 100;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Achievements
          </DialogTitle>
          <DialogDescription>
            Track your accomplishments and earn rewards
          </DialogDescription>
        </DialogHeader>

        {/* Progress Overview */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {unlockedCount} / {totalAchievements}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            {stats && (
              <div className="grid grid-cols-4 gap-4 mt-4 text-center text-xs">
                <div>
                  <p className="font-bold text-lg">{stats.totalScenarios}</p>
                  <p className="text-muted-foreground">Scenarios</p>
                </div>
                <div>
                  <p className="font-bold text-lg">{stats.totalWins}</p>
                  <p className="text-muted-foreground">Wins</p>
                </div>
                <div>
                  <p className="font-bold text-lg">{stats.currentStreak}</p>
                  <p className="text-muted-foreground">Current Streak</p>
                </div>
                <div>
                  <p className="font-bold text-lg">{stats.bestStreak}</p>
                  <p className="text-muted-foreground">Best Streak</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievements by Category */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-5 lg:grid-cols-9 h-auto">
            <TabsTrigger value="all" className="text-xs py-1.5">All</TabsTrigger>
            {Object.entries(CATEGORY_LABELS).map(([key, { label }]) => (
              <TabsTrigger key={key} value={key} className="text-xs py-1.5">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="h-[400px] mt-4">
            <TabsContent value="all" className="mt-0">
              <div className="space-y-4">
                {Object.entries(achievementsByCategory).map(([category, achievements]) => (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-2">
                      {React.createElement(CATEGORY_LABELS[category].icon, { className: 'w-4 h-4' })}
                      <h3 className="font-semibold text-sm">{CATEGORY_LABELS[category].label}</h3>
                      <Badge variant="outline" className="text-xs">
                        {achievements.filter(a => unlockedIds.includes(a.id)).length}/{achievements.length}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {achievements.map(achievement => (
                        <AchievementCard
                          key={achievement.id}
                          achievement={achievement}
                          unlocked={unlockedIds.includes(achievement.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {Object.entries(achievementsByCategory).map(([category, achievements]) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {achievements.map(achievement => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      unlocked={unlockedIds.includes(achievement.id)}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

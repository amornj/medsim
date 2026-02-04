import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';
import {
  Calendar, Clock, Target, Trophy, Zap, DollarSign,
  Heart, Star, CheckCircle2, XCircle, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

// Challenge definitions
const CHALLENGE_TYPES = {
  speed_run: {
    id: 'speed_run',
    name: 'Speed Run',
    description: 'Complete a scenario in under 3 minutes',
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    requirement: { type: 'time_limit', value: 180 },
    rewards: { xp: 100, funds: 3000, skillPoints: 1 }
  },
  perfect_day: {
    id: 'perfect_day',
    name: 'Perfect Day',
    description: 'Complete 3 scenarios without any patient deaths',
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    requirement: { type: 'consecutive_wins', value: 3 },
    rewards: { xp: 200, funds: 7500, skillPoints: 2 }
  },
  budget_crisis: {
    id: 'budget_crisis',
    name: 'Budget Crisis',
    description: 'Complete a scenario spending under $5,000',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    requirement: { type: 'max_spending', value: 5000 },
    rewards: { xp: 75, funds: 5000, skillPoints: 1 }
  },
  specialty_focus: {
    id: 'specialty_focus',
    name: 'Specialty Focus',
    description: 'Complete 2 cardiac scenarios today',
    icon: Target,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    requirement: { type: 'condition_count', condition: 'cardiac', value: 2 },
    rewards: { xp: 150, funds: 4000, skillPoints: 1 }
  },
  excellence: {
    id: 'excellence',
    name: 'Excellence',
    description: 'Achieve a score of 85+ in any scenario',
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    requirement: { type: 'min_score', value: 85 },
    rewards: { xp: 100, funds: 3500, skillPoints: 1 }
  }
};

// Get today's date string
function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

// Get daily challenges from localStorage
export function getDailyChallenges() {
  const stored = localStorage.getItem('medsim_daily_challenges');
  if (stored) {
    const data = JSON.parse(stored);
    // Check if challenges are from today
    if (data.date === getTodayKey()) {
      return data;
    }
  }
  // Generate new challenges for today
  return generateDailyChallenges();
}

// Generate random daily challenges
function generateDailyChallenges() {
  const challengeKeys = Object.keys(CHALLENGE_TYPES);
  const selected = [];
  const usedIndices = new Set();

  // Select 3 random unique challenges
  while (selected.length < 3) {
    const index = Math.floor(Math.random() * challengeKeys.length);
    if (!usedIndices.has(index)) {
      usedIndices.add(index);
      const key = challengeKeys[index];
      selected.push({
        ...CHALLENGE_TYPES[key],
        progress: 0,
        completed: false,
        claimed: false
      });
    }
  }

  const data = {
    date: getTodayKey(),
    challenges: selected,
    totalRewardsClaimed: false
  };

  localStorage.setItem('medsim_daily_challenges', JSON.stringify(data));
  return data;
}

// Update challenge progress
export function updateChallengeProgress(performanceData) {
  const data = getDailyChallenges();
  const { duration, score, spending, outcome, condition } = performanceData;
  let updated = false;

  data.challenges = data.challenges.map(challenge => {
    if (challenge.completed) return challenge;

    let newProgress = challenge.progress;
    let completed = false;

    switch (challenge.requirement.type) {
      case 'time_limit':
        if (outcome === 'patient_survived' && duration <= challenge.requirement.value) {
          newProgress = 1;
          completed = true;
        }
        break;

      case 'consecutive_wins':
        if (outcome === 'patient_survived') {
          newProgress = Math.min(challenge.progress + 1, challenge.requirement.value);
          completed = newProgress >= challenge.requirement.value;
        } else {
          newProgress = 0; // Reset on death
        }
        break;

      case 'max_spending':
        if (outcome === 'patient_survived' && spending <= challenge.requirement.value) {
          newProgress = 1;
          completed = true;
        }
        break;

      case 'condition_count':
        if (outcome === 'patient_survived' && condition?.toLowerCase().includes(challenge.requirement.condition)) {
          newProgress = Math.min(challenge.progress + 1, challenge.requirement.value);
          completed = newProgress >= challenge.requirement.value;
        }
        break;

      case 'min_score':
        if (outcome === 'patient_survived' && score >= challenge.requirement.value) {
          newProgress = 1;
          completed = true;
        }
        break;
    }

    if (completed && !challenge.completed) {
      updated = true;
      toast.success(`Daily Challenge Complete: ${challenge.name}!`, {
        description: 'Claim your rewards in the Daily Challenges menu'
      });
    }

    return {
      ...challenge,
      progress: newProgress,
      completed
    };
  });

  localStorage.setItem('medsim_daily_challenges', JSON.stringify(data));
  return { data, updated };
}

// Claim reward for a challenge
export function claimChallengeReward(challengeId) {
  const data = getDailyChallenges();
  let reward = null;

  data.challenges = data.challenges.map(challenge => {
    if (challenge.id === challengeId && challenge.completed && !challenge.claimed) {
      reward = challenge.rewards;
      return { ...challenge, claimed: true };
    }
    return challenge;
  });

  localStorage.setItem('medsim_daily_challenges', JSON.stringify(data));
  return reward;
}

// Get time until reset
function getTimeUntilReset() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const diff = tomorrow - now;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
}

// Challenge Card Component
function ChallengeCard({ challenge, onClaim }) {
  const Icon = challenge.icon;
  const progressPercent = challenge.requirement.type === 'time_limit' || challenge.requirement.type === 'max_spending' || challenge.requirement.type === 'min_score'
    ? (challenge.completed ? 100 : 0)
    : (challenge.progress / challenge.requirement.value) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className={`${challenge.bgColor} ${challenge.borderColor} border-2 relative overflow-hidden`}>
        {challenge.completed && !challenge.claimed && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full bg-white/50`}>
              <Icon className={`w-6 h-6 ${challenge.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className={`font-semibold ${challenge.color}`}>{challenge.name}</h3>
                {challenge.completed && (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
              </div>
              <p className="text-sm text-slate-600 mt-0.5">{challenge.description}</p>

              {/* Progress */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Progress</span>
                  <span>
                    {challenge.requirement.type === 'consecutive_wins' || challenge.requirement.type === 'condition_count'
                      ? `${challenge.progress}/${challenge.requirement.value}`
                      : challenge.completed ? 'Complete!' : 'Not yet'
                    }
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>

              {/* Rewards */}
              <div className="flex items-center gap-3 mt-3 text-xs">
                <Badge variant="outline" className="bg-white/50">
                  <Zap className="w-3 h-3 mr-1" />
                  {challenge.rewards.xp} XP
                </Badge>
                <Badge variant="outline" className="bg-white/50">
                  <DollarSign className="w-3 h-3 mr-1" />
                  ${challenge.rewards.funds.toLocaleString()}
                </Badge>
                <Badge variant="outline" className="bg-white/50">
                  <Star className="w-3 h-3 mr-1" />
                  {challenge.rewards.skillPoints} SP
                </Badge>
              </div>

              {/* Claim Button */}
              {challenge.completed && !challenge.claimed && (
                <Button
                  size="sm"
                  className="w-full mt-3 bg-green-600 hover:bg-green-700"
                  onClick={() => onClaim(challenge.id)}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Claim Reward
                </Button>
              )}

              {challenge.claimed && (
                <div className="mt-3 text-center text-sm text-green-600 font-medium">
                  Rewards Claimed!
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Main Daily Challenges Component
export default function DailyChallenges({ open, onClose, onRewardClaimed }) {
  const [challengeData, setChallengeData] = useState(null);
  const [timeUntilReset, setTimeUntilReset] = useState('');

  useEffect(() => {
    if (open) {
      setChallengeData(getDailyChallenges());
      setTimeUntilReset(getTimeUntilReset());

      // Update timer every minute
      const interval = setInterval(() => {
        setTimeUntilReset(getTimeUntilReset());
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [open]);

  const handleClaimReward = (challengeId) => {
    const reward = claimChallengeReward(challengeId);
    if (reward) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });

      toast.success('Reward Claimed!', {
        description: `+${reward.xp} XP, +$${reward.funds.toLocaleString()}, +${reward.skillPoints} Skill Points`
      });

      // Notify parent component
      if (onRewardClaimed) {
        onRewardClaimed(reward);
      }

      // Refresh challenges
      setChallengeData(getDailyChallenges());
    }
  };

  const completedCount = challengeData?.challenges.filter(c => c.completed).length || 0;
  const claimedCount = challengeData?.challenges.filter(c => c.claimed).length || 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Daily Challenges
          </DialogTitle>
          <DialogDescription>
            Complete challenges to earn bonus rewards
          </DialogDescription>
        </DialogHeader>

        {/* Timer and Progress */}
        <Card className="bg-gradient-to-r from-slate-50 to-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Challenges Reset In</p>
                <p className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  {timeUntilReset}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600">Completed</p>
                <p className="text-xl font-bold text-slate-800">
                  {completedCount}/3
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Challenges */}
        <div className="space-y-3">
          {challengeData?.challenges.map((challenge, index) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onClaim={handleClaimReward}
            />
          ))}
        </div>

        {/* Bonus for completing all */}
        {completedCount === 3 && claimedCount < 3 && (
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 border-2">
            <CardContent className="pt-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="font-bold text-yellow-800">All Challenges Complete!</p>
              <p className="text-sm text-yellow-600">
                Claim all rewards for a bonus!
              </p>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Compact badge for header display
export function DailyChallengesBadge({ onClick }) {
  const [challengeData, setChallengeData] = useState(null);

  useEffect(() => {
    setChallengeData(getDailyChallenges());

    // Refresh every minute
    const interval = setInterval(() => {
      setChallengeData(getDailyChallenges());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const completedCount = challengeData?.challenges.filter(c => c.completed).length || 0;
  const unclaimedCount = challengeData?.challenges.filter(c => c.completed && !c.claimed).length || 0;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
    >
      <Calendar className="w-4 h-4 text-blue-600" />
      <span className="text-sm font-medium text-blue-700">
        {completedCount}/3
      </span>
      {unclaimedCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
        >
          {unclaimedCount}
        </motion.span>
      )}
    </motion.button>
  );
}

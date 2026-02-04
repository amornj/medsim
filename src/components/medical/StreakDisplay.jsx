import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, TrendingUp, Zap, Crown } from 'lucide-react';

// Streak bonus tiers
export const STREAK_BONUSES = [
  { minStreak: 3, xpMultiplier: 1.1, fundsBonus: 5000, label: 'Warmed Up', color: 'text-orange-500', bg: 'bg-orange-100' },
  { minStreak: 5, xpMultiplier: 1.25, fundsBonus: 10000, label: 'On Fire', color: 'text-orange-600', bg: 'bg-orange-200' },
  { minStreak: 10, xpMultiplier: 1.5, fundsBonus: 20000, label: 'Unstoppable', color: 'text-red-500', bg: 'bg-red-100' },
  { minStreak: 25, xpMultiplier: 2.0, fundsBonus: 50000, label: 'Legend', color: 'text-purple-600', bg: 'bg-purple-100' }
];

// Get current streak bonus tier
export function getStreakBonus(streak) {
  if (streak < 3) return null;

  const sortedBonuses = [...STREAK_BONUSES].sort((a, b) => b.minStreak - a.minStreak);
  return sortedBonuses.find(bonus => streak >= bonus.minStreak) || null;
}

// Get streak from localStorage
export function getCurrentStreak() {
  const stored = localStorage.getItem('medsim_player_stats');
  if (stored) {
    const stats = JSON.parse(stored);
    return stats.currentStreak || 0;
  }
  return 0;
}

// Update streak in localStorage
export function updateStreak(won) {
  const stored = localStorage.getItem('medsim_player_stats');
  const stats = stored ? JSON.parse(stored) : { currentStreak: 0, bestStreak: 0 };

  if (won) {
    stats.currentStreak = (stats.currentStreak || 0) + 1;
    stats.bestStreak = Math.max(stats.bestStreak || 0, stats.currentStreak);
  } else {
    stats.currentStreak = 0;
  }

  localStorage.setItem('medsim_player_stats', JSON.stringify(stats));
  return stats.currentStreak;
}

// Streak Display Component
export default function StreakDisplay({ streak, compact = false }) {
  const bonus = getStreakBonus(streak);

  if (streak === 0) return null;

  const getStreakIcon = () => {
    if (streak >= 25) return Crown;
    if (streak >= 10) return Zap;
    if (streak >= 5) return TrendingUp;
    return Flame;
  };

  const Icon = getStreakIcon();

  // Get flame intensity based on streak
  const getFlameCount = () => {
    if (streak >= 25) return 3;
    if (streak >= 10) return 2;
    if (streak >= 3) return 1;
    return 0;
  };

  const flameCount = getFlameCount();

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`flex items-center gap-1 px-2 py-1 rounded-full ${bonus?.bg || 'bg-slate-100'}`}
            >
              <div className="flex">
                {[...Array(Math.max(1, flameCount))].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -2, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.1
                    }}
                  >
                    <Flame className={`w-4 h-4 ${bonus?.color || 'text-orange-400'}`} />
                  </motion.div>
                ))}
              </div>
              <span className={`font-bold text-sm ${bonus?.color || 'text-slate-600'}`}>
                {streak}
              </span>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <p className="font-bold">Win Streak: {streak}</p>
              {bonus && (
                <>
                  <p className="text-xs text-muted-foreground">{bonus.label}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {bonus.xpMultiplier}x XP • +${bonus.fundsBonus.toLocaleString()}
                  </p>
                </>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 p-3 rounded-lg ${bonus?.bg || 'bg-slate-100'} border ${bonus ? 'border-orange-300' : 'border-slate-200'}`}
    >
      <div className="flex">
        {[...Array(Math.max(1, flameCount))].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -3, 0],
              scale: [1, 1.15, 1],
              rotate: [0, i % 2 === 0 ? 5 : -5, 0]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15
            }}
          >
            <Flame className={`w-6 h-6 ${bonus?.color || 'text-orange-400'}`} />
          </motion.div>
        ))}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={`font-bold text-xl ${bonus?.color || 'text-slate-700'}`}>
            {streak}
          </span>
          <span className="text-sm text-slate-600">Win Streak</span>
          {bonus && (
            <Badge variant="outline" className={`${bonus.bg} ${bonus.color} border-current text-xs`}>
              {bonus.label}
            </Badge>
          )}
        </div>

        {bonus && (
          <div className="flex items-center gap-3 mt-1 text-xs">
            <span className="text-green-600 font-medium">
              {bonus.xpMultiplier}x XP Multiplier
            </span>
            <span className="text-green-600 font-medium">
              +${bonus.fundsBonus.toLocaleString()} Bonus
            </span>
          </div>
        )}

        {!bonus && streak < 3 && (
          <p className="text-xs text-slate-500">
            {3 - streak} more win{3 - streak !== 1 ? 's' : ''} for streak bonus!
          </p>
        )}
      </div>

      {bonus && streak < STREAK_BONUSES[STREAK_BONUSES.length - 1].minStreak && (
        <div className="text-right text-xs text-slate-500">
          <p>Next tier:</p>
          <p className="font-medium">
            {STREAK_BONUSES.find(b => b.minStreak > streak)?.minStreak - streak} wins
          </p>
        </div>
      )}
    </motion.div>
  );
}

// Streak Lost Animation Component
export function StreakLostDisplay({ previousStreak, onDismiss }) {
  if (previousStreak < 3) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={onDismiss}
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="bg-white rounded-xl p-6 max-w-sm mx-4 text-center shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Flame className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          </motion.div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Streak Lost</h3>
          <p className="text-slate-600 mb-4">
            Your {previousStreak} win streak has ended.
          </p>
          <p className="text-sm text-slate-500">
            Don't give up! Start a new streak with your next win.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDismiss}
            className="mt-4 px-6 py-2 bg-slate-800 text-white rounded-lg font-medium"
          >
            Continue
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

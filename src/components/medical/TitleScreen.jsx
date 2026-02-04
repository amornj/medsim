import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Activity, Zap, BarChart3, Calendar, Trophy, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import StatisticsDashboard from './StatisticsDashboard';
import DailyChallenges from './DailyChallenges';
import AchievementsSystem from './AchievementsSystem';
import SoundEffectsManager from './SoundEffectsManager';

export default function TitleScreen({ onPlay }) {
  const [statisticsOpen, setStatisticsOpen] = useState(false);
  const [dailyChallengesOpen, setDailyChallengesOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [soundSettingsOpen, setSoundSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background particles */}
      <motion.div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
            }}
            animate={{
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>

      {/* Quick Access Buttons - Top Right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="fixed top-4 left-4 z-50 flex gap-2"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStatisticsOpen(true)}
          className="bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700/50 hover:text-white"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Stats
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDailyChallengesOpen(true)}
          className="bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700/50 hover:text-white"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Challenges
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAchievementsOpen(true)}
          className="bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700/50 hover:text-white"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Achievements
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSoundSettingsOpen(true)}
          className="bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700/50 hover:text-white"
        >
          <Volume2 className="w-4 h-4" />
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center relative z-10"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Heart className="w-16 h-16 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.7)]" />
            </motion.div>
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Activity className="w-20 h-20 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.7)]" />
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Zap className="w-16 h-16 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.7)]" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          MEDIC
          <motion.span
            className="text-red-500"
            animate={{ textShadow: ["0 0 10px rgba(239,68,68,0.5)", "0 0 20px rgba(239,68,68,0.8)", "0 0 10px rgba(239,68,68,0.5)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            AL
          </motion.span>
        </motion.h1>

        <motion.p
          className="text-2xl text-blue-300 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Life Support Simulator
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onPlay}
            size="lg"
            className="text-2xl px-12 py-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold shadow-2xl relative overflow-hidden group"
          >
            <motion.span
              className="absolute inset-0 bg-white"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
              style={{ opacity: 0.1 }}
            />
            PLAY
          </Button>
        </motion.div>

        <motion.p
          className="text-slate-400 mt-8 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          Manage critical medical emergencies • Save lives • Master emergency medicine
        </motion.p>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-8 flex justify-center gap-6 text-xs text-slate-500"
        >
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3 text-yellow-500" />
            <span>25+ Achievements</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-blue-400" />
            <span>Daily Challenges</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart3 className="w-3 h-3 text-green-400" />
            <span>Track Progress</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Dialogs */}
      <StatisticsDashboard
        open={statisticsOpen}
        onClose={() => setStatisticsOpen(false)}
      />

      <DailyChallenges
        open={dailyChallengesOpen}
        onClose={() => setDailyChallengesOpen(false)}
      />

      <AchievementsSystem
        open={achievementsOpen}
        onClose={() => setAchievementsOpen(false)}
      />

      <SoundEffectsManager
        open={soundSettingsOpen}
        onClose={() => setSoundSettingsOpen(false)}
      />
    </div>
  );
}

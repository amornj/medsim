import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TitleScreen({ onPlay }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Heart className="w-16 h-16 text-red-500" />
            <Activity className="w-20 h-20 text-blue-400" />
            <Zap className="w-16 h-16 text-yellow-500" />
          </div>
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">
          MEDIC
          <span className="text-red-500">AL</span>
        </h1>
        <p className="text-2xl text-blue-300 mb-12">Life Support Simulator</p>
        
        <Button
          onClick={onPlay}
          size="lg"
          className="text-2xl px-12 py-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold shadow-2xl transform hover:scale-105 transition-all"
        >
          PLAY
        </Button>
        
        <p className="text-slate-400 mt-8 text-sm">
          Manage critical medical emergencies • Save lives • Master emergency medicine
        </p>
      </motion.div>
    </div>
  );
}
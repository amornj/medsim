import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Skull, Thermometer, Heart } from 'lucide-react';
import { Card } from "@/components/ui/card";

export default function DeathImminentWarning({ vitals, onDeath }) {
  const [warnings, setWarnings] = useState([]);
  const [timers, setTimers] = useState({});

  useEffect(() => {
    const newWarnings = [];
    const newTimers = { ...timers };

    // Cardiac arrest (HR = 0) - 4 minutes
    if (vitals?.heart_rate === 0) {
      newWarnings.push({
        id: 'cardiac_arrest',
        type: 'critical',
        icon: Heart,
        message: 'CARDIAC ARREST - PATIENT DEATH IMMINENT',
        timeLimit: 240,
        color: 'bg-red-600'
      });
      if (!timers.cardiac_arrest) {
        newTimers.cardiac_arrest = { startTime: Date.now(), duration: 240000 };
      }
    } else {
      delete newTimers.cardiac_arrest;
    }

    // No blood pressure - 4 minutes
    if (vitals?.blood_pressure_systolic === 0 || vitals?.blood_pressure_diastolic === 0) {
      newWarnings.push({
        id: 'no_bp',
        type: 'critical',
        icon: AlertTriangle,
        message: 'NO BLOOD PRESSURE - PATIENT DEATH IMMINENT',
        timeLimit: 240,
        color: 'bg-red-600'
      });
      if (!timers.no_bp) {
        newTimers.no_bp = { startTime: Date.now(), duration: 240000 };
      }
    } else {
      delete newTimers.no_bp;
    }

    // Hypothermia (< 35°C) - 10 minutes
    if (vitals?.temperature < 35) {
      newWarnings.push({
        id: 'hypothermia',
        type: 'severe',
        icon: Thermometer,
        message: 'SEVERE HYPOTHERMIA - PATIENT DEATH IMMINENT',
        timeLimit: 600,
        color: 'bg-blue-600'
      });
      if (!timers.hypothermia) {
        newTimers.hypothermia = { startTime: Date.now(), duration: 600000 };
      }
    } else {
      delete newTimers.hypothermia;
    }

    // Hyperthermia (> 39°C) - 10 minutes
    if (vitals?.temperature > 39) {
      newWarnings.push({
        id: 'hyperthermia',
        type: 'severe',
        icon: Thermometer,
        message: 'SEVERE HYPERTHERMIA - PATIENT DEATH IMMINENT',
        timeLimit: 600,
        color: 'bg-orange-600'
      });
      if (!timers.hyperthermia) {
        newTimers.hyperthermia = { startTime: Date.now(), duration: 600000 };
      }
    } else {
      delete newTimers.hyperthermia;
    }

    setWarnings(newWarnings);
    setTimers(newTimers);
  }, [vitals]);

  useEffect(() => {
    const interval = setInterval(() => {
      Object.entries(timers).forEach(([key, timer]) => {
        const elapsed = Date.now() - timer.startTime;
        if (elapsed >= timer.duration) {
          onDeath?.(key);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timers, onDeath]);

  const getTimeRemaining = (warningId) => {
    const timer = timers[warningId];
    if (!timer) return 0;
    const elapsed = Date.now() - timer.startTime;
    const remaining = Math.max(0, timer.duration - elapsed);
    return Math.ceil(remaining / 1000);
  };

  return (
    <AnimatePresence>
      {warnings.map((warning) => {
        const timeRemaining = getTimeRemaining(warning.id);
        const Icon = warning.icon;
        
        return (
          <motion.div
            key={warning.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: [1, 1.05, 1],
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              scale: { 
                repeat: Infinity, 
                duration: 1,
                ease: "easeInOut" 
              }
            }}
          >
            <Card className={`${warning.color} text-white p-4 mb-4 border-4 border-white shadow-2xl`}>
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  <Icon className="w-12 h-12" />
                </motion.div>
                <div className="flex-1">
                  <div className="text-xl font-black mb-1 tracking-wide">
                    {warning.message}
                  </div>
                  <div className="text-3xl font-mono font-bold">
                    TIME REMAINING: {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                  </div>
                </div>
                <Skull className="w-16 h-16 opacity-50" />
              </div>
              
              {/* Progress bar */}
              <div className="mt-3 w-full bg-white bg-opacity-30 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeRemaining / warning.timeLimit) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </Card>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}
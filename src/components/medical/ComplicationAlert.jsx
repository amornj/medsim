import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Zap, TrendingDown, WifiOff, Clock, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const EVENT_ICONS = {
  equipment_failure: WifiOff,
  patient_deterioration: TrendingDown,
  sudden_change: Zap,
  time_critical: Clock,
  complication: AlertTriangle
};

const EVENT_COLORS = {
  critical: 'bg-red-100 border-red-400 text-red-800',
  warning: 'bg-orange-100 border-orange-400 text-orange-700',
  info: 'bg-blue-100 border-blue-400 text-blue-700'
};

export default function ComplicationAlert({ event, onDismiss, onAcknowledge }) {
  const [timeRemaining, setTimeRemaining] = useState(event?.timeLimit || null);
  
  useEffect(() => {
    if (!event?.timeLimit) return;
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (event.onTimeout) event.onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [event]);

  if (!event) return null;

  const Icon = EVENT_ICONS[event.type] || AlertTriangle;
  const colorClass = EVENT_COLORS[event.severity] || EVENT_COLORS.warning;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-xl w-full px-4"
      >
        <Card className={`${colorClass} border-2 shadow-2xl`}>
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  className="p-2 bg-white rounded-full"
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-lg">{event.title}</h3>
                  <Badge variant="outline" className="mt-1">
                    {event.type.replace(/_/g, ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
              {!event.requiresAction && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <p className="text-sm mb-4">{event.description}</p>

            {event.effects && event.effects.length > 0 && (
              <div className="mb-4 space-y-1">
                <p className="text-xs font-semibold mb-1">EFFECTS:</p>
                {event.effects.map((effect, idx) => (
                  <p key={idx} className="text-xs">• {effect}</p>
                ))}
              </div>
            )}

            {timeRemaining !== null && timeRemaining > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">TIME TO RESPOND:</span>
                  <span className="text-sm font-bold">{timeRemaining}s</span>
                </div>
                <div className="w-full bg-white/50 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-red-600"
                    initial={{ width: '100%' }}
                    animate={{ width: `${(timeRemaining / event.timeLimit) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            )}

            {event.requiresAction && (
              <div className="flex gap-2">
                <Button
                  onClick={onAcknowledge}
                  className="flex-1 bg-slate-800 hover:bg-slate-900"
                >
                  Acknowledge & Respond
                </Button>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
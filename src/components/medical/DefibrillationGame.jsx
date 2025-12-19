import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Zap, Heart, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DefibrillationGame({ open, onClose, onSuccess, mode = 'defibrillation' }) {
  const [progress, setProgress] = useState(0);
  const [spacebarPresses, setSpacebarPresses] = useState(0);
  const [mouseSpeed, setMouseSpeed] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  
  const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() });
  const mouseSpeedDecayInterval = useRef(null);
  const gameTimerInterval = useRef(null);

  useEffect(() => {
    if (open) {
      setProgress(0);
      setSpacebarPresses(0);
      setMouseSpeed(0);
      setGameActive(true);
      setResult(null);
      setTimeLeft(mode === 'defibrillation' ? 10 : 15);
    }
  }, [open, mode]);

  useEffect(() => {
    if (!gameActive) return;

    // Game timer
    gameTimerInterval.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          endGame(false);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    // Mouse speed decay
    mouseSpeedDecayInterval.current = setInterval(() => {
      setMouseSpeed((prev) => Math.max(0, prev - 2));
    }, 100);

    return () => {
      if (gameTimerInterval.current) clearInterval(gameTimerInterval.current);
      if (mouseSpeedDecayInterval.current) clearInterval(mouseSpeedDecayInterval.current);
    };
  }, [gameActive]);

  useEffect(() => {
    if (progress >= 100 && gameActive) {
      endGame(true);
    }
  }, [progress, gameActive]);

  const endGame = (success) => {
    setGameActive(false);
    setResult(success);
    if (success) {
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    }
  };

  const handleKeyDown = (e) => {
    if (!gameActive) return;
    
    if (e.code === 'Space') {
      e.preventDefault();
      setSpacebarPresses((prev) => prev + 1);
      
      if (mode === 'cpr') {
        // CPR mode: spacebar only
        setProgress((prev) => Math.min(100, prev + 3));
      } else {
        // Defibrillation mode: spacebar contributes less
        setProgress((prev) => Math.min(100, prev + 1));
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!gameActive || mode === 'cpr') return;

    const now = Date.now();
    const timeDiff = (now - lastMousePos.current.time) / 1000;
    
    if (timeDiff > 0) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = distance / timeDiff;
      
      // Scale speed to 0-100
      const scaledSpeed = Math.min(100, speed / 10);
      setMouseSpeed(scaledSpeed);
      
      // Add to progress based on mouse speed
      setProgress((prev) => Math.min(100, prev + scaledSpeed / 50));
    }
    
    lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };
  };

  useEffect(() => {
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, gameActive, mode]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl"
        onMouseMove={handleMouseMove}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {mode === 'defibrillation' ? (
              <>
                <Zap className="w-6 h-6 text-orange-600" />
                Defibrillation Procedure
              </>
            ) : (
              <>
                <Heart className="w-6 h-6 text-red-600" />
                CPR Procedure
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {result === null ? (
          <div className="space-y-6 py-4">
            {/* Instructions */}
            <div className="bg-slate-100 p-4 rounded-lg">
              <p className="text-sm font-semibold text-slate-800 mb-2">
                {mode === 'defibrillation' ? 'Charge the defibrillator:' : 'Perform chest compressions:'}
              </p>
              <ul className="text-sm text-slate-600 space-y-1">
                {mode === 'defibrillation' ? (
                  <>
                    <li>• Press SPACEBAR rapidly to charge the pads</li>
                    <li>• Move your mouse QUICKLY across the screen</li>
                    <li>• Fill the bar to 100% to deliver shock</li>
                  </>
                ) : (
                  <>
                    <li>• Press SPACEBAR rapidly for chest compressions</li>
                    <li>• Maintain 100-120 compressions per minute</li>
                    <li>• Fill the bar to 100% for effective CPR</li>
                  </>
                )}
              </ul>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-lg px-4 py-2">
                Time: {timeLeft.toFixed(1)}s
              </Badge>
              {mode === 'defibrillation' && (
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Mouse Speed: {mouseSpeed.toFixed(0)}%
                </Badge>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Progress</span>
                <span className="text-2xl font-bold text-blue-600">{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-8" />
            </div>

            {/* Visual Feedback */}
            <motion.div
              animate={{
                scale: spacebarPresses % 2 === 0 ? 1 : 1.1,
                rotate: mouseSpeed > 50 ? [0, -5, 5, 0] : 0
              }}
              transition={{ duration: 0.1 }}
              className="flex justify-center"
            >
              {mode === 'defibrillation' ? (
                <Zap className="w-32 h-32 text-orange-500" />
              ) : (
                <Heart className="w-32 h-32 text-red-500" />
              )}
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{spacebarPresses}</div>
                <div className="text-xs text-slate-600">
                  {mode === 'defibrillation' ? 'Charges' : 'Compressions'}
                </div>
              </div>
              {mode === 'defibrillation' && (
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{mouseSpeed.toFixed(0)}%</div>
                  <div className="text-xs text-slate-600">Mouse Speed</div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8">
            {result ? (
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  <CheckCircle2 className="w-24 h-24 text-green-600 mx-auto" />
                </motion.div>
                <h3 className="text-2xl font-bold text-green-700">
                  {mode === 'defibrillation' ? 'Shock Delivered!' : 'Effective CPR!'}
                </h3>
                <p className="text-slate-600">
                  {mode === 'defibrillation' 
                    ? 'Patient responding to defibrillation...' 
                    : 'Chest compressions effective...'}
                </p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <AlertCircle className="w-24 h-24 text-red-600 mx-auto" />
                <h3 className="text-2xl font-bold text-red-700">Time's Up!</h3>
                <p className="text-slate-600">Procedure incomplete. Try again.</p>
                <Button onClick={onClose} variant="outline">
                  Close
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
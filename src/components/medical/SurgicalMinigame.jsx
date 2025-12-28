import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Scissors, Wrench, Activity, Heart, AlertCircle, Trophy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DonorSelector from './DonorSelector';

const SURGICAL_TOOLS = [
  { id: 'scalpel', name: 'Scalpel', icon: '🔪', damage: 20, precision: 0.9 },
  { id: 'tweezers', name: 'Medical Tweezers', icon: '🔧', damage: 10, precision: 0.95 },
  { id: 'scissors', name: 'Medical Scissors', icon: '✂️', damage: 15, precision: 0.85 },
  { id: 'clamp', name: 'Surgical Clamp', icon: '🔗', damage: 8, precision: 0.98 },
  { id: 'retractor', name: 'Retractor', icon: '📏', damage: 5, precision: 0.99 },
  { id: 'suture', name: 'Suture Needle', icon: '🪡', damage: 12, precision: 0.92 }
];

const ORGANS_POSITIONS = {
  heart: { x: 150, y: 155, width: 25, height: 30, name: 'Heart' },
  lungs_left: { x: 132, y: 130, width: 36, height: 76, name: 'Left Lung' },
  lungs_right: { x: 168, y: 130, width: 36, height: 76, name: 'Right Lung' },
  liver: { x: 145, y: 180, width: 45, height: 24, name: 'Liver' },
  stomach: { x: 130, y: 183, width: 22, height: 24, name: 'Stomach' },
  kidney_left: { x: 122, y: 205, width: 16, height: 24, name: 'Left Kidney' },
  kidney_right: { x: 172, y: 205, width: 16, height: 24, name: 'Right Kidney' },
  brain: { x: 150, y: 38, width: 56, height: 64, name: 'Brain' }
};

export default function SurgicalMinigame({ open, onClose, targetOrgan = 'heart' }) {
  const [selectedTool, setSelectedTool] = useState(null);
  const [toolPosition, setToolPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [patientHealth, setPatientHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [successfulCuts, setSuccessfulCuts] = useState(0);
  const [wrongCuts, setWrongCuts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showDonorSelector, setShowDonorSelector] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const svgRef = useRef(null);
  const requiredCuts = 10;

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
  };

  const handleMouseDown = (e) => {
    if (selectedTool && svgRef.current) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && selectedTool && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 300;
      const y = ((e.clientY - rect.top) / rect.height) * 600;
      setToolPosition({ x, y });
    }
  };

  const handleMouseUp = () => {
    if (isDragging && selectedTool) {
      checkCollision();
      setIsDragging(false);
    }
  };

  const handleTouchStart = (e) => {
    if (selectedTool && svgRef.current) {
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && selectedTool && svgRef.current) {
      const touch = e.touches[0];
      const rect = svgRef.current.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 300;
      const y = ((touch.clientY - rect.top) / rect.height) * 600;
      setToolPosition({ x, y });
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (isDragging && selectedTool) {
      checkCollision();
      setIsDragging(false);
    }
  };

  const checkCollision = () => {
    if (!selectedTool || gameOver || gameWon) return;

    const target = ORGANS_POSITIONS[targetOrgan];
    const isTargetHit = 
      toolPosition.x >= target.x - target.width / 2 &&
      toolPosition.x <= target.x + target.width / 2 &&
      toolPosition.y >= target.y - target.height / 2 &&
      toolPosition.y <= target.y + target.height / 2;

    if (isTargetHit) {
      // Successful cut on target organ
      const precision = Math.random() < selectedTool.precision ? 1 : 0.8;
      const points = Math.round(50 * precision);
      setScore(prev => prev + points);
      setSuccessfulCuts(prev => {
        const newCount = prev + 1;
        if (newCount >= requiredCuts) {
          setGameWon(true);
          setFeedbackMessage(`Surgery Complete! Score: ${score + points}`);
        }
        return newCount;
      });
      setFeedbackMessage(`✓ Precise incision! +${points} points`);
    } else {
      // Check if hit other organs
      let hitOtherOrgan = false;
      Object.entries(ORGANS_POSITIONS).forEach(([organKey, organ]) => {
        if (organKey !== targetOrgan) {
          const isHit = 
            toolPosition.x >= organ.x - organ.width / 2 &&
            toolPosition.x <= organ.x + organ.width / 2 &&
            toolPosition.y >= organ.y - organ.height / 2 &&
            toolPosition.y <= organ.y + organ.height / 2;
          
          if (isHit) {
            hitOtherOrgan = true;
            const damage = selectedTool.damage;
            setPatientHealth(prev => {
              const newHealth = Math.max(0, prev - damage);
              if (newHealth <= 0) {
                setGameOver(true);
                setFeedbackMessage('Patient died. Surgery failed.');
              }
              return newHealth;
            });
            setWrongCuts(prev => prev + 1);
            setScore(prev => Math.max(0, prev - 30));
            setFeedbackMessage(`✗ Hit ${organ.name}! -${damage} health, -30 points`);
          }
        }
      });

      if (!hitOtherOrgan) {
        setFeedbackMessage('Miss! Try again.');
      }
    }

    setTimeout(() => setFeedbackMessage(''), 2000);
  };

  const resetGame = () => {
    setPatientHealth(100);
    setScore(0);
    setSuccessfulCuts(0);
    setWrongCuts(0);
    setGameOver(false);
    setGameWon(false);
    setSelectedTool(null);
    setFeedbackMessage('');
  };

  const handleTransplant = () => {
    setShowDonorSelector(true);
  };

  const handleDonorSelected = (donor) => {
    setShowDonorSelector(false);
    setFeedbackMessage(`Donor selected: ${donor.bloodType}, ${donor.age}y, ${donor.weight}kg. Proceeding with transplant...`);
    setTimeout(() => {
      setGameWon(true);
      setFeedbackMessage(`Transplant successful! Final score: ${score + 500}`);
      setScore(prev => prev + 500);
    }, 2000);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging]);

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5" />
                Surgical Minigame - {ORGANS_POSITIONS[targetOrgan]?.name || 'Unknown'} Surgery
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Stats Panel */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Patient Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Health</span>
                      <span className={patientHealth < 30 ? 'text-red-500 font-bold' : ''}>{patientHealth}%</span>
                    </div>
                    <Progress value={patientHealth} className={patientHealth < 30 ? 'bg-red-200' : ''} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{successfulCuts}/{requiredCuts}</span>
                    </div>
                    <Progress value={(successfulCuts / requiredCuts) * 100} className="bg-green-200" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Score:</span>
                    <Badge variant="outline">{score}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Successful:</span>
                    <Badge className="bg-green-600">{successfulCuts}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600">Wrong Cuts:</span>
                    <Badge className="bg-red-600">{wrongCuts}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Tool Selection */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    Surgical Tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {SURGICAL_TOOLS.map((tool) => (
                    <Button
                      key={tool.id}
                      variant={selectedTool?.id === tool.id ? 'default' : 'outline'}
                      className="w-full justify-start text-left"
                      onClick={() => handleToolSelect(tool)}
                    >
                      <span className="text-xl mr-2">{tool.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm">{tool.name}</div>
                        <div className="text-xs opacity-75">Precision: {Math.round(tool.precision * 100)}%</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Button 
                className="w-full" 
                variant="secondary"
                onClick={handleTransplant}
                disabled={gameOver}
              >
                <Heart className="w-4 h-4 mr-2" />
                Organ Transplant
              </Button>

              <Button 
                className="w-full" 
                onClick={resetGame}
              >
                Reset Surgery
              </Button>
            </div>

            {/* Operating Area */}
            <div className="lg:col-span-3">
              <Card className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
                <CardContent className="p-6">
                  <div className="relative">
                    <svg
                      ref={svgRef}
                      className="w-full h-[600px] cursor-crosshair"
                      viewBox="0 0 300 600"
                      onMouseDown={handleMouseDown}
                      onTouchStart={handleTouchStart}
                      style={{ touchAction: 'none' }}
                    >
                      {/* Body outline */}
                      <ellipse cx="150" cy="45" rx="32" ry="38" fill="#1e293b" stroke="#475569" strokeWidth="2.5"/>
                      <rect x="140" y="80" width="20" height="18" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
                      <ellipse cx="150" cy="105" rx="45" ry="12" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
                      <path d="M 115 105 L 115 170 Q 115 180 120 185 L 150 190 L 180 185 Q 185 180 185 170 L 185 105 Z" 
                            fill="#1e293b" stroke="#475569" strokeWidth="2.5"/>
                      <ellipse cx="150" cy="200" rx="35" ry="18" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
                      <rect x="82" y="105" width="22" height="65" rx="11" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
                      <rect x="196" y="105" width="22" height="65" rx="11" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
                      <rect x="128" y="215" width="22" height="85" rx="11" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
                      <rect x="150" y="215" width="22" height="85" rx="11" fill="#1e293b" stroke="#475569" strokeWidth="2"/>

                      {/* Organs */}
                      {/* Brain */}
                      <ellipse cx="150" cy="38" rx="28" ry="32" fill="#ec4899" fillOpacity="0.6" stroke="#db2777" strokeWidth="2"/>
                      
                      {/* Lungs */}
                      <ellipse cx="132" cy="130" rx="20" ry="38" fill="#60a5fa" fillOpacity="0.6" stroke="#3b82f6" strokeWidth="2"/>
                      <ellipse cx="168" cy="130" rx="20" ry="38" fill="#60a5fa" fillOpacity="0.6" stroke="#3b82f6" strokeWidth="2"/>
                      
                      {/* Heart */}
                      <path d="M 150 168 L 140 158 L 140 150 Q 140 144 145 144 Q 150 144 150 148 Q 150 144 155 144 Q 160 144 160 150 L 160 158 Z" 
                            fill="#ef4444" fillOpacity="0.6" stroke="#dc2626" strokeWidth="2"/>
                      
                      {/* Liver */}
                      <path d="M 130 170 Q 135 168 155 168 Q 175 168 180 172 L 178 188 Q 175 192 165 192 L 140 192 Q 132 192 130 188 Z" 
                            fill="#a855f7" fillOpacity="0.6" stroke="#9333ea" strokeWidth="2"/>
                      
                      {/* Stomach */}
                      <path d="M 125 173 Q 122 178 122 183 Q 122 188 125 192 L 138 192 Q 141 188 141 183 Q 141 178 138 173 Z" 
                            fill="#10b981" fillOpacity="0.6" stroke="#059669" strokeWidth="2"/>
                      
                      {/* Kidneys */}
                      <path d="M 122 198 Q 118 198 118 204 Q 118 210 122 212 Q 126 212 128 210 Q 130 206 128 202 Q 126 198 122 198" 
                            fill="#f59e0b" fillOpacity="0.6" stroke="#d97706" strokeWidth="2"/>
                      <path d="M 178 198 Q 182 198 182 204 Q 182 210 178 212 Q 174 212 172 210 Q 170 206 172 202 Q 174 198 178 198" 
                            fill="#f59e0b" fillOpacity="0.6" stroke="#d97706" strokeWidth="2"/>

                      {/* Target organ highlight */}
                      <motion.rect
                        x={ORGANS_POSITIONS[targetOrgan].x - ORGANS_POSITIONS[targetOrgan].width / 2}
                        y={ORGANS_POSITIONS[targetOrgan].y - ORGANS_POSITIONS[targetOrgan].height / 2}
                        width={ORGANS_POSITIONS[targetOrgan].width}
                        height={ORGANS_POSITIONS[targetOrgan].height}
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      />

                      {/* Tool cursor */}
                      {selectedTool && isDragging && (
                        <g transform={`translate(${toolPosition.x}, ${toolPosition.y})`}>
                          <circle r="8" fill="white" fillOpacity="0.8" stroke="#000" strokeWidth="2"/>
                          <text 
                            textAnchor="middle" 
                            dy="6" 
                            fontSize="12"
                          >
                            {selectedTool.icon}
                          </text>
                        </g>
                      )}
                    </svg>

                    {/* Feedback Messages */}
                    <AnimatePresence>
                      {feedbackMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg z-10"
                        >
                          {feedbackMessage}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Game Over Overlay */}
                    <AnimatePresence>
                      {(gameOver || gameWon) && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center"
                        >
                          <div className="bg-white rounded-xl p-8 text-center space-y-4 max-w-md">
                            {gameWon ? (
                              <>
                                <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
                                <h3 className="text-2xl font-bold text-green-600">Surgery Successful!</h3>
                                <p className="text-slate-600">The patient survived the operation.</p>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
                                <h3 className="text-2xl font-bold text-red-600">Surgery Failed</h3>
                                <p className="text-slate-600">The patient did not survive.</p>
                              </>
                            )}
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Final Score:</span>
                                <Badge className="text-lg">{score}</Badge>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Successful Cuts:</span>
                                <Badge variant="outline">{successfulCuts}</Badge>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Wrong Cuts:</span>
                                <Badge variant="outline">{wrongCuts}</Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={resetGame} className="flex-1">
                                Try Again
                              </Button>
                              <Button variant="outline" onClick={onClose} className="flex-1">
                                Exit
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mt-4 text-center text-sm text-slate-400">
                    {selectedTool ? (
                      <>Click or tap on the highlighted <span className="text-yellow-500 font-bold">{ORGANS_POSITIONS[targetOrgan]?.name}</span> to perform surgery. Avoid other organs!</>
                    ) : (
                      'Select a surgical tool to begin the operation'
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DonorSelector
        open={showDonorSelector}
        onClose={() => setShowDonorSelector(false)}
        onSelectDonor={handleDonorSelected}
        organType={targetOrgan}
      />
    </>
  );
}
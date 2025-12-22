import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Shield, Target, AlertTriangle, Skull, Infinity, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const GAME_MODES = [
  {
    id: 'sandbox',
    name: 'Sandbox',
    description: 'Practice freely with unlimited resources',
    icon: Infinity,
    color: 'bg-green-100 border-green-300 text-green-700',
    buttonColor: 'bg-green-600 hover:bg-green-700',
    funds: Infinity,
    allergies: 'disabled',
    difficulty: 'Tutorial',
    features: ['∞ Unlimited Funds', '✓ No Allergies', '✓ All Equipment Available']
  },
  {
    id: 'recruit',
    name: 'Recruit',
    description: 'Start your medical career with generous resources',
    icon: Shield,
    color: 'bg-blue-100 border-blue-300 text-blue-700',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    funds: 500000,
    allergies: 'none',
    difficulty: 'Easy',
    features: ['💰 $500,000 Budget', '✓ No Allergies', '✓ Easy Scenarios']
  },
  {
    id: 'cadet',
    name: 'Cadet',
    description: 'Limited budget and fixed patient allergies',
    icon: Target,
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
    funds: 300000,
    allergies: 'fixed',
    difficulty: 'Medium',
    features: ['💰 $300,000 Budget', '⚠️ Fixed Allergies', '✓ Standard Care']
  },
  {
    id: 'experienced',
    name: 'Experienced',
    description: 'Moderate funds with unpredictable allergic reactions',
    icon: Activity,
    color: 'bg-orange-100 border-orange-300 text-orange-700',
    buttonColor: 'bg-orange-600 hover:bg-orange-700',
    funds: 150000,
    allergies: 'random',
    difficulty: 'Hard',
    features: ['💰 $150,000 Budget', '⚠️ Random Allergies', '⚡ Quick Decisions']
  },
  {
    id: 'petty_officer',
    name: 'Petty Officer',
    description: 'Low funds with dangerous allergic complications',
    icon: AlertTriangle,
    color: 'bg-red-100 border-red-300 text-red-700',
    buttonColor: 'bg-red-600 hover:bg-red-700',
    funds: 80000,
    allergies: 'complications',
    difficulty: 'Very Hard',
    features: ['💰 $80,000 Budget', '⚠️ Allergy Complications', '❌ High Stakes']
  },
  {
    id: 'specialist',
    name: 'Specialist',
    description: 'Minimal funds, life-threatening allergies, procedures can fail',
    icon: Skull,
    color: 'bg-red-900 border-red-950 text-red-50',
    buttonColor: 'bg-red-900 hover:bg-red-950',
    funds: 30000,
    allergies: 'deadly',
    difficulty: 'Expert',
    features: ['💰 $30,000 Budget', '☠️ Deadly Allergies', '❌ Procedure Failures']
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function GameModeSelector({ onSelectMode, onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Select Game Mode</h1>
          <p className="text-slate-600">Choose your difficulty and resource constraints</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {GAME_MODES.map((mode, index) => (
            <motion.div
              key={mode.id}
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`hover:shadow-xl transition-shadow cursor-pointer border-2 ${mode.color} h-full`}
              >
                <CardHeader className="pb-3">
                  <motion.div 
                    className="flex items-center justify-between mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      <mode.icon className="w-8 h-8" />
                    </motion.div>
                    <Badge variant="outline">{mode.difficulty}</Badge>
                  </motion.div>
                  <CardTitle className="text-xl">{mode.name}</CardTitle>
                  <p className="text-sm opacity-80 mt-1">{mode.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {mode.features.map((feature, idx) => (
                      <motion.p 
                        key={idx} 
                        className="text-sm font-medium"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.4 + idx * 0.05 }}
                      >
                        {feature}
                      </motion.p>
                    ))}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => onSelectMode(mode)}
                      className={`w-full ${mode.buttonColor} text-white font-bold`}
                    >
                      Select {mode.name}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button variant="outline" onClick={onBack}>
            Back to Title
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
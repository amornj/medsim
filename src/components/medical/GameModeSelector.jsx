import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Shield, Target, AlertTriangle, Skull, Infinity } from 'lucide-react';

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
    funds: 50000,
    allergies: 'none',
    difficulty: 'Easy',
    features: ['💰 $50,000 Budget', '✓ No Allergies', '✓ Easy Scenarios']
  },
  {
    id: 'cadet',
    name: 'Cadet',
    description: 'Limited budget and fixed patient allergies',
    icon: Target,
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
    funds: 30000,
    allergies: 'fixed',
    difficulty: 'Medium',
    features: ['💰 $30,000 Budget', '⚠️ Fixed Allergies', '✓ Standard Care']
  },
  {
    id: 'experienced',
    name: 'Experienced',
    description: 'Moderate funds with unpredictable allergic reactions',
    icon: Activity,
    color: 'bg-orange-100 border-orange-300 text-orange-700',
    buttonColor: 'bg-orange-600 hover:bg-orange-700',
    funds: 15000,
    allergies: 'random',
    difficulty: 'Hard',
    features: ['💰 $15,000 Budget', '⚠️ Random Allergies', '⚡ Quick Decisions']
  },
  {
    id: 'petty_officer',
    name: 'Petty Officer',
    description: 'Low funds with dangerous allergic complications',
    icon: AlertTriangle,
    color: 'bg-red-100 border-red-300 text-red-700',
    buttonColor: 'bg-red-600 hover:bg-red-700',
    funds: 8000,
    allergies: 'complications',
    difficulty: 'Very Hard',
    features: ['💰 $8,000 Budget', '⚠️ Allergy Complications', '❌ High Stakes']
  },
  {
    id: 'specialist',
    name: 'Specialist',
    description: 'Minimal funds, life-threatening allergies, procedures can fail',
    icon: Skull,
    color: 'bg-red-900 border-red-950 text-red-50',
    buttonColor: 'bg-red-900 hover:bg-red-950',
    funds: 3000,
    allergies: 'deadly',
    difficulty: 'Expert',
    features: ['💰 $3,000 Budget', '☠️ Deadly Allergies', '❌ Procedure Failures']
  }
];

export default function GameModeSelector({ onSelectMode, onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Select Game Mode</h1>
          <p className="text-slate-600">Choose your difficulty and resource constraints</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {GAME_MODES.map((mode) => (
            <Card
              key={mode.id}
              className={`hover:shadow-xl transition-all cursor-pointer border-2 ${mode.color}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <mode.icon className="w-8 h-8" />
                  <Badge variant="outline">{mode.difficulty}</Badge>
                </div>
                <CardTitle className="text-xl">{mode.name}</CardTitle>
                <p className="text-sm opacity-80 mt-1">{mode.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {mode.features.map((feature, idx) => (
                    <p key={idx} className="text-sm font-medium">
                      {feature}
                    </p>
                  ))}
                </div>
                <Button
                  onClick={() => onSelectMode(mode)}
                  className={`w-full ${mode.buttonColor} text-white font-bold`}
                >
                  Select {mode.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" onClick={onBack}>
            Back to Title
          </Button>
        </div>
      </div>
    </div>
  );
}
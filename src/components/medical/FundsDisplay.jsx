import React from 'react';
import { Card } from "@/components/ui/card";
import { DollarSign, Infinity } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function FundsDisplay({ funds, gameMode }) {
  const isInfinite = funds === Infinity;
  
  const getFundsColor = () => {
    if (isInfinite) return 'text-green-600';
    if (funds > 20000) return 'text-green-600';
    if (funds > 10000) return 'text-blue-600';
    if (funds > 5000) return 'text-yellow-600';
    if (funds > 1000) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Card className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-green-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isInfinite ? (
            <Infinity className="w-8 h-8 text-green-600" />
          ) : (
            <DollarSign className={`w-8 h-8 ${getFundsColor()}`} />
          )}
          <div>
            <p className="text-xs text-slate-600 uppercase font-semibold">Available Funds</p>
            <p className={`text-3xl font-bold ${getFundsColor()}`}>
              {isInfinite ? '∞' : `$${funds.toLocaleString()}`}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {gameMode?.name || 'Unknown'}
        </Badge>
      </div>
      {!isInfinite && funds < 5000 && (
        <p className="text-xs text-red-600 mt-2">
          ⚠️ Low funds! Choose equipment wisely
        </p>
      )}
    </Card>
  );
}
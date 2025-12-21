import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";

export default function EKGMonitor({ vitals }) {
  const [ekgPath, setEkgPath] = useState('');
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Generate EKG waveform based on heart rate
    const generateEKG = () => {
      const hr = vitals?.heart_rate || 75;
      const beatInterval = (60 / hr) * 100; // pixels between beats
      const width = 500;
      
      let path = 'M 0 50 ';
      let x = 0;
      
      while (x < width) {
        // P wave
        path += `L ${x + 5} 45 L ${x + 10} 50 `;
        // PR segment
        path += `L ${x + 20} 50 `;
        // QRS complex
        path += `L ${x + 22} 50 L ${x + 25} 30 L ${x + 28} 70 L ${x + 31} 50 `;
        // ST segment
        path += `L ${x + 35} 50 `;
        // T wave
        path += `L ${x + 40} 45 L ${x + 45} 50 `;
        // Baseline
        path += `L ${x + beatInterval} 50 `;
        
        x += beatInterval;
      }
      
      setEkgPath(path);
    };

    generateEKG();
    
    // Animate the EKG
    const animationInterval = setInterval(() => {
      setOffset((prev) => (prev + 2) % 500);
    }, 30);

    return () => clearInterval(animationInterval);
  }, [vitals?.heart_rate]);

  const getEKGColor = () => {
    const hr = vitals?.heart_rate || 75;
    if (hr === 0) return '#dc2626'; // red - cardiac arrest
    if (hr < 40 || hr > 150) return '#f59e0b'; // orange - dangerous
    if (hr < 60 || hr > 100) return '#eab308'; // yellow - abnormal
    return '#10b981'; // green - normal
  };

  return (
    <Card className="shadow-lg bg-black">
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-green-500 text-sm font-mono">LEAD II</div>
          <div className="text-green-500 text-lg font-mono font-bold">
            HR: {Math.round(vitals?.heart_rate || 0)} BPM
          </div>
        </div>
        <div className="relative h-32 bg-black rounded overflow-hidden border border-green-900">
          {/* Grid background */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(34, 197, 94, 0.1)" strokeWidth="0.5"/>
              </pattern>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <rect width="50" height="50" fill="url(#smallGrid)"/>
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          
          {/* EKG waveform */}
          <svg 
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 500 100"
            preserveAspectRatio="none"
            style={{ transform: `translateX(-${offset}px)` }}
          >
            <path
              d={ekgPath}
              fill="none"
              stroke={getEKGColor()}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="drop-shadow(0 0 4px currentColor)"
            />
          </svg>
          
          {/* Duplicate for seamless loop */}
          <svg 
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 500 100"
            preserveAspectRatio="none"
            style={{ transform: `translateX(${500 - offset}px)` }}
          >
            <path
              d={ekgPath}
              fill="none"
              stroke={getEKGColor()}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="drop-shadow(0 0 4px currentColor)"
            />
          </svg>
          
          {/* Alert overlays */}
          {vitals?.heart_rate === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-red-500 text-2xl font-bold animate-pulse">
                ASYSTOLE
              </div>
            </div>
          )}
          {vitals?.heart_rate > 0 && vitals?.heart_rate < 40 && (
            <div className="absolute top-2 right-2 text-orange-500 text-xs font-bold">
              BRADYCARDIA
            </div>
          )}
          {vitals?.heart_rate > 150 && (
            <div className="absolute top-2 right-2 text-orange-500 text-xs font-bold animate-pulse">
              TACHYCARDIA
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
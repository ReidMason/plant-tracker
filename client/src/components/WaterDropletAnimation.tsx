"use client";

import { useState, useEffect } from "react";
import { Droplet } from "lucide-react";

interface WaterDropletAnimationProps {
  isAnimating: boolean;
  onAnimationComplete?: () => void;
}

export default function WaterDropletAnimation({ isAnimating, onAnimationComplete }: WaterDropletAnimationProps) {
  const [animationPhase, setAnimationPhase] = useState<'filling' | 'complete'>('filling');

  useEffect(() => {
    if (isAnimating) {
      // Start filling immediately
      setAnimationPhase('filling');
      
      // Animation sequence - go to complete phase
      const timer = setTimeout(() => {
        setAnimationPhase('complete');
        
        // Complete animation and reset
        const completeTimer = setTimeout(() => {
          onAnimationComplete?.();
        }, 600);
        
        return () => clearTimeout(completeTimer);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [isAnimating, onAnimationComplete]);

  if (!isAnimating) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-sm rounded-xl" />
      
      {/* Water droplet container */}
      <div className="relative">
        {/* Main droplet shape */}
        <div className={`
          relative w-16 h-20 rounded-full bg-gradient-to-b from-cyan-300 to-cyan-600 
          shadow-lg transform transition-all duration-1200 ease-out
          ${animationPhase === 'filling' ? 'scale-110 animate-pulse' : 'scale-100'}
        `}>
          {/* Water level fill animation - starts immediately */}
          <div className={`
            absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-400 to-cyan-200 
            rounded-full transition-all duration-1200 ease-out
            ${animationPhase === 'filling' ? 'h-full' : 'h-0'}
          `} />
          
          {/* Highlight effect */}
          <div className="absolute top-2 left-3 w-3 h-4 bg-white/40 rounded-full blur-sm" />
          
          {/* Droplet icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Droplet className={`
              w-8 h-8 text-white/80 transition-all duration-300
              ${animationPhase === 'filling' ? 'scale-110' : 'scale-100'}
            `} />
          </div>
        </div>

        {/* Sparkle effects */}
        {animationPhase === 'complete' && (
          <>
            <div className="absolute -top-2 -left-2 w-2 h-2 bg-cyan-300 rounded-full animate-ping" />
            <div className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-blue-300 rounded-full animate-ping animation-delay-200" />
            <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-cyan-400 rounded-full animate-ping animation-delay-400" />
            <div className="absolute -bottom-2 -right-1 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping animation-delay-600" />
          </>
        )}

        {/* Success checkmark */}
        {animationPhase === 'complete' && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full shadow-lg animate-bounce">
              <span>✓</span>
              <span>Watered!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
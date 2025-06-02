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
        {/* Main water container - now rounded like fertilizer */}
        <div className={`
          relative w-16 h-16 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 
          shadow-lg transform transition-all duration-1200 ease-out
          ${animationPhase === 'filling' ? 'scale-110 animate-pulse' : 'scale-100'}
        `}>
          {/* Water fill animation */}
          <div className={`
            absolute inset-2 bg-gradient-to-t from-cyan-400 to-cyan-200 
            rounded-full transition-all duration-1200 ease-out
            ${animationPhase === 'filling' ? 'scale-100 opacity-100' : 'scale-150 opacity-30'}
          `} />
          
          {/* Droplet icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Droplet className={`
              w-8 h-8 text-white transition-all duration-300
              ${animationPhase === 'filling' ? 'scale-110' : 'scale-100'}
            `} />
          </div>
        </div>

        {/* Floating water droplets */}
        {animationPhase === 'filling' && (
          <>
            <div className="absolute -top-3 -left-3 w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="absolute -top-4 right-0 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
            <div className="absolute top-0 -right-4 w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
            <div className="absolute bottom-0 -left-4 w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <div className="absolute -bottom-3 right-1 w-2 h-2 bg-cyan-600 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
          </>
        )}

        {/* Water emoji effects - simplified like fertilizer */}
        {animationPhase === 'complete' && (
          <>
            <div className="absolute -top-2 -left-2 w-3 h-3 text-cyan-400 animate-ping">💧</div>
            <div className="absolute -top-1 -right-2 w-2 h-2 text-blue-400 animate-ping animation-delay-200">🫧</div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 text-cyan-500 animate-ping animation-delay-400">💧</div>
            <div className="absolute -bottom-2 -right-1 w-3 h-3 text-blue-500 animate-ping animation-delay-600">💦</div>
            <div className="absolute top-1 -left-3 w-2 h-2 text-cyan-300 animate-ping animation-delay-800">🫧</div>
            <div className="absolute -top-3 right-1 w-2 h-2 text-blue-300 animate-ping animation-delay-1000">💧</div>
          </>
        )}

        {/* Success message */}
        {animationPhase === 'complete' && (
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-1 px-3 py-1 bg-cyan-500 text-white text-xs font-medium rounded-full shadow-lg animate-bounce">
              <span>💧</span>
              <span>Watered!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
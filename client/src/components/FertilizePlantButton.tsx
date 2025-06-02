"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { createFertilizeEvent } from "@/lib/services/eventsService/eventsService";

interface FertilizePlantButtonProps {
  userId: number;
  plantId: number;
  onSuccess?: () => void;
  disabled?: boolean;
  needsFertilizer?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  size?: "sm" | "lg";
  className?: string;
  compact?: boolean;
}

export default function FertilizePlantButton({ userId, plantId, onSuccess, disabled, needsFertilizer, onClick, size = "sm", className, compact = false }: FertilizePlantButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFertilizePlant = async () => {
    setIsSubmitting(true);
    try {
      const result = await createFertilizeEvent(userId, plantId, { 
        note: "",
        eventType: 2 // This will be overridden by the service, but required by the type
      });

      if (!result.ok) {
        console.error("Failed to fertilize plant:", result.error.message);
        alert("Failed to fertilize plant. Please try again.");
        return;
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error fertilizing plant:", error);
      alert("Error fertilizing plant. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      variant={needsFertilizer ? "default" : "outline"}
      size={size}
      className={`
        text-white font-semibold
        border-none rounded-lg
        cursor-pointer w-full h-full
        transition-all duration-300
        shadow-lg hover:shadow-xl
        flex items-center justify-center
        ${needsFertilizer 
          ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
          : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'
        }
        ${className || ""}
      `}
      onClick={e => {
        if (onClick) onClick(e);
        handleFertilizePlant();
      }}
      disabled={isSubmitting || disabled}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin flex-shrink-0" />
          <span className="text-center">Fertilizing...</span>
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="text-center">{compact ? "Fertilize" : "Fertilize Plant"}</span>
        </>
      )}
    </Button>
  );
} 
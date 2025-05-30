"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Droplet, Loader2 } from "lucide-react";
import { createWateringEvent } from "@/lib/services/eventsService/eventsService";

interface WaterPlantButtonProps {
  userId: number;
  plantId: number;
  onSuccess?: () => void;
  disabled?: boolean;
  needsWatering?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  size?: "sm" | "lg";
  className?: string;
}

export default function WaterPlantButton({ userId, plantId, onSuccess, disabled, needsWatering, onClick, size = "sm", className }: WaterPlantButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWaterPlant = async () => {
    setIsSubmitting(true);
    try {
      const result = await createWateringEvent(userId, plantId, { note: "" });

      if (!result.ok) {
        console.error("Failed to water plant:", result.error.message);
        return;
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error watering plant:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      variant={needsWatering ? "default" : "outline"}
      size={size}
      className={`
        text-white font-semibold
        border-none rounded-lg
        cursor-pointer w-full h-full
        transition-all duration-300
        shadow-lg hover:shadow-xl
        ${className || ""}
      `}
      onClick={e => {
        if (onClick) onClick(e);
        handleWaterPlant();
      }}
      disabled={isSubmitting || disabled}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Watering...
        </>
      ) : (
        <>
          <Droplet className="mr-2 h-4 w-4" />
          Water Plant
        </>
      )}
    </Button>
  );
}

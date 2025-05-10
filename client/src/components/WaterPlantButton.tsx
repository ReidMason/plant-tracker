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
}

export default function WaterPlantButton({ userId, plantId, onSuccess, disabled, needsWatering, onClick }: WaterPlantButtonProps) {
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
      size="sm"
      className={
        (needsWatering
          ? "bg-green-600 text-white border-green-700 hover:bg-green-700 hover:text-white "
          : "text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 ") +
        "cursor-pointer"
      }
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
          Water
        </>
      )}
    </Button>
  );
} 

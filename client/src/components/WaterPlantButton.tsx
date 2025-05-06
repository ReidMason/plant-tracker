"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Droplet, Loader2 } from "lucide-react";
import eventsService from "@/lib/services/eventsService";

interface WaterPlantButtonProps {
  userId: number;
  plantId: number;
  onSuccess?: () => void;
}

export default function WaterPlantButton({ userId, plantId, onSuccess }: WaterPlantButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWaterPlant = async () => {
    setIsSubmitting(true);
    try {
      const result = await eventsService.createWateringEvent(userId, plantId, { note: "" });
      
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
      variant="outline" 
      size="sm" 
      className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
      onClick={handleWaterPlant}
      disabled={isSubmitting}
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
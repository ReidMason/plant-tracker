"use client";

import { useState } from "react";
import { Plant } from "@/lib/services/plantsService";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import WaterPlantButton from "./WaterPlantButton";
import LastWateredDisplay from "./LastWateredDisplay";

interface PlantListWithWateringProps {
  plants: Plant[];
  userId: number;
}

export default function PlantListWithWatering({ plants, userId }: PlantListWithWateringProps) {
  // Use a map to track refresh triggers for each plant
  const [refreshTriggers, setRefreshTriggers] = useState<Record<number, number>>(
    plants.reduce((acc, plant) => ({ ...acc, [plant.id]: 0 }), {})
  );

  if (plants.length === 0) {
    return (
      <div className="text-center text-muted-foreground my-6">
        No plants found for this user.
      </div>
    );
  }

  const handleWateringSuccess = (plantId: number) => {
    // Update refresh trigger for the specific plant
    setRefreshTriggers(prev => ({
      ...prev,
      [plantId]: (prev[plantId] || 0) + 1
    }));
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold mb-4">Plants</h2>
      <div className="grid grid-cols-1 gap-3">
        {plants.map((plant) => (
          <Card
            key={plant.id}
            className="p-3 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-2">
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-2xl mr-2">
                    🌱
                  </span>
                  <div>
                    <h3 className="font-medium">{plant.name}</h3>
                    <LastWateredDisplay
                      lastWaterEvent={plant.lastWaterEvent}
                      nextWaterDue={plant.nextWaterDue}
                      refreshTrigger={refreshTriggers[plant.id]}
                    />
                  </div>
                </div>
              </div>
              <WaterPlantButton
                userId={userId}
                plantId={plant.id}
                onSuccess={() => handleWateringSuccess(plant.id)}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 

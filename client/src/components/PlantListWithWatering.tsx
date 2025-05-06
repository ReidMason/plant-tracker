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

  // Generate a vibrant color based on the plant id
  function getColorForPlant(plantId: number) {
    const colors = [
      "bg-green-200",
      "bg-green-300",
      "bg-emerald-200",
      "bg-teal-200",
      "bg-cyan-200",
      "bg-lime-200",
      "bg-yellow-200",
      "bg-amber-200",
    ];
    
    return colors[plantId % colors.length];
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
              <Avatar className={`${getColorForPlant(plant.id)} mr-3`}>
                <AvatarFallback>{plant.id}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <h3 className="font-medium">{plant.name}</h3>
                <LastWateredDisplay 
                  userId={userId} 
                  plantId={plant.id} 
                  refreshTrigger={refreshTriggers[plant.id]}
                />
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
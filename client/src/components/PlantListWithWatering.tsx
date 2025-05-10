"use client";

import { useState, useEffect } from "react";
import { Plant, getPlantsByUserId } from "@/lib/services/plantsService/plantsService";
import { Card } from "@/components/ui/card";
import WaterPlantButton from "./WaterPlantButton";
import LastWateredDisplay from "./LastWateredDisplay";
import Link from "next/link";

interface PlantListWithWateringProps {
  plants: Plant[];
  userId: number;
}

export default function PlantListWithWatering({ plants: initialPlants, userId }: PlantListWithWateringProps) {
  const [plants, setPlants] = useState<Plant[]>(initialPlants);
  const [loadingPlantId, setLoadingPlantId] = useState<number | null>(null);

  useEffect(() => {
    setPlants(initialPlants);
  }, [initialPlants]);

  const handleWateringSuccess = async (plantId: number) => {
    setLoadingPlantId(plantId);
    const result = await getPlantsByUserId(userId);
    if (result.ok) {
      setPlants(result.value);
    }
    setLoadingPlantId(null);
  };

  if (plants.length === 0) {
    return (
      <div className="text-center text-muted-foreground my-6">
        No plants found for this user.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold mb-4">Plants</h2>
      <div className="grid grid-cols-1 gap-3">
        {plants.map((plant) => {
          const isOverdue = !plant.nextWaterDue || (plant.nextWaterDue instanceof Date && plant.nextWaterDue.getTime() < Date.now());
          const plantLink = `/plant/${plant.id}?userId=${userId}`;
          return (
            <Card
              key={plant.id}
              className={
                `p-3 hover:shadow-md transition-shadow cursor-pointer ` +
                (isOverdue ? 'bg-orange-50 border border-orange-200 shadow-sm' : '')
              }
            >
              <div className="flex items-center mb-2">
                <Link href={plantLink} className="flex-grow block" tabIndex={-1} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-2xl mr-2">
                      🌱
                    </span>
                    <div>
                      <h3 className="font-medium">
                        {plant.name}
                      </h3>
                      <LastWateredDisplay
                        lastWaterEvent={plant.lastWaterEvent}
                        nextWaterDue={plant.nextWaterDue}
                      />
                    </div>
                  </div>
                </Link>
                <WaterPlantButton
                  userId={userId}
                  plantId={plant.id}
                  onSuccess={() => handleWateringSuccess(plant.id)}
                  disabled={loadingPlantId === plant.id}
                  needsWatering={isOverdue}
                  onClick={e => e.stopPropagation()}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 

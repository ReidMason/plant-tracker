"use client";

import { useState, useEffect } from "react";
import { Plant, getPlantsByUserId } from "@/lib/services/plantsService/plantsService";
import { Card } from "@/components/ui/card";
import WaterPlantButton from "./WaterPlantButton";
import LastWateredDisplay from "./LastWateredDisplay";
import Link from "next/link";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface PlantListWithWateringProps {
  plants: Plant[];
  userId: number;
}

export default function PlantListWithWatering({ plants: initialPlants, userId }: PlantListWithWateringProps) {
  const [plants, setPlants] = useState<Plant[]>(initialPlants);
  const [loadingPlantId, setLoadingPlantId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'lastWatered' | 'nextWaterDue'>('name');

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

  // Sorting logic
  const sortedPlants = [...plants].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'lastWatered') {
      const aTime = a.lastWaterEvent?.timestamp ? new Date(a.lastWaterEvent.timestamp).getTime() : 0;
      const bTime = b.lastWaterEvent?.timestamp ? new Date(b.lastWaterEvent.timestamp).getTime() : 0;
      return bTime - aTime; // Most recently watered first
    } else if (sortBy === 'nextWaterDue') {
      const aTime = a.nextWaterDue instanceof Date ? a.nextWaterDue.getTime() : Infinity;
      const bTime = b.nextWaterDue instanceof Date ? b.nextWaterDue.getTime() : Infinity;
      return aTime - bTime; // Soonest due first
    }
    return 0;
  });

  if (plants.length === 0) {
    return (
      <div className="text-center text-muted-foreground my-6">
        No plants found for this user.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end mb-2">
        <Link
          href={`/plant/new?userId=${userId}`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Plant
        </Link>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Plants</h2>
        <Select value={sortBy} onValueChange={v => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-44" aria-label="Sort by">
            <SelectValue
              aria-label={
                sortBy === 'name' ? 'Sort by Name' : sortBy === 'lastWatered' ? 'Sort by Last Watered' : 'Sort by Next Water Due'
              }
              className="max-w-[8rem] truncate block"
            >
              {sortBy === 'name' ? 'Sort by Name' : sortBy === 'lastWatered' ? 'Sort by Last Watered' : 'Sort by Next Water Due'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="lastWatered">Sort by Last Watered</SelectItem>
            <SelectItem value="nextWaterDue">Sort by Next Water Due</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {sortedPlants.map((plant) => {
          const isOverdue = !plant.nextWaterDue || (plant.nextWaterDue instanceof Date && plant.nextWaterDue.getTime() < Date.now());
          const plantLink = `/plant/${plant.id}?userId=${userId}`;
          return (
            <Card
              key={plant.id}
              className={
                `p-3 hover:shadow-md transition-shadow cursor-pointer gap-0` +
                (isOverdue ? 'bg-orange-50 border border-orange-200 shadow-sm gap-0' : '')
              }
            >
              <Link href={plantLink} tabIndex={-1} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-2xl">
                    🌱
                  </span>
                  <h3 className="font-semibold text-lg flex-1 truncate">{plant.name}</h3>
                </div>
              </Link>
              <div className="flex items-center pl-11 gap-4 justify-between">
                <div className="flex-1">
                  <LastWateredDisplay
                    lastWaterEvent={plant.lastWaterEvent}
                    nextWaterDue={plant.nextWaterDue}
                  />
                </div>
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

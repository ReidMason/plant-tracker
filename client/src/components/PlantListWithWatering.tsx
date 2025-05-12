"use client";

import { useState, useEffect } from "react";
import { Plant, getPlantsByUserId } from "@/lib/services/plantsService/plantsService";
import Link from "next/link";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import PlantGrid from "./PlantGrid";

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
      // Plants with no nextWaterDue (never watered) should come first
      const aNever = !(a.nextWaterDue instanceof Date);
      const bNever = !(b.nextWaterDue instanceof Date);
      if (aNever && !bNever) return -1;
      if (!aNever && bNever) return 1;
      if (aNever && bNever) return 0;
      // Both have nextWaterDue, sort by soonest due
      return (a.nextWaterDue as Date).getTime() - (b.nextWaterDue as Date).getTime();
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
      <div className="flex justify-end mb-4">
        <Link
          href={`/plant/new?userId=${userId}`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Plant
        </Link>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Plants</h2>
          <span className="text-sm text-muted-foreground">({plants.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <p>Sort by:</p>
          <Select value={sortBy} onValueChange={v => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-44" aria-label="Sort by">
              <SelectValue
                aria-label={
                  sortBy === 'name' ? 'Name' : sortBy === 'lastWatered' ? 'Last Watered' : 'Next Water Due'
                }
                className="max-w-[8rem] truncate block"
              >
                {sortBy === 'name' ? 'Name' : sortBy === 'lastWatered' ? 'Last Watered' : 'Next Water Due'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="lastWatered">Last Watered</SelectItem>
              <SelectItem value="nextWaterDue">Next Water Due</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <PlantGrid
        plants={sortedPlants}
        userId={userId}
        loadingPlantId={loadingPlantId}
        onWateringSuccess={handleWateringSuccess}
      />
    </div>
  );
} 

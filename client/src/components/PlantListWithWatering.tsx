"use client";

import { useState, useEffect } from "react";
import { Plant, getPlantsByUserId } from "@/lib/services/plantsService/plantsService";
import Link from "next/link";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Plus, Sprout, SortAsc } from "lucide-react";
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
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sprout className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No plants yet</h3>
        <p className="text-gray-500 mb-6">Start building your plant collection</p>
        <Link
          href={`/plant/new?userId=${userId}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          Add Your First Plant
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Plant Collection</h2>
            <p className="text-sm text-gray-600">{plants.length} plant{plants.length !== 1 ? 's' : ''} in your care</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <Select value={sortBy} onValueChange={v => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-40 bg-white/70 backdrop-blur-sm border-emerald-200" aria-label="Sort by">
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

          <Link
            href={`/plant/new?userId=${userId}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Add Plant
          </Link>
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

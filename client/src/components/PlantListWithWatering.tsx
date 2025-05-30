"use client";

import { useState, useEffect } from "react";
import { Plant, getPlantsByUserId } from "@/lib/services/plantsService/plantsService";
import Link from "next/link";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Sprout, SortAsc, Search } from "lucide-react";
import PlantGrid from "./PlantGrid";

interface PlantListWithWateringProps {
  plants: Plant[];
  userId: number;
}

export default function PlantListWithWatering({ plants: initialPlants, userId }: PlantListWithWateringProps) {
  const [plants, setPlants] = useState<Plant[]>(initialPlants);
  const [loadingPlantId, setLoadingPlantId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'lastWatered' | 'nextWaterDue'>('name');
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter plants by search term first
  const filteredPlants = plants.filter(plant =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting logic
  const sortedPlants = [...filteredPlants].sort((a, b) => {
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
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 dark:from-emerald-800 dark:to-green-700">
          <Sprout className="w-8 h-8 text-emerald-600 dark:text-emerald-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 dark:text-gray-100">No plants yet</h3>
        <p className="text-gray-500 mb-6 dark:text-gray-400">Start building your plant collection</p>
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
      <div className="flex flex-col gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200 dark:from-emerald-900/20 dark:to-green-900/20 dark:border-emerald-700/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Plant Collection</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredPlants.length} of {plants.length} plant{plants.length !== 1 ? 's' : ''}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative flex items-center">
            <Search className="absolute z-10 left-3 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <Input
              placeholder="Search plants by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 bg-white/70 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 dark:bg-gray-800/70 dark:border-emerald-700/50 dark:focus:border-emerald-500 dark:text-gray-200 dark:placeholder-gray-400"
            />
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
            <Select value={sortBy} onValueChange={v => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-40 bg-white/70 backdrop-blur-sm border-emerald-200 dark:bg-gray-800/70 dark:border-emerald-700/50 dark:text-gray-200" aria-label="Sort by">
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

          {/* Add Plant Button */}
          <Link
            href={`/plant/new?userId=${userId}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Add Plant
          </Link>
        </div>
      </div>

      {/* Results or No Results Message */}
      {filteredPlants.length === 0 && searchTerm ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 dark:from-gray-700 dark:to-gray-600">
            <Search className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 dark:text-gray-100">No plants found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            No plants match &quot;{searchTerm}&quot;. Try a different search term.
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-4 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
          >
            Clear search
          </button>
        </div>
      ) : (
        <PlantGrid
          plants={sortedPlants}
          userId={userId}
          loadingPlantId={loadingPlantId}
          onWateringSuccess={handleWateringSuccess}
        />
      )}
    </div>
  );
}


import { Plant } from "@/lib/services/plantsService/plantsService";
import Link from "next/link";
import LastWateredDisplay from "./LastWateredDisplay";
import LastFertilizedDisplay from "./LastFertilizedDisplay";
import WaterPlantButton from "./WaterPlantButton";
import FertilizePlantButton from "./FertilizePlantButton";
import WaterDropletAnimation from "./WaterDropletAnimation";
import FertilizerSparkleAnimation from "./FertilizerSparkleAnimation";
import { Droplets, Calendar, Sprout, Sparkles } from "lucide-react";
import { useState } from "react";

export default function PlantGrid({ plants, userId, loadingPlantId, onPlantActionSuccess }: {
  plants: Plant[];
  userId: number;
  loadingPlantId: number | null;
  onPlantActionSuccess: (plantId: number) => void;
}) {
  const [animatingPlantId, setAnimatingPlantId] = useState<number | null>(null);
  const [animationType, setAnimationType] = useState<'water' | 'fertilizer'>('water');

  const handleWateringClick = (plantId: number) => {
    setAnimatingPlantId(plantId);
    setAnimationType('water');
  };

  const handleFertilizerClick = (plantId: number) => {
    setAnimatingPlantId(plantId);
    setAnimationType('fertilizer');
  };

  const handleAnimationComplete = () => {
    setAnimatingPlantId(null);
  };

  return (
    <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {plants.map((plant) => {
        const isOverdue = !plant.nextWaterDue || (plant.nextWaterDue instanceof Date && plant.nextWaterDue.getTime() < Date.now());
        const isFertilizerOverdue = !plant.nextFertilizerDue || (plant.nextFertilizerDue instanceof Date && plant.nextFertilizerDue.getTime() < Date.now());
        const plantLink = `/plant/${plant.id}?userId=${userId}`;
        const isAnimating = animatingPlantId === plant.id;

        return (
          <li key={plant.id} className="group">
            <div className="h-full bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col dark:bg-gray-800/95 dark:border-gray-700/50 relative">
              {/* Animation overlays */}
              {isAnimating && animationType === 'water' && (
                <WaterDropletAnimation
                  isAnimating={isAnimating}
                  onAnimationComplete={handleAnimationComplete}
                />
              )}
              {isAnimating && animationType === 'fertilizer' && (
                <FertilizerSparkleAnimation
                  isAnimating={isAnimating}
                  onAnimationComplete={handleAnimationComplete}
                />
              )}

              {/* Header with plant icon and name */}
              <div className="relative p-6 pb-4">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                      <Sprout className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors duration-200 truncate dark:text-gray-100 dark:group-hover:text-emerald-400">
                      <Link href={plantLink} className="hover:underline">
                        {plant.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">Plant Collection</p>
                  </div>
                </div>
              </div>

              {/* Status sections */}
              <div className="px-6 pb-4 flex-1 space-y-3">
                {/* Watering status */}
                <div className={`p-4 rounded-lg border ${isOverdue
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-700/30'
                    : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 dark:from-emerald-900/20 dark:to-green-900/20 dark:border-emerald-700/30'
                  }`}>
                  <div className="flex items-start gap-2">
                    {isOverdue ? (
                      <Droplets className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0 dark:text-amber-400" />
                    ) : (
                      <Calendar className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0 dark:text-emerald-400" />
                    )}
                    <div className="min-w-0 flex-1">
                      <LastWateredDisplay
                        lastWaterEvent={plant.lastWaterEvent}
                        nextWaterDue={plant.nextWaterDue}
                      />
                    </div>
                  </div>
                </div>

                {/* Fertilizer status */}
                <div className={`p-4 rounded-lg border ${isFertilizerOverdue
                    ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 dark:from-yellow-900/20 dark:to-amber-900/20 dark:border-yellow-700/30'
                    : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 dark:from-emerald-900/20 dark:to-green-900/20 dark:border-emerald-700/30'
                  }`}>
                  <div className="flex items-start gap-2">
                    {isFertilizerOverdue ? (
                      <Sparkles className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0 dark:text-yellow-400" />
                    ) : (
                      <Calendar className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0 dark:text-emerald-400" />
                    )}
                    <div className="min-w-0 flex-1">
                      <LastFertilizedDisplay
                        lastFertilizerEvent={plant.lastFertilizerEvent}
                        nextFertilizerDue={plant.nextFertilizerDue}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="border-t border-gray-200/50 bg-gray-50/50 backdrop-blur-sm mt-auto dark:border-gray-700/50 dark:bg-gray-700/20">
                <div className="grid grid-cols-3 divide-x divide-gray-200/50 dark:divide-gray-700/50">
                  <Link
                    href={plantLink}
                    className="flex items-center justify-center gap-1 py-4 text-xs font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all duration-200 dark:text-gray-300 dark:hover:text-emerald-400 dark:hover:bg-emerald-900/20"
                  >
                    <span>View</span>
                  </Link>

                  <WaterPlantButton
                    userId={userId}
                    plantId={plant.id}
                    onSuccess={() => onPlantActionSuccess(plant.id)}
                    onClick={() => handleWateringClick(plant.id)}
                    disabled={loadingPlantId === plant.id}
                    needsWatering={isOverdue}
                    compact={true}
                    className={`w-full py-4 border-none rounded-none font-medium transition-all duration-200 text-xs flex items-center justify-center ${isOverdue
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 shadow-md'
                        : 'bg-transparent text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50/50 dark:text-cyan-400 dark:hover:text-cyan-300 dark:hover:bg-cyan-900/20'
                      }`}
                  />

                  <FertilizePlantButton
                    userId={userId}
                    plantId={plant.id}
                    onSuccess={() => onPlantActionSuccess(plant.id)}
                    onClick={() => handleFertilizerClick(plant.id)}
                    disabled={loadingPlantId === plant.id}
                    needsFertilizer={isFertilizerOverdue}
                    compact={true}
                    className={`w-full py-4 border-none rounded-none font-medium transition-all duration-200 text-xs flex items-center justify-center bg-transparent ${isFertilizerOverdue
                        ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50/50 dark:text-yellow-400 dark:hover:text-yellow-300 dark:hover:bg-yellow-900/20'
                        : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-900/20'
                      }`}
                  />
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

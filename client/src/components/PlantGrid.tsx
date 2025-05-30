import { Plant } from "@/lib/services/plantsService/plantsService";
import Link from "next/link";
import LastWateredDisplay from "./LastWateredDisplay";
import WaterPlantButton from "./WaterPlantButton";
import { Droplets, Calendar, AlertTriangle } from "lucide-react";

export default function PlantGrid({ plants, userId, loadingPlantId, onWateringSuccess }: {
  plants: Plant[];
  userId: number;
  loadingPlantId: number | null;
  onWateringSuccess: (plantId: number) => void;
}) {
  return (
    <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {plants.map((plant) => {
        const isOverdue = !plant.nextWaterDue || (plant.nextWaterDue instanceof Date && plant.nextWaterDue.getTime() < Date.now());
        const plantLink = `/plant/${plant.id}?userId=${userId}`;
        
        return (
          <li key={plant.id} className="group">
            <div className="h-full bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
              {/* Header with plant icon and name */}
              <div className="relative p-6 pb-4">
                {isOverdue && (
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-medium rounded-full shadow-md">
                      <AlertTriangle className="w-3 h-3" />
                      Due
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
                      🌱
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors duration-200 truncate">
                      <Link href={plantLink} className="hover:underline">
                        {plant.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Plant Collection</p>
                  </div>
                </div>
              </div>

              {/* Watering status */}
              <div className="px-6 pb-4 flex-1">
                <div className={`p-4 rounded-lg border ${
                  isOverdue 
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200' 
                    : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200'
                }`}>
                  <div className="flex items-start gap-2">
                    {isOverdue ? (
                      <Droplets className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Calendar className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <LastWateredDisplay 
                        lastWaterEvent={plant.lastWaterEvent} 
                        nextWaterDue={plant.nextWaterDue} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="border-t border-gray-200/50 bg-gray-50/50 backdrop-blur-sm mt-auto">
                <div className="grid grid-cols-2 divide-x divide-gray-200/50">
                  <Link
                    href={plantLink}
                    className="flex items-center justify-center gap-2 py-4 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all duration-200"
                  >
                    <span>View Details</span>
                  </Link>
                  
                  <WaterPlantButton
                    userId={userId}
                    plantId={plant.id}
                    onSuccess={() => onWateringSuccess(plant.id)}
                    disabled={loadingPlantId === plant.id}
                    needsWatering={isOverdue}
                    className={`w-full py-4 border-none rounded-none font-medium transition-all duration-200 text-sm ${
                      isOverdue
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 shadow-md'
                        : 'bg-transparent text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50/50'
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

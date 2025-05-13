import { Plant } from "@/lib/services/plantsService/plantsService";
import Link from "next/link";
import LastWateredDisplay from "./LastWateredDisplay";
import WaterPlantButton from "./WaterPlantButton";

export default function PlantGrid({ plants, userId, loadingPlantId, onWateringSuccess }: {
  plants: Plant[];
  userId: number;
  loadingPlantId: number | null;
  onWateringSuccess: (plantId: number) => void;
}) {
  return (
    <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {plants.map((plant) => {
        const isOverdue = !plant.nextWaterDue || (plant.nextWaterDue instanceof Date && plant.nextWaterDue.getTime() < Date.now());
        const plantLink = `/plant/${plant.id}?userId=${userId}`;
        return (
          <li key={plant.id} className="flex flex-col justify-between rounded-lg bg-white shadow overflow-hidden">
            <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-2xl">
                    🌱
                  </span>
                  <h3 className="truncate text-sm font-medium text-gray-900">
                    <Link href={plantLink}>{plant.name}</Link>
                  </h3>
                  {isOverdue && (
                    <span className="inline-flex shrink-0 items-center rounded-full bg-yellow-50 px-1.5 py-0.5 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">Needs Water</span>
                  )}
                </div>
                <div className="mt-1">
                  <LastWateredDisplay lastWaterEvent={plant.lastWaterEvent} nextWaterDue={plant.nextWaterDue} />
                </div>
              </div>
              {/* Optionally, you can add a plant image here if available */}
            </div>
            <div className="-mt-px flex divide-x divide-gray-200 border-t border-gray-200">
              <div className="flex w-0 flex-1">
                <Link
                  href={plantLink}
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 py-4 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
                >
                  View
                </Link>
              </div>
              <div className="flex w-0 flex-1">
                <WaterPlantButton
                  userId={userId}
                  plantId={plant.id}
                  onSuccess={() => onWateringSuccess(plant.id)}
                  disabled={loadingPlantId === plant.id}
                  needsWatering={isOverdue}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

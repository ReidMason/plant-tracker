import { notFound } from "next/navigation";
import { getPlantById, Plant } from "@/lib/services/plantsService/plantsService";
import LastWateredDisplay from "@/components/LastWateredDisplay";
import WaterPlantButton from "@/components/WaterPlantButton";
import Link from "next/link";
import RenamePlant from "@/components/RenamePlant";

interface PlantPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ userId: string }>;
}

export default async function PlantPage({ params, searchParams }: PlantPageProps) {
  const { userId } = await searchParams;
  if (!userId) {
    return <div className="p-8 text-center">User ID is required to view this plant.</div>;
  }
  const { id: plantId } = await params;
  const result = await getPlantById(userId, plantId);
  if (!result.ok) {
    notFound();
  }
  const plant: Plant = result.value;

  const needsWatering = !plant.nextWaterDue || (plant.nextWaterDue instanceof Date && plant.nextWaterDue.getTime() < Date.now());

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-green-100 flex flex-col gap-6">
        <div className="flex justify-start mb-2">
          <Link href={"/user/" + userId} className="inline-flex items-center justify-center rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-blue-700 font-medium hover:bg-blue-100 transition">
            ← Back to User
          </Link>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-5xl mb-2 shadow">
            🌱
          </span>
          <RenamePlant
            name={plant.name}
            plantId={plant.id}
            userId={userId}
          />
        </div>
        <div className={
          `${needsWatering ? "bg-yellow-50 border border-yellow-200" : "bg-green-50 border border-green-100"} p-4 rounded-lg`
        }>
          <LastWateredDisplay lastWaterEvent={plant.lastWaterEvent} nextWaterDue={plant.nextWaterDue} />
        </div>
        <div className="flex flex-col items-center w-full mt-2">
          <WaterPlantButton
            userId={Number(userId)}
            plantId={plant.id}
            size="lg"
            className="w-full px-4 py-2 font-medium"
            needsWatering={needsWatering}
          />
        </div>
      </div>
    </main>
  );
} 

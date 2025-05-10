import { notFound } from "next/navigation";
import { getPlantById, Plant } from "@/lib/services/plantsService/plantsService";
import LastWateredDisplay from "@/components/LastWateredDisplay";
import WaterPlantButton from "@/components/WaterPlantButton";
import Link from "next/link";

interface PlantPageProps {
  params: { id: string };
  searchParams?: { userId?: string };
}

export default async function PlantPage({ params, searchParams }: PlantPageProps) {
  const userId = searchParams?.userId;
  if (!userId) {
    return <div className="p-8 text-center">User ID is required to view this plant.</div>;
  }
  const plantId = params.id;
  const result = await getPlantById(userId, plantId);
  if (!result.ok) {
    notFound();
  }
  const plant: Plant = result.value;

  const needsWatering = !plant.nextWaterDue || (plant.nextWaterDue instanceof Date && plant.nextWaterDue.getTime() < Date.now());

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-green-100 flex flex-col">
        <div className="flex flex-col items-center mb-6">
          <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-5xl mb-2 shadow">
            🌱
          </span>
          <h1 className="text-3xl font-extrabold text-green-900 mb-1 tracking-tight">{plant.name}</h1>
        </div>
        <div className={
          `${needsWatering ? "bg-yellow-50 border border-yellow-200" : "bg-green-50 border border-green-100"} p-4 rounded-lg`
        }>
          <LastWateredDisplay lastWaterEvent={plant.lastWaterEvent} nextWaterDue={plant.nextWaterDue} />
        </div>
        <div className="flex items-end justify-between w-full mt-8">
          <Link href={"/user/" + userId} className="inline-flex items-center justify-center rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-blue-700 font-medium hover:bg-blue-100 transition">
            ← Back to User
          </Link>
          <WaterPlantButton
            userId={Number(userId)}
            plantId={plant.id}
            size="lg"
            className="px-4 py-2 font-medium"
            needsWatering={needsWatering}
          />
        </div>
      </div>
    </main>
  );
} 
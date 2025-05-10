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

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">{plant.name}</h1>
        <LastWateredDisplay lastWaterEvent={plant.lastWaterEvent} nextWaterDue={plant.nextWaterDue} />
        <div className="mt-6 flex gap-4">
          <WaterPlantButton userId={Number(userId)} plantId={plant.id} />
          <Link href={"/user/" + userId} className="text-blue-600 hover:underline">Back to User</Link>
        </div>
      </div>
    </main>
  );
} 
import NewPlantCard from "@/components/NewPlantCard";

interface Params {
  userId: number
}

export default async function NewPlantPage({ searchParams }: { searchParams: Promise<Params> }) {
  const { userId } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <NewPlantCard userId={userId} />
    </main>
  );
}

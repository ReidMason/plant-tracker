import NewPlantCard from "@/components/NewPlantCard";
import { ThemeToggle } from "@/components/theme-toggle";

interface Params {
  userId: number
}

export default async function NewPlantPage({ searchParams }: { searchParams: Promise<Params> }) {
  const { userId } = await searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl dark:bg-blue-500/10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl dark:bg-purple-500/10"></div>
      </div>
      
      {/* Theme toggle in top right */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>
      
      <main className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
        <NewPlantCard userId={userId} />
      </main>
    </div>
  );
}

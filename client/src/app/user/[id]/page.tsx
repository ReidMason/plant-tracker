import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, User, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import PlantListWithWatering from '@/components/PlantListWithWatering';
import { getUserById } from '@/lib/services/usersService/usersService';
import { getPlantsByUserId } from '@/lib/services/plantsService/plantsService';
import { ThemeToggle } from '@/components/theme-toggle';

function ErrorMessage({ message }: { message: string }) {
  return (
    <Alert variant="destructive" className="mb-6 max-w-lg mx-auto backdrop-blur-sm bg-red-50/80 border-red-200 dark:bg-red-900/20 dark:border-red-800">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Connection Error</AlertTitle>
      <AlertDescription>
        {message}
        <p className="mt-2 text-sm">Please check that the API server is running and try again.</p>
      </AlertDescription>
    </Alert>
  );
}

interface UserPageParams {
  id: string
}

export default async function UserPage({ params }: { params: Promise<UserPageParams> }) {
  const { id } = await params;
  const userResult = await getUserById(id);

  // If there's no data or the request failed, show 404 page
  if (!userResult.ok) {
    notFound();
  }

  const user = userResult.value;

  // Fetch plants for this user
  const plantsResult = await getPlantsByUserId(user.id);

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
        <div className="w-full max-w-5xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full shadow-sm dark:bg-gray-800/60">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Plant Tracker</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2 dark:from-blue-400 dark:via-purple-400 dark:to-blue-600">
              {user.name}'s Profile
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Manage plants and track watering schedules
            </p>
          </div>

          {/* Main Content Card */}
          <Card className="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl dark:bg-gray-800/95 dark:border-gray-700/50">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <UserAvatar user={user} size="lg" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/10 to-purple-500/10"></div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{user.name}</CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">Plant Collection Manager</CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-8">
              {!plantsResult.ok && <ErrorMessage message={plantsResult.error.message} />}

              {plantsResult.ok && (
                <PlantListWithWatering plants={plantsResult.value} userId={user.id} />
              )}
            </CardContent>

            <div className="border-t border-gray-200/50 px-6 py-6 bg-gray-50/50 backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-700/20">
              <div className="flex justify-between items-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <Home className="w-4 h-4" />
                  Back to Dashboard
                </Link>
                
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  User ID: {user.id}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
} 

"use client";

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, User, Sparkles, Sprout, Users } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import PlantListWithWatering from '@/components/PlantListWithWatering';
import { getUserById, User as UserType } from '@/lib/services/usersService/usersService';
import { getPlantsByUserId, Plant } from '@/lib/services/plantsService/plantsService';
import { ThemeToggle } from '@/components/theme-toggle';
import { useState, useEffect } from 'react';

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

export default function UserPage({ params }: { params: Promise<UserPageParams> }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const { id } = await params;
        const userResult = await getUserById(id);

        if (!userResult.ok) {
          setError("User not found");
          setLoading(false);
          return;
        }

        setUser(userResult.value);

        // Fetch plants for this user
        const plantsResult = await getPlantsByUserId(userResult.value.id);
        if (plantsResult.ok) {
          setPlants(plantsResult.value);
        } else {
          setError(plantsResult.error.message);
        }

        setLoading(false);
      } catch {
        setError("Failed to load user data");
        setLoading(false);
      }
    }

    loadData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-8">
        <Card className="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl dark:bg-gray-800/95 dark:border-gray-700/50 max-w-md">
          <CardContent className="p-8 text-center">
            {/* Animated user icon with plants */}
            <div className="relative w-20 h-20 mx-auto mb-6">
              {/* Main user circle */}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-spin">
                <Users className="w-10 h-10 text-white" />
              </div>

              {/* Orbiting plants */}
              <div className="absolute inset-0 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}>
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-md">
                    <Sprout className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="absolute top-1/2 -right-2 transform -translate-y-1/2">
                  <div className="w-5 h-5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
                    <Sprout className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-4 h-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-md">
                    <Sprout className="w-2 h-2 text-white" />
                  </div>
                </div>
                <div className="absolute top-1/2 -left-2 transform -translate-y-1/2">
                  <div className="w-5 h-5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
                    <Sprout className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-2 dark:text-gray-100">Loading Profile...</h2>
            <p className="text-gray-600 dark:text-gray-400">Fetching user data and plant collection</p>

            {/* Loading dots */}
            <div className="flex justify-center gap-1 mt-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-8">
        <Card className="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl dark:bg-gray-800/95 dark:border-gray-700/50 max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 dark:text-gray-100">Error Loading Profile</h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    notFound();
  }

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
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2 dark:from-blue-400 dark:via-purple-400 dark:to-blue-600 capitalize">
              {user.name}&apos;s Profile
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
                <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200 capitalize">{user.name}</CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">Plant Collection Manager</CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-8">
              {error && <ErrorMessage message={error} />}

              {plants && (
                <PlantListWithWatering plants={plants} userId={user.id} />
              )}
            </CardContent>

            <div className="border-t border-gray-200/50 px-6 pt-6 backdrop-blur-sm dark:border-gray-700/50">
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

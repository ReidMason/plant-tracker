"use client";

import { notFound } from "next/navigation";
import { getPlantById, Plant } from "@/lib/services/plantsService/plantsService";
import LastWateredDisplay from "@/components/LastWateredDisplay";
import LastFertilizedDisplay from "@/components/LastFertilizedDisplay";
import WaterPlantButton from "@/components/WaterPlantButton";
import FertilizePlantButton from "@/components/FertilizePlantButton";
import WaterDropletAnimation from "@/components/WaterDropletAnimation";
import FertilizerSparkleAnimation from "@/components/FertilizerSparkleAnimation";
import Link from "next/link";
import RenamePlant from "@/components/RenamePlant";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, Sprout, Sparkles, Droplets, Calendar, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

interface PlantPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ userId: string }>;
}

export default function PlantPage({ params, searchParams }: PlantPageProps) {
  const [userId, setUserId] = useState<string>("");
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState<'water' | 'fertilizer'>('water');

  useEffect(() => {
    async function loadData() {
      try {
        const resolvedParams = await params;
        const resolvedSearchParams = await searchParams;

        setUserId(resolvedSearchParams.userId);

        if (!resolvedSearchParams.userId) {
          setError("User ID is required to view this plant.");
          setLoading(false);
          return;
        }

        const result = await getPlantById(resolvedSearchParams.userId, resolvedParams.id);
        if (!result.ok) {
          setError("Plant not found");
          setLoading(false);
          return;
        }

        setPlant(result.value);
        setLoading(false);
      } catch {
        setError("Failed to load plant data");
        setLoading(false);
      }
    }

    loadData();
  }, [params, searchParams]);

  const refreshPlantData = async () => {
    if (!userId || !plant) return;
    
    try {
      const resolvedParams = await params;
      const result = await getPlantById(userId, resolvedParams.id);
      if (result.ok) {
        setPlant(result.value);
      }
    } catch (error) {
      console.error("Failed to refresh plant data:", error);
    }
  };

  const handleWateringClick = () => {
    setIsAnimating(true);
    setAnimationType('water');
  };

  const handleFertilizerClick = () => {
    setIsAnimating(true);
    setAnimationType('fertilizer');
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-8">
        <Card className="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl dark:bg-gray-800/95 dark:border-gray-700/50 max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 dark:text-gray-100">Loading Plant...</h2>
            <p className="text-gray-600 dark:text-gray-400">Please wait while we fetch your plant data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-8">
        <Card className="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl dark:bg-gray-800/95 dark:border-gray-700/50 max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 dark:text-gray-100">
              {error || "Missing User ID"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {error || "User ID is required to view this plant."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!plant) {
    notFound();
  }

  const needsWatering = !plant.nextWaterDue || (plant.nextWaterDue instanceof Date && plant.nextWaterDue.getTime() < Date.now());
  const needsFertilizer = !plant.nextFertilizerDue || (plant.nextFertilizerDue instanceof Date && plant.nextFertilizerDue.getTime() < Date.now());

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl dark:bg-emerald-500/10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-200/20 rounded-full blur-3xl dark:bg-green-500/10"></div>
      </div>

      {/* Theme toggle in top right */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <main className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full shadow-sm dark:bg-gray-800/60">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Plant Tracker</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-800 bg-clip-text text-transparent mb-2 dark:from-emerald-400 dark:via-green-400 dark:to-emerald-600">
              Plant Details
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Manage your plant&apos;s care, watering, and fertilizing schedule
            </p>
          </div>

          {/* Main Plant Card */}
          <Card className="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl dark:bg-gray-800/95 dark:border-gray-700/50 relative">
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

            <CardHeader className="text-center pb-3">
              {/* Back Button */}
              <div className="flex justify-start mb-6">
                <Link
                  href={"/user/" + userId}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-all duration-200 dark:bg-gray-700/50 dark:border-emerald-700/50 dark:hover:bg-gray-700 dark:text-gray-200 text-emerald-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Profile
                </Link>
              </div>

              {/* Plant Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <Sprout className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Plant Name */}
              <div>
                <RenamePlant
                  name={plant.name}
                  plantId={plant.id}
                  userId={userId}
                />
              </div>
            </CardHeader>

            <CardContent className="px-6 pb-8 pt-3 space-y-6">
              {/* Watering Status */}
              <div className={`p-6 rounded-xl border ${needsWatering
                ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-700/30'
                : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 dark:from-emerald-900/20 dark:to-green-900/20 dark:border-emerald-700/30'
                }`}>
                <div className="flex items-start gap-3">
                  {needsWatering ? (
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Droplets className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className={`font-semibold mb-2 ${needsWatering
                      ? 'text-amber-800 dark:text-amber-300'
                      : 'text-emerald-800 dark:text-emerald-300'
                      }`}>
                      {needsWatering ? 'Watering Needed' : 'Watering Status'}
                    </h3>
                    <div className="text-gray-700 dark:text-gray-300">
                      <LastWateredDisplay
                        lastWaterEvent={plant.lastWaterEvent}
                        nextWaterDue={plant.nextWaterDue}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fertilizer Status */}
              <div className={`p-6 rounded-xl border ${needsFertilizer
                ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 dark:from-yellow-900/20 dark:to-amber-900/20 dark:border-yellow-700/30'
                : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 dark:from-emerald-900/20 dark:to-green-900/20 dark:border-emerald-700/30'
                }`}>
                <div className="flex items-start gap-3">
                  {needsFertilizer ? (
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className={`font-semibold mb-2 ${needsFertilizer
                      ? 'text-yellow-800 dark:text-yellow-300'
                      : 'text-emerald-800 dark:text-emerald-300'
                      }`}>
                      {needsFertilizer ? 'Fertilizer Needed' : 'Fertilizer Status'}
                    </h3>
                    <div className="text-gray-700 dark:text-gray-300">
                      <LastFertilizedDisplay
                        lastFertilizerEvent={plant.lastFertilizerEvent}
                        nextFertilizerDue={plant.nextFertilizerDue}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 grid grid-cols-2 gap-4">
                <WaterPlantButton
                  userId={Number(userId)}
                  plantId={plant.id}
                  onClick={handleWateringClick}
                  onSuccess={refreshPlantData}
                  size="lg"
                  className={`py-4 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${needsWatering
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700'
                    : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'
                    }`}
                  needsWatering={needsWatering}
                />
                
                <FertilizePlantButton
                  userId={Number(userId)}
                  plantId={plant.id}
                  onClick={handleFertilizerClick}
                  onSuccess={refreshPlantData}
                  size="lg"
                  needsFertilizer={needsFertilizer}
                  className="py-4 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowLeft, Loader2, Sprout, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createPlant } from "@/lib/services/plantsService/plantsService";

export default function NewPlantCard({ userId }: { userId: number }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Ensure we have a userId
    if (!userId) {
      setError("User ID is required. Please go back and try again.");
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setError("User ID is required. Please go back and try again.");
      return;
    }

    if (!name.trim()) {
      setError("Plant name is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createPlant(userId, { name });

      if (!result.ok) {
        throw new Error(result.error.message);
      }

      // Navigate back to the user detail page
      router.push(`/user/${userId}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full shadow-sm dark:bg-gray-800/60">
          <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Plant Tracker</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-800 bg-clip-text text-transparent mb-2 dark:from-emerald-400 dark:via-green-400 dark:to-emerald-600">
          Add New Plant
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Start tracking a new plant in your collection
        </p>
      </div>

      <Card className="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl dark:bg-gray-800/95 dark:border-gray-700/50 flex flex-col">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <Sprout className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Plant Details</CardTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Give your new plant a name to get started</p>
        </CardHeader>

        <CardContent className="px-6 pb-4 flex-1">
          {error && (
            <Alert variant="destructive" className="mb-6 backdrop-blur-sm bg-red-50/80 border-red-200 dark:bg-red-900/20 dark:border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Plant Name *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Monstera Deliciosa, Peace Lily..."
                autoFocus
                className="bg-white/70 backdrop-blur-sm border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 dark:bg-gray-700/50 dark:border-gray-600 dark:focus:border-emerald-500 dark:text-gray-200 dark:placeholder-gray-400"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Choose a name that helps you identify this plant
              </p>
            </div>
          </form>
        </CardContent>

        <CardFooter>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button 
              variant="outline" 
              asChild 
              className="flex-1 bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200"
            >
              <Link href={userId ? `/user/${userId}` : '/'}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Link>
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !userId || !name.trim()}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium hover:from-emerald-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sprout className="mr-2 h-4 w-4" />
                  Create Plant
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import plantsService from "../../../lib/services/plantsService";

export default function NewPlantPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

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
      const result = await plantsService.createPlant({ 
        name, 
        userId: parseInt(userId)
      });
      
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      // Navigate back to the user detail page
      router.push(`/user/${userId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Add New Plant</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Plant Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Enter plant name"
              autoFocus
            />
          </div>
          
          <div className="flex justify-between pt-4">
            <Link
              href={userId ? `/user/${userId}` : '/'}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !userId}
              className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition ${
                (isSubmitting || !userId) ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Creating..." : "Create Plant"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
} 
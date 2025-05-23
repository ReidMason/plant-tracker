"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
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
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Add New Plant</CardTitle>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Plant Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter plant name"
              autoFocus
            />
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={userId ? `/user/${userId}` : '/'}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Link>
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !userId}
          variant="default"
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Plant'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

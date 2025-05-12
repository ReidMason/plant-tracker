import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import PlantListWithWatering from '@/components/PlantListWithWatering';
import { getUserById } from '@/lib/services/usersService/usersService';
import { getPlantsByUserId } from '@/lib/services/plantsService/plantsService';

function ErrorMessage({ message }: { message: string }) {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {message}
        <p className="mt-2">Please check that the API server is running</p>
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
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <Card className="max-w-3xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <UserAvatar user={user} size="lg" />
          </div>
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <CardDescription>User Profile</CardDescription>
        </CardHeader>

        <CardContent>
          {!plantsResult.ok && <ErrorMessage message={plantsResult.error.message} />}

          {plantsResult.ok && (
            <PlantListWithWatering plants={plantsResult.value} userId={user.id} />
          )}
        </CardContent>

        <div className="flex justify-between px-6 pt-6 border-t">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <Home className="mr-2 h-4 w-4" />
            Back
          </Link>
        </div>
      </Card>
    </main>
  );
} 

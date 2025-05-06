import Link from 'next/link';
import { notFound } from 'next/navigation';
import usersService from '../../../lib/services/usersService';
import plantsService from '../../../lib/services/plantsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import PlantListWithWatering from '@/components/PlantListWithWatering';

function ErrorMessage({ message }: { message: string }) {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {message}
        <p className="mt-2">Please check that the API server is running at http://localhost:8080</p>
      </AlertDescription>
    </Alert>
  );
}

export default async function UserPage({ params }: { params: { id: string } }) {
  const {id} = await params;
  const userResult = await usersService.getUserById(id);
  
  // If there's no data or the request failed, show 404 page
  if (!userResult.ok) {
    notFound();
  }
  
  const user = userResult.value;
  
  // Fetch plants for this user
  const plantsResult = await plantsService.getPlantsByUserId(user.id);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <Card className="max-w-md w-full">
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
        
        <div className="flex justify-between px-6 py-4 border-t">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <Home className="mr-2 h-4 w-4" />
            Back
          </Link>
          <Link 
            href={`/plant/new?userId=${user.id}`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Plant
          </Link>
        </div>
      </Card>
    </main>
  );
} 

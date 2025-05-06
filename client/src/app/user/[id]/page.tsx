import Link from 'next/link';
import { notFound } from 'next/navigation';
import usersService from '../../../lib/services/usersService';
import plantsService, { Plant } from '../../../lib/services/plantsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertCircle, Home, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Generate a vibrant color based on the plant id
function getColorForPlant(plantId: number) {
  const colors = [
    "bg-green-200",
    "bg-green-300",
    "bg-emerald-200",
    "bg-teal-200",
    "bg-cyan-200",
    "bg-lime-200",
    "bg-yellow-200",
    "bg-amber-200",
  ];
  
  return colors[plantId % colors.length];
}

function PlantsList({ plants }: { plants: Plant[] }) {
  if (plants.length === 0) {
    return (
      <div className="text-center text-muted-foreground my-6">
        No plants found for this user.
      </div>
    );
  }

  return (
    <div className="space-y-3 my-6">
      <h2 className="text-lg font-semibold mb-4">Plants</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {plants.map((plant) => (
          <Card 
            key={plant.id} 
            className="flex items-center p-3 hover:shadow-md transition-shadow"
          >
            <Avatar className={`${getColorForPlant(plant.id)} mr-3`}>
              <AvatarFallback>{plant.id}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{plant.name}</h3>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

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
            <Avatar className="w-24 h-24" style={{ backgroundColor: user.colour }}>
              <AvatarFallback className="text-white text-3xl font-bold">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <CardDescription>User Profile</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Card className="bg-muted/40">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">ID:</span>
                  <span>{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{user.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {!plantsResult.ok && <ErrorMessage message={plantsResult.error.message} />}
          
          {plantsResult.ok && <PlantsList plants={plantsResult.value} />}
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

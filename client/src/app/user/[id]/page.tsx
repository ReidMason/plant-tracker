import Link from 'next/link';
import { notFound } from 'next/navigation';
import usersService from '../../../lib/services/usersService';
import plantsService, { Plant } from '../../../lib/services/plantsService';
import { Result } from '../../../lib/services/api';

// Generate a vibrant color based on the user id
function getColorForUser(userId: number) {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  
  return colors[userId % colors.length];
}

// Generate a pastel color based on the plant id
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

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6 w-full" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
      <p className="mt-2">Please check that the API server is running at http://localhost:8080</p>
    </div>
  );
}

function PlantsList({ plants }: { plants: Plant[] }) {
  if (plants.length === 0) {
    return (
      <div className="text-center text-gray-500 my-6">
        No plants found for this user.
      </div>
    );
  }

  return (
    <div className="space-y-3 my-6">
      <h2 className="text-lg font-semibold mb-4">Plants</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {plants.map((plant) => (
          <div 
            key={plant.id} 
            className="flex items-center p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className={`${getColorForPlant(plant.id)} w-10 h-10 rounded-full flex items-center justify-center mr-3`}>
              <span className="text-sm">{plant.id}</span>
            </div>
            <div>
              <h3 className="font-medium">{plant.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function UserPage({ params }: { params: { id: string } }) {
  const userResult = await usersService.getUserById(params.id);
  
  // If there's no data or the request failed, show 404 page
  if (!userResult.ok) {
    notFound();
  }
  
  const user = userResult.value;
  
  // Fetch plants for this user
  const plantsResult = await plantsService.getPlantsByUserId(user.id);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden p-6">
        <div className="flex justify-center mb-6">
          <div 
            className={`${getColorForUser(user.id)} w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold`}
          >
            {user.name.charAt(0)}
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">{user.name}</h1>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">User Details</h2>
          <p><span className="font-medium">ID:</span> {user.id}</p>
          <p><span className="font-medium">Name:</span> {user.name}</p>
        </div>
        
        {!plantsResult.ok && <ErrorMessage message={plantsResult.error.message} />}
        
        {plantsResult.ok && <PlantsList plants={plantsResult.value} />}
        
        <div className="flex justify-between">
          <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Back to Users
          </Link>
          <Link 
            href={`/plant/new?userId=${user.id}`} 
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Add Plant
          </Link>
        </div>
      </div>
    </main>
  );
} 

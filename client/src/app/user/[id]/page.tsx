import Link from 'next/link';
import { notFound } from 'next/navigation';
import usersService from '../../../lib/services/usersService';

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

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6 w-full" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
      <p className="mt-2">Please check that the API server is running at http://localhost:8080</p>
    </div>
  );
}

export default async function UserPage({ params }: { params: { id: string } }) {
  const result = await usersService.getUserById(params.id);
  
  // If there's no data, show 404 page
  if (!result.data) {
    notFound();
  }
  
  const user = result.data;
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden p-6">
        {result.error && <ErrorMessage message={result.error} />}
        
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
        
        <div className="flex justify-center">
          <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Back to Users
          </Link>
        </div>
      </div>
    </main>
  );
} 

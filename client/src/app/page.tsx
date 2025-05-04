import { Suspense } from "react";
import Link from "next/link";
import usersService, { User } from "../lib/services/usersService";

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

function UserList({ users }: { users: User[] }) {
  if (users.length === 0) {
    return <div className="text-lg text-gray-500">No users found.</div>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-8 max-w-3xl">
      {users.map((user) => (
        <Link 
          href={`/user/${user.id}`} 
          key={user.id}
          className="flex flex-col items-center group transition-transform hover:scale-105"
        >
          <div 
            className={`${getColorForUser(user.id)} w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold transition-shadow group-hover:shadow-lg`}
          >
            {user.name.charAt(0)}
          </div>
          <span className="mt-2 text-center group-hover:font-medium">{user.name}</span>
        </Link>
      ))}
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6 max-w-lg" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
      <p className="mt-2">Please check that the API server is running at http://localhost:8080</p>
    </div>
  );
}

export default async function Home() {
  const result = await usersService.getUsers();
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-8">User Directory</h1>
      
      {result.error && <ErrorMessage message={result.error} />}
      
      <Suspense fallback={<div className="text-xl">Loading users...</div>}>
        {result.data && <UserList users={result.data} />}
      </Suspense>
    </main>
  );
}

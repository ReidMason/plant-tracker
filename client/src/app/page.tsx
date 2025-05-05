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
      
      {/* Add user button */}
      <Link 
        href="/user/new" 
        className="flex flex-col items-center group transition-transform hover:scale-105"
      >
        <div 
          className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center text-gray-600 text-xl font-bold transition-shadow group-hover:shadow-lg group-hover:bg-gray-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <span className="mt-2 text-center group-hover:font-medium">Add User</span>
      </Link>
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
      
      {!result.ok && <ErrorMessage message={result.error.message} />}
      
      <Suspense fallback={<div className="text-xl">Loading users...</div>}>
        {result.ok && <UserList users={result.value} />}
      </Suspense>
    </main>
  );
}

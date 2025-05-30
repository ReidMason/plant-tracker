import { Suspense } from "react";
import Link from "next/link";
import { getUsers, User } from "../lib/services/usersService/usersService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertCircle, Plus, Users, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import UserAvatar from "@/components/UserAvatar";

export const dynamic = 'force-dynamic'

function UserList({ users }: { users: User[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
      {users.map((user) => (
        <Link
          href={`/user/${user.id}`}
          key={user.id}
          className="group"
        >
          <Card className="h-full bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:border-blue-200">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <UserAvatar user={user} />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {user.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">Plant Tracker</p>
            </CardContent>
          </Card>
        </Link>
      ))}

      <Link
        href="/user/new"
        className="group"
      >
        <Card className="h-full bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-200 hover:border-blue-400 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 hover:-translate-y-2">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center min-h-[140px]">
            <div className="relative mb-4">
              <Avatar className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 group-hover:shadow-lg transition-all duration-300">
                <AvatarFallback className="text-white bg-transparent">
                  <Plus className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <h3 className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
              Add New User
            </h3>
            <p className="text-sm text-gray-500 mt-1">Start tracking plants</p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <Alert variant="destructive" className="mb-6 max-w-lg mx-auto backdrop-blur-sm bg-red-50/80 border-red-200">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Connection Error</AlertTitle>
      <AlertDescription>
        {message}
        <p className="mt-2 text-sm">Please check that the API server is running and try again.</p>
      </AlertDescription>
    </Alert>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-purple-400 rounded-full animate-spin animate-reverse"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
    </div>
  );
}

export default async function Home() {
  const result = await getUsers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>
      
      <main className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full shadow-sm">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Plant Tracker</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
              Users Dashboard
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Manage users and track plant collections with ease
            </p>
          </div>

          {/* Main Content Card */}
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-2xl font-semibold text-gray-800">Registered Users</CardTitle>
              </div>
              <p className="text-gray-600">View and manage all plant tracking users</p>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              {!result.ok && <ErrorMessage message={result.error.message} />}

              <Suspense fallback={<LoadingSpinner />}>
                {result.ok && <UserList users={result.value} />}
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

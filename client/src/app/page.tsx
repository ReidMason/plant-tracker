import { Suspense } from "react";
import Link from "next/link";
import { getUsers, User } from "../lib/services/usersService/usersService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertCircle, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import UserAvatar from "@/components/UserAvatar";

export const dynamic = 'force-dynamic'

function UserList({ users }: { users: User[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-8">
      {users.map((user) => (
        <Link
          href={`/user/${user.id}`}
          key={user.id}
          className="flex flex-col items-center group transition-transform hover:scale-105"
        >
          <UserAvatar user={user} />
          <span className="mt-2 text-center group-hover:font-medium">{user.name}</span>
        </Link>
      ))}

      <Link
        href="/user/new"
        className="flex flex-col items-center group transition-transform hover:scale-105"
      >
        <Avatar className="bg-muted w-16 h-16 transition-shadow group-hover:shadow-lg group-hover:bg-muted/80">
          <AvatarFallback className="text-muted-foreground">
            <Plus className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <span className="mt-2 text-center group-hover:font-medium">Add User</span>
      </Link>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <Alert variant="destructive" className="mb-6 max-w-lg">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {message}
        <p className="mt-2">Please check that the API server is running</p>
      </AlertDescription>
    </Alert>
  );
}

export default async function Home() {
  const result = await getUsers();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center">User Directory</CardTitle>
        </CardHeader>
        <CardContent>
          {!result.ok && <ErrorMessage message={result.error.message} />}

          <Suspense fallback={<div className="text-xl text-center">Loading users...</div>}>
            {result.ok && <UserList users={result.value} />}
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}

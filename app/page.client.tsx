"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>Welcome to My App</h1>
      {session ? (
        <>
          <p>Signed in as {session.user?.email}</p>
          <Link href="/admin">Go to Admin Dashboard</Link>
        </>
      ) : (
        <Link href="api/auth/signin">Sign in to Admin Dashboard</Link>
      )}
    </div>
  );
}

"use client";

import '../../../globals.css'
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

export default function SignIn() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    signIn("google", { callbackUrl: "/admin" }).catch(() =>
      setError("Failed to start sign-in process. Please try again.")
    );
  }, []);

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={() => signIn("google", { callbackUrl: "/admin" })}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center my-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

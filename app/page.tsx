import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen font-sans">
        <h1 className="text-4xl font-bold mb-4">Better Auth</h1>
        <p className="mb-5">
          This is practice project for Better Auth. It is a simple project that
          uses Better Auth to Authenticate users.
        </p>

        <div className="flex gap-4">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
          <Link href="/signup">
            <Button>Signup</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
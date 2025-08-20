"use client";
import AuthPage from "@/components/auth";

export default function Home() {
  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen bg-no-repeat bg-cover  "
      style={{ backgroundImage: `url("/pfor.jpg")` }}
    >
      <AuthPage />
    </div>
  );
}

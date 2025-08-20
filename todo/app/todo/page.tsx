"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Todo_Main from "@/components/ui/Todo_Main";

export default function TodoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Todo_Main />
    </div>
  );
}

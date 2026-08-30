"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function QuizPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/create");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ku-crimson" />
    </div>
  );
}

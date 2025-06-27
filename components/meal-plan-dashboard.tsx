// app/generate-mealplan/page.tsx

"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function GenerateMealPlanPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    console.log("✅ /generate-mealplan page rendered");
    console.log("💡 Stripe session_id:", sessionId);
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Meal Plan Page Loaded
        </h1>
        <p className="text-gray-700">
          If you see this, the route is working.
        </p>
        {sessionId ? (
          <p className="text-sm text-blue-600 mt-2">
            Stripe Session ID: <span className="font-mono">{sessionId}</span>
          </p>
        ) : (
          <p className="text-sm text-red-500 mt-2">No session_id in URL</p>
        )}
      </div>
    </div>
  );
}

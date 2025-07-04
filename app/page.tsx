"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export default function HomePage() {
  const [todos, setTodos] = useState<any[]>([]);
  const [meal, setMeal] = useState<Meal | null>(null);
  const [aiMeal, setAiMeal] = useState<string | null>(null);
  const [loadingMeal, setLoadingMeal] = useState(false);
  const [loadingAiMeal, setLoadingAiMeal] = useState(false);

  // Fetch todos from Supabase
  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase.from("todos").select("*");
      if (error) console.error(error);
      else setTodos(data ?? []);
    };

    fetchTodos();
  }, []);

  // Fetch a random meal from TheMealDB
  const fetchRandomMeal = async () => {
    setLoadingMeal(true);
    try {
      const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
      const data = await res.json();
      if (data.meals && data.meals.length > 0) {
        const mealData = data.meals[0];
        setMeal({
          idMeal: mealData.idMeal,
          strMeal: mealData.strMeal,
          strMealThumb: mealData.strMealThumb,
        });
      }
    } catch (error) {
      console.error("Failed to fetch meal:", error);
    } finally {
      setLoadingMeal(false);
    }
  };

  // Updated fetch AI-generated healthy meal
  const fetchAiMeal = async () => {
    setLoadingAiMeal(true);
    try {
      const res = await fetch("/api/ai-meal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // MUST set this
        },
        body: JSON.stringify({
          prompt: "Suggest a healthy meal idea for me.", // send a prompt for AI
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }

      const data = await res.json();
      setAiMeal(data.result); // Use `result` because your API returns { result: "...response..." }
    } catch (error) {
      console.error("Failed to fetch AI meal:", error);
      setAiMeal("Failed to get AI meal suggestion.");
    } finally {
      setLoadingAiMeal(false);
    }
  };

  useEffect(() => {
    fetchRandomMeal();
    fetchAiMeal();
  }, []);

  return (
    <div className="px-4 py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white rounded-lg mb-12 p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Personalized AI Meal Plans</h1>
        <p className="text-xl mb-6">
          Let our AI do the planning. You focus on cooking and enjoying!
        </p>
        <Link
          href="/sign-up"
          className="inline-block bg-white text-emerald-500 font-medium px-5 py-3 rounded hover:bg-gray-100 transition-colors"
        >
          Get Started
        </Link>
      </section>

      {/* TheMealDB Image Suggestion */}
      <section className="mb-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Random Meal Inspiration 🍽️</h2>
        <p className="text-gray-600 mb-4">
          Here's something tasty suggested by our image engine.
        </p>
        <div className="flex justify-center mb-4">
          {loadingMeal ? (
            <p>Loading image...</p>
          ) : meal ? (
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="rounded-lg shadow-lg max-w-full h-auto"
            />
          ) : (
            <p>Could not load meal.</p>
          )}
        </div>
        <button
          onClick={fetchRandomMeal}
          className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition-colors"
        >
          Show Another Dish
        </button>
      </section>

      {/* AI-generated Text Meal Suggestion */}
      <section className="mb-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">AI Healthy Meal Suggestion 🧠🥗</h2>
        <p className="text-gray-600 mb-4">AI recommends this for your next healthy meal:</p>
        <div className="bg-gray-100 p-4 rounded-lg max-w-xl mx-auto shadow text-left whitespace-pre-wrap">
          {loadingAiMeal ? (
            <p>Loading AI meal...</p>
          ) : aiMeal ? (
            aiMeal
          ) : (
            <p>No suggestion found.</p>
          )}
        </div>
        <button
          onClick={fetchAiMeal}
          className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition-colors"
        >
          Get New Suggestion
        </button>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold">How It Works</h2>
          <p className="mt-2 text-gray-600">
            Follow these simple steps to get your personalized meal plan
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-start space-y-8 md:space-y-0 md:space-x-8">
          <StepCard
            title="Create an Account"
            description="Sign up or sign in to access your personalized meal plans."
            iconPath="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14v7m-3-3h6"
          />
          <StepCard
            title="Set Your Preferences"
            description="Input your dietary preferences and goals to tailor your meal plans."
            iconPath="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6 M9 12h6"
          />
          <StepCard
            title="Receive Your Meal Plan"
            description="Get your customized meal plan delivered weekly to your account."
            iconPath="M5 13l4 4L19 7"
          />
        </div>
      </section>

      {/* Your Todos Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Your Todos</h2>
        {todos.length === 0 ? (
          <p className="text-gray-600">No todos yet.</p>
        ) : (
          <ul className="list-disc list-inside">
            {todos.map((todo) => (
              <li key={todo.id} className="mb-1">
                {todo.task} {todo.is_complete ? "(Done)" : ""}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

// Step Card Component
function StepCard({
  title,
  description,
  iconPath,
}: {
  title: string;
  description: string;
  iconPath: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-emerald-500 text-white rounded-full h-16 w-16 flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
        </svg>
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-center text-gray-600">{description}</p>
    </div>
  );
}

import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "", // Make sure your .env file has this key set
});

export async function POST(req: Request) {
  const body = await req.json();
  const prompt = body.prompt || "Give me a healthy dinner idea.";

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful meal planner." },
        { role: "user", content: prompt },
      ],
    });

    const result = chatCompletion.choices[0]?.message?.content;
    return NextResponse.json({ result });
  } catch (error) {
    console.error("❌ AI API error:", error);

    // ✅ Fallback meal if quota error, bad key, etc.
    const fallbackMessage = "Grilled chicken with quinoa and roasted vegetables.";
    return NextResponse.json({
      result: fallbackMessage,
      error: "AI quota exceeded. Showing fallback meal.",
    });
  }
}

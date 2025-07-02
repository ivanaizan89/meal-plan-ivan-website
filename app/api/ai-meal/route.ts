import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "", // Ensure this is set in your .env
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body.prompt || "Give me a healthy dinner idea.";

    console.log("📥 Prompt received:", prompt);

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful meal planner." },
        { role: "user", content: prompt },
      ],
    });

    const result = chatCompletion.choices[0]?.message?.content;
    console.log("✅ AI response:", result);

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("❌ AI API error:", error);

    // Fallback in case of API error
    const fallback = "Grilled chicken with quinoa and roasted vegetables.";
    return NextResponse.json(
      {
        result: fallback,
        error: "AI API failed. Showing fallback meal.",
      },
      { status: 200 }
    );
  }
}

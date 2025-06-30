import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

console.log("ENV KEY:", process.env.OPENROUTER_API_KEY); // ✅ Logs to terminal

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, // ✅ Loaded from .env.local
});


export async function POST(request: NextRequest) {
  let body: { prompt?: string };
  try {
    body = await request.json();
  } catch (error) {
    console.error("❌ Invalid or missing JSON:", error);
    return NextResponse.json(
      { error: "Invalid or missing JSON body" },
      { status: 400 }
    );
  }

  if (!body.prompt || typeof body.prompt !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid prompt" },
      { status: 400 }
    );
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo", // cheaper model
      messages: [
        { role: "system", content: "You are a helpful meal planner." },
        { role: "user", content: body.prompt },
      ],
    });

    const result = chatCompletion.choices[0].message?.content ?? "";

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("OpenAI API error:", error);

    // Handle 402 Payment Required explicitly
    if (error.status === 402) {
      return NextResponse.json(
        { error: "Payment required. Please check your API billing." },
        { status: 402 }
      );
    }

    // Generic server error fallback
    return NextResponse.json(
      { error: "Failed to generate AI meal suggestion." },
      { status: 500 }
    );
  }
}

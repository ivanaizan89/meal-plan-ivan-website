import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant that suggests healthy meals." },
        { role: "user", content: "Suggest a healthy meal for me." },
      ],
    });

    return NextResponse.json({ result: completion.choices[0].message });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch AI meal suggestion" }, { status: 500 });
  }
}

// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getPriceIdFromType } from "@/lib/plans";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { planType, userId } = body;

  const priceId = getPriceIdFromType(planType);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: {
      clerkUserId: userId, // or however you're tracking users
      planType,
    },
    success_url: "https://your-site.com/success",
    cancel_url: "https://your-site.com/cancel",
  });

  return NextResponse.json({ url: session.url });
}

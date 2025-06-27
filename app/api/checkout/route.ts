import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getPriceIdFromType } from "@/lib/plans";

export async function POST(request: NextRequest) {
  try {
    const { planType, userId, email } = await request.json();

    // Validate input
    if (!planType || !userId || !email) {
      return NextResponse.json(
        { error: "Plan type, User ID, and Email are required." },
        { status: 400 }
      );
    }

    // Validate plan type
    const allowedPlanTypes = ["week", "month", "year"];
    if (!allowedPlanTypes.includes(planType)) {
      return NextResponse.json(
        { error: "Invalid plan type." },
        { status: 400 }
      );
    }

    // Get price ID based on plan type
    const priceId = getPriceIdFromType(planType);
    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID for the selected plan not found." },
        { status: 400 }
      );
    }

    // Get base URL from environment
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { error: "Base URL is not defined in environment variables." },
        { status: 500 }
      );
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      mode: "subscription",
      metadata: {
        clerkUserId: userId,
        planType,
      },
      success_url: `${baseUrl}/generate-mealplan?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
    });

    // Return session URL to redirect
    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("Checkout API Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

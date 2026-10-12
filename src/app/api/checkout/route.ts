import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// This requires a STRIPE_SECRET_KEY in your .env.local file
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key', {
  apiVersion: '2024-06-20' as any,
});

export async function POST(req: Request) {
  try {
    const { items, orderId } = await req.json();

    if (!items || items.length === 0) {
      return new NextResponse("No items in cart", { status: 400 });
    }

    // Determine active site origin
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://dexhaus-gray.vercel.app';

    // In a real app with real Stripe keys, you create a Stripe Checkout Session
    if (process.env.STRIPE_SECRET_KEY) {
      const line_items = items.map((item: any) => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.title,
            images: [item.image.startsWith('http') ? item.image : `${origin}${item.image}`],
          },
          unit_amount: item.price * 100, // Stripe expects amounts in the smallest currency unit (paise)
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId || ''}`,
        cancel_url: `${origin}`,
      });

      return NextResponse.json({ url: session.url });
    } else {
      // Direct simulation mode
      return NextResponse.json({ url: `/success?order_id=${orderId || 'DX-CONFIRMED'}&simulated=true` });
    }

  } catch (error: any) {
    console.error("Stripe Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

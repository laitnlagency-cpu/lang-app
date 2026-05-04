import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { action, userId } = await request.json()

    if (action === 'create-checkout') {
      // Get or create Stripe customer
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('user_id', userId)
        .single()

      let customerId = sub?.stripe_customer_id

      if (!customerId) {
        const { data: user } = await supabase
          .auth.admin.getUserById(userId)
        
        const customer = await stripe.customers.create({
          email: user?.user?.email,
          metadata: { userId },
        })
        customerId = customer.id
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
          {
            price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment?canceled=true`,
      })

      return NextResponse.json({ url: session.url })
    }

    if (action === 'webhook') {
      const sig = request.headers.get('stripe-signature')!
      const body = await request.text()

      const event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      )

      if (event.type === 'customer.subscription.updated') {
        const subscription = event.data.object as Stripe.Subscription
        
        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            active: subscription.status === 'active',
            current_period_start: new Date(subscription.current_period_start * 1000),
            current_period_end: new Date(subscription.current_period_end * 1000),
          })
          .eq('stripe_subscription_id', subscription.id)
      }

      return NextResponse.json({ received: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Stripe Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

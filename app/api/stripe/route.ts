// STRIPE INTEGRATION PAUSED
// Será habilitado después. Ver STRIPE_SETUP.md para instrucciones.
// Este archivo será reactivado cuando se agreguen las variables de entorno necesarias.

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Stripe integration coming soon' },
    { status: 503 }
  )
}

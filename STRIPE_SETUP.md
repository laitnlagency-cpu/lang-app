# Activar Stripe (Subscripciones)

**Estado actual:** Stripe está pausado. La app funciona 100% gratis.

**Tiempo para activar:** 10 minutos.

## Paso 1: Obtener credenciales Stripe

1. Ve a https://dashboard.stripe.com/
2. Inicia sesión (crea cuenta si no tienes)
3. Copia estas 3 claves:
   - **Secret Key** (empieza con `sk_test_`)
   - **Publishable Key** (empieza con `pk_test_`)
   - **Webhook Signing Secret** (en Webhooks → signing secret)

## Paso 2: Obtener STRIPE_PRICE_ID

1. En Stripe Dashboard → Products → Create product
2. Name: "LangMind Premium"
3. Price: $9.99/month
4. Billing cycle: Monthly
5. Copiar el **Price ID** (empieza con `price_`)

## Paso 3: Obtener SUPABASE_SERVICE_ROLE_KEY

1. Supabase Dashboard → Settings → API
2. Copiar **Service Role Key** (secreto, no exponerlo)

## Paso 4: Agregar a Vercel

En Vercel → Environment Variables → Add:

```
STRIPE_SECRET_KEY = sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_...
STRIPE_WEBHOOK_SECRET = whsec_...
NEXT_PUBLIC_STRIPE_PRICE_ID = price_...
SUPABASE_SERVICE_ROLE_KEY = sbpk_...
NEXT_PUBLIC_APP_URL = https://tu-app.vercel.app
```

## Paso 5: Reactivar Stripe en código

Reemplazar contenido de `app/api/stripe/route.ts` con código original (pedir a Claude).

## Paso 6: Redeploy

Push a GitHub o redeploy manual en Vercel.

---

**¿Preguntas?** Las variables están documentadas en cada paso.

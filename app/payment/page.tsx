'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Payment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }
      setUser(session.user);
      setLoading(false);
    };
    getUser();
  }, [router]);

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-checkout',
          userId: user.id,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pago');
    } finally {
      setProcessing(false);
    }
  };

  const canceled = searchParams.get('canceled');
  const success = searchParams.get('success');

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: '#6b7280',
      }}>
        Cargando...
      </div>
    );
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 100%)',
      padding: '2rem',
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        <Link href="/dashboard">
          <button style={{
            padding: '0.5rem 1rem',
            background: '#e5e7eb',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            color: '#6b7280',
            fontWeight: 600,
            marginBottom: '2rem',
          }}>
            ← Volver
          </button>
        </Link>

        {canceled && (
          <div style={{
            padding: '1rem',
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626',
            marginBottom: '2rem',
          }}>
            El pago fue cancelado
          </div>
        )}

        {success && (
          <div style={{
            padding: '1rem',
            background: '#d1fae5',
            border: '1px solid #6ee7b7',
            borderRadius: '8px',
            color: '#059669',
            marginBottom: '2rem',
          }}>
            ¡Gracias por tu suscripción!
          </div>
        )}

        <h1 style={{ fontSize: '2rem', color: '#1e3a1f', marginBottom: '2rem' }}>
          💎 Premium
        </h1>

        <div style={{
          background: '#fff',
          borderRadius: '12px',
          border: '2px solid #0369a1',
          padding: '2rem',
          marginBottom: '2rem',
        }}>
          <h2 style={{ fontSize: '1.5rem', color: '#0369a1', marginTop: 0 }}>
            $9.99 / mes
          </h2>

          <ul style={{
            margin: '1.5rem 0',
            paddingLeft: '1.5rem',
            fontSize: '1rem',
            lineHeight: '1.8',
          }}>
            <li style={{ marginBottom: '0.75rem' }}>✓ Acceso a todas las lecciones</li>
            <li style={{ marginBottom: '0.75rem' }}>✓ Audio y pronunciación ilimitados</li>
            <li style={{ marginBottom: '0.75rem' }}>✓ Chat con IA sin límite</li>
            <li style={{ marginBottom: '0.75rem' }}>✓ Seguimiento de progreso</li>
            <li>✓ Soporte prioritario</li>
          </ul>

          <button
            onClick={handleCheckout}
            disabled={processing}
            style={{
              width: '100%',
              padding: '1rem',
              background: '#0369a1',
              color: '#fff',
              fontSize: '1.125rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '8px',
              cursor: processing ? 'not-allowed' : 'pointer',
              opacity: processing ? 0.7 : 1,
            }}
          >
            {processing ? 'Procesando...' : 'Suscribirse Ahora'}
          </button>
        </div>

        <div style={{
          background: '#f0fdf4',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #bbf7d0',
          color: '#059669',
        }}>
          <p style={{ margin: 0, fontWeight: 600, marginBottom: '0.75rem' }}>
            💚 Prueba gratis
          </p>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>
            Tienes acceso a 3 lecciones gratis. Suscríbete a Premium para desbloquear todas las lecciones y funcionalidades.
          </p>
        </div>
      </div>
    </main>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Payment() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

        <h1 style={{ fontSize: '2rem', color: '#1e3a1f', marginBottom: '2rem' }}>
          💎 Premium (Próximamente)
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
            disabled
            style={{
              width: '100%',
              padding: '1rem',
              background: '#9ca3af',
              color: '#fff',
              fontSize: '1.125rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '8px',
              cursor: 'not-allowed',
              opacity: 0.7,
            }}
          >
            Disponible pronto
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
            💚 Acceso gratuito
          </p>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>
            Por ahora tienes acceso a todas las lecciones sin costo. Las suscripciones estarán disponibles pronto.
          </p>
        </div>
      </div>
    </main>
  );
}

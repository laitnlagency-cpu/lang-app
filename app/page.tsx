'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Landing() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Verificar si tiene preferencias
        const { data: prefs } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (prefs) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      }
    };
    checkAuth();
  }, [router]);

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        maxWidth: '600px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '3rem',
          color: '#1e3a1f',
          marginBottom: '1rem',
          fontWeight: 700,
        }}>
          🌍 LangMind
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: '#6b7280',
          marginBottom: '2rem',
          lineHeight: 1.6,
        }}>
          Aprende idiomas con audio, IA y diseño accesible para neurodivergentes
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}>
          <div style={{
            padding: '1.5rem',
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #d1d5db',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔊</div>
            <p style={{ margin: 0, color: '#6b7280', fontWeight: 600, fontSize: '0.875rem' }}>
              Audio y pronunciación
            </p>
          </div>

          <div style={{
            padding: '1.5rem',
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #d1d5db',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
            <p style={{ margin: 0, color: '#6b7280', fontWeight: 600, fontSize: '0.875rem' }}>
              Tutor IA
            </p>
          </div>

          <div style={{
            padding: '1.5rem',
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #d1d5db',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>♿</div>
            <p style={{ margin: 0, color: '#6b7280', fontWeight: 600, fontSize: '0.875rem' }}>
              Diseño accesible
            </p>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          style={{
            padding: '1rem 2rem',
            background: '#0369a1',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.125rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            width: '100%',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#025d8c';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#0369a1';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          🔐 Comenzar con Google
        </button>

        <p style={{
          marginTop: '2rem',
          fontSize: '0.875rem',
          color: '#9ca3af',
        }}>
          3 lecciones gratis • Sin ruido visual • Conversaciones con IA
        </p>
      </div>
    </main>
  );
}

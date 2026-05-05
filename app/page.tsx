'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Landing() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setEmail('');
        setPassword('');
        alert('Cuenta creada. Por favor verifica tu email antes de entrar.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/onboarding');
      }
    } catch (err: any) {
      setError(err.message || 'Error en autenticación');
    } finally {
      setLoading(false);
    }
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
        width: '100%',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
        </div>

        <div style={{
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #d1d5db',
          padding: '2rem',
        }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '1rem',
          }}>
            <button
              onClick={() => setIsSignUp(false)}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: !isSignUp ? '#0369a1' : '#e5e7eb',
                color: !isSignUp ? '#fff' : '#6b7280',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: isSignUp ? '#0369a1' : '#e5e7eb',
                color: isSignUp ? '#fff' : '#6b7280',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: 600 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: 600 }}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {error && (
              <div style={{
                padding: '0.75rem',
                background: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                color: '#dc2626',
                fontSize: '0.875rem',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '1rem',
                background: '#0369a1',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.125rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Procesando...' : (isSignUp ? 'Crear cuenta' : 'Entrar')}
            </button>
          </form>

          <p style={{
            marginTop: '1rem',
            fontSize: '0.875rem',
            color: '#9ca3af',
            textAlign: 'center',
          }}>
            3 lecciones gratis • Sin ruido visual • Conversaciones con IA
          </p>
        </div>
      </div>
    </main>
  );
}

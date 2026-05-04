'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LANGUAGES, LESSONS_DATA, LanguageCode } from '@/lib/languages';
import Link from 'next/link';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [progress, setProgress] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }
      setUser(session.user);

      // Obtener suscripción
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      setSubscription(sub);

      // Obtener preferencias
      const { data: prefs } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      setPreferences(prefs);

      // Obtener progreso
      const { data: prog } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', session.user.id);
      setProgress(prog?.reduce((acc: any, p: any) => ({ ...acc, [p.lesson_id]: p }), {}) || {});

      setLoading(false);
    };
    getData();
  }, [router]);

  const canAccess = (lessonId: number): boolean => {
    return lessonId <= 3 || subscription?.active;
  };

  const handleLessonClick = (id: number) => {
    if (canAccess(id)) {
      router.push(`/lesson/${id}`);
    }
  };

  const learningLang = preferences?.learning_language as LanguageCode || 'en';
  const baseLang = preferences?.base_language as LanguageCode || 'es';
  const lessons = LESSONS_DATA[learningLang] || [];

  if (loading) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.125rem',
        color: '#6b7280',
      }}>
        Cargando tu panel...
      </div>
    );
  }

  return (
    <main style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '2rem',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 100%)',
      minHeight: '100vh',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#1e3a1f', fontSize: '2rem' }}>
            Tus Lecciones
          </h1>
          <p style={{
            margin: '0.5rem 0 0',
            color: '#6b7280',
            fontSize: '1rem',
          }}>
            {LANGUAGES[baseLang].flag} {LANGUAGES[baseLang].name} → {LANGUAGES[learningLang].flag} {LANGUAGES[learningLang].name}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => router.push('/onboarding')}
            style={{
              padding: '0.5rem 1rem',
              background: '#e0f2fe',
              border: '1px solid #7dd3fc',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#0369a1',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            Cambiar idiomas
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            style={{
              padding: '0.5rem 1rem',
              background: '#e5e7eb',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#6b7280',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            Salir
          </button>
        </div>
      </div>

      {/* Premium Banner */}
      {!subscription?.active && (
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%)',
          border: '2px solid #fcd34d',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 600, color: '#92400e', fontSize: '1rem' }}>
              📚 Tienes 3 lecciones gratis
            </p>
            <p style={{ margin: 0, color: '#78350f', fontSize: '0.875rem' }}>
              Suscríbete a Premium para acceder a todas las lecciones y aprovechar al máximo tu aprendizaje
            </p>
          </div>
          <Link href="/payment">
            <button style={{
              padding: '0.75rem 1.5rem',
              background: '#f59e0b',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              marginLeft: '1rem',
            }}>
              Suscribirse
            </button>
          </Link>
        </div>
      )}

      {/* Lecciones Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
      }}>
        {lessons.map((lesson: any) => {
          const isLocked = !canAccess(lesson.id);
          const isCompleted = progress[lesson.id]?.completed;

          return (
            <div
              key={lesson.id}
              onClick={() => handleLessonClick(lesson.id)}
              style={{
                background: '#fff',
                border: isCompleted ? '2px solid #10b981' : '1px solid #d1d5db',
                borderRadius: '12px',
                padding: '1.5rem',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                opacity: isLocked ? 0.6 : 1,
                transition: 'all 0.2s',
                boxShadow: isCompleted ? '0 4px 12px rgba(16, 185, 129, 0.15)' : '0 1px 3px rgba(0,0,0,0.08)',
              }}
              onMouseEnter={(e) => {
                if (!isLocked) {
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLocked) {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <div style={{
                display: 'inline-block',
                background: '#e0f2fe',
                color: '#0369a1',
                padding: '0.25rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                marginBottom: '0.75rem',
              }}>
                Lección {lesson.id}
              </div>

              <h3 style={{
                margin: '0 0 1rem',
                fontSize: '1.25rem',
                color: isCompleted ? '#10b981' : '#1e3a1f',
                fontWeight: 600,
              }}>
                {isCompleted && '✓ '} {lesson.title}
              </h3>

              <p style={{
                margin: '0 0 1rem',
                fontSize: '0.875rem',
                color: '#6b7280',
              }}>
                {lesson.vocab.length} palabras
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid #e5e7eb',
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isCompleted ? '#10b981' : '#6b7280',
                }}>
                  {isCompleted ? '✓ Completada' : 'No iniciada'}
                </div>

                {isLocked && (
                  <div style={{ fontSize: '1rem', color: '#dc2626' }}>
                    🔒
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div style={{
        marginTop: '3rem',
        padding: '1.5rem',
        background: '#d1fae5',
        borderRadius: '12px',
        border: '1px solid #6ee7b7',
        color: '#059669',
        lineHeight: '1.6',
      }}>
        <p style={{ margin: '0 0 0.75rem', fontWeight: 600, fontSize: '1rem' }}>
          💡 Consejos para aprender mejor:
        </p>
        <ul style={{
          margin: 0,
          paddingLeft: '1.5rem',
          fontSize: '0.95rem',
        }}>
          <li style={{ marginBottom: '0.5rem' }}>
            Practica pronunciación escuchando y repitiendo cada palabra
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Usa el chat con IA para practicar conversaciones
          </li>
          <li>
            Dedica 10-15 minutos diarios para mejores resultados
          </li>
        </ul>
      </div>
    </main>
  );
}

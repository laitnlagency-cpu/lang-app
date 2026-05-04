'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LANGUAGES, LanguageCode } from '@/lib/languages';

export default function Onboarding() {
  const [user, setUser] = useState<any>(null);
  const [baseLanguage, setBaseLanguage] = useState<LanguageCode | null>(null);
  const [learningLanguage, setLearningLanguage] = useState<LanguageCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

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

  const handleSave = async () => {
    if (!baseLanguage || !learningLanguage) {
      alert('Por favor selecciona ambos idiomas');
      return;
    }

    if (baseLanguage === learningLanguage) {
      alert('Los idiomas deben ser diferentes');
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        base_language: baseLanguage,
        learning_language: learningLanguage,
      });

    if (error) {
      console.error('Error saving preferences:', error);
      alert('Error al guardar preferencias');
      setSaving(false);
      return;
    }

    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontSize: '1.125rem',
        color: '#6b7280',
      }}>
        Cargando...
      </div>
    );
  }

  const languageOptions = Object.entries(LANGUAGES).map(([code, lang]) => ({
    code: code as LanguageCode,
    ...lang,
  }));

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
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1e3a1f' }}>
          🎯 Elige tus idiomas
        </h1>

        {/* Base Language Selection */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#1e3a1f' }}>
            ¿Qué idioma hablas ahora?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
          }}>
            {languageOptions.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setBaseLanguage(lang.code)}
                style={{
                  padding: '1.5rem',
                  background: baseLanguage === lang.code ? '#0369a1' : '#fff',
                  color: baseLanguage === lang.code ? '#fff' : '#1f2937',
                  border: baseLanguage === lang.code ? '2px solid #0369a1' : '1px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{lang.flag}</div>
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Learning Language Selection */}
        {baseLanguage && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#1e3a1f' }}>
              ¿Qué idioma quieres aprender?
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1rem',
            }}>
              {languageOptions
                .filter((lang) => lang.code !== baseLanguage)
                .map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLearningLanguage(lang.code)}
                    style={{
                      padding: '1.5rem',
                      background: learningLanguage === lang.code ? '#059669' : '#fff',
                      color: learningLanguage === lang.code ? '#fff' : '#1f2937',
                      border: learningLanguage === lang.code ? '2px solid #059669' : '1px solid #d1d5db',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{lang.flag}</div>
                    {lang.name}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        {baseLanguage && learningLanguage && (
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: '100%',
              padding: '1.25rem',
              background: '#0369a1',
              color: '#fff',
              fontSize: '1.125rem',
              fontWeight: 600,
              borderRadius: '12px',
              border: 'none',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              transition: 'all 0.2s',
            }}
          >
            {saving ? 'Guardando...' : '🚀 Comenzar a aprender'}
          </button>
        )}
      </div>
    </main>
  );
}

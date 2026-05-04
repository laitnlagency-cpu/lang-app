'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LANGUAGES, LESSONS_DATA, LanguageCode } from '@/lib/languages';
import { AudioButton } from '@/components/audio-player';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Lesson() {
  const router = useRouter();
  const params = useParams();
  const lessonId = parseInt(params.id as string);

  const [user, setUser] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }
      setUser(session.user);

      const { data: prefs } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      setPreferences(prefs);

      const learningLang = (prefs?.learning_language || 'en') as LanguageCode;
      const lessonData = LESSONS_DATA[learningLang]?.find((l) => l.id === lessonId);
      setLesson(lessonData);
      setLoading(false);
    };
    getData();
  }, [router, lessonId]);

  const handleSendMessage = async () => {
    if (!input.trim() || sending) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setSending(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          messages: [...messages, newMessage],
          language: preferences?.learning_language || 'en',
          lessonId,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: '#6b7280',
      }}>
        Cargando lección...
      </div>
    );
  }

  if (!lesson) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: '#dc2626',
      }}>
        Lección no encontrada
      </div>
    );
  }

  const learningLang = (preferences?.learning_language || 'en') as LanguageCode;
  const langCode = LANGUAGES[learningLang].code;

  return (
    <main style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 100%)',
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
    }}>
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '0.5rem 1rem',
              background: '#e5e7eb',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#6b7280',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            ← Volver
          </button>
          <h1 style={{ margin: 0, color: '#1e3a1f' }}>{lesson.title}</h1>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}>
          {lesson.vocab.map((word: any) => (
            <div
              key={word.id}
              style={{
                background: '#fff',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #d1d5db',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}>
                <h3 style={{ margin: 0, color: '#1e3a1f' }}>{word.word}</h3>
                <AudioButton text={word.word} language={langCode} />
              </div>

              <p style={{
                margin: '0.5rem 0',
                color: '#6b7280',
                fontSize: '0.875rem',
              }}>
                <strong>Significado:</strong> {word.meaning}
              </p>

              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#f0fdf4',
                borderRadius: '8px',
                border: '1px solid #bbf7d0',
              }}>
                <p style={{
                  margin: 0,
                  color: '#047857',
                  fontSize: '0.875rem',
                  fontStyle: 'italic',
                }}>
                  "{word.example}"
                </p>
                <div style={{ marginTop: '0.75rem' }}>
                  <AudioButton text={word.example} language={langCode} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #d1d5db',
          padding: '1.5rem',
        }}
      >
        <h2 style={{ margin: '0 0 1.5rem', color: '#1e3a1f' }}>
          💬 Tutor de IA
        </h2>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {messages.length === 0 && (
            <div style={{
              textAlign: 'center',
              color: '#6b7280',
              padding: '2rem',
            }}>
              <p>Escribe algo en el idioma {LANGUAGES[learningLang].name} para practicar</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '80%',
                  padding: '1rem',
                  borderRadius: '12px',
                  background: msg.role === 'user' ? '#0369a1' : '#f0fdf4',
                  color: msg.role === 'user' ? '#fff' : '#1f2937',
                  border: msg.role === 'user' ? 'none' : '1px solid #bbf7d0',
                }}
              >
                <p style={{ margin: 0, lineHeight: 1.5 }}>{msg.content}</p>
              </div>
            </div>
          ))}

          {sending && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
            }}>
              <div style={{
                padding: '1rem',
                borderRadius: '12px',
                background: '#f0fdf4',
                color: '#047857',
              }}>
                <p style={{ margin: 0 }}>Pensando...</p>
              </div>
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '0.75rem',
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe tu respuesta..."
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.95rem',
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={sending || !input.trim()}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#0369a1',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: sending ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              opacity: sending ? 0.6 : 1,
            }}
          >
            Enviar
          </button>
        </div>
      </div>
    </main>
  );
}

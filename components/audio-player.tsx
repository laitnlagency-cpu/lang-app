'use client';
import { useState, useRef } from 'react';

interface AudioPlayerProps {
  text: string;
  language: string;
  variant?: 'inline' | 'full';
}

export function AudioButton({ text, language }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.9;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <button
      onClick={playAudio}
      disabled={isPlaying}
      style={{
        background: '#e0f2fe',
        border: '1px solid #7dd3fc',
        color: '#0369a1',
        padding: '0.25rem 0.5rem',
        borderRadius: '4px',
        cursor: isPlaying ? 'not-allowed' : 'pointer',
        fontSize: '0.875rem',
        fontWeight: 600,
      }}
    >
      🔊
    </button>
  );
}

export function AudioPlayer({ text, language, variant = 'inline' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const recognitionRef = useRef<any>(null);

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.9;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Web Speech API no soportado en este navegador');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = language;
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => setIsRecording(true);
    
    recognitionRef.current.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          // Calculate accuracy based on similarity (simplified)
          const acc = Math.round(confidence * 100);
          setAccuracy(acc);
          setTranscript(finalTranscript);
        } else {
          interimTranscript += transcript;
        }
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognitionRef.current.onend = () => setIsRecording(false);

    recognitionRef.current.start();
  };

  if (variant === 'full') {
    return (
      <div style={{
        padding: '1.5rem',
        background: '#f8f9fa',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
      }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1rem',
        }}>
          <button
            onClick={playAudio}
            disabled={isPlaying}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: isPlaying ? '#cbd5e1' : '#0369a1',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: isPlaying ? 'not-allowed' : 'pointer',
              fontWeight: 600,
            }}
          >
            {isPlaying ? 'Reproduciendo...' : '🔊 Escuchar'}
          </button>
          
          <button
            onClick={startRecording}
            disabled={isRecording}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: isRecording ? '#dc2626' : '#059669',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: isRecording ? 'not-allowed' : 'pointer',
              fontWeight: 600,
            }}
          >
            {isRecording ? '● Grabando...' : '🎤 Pronuncia'}
          </button>
        </div>

        {transcript && (
          <div style={{
            padding: '1rem',
            background: '#d1fae5',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '1px solid #6ee7b7',
          }}>
            <p style={{ margin: '0 0 0.5rem', color: '#065f46', fontWeight: 600, fontSize: '0.875rem' }}>
              Tu pronunciación:
            </p>
            <p style={{ margin: '0.5rem 0 0', color: '#047857', fontSize: '1rem' }}>
              {transcript}
            </p>
            {accuracy !== null && (
              <p style={{ margin: '0.5rem 0 0', color: '#059669', fontWeight: 600 }}>
                ¡Excelente! {accuracy}% precisión
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return <AudioButton text={text} language={language} variant={variant} />;
}

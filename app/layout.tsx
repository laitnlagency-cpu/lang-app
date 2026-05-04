import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LangMind - Aprende idiomas',
  description: 'App accesible de aprendizaje de idiomas con audio, IA y diseño para neurodivergentes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

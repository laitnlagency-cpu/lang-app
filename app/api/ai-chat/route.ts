import { OpenAI } from 'openai'
import { AI_SYSTEM_PROMPTS, LanguageCode } from '@/lib/languages'
import { NextRequest, NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { messages, language } = await request.json()

    const systemPrompt = AI_SYSTEM_PROMPTS[language as LanguageCode] || AI_SYSTEM_PROMPTS['en']

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const reply = response.choices[0].message.content || 'No respuesta'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('AI Chat Error:', error)
    return NextResponse.json(
      { error: 'Error processing message' },
      { status: 500 }
    )
  }
}

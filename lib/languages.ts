export type LanguageCode = 'es' | 'en' | 'it' | 'nl';

export const LANGUAGES: Record<LanguageCode, { name: string; code: string; flag: string }> = {
  es: { name: 'Español', code: 'es-ES', flag: '🇪🇸' },
  en: { name: 'English', code: 'en-US', flag: '🇬🇧' },
  it: { name: 'Italiano', code: 'it-IT', flag: '🇮🇹' },
  nl: { name: 'Nederlands', code: 'nl-NL', flag: '🇳🇱' },
};

export const LESSONS_DATA: Record<LanguageCode, any[]> = {
  es: [
    {
      id: 1,
      title: 'Saludos Básicos',
      vocab: [
        { id: 1, word: 'Hola', meaning: 'Hello', example: 'Hola, ¿cómo estás?' },
        { id: 2, word: 'Buenos días', meaning: 'Good morning', example: 'Buenos días a todos' },
        { id: 3, word: 'Gracias', meaning: 'Thank you', example: 'Gracias por tu ayuda' },
      ],
    },
    {
      id: 2,
      title: 'Familia',
      vocab: [
        { id: 1, word: 'Madre', meaning: 'Mother', example: 'Mi madre es doctora' },
        { id: 2, word: 'Padre', meaning: 'Father', example: 'Mi padre trabaja aquí' },
        { id: 3, word: 'Hermano', meaning: 'Brother', example: 'Mi hermano estudia español' },
      ],
    },
    {
      id: 3,
      title: 'Números',
      vocab: [
        { id: 1, word: 'Uno', meaning: 'One', example: 'Tengo uno' },
        { id: 2, word: 'Dos', meaning: 'Two', example: 'Dos y dos son cuatro' },
        { id: 3, word: 'Tres', meaning: 'Three', example: 'Tres pájaros volando' },
      ],
    },
  ],
  en: [
    {
      id: 1,
      title: 'Basic Greetings',
      vocab: [
        { id: 1, word: 'Hello', meaning: 'Hola', example: 'Hello, how are you?' },
        { id: 2, word: 'Good morning', meaning: 'Buenos días', example: 'Good morning everyone' },
        { id: 3, word: 'Thank you', meaning: 'Gracias', example: 'Thank you for your help' },
      ],
    },
    {
      id: 2,
      title: 'Family',
      vocab: [
        { id: 1, word: 'Mother', meaning: 'Madre', example: 'My mother is a doctor' },
        { id: 2, word: 'Father', meaning: 'Padre', example: 'My father works here' },
        { id: 3, word: 'Brother', meaning: 'Hermano', example: 'My brother studies English' },
      ],
    },
    {
      id: 3,
      title: 'Numbers',
      vocab: [
        { id: 1, word: 'One', meaning: 'Uno', example: 'I have one' },
        { id: 2, word: 'Two', meaning: 'Dos', example: 'Two and two make four' },
        { id: 3, word: 'Three', meaning: 'Tres', example: 'Three birds flying' },
      ],
    },
  ],
  it: [
    {
      id: 1,
      title: 'Saluti Basici',
      vocab: [
        { id: 1, word: 'Ciao', meaning: 'Hello/Goodbye', example: 'Ciao, come stai?' },
        { id: 2, word: 'Buongiorno', meaning: 'Good morning', example: 'Buongiorno a tutti' },
        { id: 3, word: 'Grazie', meaning: 'Thank you', example: 'Grazie per il tuo aiuto' },
      ],
    },
    {
      id: 2,
      title: 'Famiglia',
      vocab: [
        { id: 1, word: 'Madre', meaning: 'Mother', example: 'Mia madre è dottore' },
        { id: 2, word: 'Padre', meaning: 'Father', example: 'Mio padre lavora qui' },
        { id: 3, word: 'Fratello', meaning: 'Brother', example: 'Mio fratello studia italiano' },
      ],
    },
    {
      id: 3,
      title: 'Numeri',
      vocab: [
        { id: 1, word: 'Uno', meaning: 'One', example: 'Ne ho uno' },
        { id: 2, word: 'Due', meaning: 'Two', example: 'Due e due fanno quattro' },
        { id: 3, word: 'Tre', meaning: 'Three', example: 'Tre uccelli che volano' },
      ],
    },
  ],
  nl: [
    {
      id: 1,
      title: 'Basisgroeten',
      vocab: [
        { id: 1, word: 'Hallo', meaning: 'Hello', example: 'Hallo, hoe gaat het?' },
        { id: 2, word: 'Goedemorgen', meaning: 'Good morning', example: 'Goedemorgen iedereen' },
        { id: 3, word: 'Dank je wel', meaning: 'Thank you', example: 'Dank je wel voor je hulp' },
      ],
    },
    {
      id: 2,
      title: 'Familie',
      vocab: [
        { id: 1, word: 'Moeder', meaning: 'Mother', example: 'Mijn moeder is arts' },
        { id: 2, word: 'Vader', meaning: 'Father', example: 'Mijn vader werkt hier' },
        { id: 3, word: 'Broer', meaning: 'Brother', example: 'Mijn broer studeert Nederlands' },
      ],
    },
    {
      id: 3,
      title: 'Nummers',
      vocab: [
        { id: 1, word: 'Een', meaning: 'One', example: 'Ik heb er één' },
        { id: 2, word: 'Twee', meaning: 'Two', example: 'Twee en twee zijn vier' },
        { id: 3, word: 'Drie', meaning: 'Three', example: 'Drie vogels die vliegen' },
      ],
    },
  ],
};

export const AI_SYSTEM_PROMPTS: Record<LanguageCode, string> = {
  es: 'Eres un tutor de español amable y paciente. Responde siempre en español. Usa un lenguaje simple y claro. Proporciona ejemplos cuando sea necesario. Sé alentador y positivo. Ayuda al usuario a aprender vocabulario y gramática de forma natural.',
  en: 'You are a friendly and patient English tutor. Always respond in English. Use simple and clear language. Provide examples when necessary. Be encouraging and positive. Help the user learn vocabulary and grammar naturally.',
  it: 'Sei un tutor di italiano amichevole e paziente. Rispondi sempre in italiano. Usa un linguaggio semplice e chiaro. Fornisci esempi quando necessario. Sii incoraggiante e positivo. Aiuta l\'utente a imparare il vocabolario e la grammatica in modo naturale.',
  nl: 'Je bent een vriendelijke en geduldige Nederlands leraar. Antwoord altijd in het Nederlands. Gebruik eenvoudige en duidelijke taal. Geef voorbeelden waar nodig. Wees bemoedigend en positief. Help de gebruiker op natuurlijke wijze Nederlands vocabulaire en grammatica te leren.',
};

export function getLanguageName(code: LanguageCode): string {
  return LANGUAGES[code]?.name || 'Unknown';
}

export function getLanguagePair(base: LanguageCode, learning: LanguageCode): string {
  return `${LANGUAGES[base].flag} ${LANGUAGES[base].name} → ${LANGUAGES[learning].flag} ${LANGUAGES[learning].name}`;
}

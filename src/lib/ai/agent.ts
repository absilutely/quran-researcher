import { openai } from '@ai-sdk/openai';
import { streamText, generateText } from 'ai';
import { QURAN_RESEARCHER_SYSTEM_PROMPT, classifyQuery } from './skills/quran-researcher';

// Memory store for saved verses and research context
interface Memory {
  savedVerses: Array<{
    reference: string;
    arabic: string;
    translation: string;
    notes?: string;
    savedAt: Date;
  }>;
  researchHistory: Array<{
    query: string;
    summary: string;
    timestamp: Date;
  }>;
}

const memoryStore: Map<string, Memory> = new Map();

function getMemory(sessionId: string): Memory {
  if (!memoryStore.has(sessionId)) {
    memoryStore.set(sessionId, {
      savedVerses: [],
      researchHistory: [],
    });
  }
  return memoryStore.get(sessionId)!;
}

export async function createResearchStream(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  sessionId: string = 'default'
) {
  const memory = getMemory(sessionId);
  
  // Build context from memory
  const memoryContext = memory.savedVerses.length > 0
    ? `\n\nUser's saved verses:\n${memory.savedVerses.map(v => `- ${v.reference}: ${v.arabic}`).join('\n')}`
    : '';

  const systemPrompt = QURAN_RESEARCHER_SYSTEM_PROMPT + memoryContext;

  return streamText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    messages,
  });
}

export async function generateResearchReport(
  query: string,
  sessionId: string = 'default'
) {
  const queryType = classifyQuery(query);
  const memory = getMemory(sessionId);

  const result = await generateText({
    model: openai('gpt-4o'),
    system: QURAN_RESEARCHER_SYSTEM_PROMPT,
    prompt: `Research Query Type: ${queryType}\n\nUser Query: ${query}\n\nProvide a comprehensive research report.`,
  });

  // Save to research history
  memory.researchHistory.push({
    query,
    summary: result.text.substring(0, 200),
    timestamp: new Date(),
  });

  return result;
}

// Utility functions for memory management
export function saveVerse(
  sessionId: string,
  verse: { reference: string; arabic: string; translation: string; notes?: string }
) {
  const memory = getMemory(sessionId);
  memory.savedVerses.push({
    ...verse,
    savedAt: new Date(),
  });
}

export function getSavedVerses(sessionId: string) {
  return getMemory(sessionId).savedVerses;
}

export function getResearchHistory(sessionId: string) {
  return getMemory(sessionId).researchHistory;
}

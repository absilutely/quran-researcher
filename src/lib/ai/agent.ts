import { anthropic } from '@ai-sdk/anthropic';
import { streamText, generateText, tool } from 'ai';
import { z } from 'zod';
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

// Tools for the AI agent
const saveVerseTool = tool({
  description: 'Save a verse to the user\'s collection for later reference',
  parameters: z.object({
    reference: z.string().describe('Surah:Ayah reference (e.g., "2:255")'),
    arabic: z.string().describe('Arabic text of the verse'),
    translation: z.string().describe('English translation'),
    notes: z.string().optional().describe('Optional notes about the verse'),
  }),
  execute: async ({ reference, arabic, translation, notes }) => {
    // In production, this would save to database
    return { success: true, message: `Saved verse ${reference}` };
  },
});

const searchQuranTool = tool({
  description: 'Search the Quran for specific words, roots, or phrases',
  parameters: z.object({
    query: z.string().describe('Search query - can be Arabic word, root, or English term'),
    searchType: z.enum(['word', 'root', 'phrase', 'translation']).describe('Type of search'),
    limit: z.number().optional().describe('Maximum results to return'),
  }),
  execute: async ({ query, searchType, limit = 10 }) => {
    // This would connect to a Quran API or database
    // For now, return a placeholder
    return {
      results: [],
      message: `Searching for "${query}" by ${searchType}`,
    };
  },
});

const analyzeMorphologyTool = tool({
  description: 'Analyze the morphology of an Arabic word from the Quran',
  parameters: z.object({
    word: z.string().describe('Arabic word to analyze'),
    reference: z.string().optional().describe('Verse reference for context'),
  }),
  execute: async ({ word, reference }) => {
    // This would use a morphological database
    return {
      word,
      reference,
      analysis: 'Morphological analysis would be performed here',
    };
  },
});

const getVerseContextTool = tool({
  description: 'Get the context around a specific verse including surrounding verses',
  parameters: z.object({
    reference: z.string().describe('Surah:Ayah reference'),
    contextSize: z.number().optional().describe('Number of verses before and after'),
  }),
  execute: async ({ reference, contextSize = 3 }) => {
    return {
      reference,
      context: `Context for ${reference} with ${contextSize} surrounding verses`,
    };
  },
});

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
    model: anthropic('claude-sonnet-4-20250514'),
    system: systemPrompt,
    messages,
    tools: {
      saveVerse: saveVerseTool,
      searchQuran: searchQuranTool,
      analyzeMorphology: analyzeMorphologyTool,
      getVerseContext: getVerseContextTool,
    },
    maxSteps: 5, // Allow multi-step reasoning
  });
}

export async function generateResearchReport(
  query: string,
  sessionId: string = 'default'
) {
  const queryType = classifyQuery(query);
  const memory = getMemory(sessionId);

  const result = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: QURAN_RESEARCHER_SYSTEM_PROMPT,
    prompt: `Research Query Type: ${queryType}\n\nUser Query: ${query}\n\nProvide a comprehensive research report.`,
    tools: {
      saveVerse: saveVerseTool,
      searchQuran: searchQuranTool,
      analyzeMorphology: analyzeMorphologyTool,
      getVerseContext: getVerseContextTool,
    },
    maxSteps: 10,
  });

  // Save to research history
  memory.researchHistory.push({
    query,
    summary: result.text.substring(0, 200),
    timestamp: new Date(),
  });

  return result;
}

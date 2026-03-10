/**
 * Quran Researcher Skill
 * 
 * Provides AI capabilities for deep Quranic research including:
 * - Word comparison across verses
 * - Morphological analysis
 * - Semantic analysis
 * - Correlation and causation discovery
 * - Blindspot analysis
 */

export const QURAN_RESEARCHER_SYSTEM_PROMPT = `You are an expert Quran researcher and Arabic linguist. Your role is to help users deeply understand the Quran through linguistic and semantic analysis.

## Your Capabilities

### 1. Word Comparison
When users ask to compare words or concepts:
- Identify all occurrences of the word/root in the Quran
- Compare usage contexts across different surahs
- Highlight semantic variations and nuances
- Note any evolution in meaning or usage

### 2. Word Analysis
For individual word analysis:
- Provide the Arabic root (جذر)
- Break down morphological components
- Explain the word pattern (وزن)
- List related words from the same root
- Provide classical tafsir insights

### 3. Semantic Analysis
For deeper semantic exploration:
- Analyze the word within its ayah context
- Explore relationships with surrounding words
- Identify rhetorical devices (بلاغة)
- Connect to broader Quranic themes

### 4. Further Analysis
For advanced research:
- Cross-reference with hadith when relevant
- Note scholarly interpretations
- Identify areas needing more research (blindspots)
- Suggest related research directions

## Output Format

Structure your responses with clear sections:

### Summary
Brief overview of findings

### Morphological Analysis
\`\`\`
Root: [Arabic root]
Pattern: [وزن]
Type: [verb/noun/particle]
Form: [if verb, which form I-X]
\`\`\`

### Occurrences
List relevant verses with:
- Surah:Ayah reference
- Arabic text
- Translation
- Context notes

### Correlations & Insights
- Patterns discovered
- Thematic connections
- Linguistic relationships

### Blindspot Analysis
- Areas not fully explored
- Questions for further research
- Limitations of current analysis

## Guidelines
- Always cite Surah:Ayah references
- Use Arabic script for Quranic text
- Provide transliteration when helpful
- Be scholarly but accessible
- Acknowledge uncertainty when present
- Respect the sacred nature of the text
`;

export const MORPHOLOGY_PATTERNS = {
  // Verb forms (أوزان الفعل)
  verbForms: {
    I: { pattern: 'فَعَلَ', meaning: 'Base form' },
    II: { pattern: 'فَعَّلَ', meaning: 'Intensive/causative' },
    III: { pattern: 'فَاعَلَ', meaning: 'Reciprocal/attempt' },
    IV: { pattern: 'أَفْعَلَ', meaning: 'Causative' },
    V: { pattern: 'تَفَعَّلَ', meaning: 'Reflexive of II' },
    VI: { pattern: 'تَفَاعَلَ', meaning: 'Reciprocal reflexive' },
    VII: { pattern: 'اِنْفَعَلَ', meaning: 'Passive/reflexive' },
    VIII: { pattern: 'اِفْتَعَلَ', meaning: 'Reflexive' },
    IX: { pattern: 'اِفْعَلَّ', meaning: 'Colors/defects' },
    X: { pattern: 'اِسْتَفْعَلَ', meaning: 'Seeking/considering' },
  },
  
  // Noun patterns (أوزان الاسم)
  nounPatterns: {
    فَاعِل: 'Active participle',
    مَفْعُول: 'Passive participle',
    فَعِيل: 'Intensive adjective',
    فَعَّال: 'Intensive doer',
    مَفْعَل: 'Place/time noun',
    مِفْعَال: 'Instrument noun',
    فِعَالَة: 'Profession/craft',
  },
  
  // Grammatical categories
  categories: {
    اسم: 'Noun',
    فعل: 'Verb',
    حرف: 'Particle',
  }
};

export interface ResearchQuery {
  type: 'word_comparison' | 'word_analysis' | 'semantic_analysis' | 'further_analysis';
  query: string;
  context?: string;
}

export interface ResearchResult {
  summary: string;
  morphology?: {
    root: string;
    pattern: string;
    type: string;
    form?: string;
  };
  occurrences: Array<{
    reference: string;
    arabic: string;
    translation: string;
    notes?: string;
  }>;
  correlations: string[];
  blindspots: string[];
}

export function classifyQuery(query: string): ResearchQuery['type'] {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('compare') || lowerQuery.includes('difference between') || lowerQuery.includes('vs')) {
    return 'word_comparison';
  }
  
  if (lowerQuery.includes('meaning of') || lowerQuery.includes('what does') || lowerQuery.includes('analyze')) {
    return 'word_analysis';
  }
  
  if (lowerQuery.includes('semantic') || lowerQuery.includes('context') || lowerQuery.includes('theme')) {
    return 'semantic_analysis';
  }
  
  return 'further_analysis';
}

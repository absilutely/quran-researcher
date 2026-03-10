import { createResearchStream } from '@/lib/ai/agent';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json();

    const result = await createResearchStream(messages, sessionId);

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

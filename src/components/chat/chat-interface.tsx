'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Send, Loader2, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ResearchMessage } from './research-message';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  sessionId?: string;
  onResearchComplete?: (research: { query: string; response: string }) => void;
}

export function ChatInterface({ sessionId = 'default', onResearchComplete }: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          assistantContent += chunk;
          
          setMessages(prev => 
            prev.map(m => 
              m.id === assistantMessage.id 
                ? { ...m, content: assistantContent }
                : m
            )
          );
        }
      }

      if (onResearchComplete) {
        onResearchComplete({
          query: userMessage.content,
          response: assistantContent,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  const suggestedQueries = [
    'Compare "قلب" and "فؤاد" in the Quran',
    'Analyze the root ر-ح-م and its derivatives',
    'What is the semantic range of "تقوى"?',
    'Explore the word "نور" across different surahs',
  ];

  const handleSuggestionClick = (query: string) => {
    setInput(query);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Quran Research Assistant</h2>
              <p className="text-muted-foreground max-w-md">
                Ask questions about Quranic words, explore morphological patterns, 
                and discover semantic connections across verses.
              </p>
            </div>
            
            {/* Suggested Queries */}
            <div className="space-y-3 w-full max-w-lg">
              <p className="text-sm text-muted-foreground">Try asking:</p>
              <div className="grid gap-2">
                {suggestedQueries.map((query, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(query)}
                    className="text-left p-3 rounded-lg border border-border hover:bg-accent hover:border-primary/50 transition-colors text-sm"
                  >
                    <Sparkles className="w-4 h-4 inline-block mr-2 text-primary" />
                    {query}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      QR
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.role === 'assistant' ? (
                    <ResearchMessage content={message.content} />
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
                
                {message.role === 'user' && (
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                      U
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    QR
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Researching...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Error Display */}
      {error && (
        <div className="px-4 py-2 bg-destructive/10 text-destructive text-sm">
          Error: {error.message}
        </div>
      )}

      {/* Input Area */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Quranic words, roots, or concepts..."
            className="min-h-[60px] max-h-[200px] resize-none"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="h-[60px] w-[60px] shrink-0"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

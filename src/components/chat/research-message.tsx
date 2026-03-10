'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Copy, 
  Check, 
  Bookmark, 
  Share2,
  ChevronDown,
  ChevronUp,
  Languages
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResearchMessageProps {
  content: string;
}

export function ResearchMessage({ content }: ResearchMessageProps) {
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['summary']));

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Parse the content to identify sections
  const sections = parseResearchContent(content);

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="flex gap-2 flex-wrap">
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? (
            <Check className="w-4 h-4 mr-1" />
          ) : (
            <Copy className="w-4 h-4 mr-1" />
          )}
          {copied ? 'Copied' : 'Copy'}
        </Button>
        <Button variant="ghost" size="sm">
          <Bookmark className="w-4 h-4 mr-1" />
          Save
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </Button>
      </div>

      {/* Rendered Content */}
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {sections.map((section, index) => (
          <div key={index} className="mb-4">
            {section.type === 'heading' && (
              <button
                onClick={() => toggleSection(section.id)}
                className="flex items-center gap-2 w-full text-left font-semibold text-lg hover:text-primary transition-colors"
              >
                {expandedSections.has(section.id) ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                {section.content}
              </button>
            )}
            
            {section.type === 'arabic' && (
              <Card className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                <p 
                  className="text-2xl text-right font-arabic leading-loose"
                  dir="rtl"
                  lang="ar"
                >
                  {section.content}
                </p>
                {section.reference && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-primary/10">
                    <Badge variant="outline" className="text-xs">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {section.reference}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      <Languages className="w-3 h-3 mr-1" />
                      View Translation
                    </Button>
                  </div>
                )}
              </Card>
            )}
            
            {section.type === 'morphology' && (
              <Card className="p-4 bg-muted/50 font-mono text-sm">
                <pre className="whitespace-pre-wrap">{section.content}</pre>
              </Card>
            )}
            
            {section.type === 'text' && (
              <p className="text-muted-foreground leading-relaxed">
                {section.content}
              </p>
            )}
            
            {section.type === 'list' && (
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {section.items?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface Section {
  type: 'heading' | 'arabic' | 'morphology' | 'text' | 'list';
  id: string;
  content: string;
  reference?: string;
  items?: string[];
}

function parseResearchContent(content: string): Section[] {
  const sections: Section[] = [];
  const lines = content.split('\n');
  let currentSection: Section | null = null;
  let listItems: string[] = [];

  for (const line of lines) {
    // Heading detection
    if (line.startsWith('###') || line.startsWith('##')) {
      if (currentSection) sections.push(currentSection);
      if (listItems.length > 0) {
        sections.push({ type: 'list', id: `list-${sections.length}`, content: '', items: listItems });
        listItems = [];
      }
      const headingText = line.replace(/^#+\s*/, '');
      currentSection = {
        type: 'heading',
        id: headingText.toLowerCase().replace(/\s+/g, '-'),
        content: headingText,
      };
      sections.push(currentSection);
      currentSection = null;
      continue;
    }

    // Code block (morphology)
    if (line.startsWith('```')) {
      if (currentSection?.type === 'morphology') {
        sections.push(currentSection);
        currentSection = null;
      } else {
        if (currentSection) sections.push(currentSection);
        currentSection = { type: 'morphology', id: `morph-${sections.length}`, content: '' };
      }
      continue;
    }

    // Arabic text detection (contains Arabic characters)
    if (/[\u0600-\u06FF]/.test(line) && line.trim().length > 10) {
      if (currentSection) sections.push(currentSection);
      // Try to extract reference like (2:255)
      const refMatch = line.match(/\((\d+:\d+)\)/);
      sections.push({
        type: 'arabic',
        id: `arabic-${sections.length}`,
        content: line.replace(/\(\d+:\d+\)/, '').trim(),
        reference: refMatch?.[1],
      });
      currentSection = null;
      continue;
    }

    // List item
    if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
      listItems.push(line.replace(/^[\s\-•]+/, '').trim());
      continue;
    }

    // Regular text
    if (line.trim()) {
      if (listItems.length > 0) {
        sections.push({ type: 'list', id: `list-${sections.length}`, content: '', items: listItems });
        listItems = [];
      }
      if (currentSection?.type === 'morphology') {
        currentSection.content += line + '\n';
      } else if (currentSection?.type === 'text') {
        currentSection.content += ' ' + line;
      } else {
        if (currentSection) sections.push(currentSection);
        currentSection = { type: 'text', id: `text-${sections.length}`, content: line };
      }
    }
  }

  if (currentSection) sections.push(currentSection);
  if (listItems.length > 0) {
    sections.push({ type: 'list', id: `list-${sections.length}`, content: '', items: listItems });
  }

  return sections;
}

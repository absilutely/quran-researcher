'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Trash2,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResearchItem {
  id: string;
  query: string;
  timestamp: Date;
  preview: string;
}

interface SavedVerse {
  reference: string;
  arabic: string;
  savedAt: Date;
}

interface SidebarProps {
  researchHistory?: ResearchItem[];
  savedVerses?: SavedVerse[];
  onSelectResearch?: (id: string) => void;
  onSelectVerse?: (reference: string) => void;
}

export function Sidebar({ 
  researchHistory = [], 
  savedVerses = [],
  onSelectResearch,
  onSelectVerse 
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'saved'>('history');

  // Demo data for display
  const demoHistory: ResearchItem[] = researchHistory.length > 0 ? researchHistory : [
    {
      id: '1',
      query: 'Compare قلب and فؤاد',
      timestamp: new Date(Date.now() - 3600000),
      preview: 'Analysis of heart-related terms...',
    },
    {
      id: '2',
      query: 'Root ر-ح-م analysis',
      timestamp: new Date(Date.now() - 86400000),
      preview: 'Mercy and compassion derivatives...',
    },
    {
      id: '3',
      query: 'Semantic range of تقوى',
      timestamp: new Date(Date.now() - 172800000),
      preview: 'God-consciousness and piety...',
    },
  ];

  const demoVerses: SavedVerse[] = savedVerses.length > 0 ? savedVerses : [
    {
      reference: '2:255',
      arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
      savedAt: new Date(),
    },
    {
      reference: '112:1',
      arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
      savedAt: new Date(),
    },
  ];

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (isCollapsed) {
    return (
      <div className="w-12 border-r bg-muted/30 flex flex-col items-center py-4 gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="mb-4"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          variant={activeTab === 'history' ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => { setActiveTab('history'); setIsCollapsed(false); }}
        >
          <History className="w-4 h-4" />
        </Button>
        <Button
          variant={activeTab === 'saved' ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => { setActiveTab('saved'); setIsCollapsed(false); }}
        >
          <Bookmark className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-72 border-r bg-muted/30 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex gap-1">
          <Button
            variant={activeTab === 'history' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('history')}
            className="gap-1"
          >
            <History className="w-4 h-4" />
            History
          </Button>
          <Button
            variant={activeTab === 'saved' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('saved')}
            className="gap-1"
          >
            <Bookmark className="w-4 h-4" />
            Saved
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(true)}
          className="h-8 w-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        {activeTab === 'history' ? (
          <div className="p-2 space-y-1">
            {demoHistory.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectResearch?.(item.id)}
                className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-sm line-clamp-1">{item.query}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle delete
                    }}
                  >
                    <Trash2 className="w-3 h-3 text-muted-foreground" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                  {item.preview}
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatTime(item.timestamp)}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {demoVerses.map((verse) => (
              <button
                key={verse.reference}
                onClick={() => onSelectVerse?.(verse.reference)}
                className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {verse.reference}
                  </Badge>
                </div>
                <p 
                  className="text-sm text-right font-arabic leading-relaxed line-clamp-2"
                  dir="rtl"
                  lang="ar"
                >
                  {verse.arabic}
                </p>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground text-center">
          {activeTab === 'history' 
            ? `${demoHistory.length} researches`
            : `${demoVerses.length} saved verses`
          }
        </p>
      </div>
    </div>
  );
}

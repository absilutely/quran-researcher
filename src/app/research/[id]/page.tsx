'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Share2,
  Copy,
  Check,
  Bookmark,
  MessageSquare,
  Highlighter,
  ChevronRight,
  ExternalLink,
  Send,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Demo research data
const demoResearch = {
  id: '1',
  title: 'Comparing قلب (Qalb) and فؤاد (Fu\'ad) in the Quran',
  author: 'Ahmad S.',
  authorInitials: 'AS',
  createdAt: '2 days ago',
  likes: 42,
  tags: ['Word Comparison', 'Semantics', 'Heart'],
  sections: [
    {
      id: 'summary',
      title: 'Summary',
      content: `Both قلب (qalb) and فؤاد (fu'ad) are translated as "heart" in English, but they carry distinct semantic nuances in Quranic Arabic. This research explores their usage patterns and contextual meanings.

**Key Finding:** While قلب appears 132 times and refers to the spiritual/intellectual heart, فؤاد appears 16 times and emphasizes the emotional/passionate aspect of the heart.`,
    },
    {
      id: 'morphology',
      title: 'Morphological Analysis',
      content: `### قلب (Qalb)
\`\`\`
Root: ق-ل-ب
Pattern: فَعْل
Meaning: To turn, flip, transform
Derivatives: قَلَّبَ (to turn over), تَقَلُّب (fluctuation), مُنقَلَب (place of return)
\`\`\`

### فؤاد (Fu'ad)
\`\`\`
Root: ف-أ-د
Pattern: فُعَال
Meaning: To kindle, burn
Derivatives: فَأْد (to roast), أَفْئِدَة (hearts, plural)
\`\`\``,
    },
    {
      id: 'occurrences',
      title: 'Key Occurrences',
      verses: [
        {
          reference: '2:7',
          arabic: 'خَتَمَ اللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ',
          translation: 'Allah has set a seal upon their hearts and upon their hearing',
          notes: 'قلوب (hearts) used in context of spiritual sealing',
        },
        {
          reference: '14:37',
          arabic: 'فَاجْعَلْ أَفْئِدَةً مِّنَ النَّاسِ تَهْوِي إِلَيْهِمْ',
          translation: 'So make hearts among the people incline toward them',
          notes: 'أفئدة (hearts) used for emotional inclination/longing',
        },
        {
          reference: '28:10',
          arabic: 'وَأَصْبَحَ فُؤَادُ أُمِّ مُوسَىٰ فَارِغًا',
          translation: 'And the heart of Moses\' mother became empty',
          notes: 'فؤاد used for intense emotional state',
        },
      ],
    },
    {
      id: 'correlations',
      title: 'Correlations & Insights',
      content: `### Pattern Analysis

1. **قلب is used when discussing:**
   - Faith and disbelief (إيمان/كفر)
   - Understanding and reflection (تدبر)
   - Spiritual diseases (أمراض القلوب)
   - Divine guidance and sealing

2. **فؤاد is used when discussing:**
   - Intense emotions (longing, emptiness)
   - Maternal love
   - Passionate attachment
   - Burning desire

### Thematic Distribution
- قلب: Predominantly in Medinan surahs dealing with faith/law
- فؤاد: More common in Meccan surahs with emotional narratives`,
    },
    {
      id: 'blindspots',
      title: 'Blindspot Analysis',
      content: `### Areas for Further Research

1. **Unexplored:** The relationship between قلب and صدر (chest) in Quranic usage
2. **Question:** Why does the Quran use أفئدة (plural of فؤاد) but rarely the singular?
3. **Gap:** Comparative analysis with pre-Islamic Arabic poetry usage
4. **Opportunity:** Cross-reference with hadith literature for expanded semantic field

### Limitations
- This analysis focuses on direct occurrences; derived forms need separate study
- Classical tafsir perspectives not fully integrated`,
    },
  ],
  comments: [
    {
      id: '1',
      author: 'Fatima K.',
      authorInitials: 'FK',
      content: 'Excellent analysis! Have you considered looking at how Ibn Kathir distinguishes between these terms?',
      createdAt: '1 day ago',
      likes: 5,
    },
    {
      id: '2',
      author: 'Omar M.',
      authorInitials: 'OM',
      content: 'The morphological breakdown is very helpful. The root ق-ل-ب meaning "to turn" really illuminates why قلب is used for spiritual transformation.',
      createdAt: '12 hours ago',
      likes: 8,
    },
  ],
};

export default function ResearchPage() {
  const params = useParams();
  const [copied, setCopied] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [highlightMode, setHighlightMode] = useState(false);
  const [highlights, setHighlights] = useState<string[]>([]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: demoResearch.title,
        url: window.location.href,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex-1 container py-8 px-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span>Research</span>
          <ChevronRight className="w-4 h-4" />
          <span>{params.id}</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">{demoResearch.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {demoResearch.authorInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{demoResearch.author}</p>
              <p className="text-xs text-muted-foreground">{demoResearch.createdAt}</p>
            </div>
          </div>
          
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button 
              variant={highlightMode ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setHighlightMode(!highlightMode)}
            >
              <Highlighter className="w-4 h-4 mr-1" />
              Highlight
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {demoResearch.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="report" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="report">Full Report</TabsTrigger>
          <TabsTrigger value="verses">Verses ({demoResearch.sections.find(s => s.id === 'occurrences')?.verses?.length || 0})</TabsTrigger>
          <TabsTrigger value="comments">Comments ({demoResearch.comments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="report">
          <div className="space-y-8">
            {demoResearch.sections.map((section) => (
              <Card key={section.id} id={section.id}>
                <CardHeader>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {section.content && (
                    <div 
                      className={cn(
                        "prose prose-sm dark:prose-invert max-w-none",
                        highlightMode && "cursor-crosshair"
                      )}
                    >
                      {section.content.split('\n').map((line, i) => {
                        if (line.startsWith('```')) return null;
                        if (line.startsWith('###')) {
                          return <h3 key={i} className="text-lg font-semibold mt-4 mb-2">{line.replace('### ', '')}</h3>;
                        }
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <p key={i} className="font-semibold">{line.replace(/\*\*/g, '')}</p>;
                        }
                        if (line.startsWith('- ') || line.startsWith('1. ')) {
                          return <li key={i} className="ml-4">{line.replace(/^[-\d.]\s*/, '')}</li>;
                        }
                        if (line.trim()) {
                          return <p key={i} className="text-muted-foreground">{line}</p>;
                        }
                        return null;
                      })}
                    </div>
                  )}
                  
                  {section.verses && (
                    <div className="space-y-4">
                      {section.verses.map((verse, i) => (
                        <Card key={i} className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <Badge variant="outline">
                                <BookOpen className="w-3 h-3 mr-1" />
                                {verse.reference}
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View in Quran.com
                              </Button>
                            </div>
                            <p 
                              className="text-2xl text-right font-arabic leading-loose mb-3"
                              dir="rtl"
                              lang="ar"
                            >
                              {verse.arabic}
                            </p>
                            <p className="text-muted-foreground italic mb-2">
                              "{verse.translation}"
                            </p>
                            {verse.notes && (
                              <p className="text-sm text-primary bg-primary/10 rounded px-2 py-1 inline-block">
                                📝 {verse.notes}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="verses">
          <div className="space-y-4">
            {demoResearch.sections.find(s => s.id === 'occurrences')?.verses?.map((verse, i) => (
              <Card key={i} className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-base px-3 py-1">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Surah {verse.reference.split(':')[0]}, Ayah {verse.reference.split(':')[1]}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p 
                    className="text-3xl text-right font-arabic leading-loose mb-4"
                    dir="rtl"
                    lang="ar"
                  >
                    {verse.arabic}
                  </p>
                  <Separator className="my-4" />
                  <p className="text-lg text-muted-foreground">
                    {verse.translation}
                  </p>
                  {verse.notes && (
                    <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm font-medium text-primary">Research Note:</p>
                      <p className="text-sm text-muted-foreground">{verse.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Discussion ({demoResearch.comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add Comment */}
              <div className="flex gap-3 mb-6">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-muted text-xs">U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-2"
                  />
                  <Button size="sm" disabled={!newComment.trim()}>
                    <Send className="w-4 h-4 mr-1" />
                    Post Comment
                  </Button>
                </div>
              </div>

              <Separator className="mb-6" />

              {/* Comments List */}
              <div className="space-y-6">
                {demoResearch.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {comment.authorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{comment.content}</p>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                          <Heart className="w-3 h-3" />
                          {comment.likes}
                        </button>
                        <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Table of Contents - Fixed Sidebar */}
      <div className="hidden xl:block fixed right-8 top-32 w-48">
        <p className="text-sm font-medium mb-3">On this page</p>
        <nav className="space-y-1">
          {demoResearch.sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
            >
              {section.title}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

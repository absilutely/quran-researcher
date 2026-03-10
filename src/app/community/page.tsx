'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  BookOpen, 
  Heart, 
  MessageSquare, 
  Share2,
  TrendingUp,
  Clock,
  Filter
} from 'lucide-react';

// Demo community researches
const communityResearches = [
  {
    id: '1',
    title: 'The Semantic Evolution of "Taqwa" in the Quran',
    author: 'Ahmad S.',
    authorInitials: 'AS',
    preview: 'An in-depth analysis of how the concept of God-consciousness (تقوى) develops across different Meccan and Medinan surahs...',
    tags: ['Semantics', 'Taqwa', 'Comparative'],
    likes: 42,
    comments: 12,
    createdAt: '2 days ago',
  },
  {
    id: '2',
    title: 'Root ر-ح-م: Mercy in All Its Forms',
    author: 'Fatima K.',
    authorInitials: 'FK',
    preview: 'Exploring the 339 occurrences of the root ر-ح-م and its various derivatives including Rahman, Rahim, and Rahma...',
    tags: ['Morphology', 'Root Analysis', 'Divine Names'],
    likes: 78,
    comments: 23,
    createdAt: '1 week ago',
  },
  {
    id: '3',
    title: 'Heart Words: قلب vs فؤاد vs صدر',
    author: 'Omar M.',
    authorInitials: 'OM',
    preview: 'A comparative study of three Arabic words for heart and their distinct usages in Quranic context...',
    tags: ['Word Comparison', 'Semantics', 'Arabic'],
    likes: 56,
    comments: 18,
    createdAt: '3 days ago',
  },
  {
    id: '4',
    title: 'The Verb Forms of "علم" (Knowledge)',
    author: 'Aisha R.',
    authorInitials: 'AR',
    preview: 'Analyzing how different verb forms of the root ع-ل-م convey various aspects of knowledge, teaching, and learning...',
    tags: ['Verb Forms', 'Knowledge', 'Morphology'],
    likes: 34,
    comments: 8,
    createdAt: '5 days ago',
  },
];

export default function CommunityPage() {
  return (
    <div className="flex-1 container py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Researches</h1>
        <p className="text-muted-foreground">
          Explore insights and discoveries shared by the community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search researches..." 
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Trending
          </Button>
          <Button variant="outline" className="gap-2">
            <Clock className="w-4 h-4" />
            Recent
          </Button>
        </div>
      </div>

      {/* Research Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {communityResearches.map((research) => (
          <Card key={research.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {research.authorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{research.author}</p>
                    <p className="text-xs text-muted-foreground">{research.createdAt}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
              <CardTitle className="text-lg mt-4">{research.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {research.preview}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {research.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Heart className="w-4 h-4" />
                  {research.likes}
                </button>
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  {research.comments}
                </button>
                <div className="flex items-center gap-1 ml-auto">
                  <BookOpen className="w-4 h-4" />
                  Read
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center mt-8">
        <Button variant="outline" size="lg">
          Load More Researches
        </Button>
      </div>
    </div>
  );
}

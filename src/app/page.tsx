'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { ChatInterface } from '@/components/chat/chat-interface';
import { useState } from 'react';

export default function HomePage() {
  const [sessionId] = useState(() => `session-${Date.now()}`);

  return (
    <div className="flex flex-1 w-full">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatInterface sessionId={sessionId} />
      </div>
    </div>
  );
}

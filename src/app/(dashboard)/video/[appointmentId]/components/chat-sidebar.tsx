'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppMessage, useLocalSessionId } from '@daily-co/daily-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send } from 'lucide-react';
import { format } from 'date-fns';

interface ChatSidebarProps {
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
}

export default function ChatSidebar({ onClose }: ChatSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const localSessionId = useLocalSessionId();

  const sendAppMessage = useAppMessage({
    onAppMessage: (event: any) => {
      if (event.data?.type === 'chat-message') {
        const newMessage: ChatMessage = {
          id: event.data.id,
          senderId: event.fromId,
          senderName: event.data.senderName,
          message: event.data.message,
          timestamp: new Date(event.data.timestamp),
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const messageData = {
      type: 'chat-message',
      id: `${Date.now()}-${localSessionId}`,
      senderName: 'Você', // TODO: Get real user name
      message: inputMessage,
      timestamp: new Date().toISOString(),
    };

    sendAppMessage(messageData, '*');
    setInputMessage('');
  };

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-white font-semibold">Chat</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>Nenhuma mensagem ainda</p>
              <p className="text-sm mt-1">Inicie a conversa!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.senderId === localSessionId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-[70%] rounded-lg p-3
                      ${isOwn ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-100'}
                    `}
                  >
                    {!isOwn && (
                      <p className="text-xs font-semibold mb-1 opacity-75">
                        {msg.senderName}
                      </p>
                    )}
                    <p className="text-sm break-words">{msg.message}</p>
                    <p className="text-xs mt-1 opacity-60">
                      {format(msg.timestamp, 'HH:mm')}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
          />
          <Button
            type="submit"
            size="icon"
            className="bg-primary-600 hover:bg-primary-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}


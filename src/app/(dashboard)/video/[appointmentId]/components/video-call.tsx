'use client';

import { useState, useEffect, useCallback } from 'react';
import { DailyProvider, useDaily, useDailyEvent } from '@daily-co/daily-react';
import ParticipantsView from './participants-view';
import VideoControls from './video-controls';
import ChatSidebar from './chat-sidebar';
import NotesSidebar from './notes-sidebar';
import { Loader2 } from 'lucide-react';

interface VideoCallProps {
  roomUrl: string;
  token: string;
  userName: string;
  userRole: 'doctor' | 'patient';
  appointmentId: string;
  onCallEnd: () => void;
}

function VideoCallContent({
  roomUrl,
  token,
  userName,
  userRole,
  appointmentId,
  onCallEnd,
}: VideoCallProps) {
  const callObject = useDaily();
  const [showChat, setShowChat] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [callState, setCallState] = useState<'joining' | 'joined' | 'left'>('joining');

  // Join call
  useEffect(() => {
    if (!callObject) return;

    const joinCall = async () => {
      try {
        await callObject.join({
          url: roomUrl,
          token,
          userName,
        });
        setIsLoading(false);
        setCallState('joined');
      } catch (error) {
        console.error('Error joining call:', error);
        setIsLoading(false);
      }
    };

    joinCall();
  }, [callObject, roomUrl, token, userName]);

  // Handle call ended
  useDailyEvent('left-meeting', () => {
    setCallState('left');
    onCallEnd();
  });

  // Handle participant left
  useDailyEvent('participant-left', (event: any) => {
    // Se o outro participante sair, podemos mostrar uma mensagem
    console.log('Participant left:', event);
  });

  const handleLeave = useCallback(async () => {
    if (callObject) {
      await callObject.leave();
    }
  }, [callObject]);

  if (isLoading || callState === 'joining') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-white">Conectando à consulta...</p>
        </div>
      </div>
    );
  }

  if (callState === 'left') {
    return null; // CallEnded será mostrado pela página pai
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Main Video Area */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-4">
          <ParticipantsView />
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <ChatSidebar onClose={() => setShowChat(false)} />
        )}

        {/* Notes Sidebar (Doctor only) */}
        {showNotes && userRole === 'doctor' && (
          <NotesSidebar
            appointmentId={appointmentId}
            onClose={() => setShowNotes(false)}
          />
        )}
      </div>

      {/* Controls */}
      <VideoControls
        onLeave={handleLeave}
        onToggleChat={() => setShowChat(!showChat)}
        onToggleNotes={() => setShowNotes(!showNotes)}
        showNotesButton={userRole === 'doctor'}
      />
    </div>
  );
}

export default function VideoCall(props: VideoCallProps) {
  return (
    <DailyProvider>
      <VideoCallContent {...props} />
    </DailyProvider>
  );
}


'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import DailyIframe from '@daily-co/daily-js'
import { Button } from '@/components/ui/button'
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  Monitor,
  Clock
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function VideoCallContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const appointmentId = params.appointmentId as string
  const roomName = searchParams.get('room')

  const callFrameRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const [callState, setCallState] = useState<'loading' | 'joined' | 'left'>('loading')
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [duration, setDuration] = useState(0)
  const [participants, setParticipants] = useState<number>(1)

  useEffect(() => {
    if (!roomName || !containerRef.current) return

    const dailyDomain = process.env.NEXT_PUBLIC_DAILY_DOMAIN
    if (!dailyDomain) {
      console.error('NEXT_PUBLIC_DAILY_DOMAIN não configurado')
      return
    }

    const roomUrl = `https://${dailyDomain}/${roomName}`

    // Criar iframe do Daily.co
    callFrameRef.current = DailyIframe.createFrame(containerRef.current, {
      iframeStyle: {
        width: '100%',
        height: '100%',
        border: 'none',
        borderRadius: '12px',
      },
      showLeaveButton: false,
      showFullscreenButton: true,
    })

    // Event listeners
    callFrameRef.current
      .on('joined-meeting', handleJoinedMeeting)
      .on('left-meeting', handleLeftMeeting)
      .on('participant-joined', handleParticipantJoined)
      .on('participant-left', handleParticipantLeft)
      .on('error', handleError)

    // Entrar na sala
    callFrameRef.current.join({ url: roomUrl })

    // Timer
    const timer = setInterval(() => {
      setDuration(d => d + 1)
    }, 1000)

    return () => {
      clearInterval(timer)
      if (callFrameRef.current) {
        callFrameRef.current.destroy()
      }
    }
  }, [roomName])

  function handleJoinedMeeting() {
    setCallState('joined')
    console.log('Joined meeting')
  }

  function handleLeftMeeting() {
    setCallState('left')
    router.push(`/dashboard/appointments/${appointmentId}?call=ended`)
  }

  function handleParticipantJoined() {
    setParticipants(p => p + 1)
  }

  function handleParticipantLeft() {
    setParticipants(p => Math.max(1, p - 1))
  }

  function handleError(error: any) {
    console.error('Daily.co error:', error)
    alert('Erro na videochamada. Por favor, tente novamente.')
  }

  async function toggleMute() {
    if (callFrameRef.current) {
      await callFrameRef.current.setLocalAudio(!isMuted)
      setIsMuted(!isMuted)
    }
  }

  async function toggleVideo() {
    if (callFrameRef.current) {
      await callFrameRef.current.setLocalVideo(!isVideoOff)
      setIsVideoOff(!isVideoOff)
    }
  }

  async function toggleScreenShare() {
    if (callFrameRef.current) {
      if (isScreenSharing) {
        await callFrameRef.current.stopScreenShare()
      } else {
        await callFrameRef.current.startScreenShare()
      }
      setIsScreenSharing(!isScreenSharing)
    }
  }

  async function leaveCall() {
    if (callFrameRef.current) {
      await callFrameRef.current.leave()
    }
  }

  function formatDuration(seconds: number) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white font-medium">Consulta em Andamento</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{formatDuration(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-300">
          <span className="text-sm">{participants} participante{participants !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 p-6">
        <div 
          ref={containerRef} 
          className="w-full h-full bg-gray-950 rounded-xl overflow-hidden shadow-2xl"
        />
      </div>

      {/* Controls */}
      <div className="bg-gray-800 px-6 py-6">
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-4">
          {/* Mute */}
          <button
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isMuted 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Video */}
          <button
            onClick={toggleVideo}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isVideoOff 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isVideoOff ? (
              <VideoOff className="w-6 h-6 text-white" />
            ) : (
              <Video className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isScreenSharing 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <Monitor className="w-6 h-6 text-white" />
          </button>

          {/* Leave Call */}
          <button
            onClick={leaveCall}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all ml-8"
          >
            <Phone className="w-6 h-6 text-white transform rotate-135" />
          </button>
        </div>

        <p className="text-center text-gray-400 text-sm mt-4">
          Ao finalizar a chamada, você será redirecionado automaticamente
        </p>
      </div>
    </div>
  )
}

export default function VideoCallPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VideoCallContent />
    </Suspense>
  );
}


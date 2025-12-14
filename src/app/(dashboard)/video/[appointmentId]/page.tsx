'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import WaitingRoom from './components/waiting-room';
import VideoCall from './components/video-call';
import CallEnded from './components/call-ended';
import { Loader2 } from 'lucide-react';

type CallState = 'loading' | 'waiting' | 'active' | 'ended';

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.appointmentId as string;
  
  const [callState, setCallState] = useState<CallState>('loading');
  const [appointment, setAppointment] = useState<any>(null);
  const [userRole, setUserRole] = useState<'doctor' | 'patient'>('patient');
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  const supabase = createClient();

  useEffect(() => {
    async function loadAppointment() {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', user.id)
          .single();

        if (!profile) {
          router.push('/login');
          return;
        }

        setUserName(profile.full_name);

        // Get appointment
        const { data: appointmentData, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('id', appointmentId)
          .single();

        if (error || !appointmentData) {
          console.error('Error loading appointment:', error);
          router.push('/dashboard/consultations');
          return;
        }

        // Determine user role
        const isDoctor = appointmentData.doctor_id === user.id;
        const isPatient = appointmentData.patient_id === user.id;

        if (!isDoctor && !isPatient) {
          router.push('/dashboard/consultations');
          return;
        }

        setUserRole(isDoctor ? 'doctor' : 'patient');

        // Get doctor profile
        const { data: doctorProfile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', appointmentData.doctor_id)
          .single();

        const { data: doctorData } = await supabase
          .from('doctors')
          .select('specialty')
          .eq('id', appointmentData.doctor_id)
          .single();

        // Get patient profile
        const { data: patientProfile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', appointmentData.patient_id)
          .single();

        // Format appointment data
        const formattedAppointment = {
          ...appointmentData,
          doctor: {
            full_name: doctorProfile?.full_name || 'Médico',
            specialty: doctorData?.specialty || '',
            avatar_url: doctorProfile?.avatar_url || null,
          },
          patient: {
            full_name: patientProfile?.full_name || 'Paciente',
            avatar_url: patientProfile?.avatar_url || null,
          },
        };

        setAppointment(formattedAppointment);

        // Check if room exists
        if (appointmentData.video_room_url) {
          setRoomUrl(appointmentData.video_room_url);
          // Get token
          await joinCall(appointmentData.video_room_url);
        } else {
          setCallState('waiting');
        }
      } catch (error) {
        console.error('Error:', error);
        router.push('/dashboard/consultations');
      }
    }

    loadAppointment();
  }, [appointmentId, router, supabase]);

  const joinCall = async (existingRoomUrl?: string) => {
    try {
      const response = await fetch('/api/video/create-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId,
          userId: (await supabase.auth.getUser()).data.user?.id,
          userName,
          role: userRole,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      const { roomUrl: newRoomUrl, token: newToken } = await response.json();
      setRoomUrl(newRoomUrl || existingRoomUrl);
      setToken(newToken);
      setCallState('active');
    } catch (error) {
      console.error('Error joining call:', error);
    }
  };

  const handleJoin = async () => {
    await joinCall();
  };

  const handleCancel = () => {
    router.push('/dashboard/consultations');
  };

  const handleCallEnd = () => {
    setCallState('ended');
  };

  if (callState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-white">Carregando consulta...</p>
        </div>
      </div>
    );
  }

  if (callState === 'waiting' && appointment) {
    return (
      <WaitingRoom
        appointment={appointment}
        userRole={userRole}
        onJoin={handleJoin}
        onCancel={handleCancel}
      />
    );
  }

  if (callState === 'active' && roomUrl && token) {
    return (
      <VideoCall
        roomUrl={roomUrl}
        token={token}
        userName={userName}
        userRole={userRole}
        appointmentId={appointmentId}
        onCallEnd={handleCallEnd}
      />
    );
  }

  if (callState === 'ended' && appointment) {
    return <CallEnded appointment={appointment} />;
  }

  return null;
}


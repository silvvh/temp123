'use client';

import { useState } from 'react';
import { useLocalSessionId, useDaily, useDevices } from '@daily-co/daily-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  MessageSquare,
  FileText,
  PhoneOff,
  Settings,
  ChevronUp,
} from 'lucide-react';

interface VideoControlsProps {
  onLeave: () => void;
  onToggleChat: () => void;
  onToggleNotes: () => void;
  showNotesButton?: boolean;
}

export default function VideoControls({
  onLeave,
  onToggleChat,
  onToggleNotes,
  showNotesButton = false,
}: VideoControlsProps) {
  const callObject = useDaily();
  const { microphones, cameras, speakers } = useDevices();
  
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Toggle Camera
  const toggleCamera = () => {
    if (callObject) {
      callObject.setLocalVideo(!isCameraOn);
      setIsCameraOn(!isCameraOn);
    }
  };

  // Toggle Microphone
  const toggleMic = () => {
    if (callObject) {
      callObject.setLocalAudio(!isMicOn);
      setIsMicOn(!isMicOn);
    }
  };

  // Toggle Screen Share
  const toggleScreenShare = async () => {
    if (!callObject) return;

    if (isScreenSharing) {
      await callObject.stopScreenShare();
      setIsScreenSharing(false);
    } else {
      await callObject.startScreenShare();
      setIsScreenSharing(true);
    }
  };

  // Change Camera
  const changeCamera = async (deviceId: string) => {
    if (callObject) {
      await callObject.setInputDevicesAsync({
        videoDeviceId: deviceId,
      });
    }
  };

  // Change Microphone
  const changeMicrophone = async (deviceId: string) => {
    if (callObject) {
      await callObject.setInputDevicesAsync({
        audioDeviceId: deviceId,
      });
    }
  };

  // Change Speaker
  const changeSpeaker = async (deviceId: string) => {
    if (callObject) {
      await callObject.setOutputDeviceAsync({
        outputDeviceId: deviceId,
      });
    }
  };

  return (
    <div className="bg-gray-800 border-t border-gray-700 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Device Settings */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Settings className="w-4 h-4 mr-2" />
                Dispositivos
                <ChevronUp className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" side="top">
              {/* Cameras */}
              {cameras && cameras.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
                    Câmera
                  </div>
                  {cameras.map((camera) => (
                    <DropdownMenuItem
                      key={camera.device.deviceId}
                      onClick={() => changeCamera(camera.device.deviceId)}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      {camera.device.label}
                    </DropdownMenuItem>
                  ))}
                </>
              )}

              {/* Microphones */}
              {microphones && microphones.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 mt-2">
                    Microfone
                  </div>
                  {microphones.map((mic) => (
                    <DropdownMenuItem
                      key={mic.device.deviceId}
                      onClick={() => changeMicrophone(mic.device.deviceId)}
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      {mic.device.label}
                    </DropdownMenuItem>
                  ))}
                </>
              )}

              {/* Speakers */}
              {speakers && speakers.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 mt-2">
                    Alto-falante
                  </div>
                  {speakers.map((speaker) => (
                    <DropdownMenuItem
                      key={speaker.device.deviceId}
                      onClick={() => changeSpeaker(speaker.device.deviceId)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {speaker.device.label}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center: Main Controls */}
        <div className="flex items-center gap-3">
          {/* Microphone */}
          <Button
            size="lg"
            variant={isMicOn ? 'secondary' : 'destructive'}
            className="w-14 h-14 rounded-full p-0"
            onClick={toggleMic}
          >
            {isMicOn ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </Button>

          {/* Camera */}
          <Button
            size="lg"
            variant={isCameraOn ? 'secondary' : 'destructive'}
            className="w-14 h-14 rounded-full p-0"
            onClick={toggleCamera}
          >
            {isCameraOn ? (
              <Video className="w-6 h-6" />
            ) : (
              <VideoOff className="w-6 h-6" />
            )}
          </Button>

          {/* Screen Share */}
          <Button
            size="lg"
            variant={isScreenSharing ? 'default' : 'secondary'}
            className="w-14 h-14 rounded-full p-0"
            onClick={toggleScreenShare}
          >
            {isScreenSharing ? (
              <MonitorOff className="w-6 h-6" />
            ) : (
              <Monitor className="w-6 h-6" />
            )}
          </Button>

          {/* Leave Call */}
          <Button
            size="lg"
            variant="destructive"
            className="w-14 h-14 rounded-full p-0 bg-red-600 hover:bg-red-700"
            onClick={onLeave}
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        </div>

        {/* Right: Additional Actions */}
        <div className="flex items-center gap-2">
          {/* Chat */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={onToggleChat}
          >
            <MessageSquare className="w-5 h-5" />
          </Button>

          {/* Notes (Doctor only) */}
          {showNotesButton && (
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={onToggleNotes}
            >
              <FileText className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}


import { useEffect, useState } from 'react';
import { useDaily } from '@daily-co/daily-react';

export function useCallQuality() {
  const callObject = useDaily();
  const [quality, setQuality] = useState<'good' | 'poor' | 'unknown'>('unknown');

  useEffect(() => {
    if (!callObject) return;

    const handleNetworkQualityChange = (event: any) => {
      const threshold = event.threshold;
      if (threshold === 'good') setQuality('good');
      else if (threshold === 'low' || threshold === 'very-low') setQuality('poor');
    };

    callObject.on('network-quality-change', handleNetworkQualityChange);

    return () => {
      callObject.off('network-quality-change', handleNetworkQualityChange);
    };
  }, [callObject]);

  return quality;
}

export function useRecording() {
  const callObject = useDaily();
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    if (!callObject) return;
    await callObject.startRecording();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    if (!callObject) return;
    await callObject.stopRecording();
    setIsRecording(false);
  };

  return { isRecording, startRecording, stopRecording };
}

export function useCallTimer() {
  const callObject = useDaily();
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!callObject) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [callObject]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return { duration, formatDuration };
}


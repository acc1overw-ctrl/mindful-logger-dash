import { useState, useRef } from 'react';
import { Mic, Square, Upload, Play, Pause, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AudioRecorderProps {
  onAudioReady: (url: string, fileName: string) => void;
  audioUrl?: string;
  onClear: () => void;
  hideRecorder?: boolean
}

export function AudioRecorder({ onAudioReady, audioUrl, onClear, hideRecorder }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        onAudioReady(url, `recording-${Date.now()}.webm`);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onAudioReady(url, file.name);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {!audioUrl ? (
          <>
            {!hideRecorder &&
              <>
                <Button
                  type="button"
                  variant={isRecording ? 'recording' : 'default'}
                  size="lg"
                  onClick={isRecording ? stopRecording : startRecording}
                  className="relative"
                >
                  {isRecording ? (
                    <>
                      <div className="absolute inset-0 rounded-lg bg-destructive animate-pulse-ring" />
                      <Square className="h-5 w-5 relative z-10" />
                      <span className="relative z-10">{formatTime(recordingTime)}</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5" />
                      <span>Record Audio</span>
                    </>
                  )}
                </Button>

                <span className="text-sm text-muted-foreground">or</span>
              </>
            }

            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-5 w-5" />
              <span>Upload Audio</span>
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-lg bg-secondary px-4 py-3 animate-fade-in">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={togglePlayback}
              className="h-10 w-10"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            <div className="flex-1">
              <div className="h-1 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full bg-primary transition-all duration-300",
                    isPlaying ? "w-1/2" : "w-0"
                  )}
                />
              </div>
            </div>

            <span className="text-sm font-medium text-muted-foreground">
              Audio Ready
            </span>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClear}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>

            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

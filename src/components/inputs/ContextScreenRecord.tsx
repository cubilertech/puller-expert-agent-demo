import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Square, Play, Save, Trash2, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ContextScreenRecordProps {
  onSave: (duration: number) => void;
}

type RecordingState = 'idle' | 'recording' | 'preview';

export function ContextScreenRecord({ onSave }: ContextScreenRecordProps) {
  const [state, setState] = useState<RecordingState>('idle');
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (state === 'recording') {
      intervalRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state]);

  const startRecording = () => {
    setDuration(0);
    setState('recording');
  };

  const stopRecording = () => {
    setState('preview');
  };

  const saveRecording = () => {
    onSave(duration);
    setState('idle');
    setDuration(0);
  };

  const discardRecording = () => {
    setState('idle');
    setDuration(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-foreground mb-1">Screen Recording</h3>
        <p className="text-xs text-muted-foreground">
          Record your screen to capture visual context
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {state === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-sm text-foreground mb-2">Ready to record</p>
              <p className="text-xs text-muted-foreground mb-6 max-w-[200px]">
                Record your screen to show dashboards, workflows, or visual data context
              </p>
              <Button onClick={startRecording}>
                <Video className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            </motion.div>
          )}

          {state === 'recording' && (
            <motion.div
              key="recording"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <motion.div
                className="w-24 h-24 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4 relative"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-destructive/10"
                  animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
                <div className="w-4 h-4 rounded-full bg-destructive animate-pulse" />
              </motion.div>
              
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-sm text-destructive font-medium">Recording</span>
              </div>
              
              <p className="text-2xl font-mono text-foreground mb-6">
                {formatTime(duration)}
              </p>
              
              <Button variant="destructive" onClick={stopRecording}>
                <Square className="w-4 h-4 mr-2" />
                Stop Recording
              </Button>
            </motion.div>
          )}

          {state === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center w-full"
            >
              {/* Mock preview */}
              <div className="aspect-video bg-muted/50 rounded-lg border border-border mb-4 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <div className="text-center">
                  <Play className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Recording Preview</p>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-background/80 text-xs text-foreground font-mono">
                  {formatTime(duration)}
                </div>
              </div>

              <p className="text-sm text-foreground mb-1">Recording complete</p>
              <p className="text-xs text-muted-foreground mb-4">
                Duration: {formatTime(duration)}
              </p>

              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={discardRecording}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Discard
                </Button>
                <Button onClick={saveRecording}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Recording
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {state === 'idle' && (
        <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border">
          <p className="text-[10px] text-muted-foreground">
            <strong>Note:</strong> Screen recording captures visual context that can be transcribed and analyzed. 
            Recordings are processed locally and only extracted insights are stored.
          </p>
        </div>
      )}
    </div>
  );
}

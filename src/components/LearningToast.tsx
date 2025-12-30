import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle2, X } from 'lucide-react';
import { LearningSignal } from '@/types';

interface LearningToastProps {
  signal: LearningSignal | null;
  onDismiss: () => void;
}

export function LearningToast({ signal, onDismiss }: LearningToastProps) {
  return (
    <AnimatePresence>
      {signal && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className="fixed bottom-6 left-1/2 z-50"
        >
          <div className="bg-card border border-success/30 rounded-xl p-4 shadow-2xl glow-success backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                >
                  <Zap className="w-5 h-5 text-success" />
                </motion.div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-sm font-semibold text-success">
                    Knowledge Updated
                  </span>
                </div>
                <div className="bg-muted/50 rounded-lg p-2 font-mono text-xs">
                  <span className="text-primary">{signal.rule}</span>
                  <span className="text-muted-foreground"> = </span>
                  <span className="text-success">{signal.value}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Global context has been updated. This rule will apply to all future queries.
                </p>
              </div>
              <button
                onClick={onDismiss}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

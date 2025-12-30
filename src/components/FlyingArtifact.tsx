import { motion } from 'framer-motion';
import { FileCode } from 'lucide-react';

interface FlyingArtifactProps {
  isVisible: boolean;
  onComplete: () => void;
}

export function FlyingArtifact({ isVisible, onComplete }: FlyingArtifactProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ 
        opacity: 1, 
        scale: 1, 
        x: '50%', 
        y: '50%',
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
      }}
      animate={{ 
        opacity: 0, 
        scale: 0.3, 
        x: 'calc(100vw - 100px)', 
        y: '-100px',
      }}
      transition={{ 
        duration: 0.8, 
        ease: [0.4, 0, 0.2, 1],
      }}
      onAnimationComplete={onComplete}
      className="pointer-events-none"
    >
      <div className="bg-card border border-success rounded-lg p-4 glow-success shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
            <FileCode className="w-5 h-5 text-success" />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">query.sql</div>
            <div className="text-xs text-muted-foreground">Approved ✓</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

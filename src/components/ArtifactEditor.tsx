import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, ShieldCheck, RefreshCw, FileCode, AlertTriangle } from 'lucide-react';
import { CodeDiff } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ArtifactEditorProps {
  code: CodeDiff[];
  onApprove: () => void;
  onOverride: () => void;
  isApproving: boolean;
}

export function ArtifactEditor({ code, onApprove, onOverride, isApproving }: ArtifactEditorProps) {
  const [showDiff, setShowDiff] = useState(true);
  
  const hasChanges = code.some(line => line.type !== 'unchanged');

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">Artifact Editor</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded font-mono">
            query.sql
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDiff(!showDiff)}
            className={cn(
              'text-xs px-2 py-1 rounded transition-colors',
              showDiff 
                ? 'bg-primary/20 text-primary' 
                : 'bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            {showDiff ? 'Hide Diff' : 'Show Diff'}
          </button>
        </div>
      </div>

      {/* Expert Note */}
      {hasChanges && (
        <div className="px-4 py-2 bg-warning/10 border-b border-warning/20 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <span className="text-xs text-warning">
            Expert modification: Added COALESCE to handle NULL revenue values
          </span>
        </div>
      )}

      {/* Code Editor */}
      <div className="flex-1 overflow-auto scrollbar-thin p-4 bg-muted/20">
        <pre className="code-editor">
          <code>
            {code.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className={cn(
                  'flex',
                  showDiff && line.type === 'added' && 'diff-added',
                  showDiff && line.type === 'removed' && 'diff-removed'
                )}
              >
                <span className="code-line-number">{line.lineNumber}</span>
                <span className={cn(
                  'flex-1',
                  line.type === 'added' && 'text-success',
                  line.type === 'removed' && 'text-destructive'
                )}>
                  {showDiff && line.type !== 'unchanged' && (
                    <span className="inline-block w-4 text-center opacity-50">
                      {line.type === 'added' ? '+' : '-'}
                    </span>
                  )}
                  {line.content}
                </span>
              </motion.div>
            ))}
          </code>
        </pre>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border bg-card/50">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onOverride}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Override
          </Button>
          <AnimatePresence mode="wait">
            {isApproving ? (
              <motion.div
                key="approving"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex-1 flex items-center justify-center gap-2 h-9 bg-success/20 rounded-md"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <ShieldCheck className="w-4 h-4 text-success" />
                </motion.div>
                <span className="text-sm text-success font-medium">Processing...</span>
              </motion.div>
            ) : (
              <motion.div
                key="approve"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex-1"
              >
                <Button
                  onClick={onApprove}
                  className="w-full bg-success hover:bg-success/90 text-success-foreground flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Approve & Send
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Approval will update the global knowledge context
        </p>
      </div>
    </div>
  );
}

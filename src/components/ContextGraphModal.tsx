import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ContextGraphCanvas } from './ContextGraphCanvas';
import { KnowledgeNode } from '@/types';
import { Button } from '@/components/ui/button';

interface ContextGraphModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodes: KnowledgeNode[];
  isLearning: boolean;
  newNodeLabel?: string;
}

export function ContextGraphModal({
  open,
  onOpenChange,
  nodes,
  isLearning,
  newNodeLabel,
}: ContextGraphModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Context Graph
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({nodes.length} nodes)
              </span>
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="flex-1 p-4 pt-2 h-[calc(80vh-80px)]">
          <ContextGraphCanvas
            nodes={nodes}
            isLearning={isLearning}
            newNodeLabel={newNodeLabel}
          />
        </div>

        {/* Stats Footer */}
        <div className="p-4 pt-0 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>
                <strong className="text-primary">{nodes.filter(n => n.type === 'entity').length}</strong> Entities
              </span>
              <span>
                <strong className="text-warning">{nodes.filter(n => n.type === 'rule').length}</strong> Rules
              </span>
              <span>
                <strong className="text-success">{nodes.filter(n => n.type === 'fact').length}</strong> Facts
              </span>
            </div>
            <span className="text-[10px]">
              Drag to pan • Scroll to zoom
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
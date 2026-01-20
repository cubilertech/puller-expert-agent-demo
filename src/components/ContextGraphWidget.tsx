import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronUp, ChevronDown } from 'lucide-react';
import { ContextGraph } from './ContextGraph';
import { KnowledgeNode } from '@/types';
import { cn } from '@/lib/utils';

interface ContextGraphWidgetProps {
  nodes: KnowledgeNode[];
  isLearning: boolean;
  newNodeLabel?: string;
}

export function ContextGraphWidget({ nodes, isLearning, newNodeLabel }: ContextGraphWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const nodesByType = {
    entity: nodes.filter(n => n.type === 'entity').length,
    rule: nodes.filter(n => n.type === 'rule').length,
    fact: nodes.filter(n => n.type === 'fact').length,
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute bottom-14 right-0 w-80 h-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            <ContextGraph
              nodes={nodes}
              isLearning={isLearning}
              newNodeLabel={newNodeLabel}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed Pill */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-full border shadow-lg transition-colors',
          isLearning 
            ? 'bg-success/20 border-success/40 text-success' 
            : 'bg-card border-border text-foreground hover:bg-muted/50'
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Brain className={cn(
          'w-4 h-4',
          isLearning && 'animate-pulse'
        )} />
        
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-medium">{nodes.length}</span>
          <span className="text-muted-foreground">nodes</span>
          
          <div className="flex items-center gap-1 ml-1 text-[10px]">
            <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary">{nodesByType.entity}</span>
            <span className="px-1.5 py-0.5 rounded bg-warning/20 text-warning">{nodesByType.rule}</span>
            <span className="px-1.5 py-0.5 rounded bg-success/20 text-success">{nodesByType.fact}</span>
          </div>
        </div>

        {isExpanded ? (
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronUp className="w-3 h-3 text-muted-foreground" />
        )}
      </motion.button>
    </div>
  );
}

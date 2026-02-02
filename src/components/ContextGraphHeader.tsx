import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';
import { KnowledgeNode, LearningSignal } from '@/types';
import { cn } from '@/lib/utils';

interface ContextGraphHeaderProps {
  nodes: KnowledgeNode[];
  isLearning: boolean;
  newNodeLabel?: string;
  learningSignal?: LearningSignal | null;
  onDismissSignal?: () => void;
  onClick?: () => void;
}

export function ContextGraphHeader({ 
  nodes, 
  isLearning, 
  newNodeLabel,
  learningSignal,
  onDismissSignal,
  onClick
}: ContextGraphHeaderProps) {
  const [showAddAnimation, setShowAddAnimation] = useState(false);
  const [prevNodeCount, setPrevNodeCount] = useState(nodes.length);

  const nodesByType = {
    entity: nodes.filter(n => n.type === 'entity').length,
    rule: nodes.filter(n => n.type === 'rule').length,
    fact: nodes.filter(n => n.type === 'fact').length,
  };

  // Detect when new nodes are added - show visual animation only
  useEffect(() => {
    if (nodes.length > prevNodeCount) {
      setShowAddAnimation(true);
      
      const animTimer = setTimeout(() => setShowAddAnimation(false), 4000);
      
      return () => {
        clearTimeout(animTimer);
      };
    }
    setPrevNodeCount(nodes.length);
  }, [nodes.length, prevNodeCount]);

  // Also trigger animation when there's a learning signal
  useEffect(() => {
    if (learningSignal) {
      setShowAddAnimation(true);
      
      const animTimer = setTimeout(() => setShowAddAnimation(false), 4000);
      
      return () => {
        clearTimeout(animTimer);
      };
    }
  }, [learningSignal]);

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all relative overflow-hidden cursor-pointer',
        'hover:border-primary/50 hover:bg-primary/5',
        isLearning || showAddAnimation
          ? 'bg-success/10 border-success/30'
          : 'bg-muted/30 border-border'
      )}
    >
      {/* Background pulse animation when learning */}
      <AnimatePresence>
        {(isLearning || showAddAnimation) && (
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 bg-success rounded-lg"
          />
        )}
      </AnimatePresence>

      {/* Icon */}
      <motion.div
        animate={isLearning ? { rotate: 360 } : {}}
        transition={{ repeat: isLearning ? Infinity : 0, duration: 2, ease: 'linear' }}
      >
        <Brain className={cn(
          'w-3.5 h-3.5 relative z-10',
          isLearning || showAddAnimation ? 'text-success' : 'text-muted-foreground'
        )} />
      </motion.div>

      {/* Count with animation */}
      <div className="flex items-center gap-1.5 relative z-10">
        <AnimatePresence mode="wait">
          <motion.span
            key={nodes.length}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            className={cn(
              'text-xs font-semibold',
              isLearning || showAddAnimation ? 'text-success' : 'text-foreground'
            )}
          >
            {nodes.length}
          </motion.span>
        </AnimatePresence>
        <span className={cn(
          'text-xs',
          isLearning || showAddAnimation ? 'text-success/80' : 'text-muted-foreground'
        )}>
          updates
        </span>
      </div>

      {/* Mini inline visualization - colored dots */}
      <div className="flex items-center gap-0.5 ml-1 relative z-10">
        {/* Entity dots */}
        {Array.from({ length: Math.min(nodesByType.entity, 3) }).map((_, i) => (
          <motion.div
            key={`entity-${i}`}
            className="w-1.5 h-1.5 rounded-full bg-primary"
            initial={showAddAnimation && i === nodesByType.entity - 1 ? { scale: 0 } : { scale: 1 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          />
        ))}
        {nodesByType.entity > 3 && (
          <span className="text-[9px] text-primary ml-0.5">+{nodesByType.entity - 3}</span>
        )}
        
        {/* Rule dots */}
        {Array.from({ length: Math.min(nodesByType.rule, 3) }).map((_, i) => (
          <motion.div
            key={`rule-${i}`}
            className="w-1.5 h-1.5 rounded-full bg-warning"
            initial={showAddAnimation && i === nodesByType.rule - 1 ? { scale: 0 } : { scale: 1 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.05 }}
          />
        ))}
        {nodesByType.rule > 3 && (
          <span className="text-[9px] text-warning ml-0.5">+{nodesByType.rule - 3}</span>
        )}
        
        {/* Fact dots */}
        {Array.from({ length: Math.min(nodesByType.fact, 3) }).map((_, i) => (
          <motion.div
            key={`fact-${i}`}
            className="w-1.5 h-1.5 rounded-full bg-success"
            initial={showAddAnimation && i === nodesByType.fact - 1 ? { scale: 0 } : { scale: 1 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.1 }}
          />
        ))}
        {nodesByType.fact > 3 && (
          <span className="text-[9px] text-success ml-0.5">+{nodesByType.fact - 3}</span>
        )}
      </div>

      {/* New knowledge sparkle */}
      <AnimatePresence>
        {showAddAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -top-1 -right-1 z-20"
          >
            <Sparkles className="w-3 h-3 text-success" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

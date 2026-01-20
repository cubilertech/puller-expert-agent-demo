import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronDown, Sparkles, CheckCircle2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ContextGraphCanvas } from './ContextGraphCanvas';
import { ContextGraphModal } from './ContextGraphModal';
import { KnowledgeNode, LearningSignal } from '@/types';
import { cn } from '@/lib/utils';

interface ContextGraphHeaderProps {
  nodes: KnowledgeNode[];
  isLearning: boolean;
  newNodeLabel?: string;
  learningSignal?: LearningSignal | null;
  onDismissSignal?: () => void;
}

export function ContextGraphHeader({ 
  nodes, 
  isLearning, 
  newNodeLabel,
  learningSignal,
  onDismissSignal 
}: ContextGraphHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddAnimation, setShowAddAnimation] = useState(false);
  const [prevNodeCount, setPrevNodeCount] = useState(nodes.length);
  const [showDottedFlow, setShowDottedFlow] = useState(false);
  const [isAutoOpened, setIsAutoOpened] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nodesByType = {
    entity: nodes.filter(n => n.type === 'entity').length,
    rule: nodes.filter(n => n.type === 'rule').length,
    fact: nodes.filter(n => n.type === 'fact').length,
  };

  // Detect when new nodes are added and auto-open popover with longer delay
  useEffect(() => {
    if (nodes.length > prevNodeCount) {
      setShowAddAnimation(true);
      setIsAutoOpened(true);
      setIsOpen(true);
      setShowDottedFlow(true);
      
      // Show dotted flow animation for 2.5 seconds, then close popover
      const dottedTimer = setTimeout(() => {
        setShowDottedFlow(false);
        // Auto-close the popover once update completes (only if auto-opened)
        setIsOpen(false);
        setIsAutoOpened(false);
      }, 2500);
      
      // Keep add animation longer
      const animTimer = setTimeout(() => setShowAddAnimation(false), 4000);
      
      return () => {
        clearTimeout(dottedTimer);
        clearTimeout(animTimer);
      };
    }
    setPrevNodeCount(nodes.length);
  }, [nodes.length, prevNodeCount]);

  // Auto-close popover after learning signal dismisses with longer delay
  useEffect(() => {
    if (!learningSignal && isOpen && isAutoOpened) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        setIsAutoOpened(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [learningSignal, isOpen, isAutoOpened]);

  // Handle manual open/close - reset auto-opened state when manually interacted
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // User manually opened, so don't hide the graph
      setIsAutoOpened(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <motion.button
          className={cn(
            'flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all relative overflow-hidden',
            isLearning || showAddAnimation
              ? 'bg-success/10 border-success/30 hover:bg-success/20'
              : 'bg-muted/30 border-border hover:bg-muted/50',
            isOpen && 'ring-2 ring-success/30'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
              learned
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

          {/* Expand indicator */}
          <ChevronDown className={cn(
            'w-3 h-3 transition-transform relative z-10',
            isLearning || showAddAnimation ? 'text-success/60' : 'text-muted-foreground',
            isOpen && 'rotate-180'
          )} />

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
        </motion.button>
      </PopoverTrigger>

      <PopoverContent 
        className="w-96 p-0 overflow-hidden" 
        align="end"
        sideOffset={8}
      >
        {/* Learning Signal Banner with Dotted Flow Animation */}
        <AnimatePresence>
          {learningSignal && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25, duration: 0.5 }}
              className="overflow-hidden"
            >
              <div className="bg-success/10 border-b border-success/20 p-4 relative">
                <div className="flex items-center gap-2 mb-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </motion.div>
                  <span className="text-xs font-semibold text-success">
                    Updating Context Graph
                  </span>
                </div>
                
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="bg-background/50 rounded-md p-3 font-mono text-xs relative"
                >
                  <span className="text-primary">{learningSignal.rule}</span>
                  <span className="text-muted-foreground"> = </span>
                  <span className="text-success">{learningSignal.value}</span>
                  
                  {/* Dotted flow animation line */}
                  <AnimatePresence>
                    {showDottedFlow && (
                      <motion.div 
                        className="absolute -right-4 top-1/2 -translate-y-1/2 flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {/* Animated dots flowing to header */}
                        <div className="flex items-center gap-1">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1 h-1 rounded-full bg-success"
                              initial={{ opacity: 0, x: 0 }}
                              animate={{ 
                                opacity: [0, 1, 1, 0],
                                x: [0, 20, 40, 60],
                                y: [0, -5, -10, -15]
                              }}
                              transition={{
                                duration: 1.5,
                                delay: i * 0.15,
                                repeat: Infinity,
                                ease: 'easeOut'
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-[10px] text-muted-foreground mt-3 flex items-center gap-2"
                >
                  <span>Adding to context graph...</span>
                  {showDottedFlow && (
                    <motion.span 
                      className="flex items-center gap-0.5"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <span className="w-1 h-1 rounded-full bg-success/60" />
                      <span className="w-1 h-1 rounded-full bg-success/60" />
                      <span className="w-1 h-1 rounded-full bg-success/60" />
                    </motion.span>
                  )}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Context Graph Canvas */}
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 288 }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="overflow-hidden"
        >
          <ContextGraphCanvas
            nodes={nodes}
            isLearning={isLearning}
            newNodeLabel={newNodeLabel}
            onExpand={() => {
              setIsOpen(false);
              setIsModalOpen(true);
            }}
            compact
          />
        </motion.div>
      </PopoverContent>

      {/* Expanded Modal */}
      <ContextGraphModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        nodes={nodes}
        isLearning={isLearning}
        newNodeLabel={newNodeLabel}
      />
    </Popover>
  );
}
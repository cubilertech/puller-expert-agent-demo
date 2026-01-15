import { motion, Variants, AnimatePresence } from 'framer-motion';
import { Bot, User, Zap, MessageSquare, ChevronDown, ChevronRight, Quote, Send, X, Loader2, Brain, Search, FileCheck, Sparkles, Package, AlertTriangle, Hammer, Gift } from 'lucide-react';
import { ChatMessage, TaskStatus } from '@/types';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState, useCallback } from 'react';

// Processing stages configuration with detailed sub-steps based on pipeline
const processingStages: { 
  status: TaskStatus; 
  label: string; 
  icon: typeof Brain; 
  description: string;
  details: string[];
}[] = [
  { 
    status: 'ingesting', 
    label: 'Ingesting', 
    icon: Search, 
    description: 'Receiving and interpreting the request',
    details: [
      'Receive request and identify user',
      'Parse task and extract entities',
      'Review history and assess urgency',
      'Infer intent and map terms',
      'Predict variables and resolve timing'
    ]
  },
  { 
    status: 'asserting', 
    label: 'Assert', 
    icon: AlertTriangle, 
    description: 'Identifying issues and forming assumptions',
    details: [
      'List issues and propose hypotheses',
      'Rank risks and form assumptions',
      'Set confidence levels',
      'Clarify selective criteria',
      'Record assumptions for validation'
    ]
  },
  { 
    status: 'planning', 
    label: 'Planning', 
    icon: Brain, 
    description: 'Selecting metrics and defining approach',
    details: [
      'Select metrics and choose tables',
      'Define joins and set grain',
      'Apply filters and outline CTEs',
      'Draft output structure'
    ]
  },
  { 
    status: 'building', 
    label: 'Build', 
    icon: Hammer, 
    description: 'Writing queries and constructing logic',
    details: [
      'Write SQL and bring models',
      'Validate refs and enforce rules',
      'Optimize structure and flag logic',
      'Annotate code for clarity'
    ]
  },
  { 
    status: 'validating', 
    label: 'Validating', 
    icon: FileCheck, 
    description: 'Checking accuracy and detecting anomalies',
    details: [
      'Check counts and inspect nulls',
      'Detect drift and compare baseline',
      'Reconcile anomalies',
      'Escalate issues if needed'
    ]
  },
  { 
    status: 'generating', 
    label: 'Generate Result', 
    icon: Gift, 
    description: 'Formatting outputs and delivering artifacts',
    details: [
      'Format outputs and generate tables',
      'Annotate results and attach SQL',
      'Deliver artifacts to user'
    ]
  },
];

// Typing effect component
function TypingText({ text, delay = 0, speed = 15, onComplete }: { 
  text: string; 
  delay?: number; 
  speed?: number;
  onComplete?: () => void;
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    
    const startTimeout = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          // Type multiple characters at once for faster feel
          const charsToAdd = Math.min(3, text.length - currentIndex);
          setDisplayedText(text.slice(0, currentIndex + charsToAdd));
          currentIndex += charsToAdd;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(startTimeout);
  }, [text, delay, speed, onComplete]);
  
  return (
    <span>{displayedText}</span>
  );
}

// Flow stages for the context thread
type FlowStage = 'requestor' | 'thinking' | 'result' | 'artifacts';

// Thinking out loud component - lean design with collapsible steps
function ThinkingSteps({ 
  currentStatus, 
  onComplete,
  isComplete: externalIsComplete = false
}: { 
  currentStatus: TaskStatus;
  onComplete?: () => void;
  isComplete?: boolean;
}) {
  const currentStageIndex = processingStages.findIndex(s => s.status === currentStatus);
  const isProcessing = currentStageIndex >= 0;
  const [completedStages, setCompletedStages] = useState<Set<TaskStatus>>(new Set());
  const previousStatus = useRef<TaskStatus | null>(null);
  const hasCompleted = useRef(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  
  const allComplete = externalIsComplete || completedStages.size === processingStages.length;
  
  // Toggle individual step expansion
  const toggleStep = (status: string) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  };
  
  // Sync completed stages with actual task status
  useEffect(() => {
    if (externalIsComplete) {
      const allStages = new Set(processingStages.map(s => s.status));
      setCompletedStages(allStages);
      setIsExpanded(false);
      return;
    }
    
    if (!isProcessing) {
      const allStages = new Set(processingStages.map(s => s.status));
      setCompletedStages(allStages);
      
      if (!hasCompleted.current) {
        hasCompleted.current = true;
        setIsExpanded(false);
        setTimeout(() => onComplete?.(), 300);
      }
      return;
    }
    
    const newCompleted = new Set<TaskStatus>();
    processingStages.forEach((stage, idx) => {
      if (idx < currentStageIndex) {
        newCompleted.add(stage.status);
      }
    });
    setCompletedStages(newCompleted);
    previousStatus.current = currentStatus;
  }, [currentStatus, currentStageIndex, isProcessing, onComplete, externalIsComplete]);
  
  useEffect(() => {
    if (currentStageIndex === 0) {
      hasCompleted.current = false;
      setIsExpanded(true);
      setExpandedSteps(new Set());
    }
  }, [currentStageIndex]);
  
  const processingTime = allComplete ? "2.4s" : null;
  const completedCount = completedStages.size;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "mb-3 rounded-lg border transition-colors",
        allComplete ? "bg-muted/10 border-border/20" : "bg-muted/20 border-border/40"
      )}
    >
      {/* Compact Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted/20 transition-colors rounded-lg"
      >
        {isExpanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        )}
        
        {allComplete ? (
          <motion.svg 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-3.5 h-3.5 text-primary" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </motion.svg>
        ) : (
          <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
        )}
        
        <span className="text-[11px] font-medium text-foreground">
          {allComplete ? "Thought process" : "Thinking"}
        </span>
        
        {/* Inline progress dots */}
        {!allComplete && (
          <div className="flex items-center gap-0.5 ml-1">
            {processingStages.map((stage, idx) => (
              <div
                key={stage.status}
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-colors duration-300',
                  idx < currentStageIndex ? 'bg-primary' : 
                  idx === currentStageIndex ? 'bg-primary animate-pulse' : 
                  'bg-muted-foreground/30'
                )}
              />
            ))}
          </div>
        )}
        
        <span className="ml-auto text-[10px] text-muted-foreground">
          {allComplete 
            ? `${processingTime}` 
            : `${completedCount}/${processingStages.length}`
          }
        </span>
      </button>
      
      {/* Expandable Steps */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-2 space-y-0.5">
              {processingStages.map((stage, idx) => {
                const Icon = stage.icon;
                const isComplete = completedStages.has(stage.status) || allComplete;
                const isCurrent = idx === currentStageIndex && !allComplete;
                const isPending = idx > currentStageIndex && !allComplete;
                const isStepExpanded = expandedSteps.has(stage.status) || isCurrent;
                
                return (
                  <div key={stage.status}>
                    {/* Step Header - Clickable */}
                    <button
                      onClick={() => !isCurrent && toggleStep(stage.status)}
                      disabled={isPending}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded transition-all text-left",
                        isCurrent && "bg-primary/5",
                        isComplete && !isCurrent && "hover:bg-muted/30",
                        isPending && "opacity-40 cursor-not-allowed"
                      )}
                    >
                      {/* Status indicator */}
                      <div className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0",
                        isComplete && "bg-primary/20 text-primary",
                        isCurrent && "bg-primary text-primary-foreground",
                        isPending && "bg-muted text-muted-foreground"
                      )}>
                        {isComplete ? (
                          <motion.svg 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2.5 h-2.5" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="3"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </motion.svg>
                        ) : isCurrent ? (
                          <Loader2 className="w-2.5 h-2.5 animate-spin" />
                        ) : (
                          <Icon className="w-2.5 h-2.5" />
                        )}
                      </div>
                      
                      {/* Label */}
                      <span className={cn(
                        "text-[11px] font-medium flex-1",
                        isCurrent && "text-primary",
                        isComplete && !isCurrent && "text-foreground",
                        isPending && "text-muted-foreground"
                      )}>
                        {stage.label}
                      </span>
                      
                      {/* Expand indicator for completed steps */}
                      {isComplete && !isCurrent && (
                        <ChevronRight className={cn(
                          "w-3 h-3 text-muted-foreground transition-transform",
                          isStepExpanded && "rotate-90"
                        )} />
                      )}
                      
                      {/* Active indicator */}
                      {isCurrent && (
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                          className="flex gap-0.5"
                        >
                          <span className="w-1 h-1 rounded-full bg-primary" />
                          <span className="w-1 h-1 rounded-full bg-primary" />
                          <span className="w-1 h-1 rounded-full bg-primary" />
                        </motion.div>
                      )}
                    </button>
                    
                    {/* Step Details - Collapsible */}
                    <AnimatePresence>
                      {isStepExpanded && !isPending && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-6 pl-2 border-l border-border/50 py-1 space-y-1">
                            <p className="text-[10px] text-muted-foreground">
                              {isCurrent ? (
                                <TypingText text={stage.description} speed={25} />
                              ) : (
                                stage.description
                              )}
                            </p>
                            {/* Detail sub-steps with typing effect */}
                            <ul className="space-y-0.5">
                              {stage.details.map((detail, detailIdx) => (
                                <motion.li
                                  key={detailIdx}
                                  initial={{ opacity: 0, x: -5 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: detailIdx * 0.1 }}
                                  className="text-[10px] text-muted-foreground/80 flex items-start gap-1.5"
                                >
                                  {isComplete ? (
                                    <span className="text-primary/60 flex-shrink-0">✓</span>
                                  ) : isCurrent ? (
                                    <motion.span
                                      animate={{ opacity: [0.3, 1, 0.3] }}
                                      transition={{ duration: 1, repeat: Infinity, delay: detailIdx * 0.2 }}
                                      className="text-primary flex-shrink-0"
                                    >
                                      →
                                    </motion.span>
                                  ) : (
                                    <span className="text-muted-foreground/40 flex-shrink-0">○</span>
                                  )}
                                  <span className="flex-1">
                                    {isCurrent ? (
                                      <TypingText 
                                        text={detail} 
                                        speed={20} 
                                        delay={detailIdx * 400 + 200}
                                      />
                                    ) : (
                                      detail
                                    )}
                                  </span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface ThreadComment {
  id: string;
  quotedText: string;
  sourceMessageId: string;
  comment: string;
  timestamp: Date;
}

interface ContextThreadProps {
  messages: ChatMessage[];
  taskTitle: string;
  taskStatus?: TaskStatus;
  onArtifactsReady?: () => void;
}

const senderConfig = {
  user: { icon: User, color: 'bg-primary', label: 'Requestor' },
  agent: { icon: Bot, color: 'bg-secondary', label: 'Puller Agent' },
  system: { icon: Zap, color: 'bg-warning', label: 'System' },
};

const typeStyles = {
  text: 'bg-card',
  reasoning: 'bg-accent/50 border-l-2 border-primary/30',
  action: 'bg-warning/10 border-l-2 border-warning/50',
};

// Container variants for staggered children
const messageVariants: Variants = {
  hidden: { opacity: 0, y: -20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Avatar pop animation
const avatarVariants: Variants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 20,
    },
  },
};

// Label fade in
const labelVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
};

// Content blur reveal
const contentVariants: Variants = {
  hidden: { opacity: 0, filter: 'blur(8px)', x: -15 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    x: 0,
    transition: { duration: 0.4 },
  },
};

// Badge scale in
const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 500,
      damping: 25,
      delay: 0.1,
    },
  },
};


export function ContextThread({ messages, taskTitle, taskStatus, onArtifactsReady }: ContextThreadProps) {
  const isProcessingTask = taskStatus && ['ingesting', 'planning', 'reasoning', 'validating'].includes(taskStatus);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [expandedAssumptions, setExpandedAssumptions] = useState<Record<string, boolean>>({});
  
  // Flow stage management
  const [flowStage, setFlowStage] = useState<FlowStage>('requestor');
  const previousTaskTitle = useRef(taskTitle);
  
  // Track which messages have been "revealed" for typing effect
  const [revealedMessages, setRevealedMessages] = useState<Set<string>>(new Set());
  const [visibleMessageIndex, setVisibleMessageIndex] = useState(0);
  
  // Comment state
  const [threadComments, setThreadComments] = useState<ThreadComment[]>([]);
  const [selectedText, setSelectedText] = useState<{ text: string; messageId: string } | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [showCommentPopover, setShowCommentPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const commentInputRef = useRef<HTMLInputElement>(null);

  // Separate user messages (requestor) from agent messages (results)
  const requestorMessages = messages.filter(m => m.sender === 'user');
  const agentMessages = messages.filter(m => m.sender !== 'user');

  // Reset animation state when task changes
  useEffect(() => {
    if (previousTaskTitle.current !== taskTitle) {
      setFlowStage('requestor');
      setRevealedMessages(new Set());
      setVisibleMessageIndex(0);
      setExpandedAssumptions({});
      setThreadComments([]);
      previousTaskTitle.current = taskTitle;
      
      // Start the thinking phase after showing requestor message
      setTimeout(() => {
        setFlowStage('thinking');
      }, 600);
    }
  }, [taskTitle]);

  // Handle thinking complete
  const handleThinkingComplete = useCallback(() => {
    setFlowStage('result');
  }, []);

  // Handle artifacts ready
  const handleResultsComplete = useCallback(() => {
    setFlowStage('artifacts');
    onArtifactsReady?.();
  }, [onArtifactsReady]);

  // Progressively reveal agent messages one by one
  useEffect(() => {
    if (flowStage !== 'result') return;
    
    if (visibleMessageIndex >= agentMessages.length) {
      // All messages revealed, notify artifacts are ready
      setTimeout(() => {
        handleResultsComplete();
      }, 500);
      return;
    }
    
    // Calculate delay based on previous message content length
    const prevMessage = agentMessages[visibleMessageIndex - 1];
    const baseDelay = visibleMessageIndex === 0 ? 300 : 800;
    const contentDelay = prevMessage ? Math.min(prevMessage.content.length * 5, 1500) : 0;
    
    const timer = setTimeout(() => {
      setVisibleMessageIndex(prev => prev + 1);
    }, baseDelay + contentDelay);
    
    return () => clearTimeout(timer);
  }, [visibleMessageIndex, agentMessages, flowStage, handleResultsComplete]);

  // Mark message as revealed when typing completes
  const handleMessageTypingComplete = useCallback((messageId: string) => {
    setRevealedMessages(prev => new Set([...prev, messageId]));
  }, []);

  const toggleAssumptions = (messageId: string) => {
    setExpandedAssumptions(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  // Handle text selection for commenting
  const handleTextSelection = useCallback((messageId: string) => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    
    if (text && text.length > 0) {
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      
      if (rect) {
        setSelectedText({ text, messageId });
        setPopoverPosition({
          top: rect.bottom + 8,
          left: Math.min(rect.left, window.innerWidth - 280)
        });
        setShowCommentPopover(true);
        setTimeout(() => commentInputRef.current?.focus(), 100);
      }
    }
  }, []);

  // Submit comment
  const handleSubmitComment = useCallback(() => {
    if (!selectedText || !commentInput.trim()) return;
    
    const newComment: ThreadComment = {
      id: `comment-${Date.now()}`,
      quotedText: selectedText.text,
      sourceMessageId: selectedText.messageId,
      comment: commentInput.trim(),
      timestamp: new Date()
    };
    
    setThreadComments(prev => [...prev, newComment]);
    setCommentInput('');
    setSelectedText(null);
    setShowCommentPopover(false);
    window.getSelection()?.removeAllRanges();
  }, [selectedText, commentInput]);

  // Cancel comment
  const handleCancelComment = useCallback(() => {
    setShowCommentPopover(false);
    setSelectedText(null);
    setCommentInput('');
    window.getSelection()?.removeAllRanges();
  }, []);

  // Scroll-follow behavior
  useEffect(() => {
    if (lastMessageRef.current && scrollRef.current) {
      const timer = setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'end' 
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [messages.length, threadComments.length, visibleMessageIndex, flowStage]);

  // Render a single message
  const renderMessage = (message: ChatMessage, index: number, isLastVisible: boolean, isLastMessage: boolean, isAgentMessage: boolean = false) => {
    const { icon: Icon, color, label } = senderConfig[message.sender];
    const hasAssumptions = message.assumptions && message.assumptions.length > 0;
    const isExpanded = expandedAssumptions[message.id] ?? false;
    const isRevealed = revealedMessages.has(message.id);
    const shouldType = isAgentMessage && isLastVisible && !isRevealed;
    
    return (
      <div 
        key={message.id} 
        id={`message-${message.id}`}
        className="relative"
        ref={isLastMessage ? lastMessageRef : undefined}
      >
        <motion.div
          variants={messageVariants}
          initial="hidden"
          animate="visible"
          className={cn(
            'rounded-lg p-4 relative z-10',
            typeStyles[message.type]
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <motion.div 
              variants={avatarVariants}
              className={cn('w-7 h-7 rounded-full flex items-center justify-center', color)}
            >
              <Icon className="w-4 h-4 text-foreground" />
            </motion.div>
            
            <motion.span 
              variants={labelVariants}
              className="text-xs font-medium text-foreground"
            >
              {label}
            </motion.span>
            
            <motion.span 
              variants={labelVariants}
              className="text-xs text-muted-foreground ml-auto"
            >
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </motion.span>
          </div>
          
          <div className="pl-9">
            {/* Assumptions at TOP - show first for agent messages */}
            {hasAssumptions && isAgentMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-3"
              >
                <button
                  onClick={() => toggleAssumptions(message.id)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="font-medium">Assumptions ({message.assumptions!.length})</span>
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-accent/30 rounded-md p-3 border border-primary/20 overflow-hidden"
                    >
                      <ul className="space-y-2">
                        {message.assumptions!.map((assumption, idx) => (
                          <motion.li 
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="text-xs text-muted-foreground flex items-start gap-2"
                          >
                            <span className="text-primary/60 mt-0.5 flex-shrink-0">•</span>
                            <span className="flex-1">{assumption}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Result description with typing effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0 }}
            >
              <motion.p 
                variants={contentVariants}
                className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed cursor-text select-text"
                onMouseUp={() => handleTextSelection(message.id)}
              >
                {shouldType ? (
                  <TypingText 
                    text={message.content} 
                    speed={12}
                    delay={0}
                    onComplete={() => handleMessageTypingComplete(message.id)}
                  />
                ) : (
                  message.content
                )}
              </motion.p>
            </motion.div>
            
            {/* Assumptions for non-agent messages (requestor) */}
            {hasAssumptions && !isAgentMessage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4"
              >
                <button
                  onClick={() => toggleAssumptions(message.id)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="font-medium">Assumptions ({message.assumptions!.length})</span>
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-muted/50 rounded-md p-3 border border-border/50 overflow-hidden"
                    >
                      <ul className="space-y-2">
                        {message.assumptions!.map((assumption, idx) => (
                          <motion.li 
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.15 }}
                            className="text-xs text-muted-foreground flex items-start gap-2"
                          >
                            <motion.span 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: idx * 0.15 + 0.1 }}
                              className="text-primary/60 mt-0.5 flex-shrink-0"
                            >
                              •
                            </motion.span>
                            <span className="flex-1">{assumption}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
            
            {/* Badges - show after typing for agent messages */}
            {message.type === 'reasoning' && (!isAgentMessage || isRevealed) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 flex items-center gap-1"
              >
                <span className="text-[10px] text-primary/70 bg-primary/10 px-2 py-1 rounded">
                  REASONING
                </span>
              </motion.div>
            )}
            {message.type === 'action' && (!isAgentMessage || isRevealed) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 flex items-center gap-1"
              >
                <span className="text-[10px] text-warning bg-warning/10 px-2 py-1 rounded">
                  ACTION
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">Workflow Thread</h3>
        </div>
        <p className="text-xs text-muted-foreground truncate">{taskTitle}</p>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-3"
      >
        {/* Stage 1: Requestor Messages */}
        <AnimatePresence>
          {requestorMessages.map((message, index) => (
            renderMessage(
              message, 
              index, 
              index === requestorMessages.length - 1, 
              flowStage === 'requestor' && index === requestorMessages.length - 1 && threadComments.length === 0
            )
          ))}
        </AnimatePresence>

        {/* Stage 2: Thinking Steps - Persists after completion like ChatGPT research */}
        {(flowStage === 'thinking' || flowStage === 'result' || flowStage === 'artifacts') && taskStatus && (
          <ThinkingSteps 
            currentStatus={taskStatus} 
            onComplete={handleThinkingComplete}
            isComplete={flowStage === 'result' || flowStage === 'artifacts'}
          />
        )}

        {/* Stage 3: Result Processing Animation */}
        <AnimatePresence>
          {flowStage === 'result' && visibleMessageIndex === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="p-4 bg-secondary/20 rounded-lg border border-border/40"
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                </motion.div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-foreground">Preparing Results</div>
                  <div className="text-[10px] text-muted-foreground">
                    <TypingText 
                      text="Compiling analysis and generating response..." 
                      speed={25}
                    />
                  </div>
                </div>
              </div>
              
              {/* Processing progress bar */}
              <motion.div className="h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-primary rounded-full"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 4: Agent Result Messages */}
        <AnimatePresence>
          {(flowStage === 'result' || flowStage === 'artifacts') && visibleMessageIndex > 0 ? (
            <>
              {agentMessages.slice(0, visibleMessageIndex).map((message, index) => {
                const isLastVisible = index === visibleMessageIndex - 1;
                const isLastMessage = isLastVisible && flowStage !== 'artifacts' && threadComments.length === 0;
                const isRevealed = revealedMessages.has(message.id);
                
                return (
                  <div key={message.id}>
                    {renderMessage(message, index, isLastVisible, isLastMessage, true)}
                    
                    {/* Show loading indicator between messages */}
                    {isLastVisible && flowStage === 'result' && visibleMessageIndex < agentMessages.length && isRevealed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 px-4 py-2 mt-2"
                      >
                        <div className="flex gap-1">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            className="w-1.5 h-1.5 rounded-full bg-primary/60"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            className="w-1.5 h-1.5 rounded-full bg-primary/60"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            className="w-1.5 h-1.5 rounded-full bg-primary/60"
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">Processing...</span>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </>
          ) : null}
        </AnimatePresence>

        {/* Stage 4: Artifacts Loading Indicator */}
        <AnimatePresence>
          {flowStage === 'artifacts' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3 bg-primary/5 rounded-lg border border-primary/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-medium text-foreground">Artifacts Ready</div>
                  <div className="text-[10px] text-muted-foreground">Review the generated code and results →</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Thread Comments - appear as reply messages, clickable to scroll to source */}
        <AnimatePresence>
          {threadComments.map((comment, index) => {
            const isLast = index === threadComments.length - 1;
            
            const scrollToSource = () => {
              const sourceElement = document.getElementById(`message-${comment.sourceMessageId}`);
              if (sourceElement) {
                sourceElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Briefly highlight the source message
                sourceElement.classList.add('ring-2', 'ring-warning/50', 'ring-offset-2', 'ring-offset-background');
                setTimeout(() => {
                  sourceElement.classList.remove('ring-2', 'ring-warning/50', 'ring-offset-2', 'ring-offset-background');
                }, 2000);
              }
            };
            
            return (
              <motion.div
                key={comment.id}
                ref={isLast ? lastMessageRef : undefined}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative"
              >
              <div className="rounded-lg p-4 bg-warning/5 border border-warning/20 relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-warning flex items-center justify-center">
                      <Quote className="w-3.5 h-3.5 text-warning-foreground" />
                    </div>
                    <span className="text-xs font-medium text-foreground">Comment</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {comment.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="pl-9">
                    {/* Quoted text - clickable to scroll to source */}
                    <button
                      onClick={scrollToSource}
                      className="w-full text-left bg-muted/50 border-l-2 border-warning/50 pl-3 py-2 rounded-r mb-2 hover:bg-muted/70 transition-colors group"
                    >
                      <p className="text-xs text-muted-foreground italic group-hover:text-foreground/70 transition-colors">
                        "{comment.quotedText.length > 80 
                          ? comment.quotedText.slice(0, 80) + '...' 
                          : comment.quotedText}"
                      </p>
                    </button>
                    
                    {/* Comment text */}
                    <p className="text-sm text-foreground/90">{comment.comment}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Comment popover */}
      <AnimatePresence>
        {showCommentPopover && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            style={{ top: popoverPosition.top, left: popoverPosition.left }}
            className="fixed z-[9999] w-64 bg-popover border border-border rounded-lg shadow-xl p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <Quote className="w-3.5 h-3.5 text-warning" />
              <span className="text-xs font-medium text-foreground">Add comment</span>
              <button 
                onClick={handleCancelComment}
                className="ml-auto p-0.5 hover:bg-muted rounded"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
            
            {/* Selected text preview */}
            <div className="bg-muted/50 border-l-2 border-warning/50 pl-2 py-1.5 rounded-r mb-2">
              <p className="text-[10px] text-muted-foreground italic truncate">
                "{selectedText?.text.slice(0, 50)}..."
              </p>
            </div>
            
            {/* Comment input */}
            <div className="flex gap-2">
              <input
                ref={commentInputRef}
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                placeholder="Your comment..."
                className="flex-1 text-xs bg-muted/50 border border-border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-warning/50"
              />
              <button
                onClick={handleSubmitComment}
                disabled={!commentInput.trim()}
                className="p-1.5 bg-warning text-warning-foreground rounded hover:bg-warning/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area placeholder */}
      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/50 rounded-lg text-muted-foreground text-xs">
          <Bot className="w-4 h-4" />
          <span>
            {flowStage === 'requestor' && 'Reading request...'}
            {flowStage === 'thinking' && 'Agent is thinking...'}
            {flowStage === 'result' && 'Generating response...'}
            {flowStage === 'artifacts' && 'Agent awaiting review...'}
          </span>
        </div>
      </div>
    </div>
  );
}

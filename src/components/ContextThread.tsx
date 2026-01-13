import { motion, Variants, AnimatePresence } from 'framer-motion';
import { Bot, User, Zap, MessageSquare, ChevronDown, ChevronRight, Quote, Send, X } from 'lucide-react';
import { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState, useCallback } from 'react';

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


export function ContextThread({ messages, taskTitle }: ContextThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [expandedAssumptions, setExpandedAssumptions] = useState<Record<string, boolean>>({});
  
  // Comment state
  const [threadComments, setThreadComments] = useState<ThreadComment[]>([]);
  const [selectedText, setSelectedText] = useState<{ text: string; messageId: string } | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [showCommentPopover, setShowCommentPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const commentInputRef = useRef<HTMLInputElement>(null);

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
  }, [messages.length, threadComments.length]);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="px-3 py-2 border-b border-border">
        <div className="flex items-center gap-1.5 mb-0.5">
          <MessageSquare className="w-3.5 h-3.5 text-primary" />
          <h3 className="font-semibold text-xs text-foreground">Workflow Thread</h3>
        </div>
        <p className="text-[10px] text-muted-foreground truncate">{taskTitle}</p>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2 space-y-0.5"
      >
        {messages.map((message, index) => {
          const { icon: Icon, color, label } = senderConfig[message.sender];
          const isLastMessage = index === messages.length - 1 && threadComments.length === 0;
          const hasAssumptions = message.assumptions && message.assumptions.length > 0;
          const isExpanded = expandedAssumptions[message.id] ?? true;
          
          // Adaptive timing
          const cumulativeDelay = index < 3 
            ? index * 0.2 
            : (3 * 0.2) + (index - 3) * 0.12;
          
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
                transition={{ delay: cumulativeDelay }}
                className={cn(
                  'rounded-md p-2 relative z-10',
                  typeStyles[message.type]
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <motion.div 
                    variants={avatarVariants}
                    className={cn('w-5 h-5 rounded-full flex items-center justify-center', color)}
                  >
                    <Icon className="w-3 h-3 text-foreground" />
                  </motion.div>
                  
                  <motion.span 
                    variants={labelVariants}
                    className="text-[10px] font-medium text-foreground"
                  >
                    {label}
                  </motion.span>
                  
                  <motion.span 
                    variants={labelVariants}
                    className="text-[10px] text-muted-foreground ml-auto"
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </motion.span>
                </div>
                
                <div className="pl-6">
                  {/* Selectable content - highlight to comment */}
                  <motion.p 
                    variants={contentVariants}
                    className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed cursor-text select-text"
                    onMouseUp={() => handleTextSelection(message.id)}
                  >
                    {message.content}
                  </motion.p>
                  
                  {/* Nested Assumptions */}
                  {hasAssumptions && (
                    <motion.div 
                      variants={badgeVariants}
                      className="mt-3"
                    >
                      <button
                        onClick={() => toggleAssumptions(message.id)}
                        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors mb-1"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                        <span className="font-medium">Assumptions ({message.assumptions!.length})</span>
                      </button>
                      
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-muted/50 rounded p-1.5 border border-border/50"
                        >
                          <ul className="space-y-0.5">
                            {message.assumptions!.map((assumption, idx) => (
                              <li 
                                key={idx}
                                className="text-[10px] text-muted-foreground flex items-start gap-1.5"
                              >
                                <span className="text-primary/60 mt-0.5">•</span>
                                <span>{assumption}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                  
                  {/* Badges */}
                  {message.type === 'reasoning' && (
                    <motion.div 
                      variants={badgeVariants}
                      className="mt-1 flex items-center gap-1"
                    >
                      <span className="text-[9px] text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded">
                        REASONING
                      </span>
                    </motion.div>
                  )}
                  {message.type === 'action' && (
                    <motion.div 
                      variants={badgeVariants}
                      className="mt-1 flex items-center gap-1"
                    >
                      <span className="text-[9px] text-warning bg-warning/10 px-1.5 py-0.5 rounded">
                        ACTION
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}

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
                <div className="rounded-md p-2 bg-warning/5 border border-warning/20 relative z-10">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-5 h-5 rounded-full bg-warning flex items-center justify-center">
                      <Quote className="w-2.5 h-2.5 text-warning-foreground" />
                    </div>
                    <span className="text-[10px] font-medium text-foreground">Comment</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      {comment.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="pl-6">
                    {/* Quoted text - clickable to scroll to source */}
                    <button
                      onClick={scrollToSource}
                      className="w-full text-left bg-muted/50 border-l-2 border-warning/50 pl-2 py-1 rounded-r mb-1 hover:bg-muted/70 transition-colors group"
                    >
                      <p className="text-[10px] text-muted-foreground italic group-hover:text-foreground/70 transition-colors">
                        "{comment.quotedText.length > 80 
                          ? comment.quotedText.slice(0, 80) + '...' 
                          : comment.quotedText}"
                      </p>
                    </button>
                    
                    {/* Comment text */}
                    <p className="text-xs text-foreground/90">{comment.comment}</p>
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
      <div className="px-2 py-1.5 border-t border-border">
        <div className="flex items-center gap-1.5 px-2 py-1.5 bg-muted/50 rounded text-muted-foreground text-[10px]">
          <Bot className="w-3 h-3" />
          <span>Agent awaiting review...</span>
        </div>
      </div>
    </div>
  );
}

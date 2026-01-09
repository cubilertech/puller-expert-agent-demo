import { motion, Variants } from 'framer-motion';
import { Bot, User, Zap, MessageSquare } from 'lucide-react';
import { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

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

// Connection line variants
const lineVariants: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.3 },
  },
};

export function ContextThread({ messages, taskTitle }: ContextThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

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
  }, [messages.length]);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">Workflow</h3>
        </div>
        <p className="text-xs text-muted-foreground truncate">{taskTitle}</p>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-1"
      >
        {messages.map((message, index) => {
          const { icon: Icon, color, label } = senderConfig[message.sender];
          const isLast = index === messages.length - 1;
          
          // Adaptive timing
          const cumulativeDelay = index < 3 
            ? index * 0.2 
            : (3 * 0.2) + (index - 3) * 0.12;
          
          return (
            <div 
              key={message.id} 
              className="relative"
              ref={isLast ? lastMessageRef : undefined}
            >
              {/* Connection line to next message */}
              {index < messages.length - 1 && (
                <motion.div
                  variants={lineVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: cumulativeDelay + 0.4 }}
                  className="absolute left-[19px] top-[52px] w-[2px] h-[calc(100%-20px)] bg-gradient-to-b from-primary/30 to-primary/10 origin-top"
                />
              )}
              
              <motion.div
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: cumulativeDelay }}
                className={cn(
                  'rounded-lg p-3 relative z-10',
                  typeStyles[message.type]
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  {/* Animated Avatar */}
                  <motion.div 
                    variants={avatarVariants}
                    className={cn('w-6 h-6 rounded-full flex items-center justify-center', color)}
                  >
                    <Icon className="w-3.5 h-3.5 text-foreground" />
                  </motion.div>
                  
                  {/* Animated Label */}
                  <motion.span 
                    variants={labelVariants}
                    className="text-xs font-medium text-foreground"
                  >
                    {label}
                  </motion.span>
                  
                  {/* Animated Timestamp */}
                  <motion.span 
                    variants={labelVariants}
                    className="text-xs text-muted-foreground ml-auto"
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </motion.span>
                </div>
                
                <div className="pl-8">
                  {/* Animated Content with blur reveal */}
                  <motion.p 
                    variants={contentVariants}
                    className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed"
                  >
                    {message.content}
                  </motion.p>
                  
                  {/* Animated Badges */}
                  {message.type === 'reasoning' && (
                    <motion.div 
                      variants={badgeVariants}
                      className="mt-2 flex items-center gap-1"
                    >
                      <span className="text-[10px] text-primary/70 bg-primary/10 px-2 py-0.5 rounded">
                        REASONING
                      </span>
                    </motion.div>
                  )}
                  {message.type === 'action' && (
                    <motion.div 
                      variants={badgeVariants}
                      className="mt-2 flex items-center gap-1"
                    >
                      <span className="text-[10px] text-warning bg-warning/10 px-2 py-0.5 rounded">
                        ACTION REQUIRED
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Input area placeholder */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg text-muted-foreground text-sm">
          <Bot className="w-4 h-4" />
          <span>Agent is awaiting expert review...</span>
        </div>
      </div>
    </div>
  );
}

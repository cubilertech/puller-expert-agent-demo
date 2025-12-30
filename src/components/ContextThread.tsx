import { motion } from 'framer-motion';
import { Bot, User, Zap, MessageSquare } from 'lucide-react';
import { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

interface ContextThreadProps {
  messages: ChatMessage[];
  taskTitle: string;
}

const senderConfig = {
  user: { icon: User, color: 'bg-primary', label: 'Requestor' },
  agent: { icon: Bot, color: 'bg-secondary', label: 'Puller Agent' },
  system: { icon: Zap, color: 'bg-success', label: 'System' },
};

const typeStyles = {
  text: 'bg-card',
  reasoning: 'bg-accent/50 border-l-2 border-primary/30',
  action: 'bg-success/10 border-l-2 border-success/50',
};

export function ContextThread({ messages, taskTitle }: ContextThreadProps) {
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">Context Thread</h3>
        </div>
        <p className="text-xs text-muted-foreground truncate">{taskTitle}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {messages.map((message, index) => {
          const { icon: Icon, color, label } = senderConfig[message.sender];
          
          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'rounded-lg p-3',
                typeStyles[message.type]
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={cn('w-6 h-6 rounded-full flex items-center justify-center', color)}>
                  <Icon className="w-3.5 h-3.5 text-foreground" />
                </div>
                <span className="text-xs font-medium text-foreground">{label}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="pl-8">
                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
                {message.type === 'reasoning' && (
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-[10px] text-primary/70 bg-primary/10 px-2 py-0.5 rounded">
                      REASONING
                    </span>
                  </div>
                )}
                {message.type === 'action' && (
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-[10px] text-success bg-success/10 px-2 py-0.5 rounded">
                      ACTION REQUIRED
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
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

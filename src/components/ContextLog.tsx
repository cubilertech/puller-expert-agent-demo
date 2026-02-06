import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, MessageSquare, Plug, Video, ChevronDown, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { ContextItem, ContextSource } from '@/types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ContextLogProps {
  items: ContextItem[];
}

const sourceIcons: Record<ContextSource, React.ElementType> = {
  upload: Upload,
  chat: MessageSquare,
  api: Plug,
  'screen-record': Video,
};

const sourceLabels: Record<ContextSource, string> = {
  upload: 'Upload',
  chat: 'Chat',
  api: 'API',
  'screen-record': 'Recording',
};

const typeBadgeStyles: Record<string, string> = {
  entity: 'bg-primary/20 text-primary border-primary/30',
  rule: 'bg-warning/20 text-warning border-warning/30',
  fact: 'bg-success/20 text-success border-success/30',
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function groupItemsByDate(items: ContextItem[]): { label: string; items: ContextItem[] }[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  const groups: { label: string; items: ContextItem[] }[] = [
    { label: 'Today', items: [] },
    { label: 'Yesterday', items: [] },
    { label: 'Earlier', items: [] },
  ];

  items.forEach((item) => {
    const itemDate = new Date(item.timestamp);
    if (itemDate >= today) {
      groups[0].items.push(item);
    } else if (itemDate >= yesterday) {
      groups[1].items.push(item);
    } else {
      groups[2].items.push(item);
    }
  });

  return groups.filter((g) => g.items.length > 0);
}

function ContextLogEntry({ item, isProcessing }: { item: ContextItem; isProcessing?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = sourceIcons[item.source];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        boxShadow: isProcessing ? '0 0 20px hsl(var(--primary) / 0.3)' : 'none'
      }}
      transition={{ duration: 0.3 }}
      className={cn(
        'border border-border rounded-lg p-3 cursor-pointer transition-all hover:border-primary/30 hover:bg-muted/30 relative overflow-hidden',
        item.status === 'pending' && 'border-primary/50 bg-primary/5',
        isProcessing && 'border-primary/60'
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Processing shimmer effect */}
      {item.status === 'pending' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        />
      )}
      
      <div className="flex items-start gap-3 relative z-10">
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
          item.status === 'pending' ? 'bg-primary/20' : 'bg-muted'
        )}>
          {item.status === 'pending' ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
          ) : (
            <Icon className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge 
              variant="outline" 
              className={cn('text-[10px] px-1.5 py-0 capitalize', typeBadgeStyles[item.type])}
            >
              {item.type}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              {sourceLabels[item.source]}
            </span>
            {item.status === 'pending' && (
              <motion.span
                className="text-[10px] text-primary font-medium"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                Processing...
              </motion.span>
            )}
          </div>
          
          <p className={cn(
            'text-sm text-foreground',
            !isExpanded && 'line-clamp-2'
          )}>
            {item.content}
          </p>
          
          <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{formatRelativeTime(item.timestamp)}</span>
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 ml-auto" />
            ) : (
              <ChevronRight className="w-3 h-3 ml-auto" />
            )}
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && item.metadata && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden relative z-10"
          >
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Metadata</p>
              <div className="space-y-1">
                {Object.entries(item.metadata).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground capitalize">{key}:</span>
                    <span className="text-foreground">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ContextLog({ items }: ContextLogProps) {
  const groupedItems = groupItemsByDate(items);
  
  // Track which items are currently processing - hooks must be before early return
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    const pendingItems = items.filter(i => i.status === 'pending');
    if (pendingItems.length > 0) {
      setProcessingIds(new Set(pendingItems.map(i => i.id)));
    }
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">No context yet</p>
          <p className="text-xs text-muted-foreground">
            Add context using the input methods on the right
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Processing summary banner */}
        <AnimatePresence>
          {items.some(i => i.status === 'pending') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-primary/10 border border-primary/30 rounded-lg p-3 flex items-center gap-3"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
              <div>
                <p className="text-sm font-medium text-foreground">Processing new context...</p>
                <p className="text-xs text-muted-foreground">
                  {items.filter(i => i.status === 'pending').length} item(s) being analyzed
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {groupedItems.map((group) => (
          <div key={group.label}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {group.label}
              </span>
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] text-muted-foreground">
                {group.items.length} items
              </span>
            </div>
            <div className="space-y-2">
              {group.items.map((item) => (
                <ContextLogEntry 
                  key={item.id} 
                  item={item} 
                  isProcessing={processingIds.has(item.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

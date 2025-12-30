import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { Task, TaskStatus } from '@/types';
import { cn } from '@/lib/utils';

interface TaskFeedProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
}

const statusConfig: Record<TaskStatus, { icon: typeof Activity; color: string; label: string }> = {
  pending: { icon: Clock, color: 'text-muted-foreground', label: 'Pending' },
  review: { icon: AlertCircle, color: 'text-warning', label: 'Ready for Review' },
  approved: { icon: CheckCircle2, color: 'text-success', label: 'Approved' },
  learning: { icon: Zap, color: 'text-success', label: 'Learning...' },
};

const priorityColors = {
  low: 'border-l-muted-foreground/30',
  medium: 'border-l-primary/50',
  high: 'border-l-warning',
};

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function TaskFeed({ tasks, selectedTaskId, onSelectTask }: TaskFeedProps) {
  return (
    <div className="h-full flex flex-col bg-sidebar">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Activity className="w-5 h-5 text-primary" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full pulse-live" />
          </div>
          <h2 className="font-semibold text-foreground">The Pulse</h2>
          <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {tasks.length} tasks
          </span>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-2">
        <AnimatePresence mode="popLayout">
          {tasks.map((task, index) => {
            const StatusIcon = statusConfig[task.status].icon;
            const isSelected = task.id === selectedTaskId;
            const isReview = task.status === 'review';

            return (
              <motion.button
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectTask(task.id)}
                className={cn(
                  'w-full text-left p-3 rounded-lg border-l-2 transition-all duration-200',
                  'bg-card hover:bg-accent',
                  priorityColors[task.priority],
                  isSelected && 'ring-1 ring-primary glow-primary',
                  isReview && !isSelected && 'animate-pulse-glow'
                )}
              >
                <div className="flex items-start gap-3">
                  <StatusIcon
                    className={cn(
                      'w-4 h-4 mt-0.5 flex-shrink-0',
                      statusConfig[task.status].color,
                      task.status === 'learning' && 'animate-spin'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground truncate">
                        {task.title}
                      </span>
                      {isReview && (
                        <span className="flex-shrink-0 text-[10px] font-medium text-warning bg-warning/10 px-1.5 py-0.5 rounded">
                          REVIEW
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground truncate">
                        {task.requestor}
                      </span>
                      <span className="text-xs text-muted-foreground/50">•</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(task.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-sidebar-border bg-muted/30">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-semibold text-foreground">
              {tasks.filter((t) => t.status === 'pending').length}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Pending
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold text-warning">
              {tasks.filter((t) => t.status === 'review').length}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Review
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold text-success">
              {tasks.filter((t) => t.status === 'approved').length}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Done
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

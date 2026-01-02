import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Zap,
  Mail,
  MessageSquare,
  Users,
  Flame,
  UserCheck,
  Crown,
  Brain,
  Search,
  ShieldCheck,
  Inbox,
  CircleDot
} from 'lucide-react';
import { Task, TaskStatus, TaskSource, CONFIDENCE_THRESHOLD } from '@/types';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface TaskFeedProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
}

const statusConfig: Record<TaskStatus, { icon: typeof Activity; color: string; label: string }> = {
  ingesting: { icon: Clock, color: 'text-muted-foreground', label: 'Ingesting' },
  planning: { icon: Brain, color: 'text-info', label: 'Planning' },
  reasoning: { icon: Search, color: 'text-info', label: 'Reasoning' },
  validating: { icon: ShieldCheck, color: 'text-info', label: 'Validating' },
  review: { icon: AlertCircle, color: 'text-warning', label: 'Expert Review' },
  approved: { icon: CheckCircle2, color: 'text-success', label: 'Approved' },
  learning: { icon: Zap, color: 'text-success', label: 'Learning...' },
};

const sourceConfig: Record<TaskSource, { icon: typeof Mail; label: string }> = {
  email: { icon: Mail, label: 'Email' },
  slack: { icon: MessageSquare, label: 'Slack' },
  meeting: { icon: Users, label: 'Meeting' },
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

// Processing pipeline stages
const pipelineStages: TaskStatus[] = ['ingesting', 'planning', 'reasoning', 'validating'];

function getStageIndex(status: TaskStatus): number {
  const idx = pipelineStages.indexOf(status);
  return idx === -1 ? pipelineStages.length : idx;
}

// Tab definitions
type TabType = 'incoming' | 'review' | 'completed';

function filterTasksByTab(tasks: Task[], tab: TabType): Task[] {
  switch (tab) {
    case 'incoming':
      return tasks.filter(t => ['ingesting', 'planning', 'reasoning', 'validating'].includes(t.status));
    case 'review':
      // Sort by priority (high first) and urgency
      return tasks
        .filter(t => t.status === 'review')
        .sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          const aPriority = priorityOrder[a.priority];
          const bPriority = priorityOrder[b.priority];
          if (aPriority !== bPriority) return aPriority - bPriority;
          // Then by urgency flag
          const aUrgent = a.flags?.urgency ? 0 : 1;
          const bUrgent = b.flags?.urgency ? 0 : 1;
          return aUrgent - bUrgent;
        });
    case 'completed':
      return tasks.filter(t => ['approved', 'learning'].includes(t.status));
    default:
      return tasks;
  }
}

interface TaskItemProps {
  task: Task;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

function TaskItem({ task, index, isSelected, onSelect }: TaskItemProps) {
  const statusInfo = statusConfig[task.status] || statusConfig.ingesting;
  const sourceInfo = sourceConfig[task.source] || sourceConfig.email;
  const StatusIcon = statusInfo.icon;
  const SourceIcon = sourceInfo.icon;
  const isReview = task.status === 'review';
  const isProcessing = ['ingesting', 'planning', 'reasoning', 'validating'].includes(task.status);
  const currentStage = getStageIndex(task.status);
  const lowConfidence = (task.confidence ?? 50) < CONFIDENCE_THRESHOLD;
  const flags = task.flags || { urgency: false, humanRequested: false, vip: false };

  return (
    <motion.button
      key={task.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05 }}
      onClick={onSelect}
      className={cn(
        'w-full text-left p-3 rounded-lg border-l-2 transition-all duration-200',
        'bg-card hover:bg-accent',
        priorityColors[task.priority],
        isSelected && 'ring-1 ring-primary glow-primary',
        // Static warning treatment for review tasks instead of animation
        isReview && !isSelected && 'ring-1 ring-warning/50 bg-warning/5'
      )}
    >
      {/* Source & Flags Row */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
          <SourceIcon className="w-3 h-3" />
          {sourceConfig[task.source].label}
        </span>
        
        {flags.urgency && (
          <span className="flex items-center gap-0.5 text-[10px] text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">
            <Flame className="w-3 h-3" />
            Urgent
          </span>
        )}
        {flags.humanRequested && (
          <span className="flex items-center gap-0.5 text-[10px] text-warning bg-warning/10 px-1.5 py-0.5 rounded">
            <UserCheck className="w-3 h-3" />
            Escalated
          </span>
        )}
        {flags.vip && (
          <span className="flex items-center gap-0.5 text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">
            <Crown className="w-3 h-3" />
            VIP
          </span>
        )}
      </div>

      <div className="flex items-start gap-3">
        <StatusIcon
          className={cn(
            'w-4 h-4 mt-0.5 flex-shrink-0',
            statusInfo.color,
            (task.status === 'learning' || isProcessing) && 'animate-spin'
          )}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-foreground truncate">
              {task.title}
            </span>
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

      {/* Pipeline Progress */}
      {isProcessing && (
        <div className="mt-3 flex items-center gap-1">
          {pipelineStages.map((stage, idx) => (
            <div
              key={stage}
              className={cn(
                'flex-1 h-1 rounded-full transition-colors',
                idx < currentStage ? 'bg-primary' : 
                idx === currentStage ? 'bg-primary animate-pulse' : 
                'bg-muted'
              )}
            />
          ))}
        </div>
      )}

      {/* Status Badge Row */}
      <div className="mt-2 flex items-center gap-2">
        <span className={cn(
          'text-[10px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wide',
          statusInfo.color,
          isReview ? 'bg-warning/10' : 'bg-muted/50'
        )}>
          {statusInfo.label}
        </span>
        
        {/* Confidence Score */}
        <span className={cn(
          'ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded',
          lowConfidence ? 'text-warning bg-warning/10' : 'text-success bg-success/10'
        )}>
          {task.confidence}% conf
        </span>
      </div>
    </motion.button>
  );
}

export function TaskFeed({ tasks, selectedTaskId, onSelectTask }: TaskFeedProps) {
  const [activeTab, setActiveTab] = useState<TabType>('incoming');
  
  const incomingCount = tasks.filter(t => ['ingesting', 'planning', 'reasoning', 'validating'].includes(t.status)).length;
  const reviewCount = tasks.filter(t => t.status === 'review').length;
  const completedCount = tasks.filter(t => ['approved', 'learning'].includes(t.status)).length;

  const filteredTasks = filterTasksByTab(tasks, activeTab);

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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)} className="flex flex-col flex-1 min-h-0">
        <TabsList className="mx-2 mt-2 grid grid-cols-3 bg-muted/50">
          <TabsTrigger value="incoming" className="text-xs gap-1.5 data-[state=active]:bg-background">
            <Inbox className="w-3.5 h-3.5" />
            Incoming
            {incomingCount > 0 && (
              <span className="ml-1 bg-primary/20 text-primary text-[10px] px-1.5 rounded-full">
                {incomingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="review" className="text-xs gap-1.5 data-[state=active]:bg-background">
            <AlertCircle className="w-3.5 h-3.5" />
            Review
            {reviewCount > 0 && (
              <span className="ml-1 bg-warning/20 text-warning text-[10px] px-1.5 rounded-full font-semibold">
                {reviewCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs gap-1.5 data-[state=active]:bg-background">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Done
            {completedCount > 0 && (
              <span className="ml-1 bg-success/20 text-success text-[10px] px-1.5 rounded-full">
                {completedCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Task List - shared across all tabs */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-8 text-muted-foreground"
              >
                <CircleDot className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No tasks in this section</p>
              </motion.div>
            ) : (
              filteredTasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  index={index}
                  isSelected={task.id === selectedTaskId}
                  onSelect={() => onSelectTask(task.id)}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
}

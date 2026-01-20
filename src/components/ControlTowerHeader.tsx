import { Activity, Shield, Database, LogOut, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ContextGraphHeader } from './ContextGraphHeader';
import { KnowledgeNode } from '@/types';

interface ControlTowerHeaderProps {
  taskCount: number;
  approvedCount: number;
  isLearning: boolean;
  onLogout?: () => void;
  onRefresh?: () => void;
  knowledgeNodes?: KnowledgeNode[];
  newNodeLabel?: string;
}

export function ControlTowerHeader({
  taskCount,
  approvedCount,
  isLearning,
  onLogout,
  onRefresh,
  knowledgeNodes = [],
  newNodeLabel
}: ControlTowerHeaderProps) {
  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground tracking-tight">
              Puller's Command Center
            </h1>
            <p className="text-[10px] text-muted-foreground -mt-0.5">
              Expert-in-the-Loop System
            </p>
          </div>
        </div>
        
        <div className="h-6 w-px bg-border mx-2" />
        
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-success rounded-full pulse-live" />
          <span className="text-xs text-muted-foreground">System Online</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Stats */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-primary" />
            <span className="text-muted-foreground">
              <span className="text-foreground font-medium">{taskCount}</span> in queue
            </span>
          </div>
          
          {/* Context Graph Header Integration */}
          <ContextGraphHeader
            nodes={knowledgeNodes}
            isLearning={isLearning}
            newNodeLabel={newNodeLabel}
          />

          <div className="flex items-center gap-1.5">
            <Database className={cn(
              'w-3.5 h-3.5 transition-colors',
              isLearning ? 'text-success animate-pulse' : 'text-muted-foreground'
            )} />
            <span className="text-muted-foreground">Context Graph</span>
          </div>
        </div>

        {/* Learning Indicator */}
        {isLearning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 bg-success/10 border border-success/20 rounded-full px-3 py-1"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            >
              <Database className="w-3 h-3 text-success" />
            </motion.div>
            <span className="text-xs font-medium text-success">Learning</span>
          </motion.div>
        )}

        {/* Refresh Demo Button */}
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-xs">Refresh</span>
          </Button>
        )}

        {/* Logout Button */}
        {onLogout && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="flex items-center gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs">Logout</span>
          </Button>
        )}
      </div>
    </header>
  );
}
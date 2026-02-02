import { motion } from 'framer-motion';
import { Brain, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ContextLog } from '@/components/ContextLog';
import { ContextInputHub } from '@/components/ContextInputHub';
import { ContextItem } from '@/types';
import { cn } from '@/lib/utils';

interface ContextHubPanelProps {
  isOpen: boolean;
  onClose: () => void;
  contextItems: ContextItem[];
  onAddContext: (item: Omit<ContextItem, 'id' | 'timestamp' | 'status'>) => void;
}

export function ContextHubPanel({ isOpen, onClose, contextItems, onAddContext }: ContextHubPanelProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-[800px] md:max-w-[900px] lg:max-w-[1000px] p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-lg font-semibold text-foreground">
                  Context Hub
                </SheetTitle>
                <p className="text-xs text-muted-foreground">
                  Manage knowledge sources and context for the AI agent
                </p>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Main Content - Split Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Side - Context Log */}
          <div className="w-1/2 border-r border-border flex flex-col">
            <div className="p-3 border-b border-border bg-muted/30">
              <h3 className="text-sm font-medium text-foreground">Context Log</h3>
              <p className="text-[10px] text-muted-foreground">
                {contextItems.length} items collected
              </p>
            </div>
            <div className="flex-1 overflow-hidden">
              <ContextLog items={contextItems} />
            </div>
          </div>

          {/* Right Side - Input Hub */}
          <div className="w-1/2 flex flex-col">
            <div className="p-3 border-b border-border bg-muted/30">
              <h3 className="text-sm font-medium text-foreground">Add Context</h3>
              <p className="text-[10px] text-muted-foreground">
                Upload, chat, connect APIs, or record
              </p>
            </div>
            <div className="flex-1 overflow-hidden">
              <ContextInputHub onAddContext={onAddContext} />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

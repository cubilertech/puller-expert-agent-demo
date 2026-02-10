import { useState } from 'react';
import { Send, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ContextItemType } from '@/types';
import { cn } from '@/lib/utils';

interface ContextChatProps {
  onSubmit: (content: string, type: ContextItemType) => void;
}

const examplePrompts = [
  { text: 'Our fiscal year ends in March', type: 'rule' as const },
  { text: 'NULL values should be treated as zero', type: 'rule' as const },
  { text: 'Product categories: Electronics, Apparel, Home', type: 'entity' as const },
  { text: 'Peak sales hours are 6-9 PM EST', type: 'fact' as const },
  { text: 'Exclude test accounts from all reports', type: 'rule' as const },
  { text: 'Revenue targets: Q1=$2M, Q2=$2.5M', type: 'fact' as const },
  { text: 'Regional managers: North=Sarah, South=Mike', type: 'entity' as const },
  { text: 'Churn = no activity in 90+ days', type: 'rule' as const },
  { text: 'Premium tier starts at $500/month', type: 'fact' as const },
  { text: 'Warehouse codes: NYC=01, LA=02, CHI=03', type: 'entity' as const },
  { text: 'Weekend orders ship Monday', type: 'rule' as const },
  { text: 'Customer segments: SMB, Mid-Market, Enterprise', type: 'entity' as const },
  { text: 'Our retail week runs Sunday-Saturday', type: 'rule' as const, isGuided: true },
];

const typeOptions: { value: ContextItemType; label: string; color: string }[] = [
  { value: 'entity', label: 'Entity', color: 'bg-primary/20 text-primary border-primary/30' },
  { value: 'rule', label: 'Rule', color: 'bg-warning/20 text-warning border-warning/30' },
  { value: 'fact', label: 'Fact', color: 'bg-success/20 text-success border-success/30' },
];

export function ContextChat({ onSubmit }: ContextChatProps) {
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState<ContextItemType>('fact');

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content.trim(), selectedType);
    setContent('');
  };

  const handleExampleClick = (example: typeof examplePrompts[0]) => {
    setContent(example.text);
    setSelectedType(example.type);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-foreground mb-1">Add Context via Chat</h3>
        <p className="text-xs text-muted-foreground">
          Describe business rules, facts, or entities in natural language
        </p>
      </div>

      {/* Example prompts - scrollable */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Lightbulb className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Examples</span>
        </div>
        <div className="max-h-[120px] overflow-y-auto pr-1 scrollbar-thin">
          <div className="flex flex-wrap gap-1.5">
            {examplePrompts.map((example, i) => (
              <button
                key={i}
                onClick={() => handleExampleClick(example)}
                className={cn(
                  "text-xs px-2 py-1 rounded-full border transition-colors",
                  (example as any).isGuided
                    ? "border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 font-medium"
                    : "border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {(example as any).isGuided && '✨ '}
                {example.text.length > 30 ? example.text.slice(0, 30) + '...' : example.text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Text input */}
      <div className="flex-1 flex flex-col">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter context information..."
          className="flex-1 resize-none min-h-[120px]"
        />

        {/* Type selector */}
        <div className="mt-3">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 block">
            Categorize as
          </span>
          <div className="flex gap-2">
            {typeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedType(option.value)}
                className={cn(
                  'flex-1 text-xs py-2 px-3 rounded-lg border transition-all',
                  selectedType === option.value
                    ? option.color
                    : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <Button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="mt-4"
        >
          <Send className="w-4 h-4 mr-2" />
          Add to Context
        </Button>

        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Press ⌘+Enter to submit
        </p>
      </div>
    </div>
  );
}

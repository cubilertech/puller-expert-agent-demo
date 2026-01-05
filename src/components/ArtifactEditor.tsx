import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, RefreshCw, FileCode, AlertTriangle, Edit3, Table, Code, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { CodeDiff } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  Table as UITable,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

interface ArtifactEditorProps {
  code: CodeDiff[];
  onApprove: () => void;
  onOverride: () => void;
  isApproving: boolean;
}

// Demo table data for the query result preview
const demoTableData = [
  { store_name: 'Downtown Seattle', month: 'November', year: 2024, total_revenue: '$2,847,392' },
  { store_name: 'Manhattan Flagship', month: 'December', year: 2024, total_revenue: '$2,654,128' },
  { store_name: 'Chicago Loop', month: 'November', year: 2024, total_revenue: '$2,312,847' },
  { store_name: 'LA Beverly Hills', month: 'October', year: 2024, total_revenue: '$2,198,445' },
  { store_name: 'Miami Beach', month: 'December', year: 2024, total_revenue: '$1,987,234' },
];

const defaultAssumptions = `• Order value = pre-tax price + tax - discounts
• Result is the highest revenue month by a single store
• Year and Month sourced from "dim_date"
• Store-level revenue attributed to "grouped_customer_store_name"
• NULL values treated as zero (COALESCE applied)`;

const defaultMessage = `Here's the store with the highest monthly revenue:

**Downtown Seattle** achieved the highest monthly revenue of **$2,847,392** in **November 2024**.

This was calculated by summing all order values (pre-tax price + tax - discounts) for each store by month, with NULL values treated as zero.`;

type ViewMode = 'code' | 'table';

export function ArtifactEditor({ code, onApprove, onOverride, isApproving }: ArtifactEditorProps) {
  const [showDiff, setShowDiff] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('code');
  const [isEditingAssumptions, setIsEditingAssumptions] = useState(false);
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [isEditingQuery, setIsEditingQuery] = useState(false);
  const [hasEditedQuery, setHasEditedQuery] = useState(false);
  const [assumptions, setAssumptions] = useState(defaultAssumptions);
  const [message, setMessage] = useState(defaultMessage);
  const [queryCode, setQueryCode] = useState(() => 
    code.filter(line => line.type !== 'removed').map(line => line.content).join('\n')
  );
  const [assumptionsExpanded, setAssumptionsExpanded] = useState(true);
  const [messageExpanded, setMessageExpanded] = useState(true);
  
  const hasChanges = code.some(line => line.type !== 'unchanged');

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">Artifact Editor</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('code')}
            className={cn(
              'text-xs px-2 py-1 rounded transition-colors flex items-center gap-1',
              viewMode === 'code' 
                ? 'bg-primary/20 text-primary' 
                : 'bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            <Code className="w-3 h-3" />
            Query
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={cn(
              'text-xs px-2 py-1 rounded transition-colors flex items-center gap-1',
              viewMode === 'table' 
                ? 'bg-primary/20 text-primary' 
                : 'bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            <Table className="w-3 h-3" />
            Preview
          </button>
        </div>
      </div>

      {/* Expert Note */}
      {hasChanges && (
        <div className="px-3 py-2 bg-warning/10 border-b border-warning/20 flex items-center gap-2 flex-shrink-0">
          <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
          <span className="text-xs text-warning">
            Expert modification: Added COALESCE to handle NULL revenue values
          </span>
        </div>
      )}

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        {/* Editable Assumptions Section */}
        <div className="border-b border-border">
          <button
            onClick={() => setAssumptionsExpanded(!assumptionsExpanded)}
            className="w-full px-3 py-2 flex items-center justify-between hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Assumptions</span>
              {!isEditingAssumptions && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingAssumptions(true);
                    setAssumptionsExpanded(true);
                  }}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  title="Edit assumptions"
                >
                  <Edit3 className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            {assumptionsExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          <AnimatePresence>
            {assumptionsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-3 pb-3">
                  {isEditingAssumptions ? (
                    <div className="space-y-2">
                      <Textarea
                        value={assumptions}
                        onChange={(e) => setAssumptions(e.target.value)}
                        className="text-xs font-mono min-h-[100px] bg-muted/30 border-border"
                        placeholder="Enter assumptions..."
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEditingAssumptions(false)}
                          className="text-xs h-7"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setIsEditingAssumptions(false)}
                          className="text-xs h-7"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground whitespace-pre-wrap bg-muted/20 rounded p-2">
                      {assumptions}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Editable Message Section */}
        <div className="border-b border-border">
          <button
            onClick={() => setMessageExpanded(!messageExpanded)}
            className="w-full px-3 py-2 flex items-center justify-between hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Response Message</span>
              {!isEditingMessage && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingMessage(true);
                    setMessageExpanded(true);
                  }}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  title="Edit message"
                >
                  <Edit3 className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            {messageExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          <AnimatePresence>
            {messageExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-3 pb-3">
                  {isEditingMessage ? (
                    <div className="space-y-2">
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="text-xs min-h-[120px] bg-muted/30 border-border"
                        placeholder="Enter response message..."
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEditingMessage(false)}
                          className="text-xs h-7"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setIsEditingMessage(false)}
                          className="text-xs h-7"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-foreground whitespace-pre-wrap bg-muted/20 rounded p-2">
                      {message}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Code / Table View */}
        <div className="p-3">
          {viewMode === 'code' ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">query.sql</span>
                  {!isEditingQuery && (
                    <button
                      onClick={() => setIsEditingQuery(true)}
                      className="p-1 hover:bg-muted rounded transition-colors"
                      title="Edit query"
                    >
                      <Edit3 className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </div>
                {!isEditingQuery && (
                  <button
                    onClick={() => setShowDiff(!showDiff)}
                    className={cn(
                      'text-xs px-2 py-0.5 rounded transition-colors',
                      showDiff 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {showDiff ? 'Hide Diff' : 'Show Diff'}
                  </button>
                )}
              </div>
              {isEditingQuery ? (
                <div className="space-y-2">
                  <Textarea
                    value={queryCode}
                    onChange={(e) => setQueryCode(e.target.value)}
                    className="text-xs font-mono min-h-[200px] bg-muted/30 border-border"
                    placeholder="Enter SQL query..."
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditingQuery(false)}
                      className="text-xs h-7"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setIsEditingQuery(false);
                        setHasEditedQuery(true);
                      }}
                      className="text-xs h-7"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : hasEditedQuery ? (
                <div className="bg-muted/20 rounded overflow-auto">
                  <pre className="code-editor text-xs">
                    <code>
                      {queryCode.split('\n').map((line, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.02 }}
                          className="flex"
                        >
                          <span className="code-line-number">{index + 1}</span>
                          <span className="flex-1">{line}</span>
                        </motion.div>
                      ))}
                    </code>
                  </pre>
                </div>
              ) : (
                <div className="bg-muted/20 rounded overflow-auto">
                  <pre className="code-editor text-xs">
                    <code>
                      {code.map((line, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.02 }}
                          className={cn(
                            'flex',
                            showDiff && line.type === 'added' && 'diff-added',
                            showDiff && line.type === 'removed' && 'diff-removed'
                          )}
                        >
                          <span className="code-line-number">{line.lineNumber}</span>
                          <span className={cn(
                            'flex-1',
                            line.type === 'added' && 'text-success',
                            line.type === 'removed' && 'text-destructive'
                          )}>
                            {showDiff && line.type !== 'unchanged' && (
                              <span className="inline-block w-4 text-center opacity-50">
                                {line.type === 'added' ? '+' : '-'}
                              </span>
                            )}
                            {line.content}
                          </span>
                        </motion.div>
                      ))}
                    </code>
                  </pre>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-muted-foreground">Result Preview (5 rows)</span>
              </div>
              <div className="bg-muted/20 rounded overflow-auto border border-border">
                <UITable>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-xs h-8 px-2">store_name</TableHead>
                      <TableHead className="text-xs h-8 px-2">month</TableHead>
                      <TableHead className="text-xs h-8 px-2">year</TableHead>
                      <TableHead className="text-xs h-8 px-2 text-right">total_revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoTableData.map((row, index) => (
                      <TableRow key={index} className="border-border">
                        <TableCell className="text-xs py-2 px-2 font-medium">{row.store_name}</TableCell>
                        <TableCell className="text-xs py-2 px-2">{row.month}</TableCell>
                        <TableCell className="text-xs py-2 px-2">{row.year}</TableCell>
                        <TableCell className="text-xs py-2 px-2 text-right font-mono text-success">{row.total_revenue}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </UITable>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 border-t border-border bg-card/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onOverride}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Override
          </Button>
          <AnimatePresence mode="wait">
            {isApproving ? (
              <motion.div
                key="approving"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex-1 flex items-center justify-center gap-2 h-9 bg-success/20 rounded-md"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <ShieldCheck className="w-4 h-4 text-success" />
                </motion.div>
                <span className="text-sm text-success font-medium">Processing...</span>
              </motion.div>
            ) : (
              <motion.div
                key="approve"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex-1"
              >
                <Button
                  onClick={onApprove}
                  className="w-full bg-success hover:bg-success/90 text-success-foreground flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send to Requestor
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Response will be sent to the requestor for verification
        </p>
      </div>
    </div>
  );
}

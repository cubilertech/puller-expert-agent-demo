import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, RefreshCw, FileCode, AlertTriangle, Edit3, Table, Code, ChevronDown, ChevronUp, Send, Plus, Sparkles, MessageSquare, X, Maximize2, Minimize2, Lightbulb } from 'lucide-react';
import { CodeDiff, SqlAnnotation, TableColumn, Assumption as AssumptionType } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { CommentThread } from '@/components/CommentThread';
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
  annotations?: SqlAnnotation[];
  onApprove: () => void;
  onOverride: () => void;
  isApproving: boolean;
  hideActions?: boolean;
  // Dynamic data props
  tableColumns?: TableColumn[];
  tableData?: Record<string, string | number>[];
  initialAssumptions?: AssumptionType[];
  initialMessage?: string;
}

interface Assumption {
  id: string;
  text: string;
  includeInMessage: boolean;
}

type CommentSection = 'message' | 'assumption' | 'table' | 'sql';

interface Comment {
  id: string;
  section: CommentSection;
  targetId?: string;
  selection: string;
  text: string;
  position: number;
}

// Default/fallback demo table data
const defaultTableColumns: TableColumn[] = [
  { key: 'store_name', label: 'Store Name', align: 'left' },
  { key: 'month', label: 'Month', align: 'left' },
  { key: 'year', label: 'Year', align: 'left' },
  { key: 'total_revenue', label: 'Total Revenue', align: 'right' },
];

const defaultTableData = [
  { store_name: 'Downtown Seattle', month: 'November', year: 2024, total_revenue: '$2,847,392' },
  { store_name: 'Manhattan Flagship', month: 'December', year: 2024, total_revenue: '$2,654,128' },
  { store_name: 'Chicago Loop', month: 'November', year: 2024, total_revenue: '$2,312,847' },
  { store_name: 'LA Beverly Hills', month: 'October', year: 2024, total_revenue: '$2,198,445' },
  { store_name: 'Miami Beach', month: 'December', year: 2024, total_revenue: '$1,987,234' },
];

const defaultAssumptions: Assumption[] = [
  { id: '1', text: 'Order value = pre-tax price + tax - discounts', includeInMessage: true },
  { id: '2', text: 'Result is the highest revenue month by a single store', includeInMessage: true },
  { id: '3', text: 'Year and Month sourced from "dim_date"', includeInMessage: false },
  { id: '4', text: 'Store-level revenue attributed to "grouped_customer_store_name"', includeInMessage: false },
  { id: '5', text: 'NULL values treated as zero (COALESCE applied)', includeInMessage: true },
];

const defaultMessage = `Here's the store with the highest monthly revenue:

**Downtown Seattle** achieved the highest monthly revenue of **$2,847,392** in **November 2024**.

This was calculated by summing all order values (pre-tax price + tax - discounts) for each store by month, with NULL values treated as zero.`;

type ViewMode = 'code' | 'table';

export function ArtifactEditor({ 
  code, 
  annotations = [], 
  onApprove, 
  onOverride, 
  isApproving, 
  hideActions = false,
  tableColumns = defaultTableColumns,
  tableData = defaultTableData,
  initialAssumptions,
  initialMessage
}: ArtifactEditorProps) {
  const [showDiff, setShowDiff] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [isEditingQuery, setIsEditingQuery] = useState(false);
  const [hasEditedQuery, setHasEditedQuery] = useState(false);
  const [assumptions, setAssumptions] = useState<Assumption[]>(initialAssumptions || defaultAssumptions);
  const [message, setMessage] = useState(initialMessage || defaultMessage);
  const [queryCode, setQueryCode] = useState(() => 
    code.filter(line => line.type !== 'removed').map(line => line.content).join('\n')
  );
  
  // Reset state when task data changes
  useEffect(() => {
    setAssumptions(initialAssumptions || defaultAssumptions);
    setMessage(initialMessage || defaultMessage);
    setQueryCode(code.filter(line => line.type !== 'removed').map(line => line.content).join('\n'));
    setIsEditingMessage(false);
    setIsEditingQuery(false);
    setHasEditedQuery(false);
  }, [initialAssumptions, initialMessage, code]);
  const [assumptionsExpanded, setAssumptionsExpanded] = useState(true);
  const [messageExpanded, setMessageExpanded] = useState(true);
  const [queryExpanded, setQueryExpanded] = useState(false);
  const [newAssumption, setNewAssumption] = useState('');
  const [isAddingAssumption, setIsAddingAssumption] = useState(false);
  const [isMicroLearning, setIsMicroLearning] = useState(false);
  const [microLearningField, setMicroLearningField] = useState<string | null>(null);
  const [isQueryExpanded, setIsQueryExpanded] = useState(false);
  const [hoveredAnnotation, setHoveredAnnotation] = useState<number | null>(null);
  
  // Comment system state
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentPopoverPosition, setCommentPopoverPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [commentPosition, setCommentPosition] = useState(0);
  const [activeCommentSection, setActiveCommentSection] = useState<CommentSection>('message');
  const [activeCommentTargetId, setActiveCommentTargetId] = useState<string | undefined>();
  const [focusedCommentId, setFocusedCommentId] = useState<string | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const assumptionsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const sqlRef = useRef<HTMLDivElement>(null);
  
  const hasChanges = code.some(line => line.type !== 'unchanged');
  
  // Compute which annotation applies to each line
  const lineAnnotationMap = useMemo(() => {
    const map: Record<number, number> = {};
    annotations.forEach((ann, idx) => {
      for (let line = ann.lineStart; line <= ann.lineEnd; line++) {
        map[line] = idx;
      }
    });
    return map;
  }, [annotations]);
  
  // Get annotation type colors
  const getAnnotationColor = (type: string) => {
    switch (type) {
      case 'expert': return 'border-warning bg-warning/10 text-warning';
      case 'selection': return 'border-primary bg-primary/10 text-primary';
      case 'source': return 'border-cyan-500 bg-cyan-500/10 text-cyan-400';
      case 'aggregation': return 'border-violet-500 bg-violet-500/10 text-violet-400';
      case 'filter': return 'border-orange-500 bg-orange-500/10 text-orange-400';
      case 'grouping': return 'border-emerald-500 bg-emerald-500/10 text-emerald-400';
      case 'ordering': return 'border-pink-500 bg-pink-500/10 text-pink-400';
      default: return 'border-muted bg-muted/20 text-muted-foreground';
    }
  };

  // Handle text selection for commenting
  const handleTextSelect = (section: CommentSection, targetId?: string, containerRef?: React.RefObject<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const ref = containerRef || messageRef;
      const containerRect = ref.current?.getBoundingClientRect();
      
      if (containerRect) {
        setSelectedText(selection.toString());
        setCommentPosition(rect.top - containerRect.top);
        // Set fixed position for popover near the selection
        setCommentPopoverPosition({
          top: rect.bottom + 8, // 8px below selection
          left: Math.min(rect.left, window.innerWidth - 240) // Ensure popover doesn't overflow right
        });
        setActiveCommentSection(section);
        setActiveCommentTargetId(targetId);
        setShowCommentInput(true);
      }
    }
  };

  const handleAddComment = () => {
    if (selectedText && newComment.trim()) {
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        section: activeCommentSection,
        targetId: activeCommentTargetId,
        selection: selectedText,
        text: newComment,
        position: commentPosition,
      };
      setComments([...comments, comment]);
      setNewComment('');
      setShowCommentInput(false);
      setSelectedText(null);
      setActiveCommentTargetId(undefined);
      window.getSelection()?.removeAllRanges();
      
      // Trigger micro-learning
      triggerMicroLearning('comment');
    }
  };

  // Get comments for a specific section
  const getCommentsForSection = (section: CommentSection, targetId?: string) => {
    return comments.filter(c => c.section === section && (targetId ? c.targetId === targetId : true));
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter(c => c.id !== commentId));
    if (focusedCommentId === commentId) {
      setFocusedCommentId(null);
    }
  };

  // Handle clicking on highlighted text to show comment
  const handleHighlightClick = (commentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFocusedCommentId(focusedCommentId === commentId ? null : commentId);
  };

  // Render text with highlighted commented portions
  const renderHighlightedText = (text: string, section: CommentSection, targetId?: string) => {
    const sectionComments = getCommentsForSection(section, targetId);
    if (sectionComments.length === 0) return text;

    // Find all occurrences of commented text and highlight them
    let result: (string | JSX.Element)[] = [];
    let currentIndex = 0;
    
    // Sort comments by their position in the text
    const sortedComments = sectionComments
      .map(comment => ({
        ...comment,
        startIndex: text.indexOf(comment.selection)
      }))
      .filter(c => c.startIndex !== -1)
      .sort((a, b) => a.startIndex - b.startIndex);

    sortedComments.forEach((comment, idx) => {
      const startIndex = text.indexOf(comment.selection, currentIndex);
      if (startIndex === -1) return;

      // Add text before the highlight
      if (startIndex > currentIndex) {
        result.push(text.slice(currentIndex, startIndex));
      }

      // Add highlighted text
      const isFocused = focusedCommentId === comment.id;
      result.push(
        <span
          key={`highlight-${comment.id}-${idx}`}
          onClick={(e) => handleHighlightClick(comment.id, e)}
          className={cn(
            "bg-warning/30 border-b-2 border-warning cursor-pointer transition-all rounded-sm px-0.5",
            isFocused && "bg-warning/50 ring-2 ring-warning/50"
          )}
          title={comment.text}
        >
          {comment.selection}
        </span>
      );

      currentIndex = startIndex + comment.selection.length;
    });

    // Add remaining text
    if (currentIndex < text.length) {
      result.push(text.slice(currentIndex));
    }

    return result.length > 0 ? result : text;
  };

  const toggleAssumptionInMessage = (id: string) => {
    setAssumptions(prev => 
      prev.map(a => a.id === id ? { ...a, includeInMessage: !a.includeInMessage } : a)
    );
    triggerMicroLearning('assumptions');
  };

  const handleAddAssumption = () => {
    if (newAssumption.trim()) {
      const newItem: Assumption = {
        id: `${Date.now()}`,
        text: newAssumption.trim(),
        includeInMessage: false,
      };
      setAssumptions([...assumptions, newItem]);
      setNewAssumption('');
      setIsAddingAssumption(false);
      triggerMicroLearning('assumptions');
    }
  };

  const handleRemoveAssumption = (id: string) => {
    setAssumptions(assumptions.filter(a => a.id !== id));
    triggerMicroLearning('assumptions');
  };

  const triggerMicroLearning = (field: string) => {
    setIsMicroLearning(true);
    setMicroLearningField(field);
    
    // Auto-dismiss after 2 seconds
    setTimeout(() => {
      setIsMicroLearning(false);
      setMicroLearningField(null);
    }, 2000);
  };

  const handleSaveMessage = () => {
    setIsEditingMessage(false);
    triggerMicroLearning('message');
  };

  const handleSaveQuery = () => {
    setIsEditingQuery(false);
    setHasEditedQuery(true);
    triggerMicroLearning('query');
  };

  // Collapsible section animation variants
  const collapseVariants = {
    collapsed: { 
      height: 0, 
      opacity: 0,
      transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
    },
    expanded: { 
      height: 'auto', 
      opacity: 1,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }
  } as const;

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">Artifact Editor</h3>
        </div>
        
        {/* Micro-learning indicator */}
        <AnimatePresence>
          {isMicroLearning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className="flex items-center gap-1.5 px-2 py-1 bg-primary/15 border border-primary/30 rounded-full"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >
                <Sparkles className="w-3 h-3 text-primary" />
              </motion.div>
              <span className="text-[10px] text-primary font-medium">
                Processing {microLearningField}...
              </span>
            </motion.div>
          )}
        </AnimatePresence>
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
        {/* MAIN: Response Message Section (Prominent) */}
        <div className="border-b border-border">
          <button
            onClick={() => setMessageExpanded(!messageExpanded)}
            className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Response Message</span>
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
            <motion.div
              animate={{ rotate: messageExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {messageExpanded && (
              <motion.div
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                variants={collapseVariants}
                className="overflow-hidden"
              >
                <div className="px-3 pb-3 relative" ref={messageRef}>
                  {isEditingMessage ? (
                    <div className="space-y-2">
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="text-sm min-h-[140px] bg-muted/30 border-border"
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
                          onClick={handleSaveMessage}
                          className="text-xs h-7"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <div 
                        className="flex-1 text-sm text-foreground whitespace-pre-wrap bg-card/80 rounded-lg p-3 border border-border cursor-text"
                        onMouseUp={() => handleTextSelect('message')}
                      >
                        {renderHighlightedText(message, 'message')}
                      </div>
                      
                      {/* Comments sidebar for message */}
                      <CommentThread
                        comments={getCommentsForSection('message')}
                        focusedCommentId={focusedCommentId}
                        onFocusComment={setFocusedCommentId}
                        onDeleteComment={handleDeleteComment}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Assumptions Section with Checkboxes */}
        <div className="border-b border-border">
          <button
            onClick={() => setAssumptionsExpanded(!assumptionsExpanded)}
            className="w-full px-3 py-2 flex items-center justify-between hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Assumptions</span>
              <span className="text-[10px] text-muted-foreground/60">
                ({assumptions.filter(a => a.includeInMessage).length} in message)
              </span>
            </div>
            <motion.div
              animate={{ rotate: assumptionsExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {assumptionsExpanded && (
              <motion.div
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                variants={collapseVariants}
                className="overflow-hidden"
              >
                <div className="px-3 pb-3 relative" ref={assumptionsRef}>
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-1.5">
                      {assumptions.map((assumption, index) => {
                        const assumptionComments = getCommentsForSection('assumption', assumption.id);
                        return (
                          <motion.div
                            key={assumption.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="flex items-start gap-2 group"
                          >
                            <Checkbox
                              id={assumption.id}
                              checked={assumption.includeInMessage}
                              onCheckedChange={() => toggleAssumptionInMessage(assumption.id)}
                              className="mt-0.5"
                            />
                            <label
                              htmlFor={assumption.id}
                              className={cn(
                                "text-xs cursor-pointer flex-1 transition-colors select-text",
                                assumption.includeInMessage ? "text-foreground" : "text-muted-foreground"
                              )}
                              onMouseUp={() => handleTextSelect('assumption', assumption.id, assumptionsRef)}
                            >
                              {renderHighlightedText(assumption.text, 'assumption', assumption.id)}
                            </label>
                            {assumptionComments.length > 0 && (
                              <span className="text-[10px] text-warning bg-warning/10 px-1.5 py-0.5 rounded-full">
                                {assumptionComments.length}
                              </span>
                            )}
                            <button
                              onClick={() => handleRemoveAssumption(assumption.id)}
                              className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-destructive/20 rounded transition-all"
                            >
                              <X className="w-3 h-3 text-destructive" />
                            </button>
                          </motion.div>
                        );
                      })}
                      
                      {/* Add new assumption */}
                      {isAddingAssumption ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="flex items-center gap-2 mt-2"
                        >
                          <Input
                            value={newAssumption}
                            onChange={(e) => setNewAssumption(e.target.value)}
                            placeholder="New assumption..."
                            className="text-xs h-7 flex-1"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddAssumption();
                              if (e.key === 'Escape') {
                                setIsAddingAssumption(false);
                                setNewAssumption('');
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={handleAddAssumption}
                            className="text-xs h-7 px-2"
                          >
                            Add
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setIsAddingAssumption(false);
                              setNewAssumption('');
                            }}
                            className="text-xs h-7 px-2"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </motion.div>
                      ) : (
                        <button
                          onClick={() => setIsAddingAssumption(true)}
                          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors mt-2"
                        >
                          <Plus className="w-3 h-3" />
                          Add assumption
                        </button>
                      )}
                    </div>
                    
                    {/* Comments sidebar for assumptions */}
                    <CommentThread
                      comments={getCommentsForSection('assumption')}
                      focusedCommentId={focusedCommentId}
                      onFocusComment={setFocusedCommentId}
                      onDeleteComment={handleDeleteComment}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Query / Table View (Collapsible) */}
        <div className={cn("border-b border-border", isQueryExpanded && "flex-1 flex flex-col")}>
          <button
            onClick={() => setQueryExpanded(!queryExpanded)}
            className="w-full px-3 py-2 flex items-center justify-between hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Query</span>
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewMode('table');
                    setIsQueryExpanded(false);
                  }}
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded transition-colors flex items-center gap-1',
                    viewMode === 'table' 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Table className="w-2.5 h-2.5" />
                  Preview
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewMode('code');
                    setQueryExpanded(true);
                  }}
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded transition-colors flex items-center gap-1',
                    viewMode === 'code' 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Code className="w-2.5 h-2.5" />
                  SQL
                </button>
              </div>
              {viewMode === 'code' && annotations.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsQueryExpanded(!isQueryExpanded);
                    setQueryExpanded(true);
                  }}
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded transition-colors flex items-center gap-1 ml-1',
                    isQueryExpanded 
                      ? 'bg-warning/20 text-warning' 
                      : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                  )}
                  title={isQueryExpanded ? 'Collapse annotated view' : 'Expand with annotations'}
                >
                  {isQueryExpanded ? <Minimize2 className="w-2.5 h-2.5" /> : <Maximize2 className="w-2.5 h-2.5" />}
                  {isQueryExpanded ? 'Compact' : 'Annotated'}
                </button>
              )}
            </div>
            <motion.div
              animate={{ rotate: queryExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {queryExpanded && (
              <motion.div
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                variants={collapseVariants}
                className={cn("overflow-hidden", isQueryExpanded && "flex-1")}
              >
                <div className={cn("px-3 pb-3", isQueryExpanded && "h-full flex flex-col")}>
                  {viewMode === 'code' ? (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">query.sql</span>
                          {!isEditingQuery && !isQueryExpanded && (
                            <button
                              onClick={() => setIsEditingQuery(true)}
                              className="p-1 hover:bg-muted rounded transition-colors"
                              title="Edit query"
                            >
                              <Edit3 className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                            </button>
                          )}
                        </div>
                        {!isEditingQuery && !isQueryExpanded && (
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
                              onClick={handleSaveQuery}
                              className="text-xs h-7"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : isQueryExpanded && annotations.length > 0 ? (
                        // Expanded annotated SQL view
                        <div className="flex gap-4 flex-1 min-h-[300px]">
                          {/* SQL Code Panel */}
                          <div className="flex-1 bg-muted/20 rounded overflow-auto border border-border">
                            <pre className="code-editor text-xs">
                              <code>
                                {code.map((line, index) => {
                                  const annotationIdx = lineAnnotationMap[line.lineNumber];
                                  const annotation = annotationIdx !== undefined ? annotations[annotationIdx] : null;
                                  const isHighlighted = hoveredAnnotation !== null && annotationIdx === hoveredAnnotation;
                                  
                                  return (
                                    <motion.div
                                      key={index}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: index * 0.02 }}
                                      className={cn(
                                        'flex transition-colors duration-150',
                                        showDiff && line.type === 'added' && 'diff-added',
                                        showDiff && line.type === 'removed' && 'diff-removed',
                                        isHighlighted && 'bg-warning/20'
                                      )}
                                      onMouseEnter={() => annotationIdx !== undefined && setHoveredAnnotation(annotationIdx)}
                                      onMouseLeave={() => setHoveredAnnotation(null)}
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
                                  );
                                })}
                              </code>
                            </pre>
                          </div>
                          
                          {/* Annotations Panel */}
                          <div className="w-64 space-y-2 overflow-auto">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                              <Lightbulb className="w-3.5 h-3.5" />
                              <span className="font-medium">Query Annotations</span>
                            </div>
                            {annotations.map((annotation, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={cn(
                                  'p-2.5 rounded-lg border-l-2 transition-all duration-150 cursor-pointer',
                                  getAnnotationColor(annotation.type),
                                  hoveredAnnotation === idx && 'ring-1 ring-current scale-[1.02]'
                                )}
                                onMouseEnter={() => setHoveredAnnotation(idx)}
                                onMouseLeave={() => setHoveredAnnotation(null)}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[10px] font-semibold uppercase tracking-wide">
                                    {annotation.title}
                                  </span>
                                  <span className="text-[9px] opacity-60 font-mono">
                                    L{annotation.lineStart}{annotation.lineEnd !== annotation.lineStart && `-${annotation.lineEnd}`}
                                  </span>
                                </div>
                                <p className="text-[11px] leading-relaxed opacity-80">
                                  {annotation.description}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ) : hasEditedQuery ? (
                        <div className="flex gap-3 relative">
                          <div className="flex-1 bg-muted/20 rounded overflow-auto" ref={sqlRef} onMouseUp={() => handleTextSelect('sql', undefined, sqlRef)}>
                            <pre className="code-editor text-xs select-text">
                              <code>
                                {queryCode.split('\n').map((line, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.02 }}
                                    className="flex cursor-text"
                                  >
                                    <span className="code-line-number">{index + 1}</span>
                                    <span className="flex-1">{line}</span>
                                  </motion.div>
                                ))}
                              </code>
                            </pre>
                          </div>
                          
                          {/* Comments sidebar for SQL */}
                          <CommentThread
                            comments={getCommentsForSection('sql')}
                            focusedCommentId={focusedCommentId}
                            onFocusComment={setFocusedCommentId}
                            onDeleteComment={handleDeleteComment}
                          />
                          
                          {/* Comment input popover for SQL */}
                        </div>
                      ) : (
                        <div className="flex gap-3 relative">
                          <div className="flex-1 bg-muted/20 rounded overflow-auto" ref={sqlRef} onMouseUp={() => handleTextSelect('sql', undefined, sqlRef)}>
                            <pre className="code-editor text-xs select-text">
                              <code>
                                {code.map((line, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.02 }}
                                    className={cn(
                                      'flex cursor-text',
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
                          
                          {/* Comments sidebar for SQL */}
                          <CommentThread
                            comments={getCommentsForSection('sql')}
                            focusedCommentId={focusedCommentId}
                            onFocusComment={setFocusedCommentId}
                            onDeleteComment={handleDeleteComment}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-muted-foreground">Result Preview ({tableData.length} rows)</span>
                        {getCommentsForSection('table').length > 0 && (
                          <span className="text-[10px] text-warning bg-warning/10 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                            <MessageSquare className="w-2.5 h-2.5" />
                            {getCommentsForSection('table').length} comment{getCommentsForSection('table').length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1 bg-muted/20 rounded overflow-auto border border-border" ref={tableRef}>
                          <UITable>
                            <TableHeader>
                              <TableRow className="border-border">
                                {tableColumns.map((col) => (
                                  <TableHead 
                                    key={col.key} 
                                    className={cn(
                                      "text-xs h-8 px-2",
                                      col.align === 'right' && "text-right"
                                    )}
                                  >
                                    {col.label}
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {tableData.map((row, index) => (
                                <TableRow 
                                  key={index} 
                                  className="border-border cursor-text select-text"
                                  onMouseUp={() => handleTextSelect('table', `row-${index}`, tableRef)}
                                >
                                  {tableColumns.map((col, colIdx) => (
                                    <TableCell 
                                      key={col.key} 
                                      className={cn(
                                        "text-xs py-2 px-2",
                                        colIdx === 0 && "font-medium",
                                        col.align === 'right' && "text-right font-mono text-success"
                                      )}
                                    >
                                      {String(row[col.key] ?? '')}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </UITable>
                        </div>
                        
                        {/* Comments sidebar for table */}
                        <CommentThread
                          comments={getCommentsForSection('table')}
                          focusedCommentId={focusedCommentId}
                          onFocusComment={setFocusedCommentId}
                          onDeleteComment={handleDeleteComment}
                        />
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Actions - hidden when task is in Active state */}
      {!hideActions && (
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
      )}
      
      {/* Global Comment Input Popover - Fixed position, high z-index */}
      <AnimatePresence>
        {showCommentInput && selectedText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed w-56 bg-card border border-border rounded-lg p-3 shadow-xl z-[9999]"
            style={{ 
              top: Math.min(commentPopoverPosition.top, window.innerHeight - 200),
              left: commentPopoverPosition.left
            }}
          >
            <div className="flex items-center gap-1 mb-2 text-xs text-muted-foreground">
              <MessageSquare className="w-3 h-3" />
              Add comment
            </div>
            <div className="text-[10px] text-muted-foreground/70 italic mb-2 truncate">
              "{selectedText}"
            </div>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Your comment..."
              className="text-xs min-h-[60px] mb-2 bg-muted/50"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowCommentInput(false);
                  setSelectedText(null);
                  setActiveCommentTargetId(undefined);
                  window.getSelection()?.removeAllRanges();
                }}
                className="text-xs h-6 flex-1"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAddComment}
                className="text-xs h-6 flex-1"
              >
                Add
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

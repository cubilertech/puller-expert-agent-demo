import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Comment {
  id: string;
  selection: string;
  text: string;
}

interface CommentThreadProps {
  comments: Comment[];
  focusedCommentId: string | null;
  onFocusComment: (id: string | null) => void;
  onDeleteComment: (id: string) => void;
  className?: string;
}

export function CommentThread({
  comments,
  focusedCommentId,
  onFocusComment,
  onDeleteComment,
  className
}: CommentThreadProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (comments.length === 0) return null;

  const focusedComment = comments.find(c => c.id === focusedCommentId);
  const displayComment = focusedComment || comments[0];

  return (
    <div className={cn("w-32", className)}>
      {/* Collapsed view - just a badge/indicator */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center gap-1.5 px-2 py-1 rounded text-[10px] transition-all",
          isExpanded
            ? "bg-warning/20 text-warning border border-warning/40"
            : "bg-warning/10 text-warning/80 border border-warning/20 hover:border-warning/40"
        )}
      >
        <MessageSquare className="w-3 h-3 flex-shrink-0" />
        <span className="font-medium">{comments.length}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          className="ml-auto"
        >
          <ChevronDown className="w-3 h-3" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-1.5 space-y-1">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => onFocusComment(focusedCommentId === comment.id ? null : comment.id)}
                  className={cn(
                    "border rounded p-1.5 text-[10px] relative group cursor-pointer transition-all",
                    focusedCommentId === comment.id
                      ? "bg-warning/20 border-warning ring-1 ring-warning/30"
                      : "bg-warning/10 border-warning/20 hover:border-warning/40"
                  )}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteComment(comment.id);
                    }}
                    className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-muted rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-2 h-2 text-muted-foreground" />
                  </button>
                  <div className="text-warning/70 italic truncate leading-tight">"{comment.selection.slice(0, 20)}..."</div>
                  <div className="text-foreground/90 truncate mt-0.5 leading-tight">{comment.text}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show focused comment preview when collapsed */}
      {!isExpanded && focusedComment && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 border border-warning/30 bg-warning/10 rounded p-1.5 text-[10px]"
        >
          <div className="text-warning/70 italic truncate leading-tight">"{focusedComment.selection.slice(0, 20)}..."</div>
          <div className="text-foreground/90 truncate mt-0.5 leading-tight">{focusedComment.text}</div>
        </motion.div>
      )}
    </div>
  );
}

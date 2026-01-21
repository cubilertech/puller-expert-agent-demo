import { useEffect, useCallback, useRef } from 'react';
import { Task, TaskStatus, SentStatus, CONFIDENCE_THRESHOLD } from '@/types';
import { ghostTaskTemplates } from '@/data/demoData';

// Pipeline stages for automatic progression
const processingStages: TaskStatus[] = ['ingesting', 'asserting', 'planning', 'building', 'validating', 'generating'];

// Wait period before auto-advancing from Active to Done (in milliseconds)
const WAIT_PERIOD_MS = 30000; // 30 seconds for demo

export function useSimulation(
  enabled: boolean,
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  onTaskAutoComplete?: (task: Task) => void
) {
  // Track used template indices to avoid immediate duplicates
  const usedTemplateIndices = useRef<Set<number>>(new Set());
  const taskCounterRef = useRef(Date.now());

  // Progress tasks through pipeline stages
  const progressTasks = useCallback(() => {
    setTasks((prev) =>
      prev.map((task) => {
        // Skip tasks that are already completed or in waiting room
        if (['review', 'sent', 'approved', 'learning'].includes(task.status)) {
          return task;
        }

        const currentIndex = processingStages.indexOf(task.status);
        
        // If at the last processing stage (validating), decide outcome
        if (currentIndex === processingStages.length - 1) {
          const confidence = task.confidence ?? 50;
          // Below threshold → Expert Review (stays in Incoming for human review)
          // Above threshold → Sent (moves to Active tab, waiting for requestor)
          if (confidence < CONFIDENCE_THRESHOLD) {
            return { ...task, status: 'review' as TaskStatus };
          } else {
            // All tasks leaving Incoming land in Active (sent status)
            return { 
              ...task, 
              status: 'sent' as TaskStatus,
              sentStatus: 'pending' as SentStatus,
              sentAt: new Date()
            };
          }
        }

        // Move to next stage
        if (currentIndex >= 0 && currentIndex < processingStages.length - 1) {
          return { ...task, status: processingStages[currentIndex + 1] };
        }

        return task;
      })
    );
  }, [setTasks]);

  // Simulate requestor feedback progression for sent tasks
  const simulateFeedback = useCallback(() => {
    setTasks((prev) => {
      const updatedTasks = prev.map((task) => {
        if (task.status !== 'sent' || !task.sentAt) return task;

        const timeSinceSent = Date.now() - task.sentAt.getTime();

        // Simulate viewing after 5-10 seconds
        if (task.sentStatus === 'pending' && timeSinceSent > 5000 + Math.random() * 5000) {
          return { ...task, sentStatus: 'viewed' as SentStatus };
        }

        // After wait period, auto-advance to approved (no news is good news)
        if (timeSinceSent > WAIT_PERIOD_MS) {
          const completedTask = { 
            ...task, 
            status: 'approved' as TaskStatus,
            requestorFeedback: 'positive' as const
          };
          // Trigger callback for context graph update
          if (onTaskAutoComplete) {
            setTimeout(() => onTaskAutoComplete(completedTask), 0);
          }
          return completedTask;
        }

        // Small chance of negative feedback (returns to review)
        if (task.sentStatus === 'viewed' && Math.random() < 0.02) {
          return { 
            ...task, 
            status: 'review' as TaskStatus,
            sentStatus: undefined,
            sentAt: undefined,
            requestorFeedback: 'negative' as const
          };
        }

        return task;
      });
      return updatedTasks;
    });
  }, [setTasks, onTaskAutoComplete]);

  const addGhostTask = useCallback(() => {
    // Find an unused template index
    let availableIndices = ghostTaskTemplates
      .map((_, idx) => idx)
      .filter(idx => !usedTemplateIndices.current.has(idx));
    
    // If all templates used, reset the tracking
    if (availableIndices.length === 0) {
      usedTemplateIndices.current.clear();
      availableIndices = ghostTaskTemplates.map((_, idx) => idx);
    }
    
    const templateIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    usedTemplateIndices.current.add(templateIndex);
    
    const template = ghostTaskTemplates[templateIndex];
    const sources = ['email', 'slack', 'meeting'] as const;
    const randomSource = template.source || sources[Math.floor(Math.random() * sources.length)];
    
    // Use timestamp + counter for truly unique IDs
    const uniqueId = `ghost-${Date.now()}-${taskCounterRef.current++}`;
    
    const newTask: Task = {
      id: uniqueId,
      title: template.title,
      requestor: template.requestor,
      status: 'ingesting', // Always start at ingesting
      timestamp: new Date(),
      priority: template.priority,
      description: `Auto-generated task: ${template.title}`,
      source: randomSource,
      flags: template.flags || { urgency: Math.random() > 0.7, humanRequested: Math.random() > 0.8, vip: Math.random() > 0.9 },
      confidence: Math.floor(50 + Math.random() * 50),
    };

    // Only add if task with same title isn't already in processing stages
    setTasks((prev) => {
      const hasActiveWithSameTitle = prev.some(
        t => t.title === newTask.title && processingStages.includes(t.status)
      );
      if (hasActiveWithSameTitle) {
        return prev; // Skip adding duplicate
      }
      return [newTask, ...prev];
    });
  }, [setTasks]);

  useEffect(() => {
    if (!enabled) return;

    // Add a ghost task every 8-15 seconds
    const addInterval = setInterval(() => {
      addGhostTask();
    }, 8000 + Math.random() * 7000);

    // Progress tasks through pipeline every 3-5 seconds
    const progressInterval = setInterval(() => {
      progressTasks();
    }, 3000 + Math.random() * 2000);

    // Check for feedback/wait period every 2 seconds
    const feedbackInterval = setInterval(() => {
      simulateFeedback();
    }, 2000);

    return () => {
      clearInterval(addInterval);
      clearInterval(progressInterval);
      clearInterval(feedbackInterval);
    };
  }, [enabled, addGhostTask, progressTasks, simulateFeedback]);

  return { addGhostTask };
}

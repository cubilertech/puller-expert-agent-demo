import { useEffect, useCallback } from 'react';
import { Task, TaskStatus, SentStatus, CONFIDENCE_THRESHOLD } from '@/types';

// Pipeline stages for automatic progression
const processingStages: TaskStatus[] = ['ingesting', 'asserting', 'planning', 'building', 'validating', 'generating'];

// Wait period before auto-advancing from Active to Done (in milliseconds)
const WAIT_PERIOD_MS = 30000; // 30 seconds for demo

export function useSimulation(
  enabled: boolean,
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  onTaskAutoComplete?: (task: Task) => void
) {
  // Progress tasks through pipeline stages
  const progressTasks = useCallback(() => {
    setTasks((prev) =>
      prev.map((task) => {
        // Skip tasks that are already completed or in waiting room
        if (['review', 'sent', 'approved', 'learning'].includes(task.status)) {
          return task;
        }

        const currentIndex = processingStages.indexOf(task.status);
        
        // If at the last processing stage (generating), decide outcome
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

  useEffect(() => {
    if (!enabled) return;

    // Progress tasks through pipeline every 3-5 seconds
    const progressInterval = setInterval(() => {
      progressTasks();
    }, 3000 + Math.random() * 2000);

    // Check for feedback/wait period every 2 seconds
    const feedbackInterval = setInterval(() => {
      simulateFeedback();
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(feedbackInterval);
    };
  }, [enabled, progressTasks, simulateFeedback]);

  return {};
}

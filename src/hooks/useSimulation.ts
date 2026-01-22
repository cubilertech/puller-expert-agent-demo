import { useEffect, useCallback, useRef } from 'react';
import { Task, TaskStatus, SentStatus, CONFIDENCE_THRESHOLD } from '@/types';
import { allIndustryTasks } from '@/data/demoConfig';

// Pipeline stages for automatic progression
const processingStages: TaskStatus[] = ['ingesting', 'asserting', 'planning', 'building', 'validating', 'generating'];

// Wait period before auto-advancing from Active to Done (in milliseconds)
const WAIT_PERIOD_MS = 15000; // 15 seconds for demo

// Interval for injecting new tasks (in milliseconds)
const INJECT_INTERVAL_MS = 8000; // Every 8 seconds

export function useSimulation(
  enabled: boolean,
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  onTaskAutoComplete?: (task: Task) => void
) {
  // Track which tasks from the pool have been used
  const usedTaskIdsRef = useRef<Set<string>>(new Set());
  const taskPoolIndexRef = useRef(0);

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

        return task;
      });
      return updatedTasks;
    });
  }, [setTasks, onTaskAutoComplete]);

  // Inject new tasks from the pool into the queue
  const injectNewTask = useCallback(() => {
    setTasks((prev) => {
      // Define which statuses block recycling
      const incomingStatuses: TaskStatus[] = [...processingStages, 'review'];
      const activeStatuses: TaskStatus[] = ['sent'];
      
      // Get original IDs of tasks currently in blocked states
      const blockedOriginalIds = new Set(
        prev
          .filter(t => [...incomingStatuses, ...activeStatuses].includes(t.status))
          .map(t => t.originalId || t.id.split('-')[0])
      );

      // Find available tasks: not used in current cycle AND not blocked
      let availableTasks = allIndustryTasks.filter(
        t => !usedTaskIdsRef.current.has(t.id) && !blockedOriginalIds.has(t.id)
      );

      // If all tasks used in cycle, start new cycle
      if (availableTasks.length === 0) {
        usedTaskIdsRef.current.clear();
        taskPoolIndexRef.current = 0;
        
        // Re-filter excluding blocked tasks
        availableTasks = allIndustryTasks.filter(t => !blockedOriginalIds.has(t.id));
        
        // If all 30 tasks are in incoming/active, wait
        if (availableTasks.length === 0) {
          return prev;
        }
      }

      // Get next task from pool
      const nextTask = availableTasks[taskPoolIndexRef.current % availableTasks.length];
      taskPoolIndexRef.current++;
      
      // Mark as used in this cycle
      usedTaskIdsRef.current.add(nextTask.id);

      // Create new instance with unique ID
      const newTask: Task = {
        ...nextTask,
        id: `${nextTask.id}-${Date.now()}`,
        originalId: nextTask.id,
        status: 'ingesting' as TaskStatus,
        timestamp: new Date(),
        sentAt: undefined,
        sentStatus: undefined
      };

      return [...prev, newTask];
    });
  }, [setTasks]);

  useEffect(() => {
    if (!enabled) return;

    // Progress tasks through pipeline every 1-2 seconds
    const progressInterval = setInterval(() => {
      progressTasks();
    }, 1000 + Math.random() * 1000);

    // Check for feedback/wait period every 2 seconds
    const feedbackInterval = setInterval(() => {
      simulateFeedback();
    }, 2000);

    // Inject new tasks periodically
    const injectInterval = setInterval(() => {
      injectNewTask();
    }, INJECT_INTERVAL_MS);

    return () => {
      clearInterval(progressInterval);
      clearInterval(feedbackInterval);
      clearInterval(injectInterval);
    };
  }, [enabled, progressTasks, simulateFeedback, injectNewTask]);

  return {};
}

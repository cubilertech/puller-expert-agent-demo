import { useEffect, useCallback } from 'react';
import { Task } from '@/types';
import { ghostTaskTemplates } from '@/data/demoData';

let taskCounter = 10;

export function useSimulation(
  enabled: boolean,
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) {
  const addGhostTask = useCallback(() => {
    const template = ghostTaskTemplates[Math.floor(Math.random() * ghostTaskTemplates.length)];
    const newTask: Task = {
      id: `ghost-${taskCounter++}`,
      title: template.title,
      requestor: template.requestor,
      status: 'pending',
      timestamp: new Date(),
      priority: template.priority,
      description: `Auto-generated task: ${template.title}`,
    };

    setTasks((prev) => [newTask, ...prev]);
  }, [setTasks]);

  useEffect(() => {
    if (!enabled) return;

    // Add a ghost task every 8-15 seconds
    const interval = setInterval(() => {
      addGhostTask();
    }, 8000 + Math.random() * 7000);

    return () => clearInterval(interval);
  }, [enabled, addGhostTask]);

  return { addGhostTask };
}

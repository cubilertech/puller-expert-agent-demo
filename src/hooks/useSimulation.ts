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
    const statuses = ['ingesting', 'planning', 'reasoning', 'validating'] as const;
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const sources = ['email', 'slack', 'meeting'] as const;
    const randomSource = template.source || sources[Math.floor(Math.random() * sources.length)];
    
    const newTask: Task = {
      id: `ghost-${taskCounter++}`,
      title: template.title,
      requestor: template.requestor,
      status: randomStatus,
      timestamp: new Date(),
      priority: template.priority,
      description: `Auto-generated task: ${template.title}`,
      source: randomSource,
      flags: template.flags || { urgency: Math.random() > 0.7, humanRequested: Math.random() > 0.8, vip: Math.random() > 0.9 },
      confidence: Math.floor(50 + Math.random() * 50),
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

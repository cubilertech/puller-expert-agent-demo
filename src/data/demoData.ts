import { Task, ChatMessage, CodeDiff, KnowledgeNode, SqlAnnotation, TaskData, CONFIDENCE_THRESHOLD, TaskStatus } from '@/types';
import { allIndustryTasks, allTaskData, getTasksForDemo } from './demoConfig';

// Re-export everything from demoConfig for backwards compatibility
export { allIndustryTasks, allTaskData, getTasksForDemo } from './demoConfig';
export type { SqlAnnotation } from '@/types';

// Helper to correct status based on confidence threshold
function correctTaskStatus(task: Task): Task {
  // If task is marked as 'review' but has high confidence, move it to 'sent'
  if (task.status === 'review' && (task.confidence ?? 0) >= CONFIDENCE_THRESHOLD) {
    return {
      ...task,
      status: 'sent' as TaskStatus,
      sentAt: new Date(Date.now() - 1000 * 60 * 2), // Sent 2 minutes ago
      sentStatus: 'pending'
    };
  }
  return task;
}

// Get initial tasks for the default demo mode (milk-run with 3 tasks plus some processing tasks)
export const initialTasks: Task[] = (() => {
  const demoTasks = getTasksForDemo('quick-demo')
    .map(correctTaskStatus)
    .map(t => ({ ...t, originalId: t.id })); // Add originalId
  
  const demoTaskIds = new Set(demoTasks.map(t => t.id));
  
  // Add additional tasks that aren't already in the demo set
  const additionalTasks = allIndustryTasks
    .filter(t => !demoTaskIds.has(t.id))
    .slice(0, 3)
    .map((task, idx) => ({
      ...task,
      originalId: task.id, // Add originalId
      status: (['building', 'planning', 'validating'] as const)[idx % 3]
    }));
  
  return [...demoTasks, ...additionalTasks];
})();

// Get task data for a specific task - now pulls from dynamic data
export function getTaskDataById(taskId: string): TaskData | null {
  return allTaskData[taskId] || null;
}

// Legacy exports for backward compatibility with existing code
export const chatMessages: ChatMessage[] = allTaskData['retail-1']?.messages || [];

export const originalCode: CodeDiff[] = allTaskData['retail-1']?.code || [];

export const originalCodeAnnotations: SqlAnnotation[] = allTaskData['retail-1']?.annotations || [];

// Knowledge nodes for the context graph
export const initialKnowledgeNodes: KnowledgeNode[] = [
  { id: 'node-1', label: 'fact_sales', type: 'entity', x: 150, y: 80, connections: ['node-2', 'node-3'] },
  { id: 'node-2', label: 'dim_store', type: 'entity', x: 80, y: 160, connections: ['node-1'] },
  { id: 'node-3', label: 'dim_date', type: 'entity', x: 220, y: 160, connections: ['node-1'] },
  { id: 'node-4', label: 'NULL → 0', type: 'rule', x: 150, y: 240, connections: ['node-1'] },
  { id: 'node-5', label: 'Order Value Formula', type: 'rule', x: 50, y: 240, connections: ['node-1'] },
  { id: 'node-6', label: 'Subscription Logic', type: 'entity', x: 250, y: 240, connections: [] },
];

// Ghost task templates removed - using expanded industry demo data instead

// Task-specific data mapping for backward compatibility
export const taskDataMap: Record<string, { messages: ChatMessage[], code: CodeDiff[], annotations: SqlAnnotation[], knowledgeUpdate: string }> = Object.fromEntries(
  Object.entries(allTaskData).map(([id, data]) => [
    id,
    {
      messages: data.messages,
      code: data.code,
      annotations: data.annotations,
      knowledgeUpdate: data.knowledgeUpdate
    }
  ])
);

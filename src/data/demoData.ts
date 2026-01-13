import { Task, ChatMessage, CodeDiff, KnowledgeNode, SqlAnnotation, TaskData } from '@/types';
import { allIndustryTasks, allTaskData, getTasksForDemo } from './demoConfig';

// Re-export everything from demoConfig for backwards compatibility
export { allIndustryTasks, allTaskData, getTasksForDemo } from './demoConfig';
export type { SqlAnnotation } from '@/types';

// Get initial tasks for the default demo mode (milk-run with 3 tasks plus some processing tasks)
export const initialTasks: Task[] = [
  // Include first task from each major industry for variety
  ...getTasksForDemo('quick-demo'),
  // Add a few more in different statuses
  ...allIndustryTasks.slice(3, 6).map((task, idx) => ({
    ...task,
    status: (['reasoning', 'planning', 'validating'] as const)[idx % 3]
  }))
];

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

export const ghostTaskTemplates = [
  { title: 'Customer LTV by Cohort', requestor: 'Finance', priority: 'high' as const, source: 'email' as const, flags: { urgency: true, humanRequested: false, vip: true } },
  { title: 'Subscription Churn Drivers', requestor: 'Retention Team', priority: 'high' as const, source: 'slack' as const, flags: { urgency: false, humanRequested: true, vip: false } },
  { title: 'Promo Code Effectiveness', requestor: 'Marketing', priority: 'medium' as const, source: 'email' as const, flags: { urgency: false, humanRequested: false, vip: false } },
  { title: 'Inventory Reorder Analysis', requestor: 'Supply Chain', priority: 'low' as const, source: 'meeting' as const, flags: { urgency: false, humanRequested: false, vip: false } },
  { title: 'Shipping Cost Optimization', requestor: 'Operations', priority: 'medium' as const, source: 'slack' as const, flags: { urgency: true, humanRequested: false, vip: false } },
];

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

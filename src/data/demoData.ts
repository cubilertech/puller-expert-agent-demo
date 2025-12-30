import { Task, ChatMessage, CodeDiff, KnowledgeNode } from '@/types';

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Monthly Revenue by Store',
    requestor: 'Analytics Team',
    status: 'review',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    priority: 'high',
    description: 'Which store has the highest monthly revenue across the dataset?',
  },
  {
    id: 'task-2',
    title: 'Customer Churn Analysis',
    requestor: 'Marketing Ops',
    status: 'pending',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    priority: 'medium',
    description: 'Identify customers at risk of churning based on activity patterns',
  },
  {
    id: 'task-3',
    title: 'Inventory Optimization',
    requestor: 'Supply Chain',
    status: 'pending',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    priority: 'low',
    description: 'Calculate optimal reorder points for top 100 SKUs',
  },
];

export const chatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'user',
    content: 'Which store has the highest monthly revenue across the dataset?',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    type: 'text',
  },
  {
    id: 'msg-2',
    sender: 'agent',
    content: 'Analyzing request... I\'ll need to join fact_sales with dim_date to aggregate revenue by store and month.',
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    type: 'reasoning',
  },
  {
    id: 'msg-3',
    sender: 'agent',
    content: 'Found relevant tables:\n• fact_sales (transaction_id, store_id, revenue, date_id)\n• dim_store (store_id, grouped_customer_store_name)\n• dim_date (date_id, month, year)',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    type: 'reasoning',
  },
  {
    id: 'msg-4',
    sender: 'agent',
    content: 'Generated SQL query. Ready for expert review.',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    type: 'action',
  },
];

export const originalCode: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    ds.grouped_customer_store_name AS store_name,' },
  { lineNumber: 3, type: 'unchanged', content: '    dd.month,' },
  { lineNumber: 4, type: 'unchanged', content: '    dd.year,' },
  { lineNumber: 5, type: 'removed', content: '    SUM(fs.revenue) AS total_revenue' },
  { lineNumber: 6, type: 'added', content: '    SUM(COALESCE(fs.revenue, 0)) AS total_revenue' },
  { lineNumber: 7, type: 'unchanged', content: 'FROM fact_sales fs' },
  { lineNumber: 8, type: 'unchanged', content: 'JOIN dim_store ds ON fs.store_id = ds.store_id' },
  { lineNumber: 9, type: 'unchanged', content: 'JOIN dim_date dd ON fs.date_id = dd.date_id' },
  { lineNumber: 10, type: 'unchanged', content: 'GROUP BY' },
  { lineNumber: 11, type: 'unchanged', content: '    ds.grouped_customer_store_name,' },
  { lineNumber: 12, type: 'unchanged', content: '    dd.month,' },
  { lineNumber: 13, type: 'unchanged', content: '    dd.year' },
  { lineNumber: 14, type: 'unchanged', content: 'ORDER BY total_revenue DESC' },
  { lineNumber: 15, type: 'unchanged', content: 'LIMIT 1;' },
];

export const initialKnowledgeNodes: KnowledgeNode[] = [
  { id: 'node-1', label: 'fact_sales', type: 'entity', x: 150, y: 80, connections: ['node-2', 'node-3'] },
  { id: 'node-2', label: 'dim_store', type: 'entity', x: 80, y: 160, connections: ['node-1'] },
  { id: 'node-3', label: 'dim_date', type: 'entity', x: 220, y: 160, connections: ['node-1'] },
  { id: 'node-4', label: 'JOIN Pattern', type: 'rule', x: 150, y: 240, connections: ['node-1', 'node-2', 'node-3'] },
];

export const ghostTaskTemplates = [
  { title: 'Sales Forecast Q2', requestor: 'Finance', priority: 'high' as const },
  { title: 'User Engagement Metrics', requestor: 'Product', priority: 'medium' as const },
  { title: 'Supplier Performance', requestor: 'Procurement', priority: 'low' as const },
  { title: 'Campaign ROI Analysis', requestor: 'Marketing', priority: 'high' as const },
  { title: 'Delivery Time Optimization', requestor: 'Logistics', priority: 'medium' as const },
];

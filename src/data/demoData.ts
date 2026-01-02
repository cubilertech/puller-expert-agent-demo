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
    source: 'email',
    flags: { urgency: false, humanRequested: false, vip: true },
    confidence: 68,
  },
  {
    id: 'task-2',
    title: '2025 Subscriber Conversion List',
    requestor: 'Growth Team',
    status: 'reasoning',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    priority: 'high',
    description: 'List of customers whose first purchase in 2025 was non-subscription, then became subscribers',
    source: 'slack',
    flags: { urgency: true, humanRequested: true, vip: false },
    confidence: 82,
  },
  {
    id: 'task-3',
    title: 'LG Products Performance Analysis',
    requestor: 'Product Strategy',
    status: 'planning',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    priority: 'medium',
    description: 'Understanding why LG Products and Super Gloss Radial line are underperforming for repeat customers',
    source: 'meeting',
    flags: { urgency: false, humanRequested: false, vip: false },
    confidence: 91,
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
    content: 'Analyzing request... I\'ll calculate revenue as the sum of all order values within a store by month.',
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    type: 'reasoning',
  },
  {
    id: 'msg-3',
    sender: 'agent',
    content: 'Assumptions made:\n• Order value = pre-tax price + tax - discounts\n• Result is the highest revenue month by a single store\n• Year and Month sourced from "dim_date"\n• Store-level revenue attributed to "grouped_customer_store_name"',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    type: 'reasoning',
  },
  {
    id: 'msg-4',
    sender: 'agent',
    content: 'Note: I ignored null fields (assumes all fields are non-null). Adjusted "all time" to "across the dataset" given data scope limitations.',
    timestamp: new Date(Date.now() - 1000 * 60 * 2.5),
    type: 'reasoning',
  },
  {
    id: 'msg-5',
    sender: 'agent',
    content: 'Generated SQL query and CSV result. Ready for expert review.',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    type: 'action',
  },
];

export const task2Messages: ChatMessage[] = [
  {
    id: 'msg-t2-1',
    sender: 'user',
    content: 'I\'d love if you could provide me with a specific list of customers. For the year 2025, we want to see everyone whose first purchase was a non-subscription purchase greater than $0, and who then became subscribers to us after that. Can you provide that?',
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    type: 'text',
  },
  {
    id: 'msg-t2-2',
    sender: 'agent',
    content: 'Processing request for 2025 customer conversion analysis...',
    timestamp: new Date(Date.now() - 1000 * 60 * 19),
    type: 'reasoning',
  },
  {
    id: 'msg-t2-3',
    sender: 'agent',
    content: 'Assumptions made:\n• Purchase price > $0 means (total order price - discount) > 0\n• Only considered first order type of "One Off" (ignoring B2B, wholesale, trial, samples)\n• Included exhaustive detail per customer for specificity',
    timestamp: new Date(Date.now() - 1000 * 60 * 18),
    type: 'reasoning',
  },
  {
    id: 'msg-t2-4',
    sender: 'agent',
    content: 'CSV file attached with customer list. Ready for expert review.',
    timestamp: new Date(Date.now() - 1000 * 60 * 17),
    type: 'action',
  },
];

export const task3Messages: ChatMessage[] = [
  {
    id: 'msg-t3-1',
    sender: 'user',
    content: 'Our most recent LG Products (as well as our Super Gloss Radial line) are underperforming/lagging for our repeat customers. I\'m trying to understand if we potentially pulled forward any sales/orders from repeat customers during our 4th of July sale.',
    timestamp: new Date(Date.now() - 1000 * 60 * 50),
    type: 'text',
  },
  {
    id: 'msg-t3-2',
    sender: 'user',
    content: 'Ask is:\n• Dive into repeat customers who purchased during 4th of July (% of 2x and 3x+) and their frequency\n• Makeup of repeat/new for Super Gloss LG products this year\n• Did 4th of July pull customers forward to repeat purchase more quickly than typical (cohort level)\n• Any other metrics that may help explain why LG products are lagging',
    timestamp: new Date(Date.now() - 1000 * 60 * 49),
    type: 'text',
  },
  {
    id: 'msg-t3-3',
    sender: 'agent',
    content: 'Complex multi-part analysis detected. Breaking down into components...',
    timestamp: new Date(Date.now() - 1000 * 60 * 48),
    type: 'reasoning',
  },
  {
    id: 'msg-t3-4',
    sender: 'agent',
    content: 'Assumptions:\n• July 4th sale = exactly July 4th date\n• Repeat customer = 2+ lifetime purchases (all products)\n• Cohort = first min order month (all products)\n• Median days = typical repeat purchase gap\n• "Pull-forward" = July 4th customers who repurchased sooner than cohort median',
    timestamp: new Date(Date.now() - 1000 * 60 * 47),
    type: 'reasoning',
  },
  {
    id: 'msg-t3-5',
    sender: 'agent',
    content: 'Additional metrics included:\n• "Days to 50% of units" (LG Products) as drop performance measure\n• Cannibalization analysis between consecutive releases\n• Note: Revenue/GMV not explicitly included (just orders)\n• Attribution assumes July 4th sale as main driver',
    timestamp: new Date(Date.now() - 1000 * 60 * 46),
    type: 'reasoning',
  },
  {
    id: 'msg-t3-6',
    sender: 'agent',
    content: 'Analysis complete with SQL and results. Flagged for expert review given complexity.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    type: 'action',
  },
];

export const originalCode: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    ds.grouped_customer_store_name AS store_name,' },
  { lineNumber: 3, type: 'unchanged', content: '    dd.month,' },
  { lineNumber: 4, type: 'unchanged', content: '    dd.year,' },
  { lineNumber: 5, type: 'removed', content: '    SUM(fs.pre_tax_price + fs.tax - fs.discount) AS total_revenue' },
  { lineNumber: 6, type: 'added', content: '    SUM(COALESCE(fs.pre_tax_price, 0) + COALESCE(fs.tax, 0) - COALESCE(fs.discount, 0)) AS total_revenue' },
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

export const task2Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'WITH first_purchases AS (' },
  { lineNumber: 2, type: 'unchanged', content: '    SELECT customer_id, MIN(order_date) as first_order_date, order_type' },
  { lineNumber: 3, type: 'unchanged', content: '    FROM orders' },
  { lineNumber: 4, type: 'unchanged', content: '    WHERE YEAR(order_date) = 2025' },
  { lineNumber: 5, type: 'unchanged', content: '      AND order_type = \'One Off\'' },
  { lineNumber: 6, type: 'removed', content: '      AND (total_price - discount) > 0' },
  { lineNumber: 7, type: 'added', content: '      AND (COALESCE(total_price, 0) - COALESCE(discount, 0)) > 0' },
  { lineNumber: 8, type: 'unchanged', content: '    GROUP BY customer_id' },
  { lineNumber: 9, type: 'unchanged', content: ')' },
  { lineNumber: 10, type: 'unchanged', content: 'SELECT c.customer_id, c.email, c.name,' },
  { lineNumber: 11, type: 'removed', content: '       fp.first_order_date, s.subscription_start_date' },
  { lineNumber: 12, type: 'added', content: '       fp.first_order_date, s.subscription_start_date -- Simplified per user preference' },
  { lineNumber: 13, type: 'unchanged', content: 'FROM customers c' },
  { lineNumber: 14, type: 'unchanged', content: 'JOIN first_purchases fp ON c.customer_id = fp.customer_id' },
  { lineNumber: 15, type: 'unchanged', content: 'JOIN subscriptions s ON c.customer_id = s.customer_id' },
  { lineNumber: 16, type: 'unchanged', content: 'WHERE s.subscription_start_date > fp.first_order_date;' },
];

export const task3Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: '-- July 4th Repeat Customer Pull-Forward Analysis' },
  { lineNumber: 2, type: 'unchanged', content: 'WITH cohort_medians AS (' },
  { lineNumber: 3, type: 'unchanged', content: '    SELECT cohort_month,' },
  { lineNumber: 4, type: 'unchanged', content: '           PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY days_to_repeat) as median_days' },
  { lineNumber: 5, type: 'unchanged', content: '    FROM customer_cohorts' },
  { lineNumber: 6, type: 'unchanged', content: '    GROUP BY cohort_month' },
  { lineNumber: 7, type: 'unchanged', content: '),' },
  { lineNumber: 8, type: 'unchanged', content: 'july4_customers AS (' },
  { lineNumber: 9, type: 'unchanged', content: '    SELECT customer_id, purchase_count,' },
  { lineNumber: 10, type: 'removed', content: '           days_since_last_purchase' },
  { lineNumber: 11, type: 'added', content: '           days_since_last_purchase,' },
  { lineNumber: 12, type: 'added', content: '           CASE WHEN days_since_last_purchase < cm.median_days THEN 1 ELSE 0 END as pulled_forward' },
  { lineNumber: 13, type: 'unchanged', content: '    FROM orders o' },
  { lineNumber: 14, type: 'added', content: '    JOIN cohort_medians cm ON o.cohort_month = cm.cohort_month' },
  { lineNumber: 15, type: 'unchanged', content: '    WHERE order_date = \'2024-07-04\'' },
  { lineNumber: 16, type: 'unchanged', content: '      AND purchase_count >= 2  -- Repeat customers only' },
  { lineNumber: 17, type: 'unchanged', content: ')' },
  { lineNumber: 18, type: 'unchanged', content: 'SELECT * FROM july4_customers;' },
];

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

// Task-specific data mapping
export const taskDataMap: Record<string, { messages: ChatMessage[], code: CodeDiff[], knowledgeUpdate: string }> = {
  'task-1': {
    messages: chatMessages,
    code: originalCode,
    knowledgeUpdate: 'REVENUE_NULL_BEHAVIOR = ZERO (Universal fact for technical users)',
  },
  'task-2': {
    messages: task2Messages,
    code: task2Code,
    knowledgeUpdate: 'USER_PREFERENCE: Return specific answer only, no additional metadata unless requested',
  },
  'task-3': {
    messages: task3Messages,
    code: task3Code,
    knowledgeUpdate: 'DEFINITIONS_STRENGTHENED: Pull-forward, cohort median, repeat customer criteria',
  },
};
